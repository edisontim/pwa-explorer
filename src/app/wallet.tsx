"use client";
import {
  CallData,
  ec,
  stark,
  hash,
  Account,
  Calldata,
  TransactionStatus,
  Contract,
  DeployContractResponse,
  GetTransactionReceiptResponse,
  InvokeFunctionResponse,
} from "starknet";
import BigNumber from "bignumber.js";
import { OZ_ACC_CLASS_HASH, snProvider } from "./starknet/constants";
import secureLocalStorage from "react-secure-storage";
import { DeployDialog } from "./layout/deployDialog";
import { getLocationContract } from "./starknet/contract";

type ExecuteFunctionParams = {
  contractAddress: string;
  entrypoint: string;
  calldata: Calldata;
};

type StorageKeptKey = {
  key: string;
  new: boolean;
  deployed: boolean;
};

function padAddress(address: string): string {
  const addressWithoutPrefix = address.slice(2); // Remove '0x' prefix
  const paddedAddress = "0x" + addressWithoutPrefix.padStart(64, "0");
  return paddedAddress;
}

class Wallet {
  public privKey: string;
  public new: boolean;
  public deployed: boolean;
  public publicKey: string;
  public address: string;
  public account: Account;
  public contract: Contract | null;
  public setDialog: ((dialog: React.JSX.Element) => void) | null;

  private fetchPrivKey = (): StorageKeptKey => {
    let storageKeptKey: StorageKeptKey = secureLocalStorage.getItem(
      "privKey"
    ) as StorageKeptKey;
    if (!storageKeptKey || !storageKeptKey.key) {
      storageKeptKey = {
        key: stark.randomAddress(),
        new: true,
        deployed: false,
      };
      secureLocalStorage.setItem("privKey", storageKeptKey);
      console.log(`Wrote a new key to storage!!`);
    } else {
      console.log("Fetched private key from the storage");
      if (storageKeptKey.new) {
        storageKeptKey = {
          ...storageKeptKey,
          new: false,
        };
        secureLocalStorage.setItem("privKey", storageKeptKey);
      }
    }
    return storageKeptKey;
  };

  public init = async (setDialog: (dialog: any) => void) => {
    const contract = await getLocationContract();
    if (contract instanceof Error) {
      // TODO handle error
    }
    this.contract = contract as Contract;
    this.contract.connect(this.account);

    this.setDialog = setDialog;
    if (this.deployed == false) {
      this.setDialog(<DeployDialog textToCopy={padAddress(this.address)} />);
    }
  };

  private deployAccount = async (): Promise<string | undefined> => {
    let ret: string | undefined = undefined;
    try {
      const deployRet: DeployContractResponse =
        await this.account.deployAccount({
          classHash: OZ_ACC_CLASS_HASH,
          constructorCalldata: CallData.compile({
            publicKey: this.publicKey,
          }),
          addressSalt: this.publicKey,
        });
      const txRet: GetTransactionReceiptResponse =
        await snProvider.waitForTransaction(
          deployRet.transaction_hash as string
        );
      if (
        txRet.status === TransactionStatus.REJECTED ||
        txRet.status === TransactionStatus.REVERTED
      ) {
        this.setDialog?.(
          <DeployDialog textToCopy={padAddress(this.address)} />
        );
      } else {
        ret = txRet.transaction_hash;
      }
    } catch (error) {
      this.setDialog?.(<DeployDialog textToCopy={padAddress(this.address)} />);
      throw error;
    }
    return ret;
  };

  public getOwnerOfLocation = async (locationHash: string): Promise<string> => {
    let hash = await this.contract?.owner_of(locationHash);
    console.log(`response from owner_of ${hash}`);
    if (hash === 0n) {
      hash = "0x0";
    } else {
      hash = "0x" + new BigNumber(hash).toString(16);
      hash = hash.slice(0, 5) + "..." + hash.slice(62);
    }
    return hash;
  };

  public execute = async (
    argWallet: Wallet,
    params: ExecuteFunctionParams
  ): Promise<InvokeFunctionResponse | Error> => {
    if (argWallet === null) {
      return Error("Wallet is null");
    }
    let ret: InvokeFunctionResponse;
    if (!argWallet.deployed) {
      await this.deployAccount();
      this.deployed = true;
    }
    ret = await argWallet.account.execute(params);
    return ret;
  };

  constructor() {
    ({
      key: this.privKey,
      deployed: this.deployed,
      new: this.new,
    } = this.fetchPrivKey());

    this.publicKey = ec.starkCurve.getStarkKey(this.privKey);
    const OZaccountConstructorCallData = CallData.compile({
      publicKey: this.publicKey,
    });
    this.address = hash.calculateContractAddressFromHash(
      this.publicKey,
      OZ_ACC_CLASS_HASH,
      OZaccountConstructorCallData,
      0
    );
    console.log("Precalculated account address=", this.address);
    this.account = new Account(snProvider, this.address, this.privKey);
    // These variables will be initialized in the init function
    this.contract = null;
    this.setDialog = null;
  }
}

export default Wallet;
