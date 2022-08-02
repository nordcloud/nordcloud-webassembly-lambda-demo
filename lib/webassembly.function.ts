import { readFileSync} from 'fs'
import { join } from 'path'
import { WASI } from 'wasi'

async function runWasm(): Promise<any> {
  const wasmPath = join(__dirname, 'main.wasm')
  const wasmContent = readFileSync(wasmPath)
  const wasmLength = wasmContent.length

  const wasi = new WASI({
    args: [],
    env: {},
    preopens: {
    },
  })

  const importObject = { wasi_snapshot_preview1: wasi.wasiImport }

  const wasm = await WebAssembly.compile(wasmContent)
  const instance = await WebAssembly.instantiate(wasm, importObject)
  wasi.start(instance)
}

export async function handler(_event: any) {
  try {
    await runWasm()
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        errorMessage: err.message,
      }),
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      msg: 'hello',
    }),
  }
}
