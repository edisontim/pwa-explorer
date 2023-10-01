import AlertDialog from "./dialog";
import CopyToClipboardButton from "./clipboardButton";

export const DeployDialog = ({ textToCopy }: any) => {
  return (
    <AlertDialog
      title="Please fund your new Starknet account"
      text="A new account was created for you, please send some funds to it. Remember that this is a burner account, you will only need it to pay gas fees to the network, so about 10$ should be enough. DO NOT send too much fund, as your account (address and private key) is linked to your browser and to this app"
      extraButtons={[<CopyToClipboardButton key={1} textToCopy={textToCopy} />]}
    />
  );
};
