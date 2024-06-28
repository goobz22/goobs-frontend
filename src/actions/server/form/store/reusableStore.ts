'use server'
'use strict'

import crypto from 'crypto'
import { promisify } from 'util'
import { createGunzip, createGzip, ZlibOptions } from 'zlib'
import { pipeline, Readable } from 'stream'
import { LRUCache } from 'lru-cache'
import { EventEmitter } from 'events'
import AsyncLock from 'async-lock'
import os from 'os'
import {
  MongoClient,
  Db,
  MongoClientOptions,
  ObjectId,
  Filter,
  Document,
} from 'mongodb'

const pipelineAsync = promisify(pipeline)

type EncryptionAlgorithm = 'aes-256-gcm' | 'aes-192-gcm' | 'aes-128-gcm'
type StorageType = 'memory' | 'mongodb'

interface Config {
  algorithm: EncryptionAlgorithm
  compressionLevel: -1 | 0 | 1 | 9
  cacheSize: number
  cacheMaxAge: number
  persistenceInterval: number
  maxMemoryUsage: number | 'max'
  evictionPolicy: 'lru' | 'lfu' | 'random'
  forceReset: boolean
  storageType: StorageType
  mongodbUri: string
  mongoPoolSize: number
  prefetchThreshold: number
  prefetchInterval: number
  batchSize: number
  batchInterval: number
}

const defaultConfig: Config = {
  algorithm: 'aes-256-gcm',
  compressionLevel: -1,
  cacheSize: 1000,
  cacheMaxAge: 60 * 60 * 1000,
  persistenceInterval: 5 * 60 * 1000,
  maxMemoryUsage: 1024 * 1024 * 1024,
  evictionPolicy: 'lru',
  forceReset: false,
  storageType: 'memory',
  mongodbUri:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/reusablestore',
  mongoPoolSize: 10,
  prefetchThreshold: 5,
  prefetchInterval: 60 * 1000,
  batchSize: 100,
  batchInterval: 5000,
}

let config: Config = { ...defaultConfig }

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
  value: string[]
}

interface HashValue {
  type: 'hash'
  value: Record<string, string>
}

interface StreamValue {
  type: 'stream'
  value: Array<{ id: string; fields: Record<string, string> }>
}

interface ZSetValue {
  type: 'zset'
  value: Record<string, number>
}

interface HLLValue {
  type: 'hll'
  value: string[]
}

interface GeoValue {
  type: 'geo'
  value: Record<string, [number, number]>
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

interface CacheItem<T> {
  value: T
  lastAccessed: number
  expirationDate: Date
}

class TwoLevelCache {
  private memoryCache: LRUCache<string, CacheItem<DataValue>>

  constructor() {
    this.memoryCache = new LRUCache<string, CacheItem<DataValue>>({
      max: config.cacheSize,
      ttl: config.cacheMaxAge,
    })
  }

  async get(key: string): Promise<DataValue | undefined> {
    const memoryItem = this.memoryCache.get(key)
    if (memoryItem && memoryItem.expirationDate > new Date()) {
      return memoryItem.value
    }

    if (config.storageType === 'mongodb') {
      const dbItem = await this.getFromDatabase(key)
      if (dbItem) {
        this.memoryCache.set(key, dbItem)
        return dbItem.value
      }
    }

    return undefined
  }

  async set(
    key: string,
    value: DataValue,
    expirationDate: Date
  ): Promise<void> {
    this.memoryCache.set(key, {
      value,
      lastAccessed: Date.now(),
      expirationDate,
    })
    if (config.storageType === 'mongodb') {
      await batchWriter.add(key, value, expirationDate)
    }
  }

  private async getFromDatabase(
    key: string
  ): Promise<CacheItem<DataValue> | undefined> {
    if (config.storageType === 'mongodb' && mongoDb) {
      const collection = mongoDb.collection('reusablestore')
      let query: Record<string, string | ObjectId>
      try {
        query = { _id: new ObjectId(key) }
      } catch {
        query = { _id: key }
      }
      const doc = await collection.findOne(query)
      if (doc) {
        let value = doc.value as DataValue
        if (typeof value === 'string') {
          const decrypted = await encryptionUtility.decrypt(value, doc.authTag)
          value = JSON.parse(
            await decompressData(Buffer.from(decrypted, 'base64'))
          ) as DataValue
        }
        return {
          value,
          lastAccessed: doc.lastAccessed,
          expirationDate: new Date(doc.expirationDate),
        }
      }
    }
    return undefined
  }

