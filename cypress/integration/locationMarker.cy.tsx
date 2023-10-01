import React from "react";
import { LocationMarker } from "../../src/app/markers/locationMarker";
import Wallet from "../../src/app/wallet";
const wallet: Wallet = new Wallet();

before(() => {
  cy.log("Initializing wallet");
  wallet.init(() => {});
});

describe("<LocationMarker />", () => {
  it("renders", () => {
    const wallet: Wallet = new Wallet();
    wallet.init(() => {});
    cy.mount(
      <LocationMarker
        lat={9.814}
        lng={126.167}
        wallet={wallet}
        text="Cloud 9"
        setAlert={() => {}}
      />
    );
  });
});
