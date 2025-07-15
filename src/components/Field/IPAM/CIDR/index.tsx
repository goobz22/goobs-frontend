'use client'

import React, { useState, useCallback, useRef } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getSharedAdornmentStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../../theme'
import ArrowDropUpIcon from '../../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

export interface CIDRFieldProps {
  initialValue?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | number) => void
  initialDelay?: number
  repeatInterval?: number
  minCidr?: number
  maxCidr?: number
  showSubnetInfo?: boolean
  label?: React.ReactNode
  helperText?: string
  disabled?: boolean
  styles?: FormFieldStyles
  // Additional HTML input props
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void
  placeholder?: string
  id?: string
  autoComplete?: string
}

const calculateCIDRInfo = (cidr: number) => {
  const fullMask = Math.pow(2, 32) - Math.pow(2, 32 - cidr)
  const maskParts = [
    (fullMask >> 24) & 255,
    (fullMask >> 16) & 255,
    (fullMask >> 8) & 255,
    fullMask & 255,
  ]
  const mask = maskParts.join('.')
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = Math.max(totalHosts - 2, 0)
  const networks = Math.pow(2, 32 - cidr)

  return {
    mask,
    networks: networks.toLocaleString(),
    totalHosts: totalHosts.toLocaleString(),
    usableHosts: usableHosts.toLocaleString(),
  }
}

