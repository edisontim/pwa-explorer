"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { WebWalletConnector } from "@argent/starknet-react-webwallet-connector";
import { StarknetConfig } from "@starknet-react/core";
import Layout from "@/app/layout";
import Wallet from "../app/wallet";
import { AlertArgs } from "../app/layout/alert";

export const WalletContext = React.createContext<any>(null);
export const DialogContext = React.createContext<any>(null);
export const AlertContext = React.createContext<any>(null);

function App({ Component, pageProps }: any) {
  const [alert, setAlert] = useState<AlertArgs>({ severity: "info", msg: "" });
  const [dialog, setDialog] = useState<React.Component>();
  const [wallet, setWallet] = useState<Wallet>(new Wallet(setAlert));

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
      // Do stuff
    }
  }, []);

  useEffect(() => {
    // Once the window has initialized
    if (typeof window !== "undefined") {
      console.log(wallet);
    }
  }, [wallet]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <StarknetConfig autoConnect connectors={connectors}>
        <AlertContext.Provider value={{ alert, setAlert }}>
          <DialogContext.Provider value={{ dialog, setDialog }}>
            <WalletContext.Provider value={{ wallet, setWallet }}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </WalletContext.Provider>
          </DialogContext.Provider>
        </AlertContext.Provider>
      </StarknetConfig>
    </>
  );
}

export default App;
