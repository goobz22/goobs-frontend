// design-sync bundle stub for `next/link`.
// The real next/link reads `process.env.__NEXT_ROUTER_BASEPATH` etc. at module
// scope; in the design-system IIFE (no `process` global) that throws at init and
// blanks window.GoobsFrontend. The storybook reference side renders next/link via
// @storybook/nextjs's mock — a plain <a> — so this stub matches it 1:1.
import React from 'react'

type Href = string | { pathname?: string; href?: string }

// Props next/link accepts that have no <a> meaning — drop them so React doesn't
// warn about unknown DOM attributes.
const NEXT_ONLY = new Set([
  'prefetch', 'replace', 'scroll', 'shallow', 'passHref', 'legacyBehavior',
  'locale', 'as',
])

const resolveHref = (href: Href | undefined): string => {
  if (typeof href === 'string') return href
  if (href && typeof href === 'object') return href.href ?? href.pathname ?? '#'
  return '#'
}

const Link = React.forwardRef<HTMLAnchorElement, { href?: Href; children?: React.ReactNode } & Record<string, unknown>>(
  function Link({ href, children, ...rest }, ref) {
    const props: Record<string, unknown> = {}
    for (const k in rest) if (!NEXT_ONLY.has(k)) props[k] = rest[k]
    return React.createElement('a', { href: resolveHref(href), ref, ...props }, children as React.ReactNode)
  },
)

export default Link
