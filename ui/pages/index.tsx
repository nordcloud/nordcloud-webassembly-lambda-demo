import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.min.css'
import { toast } from 'react-toastify'

async function apiFetch(method: string, url: string) {
  const response = await fetch(url, { method: method })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }
  return response.json()
}

const Home: NextPage = () => {
  const [output1, setOutput1] = useState<any>(undefined)
  const [output2, setOutput2] = useState<any>(undefined)
  const [output3, setOutput3] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    try {
      setLoading(true)
      const results = await Promise.all([
        apiFetch('GET', 'https://wasm-api.nordclouddemo.com/as'),
        apiFetch('GET', 'https://wasm-api.nordclouddemo.com/c'),
        apiFetch('GET', 'https://wasm-api.nordclouddemo.com/cpp'),
      ])
      setOutput1(results[0])
      setOutput2(results[1])
      setOutput3(results[2])
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
        <meta name="description" content="Demo of running WebAssembly in AWS Lambda" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <div className="mt-5">
          <div className="text-center">
          <h1>WebAssembly Lambda Demo</h1>
            <div className="mt-3">
              <p>This demo executes WebAssembly in AWS Lambda without a custom runtime.</p>
              <p>We use Node.js built-in WebAssembly support to load and execute WebAssembly binaries built using various programming languages.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3"></div>
            <div className="col-lg-6">
              <div className="mt-1">
                <div className="mb-3 text-center">
                  <button disabled={loading} className="btn btn-outline-secondary" onClick={handleRefresh}>Reload</button>
                </div>

                {loading ?
                <div className="alert alert-secondary">Loading...</div>
                :
                <ul className="list-group">
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col-lg-3 fw-bold">Lambda 1</div>
                      <div className="col-lg-9">{JSON.stringify(output1)}</div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col-lg-3 fw-bold">Lambda 2</div>
                      <div className="col-lg-9">{JSON.stringify(output2)}</div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col-lg-3 fw-bold">Lambda 3</div>
                      <div className="col-lg-9">{JSON.stringify(output3)}</div>
                    </div>
                  </li>
                </ul>}
              </div>
            </div>
            <div className="col-lg-3"></div>
          </div>
        </div>
      </div>
      <footer className="mt-auto text-center pt-3 mb-3 border-top">
          Demo by <a href="https://twitter.com/kennu" target="_blank" rel="noreferrer">Kenneth Falck</a>, <a href="https://nordcloud.com" target="_blank" rel="noreferrer">Nordcloud</a>, an IBM Company
      </footer>
    </>
  )
}

export default Home
