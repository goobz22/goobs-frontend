import React from 'react'
import { Typography, TypographyProps } from '../../../Typography'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedTypographyProps extends TypographyProps {
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

const useGridSubtitle = (grid: {
  subtitle?: ExtendedTypographyProps | ExtendedTypographyProps[]
}) => {
  if (!grid.subtitle) return null

  const renderSubtitle = (
    subtitleItem: ExtendedTypographyProps,
    index: number
  ): columnconfig => {
    const {
      text,
      fontcolor,
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = subtitleItem
    const fontvariant = 'merrih3'

    return {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
        border: 'none',
      },
      component: (
        <Typography
          key={`subtitle-${index}`}
          text={text}
          fontvariant={fontvariant}
          fontcolor={fontcolor}
          {...restProps}
        />
      ),
    }
  }

  if (Array.isArray(grid.subtitle)) {
    return grid.subtitle.map(renderSubtitle)
  } else {
    return renderSubtitle(grid.subtitle, 0)
  }
}

export default useGridSubtitle
