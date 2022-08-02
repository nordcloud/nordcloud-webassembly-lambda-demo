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

    new LogGroup(this, `webassembly-demo-log`, {
      logGroupName: `/aws/lambda/${this.stackName}-webassembly-demo`,
      retention: RetentionDays.ONE_YEAR,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const demoFunction = new WebAssemblyFunction(this, 'webassembly-demo', {
      functionName: `${props.stackName}-webassembly-demo`,
      wasmPath: join(__dirname, '..', 'wasm', 'demo.wasm'),
    })

    const restApi = new RestApi(this, 'webassembly-demo-api', {
      restApiName: `nordcloud-webassembly-demo-api-${props.stage}`,
      deployOptions: {
        stageName: props.stage,
      },
    })

    restApi.root.addMethod('GET', new LambdaIntegration(demoFunction.function))
  }
}
