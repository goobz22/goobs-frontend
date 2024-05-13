import crypto from 'crypto'

const algorithm = 'aes-256-cbc'

const encryptionKey: string = process.env.ENCRYPTION_KEY || ''
const encryptionIV: string = process.env.ENCRYPTION_IV || ''

class EncryptionUtility {
  private key: Buffer
  private iv: Buffer

  constructor(key: string, iv: string) {
    this.key = Buffer.from(key, 'hex')
    this.iv = Buffer.from(iv, 'base64')
  }

  encrypt(value: string): string {
    const cipher = crypto.createCipheriv(algorithm, this.key, this.iv)
    let encrypted = cipher.update(value, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
  }

  decrypt(encryptedValue: string): string {
    const decipher = crypto.createDecipheriv(algorithm, this.key, this.iv)
    let decrypted = decipher.update(encryptedValue, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}

export async function encryptValue(value: string): Promise<string> {
  const encryptionUtility = new EncryptionUtility(encryptionKey, encryptionIV)
  const encryptedValue = encryptionUtility.encrypt(value)
  return encryptedValue
}

export async function decryptValue(encryptedValue: string): Promise<string> {
  const encryptionUtility = new EncryptionUtility(encryptionKey, encryptionIV)
  const decryptedValue = encryptionUtility.decrypt(encryptedValue)
  return decryptedValue
}
