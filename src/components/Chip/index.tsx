'use client'

/**
 * =============================================================================
 * CHIP
 * =============================================================================
 *
 * Compact label / token element with two variants:
 *
 *   - `variant="chip"` (default) — interactive filter token. 32px tall,
 *     6px border radius, matches the redesigned Button family.
 *   - `variant="pill"` — read-only status indicator. 22-24px tall,
 *     fully rounded (999px), bolder font. Replaces the hand-rolled
 *     status pills that used to live in several workspaces
 *     (`StatusPill` in employees/contracts, `StatusBadge` in
 *     accounting/billing, `Pill` in scheduling).
 *
 * `label` accepts ReactNode so callers can include inline glyphs / dots
 * directly. `dot` is a shortcut for the common pattern of a leading
 * colored dot — pass `true` to use the chip's current color, or a color
 * string to override.
 *
 * Migrated from the legacy `theme/chip.ts` system to a `Chip.module.css`
 * file on 2026-05-22.
 *
 * TEST CONTRACT
 *   - `data-chip="true"` on the root
 *   - `data-chip-field="<name>"` / `data-chip-value="<value>"` when set
 *   - `data-chip-active="true"|"false"` when `active` prop is provided
 *   - `data-chip-variant="chip"|"pill"`
 * =============================================================================
 */

import React, { type ReactNode } from 'react'
import CloseIcon from '../Icons/Close'
import cssStyles from './Chip.module.css'

export type ChipVariant = 'chip' | 'pill'

/**
 * Semantic palette tokens. When a chip needs a status color but the
 * caller doesn't want to hand-tune `backgroundColor` + `borderColor` +
 * `color` + `dot` + alpha values, pass `tone="success"` (etc.) and the
 * CSS module derives the full color triplet at one canonical opacity.
 *
 * Token meanings:
 *   - `success`  — green (active / completed / paid / OK)
 *   - `info`     — blue  (informational / in-progress)
 *   - `warn`     — amber (pending / overdue-soon / draft)
 *   - `danger`   — red   (failed / overdue / archived-destructive)
 *   - `neutral`  — grey  (inactive / disabled)
 *   - `gold`     — sacred-gold (default / featured / starred)
 */
export type ChipTone = 'success' | 'info' | 'warn' | 'danger' | 'neutral' | 'gold'

export interface ChipStyles {
  /** Theme palette. Defaults to `'sacred'` (matches goobs-frontend overall). */
  theme?: 'light' | 'dark' | 'sacred'
  /** Disable the chip — drops opacity and blocks the click handler. */
  disabled?: boolean
  /** Override the chip's background color (defaults via theme variables). */
  backgroundColor?: string
  /** Override the chip's border color. */
  borderColor?: string
  /** Override the chip's border width (e.g. '1px', '2px'). */
  borderWidth?: string
  /** Override the chip's text color (also the dot color when `dot: true`). */
  color?: string
  /** Override the chip's hover background. */
  hoverBackgroundColor?: string
  /** Override the chip's hover border. */
  hoverBorderColor?: string
  /** Optional explicit border radius (otherwise variant default). */
  borderRadius?: string
  /** Optional inline padding override. */
  padding?: string
  /** Optional font size override. */
  fontSize?: string
  /** Optional font weight override. */
  fontWeight?: string | number
  /** Optional font family override. */
  fontFamily?: string
  /** Optional width / min-width / max-width / height override. */
  width?: string
  minWidth?: string
  maxWidth?: string
  height?: string
  /** When the chip should wrap long content (e.g. selected items in
   *  `MultiSelect` that exceed the cell width). Defaults to `nowrap`. */
  whiteSpace?: React.CSSProperties['whiteSpace']
  wordBreak?: React.CSSProperties['wordBreak']
}

