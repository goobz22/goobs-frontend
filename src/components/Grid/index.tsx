import React from 'react'
import { Grid, Box, useMediaQuery, useTheme } from '@mui/material'
import { CustomGridProps } from '@/types/grid'

const CustomGrid: React.FC<CustomGridProps> = ({
  variant,
  children,
  marginTop = 0,
  marginBottom = 0,
  marginBetweenColumns = 0,
  marginBetweenRows = 0,
  width = 'fullWidth',
  rowConfig,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const childrenArray = React.Children.toArray(children)
  const rowCount = Math.max(...(rowConfig?.map(item => item?.row || 0) || [0]))
  const columnCount = isMobile ? 1 : variant === 'twoColumns' ? 2 : 1
  const gridItems: (React.ReactNode | undefined)[][] = Array.from(
    { length: rowCount },
    () => Array.from({ length: columnCount }, () => undefined)
  )
  rowConfig?.forEach((item, index) => {
    const rowIndex = item?.row ? item.row - 1 : index
    const columnIndex = isMobile ? 0 : item?.column ? item.column - 1 : 0
    if (!gridItems[rowIndex]) {
      gridItems[rowIndex] = Array.from({ length: columnCount }, () => undefined)
    }
    gridItems[rowIndex][columnIndex] = childrenArray[index]
  })
  const gridWidth = width === 'fullWidth' ? '100%' : `${width}px`

  return (
    <Box mt={marginTop} mb={marginBottom} width={gridWidth}>
      <Grid container direction="column" rowGap={marginBetweenRows}>
        {gridItems.map((row, rowIndex) => (
          <Grid item key={rowIndex} container columnGap={marginBetweenColumns}>
            {row.map((item, columnIndex) => (
              <Grid item key={`${rowIndex}-${columnIndex}`} xs={true}>
                {item || <Box />}
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default CustomGrid