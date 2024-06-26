import React from 'react'
import { Typography } from 'goobs-repo'
import { columnconfig } from 'goobs-repo'
import { TypographyProps } from './../../../../types/content'

const useBodyTitle = (grid: {
  bodytitle?: TypographyProps | TypographyProps[]
}) => {
  if (!grid.bodytitle) return null

  const renderBodyTitle = (
    bodyTitleItem: TypographyProps,
    index: number
  ): columnconfig => {
    const { text, fontcolor, columnconfig, cellconfig } = bodyTitleItem
    const fontvariant = 'merrih4'

    return {
      ...columnconfig,
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
