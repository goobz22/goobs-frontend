import { CacheConfig, EvictionPolicy, LogLevel } from 'goobs-cache'

const cacheConfiguration: CacheConfig = {
  session: {
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
  },
  global: {
    keySize: 256,
    batchSize: 100,
    autoTuneInterval: 3600000,
    loggingEnabled: true,
    logLevel: 'debug' as LogLevel,
    logDirectory: 'logs',
  },
}

export default cacheConfiguration
