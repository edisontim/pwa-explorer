import React, { useContext } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({
  title,
  text,
  extraButtons,
  icons = [],
  unclosable = false,
}: any) {
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: any) => {
    if (unclosable) {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {Boolean(title) && (
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        )}
        <DialogContent>
          {icons}
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {extraButtons}
          {!unclosable && <Button onClick={handleClose}>Close</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
