import React from "react";
import Wallet from "../../src/app/wallet";
import {
  ec,
  hash,
  CallData,
  AccountInterface,
  ProviderInterface,
} from "starknet";
import { OZ_ACC_CLASS_HASH } from "../../src/app/starknet/constants";

const wallet: Wallet = new Wallet();

describe("Wallet tests", () => {
  it("builds correctly", async () => {
    const privKey = wallet.privKey;
    const computedPubKey = ec.starkCurve.getStarkKey(privKey);
    const computedAccountAddress = hash.calculateContractAddressFromHash(
      computedPubKey,
      OZ_ACC_CLASS_HASH,
      CallData.compile({
        publicKey: computedPubKey,
      }),
      0
    );
    expect(wallet.publicKey).to.be.equal(computedPubKey);
    expect(wallet.address).to.be.equal(computedAccountAddress);
  });
  it("Initializes correctly", async () => {
    await wallet.init(() => {});
    expect(wallet.contract).to.exist;
    cy.log(
      `providerOrAccount ${JSON.stringify(
        wallet.contract?.providerOrAccount,
        null,
        2
      )}`
    );
    cy.log(
      `InstanceOf ProviderInterface ${
        wallet.contract?.providerOrAccount instanceof ProviderInterface
      }`
    );
    expect(wallet.contract?.providerOrAccount).to.be.an.instanceof(
      AccountInterface
    );
  });
});
