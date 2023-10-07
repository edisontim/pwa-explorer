import { useContext, useState } from "react";
import { Button, Menu, Collapse } from "@mui/material";
import { Marker } from "./marker";
import { snProvider } from "../starknet/constants";
import { AlertArgs } from "../layout/alert";
import { getHashFromCoords, cosineDistanceBetweenPoints } from "./geoPosUtils";
import { WalletContext } from "../../pages/_app";
import { Position } from "../maps";
import BigNumber from "bignumber.js";

type locationMarkerProps = {
  lat: number;
  lng: number;
  userPos: Position;
  text: string;
  setAlert: (alert: AlertArgs) => void;
};

export const LocationMarker = ({
  lat,
  lng,
  userPos,
  text,
  setAlert,
}: locationMarkerProps) => {
  const { wallet, _setWallet } = useContext(WalletContext);
  const [_state, updateState] = useState({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [owner, setOwner]: any = useState();
  const open = Boolean(anchorEl);

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
      setNewOwner(hash);
    }
  };

  const handleClose = (e: any, target: any) => {
    setAnchorEl(null);
  };

  const handleConnectButtonClick = async () => {
    await wallet.connect(updateState);
  };

  const getButton = (): any => {
    if (!(wallet.connection && wallet.connection?.isConnected)) {
      return <Button onClick={handleConnectButtonClick}>Connect wallet</Button>;
    }
    const distanceToButton = cosineDistanceBetweenPoints(
      userPos.lat,
      userPos.lng,
      lat,
      lng
    );
    if (owner === "0x0" && distanceToButton > 20) {
      return (
        <Button disabled={true} onClick={handleMintIt}>
          Get closer to mint
        </Button>
      );
    }
    if (owner === "0x0") {
      return <Button onClick={handleMintIt}>Mint it!</Button>;
    }
    return "";
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
            {getButton()}
          </div>
        </Menu>
      </Collapse>
    </>
  );
};
