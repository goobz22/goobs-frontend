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
import os from 'os'

const pipelineAsync = promisify(pipeline)

type EncryptionAlgorithm = 'aes-256-gcm' | 'aes-192-gcm' | 'aes-128-gcm'

interface Config {
  algorithm: EncryptionAlgorithm
  storageDir: string
  secureDir: string
  keyFileName: string
  ivFileName: string
  keyCheckIntervalMs: number
  compressionLevel: -1 | 0 | 1 | 9
  cacheSize: number
  cacheMaxAge: number
  persistenceInterval: number
  maxMemoryUsage: number | 'max'
  evictionPolicy: 'lru' | 'lfu' | 'random'
  forceReset: boolean
}

const defaultConfig: Config = {
  algorithm: 'aes-256-gcm',
  storageDir: path.join(process.cwd(), 'storage'),
  secureDir: path.join(process.cwd(), '.secure'),
  keyFileName: 'encryption_key',
  ivFileName: 'encryption_iv',
  keyCheckIntervalMs: 24 * 60 * 60 * 1000, // 24 hours
  compressionLevel: -1,
  cacheSize: 1000,
  cacheMaxAge: 60 * 60 * 1000, // 1 hour
  persistenceInterval: 5 * 60 * 1000, // 5 minutes
  maxMemoryUsage: 1024 * 1024 * 1024, // 1GB
  evictionPolicy: 'lru',
  forceReset: false,
}

let config: Config = { ...defaultConfig }

async function loadConfig(): Promise<void> {
  try {
    const configPath = path.join(process.cwd(), '.reusablestorerc')
    const configData = await fs.readFile(configPath, 'utf8')
    const userConfig = JSON.parse(configData)
    config = { ...defaultConfig, ...userConfig }
    if (config.maxMemoryUsage === 'max') {
      config.maxMemoryUsage = os.totalmem()
    }
    console.log('Configuration loaded successfully')
  } catch (error) {
    console.warn(
      'No .reusablestorerc file found or invalid. Using default configuration.'
    )
  }
}

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

const dataStore = new Map<string, DataValue>()

interface CacheItem<T> {
  value: T
  lastAccessed: number
  expirationDate: Date
}

const cache = new LRUCache<string, CacheItem<DataValue>>({
  max: config.cacheSize,
  ttl: config.cacheMaxAge,
})

const lock = new AsyncLock({
  timeout: 30000,
  maxPending: Infinity,
})

const pubsub = new EventEmitter()

const scriptContext = vm.createContext({})

let encryptionUtility: EncryptionUtility
let lastKeyRotation: number = 0
let isInitialized = false

async function ensureDirectories(): Promise<void> {
  try {
    await fs.mkdir(config.storageDir, { recursive: true })
    await fs.mkdir(config.secureDir, { recursive: true })
    console.log('Directories created successfully')
  } catch (error) {
    console.error(
      `Failed to create necessary directories: ${(error as Error).message}`
    )
    console.error('Stack trace:', (error as Error).stack)
    throw new StorageError(
      `Failed to create necessary directories: ${(error as Error).message}`
    )
  }
}

class EncryptionUtility {
  private key: Buffer
  private iv: Buffer

  constructor(key: Buffer, iv: Buffer) {
    this.key = key
    this.iv = iv
  }

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
        console.error(`Encryption failed: ${(error as Error).message}`)
        console.error('Stack trace:', (error as Error).stack)
        reject(
          new EncryptionError(`Encryption failed: ${(error as Error).message}`)
        )
      }
    })
  }

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
        console.error(`Decryption failed: ${(error as Error).message}`)
        console.error('Stack trace:', (error as Error).stack)
        reject(
          new EncryptionError(`Decryption failed: ${(error as Error).message}`)
        )
      }
    })
  }
}

