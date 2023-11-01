"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "../app/layout";
import { AlertArgs } from "../app/layout/alert";
import isMobile, { isMobileResult } from "ismobilejs";
import { PcDialog } from "../app/layout/pcDialog";
import * as Bowser from "bowser";
import {
  IosInstallDialog,
  IosChangeBrowserDialog,
} from "@/app/layout/iosDialogs";
import { AndroidInstallDialog } from "@/app/layout/androidDialogs";
import {
  ARGENT_WEB_WALLET_URL,
  ERC721_LOCATION_ADDRESS,
  snProvider,
} from "@/app/starknet/constants";
import erc721 from "../app/contract/erc721.json";
import { connect } from "starknetkit";

import "../app/styles/app.css";
import { Contract } from "starknet";

export const DialogContext = React.createContext<any>(null);
export const AlertContext = React.createContext<any>(null);
export const StarknetContext = React.createContext<any>(null);

function App({ Component, pageProps }: any) {
  const [alert, setAlert] = useState<AlertArgs>({ severity: "info", msg: "" });
  const [dialog, setDialog] = useState<any>();
  const [snConnection, setSnConnection] = useState<any>(null);
  const erc721Contract = new Contract(
    erc721,
    ERC721_LOCATION_ADDRESS,
    snProvider
  );

  const pcSetup = () => {
    setDialog(<PcDialog />);
  };

  const phoneTabletSetup = (isMobileResult: isMobileResult) => {
    // If we're already on the installed app, do nothing
    if (
      ("standalone" in window.navigator && window.navigator.standalone) ||
      window.matchMedia("diplay-mode: standalone").matches
    ) {
      return;
    }
    // iOS
    if (isMobileResult.apple.device) {
      const browser = Bowser.getParser(window.navigator.userAgent);
      if (browser.getBrowserName() === "Safari") {
        setDialog(<IosInstallDialog />);
      } else {
        setDialog(<IosChangeBrowserDialog />);
      }
    }
    // Android is handled by the beforeinstallprompt event
  };

  const setup = () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      return;
    }
    const isMobileResult: isMobileResult = isMobile(window.navigator.userAgent);
    if (!(isMobileResult.phone || isMobileResult.tablet)) {
      //   pcSetup();
      return;
    } else {
      phoneTabletSetup(isMobileResult);
    }
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      setDialog(
        <AndroidInstallDialog deferredPrompt={event} setDialog={setDialog} />
      );
    });
  };

  useEffect(() => {
    const connectSn = async () => {
      setSnConnection(
        await connect({
          modalMode: "neverAsk",
          modalTheme: "system",
          dappName: "Explorers",
          webWalletUrl: ARGENT_WEB_WALLET_URL,
        })
      );
    };
    if (!navigator.serviceWorker.controller) {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => console.log(`SW registered ${registration}`));
      }
    }
    // Once the window has initialized
    if (typeof window !== "undefined") {
      setup();
      connectSn();
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
      <AlertContext.Provider value={{ alert, setAlert }}>
        <DialogContext.Provider value={{ dialog, setDialog }}>
          <StarknetContext.Provider
            value={{ erc721Contract, snConnection, setSnConnection }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </StarknetContext.Provider>
        </DialogContext.Provider>
      </AlertContext.Provider>
    </>
  );
}

export default App;
