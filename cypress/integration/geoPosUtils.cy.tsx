import { getHashFromCoords } from "../../src/app/markers/geoPosUtils";

before(() => {});

describe("geoPosUtils", () => {
  it("getHashFromCoords", () => {
    expect(getHashFromCoords(9.814, 126.167)).to.be.equal(
      "0x45cd632a16463d9bebfdb71ea800bacfbfd7a64c5b3086a144383639550c4d"
    );

    expect(getHashFromCoords(9.8151496, 126.1654051)).to.be.equal(
      "0x2b85f5d104f6c4abcd464c5fad76b6f9d5ca7fd70c3ac819232f542bccc0b52"
    );
  });
});
