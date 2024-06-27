import React from 'react'
import { Typography, TypographyProps } from '../../../Typography'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedTypographyProps extends TypographyProps {
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

const useHelperFooter = (grid: {
  helperfooter?: ExtendedTypographyProps | ExtendedTypographyProps[]
}) => {
  if (!grid.helperfooter) return null

  const renderHelperFooter = (
    helperFooterItem: ExtendedTypographyProps,
    index: number
  ): columnconfig => {
    const {
      text,
      fontcolor,
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = helperFooterItem
    const fontvariant = 'merrihelperfooter'

    return {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
        border: 'none',
      },
      component: (
        <Typography
          key={`helperfooter-${index}`}
          text={text}
          fontvariant={fontvariant}
          fontcolor={fontcolor}
          {...restProps}
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