export interface ChipProps {
  /**
   * Visible content. `string` for simple labels; `ReactNode` to embed
   * inline glyphs / icons next to text (status dots, count badges, etc).
   *
   * When `label` is a ReactNode (not a plain string), screen readers
   * can't announce the visual content as text — pass `ariaLabel` so
   * the chip stays announceable. Tests should also prefer the
   * `data-chip-field` / `data-chip-value` selectors over label-text
   * matching when ReactNode labels are in play.
   */
  label: ReactNode
  /**
   * Accessible name used by screen readers AND by Playwright's
   * `getByRole('button', { name: ... })`. Defaults to the string form
   * of `label` when omitted and `label` is a string; required for
   * non-string labels (chip with a status dot, icon-only chip, etc.).
   */
  ariaLabel?: string
  /** Leading icon — rendered before the label, sized to the variant. */
  icon?: ReactNode
  /**
   * Convenience prop for the leading colored dot pattern (the use-case
   * the now-deleted `StatusPill` / `StatusBadge` covered). Pass `true`
   * to use the chip's current text color, or a CSS color string for an
   * explicit accent. Mutually exclusive with `icon`.
   */
  dot?: boolean | string
  /** When set, renders an `×` delete button at the end of the chip. */
  onDelete?: () => void
  /** Click handler. When omitted, the chip renders as non-interactive
   *  (no role, no tabindex, no hover lift). */
  onClick?: () => void
  /**
   * Active / selected visual state. Forwarded as `data-chip-active` for
   * tests and drives the active-state background via CSS. Also sets
   * `aria-pressed` when the chip is interactive.
   */
  active?: boolean
  /** Visual variant — see file header. Defaults to `'chip'`. */
  variant?: ChipVariant
  /**
   * Semantic palette token — when set, the chip's background, border,
   * and text colors are derived at canonical opacities from the named
   * tone. Lets callsites stop hand-tuning `alpha(color, 0.15)` + border
   * + text triplets for every status pill. Overridden by explicit
   * `styles.backgroundColor` / `styles.color` / `styles.borderColor`
   * if both are supplied.
   */
  tone?: ChipTone
  /**
   * Stable test selector — filter dimension this chip belongs to.
   * Surfaced as `data-chip-field="<value>"` on the root.
   */
  dataField?: string
  /**
   * Stable test selector — filter value this chip represents. Survives
   * label-text changes. Surfaced as `data-chip-value="<value>"` on
   * the root.
   */
  dataValue?: string
  /**
   * ARIA role override. Defaults are:
   *   - clickable chip   → `'button'`
   *   - pill (read-only) → `'status'` (status indicator)
   *   - chip  (read-only) → no role (decorative)
   * Pass an explicit role when the semantic differs (e.g. a checkbox
   * chip would use `'checkbox'`).
   */
  role?: string
  /** Live-region politeness for status pills that update dynamically
   *  (e.g. "saving…" → "saved"). Only applied when the chip resolves to
   *  `role="status"`. */
  ariaLive?: 'off' | 'polite' | 'assertive'
  /** Style overrides (theme, colors, sizing). */
  styles?: ChipStyles
  /**
   * Alias for {@link styles}. Accepted so callers can spell the prop either
   * way — `<Chip style={...} />` and `<Chip styles={...} />` resolve to the
   * same `ChipStyles` shape. When both are supplied, `styles` wins on a
   * per-key basis (the React-style `style` is treated as the base layer).
   */
  style?: ChipStyles
}

function buildCssVarOverrides(styles?: ChipStyles): React.CSSProperties {
  if (!styles) return {}
  const out: Record<string, string> = {}
  if (styles.backgroundColor) out['--chip-bg'] = styles.backgroundColor
  if (styles.borderColor) out['--chip-border'] = styles.borderColor
  if (styles.borderWidth) out['borderWidth'] = styles.borderWidth
  if (styles.color) out['--chip-text'] = styles.color
  if (styles.hoverBackgroundColor) {
    out['--chip-hover-bg'] = styles.hoverBackgroundColor
  }
  if (styles.hoverBorderColor) {
    out['--chip-hover-border'] = styles.hoverBorderColor
  }
  if (styles.borderRadius) out['borderRadius'] = styles.borderRadius
  if (styles.padding) out['padding'] = styles.padding
  if (styles.fontSize) out['fontSize'] = styles.fontSize
  if (styles.fontWeight !== undefined) {
    out['fontWeight'] = String(styles.fontWeight)
  }
  if (styles.fontFamily) out['fontFamily'] = styles.fontFamily
  if (styles.width) out['width'] = styles.width
  if (styles.minWidth) out['minWidth'] = styles.minWidth
  if (styles.maxWidth) out['maxWidth'] = styles.maxWidth
  if (styles.height) out['height'] = styles.height
  if (styles.whiteSpace) out['whiteSpace'] = styles.whiteSpace
  if (styles.wordBreak) out['wordBreak'] = styles.wordBreak
  return out as React.CSSProperties
}

