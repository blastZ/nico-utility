import { ncrypto } from '../src';
import fs from 'fs';
import path from 'path';

let publicKey: string;
let privateKey: string;
let data: Buffer;

beforeAll(async () => {
  const { publicKey: pubKey, privateKey: privKey } = await ncrypto.generateRSAKeyPair();

  publicKey = pubKey;
  privateKey = privKey;

  data = fs.readFileSync(path.resolve(process.cwd(), './test/data.txt'));
});

test('public encrypt and private decrypt', () => {
  // buffer
  const encrypted = ncrypto.publicEncrypt(data, publicKey);
  const decrypted = ncrypto
    .privateDecrypt(encrypted.toString('hex'), privateKey, { encoding: 'hex' })
    .toString();

  expect(decrypted).toEqual(data.toString());

  // string
  const encrypted2 = ncrypto.publicEncrypt(data.toString(), publicKey);
  const decrypted2 = ncrypto
    .privateDecrypt(encrypted2.toString('hex'), privateKey, { encoding: 'hex' })
    .toString();

  expect(decrypted2).toEqual(data.toString());
});

test('private encrypt and public decrypt', () => {
  // buffer
  const encrypted = ncrypto.privateEncrypt(data, privateKey);
  const decrypted = ncrypto
    .publicDecrypt(encrypted.toString('binary'), publicKey, {
      encoding: 'binary',
    })
    .toString();

  expect(decrypted).toEqual(data.toString());

  // string
  const encrypted2 = ncrypto.privateEncrypt(data.toString(), privateKey);
  const decrypted2 = ncrypto
    .publicDecrypt(encrypted2.toString('binary'), publicKey, {
      encoding: 'binary',
    })
    .toString();

  expect(decrypted2).toEqual(data.toString());
});
