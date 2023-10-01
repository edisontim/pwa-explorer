import { hash } from "starknet";

const asciiStringToBytes = (inputString: string): string => {
  let concatenatedBytes = "";

  for (let i = 0; i < inputString.length; i++) {
    const asciiCode = inputString.charCodeAt(i); // Get the ASCII code of the character
    concatenatedBytes += asciiCode.toString(16); // Concatenate the ASCII code
  }

  return concatenatedBytes;
};

const getCoordsString = (latitude: number, longitude: number): string => {
  return latitude + "," + longitude;
};

export const getHashFromCoords = (lat: number, lng: number) => {
  const coordString = getCoordsString(lat, lng);
  const coordBytes = "0x" + asciiStringToBytes(coordString);
  return hash.keccakBn(BigInt(coordBytes));
};
