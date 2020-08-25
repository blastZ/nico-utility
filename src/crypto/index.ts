import crypto from 'crypto';

type AsymmetricMethod = 'public-encrypt' | 'public-decrypt' | 'private-encrypt' | 'private-decrypt';
type Encoding = 'base64' | 'binary' | 'hex';
type Data = string | Buffer;

export class NicoCrypto {
  private readonly MAX_ENCRYPT_BLOCK = 512 - 11; // 4096 bit rsa key length - rsa_pkcs1_adding length
  private readonly MAX_DECRYPT_BLOCK = 512;

  private parseAsymmetricData(
    method: AsymmetricMethod,
    data: Data,
    key: string,
    options?: {
      encoding?: Encoding;
    },
  ) {
    const [keyType, methodType] = method.split('-');

    if (keyType !== 'public' && keyType !== 'private') {
      throw new Error('key type must be public or private');
    }

    if (methodType !== 'encrypt' && methodType !== 'decrypt') {
      throw new Error('method type must be encrypt or decrypt');
    }

    let buf: Buffer;
    if (typeof data === 'string') {
      buf = Buffer.from(data, options?.encoding || 'utf8');
    } else {
      buf = data;
    }

    const padding = crypto.constants.RSA_PKCS1_PADDING;
    const inputLength = buf.byteLength;
    const bufs = [];

    const MAX_BLOCK = methodType === 'encrypt' ? this.MAX_ENCRYPT_BLOCK : this.MAX_DECRYPT_BLOCK;

    let offset = 0;
    let endOffset = MAX_BLOCK;

    while (inputLength - offset > 0) {
      let start = offset;
      let end = endOffset;

      if (inputLength - offset <= MAX_BLOCK) {
        end = inputLength;
      }

      const bufTemp = buf.slice(start, end);

      let bufBlock: Buffer;
      if (method === 'public-encrypt') {
        bufBlock = crypto.publicEncrypt({ key, padding }, bufTemp);
      } else if (method === 'public-decrypt') {
        bufBlock = crypto.publicDecrypt({ key, padding }, bufTemp);
      } else if (method === 'private-encrypt') {
        bufBlock = crypto.privateEncrypt({ key, padding }, bufTemp);
      } else {
        bufBlock = crypto.privateDecrypt({ key, padding }, bufTemp);
      }

      bufs.push(bufBlock);

      offset += MAX_BLOCK;
      endOffset += MAX_BLOCK;
    }

    const result = Buffer.concat(bufs);

    return result;
  }

  publicEncrypt(data: Data, publicKey: string, options?: { encoding: Encoding }) {
    return this.parseAsymmetricData('public-encrypt', data, publicKey, options);
  }

  publicDecrypt(data: Data, publicKey: string, options?: { encoding?: Encoding }) {
    return this.parseAsymmetricData('public-decrypt', data, publicKey, options);
  }

  privateEncrypt(data: Data, privateKey: string, options?: { encoding: Encoding }) {
    return this.parseAsymmetricData('private-encrypt', data, privateKey, options);
  }

  privateDecrypt(data: Data, privateKey: string, options?: { encoding?: Encoding }) {
    return this.parseAsymmetricData('private-decrypt', data, privateKey, options);
  }

  async generateRSAKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const generateOptions = {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    };

    return new Promise((resolve, reject) => {
      crypto.generateKeyPair('rsa', generateOptions, (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        }

        resolve({
          publicKey: publicKey.toString(),
          privateKey: privateKey.toString(),
        });
      });
    });
  }
}

export const ncrypto = new NicoCrypto();
