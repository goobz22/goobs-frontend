'use client'
import React from 'react'
import Link from 'next/link'
import { Typography, TypographyProps } from '../../../Typography'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedTypographyProps extends TypographyProps {
  columnconfig?: columnconfig
  cellconfig?: cellconfig
  link?: string
}

const useLink = (grid: {
  link?: ExtendedTypographyProps | ExtendedTypographyProps[]
}) => {
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
    return [renderLink(grid.link, 0)]
  }
}

export default useLink
