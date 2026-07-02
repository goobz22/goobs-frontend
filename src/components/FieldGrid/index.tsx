'use client'

import React, {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'
import cssStyles from './FieldGrid.module.css'

function mergeClassNames(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(' ')
}

export interface FieldGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Minimum column width fed to `minmax(min(100%, var(--fg-min)), 1fr)`.
   * Default `'250px'` (matches the dominant ThothOS field cluster).
   */
  minColWidth?: string
  /** CSS gap between cells. Default `clamp(12px, 3vw, 24px)`. */
  gap?: string
  /**
   * Underlying element. Default `'div'` with `role="group"`. `DetailGrid`
   * renders this as `'dl'` for definition-list semantics — when `as` is not
   * `'div'`, the implicit `role="group"` is dropped so the element keeps its
   * own native role (e.g. a `<dl>` stays a description list).
   */
  as?: ElementType
  children: ReactNode
}

/**
 * Responsive auto-fit field layout primitive: lays children out in a CSS grid
 * whose column track is `repeat(auto-fit, minmax(min(100%, var(--fg-min)),
 * 1fr))`, so the grid wraps to as many equal-width columns as fit and a
 * single field on a narrow viewport spans the full row instead of clipping.
 * `minColWidth` (default `'250px'`) and `gap` (default `'clamp(12px, 3vw,
 * 24px)'`) feed the CSS module as custom properties. Renders a `<div
 * role="group">` by default so assistive tech announces the cluster as one
 * related set of controls (name it via `aria-label` / `aria-labelledby`
 * forwarded through rest props); when `as` names another element (e.g.
 * `'dl'` for DetailGrid) the implicit group role is dropped so the element
 * keeps its native role.
 */
const FieldGrid = forwardRef<HTMLDivElement, FieldGridProps>(function FieldGrid(
  {
    minColWidth = '250px',
    gap = 'clamp(12px, 3vw, 24px)',
    as,
    role,
    className,
    style,
    children,
    ...restProps
  },
  ref
) {
  const mergedStyle: CSSProperties = {
    ...(style ?? {}),
    ['--fg-min' as string]: minColWidth,
    ['--fg-gap' as string]: gap,
  }

  const Element = (as ?? 'div') as ElementType
  // A plain <div> grid is a related set of controls → role="group". A
  // semantic element (e.g. <dl>) keeps its own native role unless the caller
  // explicitly overrides via `role`.
  const resolvedRole = role ?? (as === undefined ? 'group' : undefined)

  return (
    <Element
      ref={ref}
      {...(resolvedRole !== undefined && { role: resolvedRole })}
      className={mergeClassNames(cssStyles.grid, className)}
      style={mergedStyle}
      data-component="FieldGrid"
      data-field-grid="true"
      {...restProps}
    >
      {children}
    </Element>
  )
})

FieldGrid.displayName = 'FieldGrid'

export default FieldGrid
