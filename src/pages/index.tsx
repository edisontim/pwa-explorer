import Wallet from "../app/wallet";
import Maps from "../app/maps";
import { useConnectors } from "@starknet-react/core";
import { connect, disconnect } from "@argent/get-starknet";

const Index = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Maps></Maps>
    </div>
  );
};

export default Index;

function ConnectWallet() {
  const { connectors } = useConnectors();

  return (
    <div>
      <span>Choose a wallet:</span>
      {connectors.map((connector) => {
        return (
          <button
            key={connector.id}
            onClick={async () => {
              const connection = await connect({
                include: ["argentWebWallet"],
                modalWalletAppearance: "email_only",
                webWalletUrl: "https://web.hydrogen.argent47.net",
              });
              //   connect(connector);
            }}
          >
            {connector.id}
          </button>
        );
      })}
    </div>
  );
}
