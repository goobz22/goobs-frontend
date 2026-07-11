'use client'

/**
 * @fileoverview DETAILFIELD / DETAILGRID — read-only label/value display primitives.
 *
 * Absorbs the ~125 hand-rolled `labelStyle` / `valueStyle` pairs across
 * ThothOS read-only surfaces (reference: InlineShowServiceInvoice:514). Every
 * "Billed To" / "Sold By" / summary block re-rolls `<div style={labelStyle}>`
 * + `<div style={valueStyle}>` per row. These primitives collapse that into
 * proper definition-list semantics.
 *
 *   <DetailField label="Customer" value={invoice.billedTo.fullName} />
 *
 *   <DetailGrid
 *     fields={[
 *       { label: 'Customer', value: invoice.billedTo.fullName },
 *       { label: 'Company', value: invoice.billedTo.companyName },
 *       { label: 'Address', value: invoice.billedTo.address, hideWhenEmpty: true },
 *     ]}
 *   />
 *
 *   // …or as children:
 *   <DetailGrid>
 *     <DetailField label="Invoice #" value={invoice.number} mono />
 *     <DetailField label="Total" value={invoice.total} valueColor="#10B981" />
 *   </DetailGrid>
 *
 * DetailGrid composes `FieldGrid` internally for the responsive column track,
 * but renders the grid as a `<dl>` (definition list) so the whole block is one
 * semantic group of term/description pairs. Each `DetailField` is a
 * `<dt>`/`<dd>` couplet wrapped in a `<div>` (valid `<dl>` content per the
 * HTML spec's "one or more dt followed by one or more dd, optionally wrapped
 * in a div" grouping rule).
 */

import React, { forwardRef, type CSSProperties, type ReactNode } from 'react'
import FieldGrid from '../FieldGrid'
import cssStyles from './DetailField.module.css'

function mergeClassNames(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(' ')
}

/**
 * Visual theme. `'sacred'` (the hardcoded default) is the gold-on-dark palette
 * that matches the ThothOS read-only surfaces this primitive replaced; `'light'`
 * and `'dark'` retarget the label + value colors so the couplet keeps a legible
 * ≥4.5:1 contrast (WCAG 1.4.3) when the block sits on a light or neutral-dark
 * surface instead of the near-black sacred backdrop. Emitted as `data-theme` on
 * the couplet root / definition-list root.
 */
export type DetailFieldTheme = 'sacred' | 'light' | 'dark'

// -----------------------------------------------------------------------------
// DETAILFIELD — single term/description couplet
// -----------------------------------------------------------------------------

export interface DetailFieldProps {
  /** The field label (rendered as the `<dt>` term). */
  label: ReactNode
  /** The field value (rendered as the `<dd>` description). */
  value: ReactNode
  /** Render the value in a monospace font (IDs, codes, IP/MAC/OID). */
  mono?: boolean
  /** Optional accent color for the value text. */
  valueColor?: string
  /**
   * When true and `value` is null / undefined / empty-string, the whole
   * field renders nothing — absorbs the `{x && (<><label/><value/></>)}`
   * conditional that wraps optional rows in the reference shell.
   */
  hideWhenEmpty?: boolean
  /**
   * Visual theme (`'sacred'` default). Retargets label/value colors so the
   * couplet stays legible on light / neutral-dark surfaces, not just the
   * near-black sacred backdrop. Inherited from the enclosing `DetailGrid` when
   * driven by its `fields` array; set per-field when nesting as children.
   */
  theme?: DetailFieldTheme
}

function isEmptyValue(value: ReactNode): boolean {
  return value === null || value === undefined || value === ''
}

/**
 * Read-only label/value couplet rendered as a `<dt>`/`<dd>` pair wrapped in a
 * `<div>` — valid `<dl>` content, so it slots into `<DetailGrid>` (or any
 * definition list) while also working standalone. `hideWhenEmpty` renders
 * nothing for null/undefined/empty values, `mono` switches the value to the
 * mono stack, and `valueColor` overrides the value color inline.
 */
