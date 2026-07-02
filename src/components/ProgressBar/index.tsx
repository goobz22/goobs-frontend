/**
 * @fileoverview Defines the ProgressBar component for displaying progress or loading states.
 * It supports both determinate (with specific progress value) and indeterminate (loading) modes,
 * with light, dark, and sacred themes.
 *
 * Migrated off the JS theme system (theme/progressbar.ts + theme/shared.ts) onto a CSS module.
 * Theme is a [data-theme] attribute (default 'light', matching the old getProgressBarTheme
 * fallback). The determinate fill width is a runtime --progress custom property. The
 * @keyframes that used to be injected at runtime via injectKeyframes() now live statically
 * in ProgressBar.module.css. Caller-supplied style overrides (custom colors, sizing, margins,
 * transition timing, etc.) are layered as a small inline dynamicStyle object on top of the
 * CSS classes, so defaults render purely from CSS and only explicit overrides reach inline.
 */
'use client'

import React, { useMemo, useCallback, type CSSProperties } from 'react'
import cssStyles from './ProgressBar.module.css'

// --------------------------------------------------------------------------
// PUBLIC STYLES TYPE
// --------------------------------------------------------------------------

/**
 * Comprehensive styling options for the ProgressBar. Shape preserved verbatim
 * from the pre-migration theme module so existing callers keep compiling.
 */
export interface ProgressBarStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  backdropFilter?: string
  backgroundImage?: string

  // Bar styling
  barBackground?: string
  barBorderRadius?: string
  barBoxShadow?: string
  barBackgroundImage?: string
  barFilter?: string

  // Indeterminate bar styling
  indeterminateBarBackground?: string
  indeterminateBarBorderRadius?: string
  indeterminateBarBoxShadow?: string
  indeterminateBarBackgroundImage?: string
  indeterminateBarFilter?: string
  indeterminateBarAnimation?: string

  // Label styling
  labelColor?: string
  labelFontSize?: string
  labelFontFamily?: string
  labelFontWeight?: string | number
  labelTextShadow?: string

  // Layout and spacing
  width?: string
  height?: string
  padding?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  disabled?: boolean
  striped?: boolean
  animated?: boolean
  pulse?: boolean

  // Dimensions
  maxWidth?: string
  minWidth?: string
  maxHeight?: string
  minHeight?: string
}

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface ProgressBarProps {
  /** Progress value from 0-100 for determinate mode */
  value?: number
  /** Variant of the progress bar */
  variant?: 'determinate' | 'indeterminate'
  /** Show progress label/percentage */
  showLabel?: boolean
  /** Custom label text (overrides default percentage) */
  label?: string
  /** ARIA label for accessibility */
  'aria-label'?: string
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: ProgressBarStyles
}

// --------------------------------------------------------------------------
// STRIPE GRADIENTS (transcribed from theme/progressbar.ts `stripes` config)
// Used ONLY to reproduce the old layered backgroundImage when a caller supplies
// a custom bar/indeterminate background AND `striped` — the one case where the
// inline override would otherwise clobber the CSS stripe layer. The default
// (theme) striped rendering lives entirely in ProgressBar.module.css.
// --------------------------------------------------------------------------

const STRIPE_GRADIENT: Record<'light' | 'dark' | 'sacred', string> = {
  light:
    'linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)',
  dark: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%, transparent)',
  sacred:
    'linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent)',
}

const STRIPE_SIZE: Record<'light' | 'dark' | 'sacred', string> = {
  light: '20px 20px',
  dark: '20px 20px',
  sacred: '16px 16px',
}

// --------------------------------------------------------------------------
// MAIN PROGRESS BAR COMPONENT
// --------------------------------------------------------------------------

