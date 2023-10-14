import { useContext, useState, useEffect } from "react";
import { Button, Slide, Typography, Card } from "@mui/material";
import { Marker } from "./marker";
import { snProvider } from "../starknet/constants";
import { AlertArgs } from "../layout/alert";
import {
  getHashFromCoords,
  cosineDistanceBetweenPoints,
} from "../geopos/geoPosUtils";
import { WalletContext } from "../../pages/_app";
import { Position } from "../maps";
import BigNumber from "bignumber.js";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import Draggable, { DraggableEventHandler } from "react-draggable";
import LocationCard from "../locationCard";

type locationMarkerProps = {
  lat: number;
  lng: number;
  userPos: Position;
  locationName: string;
  logo: string;
  description: string;
  setAlert: (alert: AlertArgs) => void;
};

export const LocationMarker = ({
  lat,
  lng,
  logo,
  userPos,
  locationName,
  description,
  setAlert,
}: locationMarkerProps) => {
  const { wallet, _setWallet } = useContext(WalletContext);
  const [_state, updateState] = useState({});
  const [owner, setOwner]: any = useState();
  const [open, setOpen] = useState(false);

  const setNewOwner = (newOwner: BigInt) => {
    let hashedOwner: string;
    if (newOwner === BigInt(0)) {
      hashedOwner = "0x0";
    } else {
      hashedOwner = "0x" + new BigNumber(String(newOwner)).toString(16);
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
      console.log(error);
    }
  };

  const handleMarkerClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    const locationHash = getHashFromCoords(lat, lng);
    setOpen(!open);
    if (!owner) {
      try {
        const hash: BigInt = await wallet.getOwnerOfLocation(locationHash);
        setNewOwner(hash);
      } catch (error) {
        setAlert({
          msg: `Unexpected error happened ${error}`,
          severity: "warning",
        });
      }
    }
  };

  const getButton = (): any => {
    if (!(wallet.connection && wallet.connection?.isConnected)) {
      return (
        <Button
          variant="contained"
          onClick={async () => {
            await wallet.connect(updateState);
          }}
        >
          Connect wallet
        </Button>
      );
    }
    if (
      owner === "0x0" &&
      cosineDistanceBetweenPoints(userPos.lat, userPos.lng, lat, lng) > 20
    ) {
      return (
        <Button variant="contained" disabled={true} onClick={handleMintIt}>
          Get closer
        </Button>
      );
    }
    if (owner === "0x0") {
      return (
        <Button variant="contained" onClick={handleMintIt}>
          Mint it!
        </Button>
      );
    }
    return "";
  };

  return (
    <>
      <Marker
        logo={logo}
        onClick={handleMarkerClick}
        locationName={locationName}
      />
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        {/* <Draggable axis="y" onStop={handleDragStop} position={winPos}> */}
        <div
          style={{
            zIndex: 3,
            position: "fixed",
            left: "-48vw",
            bottom: "-50vh",
          }}
        >
          <Slide
            direction="up"
            in={open}
            timeout={400}
            mountOnEnter
            unmountOnExit
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* div necessary for the slide animation to not complain */}
            <div>
              <LocationCard
                locationName={locationName}
                owner={owner}
                getButton={getButton}
                logo={logo}
                description={description}
              />
            </div>
          </Slide>
        </div>
        {/* </Draggable> */}
      </ClickAwayListener>
    </>
  );
};
