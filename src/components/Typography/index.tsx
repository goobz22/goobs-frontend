'use client'

import React from 'react'
import cssStyles from './Typography.module.css'

/**
 * Props for Typography. The top-level keys are the common shortcuts; the
 * `styles` object carries the full override surface, and a `styles` key
 * always WINS over its top-level twin (e.g. `styles.fontSize` over
 * `fontSize`).
 */
export interface TypographyProps {
  /** Text content. Wins over `children` when both are set (a falsy `''` falls back to `children`). */
  text?: string
  /** Content rendered when `text` is absent. */
  children?: React.ReactNode
  /**
   * Variant name, resolved by case-insensitive SUBSTRING match (default
   * `'body1'`), in this precedence order: `cinzel*` → Cinzel serif at the
   * sacred heading sizes; `merri*` → Merriweather (this branch runs before
   * the heading check so `merrih1` etc. can never be hijacked to Cinzel —
   * `merrih1`–`merrih6` render at the heading sizes / weight 700,
   * `*helper*`/`*footer*` at 0.85rem with a muted per-theme pinned color,
   * any other `merri*` as 1rem body text); plain `h1`–`h6` → Cinzel 600 at
   * the heading sizes; `body2`/`small` → 0.875rem; anything else → 1rem
   * body. Beyond that, ANY variant string containing an `'h'` is treated
   * as a heading for font-family purposes (Cinzel). Overridden by
   * `styles.variant`.
   */
  variant?: 'h5' | 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h6' | string
  /**
   * The HTML element (or React component) actually rendered. Defaults to
   * `'span'` — valid phrasing content inside `<button>`, `<a>`, and `<h1>`–`<h6>`,
   * and the SSR/hydration-safe default (see the render note at the bottom of
   * this file).
   *
   * ⚠️ ACCESSIBILITY / SEO: a heading `variant` (`'h1'`–`'h6'`, `'cinzelh1'`,
   * `'merrih2'`, …) only STYLES the text at heading sizes — it does NOT emit a
   * heading element. When this Typography IS a section heading, pass the
   * matching semantic element (`component="h2"`) so screen-reader heading
   * navigation (rotor / "next heading") and search crawlers see a real
   * `<h2>` in the document outline. Likewise pass `component="p"` for a
   * standalone paragraph, `component="label"` for a form label,
   * `component="figcaption"` for a caption, etc. Left as `'span'` by default so
   * the phrasing-content nesting contract (Typography inside buttons/links/
   * headings) and existing markup are preserved. Additive — never changes the
   * default rendered element. (WCAG 1.3.1 Info and Relationships, 2.4.6
   * Headings and Labels.)
   */
  component?: React.ElementType
  /** Text color. Unset → the per-theme CSS fallback (near-white base, gold on sacred, dark-on-light on light). The merri helper/footer variants pin their own color, which wins over this. */
  color?: string
  /** Font size; wins over the variant's default size. */
  fontSize?: string
  /** Font family for body variants (default `'"Crimson Text", serif'`). Ignored when the variant pins a family (cinzel/merri/heading variants). */
  fontFamily?: string
  /** Font weight; ALWAYS wins over the variant's default weight. */
  fontWeight?: number | string
  /** Text alignment (default `'left'`). */
  textAlign?: 'left' | 'center' | 'right'
  /** Bottom margin (default `'0'`; replaced by `0.35em` when `gutterBottom` is set, suppressed entirely by `styles.margin`). */
  marginBottom?: string
  /** Top margin (default `'0'`; suppressed by `styles.margin`). */
  marginTop?: string
  /** CSS `width` of the rendered span. */
  width?: string
  /** CSS `outline` value, passed through verbatim. String form only here — the boolean opt-in lives on `styles.outline`, which also wins when both are set. */
  outline?: string
  /** Replaces the bottom margin with `0.35em` of paragraph spacing. */
  gutterBottom?: boolean
  /**
   * Full styling override surface. Each key WINS over its top-level twin.
   * Scalar values ride into Typography.module.css as `--typography-*`
   * custom properties; margin/padding stay real inline properties so a
   * shorthand suppresses its longhands.
   */
  styles?: {
    /** Variant name; wins over the top-level `variant`. Same substring resolution — see the `variant` doc. */
    variant?: string
    /** Text color; wins over the top-level `color` (merri helper/footer variants still pin their own). */
    color?: string
    /** Font size; wins over the top-level `fontSize` and the variant default. */
    fontSize?: string
    /** Font family; wins over the top-level `fontFamily` for body variants. Ignored when the variant pins a family. */
    fontFamily?: string
    /** Font weight; wins over the top-level `fontWeight` and ALWAYS over the variant weight. */
    fontWeight?: number | string
    /** Text alignment; wins over the top-level `textAlign`. */
    textAlign?: 'left' | 'center' | 'right'
    /** Bottom margin; wins over the top-level `marginBottom`. Suppressed by `margin` and by `gutterBottom`. */
    marginBottom?: string
    /** Top margin; wins over the top-level `marginTop`. Suppressed by `margin`. */
    marginTop?: string
    /** Left margin (default `'0'`). Suppressed by `margin`. */
    marginLeft?: string
    /** Right margin (default `'0'`). Suppressed by `margin`. */
    marginRight?: string
    /** Margin shorthand. When set, the four margin longhands (and `gutterBottom`) are ignored. */
    margin?: string
    /** Padding shorthand. When set, the four padding longhands are ignored. */
    padding?: string
    /** Left padding (only when `padding` is unset). */
    paddingLeft?: string
    /** Right padding (only when `padding` is unset). */
    paddingRight?: string
    /** Top padding (only when `padding` is unset). */
    paddingTop?: string
    /** Bottom padding (only when `padding` is unset). */
    paddingBottom?: string
    /** CSS `line-height`. */
    lineHeight?: string | number
    /** CSS `letter-spacing`. */
    letterSpacing?: string
    /** CSS `text-shadow`. */
    textShadow?: string
    /** CSS `font-style` (e.g. `italic`). */
    fontStyle?: string
    /** CSS `text-transform`. */
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase'
    /** CSS `white-space`. */
    whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
    /** CSS `opacity`. */
    opacity?: number | string
    /** CSS `max-width`. */
    maxWidth?: string
    /** CSS `min-width`. */
    minWidth?: string
    /** CSS `background-color`. */
    backgroundColor?: string
    /** CSS `border-left` shorthand (e.g. a quote/callout bar). */
    borderLeft?: string
    /** CSS `flex` shorthand. */
    flex?: string | number
    /** CSS `align-self`. */
    alignSelf?: string
    /** Theme, emitted as `data-theme`: `'sacred'` flips the default color fallback to gold; `'light'`/`'dark'` remap it to their role text tokens. Unset → the near-white non-sacred default. An explicit `color` always wins over the theme fallback. */
    theme?: 'sacred' | 'dark' | 'light' | string
    /** `true` → the visible outline treatment (`1px solid currentcolor` + 3px offset, keyed to the resolved per-theme text color); a string passes through verbatim as the CSS `outline` value; `false`/unset → no outline. Wins over the top-level `outline`. */
    outline?: string | boolean
    /** CSS `width`; wins over the top-level `width`. */
    width?: string
    /** Replaces the bottom margin with `0.35em`; wins over the top-level `gutterBottom`. */
    gutterBottom?: boolean
    /** CSS `border-radius`. */
    borderRadius?: string
    /** CSS `overflow` (pair with `textOverflow` for ellipsis truncation). */
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | string
    /** CSS `text-overflow` (needs `overflow: 'hidden'` and a constrained width to clip). */
    textOverflow?: 'clip' | 'ellipsis' | string
  }
}

