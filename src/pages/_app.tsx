import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import "@/styles/trade_compiled.css"

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
