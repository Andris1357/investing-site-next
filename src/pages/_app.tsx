import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import "@/styles/trade_compiled.css";
import "@/styles/globals_compiled.css";
import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';
// import "@/styles/trade.scss"; // this does not work

export default function App({ Component, pageProps }: AppProps) {
  return <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
}
// TD: add git remote