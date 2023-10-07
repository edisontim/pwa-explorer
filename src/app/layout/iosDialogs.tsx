import AlertDialog from "./dialog";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";

export const IosInstallDialog = () => {
  return (
    <AlertDialog
      title="Install app"
      text="Add the app to your homescreen. Tap the Share icon then chose Add to Home Screen."
      unclosable={true}
      icons={[<InstallMobileIcon key={1} fontSize="large" />]}
    />
  );
};

export const IosChangeBrowserDialog = () => {
  return (
    <AlertDialog
      title="Wrong browser"
      text="To use the app, you need to install it to your Homescreen. Unfortunately this feature is not available in your browser, please open Safari to install the app."
      unclosable={true}
      icons={[<InstallMobileIcon key={1} fontSize="large" />]}
    />
  );
};
