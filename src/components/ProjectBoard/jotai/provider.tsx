'use client'

import React from 'react'
import { Provider, createStore } from 'jotai'
import {
  columnsAtom,
  viewStateAtom,
  animationOriginAtom,
  activeAddTaskFormAtom,
  activeTaskIdAtom,
} from './atom'

// Create a custom store
export const store = createStore()

// Initialize the store with our atoms to ensure they're properly registered
store.set(columnsAtom, [])
store.set(viewStateAtom, 'board')
store.set(animationOriginAtom, null)
store.set(activeAddTaskFormAtom, null)
store.set(activeTaskIdAtom, null)

/**
 * A Jotai Provider component that uses a custom store to prevent
 * "multiple instances" error in Next.js applications.
 */
export function JotaiProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return <Provider store={store}>{children}</Provider>
}