const getStyles = (styles?: FormFieldStyles, adornmentColor?: string) => {
  const isSacred = styles?.theme === 'sacred'
  const isDark = styles?.theme === 'dark'

  return {
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      marginRight: '-0.25rem',
    } as React.CSSProperties,
    button: {
      padding: 0,
      width: '1rem',
      height: '1rem',
      minWidth: '1rem',
      minHeight: '1rem',
      borderRadius: '0.125rem',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: styles?.disabled ? 'not-allowed' : 'pointer',
      color:
        adornmentColor ||
        (isSacred ? '#FFD700' : isDark ? '#E5E7EB' : '#4B5563'),
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: styles?.disabled ? 0.5 : 1,
      '&:hover': {
        backgroundColor: isSacred
          ? 'rgba(255, 215, 0, 0.1)'
          : isDark
            ? 'rgba(229, 231, 235, 0.1)'
            : 'rgba(229, 231, 235, 0.5)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    } as React.CSSProperties,
    infoContainer: {
      marginTop: '0.5rem',
      fontSize: '0.875rem',
      color: isSacred ? '#FFD700' : isDark ? '#D1D5DB' : '#4B5563',
    } as React.CSSProperties,
  }
}

const CIDRField: React.FC<CIDRFieldProps> = ({
  initialValue = '24',
  onChange,
  label = 'CIDR',
  initialDelay = 500,
  repeatInterval = 100,
  minCidr = 8,
  maxCidr = 32,
  showSubnetInfo = true,
  helperText,
  disabled,
  styles,
  ...rest
}) => {
  const [currentValue, setCurrentValue] = useState(() => {
    const initialNum = parseInt(initialValue)
    if (isNaN(initialNum)) return '24'
    return Math.min(Math.max(initialNum, minCidr), maxCidr).toString()
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cidrInfo = calculateCIDRInfo(parseInt(currentValue) || 24)

  // Merge disabled prop with styles
  const mergedStyles = {
    ...styles,
    disabled: disabled !== undefined ? disabled : styles?.disabled,
  }

  const {
    themeConfig,
    borderColor,
    labelColor,
    adornmentColor,
    footerTextColor,
    transition,
  } = getSharedFormFieldStyles(mergedStyles, false)

  const pickerStyles = getStyles(mergedStyles, adornmentColor)

  const componentStyles: Record<string, React.CSSProperties> = {
    container: getSharedContainerStyles(mergedStyles),
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: mergedStyles?.height || '40px',
      width: '100%',
      border: `${mergedStyles?.borderWidth || '1px'} solid ${borderColor}`,
      borderRadius: mergedStyles?.borderRadius || '8px',
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
      padding: mergedStyles?.padding || '8px 16px',
      paddingRight: '60px', // Space for increment/decrement buttons
      fontSize: mergedStyles?.fontSize || '16px',
      fontWeight: mergedStyles?.fontWeight,
      lineHeight: mergedStyles?.lineHeight,
      fontFamily: themeConfig.fontFamily,
      color: 'inherit',
      boxSizing: 'border-box',
    },
    label: getSharedLabelStyles(labelColor, themeConfig),
    endAdornment: getSharedAdornmentStyles(adornmentColor),
    footerText: getSharedFooterTextStyles(
      footerTextColor,
      themeConfig,
      mergedStyles
    ),
  }

  const clearTimers = useCallback(() => {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    initialTimerRef.current = null
    timerRef.current = null
  }, [])

  const handleIncrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev)
      const newValue = Math.min(maxCidr, isNaN(num) ? minCidr : num + 1)
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, maxCidr, minCidr])

  const handleDecrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev)
      const newValue = Math.max(minCidr, isNaN(num) ? minCidr : num - 1)
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, minCidr])

  const handleIncrementMouseDown = useCallback(() => {
    handleIncrement()
    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handleIncrement, repeatInterval)
    }, initialDelay)
    document.addEventListener('mouseup', clearTimers)
    document.addEventListener('mouseleave', clearTimers)
  }, [handleIncrement, initialDelay, repeatInterval, clearTimers])

  const handleDecrementMouseDown = useCallback(() => {
    handleDecrement()
    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handleDecrement, repeatInterval)
    }, initialDelay)
    document.addEventListener('mouseup', clearTimers)
    document.addEventListener('mouseleave', clearTimers)
  }, [handleDecrement, initialDelay, repeatInterval, clearTimers])

  React.useEffect(() => {
    return () => {
      clearTimers()
      document.removeEventListener('mouseup', clearTimers)
      document.removeEventListener('mouseleave', clearTimers)
    }
  }, [clearTimers])

  const handleTextFieldChange = useCallback(
    (value: string) => {
      const newValue = value.replace(/[^0-9/]/g, '').replace('/', '')
      if (newValue === '') {
        setCurrentValue(minCidr.toString())
        if (onChange) {
          const syntheticEvent = {
            target: { value: `/${minCidr}` },
            currentTarget: { value: `/${minCidr}` },
          } as React.ChangeEvent<HTMLInputElement>
          onChange(syntheticEvent)
        }
        return
      }
      const numValue = parseInt(newValue, 10)
      let finalValue = newValue
      if (isNaN(numValue) || numValue < minCidr) {
        finalValue = minCidr.toString()
        setCurrentValue(minCidr.toString())
      } else if (numValue > maxCidr) {
        finalValue = maxCidr.toString()
        setCurrentValue(maxCidr.toString())
      } else {
        setCurrentValue(newValue)
      }
      if (onChange) {
        const syntheticEvent = {
          target: { value: `/${finalValue}` },
          currentTarget: { value: `/${finalValue}` },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    },
    [onChange, minCidr, maxCidr]
  )

  const EndAdornment = () => (
    <div style={pickerStyles.buttonContainer}>
      <button
        type="button"
        onMouseDown={handleIncrementMouseDown}
        disabled={mergedStyles?.disabled}
        style={pickerStyles.button}
      >
        <ArrowDropUpIcon style={{ fontSize: '1.25rem' }} />
      </button>
      <button
        type="button"
        onMouseDown={handleDecrementMouseDown}
        disabled={mergedStyles?.disabled}
        style={pickerStyles.button}
      >
        <ArrowDropDownIcon style={{ fontSize: '1.25rem' }} />
      </button>
    </div>
  )

  return (
    <div>
      <div style={componentStyles.container}>
        {label && (
          <label style={componentStyles.label}>
            {label}
            {mergedStyles?.required && (
              <span style={getRequiredIndicatorStyle(mergedStyles)}>
                {mergedStyles?.requiredIndicatorText || ' *'}
              </span>
            )}
          </label>
        )}

        <div style={componentStyles.inputWrapper}>
          <input
            {...rest}
            {...getRequiredProps(mergedStyles?.required)}
            value={`/${currentValue}`}
            disabled={mergedStyles?.disabled}
            onChange={e => handleTextFieldChange(e.target.value)}
            type="text"
            inputMode="numeric"
            style={componentStyles.input}
          />

          <div
            style={{
              ...componentStyles.endAdornment,
              right: '16px',
            }}
          >
            <EndAdornment />
          </div>
        </div>
      </div>

      {showSubnetInfo && (
        <div style={pickerStyles.infoContainer}>
          <div>Subnet Mask: {cidrInfo.mask}</div>
          <div>
            Total Hosts: {cidrInfo.totalHosts} ({cidrInfo.usableHosts} usable)
          </div>
          <div>Networks: {cidrInfo.networks}</div>
        </div>
      )}

      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default CIDRField
