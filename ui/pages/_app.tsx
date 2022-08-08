import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Component {...pageProps} />
    <ToastContainer />
  </>
}

export default MyApp