export async function initializeReusableStore(): Promise<void> {
  if (isInitialized) {
    console.log('ReusableStore already initialized')
    return
  }

  try {
    await loadConfig()
    await ensureDirectories()

    if (config.forceReset) {
      console.log(
        'Force reset option detected. Generating new encryption material...'
      )
      await generateEncryptionMaterial()
    }

    const { key, iv } = await getEncryptionMaterial()
    encryptionUtility = new EncryptionUtility(key, iv)

    try {
      await checkKeyIntegrity()
    } catch (error) {
      console.error(
        'Key integrity check failed. Attempting to generate new encryption material...'
      )
      await generateEncryptionMaterial()
      const { key: newKey, iv: newIV } = await getEncryptionMaterial()
      encryptionUtility = new EncryptionUtility(newKey, newIV)
      await checkKeyIntegrity()
    }

    await loadPersistedData()
    isInitialized = true
    console.log('ReusableStore initialized successfully')
  } catch (error) {
    console.error(`Initialization failed: ${(error as Error).message}`)
    console.error('Stack trace:', (error as Error).stack)
    throw new Error(`Initialization failed: ${(error as Error).message}`)
  }
}

async function persistData(): Promise<void> {
  try {
    const snapshot = JSON.stringify(Array.from(dataStore.entries()))
    const compressedData = await compressData(snapshot)
    await fs.writeFile(
      path.join(config.storageDir, 'snapshot.gz'),
      compressedData
    )
    console.log('Data persisted successfully')
  } catch (error) {
    console.error(`Failed to persist data: ${(error as Error).message}`)
    console.error('Stack trace:', (error as Error).stack)
  }
}

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
    console.log('Persisted data loaded successfully')
  } catch (error) {
    console.error(`Failed to load persisted data: ${(error as Error).message}`)
    console.error('Stack trace:', (error as Error).stack)
  }
}

function manageMemory(): void {
  const memoryUsage = process.memoryUsage().heapUsed
  if (
    typeof config.maxMemoryUsage === 'number' &&
    memoryUsage > config.maxMemoryUsage
  ) {
    let keysToEvict: string[] = []
    switch (config.evictionPolicy) {
      case 'lru':
        keysToEvict = Array.from(dataStore.keys())
          .sort((a, b) => {
            const aAccessed = cache.get(a)?.lastAccessed || 0
            const bAccessed = cache.get(b)?.lastAccessed || 0
            return aAccessed - bAccessed
          })
          .slice(0, Math.floor(dataStore.size * 0.1))
        break
      case 'random':
        keysToEvict = Array.from(dataStore.keys())
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(dataStore.size * 0.1))
        break
    }
    for (const key of keysToEvict) {
      dataStore.delete(key)
      cache.delete(key)
    }
    console.log(`Memory managed: Evicted ${keysToEvict.length} items`)
  }
}

function setCacheItem(
  key: string,
  value: DataValue,
  expirationDate: Date
): void {
  cache.set(key, { value, lastAccessed: Date.now(), expirationDate })
}

function getCacheItem(key: string): DataValue | undefined {
  const item = cache.get(key)
  if (item && item.expirationDate > new Date()) {
    item.lastAccessed = Date.now()
    return item.value
  }
  return undefined
}

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
    console.error(`Script execution failed: ${(error as Error).message}`)
    console.error('Stack trace:', (error as Error).stack)
    throw new Error(`Script execution failed: ${(error as Error).message}`)
  }
}

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

