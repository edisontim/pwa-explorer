import Wallet from "../app/wallet";
import Maps from "../app/maps";

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
      <Wallet></Wallet>
    </div>
  );
};

export default Index;
