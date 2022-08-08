# Nordcloud WebAssembly Lambda Demo
Kenneth Falck <kennu@nordcloud.com> 2022

## Overview

This demo deploys Lambda functions that execute WebAssembly code using Node.js - [source](https://github.com/nordcloud/nordcloud-webassembly-lambda-demo/blob/master/lib/webassembly.function.ts).

The WebAssembly applications are built using a few different tools:

* AssemblyScript: Compile .ts into .wasm - [source](https://github.com/nordcloud/nordcloud-webassembly-lambda-demo/blob/master/wasm/demo-as.ts)
* C and WASI SDK: Compile .c into .wasm - [source](https://github.com/nordcloud/nordcloud-webassembly-lambda-demo/blob/master/wasm/demo-c.c)
* C++ and WASI SDK: Compile .cpp into .wasm [source](https://github.com/nordcloud/nordcloud-webassembly-lambda-demo/blob/master/wasm/demo-cpp.cpp)

The demo also includes a simple UI to show the output of the Lambda functions - [source](https://github.com/nordcloud/nordcloud-webassembly-lambda-demo/tree/master/ui).

## Prerequisites

To deploy this app, you need:

* Node.js 16.x or later

To build the WebAssembly applications, you need:

* clang (e.g. apt install clang)
* [wasi-sdk-16.0](https://github.com/WebAssembly/wasi-sdk) installed in $HOME

Pre-built .wasm files are also included in the project in the wasm subdirectory.

## Installation

To install dependencies, run:

    npm install

## Building

To build the WebAssembly applications, run:

    npm run build

To build the web UI, run:

    npm run build:ui

## Deployment

To deploy the project using AWS CDK, run:

    npm run deploy:dev
