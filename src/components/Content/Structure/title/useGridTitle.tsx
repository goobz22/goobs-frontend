import React from 'react'
import { Typography } from 'goobs-repo'
import { columnconfig } from 'goobs-repo'
import { TypographyProps } from './../../../../types/content'

const useGridTitle = (grid: {
  title?: TypographyProps | TypographyProps[]
}) => {
  if (!grid.title) return null

  const renderTitle = (
    titleItem: TypographyProps,
    index: number
  ): columnconfig => {
    const { text, fontcolor, columnconfig, cellconfig } = titleItem
    const fontvariant = 'merrih2'

    return {
      ...columnconfig,
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
