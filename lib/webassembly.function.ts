import { join } from 'path'
import { openSync, closeSync, readFileSync } from 'fs'
// @ts-ignore
import { WASI } from 'wasi'

async function runWasm(): Promise<Buffer> {
  const wasmPath = join(__dirname, 'main.wasm')
  const wasmContent = readFileSync(wasmPath)
  // const wasmLength = wasmContent.length

  // Capture output to a temporary file
  const tempFileName = `/tmp/output-${process.env.AWS_LAMBDA_LOG_STREAM_NAME?.replace(/[^a-z0-9]/g, '')}.txt`
  const tempFileFd = openSync(tempFileName, 'w+', 0o666)

  const wasi = new WASI({
    args: [],
    env: {},
    preopens: {
    },
    returnOnExit: true,
    stdout: tempFileFd,
  })

  const importObject = { wasi_snapshot_preview1: wasi.wasiImport }

  // @ts-ignore
  const wasm = await WebAssembly.compile(wasmContent)
  // @ts-ignore
  const instance = await WebAssembly.instantiate(wasm, importObject)
  const exitCode = wasi.start(instance)
  console.log('WebAssembly exit code:', exitCode)
  closeSync(tempFileFd)
  const output = readFileSync(tempFileName)
  console.log('WebAssembly output:', output)
  return output
}

export async function handler(_event: any) {
  try {
    const output = await runWasm()
    const response = JSON.parse(output.toString('utf8'))
    if (!response.headers) {
      response.headers = {}
    }
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        errorMessage: err.message,
      }),
    }
  }
}
