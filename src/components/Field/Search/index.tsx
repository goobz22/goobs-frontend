'use client'
import React, { useState, useEffect, useMemo } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
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

interface SearchStyles {
  container: React.CSSProperties
  inputWrapper: React.CSSProperties
  input: React.CSSProperties
  label: React.CSSProperties
  startAdornment: React.CSSProperties
  footerText: React.CSSProperties
}

const getStyles = (
  styles?: FormFieldStyles,
  isFocused?: boolean
): SearchStyles => {
  const { themeConfig, borderColor, labelColor, footerTextColor, transition } =
    getSharedFormFieldStyles(styles, isFocused)

  const componentStyles: SearchStyles = {
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
      color: styles?.theme === 'sacred' ? '#FFD700' : themeConfig.text,
      boxSizing: 'border-box',
      textTransform: 'none' as const,
    },
    label: getSharedLabelStyles(labelColor, themeConfig),
    startAdornment: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      left: '16px',
      color:
        styles?.theme === 'sacred' ? '#FFD700' : themeConfig.adornment.default,
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
        return '#FFD700' // Pure gold for sacred theme
      default:
        return '#9CA3AF' // Medium gray for light theme
    }
  }

  const placeholderColor = getPlaceholderColor()

  // Memoize placeholder styles to prevent infinite re-renders
  const placeholderStyles = useMemo(() => {
    return createPlaceholderStyles(theme, placeholderColor)
  }, [theme, placeholderColor])

  // Inject placeholder styles and force sacred icon color
  useEffect(() => {
    const styleId = `searchbar-styles-${theme}`
    let styleElement = document.getElementById(styleId)

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    let css = placeholderStyles.css

    // Force sacred theme icon color with high specificity
    if (theme === 'sacred') {
      css += `
        .searchbar-sacred-container svg,
        .searchbar-sacred-container svg path,
        .searchbar-sacred-container * {
          color: #FFD700 !important;
          fill: #FFD700 !important;
        }
      `
    }

    styleElement.textContent = css

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
        <div
          className={
            styles?.theme === 'sacred' ? 'searchbar-sacred-container' : ''
          }
          style={{
            ...computedStyles.startAdornment,
            ...(styles?.theme === 'sacred' && {
              color: '#FFD700',
              fill: '#FFD700',
            }),
          }}
        >
          {styles?.theme === 'sacred' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              fill="#FFD700"
              style={{
                color: '#FFD700 !important',
                fill: '#FFD700 !important',
              }}
            >
              <path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                fill="#FFD700"
              />
            </svg>
          ) : (
            <SearchIcon styles={{ theme: theme || 'light' }} />
          )}
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
