import { GridProps } from '@mui/material'
import { Alignment } from '../../content/alignment'
import { Animation } from '../../content/animation'
import React from 'react'

export interface rowconfig {
  columns?: number
  gridname?: string
  alignment?: Alignment
  rowwidth?: string
  marginbetweenrows?: number
  margintop?: number
  marginbottom?: number
  marginright?: number
  marginleft?: number
  animation?: Animation
  bordercolor?: string
}

export interface columnconfig {
  row?: number
  column?: number
  gridname?: string
  alignment?: Alignment
  margintop?: number
  columnwidth?: string
  marginbottom?: number
  marginright?: number
  marginleft?: number
  animation?: Animation
  component?: React.ReactNode
  bordercolor?: string
  cellconfig?: cellconfig
}

export interface gridconfig {
  rows?: number
  gridname?: string
  alignment?: Alignment
  margintop?: number
  marginbottom?: number
  marginright?: number
  marginleft?: number
  gridwidth?: string
  animation?: Animation
  bordercolor?: string
}

export interface CustomGridProps extends GridProps {
  gridconfig?: gridconfig
  rowconfig?: rowconfig
  columnconfig?: columnconfig[]
  cellconfig?: cellconfig
}

export interface cellconfig {
  border?: 'none' | 'solid'
  minHeight?: string
  maxHeight?: string
  width?: string
}
