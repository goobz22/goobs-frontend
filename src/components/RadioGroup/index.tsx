'use client'

import React, { useState } from 'react'
import {
  getRadioGroupStyles,
  type RadioGroupStyles,
} from '../../theme/radiogroup'

/**
 * Interface representing a single radio option
 */
export interface RadioOption {
  label: string
  color?: string
}

/**
 * Interface for the props of the RadioGroup component
 */
export interface RadioGroupProps {
  /** The group label */
  label?: string
  /** Array of radio options */
  options: RadioOption[]
  /** Default selected value */
  defaultValue?: string
  /** Name for the radio group */
  name: string
  /** Label text to display */
  labelText?: string
  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Custom styles to apply using the theme system */
  styles?: RadioGroupStyles
}

/**
 * RadioGroup component renders a group of radio buttons with customizable options.
 * It allows selecting a single value from a list of options.
 * @param props The props for the RadioGroup component.
 * @returns The rendered RadioGroup component.
 */
const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  defaultValue,
  name,
  labelText,
  onChange,
  styles,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue)
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)

  const computedStyles = getRadioGroupStyles(styles, hoveredLabel)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value)
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div style={computedStyles.formControl}>
      {styles?.theme === 'sacred' && <div style={computedStyles.glyph}>𓋴</div>}
      <label id={`${name}-label`} style={computedStyles.formLabel}>
        {labelText || label}
      </label>
      <div role="radiogroup" aria-labelledby={`${name}-label`}>
        {options.map((option, index) => {
          const isChecked = selectedValue === option.label
          const optionStyles = computedStyles.getOptionStyles(
            option.label,
            isChecked
          )

          return (
            <label
              key={index}
              style={optionStyles.label}
              onMouseEnter={() => setHoveredLabel(option.label)}
              onMouseLeave={() => setHoveredLabel(null)}
            >
              <input
                type="radio"
                name={name}
                value={option.label}
                checked={isChecked}
                style={computedStyles.input}
                onChange={handleChange}
              />
              <span style={computedStyles.radioSpan}>
                <span style={optionStyles.radioOuter} />
                <span style={optionStyles.radioInner} />
              </span>
              <span
                style={{
                  ...optionStyles.text,
                  color: option.color || optionStyles.text.color,
                }}
              >
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default RadioGroup
