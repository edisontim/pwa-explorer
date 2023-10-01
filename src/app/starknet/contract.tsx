import { Contract } from "starknet";
import { ERC721_LOCATION_ADDRESS, snProvider as provider } from "./constants";

export const getLocationContract = async (): Promise<Contract | Error> => {
  try {
    const contract = await provider.getClassAt(ERC721_LOCATION_ADDRESS);
    if (contract.abi === undefined) {
      throw new Error("no abi.");
    }
    return new Contract(contract.abi, ERC721_LOCATION_ADDRESS, provider);
  } catch (error) {
    console.log(`${error}`);
    return error as Error;
  }
};