/**
 * A versatile progress bar component that supports both determinate and indeterminate modes.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  variant = 'determinate',
  showLabel = false,
  label,
  'aria-label': ariaLabel,
  styles,
}) => {
  const isIndeterminate = variant === 'indeterminate'
  const progressValue = Math.min(Math.max(value, 0), 100)
  // Old getProgressBarTheme() defaulted to 'light' when no theme was supplied.
  const theme = styles?.theme || 'light'

  // Caller-supplied overrides ONLY — theme defaults live in the CSS module.
  // Each entry mirrors a field the old getProgressBarStyles() let callers set;
  // unset fields are omitted so the CSS class value wins.
  const containerStyle = useMemo<CSSProperties>(() => {
    const next: CSSProperties = {
      // Runtime progress width (read by .bar { width: var(--progress) }).
      ['--progress' as string]: `${progressValue}%`,
    }
    if (styles?.width !== undefined) next.width = styles.width
    if (styles?.height !== undefined) next.height = styles.height
    if (styles?.maxWidth !== undefined) next.maxWidth = styles.maxWidth
    if (styles?.minWidth !== undefined) next.minWidth = styles.minWidth
    if (styles?.maxHeight !== undefined) next.maxHeight = styles.maxHeight
    if (styles?.minHeight !== undefined) next.minHeight = styles.minHeight
    if (styles?.padding !== undefined) next.padding = styles.padding
    if (styles?.margin !== undefined) next.margin = styles.margin
    if (styles?.marginTop !== undefined) next.marginTop = styles.marginTop
    if (styles?.marginBottom !== undefined)
      next.marginBottom = styles.marginBottom
    if (styles?.marginLeft !== undefined) next.marginLeft = styles.marginLeft
    if (styles?.marginRight !== undefined) next.marginRight = styles.marginRight
    if (styles?.backgroundColor !== undefined)
      next.background = styles.backgroundColor
    if (styles?.borderColor !== undefined)
      next.border = `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
    if (styles?.borderRadius !== undefined)
      next.borderRadius = styles.borderRadius
    if (styles?.boxShadow !== undefined) next.boxShadow = styles.boxShadow
    if (styles?.backdropFilter !== undefined)
      next.backdropFilter = styles.backdropFilter
    if (styles?.backgroundImage !== undefined)
      next.backgroundImage = styles.backgroundImage
    return next
  }, [progressValue, styles])

  const barStyle = useMemo<CSSProperties>(() => {
    const next: CSSProperties = {}
    if (isIndeterminate) {
      if (styles?.indeterminateBarBackground !== undefined)
        next.background = styles.indeterminateBarBackground
      if (styles?.indeterminateBarBorderRadius !== undefined)
        next.borderRadius = styles.indeterminateBarBorderRadius
      if (styles?.indeterminateBarBoxShadow !== undefined)
        next.boxShadow = styles.indeterminateBarBoxShadow
      if (styles?.indeterminateBarBackgroundImage !== undefined)
        next.backgroundImage = styles.indeterminateBarBackgroundImage
      if (styles?.indeterminateBarFilter !== undefined)
        next.filter = styles.indeterminateBarFilter
      if (styles?.indeterminateBarAnimation !== undefined)
        next.animation = styles.indeterminateBarAnimation
      // Old behavior: striped + a custom indeterminate background layered the
      // stripe gradient over that background. Reproduce it in JS so the inline
      // override doesn't clobber the CSS stripe layer.
      if (styles?.striped && styles?.indeterminateBarBackground !== undefined) {
        next.backgroundImage = `${STRIPE_GRADIENT[theme]}, ${styles.indeterminateBarBackground}`
        next.backgroundSize = STRIPE_SIZE[theme]
      }
    } else {
      if (styles?.barBackground !== undefined)
        next.background = styles.barBackground
      if (styles?.barBorderRadius !== undefined)
        next.borderRadius = styles.barBorderRadius
      if (styles?.barBoxShadow !== undefined)
        next.boxShadow = styles.barBoxShadow
      if (styles?.barBackgroundImage !== undefined)
        next.backgroundImage = styles.barBackgroundImage
      if (styles?.barFilter !== undefined) next.filter = styles.barFilter
      if (styles?.transitionDuration !== undefined)
        next.transition = `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      // Old behavior: striped + a custom bar background layered the stripe
      // gradient over that background. Reproduce it in JS for the same reason.
      if (styles?.striped && styles?.barBackground !== undefined) {
        next.backgroundImage = `${STRIPE_GRADIENT[theme]}, ${styles.barBackground}`
        next.backgroundSize = STRIPE_SIZE[theme]
      }
    }
    return next
  }, [theme, isIndeterminate, styles])

  const labelStyle = useMemo<CSSProperties>(() => {
    const next: CSSProperties = {}
    if (styles?.labelColor !== undefined) next.color = styles.labelColor
    if (styles?.labelFontSize !== undefined)
      next.fontSize = styles.labelFontSize
    if (styles?.labelFontFamily !== undefined)
      next.fontFamily = styles.labelFontFamily
    if (styles?.labelFontWeight !== undefined)
      next.fontWeight = styles.labelFontWeight
    if (styles?.labelTextShadow !== undefined)
      next.textShadow = styles.labelTextShadow
    return next
  }, [styles])

  const getLabel = useCallback(() => {
    if (label) return label
    if (isIndeterminate) return 'Loading...'
    return `${Math.round(progressValue)}%`
  }, [label, isIndeterminate, progressValue])

  const getAriaValueNow = useCallback(() => {
    return isIndeterminate ? undefined : progressValue
  }, [isIndeterminate, progressValue])

  const getAriaValueText = useCallback(() => {
    if (label) return label
    if (isIndeterminate) return 'Loading'
    return `${Math.round(progressValue)} percent`
  }, [label, isIndeterminate, progressValue])

  return (
    <div data-component="ProgressBar">
      <div
        className={cssStyles.container}
        data-theme={theme}
        {...(styles?.disabled && { 'data-disabled': 'true' })}
        style={containerStyle}
        role="progressbar"
        aria-label={ariaLabel || 'Progress'}
        aria-valuemin={isIndeterminate ? undefined : 0}
        aria-valuemax={isIndeterminate ? undefined : 100}
        aria-valuenow={getAriaValueNow()}
        aria-valuetext={getAriaValueText()}
        data-testid="progress-bar"
      >
        <div
          className={cssStyles.bar}
          data-theme={theme}
          data-variant={variant}
          {...(styles?.striped && { 'data-striped': 'true' })}
          {...(styles?.animated && { 'data-animated': 'true' })}
          {...(styles?.pulse && { 'data-pulse': 'true' })}
          style={barStyle}
          data-testid="progress-bar-fill"
        />
      </div>
      {showLabel && (
        <div
          className={cssStyles.label}
          data-theme={theme}
          style={labelStyle}
          data-testid="progress-bar-label"
        >
          {getLabel()}
        </div>
      )}
    </div>
  )
}

ProgressBar.displayName = 'ProgressBar'

export default ProgressBar
