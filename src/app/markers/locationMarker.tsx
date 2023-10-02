import { useContext, useEffect, useState } from "react";
import { Button, Menu, Collapse } from "@mui/material";
import { Marker } from "./marker";
import { snProvider } from "../starknet/constants";
import { AlertArgs } from "../layout/alert";
import { getHashFromCoords } from "./geoPosUtils";
import { WalletContext } from "@/pages/_app";
import BigNumber from "bignumber.js";
import { hash } from "starknet";

type locationMarkerProps = {
  lat: number;
  lng: number;
  text: string;
  setAlert: (alert: AlertArgs) => void;
};

export const LocationMarker = ({
  lat,
  lng,
  text,
  setAlert,
}: locationMarkerProps) => {
  const { wallet, setWallet } = useContext(WalletContext);
  const [state, updateState] = useState({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [owner, setOwner]: any = useState();
  const open = Boolean(anchorEl);

  useEffect(() => {
    console.log("state has changed");
  }, [state]);

  const setNewOwner = (newOwner: BigInt) => {
    let hashedOwner: string;
    if (newOwner === BigInt(0)) {
      hashedOwner = "0x0";
    } else {
      hashedOwner = "0x" + new BigNumber(newOwner).toString(16);
      hashedOwner = hashedOwner.slice(0, 5) + "..." + hashedOwner.slice(62);
    }
    setOwner(hashedOwner);
  };

  const handleMintIt = async () => {
    const locationHash = getHashFromCoords(lat, lng);
    if (wallet === null) {
      setAlert({ msg: "wallet was null", severity: "error" });
      console.log("Wallet shouldn't be null");
      return;
    }

    try {
      console.log(wallet);
      const res = await wallet.mint(locationHash);
      console.log(res);
      const ret = await snProvider.waitForTransaction(res.transaction_hash);
      setNewOwner(BigInt(wallet.connection?.account.address));
    } catch (error) {
      setAlert({
        msg: "Something went wrong",
        severity: "error",
      });
      handleClose(null, null);
      console.log(error);
    }
  };

  const handleMarkerClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
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
      console.log(`Setting owner to: ${hash}`);
      setNewOwner(hash);
    }
  };

  const handleClose = (e: any, target: any) => {
    setAnchorEl(null);
  };

  const handleConnectButtonClick = async () => {
    await wallet.connect(updateState);
  };

  return (
    <>
      <Marker onClick={handleMarkerClick} text={text} />
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
            {!(wallet.connection && wallet.connection?.isConnected) ? (
              <Button onClick={handleConnectButtonClick}>Connect wallet</Button>
            ) : owner === "0x0" ? (
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
