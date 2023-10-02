"use client";
import { connect, disconnect } from "@argent/get-starknet";

export default class Wallet {
  public connect = async () => {
    const connection = await connect({
      include: ["argentWebWallet"],
      modalWalletAppearance: "email_only",
      webWalletUrl: "https://web.hydrogen.argent47.net",
    });
    console.log(connection);
  };
  public disconnect = async () => {
    const res = await disconnect();
    console.log(res);
  };
}
