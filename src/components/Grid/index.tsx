'use client'

import React, { JSX } from 'react'
import Grid2, { Grid2Props } from '@mui/material/Grid2'
import { useMediaQuery, useTheme } from '@mui/material'

type Alignment = 'left' | 'center' | 'right' | 'inherit' | 'justify'
type BorderProp = 'none' | 'solid'
type WrapProp = 'nowrap' | 'wrap'

type columnconfig = {
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

type gridconfig = {
  gridname?: string
  alignment?: Alignment
  margintop?: number
  marginbottom?: number
  marginright?: number
  marginleft?: number
  gridwidth?: string
  bordercolor?: string
}

type cellconfig = {
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

type CustomGridProps = Omit<Grid2Props, 'children'> & {
  gridconfig?: gridconfig
  columnconfig?: columnconfig[]
  cellconfig?: cellconfig
}

function CustomGrid({
  gridconfig,
  columnconfig,
  cellconfig,
  ...rest
}: CustomGridProps): JSX.Element {
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

  const rows = Math.max(...(columnconfig || []).map(c => c.row || 1))

  return (
    <Grid2
      container
      width={gridConfigValues?.gridwidth || '100%'}
      display="flex"
      flexDirection="column"
      justifyContent={gridJustifyContent}
      minWidth="300px"
      sx={{
        padding: 0,
        margin: 0,
        gap: 0,
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
              width: '100%',
              gap: 0,
              padding: 0,
              margin: 0,
              height: 'fit-content',
              minHeight: 'min-content',
              border: 'none',
              '& > *': {
                border: 'none !important',
                padding: 0,
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
                      : currentColumnConfig?.columnwidth || `${100 / columns}%`

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
                    alignItems: 'center',
                    width: columnWidth,
                    position: 'relative',
                    flexGrow: hasFixedWidth ? 0 : 1,
                    flexShrink: hasFixedWidth ? 0 : 1,
                    flexBasis: hasFixedWidth ? columnWidth : 'auto',
                    height: 'fit-content',
                    padding: 0,
                    marginLeft: currentColumnConfig?.marginleft
                      ? `${currentColumnConfig.marginleft * 8}px`
                      : 0,
                    marginRight: currentColumnConfig?.marginright
                      ? `${currentColumnConfig.marginright * 8}px`
                      : 0,
                    marginTop: currentColumnConfig?.margintop
                      ? `${currentColumnConfig.margintop * 8}px`
                      : 0,
                    marginBottom: currentColumnConfig?.marginbottom
                      ? `${currentColumnConfig.marginbottom * 8}px`
                      : 0,
                    border: 'none',
                    backgroundColor: currentCellConfig?.backgroundColor,
                    minHeight: 'min-content',
                    overflow: 'hidden',
                    whiteSpace: shouldWrap ? 'normal' : 'nowrap',
                    textOverflow: shouldWrap ? 'clip' : 'ellipsis',
                    '& > *': {
                      border: 'none !important',
                      padding: 0,
                      margin: 0,
                    },
                  }}
                  onClick={currentCellConfig?.onClick}
                >
                  {React.isValidElement(currentColumnConfig?.component)
                    ? currentColumnConfig?.component
                    : null}
                </Grid2>
              )
            })}
          </Grid2>
        )
      })}
    </Grid2>
  )
}

CustomGrid.displayName = 'CustomGrid'

export default CustomGrid
export type { CustomGridProps, columnconfig, gridconfig, cellconfig }
