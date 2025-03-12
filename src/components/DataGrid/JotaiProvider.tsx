'use client'

import React from 'react'
import { Provider } from 'jotai'
import { dataGridStore } from './utils/useInitializeGrid'

interface DataGridProviderProps {
  children: React.ReactNode
}

export function DataGridProvider({ children }: DataGridProviderProps) {
  return <Provider store={dataGridStore}>{children}</Provider>
}
