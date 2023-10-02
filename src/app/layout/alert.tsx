"use client";

import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { AlertContext } from "../../pages/_app";
import { AlertColor } from "@mui/material/Alert";

export type AlertArgs = {
  msg: string;
  severity: AlertColor;
};

export default function TransitionAlerts({}: any) {
  const { alert, _ } = useContext<{
    alert: AlertArgs;
    _: void;
  }>(AlertContext);
  const [open, setOpen] = useState(false);

  // By default, the Alert won't be open as we set the alert's msg empty in the Layout component
  useEffect(() => {
    setOpen(Boolean(alert.msg));
  }, [alert]);

  return (
    <Box
      style={{
        position: "fixed",
        bottom: "35px",
        left: "24px",
        zIndex: 3,
        width: "90vw",
      }}
      sx={{ width: "100%" }}
    >
      <Collapse in={open}>
        <Alert
          severity={alert.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alert.msg}
        </Alert>
      </Collapse>
    </Box>
  );
}