/**
 * Resolve the chip's effective ARIA role:
 *   - explicit `role` prop wins
 *   - clickable        → button
 *   - pill, read-only  → status (announces value changes for screen readers)
 *   - chip,  read-only → no role (decorative)
 */
function resolveRole(
  explicitRole: string | undefined,
  isClickable: boolean,
  variant: ChipVariant
): string | undefined {
  if (explicitRole) return explicitRole
  if (isClickable) return 'button'
  if (variant === 'pill') return 'status'
  return undefined
}

/**
 * Derive an accessible name. When the caller passed `ariaLabel`,
 * that's authoritative. Otherwise the string form of `label` is fine.
 * For ReactNode labels, returns undefined — the caller should provide
 * `ariaLabel` themselves (TS doesn't enforce this; tests that rely on
 * `getByRole(..., { name })` will surface the omission).
 */
function resolveAriaLabel(
  ariaLabel: string | undefined,
  label: ReactNode
): string | undefined {
  if (ariaLabel) return ariaLabel
  if (typeof label === 'string') return label
  if (typeof label === 'number') return String(label)
  return undefined
}

const Chip: React.FC<ChipProps> = ({
  label,
  ariaLabel,
  icon,
  dot,
  onDelete,
  onClick,
  active,
  variant = 'chip',
  tone,
  dataField,
  dataValue,
  role,
  ariaLive,
  styles,
  style,
}) => {
  // `style` is an alias for `styles`. When both are passed, `styles` wins
  // on a per-key basis — treat React's `style` spelling as the base layer
  // so callers can override individual fields by passing `styles`.
  const resolvedStyles: ChipStyles | undefined =
    style || styles ? { ...style, ...styles } : undefined
  const isDisabled = Boolean(resolvedStyles?.disabled)
  const isClickable = Boolean(onClick) && !isDisabled
  const theme = resolvedStyles?.theme ?? 'sacred'

  const rootClassName = [cssStyles.root, cssStyles[variant]]
    .filter(Boolean)
    .join(' ')

  const cssVarStyle = buildCssVarOverrides(resolvedStyles)

  const handleClick = () => {
    if (isClickable) onClick!()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isClickable) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick!()
    }
  }

  const dotColor = typeof dot === 'string' ? dot : undefined
  const resolvedRole = resolveRole(role, isClickable, variant)
  const resolvedAriaLabel = resolveAriaLabel(ariaLabel, label)
  // Accessible-name-for-the-delete-button incorporates the chip label
  // so screen readers say "Remove Status" instead of just "Remove".
  const deleteButtonLabel = resolvedAriaLabel
    ? `Remove ${resolvedAriaLabel}`
    : 'Remove'

  return (
    <div
      className={rootClassName}
      style={cssVarStyle}
      data-component="Chip"
      data-theme={theme}
      data-chip="true"
      data-chip-variant={variant}
      {...(tone !== undefined && { 'data-chip-tone': tone })}
      {...(dataField !== undefined && { 'data-chip-field': dataField })}
      {...(dataValue !== undefined && { 'data-chip-value': dataValue })}
      {...(active !== undefined && {
        'data-chip-active': active ? 'true' : 'false',
      })}
      {...(isClickable && { 'data-chip-clickable': 'true' })}
      {...(isDisabled && { 'data-chip-disabled': 'true' })}
      {...(resolvedRole !== undefined && { role: resolvedRole })}
      {...(resolvedAriaLabel !== undefined && {
        'aria-label': resolvedAriaLabel,
      })}
      {...(resolvedRole === 'status' &&
        ariaLive !== undefined && { 'aria-live': ariaLive })}
      tabIndex={isClickable ? 0 : undefined}
      aria-pressed={
        isClickable && active !== undefined ? active : undefined
      }
      aria-disabled={isDisabled || undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
    >
      <span className={cssStyles.label}>
        {dot && (
          <span
            className={cssStyles.dot}
            aria-hidden="true"
            {...(dotColor !== undefined && {
              style: { backgroundColor: dotColor },
            })}
          />
        )}
        {icon && !dot && (
          <span className={cssStyles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        {label}
      </span>

      {onDelete && (
        <button
          type="button"
          className={cssStyles.closeButton}
          onClick={(event) => {
            event.stopPropagation()
            if (!isDisabled) onDelete()
          }}
          disabled={isDisabled}
          aria-label={deleteButtonLabel}
          data-chip-delete="true"
        >
          <CloseIcon styles={{ theme, size: 14 }} />
        </button>
      )}
    </div>
  )
}

export default Chip
