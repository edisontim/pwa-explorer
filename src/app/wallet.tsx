import { StarknetWindowObject } from "@argent/get-starknet";
import { ERC721_LOCATION_ADDRESS, snProvider } from "./starknet/constants";
import { CallData, Contract, cairo } from "starknet";
import { AlertArgs } from "./layout/alert";
import erc721 from "./contract/erc721.json";
import { connect } from "@argent/get-starknet";
import { ARGENT_WEB_WALLET_URL } from "./starknet/constants";

export default class Wallet {
  public connection: StarknetWindowObject | null;
  public setAlert: (alert: AlertArgs) => void;
  public contract: Contract;

  constructor(setAlert: (alert: AlertArgs) => void) {
    this.connection = null;
    this.setAlert = setAlert;
    this.contract = new Contract(erc721, ERC721_LOCATION_ADDRESS, snProvider);
  }

  public passEstablishedConnection = (connection: StarknetWindowObject) => {
    this.connection = connection; 
  };

  public async connect(updateState: any) {
    const connection = await connect({
      include: ["argentWebWallet"],
      webWalletUrl: ARGENT_WEB_WALLET_URL,
      modalMode: "alwaysAsk",
      enableArgentMobile: true,
    });
    this.connection = connection;
    updateState({});
  }

  public getOwnerOfLocation = async (locationHash: string): Promise<BigInt> => {
    let ret = await this.contract.owner_of(cairo.uint256(locationHash));
    return ret;
  };

  private execute = async (args: any): Promise<string> => {
    const res = await this.connection?.account.execute(args);
    console.log(res);
    return res;
  };

  public mint = async (locationHash: string) => {
    return await this.execute({
      contractAddress: ERC721_LOCATION_ADDRESS,
      entrypoint: "mint",
      calldata: CallData.compile({
        to: this.connection?.account.address,
        token_id: cairo.uint256(locationHash),
      }),
    });
  };
}
