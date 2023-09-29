"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const HamburgerMenu = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e: any, target: any) => {
    setAnchorEl(null);
    if (target !== "backdropClick") {
      router.push(target);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "35px",
        left: "24px",
        zIndex: 2,
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
          onClick={(e) => handleClose(e, "/wallet")}
        >
          💳
        </MenuItem>
        <MenuItem
          style={{ fontSize: 40, width: "60px", textAlign: "center" }}
          onClick={(e) => handleClose(e, "/settings")}
        >
          ⚙
        </MenuItem>
      </Menu>
    </div>
  );
};

export default HamburgerMenu;
