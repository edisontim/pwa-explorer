import React, { useEffect, useState } from "react";
import { Button, Menu, Collapse } from "@mui/material";
import { Marker } from "./marker";
import { snProvider } from "../starknet/constants";
import { CallData, cairo } from "starknet";
import Wallet from "../wallet";
import { AlertArgs } from "../layout/alert";
import { getHashFromCoords } from "./geoPosUtils";

type locationMarkerProps = {
  lat: number;
  lng: number;
  wallet: Wallet;
  text: string;
  setAlert: (alert: AlertArgs) => void;
};

export const LocationMarker = ({
  lat,
  lng,
  wallet,
  text,
  setAlert,
}: locationMarkerProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [owner, setOwner]: any = useState();
  const open = Boolean(anchorEl);

  const handleMintIt = async () => {
    const locationHash = getHashFromCoords(lat, lng);
    if (wallet === null) {
      setAlert({ msg: "wallet was null", severity: "error" });
      console.log("Wallet shouldn't be null");
      return;
    }
    try {
      console.log(wallet);
      const res = await wallet?.execute(wallet, {
        contractAddress: wallet.contract?.address as string,
        entrypoint: "mint",
        calldata: CallData.compile({
          to: wallet.account.address,
          token_id: cairo.uint256(locationHash),
        }),
      });

      if (res instanceof Error) {
        setAlert({
          msg: `Something unexpected happened ${res}`,
          severity: "warning",
        });
        return;
      }
      console.log(res);
      const ret = await snProvider.waitForTransaction(res.transaction_hash);
      setOwner(wallet.account.address);
    } catch (error) {
      setAlert({
        msg: "Something went wrong, have you funded your address?",
        severity: "error",
      });
      handleClose(null, null);
      console.log(error);
    }
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const locationHash = getHashFromCoords(lat, lng);
    setAnchorEl(event.currentTarget);
    let hash = "0x0";
    if (!owner) {
      try {
        hash = await wallet.getOwnerOfLocation(locationHash);
      } catch (error) {
        setAlert({
          msg: `Unexpected error happened ${error}`,
          severity: "warning",
        });
      }
      setOwner(hash);
    }
  };

  const handleClose = (e: any, target: any) => {
    setAnchorEl(null);
  };

  return (
    <>
      <Marker onClick={handleClick} text={text} />
      <Collapse in={open}>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p style={{ padding: 10 }}>Name: {text}</p>
            <p style={{ padding: 10 }}>Owner: {owner}</p>
            {owner === "0x0" ? (
              <Button onClick={handleMintIt}>Mint it!</Button>
            ) : (
              ""
            )}
          </div>
        </Menu>
      </Collapse>
    </>
  );
};
