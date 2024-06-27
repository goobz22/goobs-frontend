import React from 'react'
import { Typography, TypographyProps } from '../../../Typography'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedTypographyProps extends TypographyProps {
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

const useBodyTitle = (grid: {
  bodytitle?: ExtendedTypographyProps | ExtendedTypographyProps[]
}) => {
  if (!grid.bodytitle) return null

  const renderBodyTitle = (
    bodyTitleItem: ExtendedTypographyProps,
    index: number
  ): columnconfig => {
    const {
      text,
      fontcolor,
      fontvariant = 'merrih4',
      columnconfig: itemColumnConfig,
      cellconfig,
    } = bodyTitleItem

    return {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
        border: 'none',
      },
      component: (
        <Typography
          key={`bodytitle-${index}`}
          text={text}
          fontvariant={fontvariant}
          fontcolor={fontcolor}
        />
      ),
    }
  }

  if (Array.isArray(grid.bodytitle)) {
    return grid.bodytitle.map(renderBodyTitle)
  } else {
    return renderBodyTitle(grid.bodytitle, 0)
  }
}

export default useBodyTitle
