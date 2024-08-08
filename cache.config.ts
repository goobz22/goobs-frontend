import {
  ServerlessCacheConfig,
  SessionCacheConfig,
  CookieCacheConfig,
  GlobalConfig,
  EvictionPolicy,
  LogLevel,
} from 'goobs-cache'

const serverlessConfig: ServerlessCacheConfig = {
  cacheSize: 10000,
  cacheMaxAge: 86400000,
  persistenceInterval: 600000,
  maxMemoryUsage: 1073741824,
  evictionPolicy: 'lru' as EvictionPolicy,
  prefetchThreshold: 0.9,
  forceReset: false,
  compression: {
    compressionLevel: -1,
  },
  encryption: {
    algorithm: 'aes-256-gcm',
    encryptionPassword: 'your-secure-encryption-password-here-serverless',
    keyCheckIntervalMs: 86400000,
    keyRotationIntervalMs: 7776000000,
  },
}

const sessionConfig: SessionCacheConfig = {
  cacheSize: 5000,
  cacheMaxAge: 1800000,
  evictionPolicy: 'lru' as EvictionPolicy,
  compression: {
    compressionLevel: -1,
  },
  encryption: {
    algorithm: 'aes-256-gcm',
    encryptionPassword: 'your-secure-encryption-password-here-session',
    keyCheckIntervalMs: 86400000,
    keyRotationIntervalMs: 7776000000,
  },
}

const cookieConfig: CookieCacheConfig = {
  cacheSize: 1000,
  cacheMaxAge: 604800000,
  maxCookieSize: 4096,
  evictionPolicy: 'lru' as EvictionPolicy,
  compression: {
    compressionLevel: -1,
  },
  encryption: {
    algorithm: 'aes-256-gcm',
    encryptionPassword: 'your-secure-encryption-password-here-cookie',
    keyCheckIntervalMs: 86400000,
    keyRotationIntervalMs: 7776000000,
  },
}

const globalConfig: GlobalConfig = {
  keySize: 256,
  batchSize: 100,
  autoTuneInterval: 3600000,
  loggingEnabled: true,
  logLevel: 'debug' as LogLevel,
  logDirectory: 'logs',
}

export { serverlessConfig, sessionConfig, cookieConfig, globalConfig }
