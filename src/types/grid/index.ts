import { GridProps } from '@mui/material'
import React from 'react'

export interface CustomGridProps extends GridProps {
  variant?: 'threeColumns' | 'twoColumns' | 'oneColumn'
  marginBetween?: number
  children: React.ReactNode
}
