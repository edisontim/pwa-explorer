"use client";

import React, { useContext } from "react";
import { Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { WalletContext } from "../../pages/_app";
import { ARGENT_WEB_WALLET_URL } from "../starknet/constants";

const HamburgerMenu = () => {
  const { wallet, useWallet } = useContext(WalletContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e: any, buttonClicked: string) => {
    setAnchorEl(null);
    console.log("hey");
    if (!wallet.connection && buttonClicked === "wallet") {
      e.preventDefault();
      wallet.connect(() => {});
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "35px",
        left: "24px",
        zIndex: 1,
      }}
    >
      <MenuIcon
        style={{
          fontSize: 35,
          borderRadius: "50%",
          border: "8px solid white",
          backgroundColor: "white",
        }}
        onClick={handleClick}
      />
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          style={{ fontSize: 35, textAlign: "center" }}
          onClick={(e) => handleClose(e, "wallet")}
        >
          <a
            style={{ textDecoration: "none" }}
            href={ARGENT_WEB_WALLET_URL}
            target="_blank"
          >
            💳
          </a>
        </MenuItem>
        {/* <MenuItem
          style={{ fontSize: 40, width: "60px", textAlign: "center" }}
          onClick={(e) => handleClose(e, "settings")}
        >
          <a
            style={{ textDecoration: "none", color: "inherit" }}
            href="/settings"
          >
            ⚙
          </a>
        </MenuItem> */}
      </Menu>
    </div>
  );
};

export default HamburgerMenu;
