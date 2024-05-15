import { GridProps } from '@mui/material'
import { Alignment } from '../../content/alignment'
import { Animation } from '../../content/animation'
import { ColorPaletteKeys } from '../../../themes/palette'
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
  bordercolor?: ColorPaletteKeys
  rowheight?: string
}

export interface columnconfig {
  row?: number
  column?: number
  gridname?: string
  alignment?: Alignment
  columnwidth?: string
  margintop?: number
  marginbottom?: number
  marginright?: number
  marginleft?: number
  animation?: Animation
  component?: React.ReactNode
  bordercolor?: ColorPaletteKeys
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
  bordercolor?: ColorPaletteKeys
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
}
