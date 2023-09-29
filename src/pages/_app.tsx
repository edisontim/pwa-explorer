import Head from "next/head";
import { useEffect } from "react";
import React, { useState } from "react";
import Layout from "@/app/layout";

export const WalletContext = React.createContext<any>(null);

function MyApp({ Component, pageProps }: any) {
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    if (!navigator.serviceWorker.controller) {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => console.log("SW registered"));
      }
    }
  }, []);

  return (
    <>
      <WalletContext.Provider value={{ wallet, setWallet }}>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WalletContext.Provider>
    </>
  );
}

export default MyApp;
