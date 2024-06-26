// src\components\Content\Structure\paragraph\useGridParagraph.tsx
import React from 'react'
import { Typography } from 'goobs-repo'
import { columnconfig } from 'goobs-repo'
import { TypographyProps } from './../../../../types/content'

const useGridParagraph = (grid: {
  paragraph?: TypographyProps | TypographyProps[]
}) => {
  if (!grid.paragraph) return null

  const renderParagraph = (
    paragraphItem: TypographyProps,
    index: number
  ): columnconfig => {
    const { text, fontcolor, columnconfig, cellconfig } = paragraphItem
    const fontvariant = 'merriparagraph'

    return {
      ...columnconfig,
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
