import React, { useState } from 'react'

/**
 * Interface representing a single radio option
 */
export interface RadioOption {
  label: string
  fontColor?: string
}

/**
 * Interface for the props of the RadioGroup component
 */
export interface RadioGroupProps {
  label?: string
  options: RadioOption[]
  defaultValue?: string
  name: string
  labelFontColor?: string
  labelText?: string
  sacredtheme?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const getPremiumStyles = () => ({
  formControl: { position: 'relative' } as React.CSSProperties,
  formLabel: {
    marginBottom: '0.5rem',
    display: 'block',
  } as React.CSSProperties,
  label: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '0.25rem 0',
  } as React.CSSProperties,
  input: {
    display: 'none',
  } as React.CSSProperties,
  radioSpan: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  radioOuter: {
    width: '20px',
    height: '20px',
    border: '2px solid #9CA3AF',
    borderRadius: '9999px',
    marginRight: '0.5rem',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  radioInner: {
    width: '12px',
    height: '12px',
    borderRadius: '9999px',
    position: 'absolute',
    left: '4px',
    top: '4px',
    transition: 'all 0.2s',
    transform: 'scale(0)',
    backgroundColor: '#3B82F6',
  } as React.CSSProperties,
})

const getSacredStyles = () => ({
  formControl: {
    position: 'relative',
  } as React.CSSProperties,
  formLabel: {
    marginBottom: '0.5rem',
    color: '#FFD700',
    fontWeight: 600,
    letterSpacing: '0.025em',
    textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
    display: 'block',
  } as React.CSSProperties,
  label: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    padding: '0.25rem 0',
  } as React.CSSProperties,
  labelHover: {
    transform: 'translateX(4px)',
  } as React.CSSProperties,
  input: {
    display: 'none',
  } as React.CSSProperties,
  radioSpan: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  radioOuter: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 215, 0, 0.6)',
    borderRadius: '9999px',
    marginRight: '0.5rem',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  radioInner: {
    width: '12px',
    height: '12px',
    borderRadius: '9999px',
    position: 'absolute',
    left: '4px',
    top: '4px',
    transition: 'all 0.2s',
    transform: 'scale(0)',
    backgroundColor: '#FFD700',
  } as React.CSSProperties,
  text: {
    color: 'rgba(255, 215, 0, 0.9)',
    transition: 'all 0.3s ease-in-out',
  } as React.CSSProperties,
  textHover: {
    color: '#FFD700',
    textShadow: '0 0 3px rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    top: '-5px',
    right: 0,
    fontSize: '16px',
    color: 'rgba(255, 215, 0, 0.3)',
    animation: 'glyph-rotate 10s linear infinite',
  } as React.CSSProperties,
})

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
  labelFontColor,
  labelText,
  sacredtheme,
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue)
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)
  const styles = sacredtheme ? getSacredStyles() : getPremiumStyles()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value)
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div style={styles.formControl}>
      {sacredtheme && (
        <div style={(styles as ReturnType<typeof getSacredStyles>).glyph}>
          𓋴
        </div>
      )}
      <label
        id={`${name}-label`}
        style={{
          ...styles.formLabel,
          color: sacredtheme ? '#FFD700' : labelFontColor,
        }}
      >
        {labelText || label}
      </label>
      <div role="radiogroup" aria-labelledby={`${name}-label`}>
        {options.map((option, index) => {
          const isChecked = selectedValue === option.label
          const isHovered = hoveredLabel === option.label

          const labelStyle = {
            ...styles.label,
            ...(isHovered &&
              sacredtheme &&
              (styles as ReturnType<typeof getSacredStyles>).labelHover),
          }

          const textStyle = {
            ...(sacredtheme &&
              (styles as ReturnType<typeof getSacredStyles>).text),
            ...(isHovered &&
              sacredtheme &&
              (styles as ReturnType<typeof getSacredStyles>).textHover),
            color: !sacredtheme ? option.fontColor : undefined,
          }

          const radioOuterStyle = {
            ...styles.radioOuter,
            ...(isHovered && sacredtheme && { borderColor: '#FFD700' }),
            ...(isHovered && !sacredtheme && { borderColor: '#3B82F6' }),
            ...(isHovered && {
              backgroundColor: sacredtheme
                ? 'rgba(255, 215, 0, 0.1)'
                : 'rgba(0, 0, 0, 0.04)',
            }),
          }

          return (
            <label
              key={index}
              style={labelStyle}
              onMouseEnter={() => setHoveredLabel(option.label)}
              onMouseLeave={() => setHoveredLabel(null)}
            >
              <input
                type="radio"
                name={name}
                value={option.label}
                checked={isChecked}
                style={styles.input}
                onChange={handleChange}
              />
              <span style={styles.radioSpan}>
                <span style={radioOuterStyle} />
                <span
                  style={{
                    ...styles.radioInner,
                    ...(isChecked && {
                      transform: 'scale(1)',
                      animation: sacredtheme
                        ? 'radio-glow-pulse 2s ease-in-out infinite'
                        : 'none',
                    }),
                  }}
                />
              </span>
              <span style={textStyle}>{option.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default RadioGroup
