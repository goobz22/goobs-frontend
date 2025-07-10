export interface CircuitBreakerConfig {
  maxRevisions: number
  timeWindow: number // milliseconds
  cooldownPeriod: number // milliseconds
}

export class CircuitBreaker {
  private revisionCount: number = 0
  private windowStart: number = Date.now()
  private isOpen: boolean = false
  private lastTriggered: number = 0
  private config: CircuitBreakerConfig

  constructor(
    config: CircuitBreakerConfig = {
      maxRevisions: 100,
      timeWindow: 1000,
      cooldownPeriod: 5000,
    }
  ) {
    this.config = config
  }

  canExecute(): boolean {
    const now = Date.now()

    // Check if we're in cooldown period
    if (this.isOpen && now - this.lastTriggered < this.config.cooldownPeriod) {
      return false
    }

    // Reset circuit breaker after cooldown
    if (this.isOpen && now - this.lastTriggered >= this.config.cooldownPeriod) {
      this.reset()
    }

    // Reset revision counter if time window has passed
    if (now - this.windowStart > this.config.timeWindow) {
      this.revisionCount = 0
      this.windowStart = now
    }

    return !this.isOpen
  }

  recordExecution(): void {
    if (!this.canExecute()) {
      throw new Error(
        'Circuit breaker is open - execution blocked to prevent infinite loop'
      )
    }

    this.revisionCount++

    if (this.revisionCount > this.config.maxRevisions) {
      this.trip()
      throw new Error(
        `Circuit breaker triggered: ${this.revisionCount} revisions in ${this.config.timeWindow}ms exceeds limit of ${this.config.maxRevisions}`
      )
    }
  }

  private trip(): void {
    this.isOpen = true
    this.lastTriggered = Date.now()
    console.warn('Circuit breaker tripped - blocking further executions')
  }

  private reset(): void {
    this.isOpen = false
    this.revisionCount = 0
    this.windowStart = Date.now()
    this.lastTriggered = 0
  }

  getStats() {
    return {
      revisionCount: this.revisionCount,
      isOpen: this.isOpen,
      windowStart: this.windowStart,
      lastTriggered: this.lastTriggered,
    }
  }
}