  async remove(key: string): Promise<void> {
    this.memoryCache.delete(key)
    if (config.storageType === 'mongodb' && mongoDb) {
      const collection = mongoDb.collection('reusablestore')
      let query: Record<string, string | ObjectId>
      try {
        query = { _id: new ObjectId(key) }
      } catch {
        query = { _id: key }
      }
      await collection.deleteOne(query)
    }
  }

  async resizeCache(newSize: number): Promise<void> {
    const oldCache = this.memoryCache
    this.memoryCache = new LRUCache<string, CacheItem<DataValue>>({
      max: newSize,
      ttl: config.cacheMaxAge,
    })

    // Transfer existing items to the new cache
    for (const [key, value] of oldCache.entries()) {
      this.memoryCache.set(key, value)
    }

    console.log(`Cache resized to ${newSize} items`)
  }
}

let cache: TwoLevelCache

const lock = new AsyncLock({
  timeout: 30000,
  maxPending: Infinity,
})

const pubsub = new EventEmitter()

let encryptionUtility: EncryptionUtility
let isInitialized = false
let mongoClient: MongoClient | null = null
let mongoDb: Db | null = null

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

class AccessTracker {
  private accessCounts: Map<string, number> = new Map()
  private accessPatterns: Map<string, Set<string>> = new Map()

  async recordAccess(key: string, relatedKey?: string): Promise<void> {
    this.accessCounts.set(key, (this.accessCounts.get(key) || 0) + 1)
    if (relatedKey) {
      if (!this.accessPatterns.has(key)) {
        this.accessPatterns.set(key, new Set())
      }
      this.accessPatterns.get(key)!.add(relatedKey)
    }
  }

  async getFrequentKeys(threshold: number): Promise<string[]> {
    return Array.from(this.accessCounts.entries())
      .filter(([, count]) => count > threshold)
      .map(([key]) => key)
  }

  async getPredictedNextKeys(key: string): Promise<string[]> {
    return Array.from(this.accessPatterns.get(key) || [])
  }
}

class Prefetcher {
  constructor(
    private cache: TwoLevelCache,
    private accessTracker: AccessTracker
  ) {}

  async prefetchFrequentItems(): Promise<void> {
    if (config.storageType !== 'mongodb') return

    const frequentKeys = await this.accessTracker.getFrequentKeys(
      config.prefetchThreshold
    )
    for (const key of frequentKeys) {
      if (!(await this.cache.get(key))) {
        const value = await this.getFromDatabase(key)
        if (value) {
          await this.cache.set(key, value.value, value.expirationDate)
        }
      }
    }
  }

  async prefetchRelatedItems(key: string): Promise<void> {
    if (config.storageType !== 'mongodb') return

    const relatedKeys = await this.accessTracker.getPredictedNextKeys(key)
    for (const relatedKey of relatedKeys) {
      if (!(await this.cache.get(relatedKey))) {
        const value = await this.getFromDatabase(relatedKey)
        if (value) {
          await this.cache.set(relatedKey, value.value, value.expirationDate)
        }
      }
    }
  }

  private async getFromDatabase(
    key: string
  ): Promise<CacheItem<DataValue> | undefined> {
    if (config.storageType === 'mongodb' && mongoDb) {
      const collection = mongoDb.collection('reusablestore')
      let query: Record<string, string | ObjectId>
      try {
        query = { _id: new ObjectId(key) }
      } catch {
        query = { _id: key }
      }
      const doc = await collection.findOne(query)
      if (doc) {
        let value = doc.value as DataValue
        if (typeof value === 'string') {
          const decrypted = await encryptionUtility.decrypt(value, doc.authTag)
          value = JSON.parse(
            await decompressData(Buffer.from(decrypted, 'base64'))
          ) as DataValue
        }
        return {
          value,
          lastAccessed: doc.lastAccessed,
          expirationDate: new Date(doc.expirationDate),
        }
      }
    }
    return undefined
  }
}

class BatchWriter {
  private batch: Map<string, { value: DataValue; expirationDate: Date }> =
    new Map()
  private flushPromise: Promise<void> | null = null
  private flushInterval: NodeJS.Timeout

  constructor(
    private batchSize: number,
    flushIntervalMs: number
  ) {
    this.flushInterval = setInterval(() => this.flush(), flushIntervalMs)
  }

  async add(
    key: string,
    value: DataValue,
    expirationDate: Date
  ): Promise<void> {
    this.batch.set(key, { value, expirationDate })
    if (this.batch.size >= this.batchSize) {
      await this.flush()
    }
  }

