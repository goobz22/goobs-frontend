'use client'

import React, {
  useState,
  useEffect,
  useCallback,
  FocusEventHandler,
  FocusEvent,
} from 'react'
import { black } from '../../../../styles/palette'
import ExpandMoreIcon from '../../../Icons/ExpandMore'

export interface SimpleDropdownOption {
  value: string
  icon?: React.ReactNode
}

export interface ComplexDropdownOption extends SimpleDropdownOption {
  attribute1?: string
  attribute2?: string
}

export type DropdownOption = SimpleDropdownOption | ComplexDropdownOption

export interface DropdownProps {
  label: string
  options: DropdownOption[]
  defaultValue?: string
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  error?: boolean
  helperText?: string
  required?: boolean
  onBlur?: FocusEventHandler<HTMLSelectElement>
  onFocus?: FocusEventHandler<HTMLSelectElement>
  value?: string
  width?: string
  disabled?: boolean
  showIdColumns?: boolean
  sacredtheme?: boolean
}

const getStyles = (
  sacredtheme: boolean,
  isLabelShrunken: boolean,
  shrunklabelposition: 'onNotch' | 'aboveNotch',
  focused: boolean,
  disabled: boolean,
  shrunkfontcolor: string,
  unshrunkfontcolor: string,
  backgroundcolor?: string,
  outlinecolor?: string,
  fontcolor?: string
) => ({
  container: {
    width: '100%',
    marginTop: '1rem',
    height: 'auto',
    overflow: 'visible',
    position: 'relative' as const,
  },
  label: {
    position: 'absolute' as const,
    transition: 'all 0.2s',
    pointerEvents: 'none' as const,
    color: disabled
      ? '#9E9E9E'
      : sacredtheme
        ? 'rgba(255, 215, 0, 0.8)'
        : unshrunkfontcolor,
    ...(isLabelShrunken
      ? {
          fontSize: '0.75rem',
          ...(shrunklabelposition === 'aboveNotch'
            ? { top: '-0.5rem', left: 0 }
            : {
                top: '0.125rem',
                left: '0.75rem',
                transform: 'translateY(-50%)',
                backgroundColor: sacredtheme ? 'black' : 'white',
                padding: '0 0.25rem',
              }),
        }
      : { top: '50%', left: '0.75rem', transform: 'translateY(-50%)' }),
    ...(focused && { color: sacredtheme ? '#FFD700' : shrunkfontcolor }),
    ...(sacredtheme && {
      textShadow: '0 0 2px rgba(255, 215, 0, 0.5)',
      fontWeight: 'bold',
      letterSpacing: '0.05em',
    }),
    ...(isLabelShrunken &&
      (sacredtheme
        ? {
            color: '#FFD700',
            textShadow: '0 0 5px rgba(255, 215, 0, 0.7)',
            fontWeight: 'bold',
          }
        : { color: shrunkfontcolor })),
  },
  selectWrapper: {
    position: 'relative' as const,
  },
  select: {
    width: '100%',
    minHeight: '40px',
    appearance: 'none' as const,
    borderRadius: '0.5rem',
    border: `2px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.5)' : '#000'}`,
    padding: '0.5rem 2rem 0.5rem 0.5rem',
    backgroundColor: sacredtheme ? 'rgba(0, 0, 0, 0.8)' : 'white',
    color: sacredtheme ? '#FFD700' : '#000',
    ...(sacredtheme && {
      backgroundImage:
        'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.05), transparent)',
      animation: 'dropdown-sacred-glow 2s infinite alternate',
    }),
    ...(disabled && {
      backgroundColor: '#E0E0E0',
      color: '#9E9E9E',
      borderColor: '#BDBDBD',
      cursor: 'not-allowed',
    }),
    ...(!sacredtheme && {
      backgroundColor: backgroundcolor,
      borderColor: outlinecolor,
      color: fontcolor,
    }),
  },
  iconWrapper: {
    position: 'absolute' as const,
    inset: '0 0 0 auto',
    display: 'flex',
    alignItems: 'center',
    padding: '0 0.5rem',
    pointerEvents: 'none' as const,
    ...(sacredtheme && {
      animation: 'dropdown-float-glyph 3s infinite alternate',
    }),
  },
  icon: {
    width: '1.25rem',
    height: '1.25rem',
    color: disabled ? '#9E9E9E' : sacredtheme ? '#FFD700' : '#000',
  },
  helperText: {
    fontSize: '0.75rem',
    marginTop: '0.25rem',
  },
})

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  defaultValue,
  backgroundcolor,
  outlinecolor,
  fontcolor = black.main,
  shrunkfontcolor = black.main,
  unshrunkfontcolor = black.main,
  shrunklabelposition = 'onNotch',
  onChange,
  error = false,
  helperText,
  required = false,
  onBlur,
  onFocus,
  value: externalValue,
  width,
  disabled = false,
  showIdColumns = false,
  sacredtheme = false,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>('')
  const [focused, setFocused] = useState(false)

  const filteredOptions = React.useMemo(() => {
    if (showIdColumns) return options
    return options.filter(opt => {
      const value = opt.value.toLowerCase()
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
      if (disabled) return
      const newValue = event.target.value
      setSelectedValue(newValue)
      if (onChange) onChange(event)
    },
    [onChange, disabled]
  )

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLSelectElement>) => {
      if (disabled) return
      setFocused(false)
      onBlur?.(e)
    },
    [onBlur, disabled]
  )

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLSelectElement>) => {
      if (disabled) return
      setFocused(true)
      onFocus?.(e)
    },
    [onFocus, disabled]
  )

  const isLabelShrunken = focused || !!selectedValue

  const styles = getStyles(
    sacredtheme,
    isLabelShrunken,
    shrunklabelposition,
    focused,
    disabled,
    shrunkfontcolor,
    unshrunkfontcolor,
    backgroundcolor,
    outlinecolor,
    fontcolor
  )

  const renderOption = (option: DropdownOption) => {
    const displayText = option.value
      ? option.value.replace(/_/g, ' ').charAt(0).toUpperCase() +
        option.value.replace(/_/g, ' ').slice(1)
      : ''
    if (!('attribute1' in option)) {
      return (
        <option key={option.value} value={option.value}>
          {displayText}
        </option>
      )
    }
    return (
      <option key={option.value} value={option.value}>
        {displayText}
        {(option.attribute1 || option.attribute2) &&
          ` (${[option.attribute1, option.attribute2].filter(Boolean).join(' | ')})`}
      </option>
    )
  }

  return (
    <div style={{ ...styles.container, width: width || '100%' }}>
      <label style={styles.label as React.CSSProperties}>
        {sacredtheme ? 'Divine Selection' : label}
      </label>
      <div style={styles.selectWrapper}>
        <select
          value={selectedValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          required={required}
          style={styles.select}
        >
          {filteredOptions.map(renderOption)}
        </select>
        <div style={styles.iconWrapper}>
          <ExpandMoreIcon style={styles.icon} />
        </div>
      </div>
      {helperText && (
        <p style={{ ...styles.helperText, color: error ? 'red' : 'gray' }}>
          {helperText}
        </p>
      )}
    </div>
  )
}

export default Dropdown
