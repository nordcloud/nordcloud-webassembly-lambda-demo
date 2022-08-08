#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { NordcloudWebassemblyLambdaDemoStack } from '../lib/stack'
import { NordcloudWebassemblyLambdaDemoUSStack } from '../lib/stack-us'
import { Aws, Fn } from 'aws-cdk-lib'

const app = new cdk.App()

const config = {
  dev: {
    stage: 'dev',
    demoTableName: 'nordcloud-webassembly-demo-dev',
    baseDomain: 'nordclouddemo.com',
    apiDomain: 'wasm-api.nordclouddemo.com',
    uiDomain: 'wasm.nordclouddemo.com',
    uiBucketName: 'nordcloud-webassembly-demo-dev',
    hostedZoneId: 'ZR9GFGXVYE33W',
    certificateExportName: 'nordcloud-webassembly-demo-dev-ui-certificate-arn',
    certificateArn: Fn.join('', ['arn:aws:acm:us-east-1:', Aws.ACCOUNT_ID, ':certificate/3454d84d-e9bd-4961-9bc5-13ef0a2648e0']), // copy from us-east-1 stack output
  }
}

new NordcloudWebassemblyLambdaDemoStack(app, 'nordcloud-webassembly-demo-dev', {
  ...config.dev,
  stackName: 'nordcloud-webassembly-demo-dev',
})

new NordcloudWebassemblyLambdaDemoUSStack(app, 'nordcloud-webassembly-demo-us-dev', {
  ...config.dev,
  stackName: 'nordcloud-webassembly-demo-us-dev',
  env: {
    region: 'us-east-1',
  },
})
