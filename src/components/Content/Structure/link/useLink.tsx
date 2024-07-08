'use client'
import React from 'react'
import Link from 'next/link'
import { Typography, TypographyProps } from '../../../Typography'
import { columnconfig, cellconfig } from '../../../Grid'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

export interface ExtendedTypographyProps
  extends Omit<TypographyProps, 'columnconfig'> {
  columnconfig?: ExtendedColumnConfig
  cellconfig?: cellconfig
  link: string
}

const useLink = (grid: {
  link?: ExtendedTypographyProps | ExtendedTypographyProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.link) return null

  const renderLink = (
    linkItem: ExtendedTypographyProps,
    index: number
  ): columnconfig => {
    const {
      link,
      text,
      fontcolor,
      fontvariant,
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = linkItem

    if (!link) {
      throw new Error('Link property is required in ExtendedTypographyProps')
    }

    if (
      !itemColumnConfig ||
      typeof itemColumnConfig !== 'object' ||
      typeof itemColumnConfig.row !== 'number' ||
      typeof itemColumnConfig.column !== 'number'
    ) {
      throw new Error(
        'columnconfig must be an object with row and column as numbers'
      )
    }

    return {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
      },
      component: (
        <Link key={`link-${index}`} href={link} passHref {...restProps}>
          <Typography
            text={text}
            fontvariant={fontvariant}
            fontcolor={fontcolor}
          />
        </Link>
      ),
    }
  }

  if (Array.isArray(grid.link)) {
    return grid.link.map(renderLink)
  } else {
    return renderLink(grid.link, 0)
  }
}

export default useLink
