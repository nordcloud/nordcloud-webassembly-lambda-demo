import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager'
import { HostedZone } from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'

interface NordcloudWebassemblyLambdaDemoStackUSProps extends StackProps {
  stage: string
  stackName: string
  uiDomain: string
  hostedZoneId: string
  baseDomain: string
  certificateExportName: string
}

export class NordcloudWebassemblyLambdaDemoUSStack extends Stack {
  constructor(scope: Construct, id: string, props: NordcloudWebassemblyLambdaDemoStackUSProps) {
    super(scope, id, props)

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'hostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.baseDomain,
    })

    // Create certificate in the us-east-1 regionf or CloudFront
    const certificate = new Certificate(this, 'ui-certificate', {
      domainName: props.uiDomain,
      validation: CertificateValidation.fromDns(hostedZone),
    })

    new CfnOutput(this, 'ui-certificate-arn', {
      value: certificate.certificateArn,
      exportName: props.certificateExportName,
    })
  }
}
