/**
 * @fileoverview Defines the ProgressBar component for displaying progress or loading states.
 * It supports both determinate (with specific progress value) and indeterminate (loading) modes,
 * with light, dark, and sacred themes.
 */
'use client'

import React, { useMemo, useCallback, useEffect } from 'react'
import { getProgressBarStyles } from '../../theme'
import type { ProgressBarStyles } from '../../theme'
import { injectKeyframes } from '../../theme/shared'

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
  /** Whether the progress bar represents a required process */
  'aria-required'?: boolean
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: ProgressBarStyles
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

  // Inject keyframes for animations
  useEffect(() => {
    injectKeyframes()
  }, [])

  const computedStyles = useMemo(
    () => getProgressBarStyles(styles, progressValue, variant),
    [styles, progressValue, variant]
  )

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
    <div>
      <div
        style={computedStyles.container}
        role="progressbar"
        aria-label={ariaLabel || 'Progress'}
        aria-valuemin={isIndeterminate ? undefined : 0}
        aria-valuemax={isIndeterminate ? undefined : 100}
        aria-valuenow={getAriaValueNow()}
        aria-valuetext={getAriaValueText()}
        data-testid="progress-bar"
      >
        <div style={computedStyles.bar} data-testid="progress-bar-fill" />
      </div>
      {showLabel && (
        <div style={computedStyles.label} data-testid="progress-bar-label">
          {getLabel()}
        </div>
      )}
    </div>
  )
}

ProgressBar.displayName = 'ProgressBar'

export default ProgressBar
