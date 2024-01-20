// https://github.com/lukeed/uid/blob/master/src/index.js
/* eslint no-bitwise: 'off' */
/* eslint no-plusplus: 'off' */
/* eslint @typescript-eslint/strict-boolean-expressions: 'off' */
import { randomBytes } from 'crypto';
let IDX = 36;
let HEX = '';
while (IDX--) {
  HEX += IDX.toString(36);
}

export default function uid(len = 11): string {
  let str = '';
  let num = len;
  while (num--) {
    str += HEX[(cryptoRandomRoundedNumber(1, 100000000) * 36) | 0];
  }
  return str;
}


function cryptoRandomRoundedNumber(min: number, max: number): number {
  const range = max - min;
  if (range <= 0) {
    throw new Error('Invalid range');
  }

  const randomBytesValue = randomBytes(4); // Using 4 bytes for a 32-bit unsigned integer
  const randomValue = randomBytesValue.readUInt32BE(0);

  // Map the 32-bit integer to the specified range
  const normalizedRandom = randomValue / 0xFFFFFFFF;
  const randomNumberInRange = normalizedRandom * range + min;

  return Math.floor(randomNumberInRange);
}
