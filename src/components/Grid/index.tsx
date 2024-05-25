'use client'

import React from 'react'
import { Grid, Box, GridProps } from '@mui/material'
import { Alignment } from '../../types/content/alignment'
import { Animation } from '../../types/content/animation'

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

const defaultGridConfig: gridconfig = {
  rows: 1,
  gridname: '',
  alignment: 'center',
  margintop: 0,
  marginbottom: 0,
  marginright: 0,
  marginleft: 0,
  gridwidth: '100%',
  animation: 'none',
  bordercolor: '',
}

const defaultRowConfig: rowconfig = {
  columns: 1,
  gridname: '',
  alignment: 'center',
  rowwidth: 'auto',
  marginbetweenrows: 0,
  margintop: 0,
  marginbottom: 0,
  marginright: 0,
  marginleft: 0,
  animation: 'none',
  bordercolor: '',
}

const defaultColumnConfig: columnconfig = {
  row: 1,
  column: 1,
  gridname: '',
  alignment: 'center',
  margintop: 0,
  columnwidth: 'auto',
  marginbottom: 0,
  marginright: 0,
  marginleft: 0,
  animation: 'none',
  component: null,
  bordercolor: '',
  cellconfig: {
    border: 'none',
  },
}

const defaultCellConfig: cellconfig = {
  border: 'none',
}

const CustomGrid: React.FC<CustomGridProps> = ({
  gridconfig = defaultGridConfig,
  rowconfig = defaultRowConfig,
  columnconfig = [defaultColumnConfig],
  cellconfig = defaultCellConfig,
}) => {
  const gridConfigValues = Array.isArray(gridconfig)
    ? gridconfig[0]
    : gridconfig

  const rows = gridConfigValues.rows || 1

  return (
    <Box
      // @ts-ignore
      mt={gridConfigValues.margintop || 0}
      mb={gridConfigValues.marginbottom || 0}
      ml={gridConfigValues.marginleft || 0}
      mr={gridConfigValues.marginright || 0}
      width={gridConfigValues.gridwidth || '100%'}
      alignItems="center"
    >
      {Array.from({ length: rows }).map((_, rowIndex) => {
        const currentRowConfig = Array.isArray(rowconfig)
          ? rowconfig[rowIndex]
          : rowconfig

        const columns = currentRowConfig.columns || 1

        return (
          <Grid
            key={`row-${rowIndex}`}
            container
            alignItems="center"
            display="flex"
            justifyContent="center"
            sx={{
              marginTop:
                rowIndex === 0
                  ? currentRowConfig.margintop || 0
                  : currentRowConfig.marginbetweenrows || 0,
              marginBottom:
                rowIndex === rows - 1 ? currentRowConfig.marginbottom || 0 : 0,
              marginLeft: currentRowConfig.marginleft || 0,
              width: currentRowConfig.rowwidth || 'auto',
            }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => {
              const currentColumnConfig = columnconfig.find(
                c => c.row === rowIndex + 1 && c.column === columnIndex + 1
              )

              const columnWidth =
                currentColumnConfig?.columnwidth || `${100 / columns}%`

              const isPixelWidth = columnWidth.endsWith('px')

              const justifyContent =
                currentColumnConfig?.alignment === 'left'
                  ? 'flex-start'
                  : currentColumnConfig?.alignment === 'right'
                    ? 'flex-end'
                    : 'center'

              const currentCellConfig =
                currentColumnConfig?.cellconfig || cellconfig

              const hasBorder = currentCellConfig.border === 'solid'

              return (
                <Grid
                  item
                  alignItems="center"
                  display="flex"
                  justifyContent={justifyContent}
                  key={`column-${columnIndex}`}
                  xs={12}
                  sm={isPixelWidth ? 'auto' : true}
                  sx={{
                    display: 'flex',
                    marginRight:
                      columnIndex === columns - 1
                        ? currentRowConfig.marginright || 0
                        : 0,
                    width: isPixelWidth ? columnWidth : 'auto',
                    flexBasis: isPixelWidth ? 'auto' : columnWidth,
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
                    },
                  }}
                >
                  <Box
                    width={currentCellConfig.width || '100%'}
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
  )
}

export default CustomGrid
