export interface SyntheticEvent<T = Event> {
  nativeEvent: T
  type: string
  target: EventTarget | null
  currentTarget: EventTarget | null
  bubbles: boolean
  cancelable: boolean
  defaultPrevented: boolean
  eventPhase: number
  isTrusted: boolean
  timeStamp: number
  preventDefault(): void
  stopPropagation(): void
  stopImmediatePropagation(): void
  persist(): void
}

export type EventHandler<T = Event> = (event: SyntheticEvent<T>) => void

export interface EventListenerEntry {
  handler: EventHandler
  options?: AddEventListenerOptions
  priority?: number
}

export interface ComponentEventManager {
  addEventDelegate(
    element: HTMLElement,
    eventType: string,
    handler: EventHandler
  ): () => void
  removeEventDelegate(
    element: HTMLElement,
    eventType: string,
    handler: EventHandler
  ): void
  dispatchEvent(element: HTMLElement, eventType: string, eventData?: any): void
  cleanup(): void
}

// Event delegation manager
class EventDelegationManager {
  private delegatedEvents: Map<string, Set<EventListenerEntry>> = new Map()
  private elementHandlers: WeakMap<HTMLElement, Map<string, EventHandler[]>> =
    new WeakMap()
  private rootElement: HTMLElement | null = null
  private syntheticEventPool: SyntheticEvent[] = []
  private isSetup = false

  constructor(rootElement: HTMLElement = document.body) {
    this.rootElement = rootElement
    this.setupDelegation()
  }

  private setupDelegation(): void {
    if (this.isSetup || !this.rootElement) return

    // Common events that benefit from delegation
    const delegatedEventTypes = [
      'click',
      'dblclick',
      'mousedown',
      'mouseup',
      'mouseover',
      'mouseout',
      'mousemove',
      'mouseenter',
      'mouseleave',
      'focus',
      'blur',
      'keydown',
      'keyup',
      'keypress',
      'input',
      'change',
      'submit',
      'reset',
      'select',
      'touchstart',
      'touchmove',
      'touchend',
      'touchcancel',
    ]

    delegatedEventTypes.forEach(eventType => {
      this.rootElement!.addEventListener(
        eventType,
        nativeEvent => {
          this.handleDelegatedEvent(eventType, nativeEvent)
        },
        { capture: true, passive: false }
      )
    })

    this.isSetup = true
  }

  private handleDelegatedEvent(eventType: string, nativeEvent: Event): void {
    const target = nativeEvent.target as HTMLElement
    if (!target) return

    // Find all elements in the event path that have handlers
    const eventPath = this.getEventPath(nativeEvent)
    const syntheticEvent = this.createSyntheticEvent(nativeEvent)

    // Process event through capture phase and bubble phase
    this.processEventPhase(eventPath, syntheticEvent, 'capture')

    if (!syntheticEvent.defaultPrevented) {
      this.processEventPhase(eventPath.reverse(), syntheticEvent, 'bubble')
    }

    // Return synthetic event to pool
    this.releaseSyntheticEvent(syntheticEvent)
  }

  private getEventPath(event: Event): HTMLElement[] {
    const path: HTMLElement[] = []
    let currentElement = event.target as HTMLElement

    while (currentElement && currentElement !== this.rootElement) {
      path.push(currentElement)
      currentElement = currentElement.parentElement!
    }

    if (this.rootElement) {
      path.push(this.rootElement)
    }

    return path
  }

  private createSyntheticEvent(nativeEvent: Event): SyntheticEvent {
    // Reuse from pool if available
    let syntheticEvent = this.syntheticEventPool.pop()

    if (!syntheticEvent) {
      syntheticEvent = {
        nativeEvent,
        type: nativeEvent.type,
        target: nativeEvent.target,
        currentTarget: nativeEvent.currentTarget,
        bubbles: nativeEvent.bubbles,
        cancelable: nativeEvent.cancelable,
        defaultPrevented: nativeEvent.defaultPrevented,
        eventPhase: nativeEvent.eventPhase,
        isTrusted: nativeEvent.isTrusted,
        timeStamp: nativeEvent.timeStamp,
        preventDefault: () => {
          nativeEvent.preventDefault()
          syntheticEvent!.defaultPrevented = true
        },
        stopPropagation: () => {
          nativeEvent.stopPropagation()
        },
        stopImmediatePropagation: () => {
          nativeEvent.stopImmediatePropagation()
        },
        persist: () => {
          // Remove from pool so it won't be reused
          const index = this.syntheticEventPool.indexOf(syntheticEvent!)
          if (index > -1) {
            this.syntheticEventPool.splice(index, 1)
          }
        },
      }
    } else {
      // Reset pooled event
      Object.assign(syntheticEvent, {
        nativeEvent,
        type: nativeEvent.type,
        target: nativeEvent.target,
        currentTarget: nativeEvent.currentTarget,
        bubbles: nativeEvent.bubbles,
        cancelable: nativeEvent.cancelable,
        defaultPrevented: nativeEvent.defaultPrevented,
        eventPhase: nativeEvent.eventPhase,
        isTrusted: nativeEvent.isTrusted,
        timeStamp: nativeEvent.timeStamp,
      })
    }

    return syntheticEvent
  }

