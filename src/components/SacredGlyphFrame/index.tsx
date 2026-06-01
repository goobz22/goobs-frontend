'use client'

/**
 * =============================================================================
 * SACRED GLYPH FRAME — animated gold-glow + decorative glyph wrapper
 * =============================================================================
 *
 * Owns the duplicated `injectKeyframes()` + glyph-decoration recipe that the
 * ThothOS statement/billing forms each re-implemented inline:
 *
 *   - `InlineShowEstimate` (index.tsx:92 `injectKeyframes`, :148 re-injects
 *     `sacredGlowPulse` + `sacredFloat`, :436 the floating-glyph row)
 *   - `InlineShowServiceInvoice` (index.tsx:138 the same re-injection)
 *   - the `Inline*` billing/ledger edit forms
 *
 * Every one of those callsites:
 *   1. declared a local `injectKeyframes(name, frames)` helper,
 *   2. re-injected `sacredGlowPulse` and `sacredFloat` from a `useEffect`
 *      on EVERY mount, and
 *   3. hand-rolled a `position:absolute` row of floating Egyptian glyphs.
 *
 * This wrapper centralises all three. The `@keyframes` are injected ONCE at
 * MODULE LOAD via the existing `commonKeyframes` helpers in
 * `src/utils/keyframes.ts` — there is no per-instance `useEffect` injection.
 * The animated border and the decorative glyph corners then merely reference
 * the resulting animation NAMES from the CSS module.
 *
 *   <SacredGlyphFrame glow glyphs>
 *     <Card styles={{ theme: 'sacred' }}>…</Card>
 *   </SacredGlyphFrame>
 *
 * Decoration is purely presentational: the glyph row and corner ornaments are
 * `aria-hidden`, and the frame forwards arbitrary content via `children`.
 *
 * COMPOSES: standalone primitive — no other goobs component is required. It is
 * designed to WRAP a sacred-themed `<Card>` (or any sacred surface), but does
 * not import Card, so there is no Card→Frame / Frame→Card dependency.
 * =============================================================================
 */

import React, {
  forwardRef,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import { emitDiag } from '../../utils/diag'
import { commonKeyframes } from '../../utils/keyframes'
import cssStyles from './SacredGlyphFrame.module.css'

// -----------------------------------------------------------------------------
// MODULE-LOAD KEYFRAME INJECTION (once — NOT per instance)
//
// The hand-rolled callsites re-injected `sacredGlowPulse` / `sacredFloat` from
// a per-mount `useEffect`. Here the existing `commonKeyframes` helpers are
// called exactly once, at module evaluation, so the `<style data-keyframe>`
// elements exist before the first frame ever renders and are never duplicated.
// `keyframes()` itself is idempotent (it checks for an existing tag) and a
// safe no-op on the server (guards `typeof document`), so this is SSR-safe.
// -----------------------------------------------------------------------------

const sacredGlowPulseAnimationName = commonKeyframes.sacredGlowPulse()
const sacredFloatAnimationName = commonKeyframes.sacredFloat()

// The default floating-glyph row — the Egyptian glyph sequence the ThothOS
// estimate / invoice decorations used (InlineShowEstimate index.tsx:436).
const DEFAULT_GLYPHS: readonly string[] = ['𓊵', '𓋹', '𓊹', '𓋹', '𓊵']

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

export interface SacredGlyphFrameProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /**
   * Render the animated gold-glow border (`sacredGlowPulse`). Default `true`.
   * Honours `prefers-reduced-motion` (freezes to a static glow via CSS).
   */
  glow?: boolean
  /**
   * Render the top-centred row of floating decorative glyphs (`sacredFloat`).
   * Default `true`. Each glyph drifts on a slightly staggered cadence.
   */
  glyphs?: boolean
  /**
   * Override the decorative glyph sequence. Defaults to the Egyptian glyph row
   * the ThothOS estimate/invoice decorations used. Decorative only — the row
   * is `aria-hidden`.
   */
  glyphSequence?: readonly string[]
  /**
   * Optional decorative corner ornaments. When supplied, rendered in all four
   * corners behind the content. `aria-hidden`. Accepts a single node (mirrored
   * into every corner) — pass a glyph / SVG / emoji.
   */
  corners?: ReactNode
  /** Framed content (typically a sacred-themed `<Card>`). */
  children: ReactNode
}

