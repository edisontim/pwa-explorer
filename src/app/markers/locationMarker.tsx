import React, { useEffect, useState } from "react";
import { Button, Menu, Collapse } from "@mui/material";
import { Marker } from "./marker";
import { snProvider } from "../starknet/constants";
import { CallData, hash, cairo } from "starknet";
import BigNumber from "bignumber.js";

function asciiStringToBytes(inputString: string): string {
  let concatenatedBytes = "";

  for (let i = 0; i < inputString.length; i++) {
    const asciiCode = inputString.charCodeAt(i); // Get the ASCII code of the character
    concatenatedBytes += asciiCode.toString(16); // Concatenate the ASCII code
  }

  return concatenatedBytes;
}

export const LocationMarker = ({ lat, lng, wallet, text, setAlert }: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [owner, setOwner]: any = useState();
  const [locationHash, setLocationHash] = useState("");
  const open = Boolean(anchorEl);

  function getCoordsString(latitude: number, longitude: number) {
    return latitude + "," + longitude;
  }

  useEffect(() => {
    const coordString = getCoordsString(lat, lng);
    const coordBytes = "0x" + asciiStringToBytes(coordString);
    setLocationHash(hash.keccakBn(BigInt(coordBytes)));
  }, []);

  const handleMintIt = async () => {
    try {
      console.log(wallet);
      const res = await wallet.execute(wallet, {
        contractAddress: wallet.contract.address,
        entrypoint: "mint",
        calldata: CallData.compile({
          to: wallet.account.address,
          token_id: cairo.uint256(locationHash),
        }),
      });
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
    setAnchorEl(event.currentTarget);
    let hash;
    if (!owner) {
      try {
        hash = await wallet.contract.owner_of(locationHash);
        if (hash === 0n) {
          hash = "0x0";
        } else {
          hash = "0x" + new BigNumber(hash).toString(16);
          hash = hash.slice(0, 5) + "..." + hash.slice(62);
        }
        console.log(hash);
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
