"use client";

import React, { useState, useEffect } from "react";
import HamburgerMenu from "./layout/hamburgerMenu";
import TransitionAlerts from "./layout/alert";
import { DeployDialog } from "./layout/deployDialog";

export const AlertContext = React.createContext<any>(null);
export const DialogContext = React.createContext<any>(null);

const Layout = ({ children }: any) => {
  const [alert, setAlert] = useState<any>({ severity: "", msg: "" });
  const [dialog, setDialog] = useState<React.Component>();

  useEffect(() => {}, []);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      <DialogContext.Provider value={{ dialog, setDialog }}>
        <div>
          <HamburgerMenu />
          <TransitionAlerts />
          {dialog}
          {children}
        </div>
      </DialogContext.Provider>
    </AlertContext.Provider>
  );
};

export default Layout;
