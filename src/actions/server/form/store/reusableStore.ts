'use server'

import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { promisify } from 'util'
import { createGunzip, createGzip, ZlibOptions } from 'zlib'
import { pipeline, Readable } from 'stream'
import { LRUCache } from 'lru-cache'
import { EventEmitter } from 'events'
import AsyncLock from 'async-lock'
import vm from 'vm'

// Promisify the pipeline function for use with async/await
const pipelineAsync = promisify(pipeline)

// Define the supported encryption algorithms
type EncryptionAlgorithm = 'aes-256-gcm' | 'aes-192-gcm' | 'aes-128-gcm'

// Configuration interface with options for various features
interface Config {
  algorithm: EncryptionAlgorithm
  storageDir: string
  secureDir: string
  keyFileName: string
  ivFileName: string
  keyCheckIntervalMs: number
  keyRotationIntervalMs: number
  compressionLevel: -1 | 0 | 1 | 9
  cacheSize: number
  cacheMaxAge: number
  persistenceInterval: number
  maxMemoryUsage: number
  evictionPolicy: 'lru' | 'lfu' | 'random'
}

// Configuration object with default values
const config: Config = {
  algorithm: 'aes-256-gcm',
  storageDir: process.env.STORAGE_DIR || path.join(process.cwd(), 'storage'),
  secureDir: process.env.SECURE_DIR || path.join(process.cwd(), '.secure'),
  keyFileName: 'encryption_key',
  ivFileName: 'encryption_iv',
  keyCheckIntervalMs: 24 * 60 * 60 * 1000, // 24 hours
  keyRotationIntervalMs: 30 * 24 * 60 * 60 * 1000, // 30 days
  compressionLevel: -1, // Default compression
  cacheSize: 1000,
  cacheMaxAge: 60 * 60 * 1000, // 1 hour
  persistenceInterval: 5 * 60 * 1000, // 5 minutes
  maxMemoryUsage: 1024 * 1024 * 1024, // 1GB
  evictionPolicy: 'lru',
}

// Custom error classes for more specific error handling
class EncryptionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EncryptionError'
  }
}

class StorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StorageError'
  }
}

// Define various data structures
interface StringValue {
  type: 'string'
  value: string
}

interface ListValue {
  type: 'list'
  value: string[]
}

interface SetValue {
  type: 'set'
  value: Set<string>
}

interface HashValue {
  type: 'hash'
  value: Map<string, string>
}

interface StreamValue {
  type: 'stream'
  value: Array<{ id: string; fields: Record<string, string> }>
}

interface ZSetValue {
  type: 'zset'
  value: Map<string, number>
}

interface HLLValue {
  type: 'hll'
  value: Set<string>
}

interface GeoValue {
  type: 'geo'
  value: Map<string, [number, number]>
}

type DataValue =
  | StringValue
  | ListValue
  | SetValue
  | HashValue
  | StreamValue
  | ZSetValue
  | HLLValue
  | GeoValue

// Main data store
const dataStore = new Map<string, DataValue>()

// Interface for cache items with last accessed timestamp
interface CacheItem<T> {
  value: T
  lastAccessed: number
  expirationDate: Date
}

// LRU cache for frequently accessed items
const cache = new LRUCache<string, CacheItem<DataValue>>({
  max: config.cacheSize,
  ttl: config.cacheMaxAge,
})

// Async lock for handling concurrency
const lock = new AsyncLock()

// Event emitter for pub/sub functionality
const pubsub = new EventEmitter()

// Create a context for running scripts
const scriptContext = vm.createContext({
  // Add any safe globals here
})

// Async function to ensure necessary directories exist
async function ensureDirectories(): Promise<void> {
  try {
    await fs.mkdir(config.storageDir, { recursive: true })
    await fs.mkdir(config.secureDir, { recursive: true })
  } catch (error) {
    throw new StorageError(
      `Failed to create necessary directories: ${(error as Error).message}`
    )
  }
}

// Encryption utility class
class EncryptionUtility {
  private key: Buffer
  private iv: Buffer

  constructor(key: Buffer, iv: Buffer) {
    this.key = key
    this.iv = iv
  }