async function getEncryptionMaterial(): Promise<{ key: Buffer; iv: Buffer }> {
  try {
    const key = await fs.readFile(
      path.join(config.secureDir, config.keyFileName)
    )
    const iv = await fs.readFile(path.join(config.secureDir, config.ivFileName))
    console.log('Encryption material loaded successfully')
    return { key, iv }
  } catch (error) {
    console.log(
      'Encryption material not found. Generating new encryption material...'
    )
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
    console.log('New encryption material generated and saved successfully.')
    lastKeyRotation = Date.now()
    return { key, iv }
  } catch (error) {
    console.error(
      `Failed to write encryption material: ${(error as Error).message}`
    )
    console.error('Stack trace:', (error as Error).stack)
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
      throw new EncryptionError(
        `Encryption material has incorrect length. Key length: ${key.length}, IV length: ${iv.length}`
      )
    }
    console.log('Key integrity check passed successfully.')
  } catch (error) {
    console.error(`Key integrity check failed: ${(error as Error).message}`)
    console.error('Stack trace:', (error as Error).stack)
    throw new EncryptionError(
      `Key integrity check failed: ${(error as Error).message}`
    )
  }
}

export async function checkAndRotateKeys(): Promise<void> {
  if (!isInitialized) {
    console.log(
      'ReusableStore not initialized. Skipping key check and rotation.'
    )
    return
  }

  try {
    await checkKeyIntegrity()
    const now = Date.now()
    if (now - lastKeyRotation >= config.keyCheckIntervalMs) {
      await rotateEncryptionKeys()
    } else {
      console.log(
        'Skipping key rotation: Not enough time has passed since last rotation.'
      )
    }
  } catch (error) {
    console.error('Error during key check and rotation:', error)
  }
}

async function rotateEncryptionKeys(): Promise<void> {
  try {
    const { key: newKey, iv: newIV } = await generateEncryptionMaterial()
    const newEncryptionUtility = new EncryptionUtility(newKey, newIV)

    for (const [key, value] of dataStore.entries()) {
      if (value.type === 'string') {
        const decrypted = await encryptionUtility.decrypt(
          value.value,
          'authTag'
        )
        const { encryptedData } = await newEncryptionUtility.encrypt(decrypted)
        dataStore.set(key, { type: 'string', value: encryptedData })
      }
    }

    encryptionUtility = newEncryptionUtility
    lastKeyRotation = Date.now()
    console.log('Encryption keys rotated successfully')
  } catch (error) {
    console.error(
      `Failed to rotate encryption keys: ${(error as Error).message}`
    )
    console.error('Stack trace:', (error as Error).stack)
    throw new EncryptionError(
      `Failed to rotate encryption keys: ${(error as Error).message}`
    )
  }
}

async function generateStreamId(): Promise<string> {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `${timestamp}-${random}`
}

export async function cleanupReusableStore(): Promise<void> {
  if (!isInitialized) {
    console.log('ReusableStore not initialized. Skipping cleanup.')
    return
  }

  const transaction = await multi()
  const now = new Date()
  for (const [key, item] of cache.entries()) {
    if (item.expirationDate <= now) {
      transaction.exec(async () => {
        const result = await executeLuaScript(
          'return "delete"',
          [key],
          [item.expirationDate.toISOString()]
        )
        if (result === 'delete') {
          cache.delete(key)
          dataStore.delete(key)
          await pubsub.emit('deleted', key)
        }
      })
    }
  }
  await transaction.commit()
  await pubsub.emit('cleanup', null)
  console.log('ReusableStore cleanup completed')
}

export async function setReusableStore(
  key: string,
  value: DataValue,
  expirationDate: Date,
  identifier: string,
  script?: string
): Promise<void> {
  if (!isInitialized) {
    throw new Error(
      'ReusableStore not initialized. Call initializeReusableStore() first.'
    )
  }

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
        [`${identifier}:${key}`],
        [JSON.stringify(value), expirationDate.toISOString()]
      )
      if (result !== null) {
        value = JSON.parse(result as string) as DataValue
      }
    }

    const transaction = await multi()
    transaction.exec(async () => {
      dataStore.set(`${identifier}:${key}`, value)
      setCacheItem(`${identifier}:${key}`, value, expirationDate)
    })
    await transaction.commit()
    await pubsub.emit('set', {
      key: `${identifier}:${key}`,
      value,
      expirationDate,
    })
    console.log(`Value set for key: ${identifier}:${key}`)
  })
}

