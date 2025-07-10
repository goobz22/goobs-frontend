/**
 * @fileoverview Generic real-time connection management
 *
 * This file implements a protocol-agnostic system for managing real-time
 * data streams, using a transport-based architecture.
 *
 * Key Design Decisions:
 * - A generic `createLiveResource` function manages the connection lifecycle.
 * - Protocol-specific logic is encapsulated in `Transport` implementations.
 * - This makes the system extensible to any real-time protocol (WebSockets,
 *   SSE, etc.) without changing the core connection manager.
 *
 * @author Framework-Agnostic Team
 * @version 1.0.0
 */

import { Signal, useSignal } from '../core/reactive'

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'

/**
 * Interface for a real-time transport protocol.
 *
 * A transport is responsible for the specifics of establishing, maintaining,
 * and communicating over a real-time connection.
 */
export interface Transport {
  connect(hooks: {
    onOpen: () => void
    onMessage: (data: any) => void
    onClose: () => void
    onError: (error: any) => void
  }): void
  send(data: any): void
  disconnect(): void
}

export interface LiveResource<T> {
  status: Signal<ConnectionStatus>
  data: Signal<T | null>
  connect: () => void
  disconnect: () => void
  send: (data: any) => void
}

/**
 * Creates a live, reactive resource over a real-time connection.
 *
 * @template T The expected type of data from the connection.
 * @param transport The protocol-specific transport to use.
 * @returns A live resource instance.
 */
export function createLiveResource<T>(transport: Transport): LiveResource<T> {
  const status = useSignal<ConnectionStatus>('disconnected')
  const data = useSignal<T | null>(null)

  const hooks = {
    onOpen: () => {
      status.value = 'connected'
    },
    onMessage: (message: any) => {
      data.value = message
    },
    onClose: () => {
      status.value = 'disconnected'
    },
    onError: (error: any) => {
      console.error('LiveResource error:', error)
      status.value = 'disconnected'
    },
  }

  const connect = () => {
    status.value = 'connecting'
    transport.connect(hooks)
  }

  const disconnect = () => {
    transport.disconnect()
  }

  const send = (message: any) => {
    transport.send(message)
  }

  return { status, data, connect, disconnect, send }
}

/**
 * A transport implementation for WebSockets.
 */
export class WebSocketTransport implements Transport {
  private ws: WebSocket | null = null
  private hooks: {
    onOpen: () => void
    onMessage: (data: any) => void
    onClose: () => void
    onError: (error: any) => void
  } | null = null

  constructor(private url: string) {}

  connect(hooks: any) {
    this.hooks = hooks
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => this.hooks?.onOpen()
    this.ws.onmessage = event => this.hooks?.onMessage(event.data)
    this.ws.onclose = () => this.hooks?.onClose()
    this.ws.onerror = error => this.hooks?.onError(error)
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data)
    }
  }

  disconnect() {
    this.ws?.close()
  }
}
