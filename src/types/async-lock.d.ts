declare module 'async-lock' {
  interface AsyncLockOptions {
    timeout?: number
    maxPending?: number
    maxOccupationTime?: number
    domainReentrant?: boolean
  }

  interface AsyncLockAcquireOptions {
    timeout?: number
    skipQueue?: boolean
  }

  class AsyncLock {
    constructor(options: AsyncLockOptions)

    acquire: {
      <T>(
        key: string | readonly string[],
        fn: () => Promise<T> | T,
        opts?: AsyncLockAcquireOptions
      ): Promise<T>
      <T>(key: string | readonly string[], fn: () => Promise<T> | T): Promise<T>
    }

    isBusy: () => boolean

    getQueueLength: {
      (key: string): number
      (): number
    }
  }

  export = AsyncLock
}
