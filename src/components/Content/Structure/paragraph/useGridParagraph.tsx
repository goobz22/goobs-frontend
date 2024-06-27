import React from 'react'
import { Typography, TypographyProps } from '../../../Typography'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedTypographyProps extends TypographyProps {
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

const useGridParagraph = (grid: {
  paragraph?: ExtendedTypographyProps | ExtendedTypographyProps[]
}) => {
  if (!grid.paragraph) return null

  const renderParagraph = (
    paragraphItem: ExtendedTypographyProps,
    index: number
  ): columnconfig => {
    const {
      text,
      fontcolor,
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = paragraphItem
    const fontvariant = 'merriparagraph'

    return {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
        border: 'none',
      },
      component: (
        <Typography
          key={`paragraph-${index}`}
          text={text}
          fontvariant={fontvariant}
          fontcolor={fontcolor}
          {...restProps}
        />
      ),
    }
  }

  if (Array.isArray(grid.paragraph)) {
    return grid.paragraph.map(renderParagraph)
  } else {
    return renderParagraph(grid.paragraph, 0)
  }
}

export default useGridParagraph