  // Encrypt a string value
  async encrypt(
    value: string
  ): Promise<{ encryptedData: string; authTag: string }> {
    return new Promise((resolve, reject) => {
      try {
        const cipher = crypto.createCipheriv(
          config.algorithm,
          this.key,
          this.iv
        )
        let encrypted = cipher.update(value, 'utf8', 'hex')
        encrypted += cipher.final('hex')
        const authTag = cipher.getAuthTag().toString('hex')
        resolve({ encryptedData: encrypted, authTag })
      } catch (error) {
        reject(
          new EncryptionError(`Encryption failed: ${(error as Error).message}`)
        )
      }
    })
  }

  // Decrypt an encrypted value
  async decrypt(encryptedValue: string, authTag: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const decipher = crypto.createDecipheriv(
          config.algorithm,
          this.key,
          this.iv
        )
        decipher.setAuthTag(Buffer.from(authTag, 'hex'))
        let decrypted = decipher.update(encryptedValue, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        resolve(decrypted)
      } catch (error) {
        reject(
          new EncryptionError(`Decryption failed: ${(error as Error).message}`)
        )
      }
    })
  }
}

let encryptionUtility: EncryptionUtility

// Async function to initialize the system
async function initialize(): Promise<void> {
  try {
    await ensureDirectories()
    const { key, iv } = await getEncryptionMaterial()
    encryptionUtility = new EncryptionUtility(key, iv)
    await checkKeyIntegrity()

    // Set up periodic key integrity checks
    setInterval(async () => {
      try {
        await checkKeyIntegrity()
      } catch (error) {
        console.error('Key integrity check failed:', error)
      }
    }, config.keyCheckIntervalMs)

    // Set up automatic key rotation
    setInterval(async () => {
      try {
        await rotateEncryptionKeys()
      } catch (error) {
        console.error('Key rotation failed:', error)
      }
    }, config.keyRotationIntervalMs)

    // Set up persistence
    setInterval(async () => {
      await persistData()
    }, config.persistenceInterval)

    // Set up memory management
    setInterval(() => {
      manageMemory()
    }, 60000) // Check every minute

    // Load persisted data
    await loadPersistedData()
  } catch (error) {
    throw new Error(`Initialization failed: ${(error as Error).message}`)
  }
}

// Function to persist data to disk
async function persistData(): Promise<void> {
  const snapshot = JSON.stringify(Array.from(dataStore.entries()))
  const compressedData = await compressData(snapshot)
  await fs.writeFile(
    path.join(config.storageDir, 'snapshot.gz'),
    compressedData
  )
}

// Function to load persisted data
async function loadPersistedData(): Promise<void> {
  try {
    const compressedData = await fs.readFile(
      path.join(config.storageDir, 'snapshot.gz')
    )
    const decompressedData = await decompressData(compressedData)
    const loadedData = JSON.parse(decompressedData)
    dataStore.clear()
    for (const [key, value] of loadedData) {
      dataStore.set(key, value)
    }
  } catch (error) {
    console.error('Failed to load persisted data:', error)
  }
}

// Function to manage memory usage
function manageMemory(): void {
  const memoryUsage = process.memoryUsage().heapUsed
  if (memoryUsage > config.maxMemoryUsage) {
    let keysToEvict: string[] = []
    switch (config.evictionPolicy) {
      case 'lru':
        keysToEvict = Array.from(dataStore.keys())
          .sort((a, b) => {
            const aAccessed = cache.get(a)?.lastAccessed || 0
            const bAccessed = cache.get(b)?.lastAccessed || 0
            return aAccessed - bAccessed
          })
          .slice(0, Math.floor(dataStore.size * 0.1)) // Evict 10% of keys
        break
      case 'random':
        keysToEvict = Array.from(dataStore.keys())
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(dataStore.size * 0.1))
        break
      // Implement other eviction policies as needed
    }
    for (const key of keysToEvict) {
      dataStore.delete(key)
      cache.delete(key)
    }
  }
}

// Function to set a cache item
function setCacheItem(
  key: string,
  value: DataValue,
  expirationDate: Date
): void {
  cache.set(key, { value, lastAccessed: Date.now(), expirationDate })
}

