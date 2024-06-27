import React from 'react'
import { Typography, TypographyProps } from '../../../Typography'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedTypographyProps extends TypographyProps {
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

const useGridTitle = (grid: {
  title?: ExtendedTypographyProps | ExtendedTypographyProps[]
}) => {
  if (!grid.title) return null

  const renderTitle = (
    titleItem: ExtendedTypographyProps,
    index: number
  ): columnconfig => {
    const {
      text,
      fontcolor,
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = titleItem
    const fontvariant = 'merrih2'

    return {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
        border: 'none',
      },
      component: (
        <Typography
          key={`title-${index}`}
          text={text}
          fontvariant={fontvariant}
          fontcolor={fontcolor}
          {...restProps}
        />
      ),
    }
  }

  if (Array.isArray(grid.title)) {
    return grid.title.map(renderTitle)
  } else {
    return renderTitle(grid.title, 0)
  }
}

export default useGridTitle
