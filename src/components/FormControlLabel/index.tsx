'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  injectSacredKeyframes,
  SACRED_GLYPHS,
  getSharedFormFieldStyles,
} from '../../theme'
import type { FormFieldStyles } from '../../theme'

export interface FormControlLabelStyles extends FormFieldStyles {
  disabled?: boolean
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom'
}

export interface FormControlLabelProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
  control: React.ReactElement
  label?: React.ReactNode
  styles?: FormControlLabelStyles
  disabled?: boolean
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom'
  value?: string | number
  name?: string
  onChange?: (event: React.SyntheticEvent, checked: boolean) => void
}

const FormControlLabel: React.FC<FormControlLabelProps> = ({
  control,
  label,
  styles,
  disabled = false,
  labelPlacement = 'end',
  value,
  name,
  onChange,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  // hydration-safe glyph
  const [glyph, setGlyph] = useState(SACRED_GLYPHS[0])

  // Inject CSS keyframes for sacred animations
  useEffect(() => {
    if (styles?.theme === 'sacred') {
      injectSacredKeyframes()
    }
  }, [styles?.theme])

  // Randomize only after hydration
  useEffect(() => {
    if (styles?.theme === 'sacred') {
      setGlyph(SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)])
    }
  }, [styles?.theme])

  const isSacredTheme = styles?.theme === 'sacred'
  const isDarkTheme = styles?.theme === 'dark'
  const finalDisabled = disabled || styles?.disabled

  const isHorizontal = labelPlacement === 'start' || labelPlacement === 'end'
  const isStart = labelPlacement === 'start' || labelPlacement === 'top'

  // Get theme configuration
  const { themeConfig } = useMemo(
    () => getSharedFormFieldStyles(styles, false),
    [styles]
  )

  // Sacred glyph styling
  const glyphStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    color: 'rgba(255, 215, 0, 0.4)',
    fontSize: '12px',
    zIndex: 10,
    opacity: isHovered ? 1 : 0,
    transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    animation: isHovered ? 'sacredGlyphRotate 20s linear infinite' : 'none',
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: finalDisabled ? 'default' : 'pointer',
    verticalAlign: 'middle',
    WebkitTapHighlightColor: 'transparent',
    marginLeft: '-11px',
    marginRight: '16px',
    flexDirection: isHorizontal
      ? isStart
        ? 'row-reverse'
        : 'row'
      : ((isStart ? 'column-reverse' : 'column') as
          | 'row'
          | 'row-reverse'
          | 'column'
          | 'column-reverse'),
    transition: 'color 0.2s ease-in-out',
    ...(finalDisabled && {
      color: isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.38)',
      opacity: 0.7,
    }),
    ...style,
  }

  const labelStyle: React.CSSProperties = {
    fontSize: styles?.fontSize || '1rem',
    lineHeight: styles?.lineHeight || '1.5',
    letterSpacing: '0.00938em',
    fontFamily: themeConfig.fontFamily,
    color: isSacredTheme
      ? '#FFD700'
      : isDarkTheme
        ? '#e2e8f0'
        : themeConfig.text,
    ...(isHorizontal
      ? {
          marginLeft: isStart ? '0' : '8px',
          marginRight: isStart ? '8px' : '0',
        }
      : {
          marginTop: isStart ? '0' : '8px',
          marginBottom: isStart ? '8px' : '0',
        }),
    ...(finalDisabled && {
      color: isSacredTheme
        ? 'rgba(255, 215, 0, 0.4)'
        : isDarkTheme
          ? 'rgba(255, 255, 255, 0.3)'
          : 'rgba(0, 0, 0, 0.38)',
    }),
  }

  // Clone control and pass disabled state and styles
  const controlProps: any = {
    name: name || (control.props as any)?.name,
    onChange: onChange || (control.props as any)?.onChange,
    value: value !== undefined ? value : (control.props as any)?.value,
  }

  // Only add styles if the control accepts them
  if (
    (control.props as any)?.styles !== undefined ||
    (control.type as any)?.propTypes?.styles
  ) {
    controlProps.styles = {
      ...(control.props as any)?.styles,
      theme: styles?.theme,
      disabled: finalDisabled,
    }
  }

  const controlElement = React.cloneElement(control, controlProps)

  return (
    <label
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {controlElement}
      {label && <span style={labelStyle}>{label}</span>}
      {isSacredTheme && <div style={glyphStyle}>{glyph}</div>}
    </label>
  )
}

export default FormControlLabel
