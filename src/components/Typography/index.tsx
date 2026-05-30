'use client'

import React from 'react'
import cssStyles from './Typography.module.css'

export interface TypographyProps {
  text?: string
  children?: React.ReactNode
  variant?: 'h5' | 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h6' | string
  color?: string
  fontSize?: string
  fontFamily?: string
  fontWeight?: number | string
  textAlign?: 'left' | 'center' | 'right'
  marginBottom?: string
  marginTop?: string
  width?: string
  outline?: string
  gutterBottom?: boolean
  styles?: {
    variant?: string
    color?: string
    fontSize?: string
    fontFamily?: string
    fontWeight?: number | string
    textAlign?: 'left' | 'center' | 'right'
    marginBottom?: string
    marginTop?: string
    marginLeft?: string
    marginRight?: string
    margin?: string
    padding?: string
    paddingLeft?: string
    paddingRight?: string
    paddingTop?: string
    paddingBottom?: string
    lineHeight?: string | number
    letterSpacing?: string
    textShadow?: string
    fontStyle?: string
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase'
    whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
    opacity?: number | string
    maxWidth?: string
    minWidth?: string
    backgroundColor?: string
    borderLeft?: string
    flex?: string | number
    alignSelf?: string
    theme?: 'sacred' | 'dark' | 'light' | string
    outline?: string | boolean
    width?: string
    gutterBottom?: boolean
    borderRadius?: string
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | string
    textOverflow?: 'clip' | 'ellipsis' | string
  }
}

/**
 * Resolved variant identity: which CSS module class supplies the default
 * font-size, plus the variant's default font-weight and font-family. This
 * mirrors getVariantStyles() one-for-one — the branch ORDER is significant
 * (cinzel is matched before standard headings, merri-helper before the rest).
 */
interface VariantResolution {
  className: string
  fontWeight: number
  /** undefined => the variant does not pin a family (body1/body2). */
  fontFamily?: string
  /** non-sacred merri helper/footer color; undefined for every other variant. */
  merriColorNonSacred?: string
  /** sacred merri helper/footer color; undefined for every other variant. */
  merriColorSacred?: string
}

function resolveVariant(variant: string): VariantResolution {
  const v = variant.toLowerCase()

  // Sacred Cinzel variants
  if (v.includes('cinzel')) {
    if (v.includes('h1'))
      return { className: cssStyles.cinzelH1 ?? '', fontWeight: 700, fontFamily: '"Cinzel", serif' }
    if (v.includes('h2'))
      return { className: cssStyles.cinzelH2 ?? '', fontWeight: 700, fontFamily: '"Cinzel", serif' }
    if (v.includes('h3'))
      return { className: cssStyles.cinzelH3 ?? '', fontWeight: 600, fontFamily: '"Cinzel", serif' }
    if (v.includes('h4'))
      return { className: cssStyles.cinzelH4 ?? '', fontWeight: 600, fontFamily: '"Cinzel", serif' }
    if (v.includes('h5'))
      return { className: cssStyles.cinzelH5 ?? '', fontWeight: 600, fontFamily: '"Cinzel", serif' }
    if (v.includes('h6'))
      return { className: cssStyles.cinzelH6 ?? '', fontWeight: 600, fontFamily: '"Cinzel", serif' }
    return { className: cssStyles.cinzelBase ?? '', fontWeight: 600, fontFamily: '"Cinzel", serif' }
  }

  // Merriweather helper/footer text
  if (v.includes('merri') && (v.includes('helper') || v.includes('footer'))) {
    return {
      className: cssStyles.merriHelper ?? '',
      fontWeight: 400,
      fontFamily: '"Merriweather", serif',
      merriColorNonSacred: 'rgba(255, 255, 255, 0.6)',
      merriColorSacred: 'rgba(255, 215, 0, 0.7)',
    }
  }

  // Standard heading variants
  if (v.includes('h1'))
    return { className: cssStyles.h1 ?? '', fontWeight: 600, fontFamily: '"Cinzel", serif' }
  if (v.includes('h2'))
    return { className: cssStyles.h2 ?? '', fontWeight: 600, fontFamily: '"Cinzel", serif' }
  if (v.includes('h3'))
    return { className: cssStyles.h3 ?? '', fontWeight: 600, fontFamily: '"Cinzel", serif' }
  if (v.includes('h4'))
    return { className: cssStyles.h4 ?? '', fontWeight: 600, fontFamily: '"Cinzel", serif' }
  if (v.includes('h5'))
    return { className: cssStyles.h5 ?? '', fontWeight: 600, fontFamily: '"Cinzel", serif' }
  if (v.includes('h6'))
    return { className: cssStyles.h6 ?? '', fontWeight: 600, fontFamily: '"Cinzel", serif' }

  if (v.includes('body2') || v.includes('small'))
    return { className: cssStyles.body2 ?? '', fontWeight: 400 }

  // body1 and default (font-size comes from .root)
  return { className: '', fontWeight: 400 }
}

const Typography: React.FC<TypographyProps> = ({
  text,
  children,
  variant = 'body1',
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

  // Handle outline — convert boolean to string if needed.
  const rawOutline = styles?.outline ?? outline
  const finalOutline =
    rawOutline === true ? 'none' : rawOutline === false ? undefined : rawOutline

  const isHeading = String(finalVariant).toLowerCase().includes('h')
  const resolved = resolveVariant(String(finalVariant))

  // ── color (parity: variantStyles.color || finalColor) ───────────────────
  // Only merri pins a variant color. For every other variant the resolved
  // color is finalColor; but when the caller passed nothing we leave the var
  // unset so the CSS theme fallback (white base / gold [data-theme='sacred'])
  // governs — keeping the sacred/non-sacred decision in CSS.
  const merriColor = isSacred
    ? resolved.merriColorSacred
    : resolved.merriColorNonSacred
  const explicitColor = styles?.color || color
  const resolvedColor = merriColor ?? explicitColor

  // ── font-family (parity: variantStyles.fontFamily || (isHeading ? Cinzel : finalFontFamily)) ──
  const resolvedFontFamily =
    resolved.fontFamily ||
    (isHeading ? '"Cinzel", serif' : finalFontFamily)

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
    if (styles?.paddingLeft !== undefined) dynamicStyle.paddingLeft = styles.paddingLeft
    if (styles?.paddingRight !== undefined) dynamicStyle.paddingRight = styles.paddingRight
    if (styles?.paddingTop !== undefined) dynamicStyle.paddingTop = styles.paddingTop
    if (styles?.paddingBottom !== undefined) dynamicStyle.paddingBottom = styles.paddingBottom
  }

  const className = resolved.className
    ? `${cssStyles.root} ${resolved.className}`
    : cssStyles.root

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