  private releaseSyntheticEvent(syntheticEvent: SyntheticEvent): void {
    // Return to pool for reuse
    if (this.syntheticEventPool.length < 50) {
      // Limit pool size
      this.syntheticEventPool.push(syntheticEvent)
    }
  }

  private processEventPhase(
    elements: HTMLElement[],
    syntheticEvent: SyntheticEvent,
    phase: 'capture' | 'bubble'
  ): void {
    for (const element of elements) {
      const handlers = this.elementHandlers.get(element)
      if (!handlers) continue

      const eventHandlers = handlers.get(syntheticEvent.type)
      if (!eventHandlers) continue

      syntheticEvent.currentTarget = element

      // Sort handlers by priority (higher priority first)
      const sortedHandlers = eventHandlers
        .slice()
        .sort((a, b) => (b as any).priority - (a as any).priority)

      for (const handler of sortedHandlers) {
        try {
          handler(syntheticEvent)
        } catch (error) {
          console.error('Error in event handler:', error)
        }

        // Stop if propagation was stopped
        if (syntheticEvent.defaultPrevented) {
          break
        }
      }

      if (syntheticEvent.defaultPrevented) {
        break
      }
    }
  }

  addEventHandler(
    element: HTMLElement,
    eventType: string,
    handler: EventHandler,
    options?: { priority?: number }
  ): () => void {
    if (!this.elementHandlers.has(element)) {
      this.elementHandlers.set(element, new Map())
    }

    const elementMap = this.elementHandlers.get(element)!
    if (!elementMap.has(eventType)) {
      elementMap.set(eventType, [])
    }

    const handlerWithOptions = Object.assign(handler, {
      priority: options?.priority || 0,
    })
    elementMap.get(eventType)!.push(handlerWithOptions)

    // Return cleanup function
    return () => this.removeEventHandler(element, eventType, handler)
  }

  removeEventHandler(
    element: HTMLElement,
    eventType: string,
    handler: EventHandler
  ): void {
    const elementMap = this.elementHandlers.get(element)
    if (!elementMap) return

    const handlers = elementMap.get(eventType)
    if (!handlers) return

    const index = handlers.indexOf(handler)
    if (index > -1) {
      handlers.splice(index, 1)
    }

    // Clean up empty maps
    if (handlers.length === 0) {
      elementMap.delete(eventType)
    }
    if (elementMap.size === 0) {
      this.elementHandlers.delete(element)
    }
  }

  dispatchCustomEvent(
    element: HTMLElement,
    eventType: string,
    eventData?: any
  ): void {
    const customEvent = new CustomEvent(eventType, {
      detail: eventData,
      bubbles: true,
      cancelable: true,
    })

    element.dispatchEvent(customEvent)
  }

  cleanup(): void {
    this.elementHandlers = new WeakMap()
    this.syntheticEventPool = []
  }
}

// Global event manager instance
let globalEventManager: EventDelegationManager | null = null

export function getGlobalEventManager(): EventDelegationManager {
  if (!globalEventManager) {
    globalEventManager = new EventDelegationManager()
  }
  return globalEventManager
}

// Component event manager implementation
export class ComponentEventManagerImpl implements ComponentEventManager {
  private eventManager: EventDelegationManager
  private cleanupFunctions: (() => void)[] = []

  constructor(eventManager?: EventDelegationManager) {
    this.eventManager = eventManager || getGlobalEventManager()
  }

