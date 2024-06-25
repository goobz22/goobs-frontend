'use server'

import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { promisify } from 'util'
import { createGunzip, createGzip, ZlibOptions } from 'zlib'
import { pipeline, Readable } from 'stream'
import LRUCache from 'lru-cache'
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
      cache.del(key)
    }
  }
}

// Function to set a cache item
function setCacheItem(key: string, value: DataValue): void {
  cache.set(key, { value, lastAccessed: Date.now() })
}

// Function to get a cache item
function getCacheItem(key: string): DataValue | undefined {
  const item = cache.get(key)
  if (item) {
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
): Promise<any> {
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

// Pub/Sub functions
async function publish(channel: string, message: string): Promise<void> {
  pubsub.emit(channel, message)
}

async function subscribe(
  channel: string,
  callback: (message: string) => void
): Promise<void> {
  pubsub.on(channel, callback)
}

// Stream functions
async function xadd(
  key: string,
  id: string,
  fields: Record<string, string>
): Promise<string> {
  await lock.acquire(key, () => {
    let stream = dataStore.get(key) as StreamValue
    if (!stream || stream.type !== 'stream') {
      stream = { type: 'stream', value: [] }
      dataStore.set(key, stream)
    }
    stream.value.push({ id, fields })
    setCacheItem(key, stream)
    return id
  })
  return id
}

async function xrange(
  key: string,
  start: string,
  end: string,
  count?: number
): Promise<Array<{ id: string; fields: Record<string, string> }>> {
  const stream =
    (getCacheItem(key) as StreamValue) || (dataStore.get(key) as StreamValue)
  if (!stream || stream.type !== 'stream') {
    return []
  }
  let result = stream.value.filter(item => item.id >= start && item.id <= end)
  if (count !== undefined) {
    result = result.slice(0, count)
  }
  return result
}

// String operations
async function set(key: string, value: string): Promise<void> {
  await lock.acquire(key, () => {
    const item: StringValue = { type: 'string', value }
    dataStore.set(key, item)
    setCacheItem(key, item)
  })
}

async function get(key: string): Promise<string | null> {
  const cached = getCacheItem(key)
  if (cached && cached.type === 'string') {
    return cached.value
  }
  const stored = dataStore.get(key)
  if (stored && stored.type === 'string') {
    setCacheItem(key, stored)
    return stored.value
  }
  return null
}

// List operations
async function lpush(key: string, ...values: string[]): Promise<number> {
  return await lock.acquire(key, () => {
    let list = dataStore.get(key) as ListValue
    if (!list || list.type !== 'list') {
      list = { type: 'list', value: [] }
      dataStore.set(key, list)
    }
    list.value.unshift(...values)
    setCacheItem(key, list)
    return list.value.length
  })
}

async function rpop(key: string): Promise<string | null> {
  return await lock.acquire(key, () => {
    const list = dataStore.get(key) as ListValue
    if (!list || list.type !== 'list' || list.value.length === 0) {
      return null
    }
    const value = list.value.pop()!
    setCacheItem(key, list)
    return value
  })
}

// Set operations
async function sadd(key: string, ...members: string[]): Promise<number> {
  return await lock.acquire(key, () => {
    let set = dataStore.get(key) as SetValue
    if (!set || set.type !== 'set') {
      set = { type: 'set', value: new Set() }
      dataStore.set(key, set)
    }
    let added = 0
    for (const member of members) {
      if (!set.value.has(member)) {
        set.value.add(member)
        added++
      }
    }
    setCacheItem(key, set)
    return added
  })
}

async function smembers(key: string): Promise<string[]> {
  const set =
    (getCacheItem(key) as SetValue) || (dataStore.get(key) as SetValue)
  if (!set || set.type !== 'set') {
    return []
  }
  return Array.from(set.value)
}

// Hash operations
async function hset(
  key: string,
  field: string,
  value: string
): Promise<number> {
  return await lock.acquire(key, () => {
    let hash = dataStore.get(key) as HashValue
    if (!hash || hash.type !== 'hash') {
      hash = { type: 'hash', value: new Map() }
      dataStore.set(key, hash)
    }
    const isNew = !hash.value.has(field)
    hash.value.set(field, value)
    setCacheItem(key, hash)
    return isNew ? 1 : 0
  })
}

async function hget(key: string, field: string): Promise<string | null> {
  const hash =
    (getCacheItem(key) as HashValue) || (dataStore.get(key) as HashValue)
  if (!hash || hash.type !== 'hash') {
    return null
  }
  return hash.value.get(field) || null
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
        const { encryptedData, authTag } =
          await newEncryptionUtility.encrypt(decrypted)
        dataStore.set(key, { type: 'string', value: encryptedData })
        // Store new authTag
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
function generateStreamId(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `${timestamp}-${random}`
}

// Additional stream functions
async function xread(
  keys: string[],
  ids: string[],
  count?: number,
  block?: number
): Promise<
  Record<string, Array<{ id: string; fields: Record<string, string> }>>
> {
  const result: Record<
    string,
    Array<{ id: string; fields: Record<string, string> }>
  > = {}

  const readOperation = async () => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const id = ids[i]
      const stream =
        (getCacheItem(key) as StreamValue) ||
        (dataStore.get(key) as StreamValue)
      if (stream && stream.type === 'stream') {
        const entries = stream.value.filter(entry => entry.id > id)
        if (entries.length > 0) {
          result[key] = count ? entries.slice(0, count) : entries
        }
      }
    }
    return Object.keys(result).length > 0
  }

  if (block !== undefined) {
    const startTime = Date.now()
    while (Date.now() - startTime < block) {
      if (await readOperation()) {
        break
      }
      await new Promise(resolve => setTimeout(resolve, 100)) // Wait 100ms before checking again
    }
  } else {
    await readOperation()
  }

  return result
}

// Sorted Set operations
async function zadd(
  key: string,
  score: number,
  member: string
): Promise<number> {
  return await lock.acquire(key, () => {
    let sortedSet = dataStore.get(key) as ZSetValue | undefined
    if (!sortedSet || sortedSet.type !== 'zset') {
      sortedSet = { type: 'zset', value: new Map() }
      dataStore.set(key, sortedSet)
    }
    const isNew = !sortedSet.value.has(member)
    sortedSet.value.set(member, score)
    setCacheItem(key, sortedSet)
    return isNew ? 1 : 0
  })
}

async function zrange(
  key: string,
  start: number,
  stop: number,
  withScores: boolean = false
): Promise<string[] | Array<[string, number]>> {
  const sortedSet =
    (getCacheItem(key) as { type: 'zset'; value: Map<string, number> }) ||
    (dataStore.get(key) as { type: 'zset'; value: Map<string, number> })
  if (!sortedSet || sortedSet.type !== 'zset') {
    return []
  }
  const entries = Array.from(sortedSet.value.entries()).sort(
    (a, b) => a[1] - b[1]
  )
  const slicedEntries = entries.slice(start, stop + 1)
  return withScores ? slicedEntries : slicedEntries.map(([member]) => member)
}

// Hyperloglog operations (simplified implementation)
async function pfadd(key: string, ...elements: string[]): Promise<number> {
  return await lock.acquire(key, () => {
    let hll = dataStore.get(key) as DataValue | undefined
    if (!hll || hll.type !== 'hll') {
      hll = { type: 'hll', value: new Set() }
      dataStore.set(key, hll)
    }
    const initialSize = hll.value.size
    elements.forEach(element => hll.value.add(element))
    setCacheItem(key, hll)
    return hll.value.size > initialSize ? 1 : 0
  })
}

async function pfcount(key: string): Promise<number> {
  const hll =
    (getCacheItem(key) as { type: 'hll'; value: Set<string> }) ||
    (dataStore.get(key) as { type: 'hll'; value: Set<string> })
  if (!hll || hll.type !== 'hll') {
    return 0
  }
  return hll.value.size
}

// Geo operations (simplified implementation without actual geo calculations)
async function geoadd(
  key: string,
  longitude: number,
  latitude: number,
  member: string
): Promise<number> {
  return await lock.acquire(key, () => {
    let geo = dataStore.get(key) as DataValue | undefined
    if (!geo || geo.type !== 'geo') {
      geo = { type: 'geo', value: new Map() }
      dataStore.set(key, geo)
    }
    const isNew = !geo.value.has(member)
    geo.value.set(member, [longitude, latitude])
    setCacheItem(key, geo)
    return isNew ? 1 : 0
  })
}

async function geopos(
  key: string,
  member: string
): Promise<[number, number] | null> {
  const geo =
    (getCacheItem(key) as {
      type: 'geo'
      value: Map<string, [number, number]>
    }) ||
    (dataStore.get(key) as {
      type: 'geo'
      value: Map<string, [number, number]>
    })
  if (!geo || geo.type !== 'geo') {
    return null
  }
  return geo.value.get(member) || null
}

// Initialize the store
initialize().catch(error => {
  console.error('Failed to initialize the store:', error)
  process.exit(1)
})

// Export functions
export {
  set,
  get,
  lpush,
  rpop,
  sadd,
  smembers,
  hset,
  hget,
  xadd,
  xrange,
  xread,
  zadd,
  zrange,
  pfadd,
  pfcount,
  geoadd,
  geopos,
  publish,
  subscribe,
  multi,
  executeLuaScript,
}
