'use client'

/**
 * =============================================================================
 * FIELDGRID — responsive auto-fit field layout primitive
 * =============================================================================
 *
 * Absorbs the ~134 hand-rolled `repeat(auto-fit, minmax(min(100%, …), 1fr))`
 * grid re-rolls across ThothOS form sections (reference: InlineManageContact
 * :203). Every "Personal Information" / "Billing" / "Address" field cluster
 * re-declares the same `display: grid` + `gridTemplateColumns` + `gap` inline.
 * FieldGrid collapses that into a single `<div role="group">` whose column
 * track is driven by the CSS module from two custom properties.
 *
 *   <FieldGrid>
 *     <TextField label="Full Name" ... />
 *     <TextField label="Email" ... />
 *     <Dropdown label="State" ... />
 *   </FieldGrid>
 *
 *   <FieldGrid minColWidth="180px" gap="8px"> ...tighter cluster... </FieldGrid>
 *
 * The grid wraps to as many equal-width columns as fit, never letting a column
 * narrower than `min(100%, minColWidth)` — so a single field on a narrow
 * viewport spans the full row instead of clipping.
 *
 * `role="group"` lets assistive tech announce the cluster as one related set
 * of controls; pair with `aria-labelledby` / `aria-label` (forwarded via
 * `...restProps`) to name the group from a section heading.
 *
 * =============================================================================
 */

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
