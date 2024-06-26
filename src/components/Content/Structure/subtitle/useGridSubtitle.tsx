import React from 'react'
import { Typography } from 'goobs-repo'
import { columnconfig } from 'goobs-repo'
import { TypographyProps } from './../../../../types/content'

const useGridSubtitle = (grid: {
  subtitle?: TypographyProps | TypographyProps[]
}) => {
  if (!grid.subtitle) return null

  const renderSubtitle = (
    subtitleItem: TypographyProps,
    index: number
  ): columnconfig => {
    const { text, fontcolor, columnconfig, cellconfig } = subtitleItem
    const fontvariant = 'merrih3'

    return {
      ...columnconfig,
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
