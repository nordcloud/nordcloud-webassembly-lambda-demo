import { Construct } from 'constructs'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { CloudFrontAllowedCachedMethods, CloudFrontAllowedMethods, CloudFrontWebDistribution, OriginProtocolPolicy, SSLMethod, ViewerCertificate, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront'
import { Duration, RemovalPolicy, Fn, Aws } from 'aws-cdk-lib'
import { CnameRecord, HostedZone } from 'aws-cdk-lib/aws-route53'
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment'
import * as path from 'path'

interface WebsiteProps {
  uiDomain: string
  baseDomain: string
  uiBucketName: string
  hostedZoneId: string
  certificateArn: string
}

export class Website extends Construct {
  constructor(scope: Construct, id: string, props: WebsiteProps) {
    super(scope, id)

    const uiBucket = new Bucket(this, 'website-bucket', {
      bucketName: props.uiBucketName,
      removalPolicy: RemovalPolicy.DESTROY,
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    })

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'hostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.baseDomain,
    })

    const certificate = Certificate.fromCertificateArn(this, 'certificate', props.certificateArn)

    const distribution = new CloudFrontWebDistribution(this, 'website-distribution', {
      enableIpV6: true,
      comment: 'Nordcloud WebAssembly Lambda Demo UI',
      defaultRootObject: '',
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: [props.uiDomain],
        sslMethod: SSLMethod.SNI,
      }),
      originConfigs: [{
        customOriginSource: {
          domainName: `${uiBucket.bucketName}.s3-website.${Aws.REGION}.amazonaws.com`,
          originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
        },
        behaviors: [{
          isDefaultBehavior: true,
          allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
          cachedMethods: CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
          defaultTtl: Duration.seconds(60),
          maxTtl: Duration.seconds(60),
          minTtl: Duration.seconds(60),
          compress: true,
          forwardedValues: {
            headers: ['Origin'],
            queryString: false,
          },
        }],
      }],
      errorConfigurations: [{
        errorCode: 404,
        errorCachingMinTtl: 60,
      }],
    })

    new CnameRecord(this, 'ui-cname', {
      zone: hostedZone,
      recordName: props.uiDomain,
      domainName: distribution.distributionDomainName,
    })

    new BucketDeployment(this, 'ui-deployment', {
      sources: [Source.asset(path.join(__dirname, '..', 'ui', 'out'))],
      destinationBucket: uiBucket,
    })
  }
}
