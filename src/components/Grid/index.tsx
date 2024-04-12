import React from 'react'
import { Grid, Box } from '@mui/material'
import { CustomGridProps } from '@/types/grid'

const CustomGrid: React.FC<CustomGridProps> = ({
  variant,
  children,
  marginTop,
  marginBottom,
  marginBetween = 0,
  rowGap = marginBetween,
}) => {
  const childrenArray = React.Children.toArray(children)
  let rows = []

  if (variant === 'twoColumns' || variant === 'threeColumns') {
    const columns = variant === 'twoColumns' ? 2 : 3
    for (let i = 0; i < childrenArray.length; i += columns) {
      const rowItems = childrenArray.slice(i, i + columns)
      rows.push(
        <Grid item key={i} container>
          {rowItems.map((child, index) => (
            <Grid item key={index} xs={true}>
              {React.cloneElement(child as React.ReactElement, {
                sx: { margin: 0 },
              })}
            </Grid>
          ))}
        </Grid>
      )
    }
  } else {
    rows = childrenArray.map((child, index) => (
      <Grid item key={index} sx={{ margin: 0 }}>
        {React.cloneElement(child as React.ReactElement, {
          sx: { margin: 0 },
        })}
      </Grid>
    ))
  }

  return (
    <Box mt={marginTop} mb={marginBottom}>
      <Grid container direction="column" rowGap={rowGap}>
        {rows}
      </Grid>
    </Box>
  )
}

export default CustomGrid
