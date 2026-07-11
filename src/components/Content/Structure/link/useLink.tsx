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

    // A link needs a discernible accessible name (WCAG 2.4.4 / 4.1.2). The name
    // comes from the rendered Typography content, which is `text || children`
    // (Typography renders `text` when non-empty, else falls back to `children`).
    // Only when BOTH are empty would the anchor announce as an empty link, so in
    // that case label it with its destination URL. Mirroring Typography's own
    // `text || children` resolution is required for children-rendered links: a
    // visible child must NOT be overridden by an aria-label of the raw URL — that
    // is a Label-in-Name / accessible-name mismatch (WCAG 2.5.3 A / 4.1.2 A) that
    // blocks speech-input activation. `children` arrives via `restProps` (it is
    // destructured off `linkItem` above) and is spread onto `<Typography>` below.
    const hasVisibleText = Boolean(text || restProps.children)

    return (
      <LinkEl
        key={`link-${index}`}
        href={link}
        {...(hasVisibleText ? {} : { 'aria-label': link })}
      >
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
