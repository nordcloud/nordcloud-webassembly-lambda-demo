import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { AttributeType, BillingMode, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb'
import { LambdaIntegration, RestApi, DomainName, BasePathMapping, EndpointType } from 'aws-cdk-lib/aws-apigateway'
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs'
import { WebAssemblyFunction } from './webassembly'
import { join } from 'path'
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager'
import { HostedZone, CnameRecord } from 'aws-cdk-lib/aws-route53'
import { Website } from './website'

interface WebAssemblyLanguage {
  name: string
  props?: any
}

const WEBASSEMBLY_LANGUAGES: { [key: string]: WebAssemblyLanguage } = {
  as:       { name: 'AssemblyScript' },
  c:        { name: 'C', },
  cpp:      { name: 'C++', },
  python:   { name: 'Python', },
  dotnet:   { name: 'C#/.NET', props: { timeout: Duration.seconds(300), memorySize: 10240, } }, // .NET needs more memory/CPU/time
  ruby:     { name: 'Ruby', },
  swift:    { name: 'Swift', },
  go:       { name: 'Go', },
  rust:     { name: 'Rust', },
  grain:    { name: 'Grain', },
  motoko:   { name: 'Motoko', },
  haskell:  { name: 'Haskell', },
  zig:      { name: 'Zig', },
}

interface NordcloudWebassemblyLambdaDemoStackProps extends StackProps {
  stage: string
  stackName: string
  apiDomain: string
  baseDomain: string
  uiDomain: string
  uiBucketName: string
  hostedZoneId: string
  certificateExportName: string
  certificateArn: string
}

export class NordcloudWebassemblyLambdaDemoStack extends Stack {
  constructor(scope: Construct, id: string, props: NordcloudWebassemblyLambdaDemoStackProps) {
    super(scope, id, props)

    // Create Lambda functions for all source languages

    const demoFunctions: { [language: string]: WebAssemblyFunction } = {}

    for (const language of Object.keys(WEBASSEMBLY_LANGUAGES)) {
      new LogGroup(this, `webassembly-demo-${language}-log`, {
        logGroupName: `/aws/lambda/${this.stackName}-webassembly-demo-${language}`,
        retention: RetentionDays.ONE_YEAR,
        removalPolicy: RemovalPolicy.DESTROY,
      })

      const demoFunction = new WebAssemblyFunction(this, `webassembly-demo-${language}`, {
        functionName: `${props.stackName}-webassembly-demo-${language}`,
        wasmPath: join(__dirname, '..', 'wasm', language, `demo-${language}.wasm`),
        ...WEBASSEMBLY_LANGUAGES[language].props,
      })

      demoFunctions[language] = demoFunction
    }

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

    // Add API endpoints for all demo functions as wasm/as, wasm/c etc.
    const wasmApi = restApi.root.addResource('wasm')
    for (const language of Object.keys(demoFunctions)) {
      wasmApi.addResource(language).addMethod('GET', new LambdaIntegration(demoFunctions[language].function))
    }

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

    new Website(this, 'website', props)
  }
}
