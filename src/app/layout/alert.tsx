"use client";

import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { AlertContext } from "../layout";

export default function TransitionAlerts({}: any) {
  const { alert, setAlert } = useContext(AlertContext);
  const [open, setOpen] = useState(false);

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
          severity={alert.severity ? alert.severity : "info"}
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
