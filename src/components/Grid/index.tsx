'use client'

import React from 'react'
import Grid2, { Grid2Props } from '@mui/material/Grid2'
import { useMediaQuery } from '@mui/material'

type Alignment = 'left' | 'center' | 'right' | 'inherit' | 'justify'
type BorderProp = 'none' | 'solid'
type WrapProp = 'nowrap' | 'wrap'
type Breakpoint = 'xs' | 'sm' | 'md' | 'ms' | 'ml' | 'lg' | 'xl'

interface ResponsiveObject<T> {
  xs?: T
  sm?: T
  md?: T
  ms?: T
  ml?: T
  lg?: T
  xl?: T
}

type ResponsiveValue<T> = T | ResponsiveObject<T>

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

type columnconfig = {
  row: number
  column: number
  gridname?: string
  alignment?: Alignment
  margintop?: ResponsiveValue<number>
  marginbottom?: ResponsiveValue<number>
  marginright?: ResponsiveValue<number>
  marginleft?: ResponsiveValue<number>
  paddingtop?: ResponsiveValue<number>
  paddingbottom?: ResponsiveValue<number>
  paddingright?: ResponsiveValue<number>
  paddingleft?: ResponsiveValue<number>
  columnwidth?: string
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
  margintop?: ResponsiveValue<number>
  marginbottom?: ResponsiveValue<number>
  marginright?: ResponsiveValue<number>
  marginleft?: ResponsiveValue<number>
  paddingtop?: ResponsiveValue<number>
  paddingbottom?: ResponsiveValue<number>
  paddingright?: ResponsiveValue<number>
  paddingleft?: ResponsiveValue<number>
  gridwidth?: string
  bordercolor?: string
}

type CustomGridProps = Omit<Grid2Props, 'children'> & {
  gridconfig?: gridconfig
  columnconfig?: columnconfig[]
  cellconfig?: cellconfig
}

function isResponsiveObject<T>(
  value: ResponsiveValue<T> | undefined
): value is ResponsiveObject<T> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getResponsiveValue<T>(
  value: ResponsiveValue<T> | undefined,
  breakpoint: Breakpoint
): T | undefined {
  if (value === undefined) return undefined
  if (isResponsiveObject(value)) {
    return value[breakpoint]
  }
  return value
}

