import * as crypto from 'crypto';

export class RSACryptor {
  private publicKey: crypto.KeyObject;

  constructor(publicKey: string) {
    this.publicKey = crypto.createPublicKey(publicKey);
  }

  execute(message: string): string {
    const encryptedBuffer = crypto.publicEncrypt({ key: this.publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(message, 'utf-8'));
    return encryptedBuffer.toString('base64');
  }
}

// create method that accept string message and return encrypted message with RSACryptor class
export function encryptMessage(key: string, message: string): string {
    // create instance of RSACryptor class
    const rsaCryptor = new RSACryptor(key);
    // return encrypted message
    return rsaCryptor.execute(message);
}
