import { Provider, RpcProvider, constants } from "starknet";

export const snProvider = new Provider({
  sequencer: { network: constants.NetworkName.SN_GOERLI },
});
export const OZ_ACC_CLASS_HASH =
  "0x2794ce20e5f2ff0d40e632cb53845b9f4e526ebd8471983f7dbd355b721d5a";
export const ERC721_LOCATION_ADDRESS =
  "0x02283a7355866ff6e7e10a2901498cf284263705d65508c6317d21ddf7a75e74";
export const ARGENT_WEB_WALLET_URL = "https://web.hydrogen.argent47.net";
