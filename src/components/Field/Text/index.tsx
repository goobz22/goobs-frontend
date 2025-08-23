/**
 * @fileoverview Defines the TextField component, a modern and themeable input field.
 * It supports "light", "dark", and "sacred" themes, adornments, floating labels, and error states.
 * This component is built using standard React hooks for state management and a comprehensive theme system.
 */
'use client'
import React, { useRef, useMemo, useState, useCallback } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedFooterTextStyles,
  getSharedAdornmentStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../theme'

// --------------------------------------------------------------------------
// TYPE DEFINITIONS
// --------------------------------------------------------------------------

export interface TextFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onFocus'
    | 'onBlur'
    | 'disabled'
    | 'required'
  > {
  /** The value of the input. */
  value: string
  /** Callback fired when the value changes. */
  onChange: (value: string) => void
  /** Callback fired when the input is focused. */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Callback fired when the input loses focus. */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Helper text to display (can be error or info based on styles.helperTextType). */
  helperText?: string
  /** A React node to display at the start of the input. */
  startAdornment?: React.ReactNode
  /** A React node to display at the end of the input. */
  endAdornment?: React.ReactNode
  /** The label for the input. Can be a string or a React node. */
  label?: React.ReactNode
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: FormFieldStyles
}

// --------------------------------------------------------------------------
// AUTOFILL STYLING INJECTION
// --------------------------------------------------------------------------

// One-time global autofill style injection to handle browser autofill styling
let textFieldAutofillStylesInjected = false
const injectTextFieldAutofillStyles = () => {
  if (textFieldAutofillStylesInjected) return
  if (typeof document === 'undefined') return
  try {
    const styleId = 'textfield-autofill-styles'
    if (document.getElementById(styleId)) {
      textFieldAutofillStylesInjected = true
      return
    }
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      /* Override browser autofill styling to maintain theme consistency */
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: inherit !important;
        background-color: transparent !important;
        background-image: none !important;
        box-shadow: none !important;
        transition: background-color 0s 600000s, color 0s 600000s !important;
      }
      
      /* Additional autofill override for Firefox */
      input:-moz-autofill,
      input:-moz-autofill-preview {
        background-color: transparent !important;
        color: inherit !important;
        filter: none !important;
      }
      
      /* Override Edge autofill */
      input:-ms-input-placeholder {
        color: inherit !important;
      }
    `
    document.head.appendChild(style)
    textFieldAutofillStylesInjected = true
  } catch {}
}

// --------------------------------------------------------------------------
// STYLING LOGIC
// --------------------------------------------------------------------------

const getStyles = (
  styles?: FormFieldStyles,
  isFocused?: boolean,
  hasStartAdornment?: boolean,
  hasEndAdornment?: boolean
) => {
  const {
    themeConfig,
    borderColor,
    labelColor,
    adornmentColor,
    footerTextColor,
    transition,
  } = getSharedFormFieldStyles(styles, isFocused)

  const componentStyles: Record<string, React.CSSProperties> = {
    container: {
      position: 'relative',
      width: styles?.width || '100%',
      minWidth: styles?.minWidth,
      maxWidth: styles?.maxWidth,
      height: styles?.height || 'auto',
      minHeight: styles?.minHeight,
      maxHeight: styles?.maxHeight,
      marginTop: styles?.marginTop || '0',
      marginLeft: styles?.marginLeft,
      marginRight: styles?.marginRight,
      textTransform: 'none',
      // Apply marginBottom last to ensure it's not overridden
      marginBottom: styles?.marginBottom || '0',
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: styles?.height || '40px',
      width: '100%',
      borderWidth: styles?.borderWidth || '1px',
      borderStyle: 'solid',
      borderColor: borderColor,
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
      padding: styles?.padding || '8px 16px',
      paddingLeft:
        styles?.paddingLeft ||
        (hasStartAdornment ? styles?.startAdornmentOffset || '48px' : '16px'),
      paddingRight:
        styles?.paddingRight ||
        (hasEndAdornment ? styles?.endAdornmentOffset || '48px' : '16px'),
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
    adornment: getSharedAdornmentStyles(adornmentColor),
    startAdornment: { left: '16px' },
    endAdornment: { right: '16px' },
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
  }

  return componentStyles
}

// --------------------------------------------------------------------------
// TEXTFIELD COMPONENT
// --------------------------------------------------------------------------

const TextField: React.FC<TextFieldProps> = props => {
  const {
    value,
    onChange,
    onFocus,
    onBlur,
    helperText,
    startAdornment,
    endAdornment,
    label,
    styles,
    ...rest
  } = props

  // Inject autofill styles on first render
  injectTextFieldAutofillStyles()

  // Focus state management for styling
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter out non-HTML props that shouldn't be passed to the input element
  const filteredProps = useMemo(() => {
    const { sacredtheme, ...validProps } = rest as any
    // sacredtheme is intentionally excluded from the props passed to the input
    void sacredtheme
    return validProps
  }, [rest])

  const computedStyles = useMemo(
    () => getStyles(styles, isFocused, !!startAdornment, !!endAdornment),
    [styles, isFocused, startAdornment, endAdornment]
  )

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      onChange(newValue)
    },
    [onChange]
  )

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    },
    [onBlur]
  )

  return (
    <div style={computedStyles.container}>
      {label && (
        <label style={computedStyles.label}>
          {typeof label === 'string' ? (
            <>
              {label}
              {styles?.required && (
                <span style={getRequiredIndicatorStyle(styles)}>
                  {styles?.requiredIndicatorText || ' *'}
                </span>
              )}
            </>
          ) : (
            label
          )}
        </label>
      )}

      <div style={computedStyles.inputWrapper} onClick={handleContainerClick}>
        {startAdornment && (
          <div
            style={{
              ...computedStyles.adornment,
              ...computedStyles.startAdornment,
            }}
          >
            {startAdornment}
          </div>
        )}

        <input
          ref={inputRef}
          {...filteredProps}
          {...getRequiredProps(styles?.required)}
          value={value || ''}
          disabled={styles?.disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={computedStyles.input}
        />

        {endAdornment && (
          <div
            style={{
              ...computedStyles.adornment,
              ...computedStyles.endAdornment,
            }}
          >
            {endAdornment}
          </div>
        )}
      </div>
      {helperText && <div style={computedStyles.footerText}>{helperText}</div>}
    </div>
  )
}

TextField.displayName = 'TextField'

export default TextField
