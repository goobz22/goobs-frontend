import { GridProps } from '@mui/material'
import React from 'react'

interface RowConfigItem {
  row?: number
  column?: number
}

export interface CustomGridProps extends GridProps {
  variant?: 'threeColumns' | 'twoColumns' | 'oneColumn'
  marginBetweenColumns?: number
  marginBetweenRows?: number
  marginTop?: number
  marginBottom?: number
  marginRight?: number
  marginLeft?: number
  children: React.ReactNode
  rowConfig?: (RowConfigItem | undefined)[]
}