/**
 * Resolved variant identity: which CSS module class supplies the default
 * font-size, plus the variant's default font-weight and font-family. The
 * branch ORDER is significant: cinzel is matched first, then EVERY merri*
 * variant (so the 'h1'..'h6' substring inside 'merrih1' etc. can never
 * hijack the family to Cinzel), then standard headings, then body.
 */
interface VariantResolution {
  className: string
  fontWeight: number
  /** undefined => the variant does not pin a family (body1/body2). */
  fontFamily?: string
  /** non-sacred (dark/unset) merri helper/footer color; undefined for every other variant. */
  merriColorNonSacred?: string
  /** sacred merri helper/footer color; undefined for every other variant. */
  merriColorSacred?: string
  /** light-theme merri helper/footer color; undefined for every other variant. */
  merriColorLight?: string
}

function resolveVariant(variant: string): VariantResolution {
  const v = variant.toLowerCase()

  // Sacred Cinzel variants
  if (v.includes('cinzel')) {
    if (v.includes('h1'))
      return {
        className: cssStyles.cinzelH1 ?? '',
        fontWeight: 700,
        fontFamily: '"Cinzel", serif',
      }
    if (v.includes('h2'))
      return {
        className: cssStyles.cinzelH2 ?? '',
        fontWeight: 700,
        fontFamily: '"Cinzel", serif',
      }
    if (v.includes('h3'))
      return {
        className: cssStyles.cinzelH3 ?? '',
        fontWeight: 600,
        fontFamily: '"Cinzel", serif',
      }
    if (v.includes('h4'))
      return {
        className: cssStyles.cinzelH4 ?? '',
        fontWeight: 600,
        fontFamily: '"Cinzel", serif',
      }
    if (v.includes('h5'))
      return {
        className: cssStyles.cinzelH5 ?? '',
        fontWeight: 600,
        fontFamily: '"Cinzel", serif',
      }
    if (v.includes('h6'))
      return {
        className: cssStyles.cinzelH6 ?? '',
        fontWeight: 600,
        fontFamily: '"Cinzel", serif',
      }
    return {
      className: cssStyles.cinzelBase ?? '',
      fontWeight: 600,
      fontFamily: '"Cinzel", serif',
    }
  }

  // Merriweather variants — anything explicitly named merri* is BRAND
  // Merriweather (fonts/goobs-fonts.css ships its @font-face at 400/700).
  // This branch must run BEFORE the standard-heading checks below: 'merrih1'
  // contains the substring 'h1', so without it the heading branch would force
  // Cinzel onto a variant whose name promises Merriweather.
  if (v.includes('merri')) {
    if (v.includes('helper') || v.includes('footer')) {
      return {
        className: cssStyles.merriHelper ?? '',
        fontWeight: 400,
        fontFamily: '"Merriweather", serif',
        merriColorNonSacred: 'rgba(255, 255, 255, 0.6)',
        merriColorSacred: 'rgba(255, 215, 0, 0.7)',
        // WCAG fix: the non-sacred white-60% pin is a DARK-surface color —
        // on a light surface it composites to ~white (1.0:1, invisible).
        // The light theme gets the light role's AA-tuned muted token
        // (#4b5563 — 7.56:1 on #ffffff at the 0.85rem helper size).
        merriColorLight: 'var(--goobs-light-text-muted)',
      }
    }
    // Merri headings reuse the standard heading font-size classes; the
    // family is Merriweather and the weight is 700 (the bold face the
    // Merriweather @font-face actually ships — it has no 600).
    if (v.includes('h1'))
      return {
        className: cssStyles.h1 ?? '',
        fontWeight: 700,
        fontFamily: '"Merriweather", serif',
      }
    if (v.includes('h2'))
      return {
        className: cssStyles.h2 ?? '',
        fontWeight: 700,
        fontFamily: '"Merriweather", serif',
      }
    if (v.includes('h3'))
      return {
        className: cssStyles.h3 ?? '',
        fontWeight: 700,
        fontFamily: '"Merriweather", serif',
      }
    if (v.includes('h4'))
      return {
        className: cssStyles.h4 ?? '',
        fontWeight: 700,
        fontFamily: '"Merriweather", serif',
      }
    if (v.includes('h5'))
      return {
        className: cssStyles.h5 ?? '',
        fontWeight: 700,
        fontFamily: '"Merriweather", serif',
      }
    if (v.includes('h6'))
      return {
        className: cssStyles.h6 ?? '',
        fontWeight: 700,
        fontFamily: '"Merriweather", serif',
      }
    // merriparagraph / any other merri body text (default 1rem size from
    // .root). Without this branch 'merriparagraph' fell through to the
    // family-less default and the isHeading `.includes('h')` check matched
    // the 'h' in 'paragraph', forcing Cinzel.
    return {
      className: '',
      fontWeight: 400,
      fontFamily: '"Merriweather", serif',
    }
  }

  // Standard heading variants
  if (v.includes('h1'))
    return {
      className: cssStyles.h1 ?? '',
      fontWeight: 600,
      fontFamily: '"Cinzel", serif',
    }
  if (v.includes('h2'))
    return {
      className: cssStyles.h2 ?? '',
      fontWeight: 600,
      fontFamily: '"Cinzel", serif',
    }
  if (v.includes('h3'))
    return {
      className: cssStyles.h3 ?? '',
      fontWeight: 600,
      fontFamily: '"Cinzel", serif',
    }
  if (v.includes('h4'))
    return {
      className: cssStyles.h4 ?? '',
      fontWeight: 600,
      fontFamily: '"Cinzel", serif',
    }
  if (v.includes('h5'))
    return {
      className: cssStyles.h5 ?? '',
      fontWeight: 600,
      fontFamily: '"Cinzel", serif',
    }
  if (v.includes('h6'))
    return {
      className: cssStyles.h6 ?? '',
      fontWeight: 600,
      fontFamily: '"Cinzel", serif',
    }

  if (v.includes('body2') || v.includes('small'))
    return { className: cssStyles.body2 ?? '', fontWeight: 400 }

  // body1 and default (font-size comes from .root)
  return { className: '', fontWeight: 400 }
}

