// This code generates a new RSA key pair and returns the
// private and public keys as strings.

import * as crypto from 'crypto';

export class KeyPairGenerator {
  private privateKey: crypto.KeyObject;
  private publicKey: crypto.KeyObject;

  constructor() {
    // Generate a new RSA key pair.
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    // Store the keys in the class instance.
    this.privateKey = crypto.createPrivateKey(privateKey);
    this.publicKey = crypto.createPublicKey(publicKey);
  }

  // Returns the private key as a PEM-encoded PKCS#8 string.
  getPrivateKey(): string {
    return this.privateKey.export({ format: 'pem', type: 'pkcs8' }).toString();
  }

  // Returns the public key as a PEM-encoded SPKI string.
  getPublicKey(): string {
    return this.publicKey.export({ format: 'pem', type: 'spki' }).toString();
  }
}

export function generateKeys() {
    // Generate a new key pair.
    const keyPairGenerator = new KeyPairGenerator();

    // Get the keys as string representations.
    const privateKey = keyPairGenerator.getPrivateKey();
    const publicKey = keyPairGenerator.getPublicKey();
    return { privateKey, publicKey };
}