  addEventDelegate(
    element: HTMLElement,
    eventType: string,
    handler: EventHandler
  ): () => void {
    const cleanup = this.eventManager.addEventHandler(
      element,
      eventType,
      handler
    )
    this.cleanupFunctions.push(cleanup)
    return cleanup
  }

  removeEventDelegate(
    element: HTMLElement,
    eventType: string,
    handler: EventHandler
  ): void {
    this.eventManager.removeEventHandler(element, eventType, handler)
  }

  dispatchEvent(
    element: HTMLElement,
    eventType: string,
    eventData?: any
  ): void {
    this.eventManager.dispatchCustomEvent(element, eventType, eventData)
  }

  cleanup(): void {
    this.cleanupFunctions.forEach(cleanup => cleanup())
    this.cleanupFunctions = []
  }
}

// Lifecycle hooks for components
export interface LifecycleHooks {
  beforeMount?: () => void
  mounted?: () => void
  beforeUpdate?: () => void
  updated?: () => void
  beforeUnmount?: () => void
  unmounted?: () => void
  errorCaptured?: (
    error: Error,
    instance: any,
    errorInfo: string
  ) => boolean | void
}

export class LifecycleManager {
  private hooks: LifecycleHooks = {}
  private isDestroyed = false

  setHooks(hooks: LifecycleHooks): void {
    this.hooks = { ...this.hooks, ...hooks }
  }

  async callHook(
    hookName: keyof LifecycleHooks,
    ...args: any[]
  ): Promise<void> {
    if (this.isDestroyed) return

    const hook = this.hooks[hookName]
    if (typeof hook === 'function') {
      try {
        await hook(...args)
      } catch (error) {
        console.error(`Error in ${hookName} hook:`, error)

        // Call error hook if available
        if (hookName !== 'errorCaptured' && this.hooks.errorCaptured) {
          this.hooks.errorCaptured(error as Error, null, `${hookName} hook`)
        }
      }
    }
  }

  destroy(): void {
    this.isDestroyed = true
    this.hooks = {}
  }
}

// Event utilities
export const EventUtils = {
  // Prevent default and stop propagation
  prevent(event: SyntheticEvent): void {
    event.preventDefault()
    event.stopPropagation()
  },

  // Throttle event handler
  throttle<T extends any[]>(
    fn: (...args: T) => void,
    delay: number
  ): (...args: T) => void {
    let lastCall = 0
    return (...args: T) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        fn(...args)
      }
    }
  },

  // Debounce event handler
  debounce<T extends any[]>(
    fn: (...args: T) => void,
    delay: number
  ): (...args: T) => void {
    let timeoutId: NodeJS.Timeout
    return (...args: T) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }
  },

  // Create event emitter
  createEventEmitter(): {
    on: (event: string, handler: EventHandler) => void
    off: (event: string, handler: EventHandler) => void
    emit: (event: string, data?: any) => void
    once: (event: string, handler: EventHandler) => void
  } {
    const listeners: Map<string, EventHandler[]> = new Map()

    return {
      on(event: string, handler: EventHandler): void {
        if (!listeners.has(event)) {
          listeners.set(event, [])
        }
        listeners.get(event)!.push(handler)
      },

      off(event: string, handler: EventHandler): void {
        const eventListeners = listeners.get(event)
        if (eventListeners) {
          const index = eventListeners.indexOf(handler)
          if (index > -1) {
            eventListeners.splice(index, 1)
          }
        }
      },

      emit(event: string, data?: any): void {
        const eventListeners = listeners.get(event)
        if (eventListeners) {
          eventListeners.forEach(handler => {
            try {
              handler(data)
            } catch (error) {
              console.error('Error in event handler:', error)
            }
          })
        }
      },

      once(event: string, handler: EventHandler): void {
        const onceHandler = (data: any) => {
          handler(data)
          this.off(event, onceHandler)
        }
        this.on(event, onceHandler)
      },
    }
  },
}

// Export convenience functions
export function addEventListener(
  element: HTMLElement,
  eventType: string,
  handler: EventHandler
): () => void {
  return getGlobalEventManager().addEventHandler(element, eventType, handler)
}

export function removeEventListener(
  element: HTMLElement,
  eventType: string,
  handler: EventHandler
): void {
  getGlobalEventManager().removeEventHandler(element, eventType, handler)
}

export function dispatchEvent(
  element: HTMLElement,
  eventType: string,
  eventData?: any
): void {
  getGlobalEventManager().dispatchCustomEvent(element, eventType, eventData)
}