  async flush(): Promise<void> {
    if (this.flushPromise) {
      await this.flushPromise
      return
    }

    if (this.batch.size === 0) {
      return
    }

    const batchToFlush = new Map(this.batch)
    this.batch.clear()

    this.flushPromise = this.persistBatch(batchToFlush)
    await this.flushPromise
    this.flushPromise = null
  }

  private async persistBatch(
    batch: Map<string, { value: DataValue; expirationDate: Date }>
  ): Promise<void> {
    if (config.storageType === 'mongodb' && mongoDb) {
      const collection = mongoDb.collection('reusablestore')
      const operations = await Promise.all(
        Array.from(batch.entries()).map(
          async ([key, { value, expirationDate }]) => {
            let mongoId: string | ObjectId
            try {
              mongoId = new ObjectId(key)
            } catch {
              mongoId = key
            }
            const compressedValue = await compressData(JSON.stringify(value))
            const { encryptedData, authTag } = await encryptionUtility.encrypt(
              compressedValue.toString('base64')
            )
            return {
              replaceOne: {
                filter: { _id: mongoId } as Filter<Document>,
                replacement: {
                  _id: mongoId,
                  value: encryptedData,
                  authTag: authTag,
                  lastAccessed: Date.now(),
                  expirationDate: expirationDate.toISOString(),
                },
                upsert: true,
              },
            }
          }
        )
      )
      await collection.bulkWrite(operations)
      console.log(`Batch of ${batch.size} items persisted to MongoDB`)
    }
  }

