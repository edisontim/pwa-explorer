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

// https://henry-rossiter.medium.com/calculating-distance-between-geographic-coordinates-with-javascript-5f3097b61898
export const cosineDistanceBetweenPoints = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaP = p2 - p1;
  const deltaLon = lon2 - lon1;
  const deltaLambda = (deltaLon * Math.PI) / 180;
  const a =
    Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
    Math.cos(p1) *
      Math.cos(p2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * R;
  return d;
};
