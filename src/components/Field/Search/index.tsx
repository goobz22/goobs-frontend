'use client'
import React, { useState, useEffect, useMemo } from 'react'
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

// Create a unique ID for this component instance
const createPlaceholderStyles = (theme: string, placeholderColor: string) => {
  const className = `searchbar-placeholder-${theme}`

  const css = `
    .${className} {
      text-transform: none !important;
    }
    .${className}::placeholder {
      color: ${placeholderColor} !important;
      opacity: 0.7;
    }
    
    .${className}::-webkit-input-placeholder {
      color: ${placeholderColor} !important;
      opacity: 0.7;
    }
    
    .${className}::-moz-placeholder {
      color: ${placeholderColor} !important;
      opacity: 0.7;
    }
    
    .${className}:-ms-input-placeholder {
      color: ${placeholderColor} !important;
      opacity: 0.7;
    }
    
    .${className}::-ms-input-placeholder {
      color: ${placeholderColor} !important;
      opacity: 0.7;
    }
  `

  return { css, className }
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
      textTransform: 'none' as const,
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
  const theme = styles?.theme || 'light'

  // Get the appropriate placeholder color based on theme
  const getPlaceholderColor = () => {
    switch (theme) {
      case 'dark':
        return '#9CA3AF' // Light gray for dark theme
      case 'sacred':
        return 'rgba(255, 215, 0, 0.7)' // Gold for sacred theme
      default:
        return '#9CA3AF' // Medium gray for light theme
    }
  }

  const placeholderColor = getPlaceholderColor()

  // Memoize placeholder styles to prevent infinite re-renders
  const placeholderStyles = useMemo(() => {
    return createPlaceholderStyles(theme, placeholderColor)
  }, [theme, placeholderColor])

  // Inject placeholder styles
  useEffect(() => {
    const styleId = `searchbar-placeholder-${theme}`
    let styleElement = document.getElementById(styleId)

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = placeholderStyles.css

    return () => {
      // Clean up on unmount
      const element = document.getElementById(styleId)
      if (element) {
        element.remove()
      }
    }
  }, [theme, placeholderColor, placeholderStyles.css])

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
          <SearchIcon styles={{ theme: theme || 'sacred' }} />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={computedStyles.input}
          className={placeholderStyles.className}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          {...getRequiredProps(styles?.required)}
        />
      </div>
      {helperText && <div style={computedStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default Searchbar