  async stop(): Promise<void> {
    clearInterval(this.flushInterval)
  }
}

let accessTracker: AccessTracker
let prefetcher: Prefetcher
let batchWriter: BatchWriter

async function loadConfig(): Promise<void> {
  config = { ...defaultConfig }
  if (config.maxMemoryUsage === 'max') {
    config.maxMemoryUsage = os.totalmem()
  }
  console.log('Configuration loaded successfully')
}

async function connectToMongoDB(): Promise<void> {
  if (mongoClient) {
    return // Already connected
  }

  try {
    const options: MongoClientOptions = {
      maxPoolSize: config.mongoPoolSize,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
    }

    mongoClient = await MongoClient.connect(config.mongodbUri, options)
    mongoDb = mongoClient.db()
    console.log('Connected to MongoDB successfully')
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${(error as Error).message}`)
    throw new StorageError(
      `Failed to connect to MongoDB: ${(error as Error).message}`
    )
  }
}

async function loadPersistedData(): Promise<void> {
  if (config.storageType === 'mongodb') {
    try {
      await connectToMongoDB()
      if (!mongoDb) throw new Error('MongoDB connection not established')
      const collection = mongoDb.collection('reusablestore')
      const documents = await collection.find({}).toArray()

      for (const doc of documents) {
        const key =
          doc._id instanceof ObjectId ? doc._id.toString() : (doc._id as string)
        let value = doc.value as string
        const decrypted = await encryptionUtility.decrypt(value, doc.authTag)
        value = await decompressData(Buffer.from(decrypted, 'base64'))
        const parsedValue = JSON.parse(value) as DataValue
        await cache.set(key, parsedValue, new Date(doc.expirationDate))
      }
      console.log('Persisted data loaded successfully from MongoDB')
    } catch (error) {
      console.error(
        `Failed to load persisted data from MongoDB: ${(error as Error).message}`
      )
      console.log('Continuing with an empty store due to data loading error.')
    }
  } else {
    console.log('Memory storage type selected. No data to load.')
  }
}

async function initializeReusableStore(): Promise<void> {
  try {
    await loadConfig()

    cache = new TwoLevelCache()
    accessTracker = new AccessTracker()
    prefetcher = new Prefetcher(cache, accessTracker)
    batchWriter = new BatchWriter(config.batchSize, config.batchInterval)

    if (config.forceReset) {
      console.log(
        'Force reset option detected. Generating new encryption material...'
      )
      await generateEncryptionMaterial()
    }

    const { key, iv } = await getEncryptionMaterial()
    encryptionUtility = new EncryptionUtility(key, iv)

    if (config.storageType === 'mongodb') {
      await loadPersistedData()
    }

    isInitialized = true
    console.log('ReusableStore initialized successfully')

    // Start prefetching only if using MongoDB
    if (config.storageType === 'mongodb') {
      setInterval(
        () => prefetcher.prefetchFrequentItems(),
        config.prefetchInterval
      )
    }
  } catch (error) {
    console.error(`Initialization failed: ${(error as Error).message}`)
    console.error('Stack trace:', (error as Error).stack)
    throw new Error(`Initialization failed: ${(error as Error).message}`)
  }
}

async function manageMemory(): Promise<void> {
  const memoryUsage = process.memoryUsage().heapUsed
  if (
    typeof config.maxMemoryUsage === 'number' &&
    memoryUsage > config.maxMemoryUsage
  ) {
    const allKeys = Array.from(cache['memoryCache'].keys())
    let keysToEvict: string[]

    switch (config.evictionPolicy) {
      case 'lru':
        // We'll use the cache's internal LRU ordering
        keysToEvict = allKeys.slice(0, Math.floor(allKeys.length * 0.1))
        break
      case 'random':
        keysToEvict = allKeys
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(allKeys.length * 0.1))
        break
      default:
        keysToEvict = []
        console.warn(`Unknown eviction policy: ${config.evictionPolicy}`)
    }

    for (const key of keysToEvict) {
      await cache.remove(key)
    }

    console.log(`Memory managed: Evicted ${keysToEvict.length} items`)
  }
}

async function performAtomicOperation(
  operations: (() => Promise<void>)[]
): Promise<void> {
  if (config.storageType === 'mongodb' && mongoClient) {
    const session = mongoClient.startSession()
    try {
      await session.withTransaction(async () => {
        for (const operation of operations) {
          await operation()
        }
      })
    } finally {
      await session.endSession()
    }
  } else {
    for (const operation of operations) {
      await operation()
    }
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
  // For simplicity, we're generating new encryption material each time
  // In a real-world scenario, you might want to persist this securely
  return generateEncryptionMaterial()
}

async function generateEncryptionMaterial(): Promise<{
  key: Buffer
  iv: Buffer
}> {
  const keySize = parseInt(config.algorithm.split('-')[1]) / 8
  const key = crypto.randomBytes(keySize)
  const iv = crypto.randomBytes(16)
  return { key, iv }
}

async function ensureInitialized(): Promise<void> {
  if (!isInitialized) {
    await initializeReusableStore()
  }
}

// Utility function to generate stream IDs
async function generateStreamId(): Promise<string> {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `${timestamp}-${random}`
}

// Schedule periodic tasks
const periodicTasksInterval = setInterval(async () => {
  if (isInitialized) {
    if (config.storageType === 'mongodb') {
      await batchWriter.flush()
    }
    await manageMemory()
  }
}, config.persistenceInterval)

// Exported functions
// Cleanup threshold (example: 1000 operations)
const CLEANUP_THRESHOLD = 1000
let operationCount = 0

async function checkAndCleanup(): Promise<void> {
  operationCount++
  if (operationCount >= CLEANUP_THRESHOLD) {
    await cleanup()
    operationCount = 0
  }
}

export async function set(
  key: string,
  value: DataValue,
  expirationDate: Date
): Promise<void> {
  await ensureInitialized()

  await lock.acquire(key, async () => {
    if (value.type === 'stream') {
      value.value = await Promise.all(
        value.value.map(async item => ({
          ...item,
          id: item.id || (await generateStreamId()),
        }))
      )
    }

    await performAtomicOperation([
      async () => {
        await cache.set(key, value, expirationDate)
        await accessTracker.recordAccess(key)
      },
    ])
    await pubsub.emit('set', { key, value, expirationDate })
    console.log(`Value set for key: ${key}`)

    if (config.storageType === 'mongodb') {
      await prefetcher.prefetchRelatedItems(key)
    }
  })

  await checkAndCleanup()
}

export async function get(key: string): Promise<DataValue | undefined> {
  await ensureInitialized()

  const result = await lock.acquire(key, async () => {
    const cachedItem = await cache.get(key)

    if (cachedItem) {
      console.log(`Cache hit for key: ${key}`)
      await accessTracker.recordAccess(key)
      return cachedItem
    }

    console.log(`Cache miss for key: ${key}`)
    return undefined
  })

  await checkAndCleanup()
  return result
}

export async function del(key: string): Promise<void> {
  await ensureInitialized()

  await lock.acquire(key, async () => {
    await performAtomicOperation([
      async () => {
        await cache.remove(key)
      },
    ])
    await pubsub.emit('deleted', key)
    console.log(`Value deleted for key: ${key}`)
  })

  await checkAndCleanup()
}

// Initialize the store
export async function init(storageType: StorageType = 'memory'): Promise<void> {
  config.storageType = storageType
  await initializeReusableStore()
}

// Cleanup function
async function cleanup(): Promise<void> {
  clearInterval(periodicTasksInterval)
  await batchWriter.stop()
  if (mongoClient) {
    await mongoClient.close()
    mongoClient = null
    mongoDb = null
  }
  console.log('ReusableStore cleaned up successfully')

  // Reinitialize after cleanup
  await initializeReusableStore()
}
