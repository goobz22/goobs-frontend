'use client'
import React, { useState } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getSharedAdornmentStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../theme'
import SearchIcon from '../../Icons/Search'

export interface SearchbarProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  helperText?: string
  className?: string
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: FormFieldStyles
}

const getStyles = (styles?: FormFieldStyles, isFocused?: boolean) => {
  const {
    themeConfig,
    borderColor,
    labelColor,
    adornmentColor,
    footerTextColor,
    transition,
  } = getSharedFormFieldStyles(styles, isFocused)

  const componentStyles: Record<string, React.CSSProperties> = {
    container: getSharedContainerStyles(styles),
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: styles?.height || '40px',
      width: '100%',
      border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
      borderRadius: styles?.borderRadius || '8px',
      backgroundColor: themeConfig.background,
      color: themeConfig.text,
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      transition,
    },
    input: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      outline: 'none',
      border: 'none',
      padding: styles?.padding || '8px 16px 8px 48px', // Left padding for search icon
      paddingLeft: styles?.paddingLeft || '48px',
      paddingRight: styles?.paddingRight || '16px',
      paddingTop: styles?.paddingTop || '8px',
      paddingBottom: styles?.paddingBottom || '8px',
      fontSize: styles?.fontSize || '16px',
      fontWeight: styles?.fontWeight,
      lineHeight: styles?.lineHeight,
      fontFamily: themeConfig.fontFamily,
      color: 'inherit',
      boxSizing: 'border-box',
    },
    label: getSharedLabelStyles(labelColor, themeConfig),
    startAdornment: {
      ...getSharedAdornmentStyles(adornmentColor),
      left: '16px',
    },
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
  }

  return componentStyles
}

const Searchbar: React.FC<SearchbarProps> = ({
  label,
  placeholder,
  value,
  onChange,
  helperText,
  styles,
}) => {
  const [focused, setFocused] = useState(false)

  const computedStyles = getStyles(styles, focused)

  const handleFocus = () => setFocused(true)
  const handleBlur = () => setFocused(false)

  return (
    <div style={computedStyles.container}>
      {label && (
        <label style={computedStyles.label}>
          {label}
          {styles?.required && (
            <span style={getRequiredIndicatorStyle(styles)}>
              {styles?.requiredIndicatorText || ' *'}
            </span>
          )}
        </label>
      )}

      <div style={computedStyles.inputWrapper}>
        <div style={computedStyles.startAdornment}>
          <SearchIcon
            style={{
              width: '20px',
              height: '20px',
              color: 'inherit',
            }}
          />
        </div>

        <input
          id="search-input"
          type="text"
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={styles?.disabled}
          placeholder={placeholder}
          style={{
            ...computedStyles.input,
            ...(styles?.disabled && { opacity: 0.5, cursor: 'not-allowed' }),
          }}
          {...getRequiredProps(styles?.required)}
        />
      </div>

      {helperText && <div style={computedStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default Searchbar
