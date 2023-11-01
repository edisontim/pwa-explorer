import { AccountInterface, Contract, CallData, cairo } from "starknet";
import { ARGENT_WEB_WALLET_URL, ERC721_LOCATION_ADDRESS } from "./constants";
import { connect, disconnect } from "starknetkit";

export const mint = async (account: AccountInterface, locationHash: string) => {
  return await account.execute({
    contractAddress: ERC721_LOCATION_ADDRESS,
    entrypoint: "mint",
    calldata: CallData.compile({
      to: account.address,
      token_id: cairo.uint256(locationHash),
    }),
  });
};

export const getOwnerOfLocation = async (
  contract: Contract,
  locationHash: string
): Promise<BigInt> => {
  let ret = await contract.owner_of(cairo.uint256(locationHash));
  return ret;
};

export const snConnect = async () => {
  return await connect({
    modalMode: "canAsk",
    modalTheme: "system",
    dappName: "Explorers",
    webWalletUrl: ARGENT_WEB_WALLET_URL,
  });
};
