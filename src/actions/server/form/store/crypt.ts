'use server'

import crypto from 'crypto'

const algorithm = 'aes-256-cbc'

export async function encryptValue(
  value: string,
  encryptionKey: string,
  encryptionIV: string
): Promise<string> {
  const keyBuffer = Buffer.from(encryptionKey, 'hex')
  const ivBuffer = Buffer.from(encryptionIV, 'base64')

  const cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer)
  let encrypted = cipher.update(value, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return encrypted
}

export async function decryptValue(
  encryptedValue: string,
  encryptionKey: string,
  encryptionIV: string
): Promise<string> {
  const keyBuffer = Buffer.from(encryptionKey, 'hex')
  const ivBuffer = Buffer.from(encryptionIV, 'base64')

  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer)
  let decrypted = decipher.update(encryptedValue, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
