// Credits to Flavio Wuensche: https://fwuensche.medium.com/react-button-to-copy-to-clipboard-75ef5ecdc708

import { useState } from "react";
import { Button, Snackbar } from "@mui/material";

const CopyToClipboardButton = ({ textToCopy }: any) => {
  const [open, setOpen] = useState(false);

  const handleClick = (textToCopy: string) => {
    setOpen(true);
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <>
      <Button onClick={() => handleClick(textToCopy)} color="primary">
        {"Copy address"}
      </Button>
      <Snackbar
        message="Copied to clibboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
};

export default CopyToClipboardButton;
