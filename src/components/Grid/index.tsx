'use client'

import React from 'react'
import Grid2, { Grid2Props } from '@mui/material/Grid2'
import { Box, useMediaQuery, useTheme } from '@mui/material'

/** Defines the possible alignment options for grid content */
export type Alignment = 'left' | 'center' | 'right' | 'inherit' | 'justify'

/** Defines the possible border styles for grid cells */
export type BorderProp = 'none' | 'solid'

/**
 * Configuration for individual columns within the grid
 */
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

/**
 * Configuration for the overall grid
 */
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

/**
 * Props for the CustomGrid component
 */
export interface CustomGridProps extends Grid2Props {
  gridconfig?: gridconfig
  columnconfig?: columnconfig[]
  cellconfig?: cellconfig
}

/**
 * Configuration for individual cells within the grid
 */
export interface cellconfig {
  border?: BorderProp
  minHeight?: string
  maxHeight?: string
  width?: string
  mobilewidth?: string
  tabletwidth?: string
  computerwidth?: string
}

/**
 * CustomGrid component renders a customizable grid layout with configurable rows and columns.
 * It supports responsive design by adapting to different screen sizes (mobile, tablet, computer).
 *
 * @param props The props for the CustomGrid component.
 * @returns The rendered CustomGrid component.
 */
const CustomGrid: React.FC<CustomGridProps> = ({
  gridconfig,
  columnconfig,
  cellconfig,
  ...rest
}) => {
  // Extract grid configuration values
  const gridConfigValues = Array.isArray(gridconfig)
    ? gridconfig[0]
    : gridconfig

  // Determine grid justification based on alignment
  const gridJustifyContent =
    gridConfigValues?.alignment === 'left'
      ? 'flex-start'
      : gridConfigValues?.alignment === 'right'
        ? 'flex-end'
        : 'center'

  // Set up responsive breakpoints
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.between(0, 767))
  const isTablet = useMediaQuery(theme.breakpoints.between(768, 1023))
  const isComputer = useMediaQuery(theme.breakpoints.up(1024))

  const minGridWidth = '300px'

  // Calculate the number of rows based on the columnconfig
  const rows = Math.max(...(columnconfig || []).map(c => c.row || 1))

  return (
    <Box
      width={gridConfigValues?.gridwidth || '100%'}
      display="flex"
      justifyContent={gridJustifyContent}
      minWidth={minGridWidth}
    >
      <Box
        mt={gridConfigValues?.margintop || 0}
        mb={gridConfigValues?.marginbottom || 0}
        ml={gridConfigValues?.marginleft || 0}
        mr={gridConfigValues?.marginright || 0}
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        {...rest}
      >
        {Array.from({ length: rows }).map((_, rowIndex) => {
          // Calculate the number of columns in the current row
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
              justifyContent="center"
              sx={{
                marginTop:
                  rowIndex === 0 ? gridConfigValues?.margintop || 0 : 0,
                marginBottom:
                  rowIndex === rows - 1
                    ? gridConfigValues?.marginbottom || 0
                    : 0,
                marginLeft: gridConfigValues?.marginleft || 0,
                marginRight: gridConfigValues?.marginright || 0,
                flexGrow: 1,
                width: '100%',
              }}
            >
              {Array.from({ length: columns }).map((_, columnIndex) => {
                // Get the current column configuration
                const currentColumnConfig = (columnconfig || []).find(
                  c => c.row === rowIndex + 1 && c.column === columnIndex + 1
                )

                // Determine the column width based on screen size
                const columnWidth = isMobile
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

                // Determine justification of column content
                const justifyContent =
                  currentColumnConfig?.alignment === 'left'
                    ? 'flex-start'
                    : currentColumnConfig?.alignment === 'right'
                      ? 'flex-end'
                      : 'center'

                // Get current cell configuration
                const currentCellConfig =
                  currentColumnConfig?.cellconfig || cellconfig

                // Determine if cell has a border
                const hasBorder = currentCellConfig?.border === 'solid'

                // Determine cell width and responsive widths
                const cellWidth = currentCellConfig?.width || '100%'
                const mobileWidth = currentCellConfig?.mobilewidth || '100%'
                const tabletWidth = currentCellConfig?.tabletwidth || '100%'
                const computerWidth = currentCellConfig?.computerwidth || '100%'

                return (
                  <Grid2
                    key={`column-${columnIndex}`}
                    sx={{
                      display: 'flex',
                      justifyContent,
                      marginRight: currentColumnConfig?.marginright || 0,
                      marginLeft: currentColumnConfig?.marginleft || 0,
                      marginTop: currentColumnConfig?.margintop || 0,
                      marginBottom: currentColumnConfig?.marginbottom || 0,
                      width: columnWidth,
                      '--Grid-borderWidth': hasBorder ? '1px' : '0',
                      borderTop: hasBorder
                        ? 'var(--Grid-borderWidth) solid'
                        : 'none',
                      borderLeft: hasBorder
                        ? 'var(--Grid-borderWidth) solid'
                        : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      sx={{
                        borderRight: hasBorder
                          ? 'var(--Grid-borderWidth) solid'
                          : 'none',
                        borderBottom: hasBorder
                          ? 'var(--Grid-borderWidth) solid'
                          : 'none',
                        borderColor: 'divider',
                        minHeight: currentCellConfig?.minHeight || 'auto',
                        maxHeight: currentCellConfig?.maxHeight || 'none',
                        height: currentCellConfig?.maxHeight || 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent,
                        overflow: 'auto',
                        width: cellWidth,
                        minWidth: isMobile
                          ? mobileWidth
                          : isTablet
                            ? tabletWidth
                            : isComputer
                              ? computerWidth
                              : '100%',
                        maxWidth: isMobile
                          ? mobileWidth
                          : isTablet
                            ? tabletWidth
                            : isComputer
                              ? computerWidth
                              : '100%',
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
