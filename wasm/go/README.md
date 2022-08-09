# Go to WebAssembly compilation

This target uses TinyGo to compile Go into WebAssembly.

Instructions for TinyGo with Docker: https://tinygo.org/getting-started/install/using-docker/

Note: You need to use -target wasi to generate a WASI compatible WebAssembly target.

Note: TinyGo doesn't support reflection for WebAssembly, so JSON marshalling doesn't work.
