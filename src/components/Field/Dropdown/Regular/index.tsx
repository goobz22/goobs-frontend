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
      onBlur?.(e)
    },
    [onBlur, styles?.disabled]
  )

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLSelectElement>) => {
      if (styles?.disabled) return
      setFocused(true)
      onFocus?.(e)
    },
    [onFocus, styles?.disabled]
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
      <option key={option.value} value={option.value}>
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
          {...getRequiredProps(styles?.required)}
          style={componentStyles.select}
        >
          {filteredOptions.map(renderOption)}
        </select>
        <div style={componentStyles.iconWrapper}>
          <ExpandMoreIcon style={componentStyles.icon} />
        </div>
      </div>
      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default Dropdown
