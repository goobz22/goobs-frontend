import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
const keyLength = 32 // Key length in bytes for AES-256

interface CryptoConfig {
  key: Buffer
  iv: Buffer
}

let encryptionConfig: CryptoConfig | null = null

class DecryptionUtility {
  static decrypt(encryptedValue: string, config: CryptoConfig): string {
    if (!config || !config.key || !config.iv) {
      throw new Error('Decryption configuration missing key or IV.')
    }
    const decipher = crypto.createDecipheriv(algorithm, config.key, config.iv)
    let decrypted = decipher.update(encryptedValue, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}

export async function decryptValue(encryptedValue: string): Promise<string> {
  if (!encryptionConfig) {
    throw new Error('Encryption configuration not initialized.')
  }
  return DecryptionUtility.decrypt(encryptedValue, encryptionConfig)
}

class EncryptionUtility {
  private config: CryptoConfig

  constructor(config: CryptoConfig) {
    if (
      !config.key ||
      config.key.length !== keyLength ||
      !config.iv ||
      config.iv.length !== 16
    ) {
      throw new Error('Encryption configuration has invalid key or IV length.')
    }
    this.config = config
  }

  encrypt(value: string): string {
    const cipher = crypto.createCipheriv(
      algorithm,
      this.config.key,
      this.config.iv
    )
    let encrypted = cipher.update(value, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
  }
}

export async function createEncryptionUtility(): Promise<EncryptionUtility> {
  if (!encryptionConfig) {
    const key = crypto.randomBytes(keyLength)
    const iv = crypto.randomBytes(16)
    encryptionConfig = { key, iv }
  }
  return new EncryptionUtility(encryptionConfig)
}

export async function getAlgorithm(): Promise<string> {
  return algorithm
}
