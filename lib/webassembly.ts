import { Construct } from 'constructs'
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { Duration } from 'aws-cdk-lib'

interface WebAssemblyFunctionProps extends NodejsFunctionProps {
  wasmPath: string
}

export class WebAssemblyFunction extends Construct {
  function: NodejsFunction

  constructor(scope: Construct, id: string, props: WebAssemblyFunctionProps) {
    super(scope, id)

    const functionProps: NodejsFunctionProps = {
      functionName: id,
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(30),
      memorySize: 1536,
      bundling: {
        sourceMap: true,
        commandHooks: {
          afterBundling(_inputDir: string, outputDir: string): string[]{
            return [`cp ${props.wasmPath} ${outputDir}/main.wasm`]
         },
         beforeBundling(_inputDir: string, _outputDir: string): string[] {
          return []
         },
         beforeInstall(_inputDir: string, _outputDir: string): string[] {
          return []
         },
        },
      },
      ...props,
      environment: {
        NODE_OPTIONS: '--experimental-wasi-unstable-preview1',
        ...props.environment || {},
      },
    }

    this.function = new NodejsFunction(this, 'function', functionProps)
  }
}
