// --------------------------------------------------------------------------
// COMPLEX TEXT EDITOR — PUBLIC STYLE TYPES (self-contained)
// --------------------------------------------------------------------------
//
// This module used to re-implement `getComplexTextEditorStyles` /
// `getComplexTextEditorTheme` on top of `src/theme/shared` (TRANSITIONS /
// SHADOWS) and `src/theme/formField` (getFormFieldTheme). All of that visual
// logic now lives in `ComplexTextEditor.module.css` as the sacred-default
// base class + `[data-theme]` light/dark overrides + native pseudo-class
// states. What survives here is ONLY the public `ComplexTextEditorStyles`
// prop type the component's callers depend on — inlined so this file no
// longer imports anything from `src/theme`.
//
// `ComplexTextEditorStyles` extends the slim subset of the legacy
// `FormFieldStyles` shape this component actually reads (theme + caller
// colour/layout overrides). The fields are transcribed verbatim from
// `src/theme/formField.ts` `FormFieldStyles` so the public API is unchanged.
import React from 'react'

/**
 * Caller-supplied form-field styling. Mirrors the legacy `FormFieldStyles`
 * surface that `ComplexTextEditorStyles` extended, inlined here so the editor
 * no longer depends on `src/theme`.
 */
export interface ComplexTextEditorFormFieldStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Custom colors (all must be rgba format)
  backgroundColor?: string
  borderColor?: string
  borderFocusedColor?: string
  borderErrorColor?: string
  textColor?: string
  labelColor?: string
  labelFocusedColor?: string
  labelErrorColor?: string
  labelShrunkBackgroundColor?: string
  adornmentColor?: string
  adornmentFocusedColor?: string
  footerTextColor?: string
  footerTextErrorColor?: string
  footerTextInfoColor?: string
  fontFamily?: string

  // Required field styling
  requiredIndicatorColor?: string
  requiredIndicatorText?: string

  // Field state
  disabled?: boolean
  required?: boolean
  helperTextType?: 'error' | 'info'

  // Layout and spacing
  padding?: string
  paddingLeft?: string
  paddingRight?: string
  paddingTop?: string
  paddingBottom?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Border and shape
  borderRadius?: string
  borderWidth?: string

  // Typography
  fontSize?: string
  fontWeight?: string | number
  lineHeight?: string

  // Dimensions
  width?: string
  height?: string
  minWidth?: string
  maxWidth?: string
  minHeight?: string
  maxHeight?: string

  // Adornment positioning
  startAdornmentOffset?: string
  endAdornmentOffset?: string
  arrowTop?: string
  arrowRight?: string
  arrowBottom?: string
  arrowLeft?: string
  arrowPadding?: string

  // Label positioning
  labelOffset?: string
  labelShrunkOffset?: string

  // Footer spacing
  footerMarginTop?: string
  footerFontSize?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string
}

/**
 * Build the caller-override CSS-variable object for the editor-area element
 * (RichEditor / MarkdownEditor). Mirrors the OLD `getComplexTextEditorTheme`
 * editorArea branch: each caller `styles?.editorX` override (falling back to
 * `textColor` / `fontFamily` for color / font) is emitted as the matching
 * `--ct-editor-*` custom property so it wins over the CSS-module defaults.
 * Undefined values are omitted so the verbatim CSS defaults stay in effect.
 */
export const buildEditorAreaOverrideStyle = (
  styles?: ComplexTextEditorStyles
): React.CSSProperties | undefined => {
  if (!styles) return undefined
  const overrides: Record<string, string> = {}
  if (styles.editorBackground)
    overrides['--ct-editor-bg'] = styles.editorBackground
  if (styles.editorBorderColor)
    overrides['--ct-editor-border'] = styles.editorBorderColor
  if (styles.textColor) overrides['--ct-editor-color'] = styles.textColor
  if (styles.editorFontFamily)
    overrides['--ct-editor-font-family'] = styles.editorFontFamily
  if (styles.editorFontSize)
    overrides['--ct-editor-font-size'] = styles.editorFontSize
  if (styles.editorLineHeight)
    overrides['--ct-editor-line-height'] = styles.editorLineHeight
  if (styles.editorPadding)
    overrides['--ct-editor-padding'] = styles.editorPadding
  if (styles.editorMinHeight)
    overrides['--ct-editor-min-height'] = styles.editorMinHeight
  if (styles.editorBoxShadow)
    overrides['--ct-editor-shadow'] = styles.editorBoxShadow
  return Object.keys(overrides).length > 0
    ? (overrides as React.CSSProperties)
    : undefined
}

/**
 * Build the caller-override CSS-variable object for the toolbar wrapper
 * (`.toolbarContainer`). Mirrors the OLD `getComplexTextEditorTheme` toolbar
 * branch: `toolbarBackground` / `toolbarPadding` / `toolbarGap` map to the
 * `--ct-toolbar-*` custom properties. Undefined values are omitted.
 */
export const buildToolbarOverrideStyle = (
  styles?: ComplexTextEditorStyles
): React.CSSProperties | undefined => {
  if (!styles) return undefined
  const overrides: Record<string, string> = {}
  if (styles.toolbarBackground)
    overrides['--ct-toolbar-bg'] = styles.toolbarBackground
  if (styles.toolbarPadding)
    overrides['--ct-toolbar-padding'] = styles.toolbarPadding
  if (styles.toolbarGap) overrides['--ct-toolbar-gap'] = styles.toolbarGap
  return Object.keys(overrides).length > 0
    ? (overrides as React.CSSProperties)
    : undefined
}

/**
 * Build the caller-override CSS-variable for the container transition. Mirrors
 * the OLD `getComplexTextEditorTheme` `transition` branch: when
 * `transitionDuration` is set, emit `--ct-transition` as
 * `all <duration> <easing|default>`; otherwise leave the CSS default in place.
 */
export const buildTransitionOverride = (
  styles?: ComplexTextEditorStyles
): string | undefined => {
  if (!styles?.transitionDuration) return undefined
  const easing = styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'
  return `all ${styles.transitionDuration} ${easing}`
}

export interface ComplexTextEditorStyles extends ComplexTextEditorFormFieldStyles {
  // Editor-specific styling
  toolbarBackground?: string
  toolbarBorderColor?: string
  toolbarPadding?: string
  toolbarGap?: string

  // Toggle button styling
  toggleBackground?: string
  toggleBorderColor?: string
  toggleActiveBackground?: string
  toggleActiveColor?: string

  // Editor area styling
  editorBackground?: string
  editorBorderColor?: string
  editorFontFamily?: string
  editorFontSize?: string
  editorLineHeight?: string
  editorPadding?: string
  editorMinHeight?: string
  editorBoxShadow?: string

  // Sacred theme overrides
  sacredGlyphColor?: string
  sacredGlyphFilter?: string
  sacredGlyphAnimation?: string
  sacredBorderGlow?: string
  sacredTextGlow?: string
  sacredBackgroundImage?: string

  // Editor mode settings
  showToolbar?: boolean
  showModeToggle?: boolean
  defaultMode?: 'simple' | 'rich' | 'markdown'

  // Layout options
  accordionMode?: boolean
  accordionSummary?: React.ReactNode
  accordionDefaultExpanded?: boolean
}
