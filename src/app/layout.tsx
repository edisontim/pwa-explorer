"use client";

import React, { useState, useEffect, useContext } from "react";
import HamburgerMenu from "./layout/hamburgerMenu";
import TransitionAlerts, { AlertArgs } from "./layout/alert";
import { DialogContext } from "../pages/_app";

export const AlertContext = React.createContext<any>(null);

const Layout = ({ children }: any) => {
  const [alert, setAlert] = useState<AlertArgs>({ severity: "info", msg: "" });
  const { dialog, setDialog } = useContext(DialogContext);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      <div>
        <HamburgerMenu />
        <TransitionAlerts />
        {dialog}
        {children}
      </div>
    </AlertContext.Provider>
  );
};

export default Layout;
