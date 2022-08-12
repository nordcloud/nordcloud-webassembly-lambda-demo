import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { toast } from 'react-toastify'

async function apiFetch(method: string, url: string) {
  const response = await fetch(url, { method: method })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }
  return response.json()
}

interface WebAssemblyLanguage {
  name: string
}

// Languages that can produce WebAssembly/WASI binaries
const WEBASSEMBLY_LANGUAGES: { [key: string]: WebAssemblyLanguage } = {
  as:       { name: 'AssemblyScript', },
  c:        { name: 'C', },
  cpp:      { name: 'C++', },
  dotnet:   { name: 'C#/.NET', },
  go:       { name: 'Go', },
  grain:    { name: 'Grain', },
  // haskell:  { name: 'Haskell', }, // WASI support does not work yet
  // motoko:   { name: 'Motoko', }, // WASI support does not work yet
  // python:   { name: 'Python', },
  // ruby:     { name: 'Ruby', },
  rust:     { name: 'Rust', },
  swift:    { name: 'Swift', },
  zig:      { name: 'Zig', },
}
const LANGUAGES = Object.keys(WEBASSEMBLY_LANGUAGES)

const Home: NextPage = () => {
  const [lambdaOutputs, setLambdaOutputs] = useState<{[language: string]: any}>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    try {
      setLoading(true)
      const results: { [language: string]: any } = {}
      await Promise.all(LANGUAGES.map(async (language: string) => {
        try {
          const result = await apiFetch('GET', `https://wasm-api.nordclouddemo.com/wasm/${language}`)
          results[language] = result
          setLambdaOutputs(results)
        } catch (err: any) {
          results[language] = { errorMessage: err.message }
          setLambdaOutputs(results)
        }
      }))
    } catch (err: any) {
      toast(err.message)
    }
    setLoading(false)
  }

  async function handleRefresh(event: any) {
    if (event.preventDefault) event.preventDefault()
    refresh()
  }

  return (
    <>
      <Head>
        <title>WebAssembly Lambda Demo by Nordcloud</title>
        <meta name="description" content="Execute WebAssembly in AWS Lambda without a custom runtime." />
        <meta name="keywords" content="webassembly,aws,lambda,assemblyscript,c,c++" />
        <meta property="og:title" content="WebAssembly Lambda Demo by Nordcloud" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/lambdabg.png" />
        <meta property="og:description" content="Execute WebAssembly in AWS Lambda without a custom runtime." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <div className="mt-5">
          <div className="text-center">
            <h1 className="mt-3"><img style={{ marginTop: -4 }} width="44" src="/webassembly.png"/> WebAssembly Lambda Demo</h1>
            <div className="mt-3">
              <p>This demo executes <a href="https://webassembly.org" target="_blank" rel="noreferrer">WebAssembly</a> in <a href="https://aws.amazon.com/lambda/" target="_blank" rel="noreferrer">AWS Lambda</a> without a custom runtime.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8">
              <div className="mt-1">
                <div className="mb-3 text-center">
                  <button disabled={loading} className="btn btn-outline-secondary" onClick={handleRefresh}><span className={loading ? "fa fa-spinner fa-spin" : "fa fa-sync-alt"}></span> Reload</button>
                </div>

                {!Object.keys(lambdaOutputs).length ?
                <div className="alert alert-secondary"><span className="fa fa-spinner fa-spin"></span> Loading...</div>
                :
                <ul className="list-group">
                  {LANGUAGES.map((language: string) => {
                    return (
                      <li key={language} className="list-group-item">
                        <div className="row">
                          <div className="col-lg-3 fw-bold"><img className="me-2" width="38" src="/lambda.png"/> <a href={`https://github.com/nordcloud/nordcloud-webassembly-lambda-demo/blob/master/wasm/${language}/`} target="_blank" rel="noreferrer">{WEBASSEMBLY_LANGUAGES[language].name}</a></div>
                          <div className="col-lg-9"><pre className="mb-0 pt-2 pb-2 ps-2">{JSON.stringify(lambdaOutputs[language])}</pre></div>
                        </div>
                      </li>
                    )})}
                </ul>}
              </div>
            </div>
            <div className="col-lg-2"></div>
          </div>

          <div className="mt-5 mb-5 text-center">
            <h3>How does it work?</h3>
            <div>We use built-in WebAssembly and WASI support in Node.js to execute .wasm files built using various programming languages.</div>
            <div>Each WebAssembly application prints JSON to stdout and the output is returned from the Lambda function.</div>
            <div className="mt-1">
              <a href="https://github.com/nordcloud/nordcloud-webassembly-lambda-demo" target="_blank" rel="noreferrer"><span className="fa-brands fa-github"></span></a>
              {' '}
              <a href="https://github.com/nordcloud/nordcloud-webassembly-lambda-demo" target="_blank" rel="noreferrer">Source on GitHub</a>
            </div>
          </div>

          <div className="mt-5 mb-5 text-center">
            <h3>Excluded languages</h3>
            <div>Some languages currently (2022) have no simple way to compile a hello world application into a standalone WASI-compatible .wasm file.</div>
            <div>These languages include at least Haskell, Motoko, Python, Ruby and Swift.</div>
          </div>

        </div>
      </div>
      <footer className="mt-auto text-center pt-3 mb-3 border-top">
          Demo by <a href="https://twitter.com/kennu" target="_blank" rel="noreferrer">Kenneth Falck</a> <a className="ms-1" href="https://nordcloud.com" target="_blank" rel="noreferrer"><img alt="Nordcloud, an IBM Company" width="120" src="/nordcloud-ibm-logo.svg"/></a>
      </footer>
    </>
  )
}

export default Home
