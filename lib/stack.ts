import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { AttributeType, BillingMode, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb'
import { LambdaIntegration, RestApi, DomainName, BasePathMapping, EndpointType } from 'aws-cdk-lib/aws-apigateway'
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs'
import { WebAssemblyFunction } from './webassembly'
import { join } from 'path'
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager'
import { HostedZone, CnameRecord } from 'aws-cdk-lib/aws-route53'

interface NordcloudWebassemblyLambdaDemoStackProps extends StackProps {
  stage: string
  stackName: string
  demoTableName: string
  apiDomain: string
  baseDomain: string
  uiDomain: string
  hostedZoneId: string
}

export class NordcloudWebassemblyLambdaDemoStack extends Stack {
  constructor(scope: Construct, id: string, props: NordcloudWebassemblyLambdaDemoStackProps) {
    super(scope, id, props)

    // XXX TODO: Access the table from WebAssembly apps
    new Table(this, 'webassembly-demo-table', {
      tableName: props.demoTableName,
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.DEFAULT,
    })

    new LogGroup(this, `webassembly-demo-c-log`, {
      logGroupName: `/aws/lambda/${this.stackName}-webassembly-demo-c`,
      retention: RetentionDays.ONE_YEAR,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const demoCFunction = new WebAssemblyFunction(this, 'webassembly-demo-c', {
      functionName: `${props.stackName}-webassembly-demo-c`,
      wasmPath: join(__dirname, '..', 'wasm', 'demo-c.wasm'),
    })

    new LogGroup(this, `webassembly-demo-cpp-log`, {
      logGroupName: `/aws/lambda/${this.stackName}-webassembly-demo-cpp`,
      retention: RetentionDays.ONE_YEAR,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const demoCppFunction = new WebAssemblyFunction(this, 'webassembly-demo-cpp', {
      functionName: `${props.stackName}-webassembly-demo-cpp`,
      wasmPath: join(__dirname, '..', 'wasm', 'demo-cpp.wasm'),
    })

    new LogGroup(this, `webassembly-demo-as-log`, {
      logGroupName: `/aws/lambda/${this.stackName}-webassembly-demo-as`,
      retention: RetentionDays.ONE_YEAR,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const demoAsFunction = new WebAssemblyFunction(this, 'webassembly-demo-as', {
      functionName: `${props.stackName}-webassembly-demo-as`,
      wasmPath: join(__dirname, '..', 'wasm', 'demo-as.wasm'),
    })

    const restApi = new RestApi(this, 'webassembly-demo-api', {
      restApiName: `nordcloud-webassembly-demo-api-${props.stage}`,
      deployOptions: {
        stageName: props.stage,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowCredentials: false,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token', 'X-Amz-User-Agent'],
        allowMethods: ['OPTIONS', 'GET', 'PUT', 'POST', 'DELETE'],
      },
    })

    restApi.root.addResource('c').addMethod('GET', new LambdaIntegration(demoCFunction.function))
    restApi.root.addResource('cpp').addMethod('GET', new LambdaIntegration(demoCppFunction.function))
    restApi.root.addResource('as').addMethod('GET', new LambdaIntegration(demoAsFunction.function))

    // Certificate and DNS name for API
    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'hostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.baseDomain,
    })

    const certificate = new Certificate(this, 'api-certificate', {
      domainName: props.apiDomain,
      validation: CertificateValidation.fromDns(hostedZone),
    })

    const domainName = new DomainName(this, 'api-domain', {
      domainName: props.apiDomain,
      certificate: certificate,
      endpointType: EndpointType.REGIONAL,
    })

    new BasePathMapping(this, 'api-base-path-mapping', {
      basePath: '',
      restApi: restApi,
      domainName: domainName,
      stage: restApi.deploymentStage,
    })

    new CnameRecord(this, 'api-cname', {
      zone: hostedZone,
      recordName: props.apiDomain,
      domainName: domainName.domainNameAliasDomainName,
    })
  }
}
