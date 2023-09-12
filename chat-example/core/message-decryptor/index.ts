import * as crypto from 'crypto';

export class RSADecryptor {
  private privateKey: crypto.KeyObject;

  constructor(privateKey: string) {
    this.privateKey = crypto.createPrivateKey(privateKey);
  }

  execute(encryptedMessage: string): string {
    const encryptedBuffer = Buffer.from(encryptedMessage, 'base64');
    const decryptedBuffer = crypto.privateDecrypt({ key: this.privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, encryptedBuffer);
    return decryptedBuffer.toString('utf-8');
  }
}

export function decryptMessage(key: string, encryptedMessage: string): string {
  // create instance of RSADecryptor class
  const rsaDecryptor = new RSADecryptor(key);
  // return decrypted message
  return rsaDecryptor.execute(encryptedMessage);
}
