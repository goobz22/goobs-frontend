/**
 * @fileoverview Generic caching system with swappable storage backends.
 *
 * This file implements an advanced caching system that supports stale-while-revalidate,
 * TTL-based expiration, and a generic storage interface for extensibility.
 *
 * Key Design Decisions:
 * - A `Cache` class provides the core logic, independent of the storage mechanism.
 * - A `Storage` interface defines the contract for backend adapters (e.g., in-memory,
 *   Redis, IndexedDB), making the system highly extensible.
 * - Stale-while-revalidate is a core feature for a good user experience, returning
 *   stale data while re-fetching in the background.
 *
 * @author Framework-Agnostic Team
 * @version 1.0.0
 */

/**
 * Interface for a cache storage backend.
 *
 * This contract allows for different storage mechanisms (in-memory, localStorage,
 * IndexedDB, Redis, etc.) to be used with the core Cache class.
 */
export interface Storage {
  get<T>(key: string): Promise<CacheEntry<T> | undefined>
  set<T>(key: string, value: CacheEntry<T>): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
}

/**
 * Represents an entry in the cache.
 *
 * @template T The type of data stored in the cache entry.
 */
export interface CacheEntry<T> {
  data: T
  /** Timestamp in milliseconds of when the entry was created. */
  timestamp: number
}

/**
 * Default in-memory storage adapter.
 */
export class InMemoryStorage implements Storage {
  private store = new Map<string, CacheEntry<unknown>>()

  get<T>(key: string): Promise<CacheEntry<T> | undefined> {
    return Promise.resolve(this.store.get(key) as CacheEntry<T> | undefined)
  }

  set<T>(key: string, value: CacheEntry<T>): Promise<void> {
    this.store.set(key, value)
    return Promise.resolve()
  }

  delete(key: string): Promise<void> {
    this.store.delete(key)
    return Promise.resolve()
  }

  clear(): Promise<void> {
    this.store.clear()
    return Promise.resolve()
  }
}

export interface CacheOptions {
  /** The storage backend to use. Defaults to InMemoryStorage. */
  storage?: Storage
  /** Time-to-live for cache entries in milliseconds. */
  ttl?: number
  /** Time in milliseconds that data is considered "fresh". After this time, it becomes "stale". */
  staleTime?: number
}

/**
 * A generic cache with stale-while-revalidate logic.
 */
export class Cache {
  private storage: Storage
  private ttl: number
  private staleTime: number

  constructor(options: CacheOptions = {}) {
    this.storage = options.storage || new InMemoryStorage()
    this.ttl = options.ttl || 1000 * 60 * 5 // 5 minutes
    this.staleTime = options.staleTime || 1000 * 60 // 1 minute
  }

  /**
   * Fetches data from the cache or from the fetcher function.
   *
   * @template T The expected type of the data.
   * @param key A unique key to identify the cache entry.
   * @param fetcher A function that returns a promise of the data.
   * @returns The data from the cache or the fetcher.
   */
  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const now = Date.now()
    const entry = await this.storage.get<T>(key)

    if (entry) {
      const isStale = now - entry.timestamp > this.staleTime
      const isExpired = now - entry.timestamp > this.ttl

      if (isExpired) {
        // Data is expired, delete it and fetch new data
        await this.storage.delete(key)
        return this.fetchAndSet(key, fetcher)
      }

      if (isStale) {
        // Data is stale, return it but re-fetch in the background
        this.fetchAndSet(key, fetcher).catch(error => {
          console.error(
            `Failed to revalidate stale cache for key "${key}":`,
            error
          )
        })
      }

      return entry.data
    }

    return this.fetchAndSet(key, fetcher)
  }

  /**
   * Invalidates a specific cache entry.
   *
   * @param key The key of the entry to invalidate.
   */
  async invalidate(key: string): Promise<void> {
    await this.storage.delete(key)
  }

  /**
   * Clears the entire cache.
   */
  async clear(): Promise<void> {
    await this.storage.clear()
  }

  private async fetchAndSet<T>(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const data = await fetcher()
    const newEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    }
    await this.storage.set(key, newEntry)
    return data
  }
}

/**
 * Factory function to create a new Cache instance.
 *
 * @param options Configuration for the cache.
 * @returns A new Cache instance.
 */
export function createCache(options: CacheOptions = {}): Cache {
  return new Cache(options)
}
