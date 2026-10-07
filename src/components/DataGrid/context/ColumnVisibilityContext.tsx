'use client'

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'

interface ColumnVisibility {
  [key: string]: boolean
}

interface ColumnVisibilityContextValue {
  columnVisibility: ColumnVisibility
  columns: string[]
  setColumns: (columns: string[]) => void
  toggleColumn: (field: string) => void
  setAllColumns: (value: boolean, columns: string[]) => void
  saveVisibility: (newState: ColumnVisibility) => void
  resetVisibility: (columns: string[]) => void
}

const ColumnVisibilityContext = createContext<
  ColumnVisibilityContextValue | undefined
>(undefined)

interface ColumnVisibilityProviderProps {
  children: ReactNode
  storageKey?: string
}

export function ColumnVisibilityProvider({
  children,
  storageKey,
}: ColumnVisibilityProviderProps) {
  // Load initial state from localStorage
  const getInitialVisibility = (): ColumnVisibility => {
    if (typeof window === 'undefined' || !storageKey) return {}
    try {
      const parsed: unknown = JSON.parse(
        localStorage.getItem(storageKey) ?? '{}'
      )
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
        return {}
      return Object.fromEntries(
        Object.entries(parsed).filter(
          ([field, visible]) =>
            typeof visible === 'boolean' &&
            field !== '__proto__' &&
            field !== 'prototype' &&
            field !== 'constructor'
        )
      )
    } catch {
      return {}
    }
  }

  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibility>(getInitialVisibility)
  const [columns, setColumnsState] = useState<string[]>([])

  // Save to localStorage whenever visibility changes
  const saveToLocalStorage = useCallback(
    (visibility: ColumnVisibility) => {
      if (typeof window !== 'undefined' && storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(visibility))
        } catch (error) {
          console.error(
            'Failed to save column visibility to localStorage:',
            error
          )
        }
      }
    },
    [storageKey]
  )

  const setColumns = useCallback((newColumns: string[]) => {
    setColumnsState(newColumns)
  }, [])

  const toggleColumn = useCallback(
    (field: string) => {
      setColumnVisibility(prev => {
        const newVisibility = {
          ...prev,
          [field]: !prev[field],
        }
        saveToLocalStorage(newVisibility)
        return newVisibility
      })
    },
    [saveToLocalStorage]
  )

  const setAllColumns = useCallback(
    (value: boolean, columnsList: string[]) => {
      const newVisibility: ColumnVisibility = {}
      columnsList.forEach(column => {
        newVisibility[column] = value
      })
      setColumnVisibility(newVisibility)
      saveToLocalStorage(newVisibility)
    },
    [saveToLocalStorage]
  )

  const saveVisibility = useCallback(
    (newState: ColumnVisibility) => {
      setColumnVisibility(newState)
      saveToLocalStorage(newState)
    },
    [saveToLocalStorage]
  )

  const resetVisibility = useCallback(
    (columnsList: string[]) => {
      const newVisibility: ColumnVisibility = {}
      columnsList.forEach(column => {
        newVisibility[column] = true
      })
      setColumnVisibility(newVisibility)
      saveToLocalStorage(newVisibility)
    },
    [saveToLocalStorage]
  )

  const value: ColumnVisibilityContextValue = {
    columnVisibility,
    columns,
    setColumns,
    toggleColumn,
    setAllColumns,
    saveVisibility,
    resetVisibility,
  }

  return (
    <ColumnVisibilityContext.Provider value={value}>
      {children}
    </ColumnVisibilityContext.Provider>
  )
}

export function useColumnVisibility() {
  const context = useContext(ColumnVisibilityContext)
  if (context === undefined) {
    throw new Error(
      'useColumnVisibility must be used within a ColumnVisibilityProvider'
    )
  }
  return context
}
