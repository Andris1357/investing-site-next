import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import "@/styles/trade_compiled.css";
import "@/styles/globals_compiled.css";
// import "@/styles/trade.scss"; // this does not work

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