interface SacredGlyphFrameComponent {
  (
    props: SacredGlyphFrameProps & React.RefAttributes<HTMLDivElement>
  ): ReactElement | null
  displayName?: string
}

function mergeClassNames(...names: Array<string | undefined | false>): string {
  return names.filter(Boolean).join(' ')
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

const SacredGlyphFrameInner = forwardRef<HTMLDivElement, SacredGlyphFrameProps>(
  function SacredGlyphFrameInner(
    {
      glow = true,
      glyphs = true,
      glyphSequence = DEFAULT_GLYPHS,
      corners,
      className,
      children,
      ...restProps
    },
    ref
  ) {
    // Additive diagnostics: surface decoration-mode transitions on the host
    // diagnostics bus (no-op when none present). The decoration mode is a
    // controlled prop with no internal handler, so the only additive
    // transition hook is an effect watching the resolved mode. The initial
    // render is skipped so only genuine changes are reported.
    const decorationMode = `${glow ? 'glow' : 'no-glow'}:${
      glyphs ? 'glyphs' : 'no-glyphs'
    }`
    const previousDecorationMode = useRef<string | null>(null)
    useEffect(() => {
      if (previousDecorationMode.current === null) {
        previousDecorationMode.current = decorationMode
        return
      }
      if (previousDecorationMode.current !== decorationMode) {
        previousDecorationMode.current = decorationMode
        emitDiag({
          type: 'component.state',
          component: 'SacredGlyphFrame',
          state: decorationMode,
        })
      }
    }, [decorationMode])

    const rootClassName = mergeClassNames(
      cssStyles.root,
      glow ? cssStyles.glow : undefined,
      className
    )

    return (
      <div
        ref={ref}
        className={rootClassName}
        data-component="SacredGlyphFrame"
        data-sacred-glyph-frame="true"
        data-sgf-glow={glow ? 'true' : 'false'}
        data-sgf-glyphs={glyphs ? 'true' : 'false'}
        {...restProps}
      >
        {corners !== undefined && (
          <div
            className={cssStyles.corners}
            aria-hidden="true"
            data-sgf-corners="true"
          >
            <span
              className={mergeClassNames(
                cssStyles.corner,
                cssStyles.cornerTopLeft
              )}
            >
              {corners}
            </span>
            <span
              className={mergeClassNames(
                cssStyles.corner,
                cssStyles.cornerTopRight
              )}
            >
              {corners}
            </span>
            <span
              className={mergeClassNames(
                cssStyles.corner,
                cssStyles.cornerBottomLeft
              )}
            >
              {corners}
            </span>
            <span
              className={mergeClassNames(
                cssStyles.corner,
                cssStyles.cornerBottomRight
              )}
            >
              {corners}
            </span>
          </div>
        )}

        {glyphs && (
          <div
            className={cssStyles.glyphRow}
            aria-hidden="true"
            data-sgf-glyph-row="true"
          >
            {glyphSequence.map((glyph, index) => {
              // Staggered cadence mirrors the hand-rolled `3 + i * 0.5s` timing
              // (InlineShowEstimate index.tsx:442). Supplied via a CSS custom
              // property so the keyframe name itself stays static in the module.
              const floatDurationStyle: CSSProperties = {
                ['--sgf-float-duration' as string]: `${3 + index * 0.5}s`,
              }
              return (
                <span
                  key={`sgf-glyph-${index}-${glyph}`}
                  className={cssStyles.glyph}
                  style={floatDurationStyle}
                  data-sgf-glyph="true"
                >
                  {glyph}
                </span>
              )
            })}
          </div>
        )}

        <div className={cssStyles.content} data-sgf-content="true">
          {children}
        </div>
      </div>
    )
  }
)

// The animation names are injected at module load (above); reference them so
// the constants are observably used even though the CSS module owns the
// `animation` shorthand. This keeps the module-load injection from being
// tree-shaken and documents the binding between JS injection and CSS name.
SacredGlyphFrameInner.displayName = `SacredGlyphFrame(${sacredGlowPulseAnimationName}/${sacredFloatAnimationName})`

const SacredGlyphFrame =
  SacredGlyphFrameInner as unknown as SacredGlyphFrameComponent
SacredGlyphFrame.displayName = 'SacredGlyphFrame'

export default SacredGlyphFrame
