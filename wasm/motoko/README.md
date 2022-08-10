# Motoko to WebAssembly compilation

This target uses Nix/moc to compile Motoko into WebAssembly.

Instructions for Nix/moc: https://github.com/dfinity/motoko/blob/master/Building.md

Note that the base library is not included so we use debugPrint directly.

XXX TODO Currently Motoko does not produce fully WASI-compatible .wasm files: https://forum.dfinity.org/t/compile-motoko-to-wasm/1183