// Function to get a cache item
function getCacheItem(key: string): DataValue | undefined {
  const item = cache.get(key)
  if (item && item.expirationDate > new Date()) {
    item.lastAccessed = Date.now()
    return item.value
  }
  return undefined
}

// Function to execute Lua-like script (now JavaScript)
async function executeLuaScript(
  script: string,
  keys: string[],
  args: string[]
): Promise<unknown> {
  try {
    const contextifiedScript = `
      const KEYS = ${JSON.stringify(keys)};
      const ARGV = ${JSON.stringify(args)};
      ${script}
    `
    return vm.runInContext(contextifiedScript, scriptContext, { timeout: 1000 })
  } catch (error) {
    throw new Error(`Script execution failed: ${(error as Error).message}`)
  }
}

// Function to start a transaction
async function multi(): Promise<Transaction> {
  return new Transaction()
}

class Transaction {
  private commands: Array<() => Promise<void>> = []

  exec(command: () => Promise<void>): void {
    this.commands.push(command)
  }

  async commit(): Promise<void> {
    await lock.acquire('transaction', async () => {
      for (const command of this.commands) {
        await command()
      }
    })
  }
}

// Helper functions for compression
async function compressData(data: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const gzip = createGzip({ level: config.compressionLevel } as ZlibOptions)
    const buffer = Buffer.from(data)
    const chunks: Buffer[] = []

    pipelineAsync(Readable.from(buffer), gzip)
      .then(() => {
        gzip.on('data', chunk => chunks.push(chunk))
        gzip.on('end', () => resolve(Buffer.concat(chunks)))
      })
      .catch(reject)
  })
}

async function decompressData(compressedData: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const gunzip = createGunzip()
    const chunks: Buffer[] = []

    pipelineAsync(Readable.from(compressedData), gunzip)
      .then(() => {
        gunzip.on('data', chunk => chunks.push(chunk))
        gunzip.on('end', () => resolve(Buffer.concat(chunks).toString()))
      })
      .catch(reject)
  })
}

// Helper functions for encryption
async function getEncryptionMaterial(): Promise<{ key: Buffer; iv: Buffer }> {
  try {
    const key = await fs.readFile(
      path.join(config.secureDir, config.keyFileName)
    )
    const iv = await fs.readFile(path.join(config.secureDir, config.ivFileName))
    return { key, iv }
  } catch (error) {
    console.log('Generating new encryption material...')
    return generateEncryptionMaterial()
  }
}

async function generateEncryptionMaterial(): Promise<{
  key: Buffer
  iv: Buffer
}> {
  const keySize = parseInt(config.algorithm.split('-')[1]) / 8
  const key = crypto.randomBytes(keySize)
  const iv = crypto.randomBytes(16)
  try {
    await fs.writeFile(path.join(config.secureDir, config.keyFileName), key)
    await fs.writeFile(path.join(config.secureDir, config.ivFileName), iv)
    return { key, iv }
  } catch (error) {
    throw new EncryptionError(
      `Failed to write encryption material: ${(error as Error).message}`
    )
  }
}

async function checkKeyIntegrity(): Promise<void> {
  try {
    const { key, iv } = await getEncryptionMaterial()
    const keySize = parseInt(config.algorithm.split('-')[1]) / 8
    if (key.length !== keySize || iv.length !== 16) {
      throw new EncryptionError('Encryption material has incorrect length')
    }
    // Additional integrity checks can be added here
  } catch (error) {
    throw new EncryptionError(
      `Key integrity check failed: ${(error as Error).message}`
    )
  }
}

async function rotateEncryptionKeys(): Promise<void> {
  try {
    const { key: newKey, iv: newIV } = await generateEncryptionMaterial()
    const newEncryptionUtility = new EncryptionUtility(newKey, newIV)

    // Re-encrypt all data with new keys
    for (const [key, value] of dataStore.entries()) {
      if (value.type === 'string') {
        const decrypted = await encryptionUtility.decrypt(
          value.value,
          'authTag'
        ) // Assume authTag is stored somewhere
        const { encryptedData } = await newEncryptionUtility.encrypt(decrypted)
        dataStore.set(key, { type: 'string', value: encryptedData })
        // Note: We should store the new authTag if we're using it elsewhere
      }
      // Handle other data types similarly
    }

    encryptionUtility = newEncryptionUtility
  } catch (error) {
    throw new EncryptionError(
      `Failed to rotate encryption keys: ${(error as Error).message}`
    )
  }
}

