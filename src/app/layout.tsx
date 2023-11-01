"use client";
import React, { useContext, useState } from "react";
import HamburgerMenu from "./layout/hamburgerMenu";
import TransitionAlerts from "./layout/alert";
import { DialogContext } from "../pages/_app";

const Layout = ({ children }: any) => {
  const { dialog, setDialog } = useContext(DialogContext);
  return (
    <div id="layoutDiv">
      <TransitionAlerts />
      {dialog}
      {children}
      <HamburgerMenu />
    </div>
  );
};

export default Layout;
