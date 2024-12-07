'use client'

import React from 'react'
import Grid2, { Grid2Props } from '@mui/material/Grid2'
import { Box, useMediaQuery, useTheme } from '@mui/material'

export type Alignment = 'left' | 'center' | 'right' | 'inherit' | 'justify'
export type BorderProp = 'none' | 'solid'
export type WrapProp = 'nowrap' | 'wrap'

export interface columnconfig {
  row: number
  column: number
  gridname?: string
  alignment?: Alignment
  margintop?: number
  columnwidth?: string
  marginbottom?: number
  marginright?: number
  marginleft?: number
  component?: React.ReactNode
  bordercolor?: string
  cellconfig?: cellconfig
  mobilewidth?: string
  tabletwidth?: string
  computerwidth?: string
}

export interface gridconfig {
  gridname?: string
  alignment?: Alignment
  margintop?: number
  marginbottom?: number
  marginright?: number
  marginleft?: number
  gridwidth?: string
  bordercolor?: string
}

export interface CustomGridProps extends Grid2Props {
  gridconfig?: gridconfig
  columnconfig?: columnconfig[]
  cellconfig?: cellconfig
}

export interface cellconfig {
  border?: BorderProp
  minHeight?: string
  maxHeight?: string
  width?: string
  mobilewidth?: string
  tabletwidth?: string
  computerwidth?: string
  borderColor?: string
  backgroundColor?: string
  onClick?: () => void
  wrap?: WrapProp
}

const CustomGrid: React.FC<CustomGridProps> = ({
  gridconfig,
  columnconfig,
  cellconfig,
  ...rest
}) => {
  const gridConfigValues = Array.isArray(gridconfig)
    ? gridconfig[0]
    : gridconfig

  const gridJustifyContent =
    gridConfigValues?.alignment === 'left'
      ? 'flex-start'
      : gridConfigValues?.alignment === 'right'
        ? 'flex-end'
        : 'center'

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.between(0, 767))
  const isTablet = useMediaQuery(theme.breakpoints.between(768, 1023))
  const isComputer = useMediaQuery(theme.breakpoints.up(1024))

  const minGridWidth = '300px'

  const rows = Math.max(...(columnconfig || []).map(c => c.row || 1))

  return (
    <Box
      width={gridConfigValues?.gridwidth || '100%'}
      display="flex"
      justifyContent={gridJustifyContent}
      minWidth={minGridWidth}
      sx={{
        borderSpacing: 0,
        borderCollapse: 'collapse',
        padding: 0,
        margin: 0,
        '& > *': {
          border: 'none !important',
          padding: 0,
          margin: 0,
        },
      }}
    >
      <Box
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        sx={{
          padding: 0,
          margin: 0,
          '& > *': {
            border: 'none !important',
            padding: 0,
            margin: 0,
          },
        }}
        {...rest}
      >
        {Array.from({ length: rows }).map((_, rowIndex) => {
          const columns = Math.max(
            ...(columnconfig || [])
              .filter(c => c.row === rowIndex + 1)
              .map(c => c.column || 1)
          )

          return (
            <Grid2
              key={`row-${rowIndex}`}
              container
              alignItems="center"
              display="flex"
              justifyContent="flex-start"
              spacing={0}
              sx={{
                flexGrow: 1,
                width: '100%',
                gap: 0,
                padding: 0,
                margin: 0,
                border: 'none',
                '& > *': {
                  border: 'none !important',
                  padding: 0,
                  margin: 0,
                },
              }}
            >
              {Array.from({ length: columns }).map((_, columnIndex) => {
                const currentColumnConfig = (columnconfig || []).find(
                  c => c.row === rowIndex + 1 && c.column === columnIndex + 1
                )

                const currentCellConfig =
                  currentColumnConfig?.cellconfig || cellconfig

                const shouldWrap = currentCellConfig?.wrap !== 'nowrap'

                const hasFixedWidth = currentCellConfig?.width !== undefined
                const columnWidth = hasFixedWidth
                  ? currentCellConfig.width
                  : isMobile
                    ? currentColumnConfig?.mobilewidth ||
                      currentColumnConfig?.columnwidth ||
                      `${100 / columns}%`
                    : isTablet
                      ? currentColumnConfig?.tabletwidth ||
                        currentColumnConfig?.columnwidth ||
                        `${100 / columns}%`
                      : isComputer
                        ? currentColumnConfig?.computerwidth ||
                          currentColumnConfig?.columnwidth ||
                          `${100 / columns}%`
                        : currentColumnConfig?.columnwidth ||
                          `${100 / columns}%`

                const justifyContent =
                  currentColumnConfig?.alignment === 'left'
                    ? 'flex-start'
                    : currentColumnConfig?.alignment === 'right'
                      ? 'flex-end'
                      : 'center'

                return (
                  <Grid2
                    key={`column-${columnIndex}`}
                    sx={{
                      display: 'flex',
                      justifyContent,
                      width: columnWidth,
                      position: 'relative',
                      flexGrow: hasFixedWidth ? 0 : 1,
                      flexShrink: hasFixedWidth ? 0 : 1,
                      flexBasis: hasFixedWidth ? columnWidth : 'auto',
                      padding: 0,
                      margin: 0,
                      border: 'none',
                      '& > *': {
                        border: 'none !important',
                        padding: 0,
                        margin: 0,
                      },
                    }}
                  >
                    <Box
                      onClick={currentCellConfig?.onClick}
                      sx={{
                        backgroundColor: currentCellConfig?.backgroundColor,
                        minHeight: currentCellConfig?.minHeight || 'auto',
                        maxHeight: currentCellConfig?.maxHeight || 'none',
                        height: currentCellConfig?.maxHeight || 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent,
                        overflow: 'hidden',
                        width: '100%',
                        position: 'relative',
                        zIndex: currentCellConfig?.backgroundColor ? 1 : 0,
                        flexGrow: 1,
                        padding: 0,
                        margin: 0,
                        boxSizing: 'border-box',
                        whiteSpace: shouldWrap ? 'normal' : 'nowrap',
                        textOverflow: shouldWrap ? 'clip' : 'ellipsis',
                        border: 'none',
                        outline: 'none',
                        '&::before, &::after': {
                          display: 'none',
                        },
                      }}
                    >
                      {React.isValidElement(currentColumnConfig?.component)
                        ? currentColumnConfig?.component
                        : null}
                    </Box>
                  </Grid2>
                )
              })}
            </Grid2>
          )
        })}
      </Box>
    </Box>
  )
}

export default CustomGrid
