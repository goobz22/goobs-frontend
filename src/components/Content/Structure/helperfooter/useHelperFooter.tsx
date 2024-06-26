import React from 'react'
import { Typography } from 'goobs-repo'
import { TypographyProps } from './../../../../types/content'
import { columnconfig } from 'goobs-repo'

const useHelperFooter = (grid: {
  helperfooter?: TypographyProps | TypographyProps[]
}) => {
  if (!grid.helperfooter) return null

  const renderHelperFooter = (
    helperFooterItem: TypographyProps,
    index: number
  ): columnconfig => {
    const { text, fontcolor, columnconfig } = helperFooterItem
    const fontvariant = 'merrihelperfooter'

    return {
      ...columnconfig,
      cellconfig: {
        border: 'none',
      },
      component: (
        <Typography
          key={`helperfooter-${index}`}
          text={text}
          fontvariant={fontvariant}
          fontcolor={fontcolor}
        />
      ),
    }
  }

  if (Array.isArray(grid.helperfooter)) {
    return grid.helperfooter.map(renderHelperFooter)
  } else {
    return renderHelperFooter(grid.helperfooter, 0)
  }
}

export default useHelperFooter
