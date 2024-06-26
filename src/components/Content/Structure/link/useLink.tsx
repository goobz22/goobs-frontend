'use client'

import React from 'react'
import Link from 'next/link'
import { Typography } from 'goobs-repo'
import { LinkProps } from './../../../../types/content/link'
import { columnconfig } from 'goobs-repo'

const useLink = (grid: { link?: LinkProps | LinkProps[] }) => {
  if (!grid.link) return null

  const renderLink = (linkItem: LinkProps, index: number): columnconfig => {
    const { link, text, fontcolor, fontvariant, columnconfig } = linkItem

    // Extend the existing columnconfig with the component
    return {
      ...columnconfig,
      component: (
        <Link key={`link-${index}`} href={link} passHref>
          <Typography text={text} variant={fontvariant} color={fontcolor} />
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
