import type { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';

import '@/styles/globals_builtin.css';
import "@/styles/trade.css";
import "@/styles/globals.css";
import "@/styles/investing.css";
import store from '../store';
// import "@/styles/trade.scss"; // this does not work

export default function App({ Component, pageProps }: AppProps) {
  return <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
}