const DetailField = forwardRef<HTMLDivElement, DetailFieldProps>(
  function DetailField(
    { label, value, mono, valueColor, hideWhenEmpty, theme = 'sacred' },
    ref
  ) {
    if (hideWhenEmpty && isEmptyValue(value)) return null
    const valueStyle: CSSProperties | undefined =
      valueColor !== undefined ? { color: valueColor } : undefined
    return (
      <div
        ref={ref}
        className={cssStyles.field}
        data-detail-field="true"
        data-component="DetailField"
        data-theme={theme}
      >
        <dt className={cssStyles.label} data-detail-label="true">
          {label}
        </dt>
        <dd
          className={mergeClassNames(
            cssStyles.value,
            mono ? cssStyles.mono : ''
          )}
          {...(valueStyle !== undefined && { style: valueStyle })}
          data-detail-value="true"
        >
          {value}
        </dd>
      </div>
    )
  }
)

DetailField.displayName = 'DetailField'

// -----------------------------------------------------------------------------
// DETAILGRID — <dl> laid out via FieldGrid; fields array OR DetailField children
// -----------------------------------------------------------------------------

export interface DetailGridFieldDescriptor {
  label: ReactNode
  value: ReactNode
  mono?: boolean
  valueColor?: string
  hideWhenEmpty?: boolean
}

export interface DetailGridProps {
  /**
   * Declarative field list. When provided, each descriptor renders as a
   * `DetailField`. Mutually exclusive in practice with `children` (a
   * descriptor list is the common case; children is the escape hatch for
   * custom value nodes that don't fit the descriptor shape).
   */
  fields?: DetailGridFieldDescriptor[]
  /** Min column width forwarded to the underlying FieldGrid. Default `'200px'`. */
  minColWidth?: string
  /** Gap forwarded to the underlying FieldGrid. */
  gap?: string
  /** Optional accessible label for the definition list group. */
  ariaLabel?: string
  className?: string
  /**
   * Visual theme (`'sacred'` default). Emitted as `data-theme` on the `<dl>`
   * and threaded into every `fields`-array `DetailField`, and it also cascades
   * to nested `DetailField` children so the whole group stays legible on light
   * / neutral-dark surfaces (WCAG 1.4.3).
   */
  theme?: DetailFieldTheme
  /** `DetailField` children, used when `fields` is not supplied. */
  children?: ReactNode
}

/**
 * Responsive definition-list grid of `DetailField` couplets: composes
 * `FieldGrid` for the column track (min column width via `minColWidth`,
 * default 200px) but renders as a `<dl>` so the block is one semantic group
 * of term/description pairs. Populate via the `fields` array or by nesting
 * `<DetailField>` children.
 */
const DetailGrid = forwardRef<HTMLDListElement, DetailGridProps>(
  function DetailGrid(
    {
      fields,
      minColWidth = '200px',
      gap,
      ariaLabel,
      className,
      theme = 'sacred',
      children,
    },
    ref
  ) {
    const body: ReactNode = fields
      ? fields.map((descriptor, index) => (
          <DetailField
            key={index}
            label={descriptor.label}
            value={descriptor.value}
            theme={theme}
            {...(descriptor.mono !== undefined && { mono: descriptor.mono })}
            {...(descriptor.valueColor !== undefined && {
              valueColor: descriptor.valueColor,
            })}
            {...(descriptor.hideWhenEmpty !== undefined && {
              hideWhenEmpty: descriptor.hideWhenEmpty,
            })}
          />
        ))
      : children

    return (
      <FieldGrid
        ref={ref as React.Ref<HTMLDivElement>}
        as="dl"
        minColWidth={minColWidth}
        {...(gap !== undefined && { gap })}
        {...(ariaLabel !== undefined && { 'aria-label': ariaLabel })}
        className={mergeClassNames(cssStyles.grid, className)}
        data-detail-grid="true"
        data-theme={theme}
      >
        {body}
      </FieldGrid>
    )
  }
)

DetailGrid.displayName = 'DetailGrid'

export { DetailField, DetailGrid }
export default DetailField
