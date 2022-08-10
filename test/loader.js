const fs = require('fs')
const wasiMod = require('wasi')

async function main() {
  const wasmPath = process.argv[2]
  const wasmContent = fs.readFileSync(wasmPath)
  const wasmLength = wasmContent.length
  console.log('Executing WASM file at', wasmPath, 'with', wasmLength, 'bytes')

  const wasi = new wasiMod.WASI({
    args: [],
    env: {},
    preopens: {},
    returnOnExit: true,
  })

  const wasm = await WebAssembly.compile(wasmContent)
  const instance = await WebAssembly.instantiate(wasm, {
    wasi_snapshot_preview1: wasi.wasiImport,
  })
  const exitCode = wasi.start(instance)
  console.log('WebAssembly exit code:', exitCode)
}

main().then(console.log).catch(console.error)
