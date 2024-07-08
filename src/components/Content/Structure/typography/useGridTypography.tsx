import React from 'react'
import { Typography, TypographyProps } from '../../../Typography'
import { columnconfig, cellconfig } from '../../../Grid'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

export interface ExtendedTypographyProps
  extends Omit<TypographyProps, 'columnconfig'> {
  columnconfig?: ExtendedColumnConfig
  cellconfig?: cellconfig
}

const useGridTypography = (grid: {
  typography?: ExtendedTypographyProps | ExtendedTypographyProps[]
}): columnconfig | columnconfig[] | null => {
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

    if (
      !itemColumnConfig ||
      typeof itemColumnConfig !== 'object' ||
      typeof itemColumnConfig.row !== 'number' ||
      typeof itemColumnConfig.column !== 'number'
    ) {
      throw new Error(
        'columnconfig must be an object with row and column as numbers'
      )
    }

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
