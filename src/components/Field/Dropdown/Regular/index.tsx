'use client'

import React, {
  useState,
  useEffect,
  useCallback,
  FocusEventHandler,
  FocusEvent,
} from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../../theme'
import ExpandMoreIcon from '../../../Icons/ExpandMore'

export interface DropdownOption {
  value: string | number
  icon?: React.ReactNode
  attribute1?: string
  attribute2?: string
}

export interface DropdownProps {
  label: string
  options: DropdownOption[]
  defaultValue?: string
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur?: FocusEventHandler<HTMLSelectElement>
  onFocus?: FocusEventHandler<HTMLSelectElement>
  value?: string
  showIdColumns?: boolean
  helperText?: string
  styles?: FormFieldStyles
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  value: externalValue,
  showIdColumns = false,
  helperText,
  styles,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>('')
  const [focused, setFocused] = useState(false)

  const filteredOptions = React.useMemo(() => {
    if (showIdColumns) return options
    return options.filter(opt => {
      // Convert value to string and then lowercase to handle both string and number values
      const value = String(opt.value).toLowerCase()
      return !(
        value === 'id' ||
        value === '_id' ||
        /^[0-9a-f]{24}$/.test(value)
      )
    })
  }, [options, showIdColumns])

  // Inject CSS for sacred theme dropdown options
  useEffect(() => {
    if (styles?.theme === 'sacred') {
      const styleId = 'sacred-dropdown-options-style'

      // Remove existing style if it exists
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) {
        existingStyle.remove()
      }

      // Create new style element
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        /* Base sacred theme dropdown styling */
        select[data-sacred-theme="true"] {
          outline: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
          border: 1px solid rgba(255, 215, 0, 0.4) !important;
          background-image: 
            radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
            radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.05) 0%, transparent 50%) !important;
          backdrop-filter: blur(8px) !important;
        }
        
        /* Focus states with highest priority */
        select[data-sacred-theme="true"]:focus,
        select[data-sacred-theme="true"]:focus-visible,
        select[data-sacred-theme="true"]:focus-within {
          outline: none !important;
          border: 1px solid rgba(255, 215, 0, 1) !important;
          box-shadow: 
            0 0 20px rgba(255, 215, 0, 0.3), 
            0 0 40px rgba(255, 215, 0, 0.15),
            inset 0 0 20px rgba(255, 215, 0, 0.05) !important;
          -webkit-box-shadow: 
            0 0 20px rgba(255, 215, 0, 0.3), 
            0 0 40px rgba(255, 215, 0, 0.15),
            inset 0 0 20px rgba(255, 215, 0, 0.05) !important;
          -moz-box-shadow: 
            0 0 20px rgba(255, 215, 0, 0.3), 
            0 0 40px rgba(255, 215, 0, 0.15),
            inset 0 0 20px rgba(255, 215, 0, 0.05) !important;
        }
        
        /* Remove browser default focus styling */
        select[data-sacred-theme="true"]::-moz-focus-inner {
          border: 0 !important;
          outline: none !important;
        }
        
        select[data-sacred-theme="true"]::-webkit-focus-ring-color {
          color: transparent !important;
        }
        
        select[data-sacred-theme="true"]:focus::-webkit-focus-ring-color {
          color: transparent !important;
        }
        
        /* Option styling */
        select[data-sacred-theme="true"] option {
          background-color: rgba(10, 10, 10, 0.95) !important;
          color: rgba(255, 215, 0, 1) !important;
          font-family: "Cinzel", serif !important;
          font-size: 16px !important;
          padding: 8px 16px !important;
          border: none !important;
          text-shadow: 0 0 2px rgba(255, 215, 0, 0.3) !important;
        }
        
        select[data-sacred-theme="true"] option:hover,
        select[data-sacred-theme="true"] option:focus,
        select[data-sacred-theme="true"] option:checked {
          background-color: rgba(255, 215, 0, 0.2) !important;
          color: #FFD700 !important;
          text-shadow: 0 0 4px rgba(255, 215, 0, 0.6) !important;
        }
        
