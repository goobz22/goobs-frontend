'use client'

import React from 'react'
import { Grid, Box } from '@mui/material'
import { CustomGridProps, cellconfig } from '@/types/grid/customgrid'
import {
  defaultGridConfig,
  defaultRowConfig,
  defaultColumnConfig,
} from './defaultconfig'

const defaultCellConfig: cellconfig = {
  border: 'none',
}

const CustomGrid: React.FC<CustomGridProps> = ({
  gridconfig = defaultGridConfig,
  rowconfig = defaultRowConfig,
  columnconfig = defaultColumnConfig,
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
              minHeight: currentRowConfig.rowheight || 'auto',
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
                      minHeight:
                        currentColumnConfig?.cellconfig?.minHeight || '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: justifyContent,
                      marginTop: currentColumnConfig?.margintop || 0,
                      marginBottom: currentColumnConfig?.marginbottom || 0,
                    },
                  }}
                >
                  <Box
                    width="100%"
                    minHeight="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent={justifyContent}
                    pl={
                      currentColumnConfig?.alignment === 'left'
                        ? currentColumnConfig?.marginleft || 0
                        : 0
                    }
                    pr={
                      currentColumnConfig?.alignment === 'right'
                        ? currentColumnConfig?.marginright || 0
                        : 0
                    }
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
