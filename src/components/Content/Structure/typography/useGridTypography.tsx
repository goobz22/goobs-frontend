import React from 'react'
import { Typography, TypographyProps } from '../../../Typography'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedTypographyProps extends TypographyProps {
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

const useGridTypography = (grid: {
  typography?: ExtendedTypographyProps | ExtendedTypographyProps[]
}) => {
  if (!grid.typography) return null

  const renderTypography = (
    typographyItem: ExtendedTypographyProps,
    index: number
  ): columnconfig => {
    const {
      text,
      fontcolor,
      fontvariant,
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = typographyItem

    return {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
        border: 'none',
      },
      component: (
        <Typography
          key={`typography-${index}`}
          text={text}
          fontvariant={fontvariant}
          fontcolor={fontcolor}
          {...restProps}
        />
      ),
    }
  }

  if (Array.isArray(grid.typography)) {
    return grid.typography.map(renderTypography)
  } else {
    return renderTypography(grid.typography, 0)
  }
}

export default useGridTypography
