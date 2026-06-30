'use client'
import React from 'react'
import Typography, { type TypographyProps } from '../../../Typography'

export interface LinkProps extends TypographyProps {
  link: string
}

/**
 * Render link items. Framework-agnostic: by default renders a plain anchor so
 * the component works in any host. A Next.js (or other router) consumer can
 * inject client-side navigation by passing `linkComponent={NextLink}` — it
 * receives the same `href` prop. Avoids a module-scope `next/link` import,
 * which reads `process.env.__NEXT_*` at load and throws outside Next.
 */
const useLink = (props: {
  link?: LinkProps | LinkProps[]
  linkComponent?: React.ElementType
}): React.ReactElement[] | null => {
  if (!props.link) return null

  const LinkEl: React.ElementType = props.linkComponent ?? 'a'

  const renderLink = (
    linkItem: LinkProps,
    index: number
  ): React.ReactElement => {
    const { link, text, styles, ...restProps } = linkItem

    if (!link) {
      throw new Error('Link property is required')
    }

    return (
      <LinkEl key={`link-${index}`} href={link}>
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
      </LinkEl>
    )
  }

  if (Array.isArray(props.link)) {
    return props.link.map((item, index) => renderLink(item, index))
  } else {
    return [renderLink(props.link, 0)]
  }
}

export default useLink
