import { Button } from "@mui/material";
import AlertDialog from "./dialog";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";

export const AndroidInstallDialog = ({ deferredPrompt, setDialog }: any) => {
  return (
    <AlertDialog
      title="Install app"
      text="Add the app to your homescreen. Tap the Share icon then chose Add to Home Screen."
      unclosable={true}
      icons={[<InstallMobileIcon key={1} fontSize="large" />]}
      extraButtons={[
        <Button
          key={1}
          onClick={async () => {
            if (deferredPrompt) {
              const res = await deferredPrompt.prompt();
              console.log(res);
              if (res.outcome === "accepted") {
                setDialog([]);
              }
            }
          }}
        >
          Install
        </Button>,
      ]}
    />
  );
};
