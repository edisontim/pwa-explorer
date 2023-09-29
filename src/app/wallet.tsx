import { useEffect, useState, useMemo, useContext } from "react";
import {
  CallData,
  ec,
  stark,
  hash,
  Account,
  Calldata,
  TransactionStatus,
} from "starknet";
import { OZ_ACC_CLASS_HASH, snProvider } from "./starknet/constants";
import secureLocalStorage from "react-secure-storage";
import { WalletContext } from "../pages/_app";
import { DialogContext } from "./layout";
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

function Wallet() {
  const { wallet, setWallet }: any = useContext(WalletContext);
  const { _dialog, setDialog }: any = useContext(DialogContext);
  const [deployed, setDeployed]: any = useState(false);
  const [privKey, setPrivKey] = useState<StorageKeptKey>({
    key: "",
    new: true,
    deployed: true,
  });
  const [reloadTrigger, setReloadTrigger] = useState(false);

  const fetchPrivKey = () => {
    console.log(`Fetching privKey in the storage`);
    let storageKeptKey: StorageKeptKey = secureLocalStorage.getItem(
      "privKey"
    ) as StorageKeptKey;
    if (!storageKeptKey || !storageKeptKey.key) {
      storageKeptKey = {
        key: stark.randomAddress(),
        new: true,
        deployed: false,
      };
      setDeployed(false);
      console.log(`Wrote a new key to storage!!`);
      secureLocalStorage.setItem("privKey", storageKeptKey);
    } else {
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

  const publicKey = useMemo(() => {
    if (!privKey || !privKey.key) {
      return;
    }
    return ec.starkCurve.getStarkKey(privKey.key);
  }, [privKey]);

  const accAddress = useMemo(() => {
    if (!publicKey) {
      return;
    }
    const OZaccountConstructorCallData = CallData.compile({
      publicKey: publicKey,
    });
    const OZcontractAddress = hash.calculateContractAddressFromHash(
      publicKey,
      OZ_ACC_CLASS_HASH,
      OZaccountConstructorCallData,
      0
    );
    console.log("Precalculated account address=", OZcontractAddress);
    return OZcontractAddress;
  }, [publicKey]);

  const account = useMemo(() => {
    if (!accAddress || !privKey) {
      return;
    }
    return new Account(snProvider, accAddress, privKey.key);
  }, [accAddress, privKey]);

  useEffect(() => {
    setReloadTrigger(false);

    if (reloadTrigger) {
      console.log("reset the private key");
      setPrivKey({ key: "", new: false, deployed: false });
    }
    setPrivKey(fetchPrivKey());
  }, [reloadTrigger]);

  useEffect(() => {
    const setLocationContract = async () => {
      const contract = await getLocationContract();
      contract?.connect(account as Account);
      setWallet({
        ...wallet,
        execute,
        account,
        contract,
        new: privKey.new,
        deployed: privKey.deployed,
      });
      setDeployed(privKey.deployed);
      if (privKey.deployed == false) {
        setDialog(<DeployDialog textToCopy={padAddress(account?.address)} />);
      }
    };
    if (account) setLocationContract();
  }, [account]);

  useEffect(() => {
    if (!deployed && wallet && wallet.deployed) {
      setDeployed(true);
      secureLocalStorage.setItem("privKey", {
        key: wallet.account.signer.pk,
        new: false,
        deployed: true,
      });
    }
  }, [wallet]);

  const execute = async (argWallet: any, params: ExecuteFunctionParams) => {
    console.log(argWallet);
    let ret: any;
    const address = padAddress(account.address);
    if (!argWallet.deployed) {
      try {
        ret = await account?.deployAccount({
          classHash: OZ_ACC_CLASS_HASH,
          constructorCalldata: CallData.compile({
            publicKey: publicKey as string,
          }),
          addressSalt: publicKey,
        });
        ret = await snProvider.waitForTransaction(ret.transaction_hash);
        if (
          ret.status === TransactionStatus.REJECTED ||
          ret.status === TransactionStatus.REVERTED
        ) {
          setDialog(<DeployDialog textToCopy={address} />);
        } else {
          console.log("Successfully deployed ?");
          console.log(argWallet);
          setWallet({ ...argWallet, deployed: true });
          setDeployed(true);
        }
      } catch (error) {
        ret = error;
        setDialog(<DeployDialog textToCopy={address} />);
      }
    } else {
      ret = await account?.execute(params);
    }
    return ret;
  };

  return <></>;
}
export default Wallet;
