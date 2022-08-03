import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { AttributeType, BillingMode, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb'
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs'
import { WebAssemblyFunction } from './webassembly'
import { join } from 'path'

interface NordcloudWebassemblyLambdaDemoStackProps extends StackProps {
  stage: string
  stackName: string
  demoTableName: string
}

export class NordcloudWebassemblyLambdaDemoStack extends Stack {
  constructor(scope: Construct, id: string, props: NordcloudWebassemblyLambdaDemoStackProps) {
    super(scope, id, props)

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
    })

    restApi.root.addResource('c').addMethod('GET', new LambdaIntegration(demoCFunction.function))
    restApi.root.addResource('as').addMethod('GET', new LambdaIntegration(demoAsFunction.function))
  }
}