function CustomGrid({
  gridconfig,
  columnconfig,
  cellconfig,
  ...rest
}: CustomGridProps) {
  // Manually define media queries for breakpoints
  const isMobile = useMediaQuery('(max-width:600px)') // xs
  const isSmallTablet = useMediaQuery('(min-width:601px) and (max-width:900px)') // sm
  const isMediumSmall = useMediaQuery('(min-width:901px) and (max-width:960px)') // md
  const isMediumLarge = useMediaQuery(
    '(min-width:961px) and (max-width:1024px)'
  ) // ms
  const isLarge = useMediaQuery('(min-width:1025px) and (max-width:1170px)') // ml
  const isExtraLarge = useMediaQuery('(min-width:1537px)') // xl

  const currentBreakpoint = React.useMemo((): Breakpoint => {
    if (isMobile) return 'xs'
    if (isSmallTablet) return 'sm'
    if (isMediumSmall) return 'md'
    if (isMediumLarge) return 'ms'
    if (isLarge) return 'ml'
    if (isExtraLarge) return 'xl'
    return 'lg'
  }, [
    isMobile,
    isSmallTablet,
    isMediumSmall,
    isMediumLarge,
    isLarge,
    isExtraLarge,
  ])

  const gridConfigValues = Array.isArray(gridconfig)
    ? gridconfig[0]
    : gridconfig

  const gridJustifyContent =
    gridConfigValues?.alignment === 'left'
      ? 'flex-start'
      : gridConfigValues?.alignment === 'right'
        ? 'flex-end'
        : 'center'

  // Get responsive margin and padding values for the overall grid
  const gridMarginTop = getResponsiveValue(
    gridConfigValues?.margintop,
    currentBreakpoint
  )
  const gridMarginBottom = getResponsiveValue(
    gridConfigValues?.marginbottom,
    currentBreakpoint
  )
  const gridMarginLeft = getResponsiveValue(
    gridConfigValues?.marginleft,
    currentBreakpoint
  )
  const gridMarginRight = getResponsiveValue(
    gridConfigValues?.marginright,
    currentBreakpoint
  )

  const gridPaddingTop = getResponsiveValue(
    gridConfigValues?.paddingtop,
    currentBreakpoint
  )
  const gridPaddingBottom = getResponsiveValue(
    gridConfigValues?.paddingbottom,
    currentBreakpoint
  )
  const gridPaddingLeft = getResponsiveValue(
    gridConfigValues?.paddingleft,
    currentBreakpoint
  )
  const gridPaddingRight = getResponsiveValue(
    gridConfigValues?.paddingright,
    currentBreakpoint
  )

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
        // Apply grid-level margins and paddings
        marginTop: gridMarginTop ? `${gridMarginTop * 8}px` : 0,
        marginBottom: gridMarginBottom ? `${gridMarginBottom * 8}px` : 0,
        marginLeft: gridMarginLeft ? `${gridMarginLeft * 8}px` : 0,
        marginRight: gridMarginRight ? `${gridMarginRight * 8}px` : 0,
        paddingTop: gridPaddingTop ? `${gridPaddingTop * 8}px` : 0,
        paddingBottom: gridPaddingBottom ? `${gridPaddingBottom * 8}px` : 0,
        paddingLeft: gridPaddingLeft ? `${gridPaddingLeft * 8}px` : 0,
        paddingRight: gridPaddingRight ? `${gridPaddingRight * 8}px` : 0,
        // Remove or adjust the child selector that sets margin:0
        '& > *:not(.grid-column)': {
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
                  : isSmallTablet
                    ? currentColumnConfig?.tabletwidth ||
                      currentColumnConfig?.columnwidth ||
                      `${100 / columns}%`
                    : currentColumnConfig?.computerwidth ||
                      currentColumnConfig?.columnwidth ||
                      `${100 / columns}%`

              const justifyContent =
                currentColumnConfig?.alignment === 'left'
                  ? 'flex-start'
                  : currentColumnConfig?.alignment === 'right'
                    ? 'flex-end'
                    : 'center'

              // Get responsive margin and padding values for the column
              const marginTop = getResponsiveValue(
                currentColumnConfig?.margintop,
                currentBreakpoint
              )
              const marginBottom = getResponsiveValue(
                currentColumnConfig?.marginbottom,
                currentBreakpoint
              )
              const marginLeft = getResponsiveValue(
                currentColumnConfig?.marginleft,
                currentBreakpoint
              )
              const marginRight = getResponsiveValue(
                currentColumnConfig?.marginright,
                currentBreakpoint
              )

              const paddingTop = getResponsiveValue(
                currentColumnConfig?.paddingtop,
                currentBreakpoint
              )
              const paddingBottom = getResponsiveValue(
                currentColumnConfig?.paddingbottom,
                currentBreakpoint
              )
              const paddingLeft = getResponsiveValue(
                currentColumnConfig?.paddingleft,
                currentBreakpoint
              )
              const paddingRight = getResponsiveValue(
                currentColumnConfig?.paddingright,
                currentBreakpoint
              )

              return (
                <Grid2
                  key={`column-${columnIndex}`}
                  className="grid-column"
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

                    // Apply margin
                    marginLeft: marginLeft
                      ? `${marginLeft * 8}px !important`
                      : '0 !important',
                    marginRight: marginRight
                      ? `${marginRight * 8}px !important`
                      : '0 !important',
                    marginTop: marginTop
                      ? `${marginTop * 8}px !important`
                      : '0 !important',
                    marginBottom: marginBottom
                      ? `${marginBottom * 8}px !important`
                      : '0 !important',

                    // Apply padding
                    paddingLeft: paddingLeft
                      ? `${paddingLeft * 8}px !important`
                      : '0 !important',
                    paddingRight: paddingRight
                      ? `${paddingRight * 8}px !important`
                      : '0 !important',
                    paddingTop: paddingTop
                      ? `${paddingTop * 8}px !important`
                      : '0 !important',
                    paddingBottom: paddingBottom
                      ? `${paddingBottom * 8}px !important`
                      : '0 !important',

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
                  {currentColumnConfig?.component as React.ReactNode}
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
