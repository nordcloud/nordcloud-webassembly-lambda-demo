# Grain to WebAssembly compilation

This target uses Docker to compile Grain into WebAssembly.

Docker image: https://hub.docker.com/r/grainlang/grain

The Docker image provides a ready-to-use grain command that can compile .gr files into .wasm:

    grain compile demo-grain.gr -o demo-grain.wasm