        select[data-sacred-theme="true"] option:selected {
          background-color: rgba(255, 215, 0, 0.3) !important;
          color: #FFD700 !important;
          font-weight: 600 !important;
        }
        
        /* For WebKit browsers */
        select[data-sacred-theme="true"]::-webkit-scrollbar {
          width: 8px;
        }
        
        select[data-sacred-theme="true"]::-webkit-scrollbar-track {
          background: rgba(10, 10, 10, 0.9);
          border-radius: 4px;
        }
        
        select[data-sacred-theme="true"]::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.4);
          border-radius: 4px;
          border: 1px solid rgba(255, 215, 0, 0.2);
        }
        
        select[data-sacred-theme="true"]::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 215, 0, 0.6);
        }
        
        /* For Firefox */
        select[data-sacred-theme="true"] {
          scrollbar-width: thin !important;
          scrollbar-color: rgba(255, 215, 0, 0.4) rgba(10, 10, 10, 0.9) !important;
        }
        
        /* Chrome/Edge specific option styling */
        @media screen and (-webkit-min-device-pixel-ratio: 0) {
          select[data-sacred-theme="true"] option {
            background: linear-gradient(rgba(10, 10, 10, 0.95), rgba(10, 10, 10, 0.95)) !important;
          }
          
          select[data-sacred-theme="true"] option:hover {
            background: linear-gradient(rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.2)) !important;
          }
        }
        
        /* Firefox specific option styling */
        @-moz-document url-prefix() {
          select[data-sacred-theme="true"] {
            outline: none !important;
            border: 1px solid rgba(255, 215, 0, 0.4) !important;
          }
          
          select[data-sacred-theme="true"]:focus {
            outline: none !important;
            border: 1px solid rgba(255, 215, 0, 1) !important;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3) !important;
          }
          
          select[data-sacred-theme="true"] option {
            color: #FFD700 !important;
            background-color: #0a0a0a !important;
          }
          
          select[data-sacred-theme="true"] option:checked {
            background-color: rgba(255, 215, 0, 0.3) !important;
          }
        }
        
        /* Edge/IE specific */
        select[data-sacred-theme="true"]::-ms-expand {
          display: none !important;
        }
        
        /* Additional browser overrides */
        select[data-sacred-theme="true"]:focus,
        select[data-sacred-theme="true"]:active {
          outline-color: rgba(255, 215, 0, 1) !important;
          outline-style: solid !important;
          outline-width: 1px !important;
          outline-offset: -1px !important;
        }
      `

      // Add style to document head
      document.head.appendChild(style)

      // Cleanup function
      return () => {
        const styleToRemove = document.getElementById(styleId)
        if (styleToRemove) {
          styleToRemove.remove()
        }
      }
    }
  }, [styles?.theme])

  useEffect(() => {
    if (externalValue !== undefined) setSelectedValue(externalValue)
    else if (defaultValue) setSelectedValue(defaultValue)
  }, [externalValue, defaultValue])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (styles?.disabled) return
      const newValue = event.target.value
      setSelectedValue(newValue)
      if (onChange) onChange(event)
    },
    [onChange, styles?.disabled]
  )

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLSelectElement>) => {
      if (styles?.disabled) return
      setFocused(false)

      // Reset sacred theme styling when blur occurs
      if (styles?.theme === 'sacred') {
        const element = e.currentTarget
        element.style.outline = 'none'
        element.style.border = '1px solid rgba(255, 215, 0, 0.4)'
        element.style.boxShadow = '0 0 8px rgba(255, 215, 0, 0.1)'
        element.style.borderColor = 'rgba(255, 215, 0, 0.4)'
      }

      onBlur?.(e)
    },
    [onBlur, styles?.disabled, styles?.theme]
  )

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLSelectElement>) => {
      if (styles?.disabled) return
      setFocused(true)

      // Manually apply sacred theme focus styling to override browser defaults
      if (styles?.theme === 'sacred') {
        const element = e.currentTarget
        element.style.outline = 'none'
        element.style.border = '1px solid rgba(255, 215, 0, 1)'
        element.style.boxShadow =
          '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.15), inset 0 0 20px rgba(255, 215, 0, 0.05)'
        element.style.borderColor = 'rgba(255, 215, 0, 1)'
      }

      onFocus?.(e)
    },
    [onFocus, styles?.disabled, styles?.theme]
  )

  const { themeConfig, borderColor, labelColor, footerTextColor, transition } =
    getSharedFormFieldStyles(styles, focused)

  const componentStyles = {
    container: getSharedContainerStyles(styles),
    label: getSharedLabelStyles(labelColor, themeConfig),
    selectWrapper: {
      position: 'relative' as const,
    },
    select: {
      width: '100%',
      minHeight: '40px',
      appearance: 'none' as const,
      borderRadius: styles?.borderRadius || '8px',
      border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
      padding: styles?.padding || '8px 40px 8px 16px',
      backgroundColor: themeConfig.background,
      color: themeConfig.text,
      fontFamily: themeConfig.fontFamily,
      fontSize: styles?.fontSize || '16px',
      transition,
      // Enhanced styling for dropdown when open
      ...(styles?.theme === 'sacred' && {
        // Sacred theme specific enhancements
        boxShadow: focused
          ? '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.15), inset 0 0 20px rgba(255, 215, 0, 0.05)'
          : '0 0 8px rgba(255, 215, 0, 0.1)',
        textShadow: '0 0 4px rgba(255, 215, 0, 0.5)',
        backgroundImage: `
          radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
          radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
        `,
        outline: 'none',
        borderColor: focused ? 'rgba(255, 215, 0, 1)' : borderColor,
      }),
      ...(styles?.disabled && {
        backgroundColor: '#E0E0E0',
        color: '#9E9E9E',
        borderColor: '#BDBDBD',
        cursor: 'not-allowed',
      }),
    },
    iconWrapper: {
      position: 'absolute' as const,
      inset: '0 0 0 auto',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      pointerEvents: 'none' as const,
    },
    icon: {
      width: '20px',
      height: '20px',
      color: styles?.disabled ? '#9E9E9E' : themeConfig.text,
      ...(styles?.theme === 'sacred' &&
        !styles?.disabled && {
          filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
        }),
    },
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
  }

  const renderOption = (option: DropdownOption) => {
    const valueStr = String(option.value)
    const displayText = option.value
      ? valueStr.replace(/_/g, ' ').charAt(0).toUpperCase() +
        valueStr.replace(/_/g, ' ').slice(1)
      : ''

    const attributes = [option.attribute1, option.attribute2].filter(Boolean)
    const attributeText =
      attributes.length > 0 ? ` (${attributes.join(' | ')})` : ''

    return (
      <option
        key={option.value}
        value={option.value}
        data-sacred-theme={styles?.theme === 'sacred'}
      >
        {displayText}
        {attributeText}
      </option>
    )
  }

  return (
    <div style={componentStyles.container}>
      <label style={componentStyles.label}>
        {label}
        {styles?.required && (
          <span style={getRequiredIndicatorStyle(styles)}>
            {styles?.requiredIndicatorText || ' *'}
          </span>
        )}
      </label>
      <div style={componentStyles.selectWrapper}>
        <select
          value={selectedValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={styles?.disabled}
          data-sacred-theme={styles?.theme === 'sacred'}
          {...getRequiredProps(styles?.required)}
          style={componentStyles.select}
        >
          {filteredOptions.map(renderOption)}
        </select>
        <div style={componentStyles.iconWrapper}>
          <ExpandMoreIcon
            styles={{ theme: styles?.theme || 'sacred' }}
            style={componentStyles.icon}
          />
        </div>
      </div>
      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default Dropdown