/**
 * Themeable text primitive rendering a `<span>` by default (valid as phrasing
 * content inside buttons, links, and headings) with heading, body, and sacred
 * Cinzel/Merriweather variants. Resolves font family, weight, and color per
 * variant and theme, and forwards scalar style overrides as CSS variables.
 *
 * The rendered element is polymorphic via `component`: a heading `variant`
 * only styles the text, so pass `component="h2"` (etc.) to emit a REAL
 * semantic heading for assistive-tech outline navigation and SEO — see the
 * `component` prop doc. The default stays `'span'` for phrasing-content safety.
 */
const Typography: React.FC<TypographyProps> = ({
  text,
  children,
  variant = 'body1',
  component,
  color,
  fontSize,
  fontFamily,
  fontWeight,
  textAlign = 'left',
  marginBottom,
  marginTop,
  width,
  outline,
  gutterBottom,
  styles,
}) => {
  const isSacred = styles?.theme === 'sacred'

  // Resolve caller-prop precedence (parity with the original finalX locals).
  const finalVariant = styles?.variant || variant
  const finalFontSize = styles?.fontSize || fontSize
  const finalFontFamily =
    styles?.fontFamily || fontFamily || '"Crimson Text", serif'
  const finalFontWeight = styles?.fontWeight || fontWeight
  const finalTextAlign = styles?.textAlign || textAlign
  const finalMarginBottom = styles?.marginBottom || marginBottom || '0'
  const finalMarginTop = styles?.marginTop || marginTop || '0'
  const finalMarginLeft = styles?.marginLeft || '0'
  const finalMarginRight = styles?.marginRight || '0'
  const finalMargin = styles?.margin
  const finalPadding = styles?.padding
  const finalGutterBottom = styles?.gutterBottom ?? gutterBottom ?? false

  // Handle outline. `outline: true` opts into the visible CSS-module outline
  // treatment (.outlined — 1px solid currentColor, matching the resolved
  // per-theme text color); a string passes through verbatim as the CSS
  // `outline` value; false/undefined renders no outline.
  const rawOutline = styles?.outline ?? outline
  const hasBooleanOutline = rawOutline === true
  const finalOutline = typeof rawOutline === 'string' ? rawOutline : undefined

  const isHeading = String(finalVariant).toLowerCase().includes('h')
  const resolved = resolveVariant(String(finalVariant))

  // ── color (parity: variantStyles.color || finalColor) ───────────────────
  // Only merri pins a variant color. For every other variant the resolved
  // color is finalColor; but when the caller passed nothing we leave the var
  // unset so the CSS theme fallback (white base / gold [data-theme='sacred'])
  // governs — keeping the sacred/non-sacred decision in CSS. The merri
  // helper pin is theme-aware: sacred → translucent gold, light → the light
  // muted role token (the white-60% dark-surface pin is invisible on light
  // surfaces), dark/unset → the legacy white-60%.
  const merriColor = isSacred
    ? resolved.merriColorSacred
    : styles?.theme === 'light'
      ? resolved.merriColorLight
      : resolved.merriColorNonSacred
  const explicitColor = styles?.color || color
  const resolvedColor = merriColor ?? explicitColor

  // ── font-family (parity: variantStyles.fontFamily || (isHeading ? Cinzel : finalFontFamily)) ──
  const resolvedFontFamily =
    resolved.fontFamily || (isHeading ? '"Cinzel", serif' : finalFontFamily)

  // ── font-weight (parity: finalFontWeight || variantStyles.fontWeight) ────
  const resolvedFontWeight = finalFontWeight || resolved.fontWeight

  // Build the inline style: CSS custom properties for resolved/scalar values,
  // plus the genuinely-dynamic margin/padding/gutterBottom geometry (recipe
  // rule 3). A key is included only when it has a value, so absent properties
  // resolve to `initial` in CSS exactly as the old `undefined` entries did.
  const dynamicStyle: React.CSSProperties = {}
  const setVar = (name: string, value: string | number | undefined): void => {
    if (value !== undefined && value !== '') {
      ;(dynamicStyle as Record<string, string | number>)[name] = value
    }
  }

  setVar('--typography-color', resolvedColor)
  setVar('--typography-font-family', resolvedFontFamily)
  setVar('--typography-font-weight', resolvedFontWeight)
  setVar('--typography-font-size', finalFontSize)
  setVar('--typography-text-align', finalTextAlign)
  setVar('--typography-line-height', styles?.lineHeight)
  setVar('--typography-letter-spacing', styles?.letterSpacing)
  setVar('--typography-text-shadow', styles?.textShadow)
  setVar('--typography-font-style', styles?.fontStyle)
  setVar('--typography-text-transform', styles?.textTransform)
  setVar('--typography-white-space', styles?.whiteSpace)
  setVar('--typography-opacity', styles?.opacity)
  setVar('--typography-max-width', styles?.maxWidth)
  setVar('--typography-min-width', styles?.minWidth)
  setVar('--typography-background-color', styles?.backgroundColor)
  setVar('--typography-border-left', styles?.borderLeft)
  setVar('--typography-flex', styles?.flex)
  setVar('--typography-align-self', styles?.alignSelf)
  setVar('--typography-width', styles?.width || width)
  setVar('--typography-outline', finalOutline)
  setVar('--typography-border-radius', styles?.borderRadius)
  setVar('--typography-overflow', styles?.overflow)
  setVar('--typography-text-overflow', styles?.textOverflow)

  // Margin / padding stay as real CSS properties (not vars) so the shorthand
  // suppresses the longhands exactly as before.
  if (finalMargin) {
    dynamicStyle.margin = finalMargin
  } else {
    dynamicStyle.marginTop = finalMarginTop
    dynamicStyle.marginBottom = finalGutterBottom ? '0.35em' : finalMarginBottom
    dynamicStyle.marginLeft = finalMarginLeft
    dynamicStyle.marginRight = finalMarginRight
  }
  if (finalPadding) {
    dynamicStyle.padding = finalPadding
  } else {
    if (styles?.paddingLeft !== undefined)
      dynamicStyle.paddingLeft = styles.paddingLeft
    if (styles?.paddingRight !== undefined)
      dynamicStyle.paddingRight = styles.paddingRight
    if (styles?.paddingTop !== undefined)
      dynamicStyle.paddingTop = styles.paddingTop
    if (styles?.paddingBottom !== undefined)
      dynamicStyle.paddingBottom = styles.paddingBottom
  }

  const className = [
    cssStyles.root,
    resolved.className,
    hasBooleanOutline ? cssStyles.outlined : '',
  ]
    .filter(Boolean)
    .join(' ')

  const content = text || children

  // ThothOS hydration fix (CF-185 follow-up):
  //
  // Typography previously rendered as <p>, which is "flow content"
  // (block-level) per the HTML content-model spec. That's invalid as
  // a child of <button>, <a>, <h1..h6>, and any other element whose
  // content model is "phrasing content" only. Browsers auto-correct
  // by closing the <p> BEFORE the parent element — but the React
  // server-render produces literal `<button><p>...</p></button>` in
  // the HTML stream, while the client's parser closes the <p> early.
  // The two trees diverge → React fires a hydration mismatch and the
  // dev-mode error overlay intercepts pointer events, breaking the
  // very next click in any test on the page.
  //
  // Real-world repro: ThothOS automations workspace had Typography
  // inside the Metrics Summary accordion <button>. Every test on
  // that route failed because the dev overlay covered the "+ New
  // Template" button.
  //
  // Fix: render <span> by default — phrasing content, valid as a
  // child of every element above. The CSS module applies
  // `display: block` so the visual layout (margins, line-height,
  // gutterBottom) is unchanged for callers that expected paragraph-
  // like flow. Inline-context callers (inside button / heading) get
  // correct nesting because <span> stays a <span> at the parser
  // level — no auto-correction.
  return (
    <span
      className={className}
      data-component="Typography"
      data-theme={styles?.theme}
      style={dynamicStyle}
    >
      {content}
    </span>
  )
}

export default Typography
