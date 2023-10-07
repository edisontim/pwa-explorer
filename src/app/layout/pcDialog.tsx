import AlertDialog from "./dialog";

export const PcDialog = () => {
  return (
    <AlertDialog
      title="You are on a computer"
      text="Use your phone to use explorers"
      extraButtons={[]}
      unclosable={true}
    />
  );
};
