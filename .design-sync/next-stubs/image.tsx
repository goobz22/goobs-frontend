// design-sync bundle stub for `next/image`.
// Same rationale as ./link.tsx — the real next/image reads
// `process.env.__NEXT_IMAGE_OPTS` at module scope and throws in the IIFE.
// @storybook/nextjs mocks next/image as a plain <img>, so this matches the
// reference render.
import React from 'react'

type Src = string | { src?: string; default?: string }

const NEXT_ONLY = new Set([
  'loader', 'quality', 'priority', 'placeholder', 'blurDataURL', 'unoptimized',
  'fill', 'sizes', 'loading', 'onLoadingComplete', 'overrideSrc',
])

const resolveSrc = (src: Src | undefined): string => {
  if (typeof src === 'string') return src
  if (src && typeof src === 'object') return src.src ?? src.default ?? ''
  return ''
}

const Image = React.forwardRef<HTMLImageElement, { src?: Src; alt?: string; fill?: boolean } & Record<string, unknown>>(
  function Image({ src, alt, fill, style, ...rest }, ref) {
    const props: Record<string, unknown> = {}
    for (const k in rest) if (!NEXT_ONLY.has(k)) props[k] = rest[k]
    // `fill` makes next/image absolutely fill its parent; mirror that so layout matches.
    const mergedStyle = fill
      ? { position: 'absolute', inset: 0, width: '100%', height: '100%', ...(style as object) }
      : style
    return React.createElement('img', { src: resolveSrc(src), alt: alt ?? '', ref, style: mergedStyle, ...props })
  },
)

export default Image
