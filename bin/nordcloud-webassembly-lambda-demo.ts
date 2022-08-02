#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { NordcloudWebassemblyLambdaDemoStack } from '../lib/stack'

const app = new cdk.App()
new NordcloudWebassemblyLambdaDemoStack(app, 'nordcloud-webassembly-demo-dev', {
  stage: 'dev',
  stackName: 'nordcloud-webassembly-demo-dev',
  demoTableName: 'nordcloud-webassembly-demo-dev',
})
