'use client'

import React, { useState, useCallback } from 'react'
import { getSharedFormFieldStyles, FormFieldStyles } from '../../../theme'

export interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  styles?: FormFieldStyles
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  styles,
}) => {
  const [focused, setFocused] = useState(false)
  const { themeConfig } = getSharedFormFieldStyles(styles, focused)

  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setFocused(false)
  }, [])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.target.value))
    },
    [onChange]
  )

  const componentStyles = {
    container: {
      width: '100%',
    },
    label: {
      color: themeConfig.text,
      fontFamily: themeConfig.fontFamily,
      marginBottom: '8px',
      display: 'block',
    },
    input: {
      width: '100%',
    },
  }

  return (
    <div style={componentStyles.container}>
      {label && <label style={componentStyles.label}>{label}</label>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={componentStyles.input}
      />
    </div>
  )
}

export default Slider