export async function updateReusableStore(
  key: string,
  value: DataValue,
  expirationDate: Date,
  identifier: string,
  script?: string
): Promise<void> {
  if (!isInitialized) {
    throw new Error(
      'ReusableStore not initialized. Call initializeReusableStore() first.'
    )
  }

  await lock.acquire(key, async () => {
    const existingItem =
      getCacheItem(`${identifier}:${key}`) ||
      dataStore.get(`${identifier}:${key}`)
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
        [`${identifier}:${key}`],
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
      dataStore.set(`${identifier}:${key}`, value)
      setCacheItem(`${identifier}:${key}`, value, expirationDate)
    })
    await transaction.commit()
    await pubsub.emit('updated', {
      key: `${identifier}:${key}`,
      value,
      expirationDate,
    })
    console.log(`Value updated for key: ${identifier}:${key}`)
  })
}

export async function deleteReusableStore(
  key: string,
  identifier: string,
  script?: string
): Promise<void> {
  if (!isInitialized) {
    throw new Error(
      'ReusableStore not initialized. Call initializeReusableStore() first.'
    )
  }

  await lock.acquire(key, async () => {
    const existingItem =
      getCacheItem(`${identifier}:${key}`) ||
      dataStore.get(`${identifier}:${key}`)

    if (script) {
      const result = await executeLuaScript(
        script,
        [`${identifier}:${key}`],
        [JSON.stringify(existingItem)]
      )
      if (result === 'cancel') {
        console.log(`Deletion cancelled for key: ${identifier}:${key}`)
        return // Cancel deletion if script returns 'cancel'
      }
    }

    const transaction = await multi()
    transaction.exec(async () => {
      dataStore.delete(`${identifier}:${key}`)
      cache.delete(`${identifier}:${key}`)
    })
    await transaction.commit()
    await pubsub.emit('deleted', `${identifier}:${key}`)
    console.log(`Value deleted for key: ${identifier}:${key}`)
  })
}

export async function subscribeToStoreEvents(
  event: 'set' | 'updated' | 'deleted' | 'cleanup',
  callback: (data: unknown) => Promise<void>
): Promise<void> {
  pubsub.on(event, async (data: unknown) => {
    await callback(data)
  })
  console.log(`Subscribed to event: ${event}`)
}

export async function getReusableStore(
  key: string,
  identifier: string
): Promise<DataValue | undefined> {
  if (!isInitialized) {
    throw new Error(
      'ReusableStore not initialized. Call initializeReusableStore() first.'
    )
  }

  return await lock.acquire(key, async () => {
    const fullKey = `${identifier}:${key}`
    const cachedItem = getCacheItem(fullKey)
    if (cachedItem) {
      console.log(`Cache hit for key: ${fullKey}`)
      return cachedItem
    }

    const storedItem = dataStore.get(fullKey)
    if (!storedItem) {
      console.log(`Item not found for key: ${fullKey}`)
      return undefined
    }

    if (storedItem.type === 'string') {
      try {
        const decrypted = await encryptionUtility.decrypt(
          storedItem.value,
          'authTag'
        )
        storedItem.value = decrypted
      } catch (error) {
        console.error(`Failed to decrypt value for key ${fullKey}:`, error)
      }
    }

    setCacheItem(fullKey, storedItem, new Date(Date.now() + config.cacheMaxAge))
    console.log(`Value retrieved and cached for key: ${fullKey}`)

    return storedItem
  })
}

export async function persistReusableStore(): Promise<void> {
  if (!isInitialized) {
    throw new Error(
      'ReusableStore not initialized. Call initializeReusableStore() first.'
    )
  }
  await persistData()
}

// Schedule periodic tasks
setInterval(async () => {
  if (isInitialized) {
    await persistData()
    manageMemory()
  }
}, config.persistenceInterval)
