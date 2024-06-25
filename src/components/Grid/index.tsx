'use client'

import React from 'react'
import { Grid, Box, GridProps, useMediaQuery, useTheme } from '@mui/material'
import { Alignment } from '../../types/content/alignment'
import { Animation } from '../../types/content/animation'
import {
  defaultGridConfig,
  defaultColumnConfig,
  defaultCellConfig,
} from './defaultconfig'

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
  animation?: Animation
  bordercolor?: string
}

export interface CustomGridProps extends GridProps {
  gridconfig?: gridconfig
  columnconfig?: columnconfig[]
  cellconfig?: cellconfig
}

export interface cellconfig {
  border?: 'none' | 'solid'
  minHeight?: string
  maxHeight?: string
  width?: string
  mobilewidth?: string
  tabletwidth?: string
  computerwidth?: string
}

const CustomGrid: React.FC<CustomGridProps> = ({
  gridconfig = defaultGridConfig,
  columnconfig = defaultColumnConfig,
  cellconfig = defaultCellConfig,
  ...rest
}) => {
  const gridConfigValues = Array.isArray(gridconfig)
    ? gridconfig[0]
    : gridconfig

  const gridJustifyContent =
    gridConfigValues.alignment === 'left'
      ? 'flex-start'
      : gridConfigValues.alignment === 'right'
        ? 'flex-end'
        : 'center'

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.between(0, 767))
  const isTablet = useMediaQuery(theme.breakpoints.between(768, 1023))
  const isComputer = useMediaQuery(theme.breakpoints.up(1024))

  const minGridWidth = '300px'

  // Calculate the number of rows based on the columnconfig
  const rows = Math.max(...columnconfig.map(c => c.row || 1))

  return (
    <Box
      width={gridConfigValues.gridwidth || '100%'}
      display="flex"
      justifyContent={gridJustifyContent}
      minWidth={minGridWidth}
    >
      <Box
        // @ts-ignore
        mt={gridConfigValues.margintop || 0}
        mb={gridConfigValues.marginbottom || 0}
        ml={gridConfigValues.marginleft || 0}
        mr={gridConfigValues.marginright || 0}
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        {...rest}
      >
        {Array.from({ length: rows }).map((_, rowIndex) => {
          const columns = Math.max(
            ...columnconfig
              .filter(c => c.row === rowIndex + 1)
              .map(c => c.column || 1)
          )

          return (
            <Grid
              key={`row-${rowIndex}`}
              container
              alignItems="center"
              display="flex"
              justifyContent="center"
              sx={{
                marginTop: rowIndex === 0 ? gridConfigValues.margintop || 0 : 0,
                marginBottom:
                  rowIndex === rows - 1
                    ? gridConfigValues.marginbottom || 0
                    : 0,
                marginLeft: gridConfigValues.marginleft || 0,
                marginRight: gridConfigValues.marginright || 0,
                flexGrow: 1,
              }}
            >
              {Array.from({ length: columns }).map((_, columnIndex) => {
                const currentColumnConfig = columnconfig.find(
                  c => c.row === rowIndex + 1 && c.column === columnIndex + 1
                )

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

                const justifyContent =
                  currentColumnConfig?.alignment === 'left'
                    ? 'flex-start'
                    : currentColumnConfig?.alignment === 'right'
                      ? 'flex-end'
                      : 'center'

                const currentCellConfig =
                  currentColumnConfig?.cellconfig || cellconfig

                const hasBorder = currentCellConfig.border === 'solid'

                const cellWidth = currentCellConfig.width
                  ? currentCellConfig.width
                  : '100%'

                const mobileWidth = currentCellConfig.mobilewidth || '100%'
                const tabletWidth = currentCellConfig.tabletwidth || '100%'
                const computerWidth = currentCellConfig.computerwidth || '100%'

                return (
                  <Grid
                    item
                    alignItems="center"
                    display="flex"
                    justifyContent={justifyContent}
                    key={`column-${columnIndex}`}
                    sx={{
                      display: 'flex',
                      marginRight:
                        columnIndex === columns - 1
                          ? currentColumnConfig?.marginright || 0
                          : 0,
                      width: columnWidth,
                      '--Grid-borderWidth': hasBorder ? '1px' : '0',
                      borderTop: hasBorder
                        ? 'var(--Grid-borderWidth) solid'
                        : 'none',
                      borderLeft: hasBorder
                        ? 'var(--Grid-borderWidth) solid'
                        : 'none',
                      borderColor: 'divider',
                      '& > div': {
                        borderRight: hasBorder
                          ? 'var(--Grid-borderWidth) solid'
                          : 'none',
                        borderBottom: hasBorder
                          ? 'var(--Grid-borderWidth) solid'
                          : 'none',
                        borderColor: 'divider',
                        minHeight: currentCellConfig.minHeight || 'auto',
                        maxHeight: currentCellConfig.maxHeight || 'none',
                        height: currentCellConfig.maxHeight || 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: justifyContent,
                        marginTop: currentColumnConfig?.margintop || 0,
                        marginBottom: currentColumnConfig?.marginbottom || 0,
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
                      },
                    }}
                  >
                    <Box
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent={justifyContent}
                      pl={currentColumnConfig?.marginleft || 0}
                      pr={currentColumnConfig?.marginright || 0}
                    >
                      {currentColumnConfig?.component || null}
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          )
        })}
      </Box>
    </Box>
  )
}

export default CustomGrid
