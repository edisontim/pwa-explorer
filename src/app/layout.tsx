"use client";

import React, { useState, useEffect, useContext } from "react";
import HamburgerMenu from "./layout/hamburgerMenu";
import TransitionAlerts, { AlertArgs } from "./layout/alert";
import { DialogContext } from "../pages/_app";

const Layout = ({ children }: any) => {
  const { dialog, setDialog } = useContext(DialogContext);

  return (
    <div>
      <HamburgerMenu />
      <TransitionAlerts />
      {dialog}
      {children}
    </div>
  );
};

export default Layout;
