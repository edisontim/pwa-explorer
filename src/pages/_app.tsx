import React, { useState, useEffect } from "react";
import Head from "next/head";
import { WebWalletConnector } from "@argent/starknet-react-webwallet-connector";
import { StarknetConfig } from "@starknet-react/core";
import Layout from "@/app/layout";
import Wallet from "../app/wallet";

export const WalletContext = React.createContext<any>(null);
export const DialogContext = React.createContext<any>(null);

function App({ Component, pageProps }: any) {
  const [dialog, setDialog] = useState<React.Component>();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const connectors = [
    new WebWalletConnector({ url: "https://web.hydrogen.argent47.net" }),
  ];

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
      newWallet.connect().then(() => setWallet(newWallet));
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
      <StarknetConfig autoConnect connectors={connectors}>
        <DialogContext.Provider value={{ dialog, setDialog }}>
          <WalletContext.Provider value={{ wallet, setWallet }}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </WalletContext.Provider>
        </DialogContext.Provider>
      </StarknetConfig>
    </>
  );
}

export default App;
