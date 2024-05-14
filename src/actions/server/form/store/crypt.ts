import crypto from 'crypto'

const algorithm = 'aes-256-cbc'

function createEncryptionUtility(key: string, iv: string) {
  const keyBuffer = Buffer.from(key, 'hex')
  const ivBuffer = Buffer.from(iv, 'base64')

  function encrypt(value: string): string {
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer)
    let encrypted = cipher.update(value, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
  }

  function decrypt(encryptedValue: string): string {
    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer)
    let decrypted = decipher.update(encryptedValue, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }

  return {
    encrypt,
    decrypt,
  }
}

export function encryptValue(
  value: string,
  encryptionKey: string,
  encryptionIV: string
): string {
  const encryptionUtility = createEncryptionUtility(encryptionKey, encryptionIV)
  const encryptedValue = encryptionUtility.encrypt(value)
  return encryptedValue
}

export function decryptValue(
  encryptedValue: string,
  encryptionKey: string,
  encryptionIV: string
): string {
  const encryptionUtility = createEncryptionUtility(encryptionKey, encryptionIV)
  const decryptedValue = encryptionUtility.decrypt(encryptedValue)
  return decryptedValue
}
