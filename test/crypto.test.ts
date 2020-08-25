import { ncrypto } from '../src';
import fs from 'fs';
import path from 'path';

let publicKey: string;
let privateKey: string;
let data: string;

beforeAll(async () => {
  const { publicKey: pubKey, privateKey: privKey } = await ncrypto.generateRSAKeyPair();

  publicKey = pubKey;
  privateKey = privKey;

  data = fs.readFileSync(path.resolve(process.cwd(), './test/data.txt')).toString();
});

test('public encrypt and private decrypt', () => {
  const encrypted = ncrypto.publicEncrypt(data, publicKey);
  const decrypted = ncrypto
    .privateDecrypt(encrypted.toString('hex'), privateKey, { encoding: 'hex' })
    .toString();

  expect(decrypted).toEqual(data);
});

test('private encrypt and public decrypt', () => {
  const encrypted = ncrypto.privateEncrypt(data, privateKey);
  const decrypted = ncrypto
    .publicDecrypt(encrypted.toString('binary'), publicKey, {
      encoding: 'binary',
    })
    .toString();

  expect(decrypted).toEqual(data);
});
