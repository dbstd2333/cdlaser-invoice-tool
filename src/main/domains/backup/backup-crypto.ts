import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

/**
 * 备份加密/解密工具。
 * 使用 scrypt 派生密钥，AES-256-GCM 加解密。
 */

/** 用恢复密码通过 scrypt 派生 AES-256 密钥 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return scryptSync(password, salt, 32);
}

/** AES-256-GCM 加密 */
export function encryptData(data: Buffer, password: string): { encrypted: Buffer; salt: Buffer; iv: Buffer; tag: Buffer } {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = deriveKey(password, salt);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { encrypted, salt, iv, tag };
}

/** AES-256-GCM 解密 */
export function decryptData(encrypted: Buffer, salt: Buffer, iv: Buffer, tag: Buffer, password: string): Buffer {
  const key = deriveKey(password, salt);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}