// Utility function to generate a unique ID for streams
async function generateStreamId(): Promise<string> {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `${timestamp}-${random}`
}

// The five main async functions
async function cleanupReusableStore(): Promise<void> {
  const transaction = await multi()
  const now = new Date()
  for (const [key, item] of cache.entries()) {
    if (item.expirationDate <= now) {
      transaction.exec(async () => {
        cache.delete(key)
        dataStore.delete(key)
        await pubsub.emit('deleted', key)
      })
    }
  }
  await transaction.commit()
  await pubsub.emit('cleanup', null)
}

async function setReusableStore(
  key: string,
  value: DataValue,
  expirationDate: Date,
  script?: string
): Promise<void> {
  await lock.acquire(key, async () => {
    if (value.type === 'stream') {
      value.value = await Promise.all(
        value.value.map(async item => ({
          ...item,
          id: item.id || (await generateStreamId()),
        }))
      )
    }

    if (script) {
      const result = await executeLuaScript(
        script,
        [key],
        [JSON.stringify(value), expirationDate.toISOString()]
      )
      if (result !== null) {
        value = JSON.parse(result as string) as DataValue
      }
    }

    const transaction = await multi()
    transaction.exec(async () => {
      dataStore.set(key, value)
      setCacheItem(key, value, expirationDate)
    })
    await transaction.commit()
    await pubsub.emit('set', { key, value, expirationDate })
  })
}

async function updateReusableStore(
  key: string,
  value: DataValue,
  expirationDate: Date,
  script?: string
): Promise<void> {
  await lock.acquire(key, async () => {
    const existingItem = getCacheItem(key) || dataStore.get(key)
    if (existingItem) {
      if (existingItem.type === 'string' && value.type === 'string') {
        value.value = `${existingItem.value}-${parseInt(existingItem.value.split('-').pop() || '0') + 1}`
      } else if (existingItem.type === 'stream' && value.type === 'stream') {
        value.value = await Promise.all(
          value.value.map(async item => ({
            ...item,
            id: item.id || (await generateStreamId()),
          }))
        )
        const existingIds = new Set(existingItem.value.map(item => item.id))
        value.value = [
          ...existingItem.value,
          ...value.value.filter(item => !existingIds.has(item.id)),
        ]
      }
    }

    if (script) {
      const result = await executeLuaScript(
        script,
        [key],
        [
          JSON.stringify(existingItem),
          JSON.stringify(value),
          expirationDate.toISOString(),
        ]
      )
      if (result !== null) {
        value = JSON.parse(result as string) as DataValue
      }
    }

    const transaction = await multi()
    transaction.exec(async () => {
      dataStore.set(key, value)
      setCacheItem(key, value, expirationDate)
    })
    await transaction.commit()
    await pubsub.emit('updated', { key, value, expirationDate })
  })
}

async function deleteReusableStore(
  key: string,
  script?: string
): Promise<void> {
  await lock.acquire(key, async () => {
    const existingItem = getCacheItem(key) || dataStore.get(key)

    if (script) {
      const result = await executeLuaScript(
        script,
        [key],
        [JSON.stringify(existingItem)]
      )
      if (result === 'cancel') {
        return // Cancel deletion if script returns 'cancel'
      }
    }

    const transaction = await multi()
    transaction.exec(async () => {
      dataStore.delete(key)
      cache.delete(key)
    })
    await transaction.commit()
    await pubsub.emit('deleted', key)
  })
}

async function subscribeToStoreEvents(
  event: 'set' | 'updated' | 'deleted' | 'cleanup',
  callback: (data: unknown) => Promise<void>
): Promise<void> {
  pubsub.on(event, async (data: unknown) => {
    await callback(data)
  })
}

// Initialize the store
initialize().catch(error => {
  console.error('Failed to initialize the store:', error)
  process.exit(1)
})

export {
  cleanupReusableStore,
  setReusableStore,
  updateReusableStore,
  deleteReusableStore,
  subscribeToStoreEvents,
}
