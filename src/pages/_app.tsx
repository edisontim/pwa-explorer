import Head from "next/head";
import { useEffect } from "react";
import React, { useState } from "react";
import Layout from "@/app/layout";
import Wallet from "../app/wallet";

export const WalletContext = React.createContext<any>(null);
export const DialogContext = React.createContext<any>(null);

function App({ Component, pageProps }: any) {
  const [dialog, setDialog] = useState<React.Component>();
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    if (!navigator.serviceWorker.controller) {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => console.log(`SW registered ${registration}`));
      }
    }
    // Once the window has initialized
    if (typeof window !== "undefined") {
      const newWallet = new Wallet();
      newWallet.init(setDialog);
      setWallet(newWallet);
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <DialogContext.Provider value={{ dialog, setDialog }}>
        <WalletContext.Provider value={wallet}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WalletContext.Provider>
      </DialogContext.Provider>
    </>
  );
}

export default App;
