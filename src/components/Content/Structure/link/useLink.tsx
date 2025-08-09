'use client'
import React from 'react'
import Link from 'next/link'
import Typography, { type TypographyProps } from '../../../Typography'

export interface LinkProps extends TypographyProps {
  link: string
}

const useLink = (props: {
  link?: LinkProps | LinkProps[]
}): React.ReactElement[] | null => {
  if (!props.link) return null

  const renderLink = (
    linkItem: LinkProps,
    index: number
  ): React.ReactElement => {
    const { link, text, styles, ...restProps } = linkItem

    if (!link) {
      throw new Error('Link property is required')
    }

    return (
      <Link key={`link-${index}`} href={link} passHref>
        <Typography
          {...(text !== undefined ? { text } : {})}
          styles={{
            theme: 'sacred',
            variant: styles?.variant?.startsWith('cinzel')
              ? styles.variant
              : 'cinzelparagraph',
            ...styles,
          }}
          {...restProps}
        />
      </Link>
    )
  }

  if (Array.isArray(props.link)) {
    return props.link.map((item, index) => renderLink(item, index))
  } else {
    return [renderLink(props.link, 0)]
  }
}

export default useLink
