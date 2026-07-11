// src/components/ConfirmationCodeInput/index.tsx

'use client'
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
  type FC,
} from 'react'
import CheckCircleOutline from '../Icons/CheckCircleOutline'
import CustomButton, { type ButtonProps } from '../Button'
import { type ConfirmationCodeInputStyles } from './types'
import { useFieldBinding } from '../Field/Shell/useFieldBinding'
import { useOptionalFormContext } from '../Form/context'
import cssStyles from './ConfirmationCodeInput.module.css'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface ConfirmationCodeInputsProps {
  isValid: boolean
  codeLength?: number
  'aria-label'?: string
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  onChange?: (value: string) => void
  value?: string
  /**
   * Form-engine binding key. When inside a `<Form>` with no explicit `value`,
   * `useFieldBinding` pulls the code value/onChange from the form engine;
   * otherwise the caller's explicit value/onChange pass through unchanged.
   */
  name?: string
  /** Stable test selector — emitted as `data-field-name`; defaults to `name`. */
  dataFieldName?: string
  codeSent?: boolean
  onVerify?: () => void | Promise<void>
  onSendResend?: () => void | Promise<void>
  onDisableVerification: () => void | Promise<void>
  verifyButtonProps?: Partial<ButtonProps>
  sendResendButtonProps?: Partial<ButtonProps>
  disableVerificationButtonProps?: Partial<ButtonProps>
  showActionButtons?: boolean
  showSendResendButton?: boolean
  successMessage?: string
  showSuccessState?: boolean
  /**
   * Heading level (`h1`–`h6`) rendered for the success message so the consumer
   * can slot it correctly into the surrounding document outline (avoids a
   * skipped-heading-level WCAG 1.3.1 / 2.4.6 violation). Defaults to `3`,
   * preserving the historical `<h3>`.
   */
  successMessageHeadingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: ConfirmationCodeInputStyles
}

// --------------------------------------------------------------------------
// SACRED THEME COMPONENTS
// --------------------------------------------------------------------------

const SacredGlyphs: React.FC = () => {
  return null
}

const SacredBottomDecorations: React.FC = () => {
  return (
    <div className={cssStyles.bottomGlyphContainer}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className={cssStyles.bottomGlyph}>
          .
        </span>
      ))}
    </div>
  )
}

// --------------------------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------------------------

const ConfirmationCodeInputs: FC<ConfirmationCodeInputsProps> = ({
  codeLength = 6,
  isValid,
  onChange,
  value: valuePropRaw,
  name,
  dataFieldName,
  'aria-label': ariaLabel,
  'aria-required': ariaRequired,
  'aria-invalid': ariaInvalid,
  codeSent = false,
  onVerify,
  onSendResend,
  onDisableVerification,
  verifyButtonProps = {},
  sendResendButtonProps = {},
  disableVerificationButtonProps = {},
  showActionButtons = false,
  showSendResendButton = true,
  successMessage = 'Verification Successful',
  showSuccessState = false,
  successMessageHeadingLevel = 3,
  styles,
}) => {
  // Tier-1 form binding. Inside a <Form> with a `name` and no explicit `value`,
  // the code string + its setter come from the form engine; otherwise the
  // caller's explicit value/onChange pass through unchanged (back-compat). The
  // raw (un-defaulted) value is passed so the binding's `value === undefined`
  // gate still fires when the caller omitted `value`.
  const formContext = useOptionalFormContext()
  const {
    value: boundValue,
    onChange: boundOnChange,
    onBlur: boundOnBlur,
  } = useFieldBinding<string>({
    name,
    value: valuePropRaw,
    onChange,
  })
  const isBound = boundOnChange !== undefined && boundValue !== undefined

  // The caller's explicit value (when bound, this is the engine value).
  const valueProp = boundValue ?? ''

  // For uncontrolled mode - parent doesn't provide onChange
  const [uncontrolledValue, setUncontrolledValue] = useState(valueProp)
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array.from({ length: codeLength }, () => null)
  )
  const hasAutoFocused = useRef(false)

  // Use the engine value when bound, the controlled value when the caller wired
  // onChange, otherwise the internal uncontrolled state.
  const isControlled = isBound || onChange !== undefined
  const currentValue = isControlled ? valueProp : uncontrolledValue

  const theme = styles?.theme ?? 'light'
  const isSacredTheme = theme === 'sacred'
  const isDisabled = styles?.disabled

  // Caller-supplied scalar overrides kept in JS (recipe step 3). Theme defaults
  // live in CSS; this only carries explicit per-instance overrides + scalar
  // values forwarded as CSS custom properties (gap / inputGap).
  const containerOverrideStyle: CSSProperties = {
    ...(styles?.width !== undefined && { width: styles.width }),
    ...(styles?.maxWidth !== undefined && { maxWidth: styles.maxWidth }),
    ...(styles?.minWidth !== undefined && { minWidth: styles.minWidth }),
    ...(styles?.height !== undefined && { height: styles.height }),
    ...(styles?.maxHeight !== undefined && { maxHeight: styles.maxHeight }),
    ...(styles?.minHeight !== undefined && { minHeight: styles.minHeight }),
    ...(styles?.margin !== undefined && { margin: styles.margin }),
    ...(styles?.marginTop !== undefined && { marginTop: styles.marginTop }),
    ...(styles?.marginBottom !== undefined && {
      marginBottom: styles.marginBottom,
    }),
    ...(styles?.marginLeft !== undefined && { marginLeft: styles.marginLeft }),
    ...(styles?.marginRight !== undefined && {
      marginRight: styles.marginRight,
    }),
    ...(styles?.padding !== undefined && { padding: styles.padding }),
    ...(styles?.backgroundColor !== undefined && {
      background: styles.backgroundColor,
    }),
    ...(styles?.backgroundImage !== undefined && {
      backgroundImage: styles.backgroundImage,
    }),
    ...(styles?.borderColor !== undefined && {
      borderColor: styles.borderColor,
    }),
    ...(styles?.borderWidth !== undefined && {
      borderWidth: styles.borderWidth,
    }),
    ...(styles?.borderRadius !== undefined && {
      borderRadius: styles.borderRadius,
    }),
    ...(styles?.boxShadow !== undefined && { boxShadow: styles.boxShadow }),
    ...(styles?.gap !== undefined && {
      ['--cci-gap' as string]: styles.gap,
    }),
    ...(styles?.inputGap !== undefined && {
      ['--cci-input-gap' as string]: styles.inputGap,
    }),
  }

  // Auto-focus first input on mount (only once)
  useEffect(() => {
    if (!hasAutoFocused.current) {
      const timer = setTimeout(() => {
        // Only focus if there's no value yet
        if (inputRefs.current[0] && !inputRefs.current[0].value) {
          inputRefs.current[0].focus()
          hasAutoFocused.current = true
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, []) // Empty deps - only run on mount

  // Helper to update value. When bound to the form engine the change is written
  // through `boundOnChange` (which also chains the caller's original onChange);
  // otherwise the legacy controlled/uncontrolled path is preserved exactly.
  const updateValue = useCallback(
    (newValue: string) => {
      if (isBound) {
        boundOnChange?.(newValue)
        return
      }
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      onChange?.(newValue)
    },
    [isBound, boundOnChange, isControlled, onChange]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const val = e.target.value
      if (!/^\d*$/.test(val)) return
      const newValueArr = currentValue.padEnd(codeLength, '').split('')
      if (val.length > 1)
        val.split('').forEach((digit, i) => {
          if (index + i < codeLength) newValueArr[index + i] = digit
        })
      else newValueArr[index] = val.charAt(val.length - 1)
      const newValue = newValueArr.join('').trimEnd()
      updateValue(newValue)
      if (val && index < codeLength - 1) inputRefs.current[index + 1]?.focus()
    },
    [currentValue, codeLength, updateValue]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      const clearAndMoveBack = () => {
        if (index > 0) {
          e.preventDefault()
          inputRefs.current[index - 1]?.focus()
          const newValueArr = currentValue.split('')
          newValueArr[index - 1] = ''
          const newValue = newValueArr.join('').trimEnd()
          updateValue(newValue)
        }
      }
      const clearCurrent = () => {
        const newValueArr = currentValue.split('')
        newValueArr[index] = ''
        const newValue = newValueArr.join('').trimEnd()
        updateValue(newValue)
      }

      switch (e.key) {
        case 'Backspace':
          if (e.currentTarget.value === '') {
            clearAndMoveBack()
          } else {
            clearCurrent()
          }
          break
        case 'Delete':
          clearCurrent()
          break
        case 'ArrowLeft':
          if (index > 0) {
            e.preventDefault()
            inputRefs.current[index - 1]?.focus()
          }
          break
        case 'ArrowRight':
          if (index < codeLength - 1) {
            e.preventDefault()
            inputRefs.current[index + 1]?.focus()
          }
          break
        case 'Enter':
          if (
            index === codeLength - 1 &&
            currentValue.length >= codeLength &&
            onVerify
          ) {
            e.preventDefault()
            void onVerify()
          }
          break
        default:
          if (/^\d$/.test(e.key)) {
            e.preventDefault()
            const newValueArr = currentValue.padEnd(codeLength, '').split('')
            newValueArr[index] = e.key
            const newValue = newValueArr.join('').trimEnd()
            updateValue(newValue)
            if (index < codeLength - 1) inputRefs.current[index + 1]?.focus()
          }
      }
    },
    [currentValue, codeLength, updateValue, onVerify]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData('text') || ''
      const digits = pastedData.replace(/\D/g, '').slice(0, codeLength - index)
      if (digits) {
        const newValueArr = currentValue.padEnd(codeLength, '').split('')
        for (let i = 0; i < digits.length; i++)
          if (index + i < codeLength) newValueArr[index + i] = digits.charAt(i)
        const newValue = newValueArr.join('').trimEnd()
        updateValue(newValue)
        const focusIndex = Math.min(index + digits.length, codeLength - 1)
        inputRefs.current[focusIndex || 0]?.focus()
      }
    },
    [currentValue, codeLength, updateValue]
  )

  const digits = currentValue.padEnd(codeLength, '').split('')
  const allFieldsFilled = currentValue.length >= codeLength

  // Tier-1 root data attributes shared by both render branches. `data-filled`
  // reflects any entered digits; `data-error` surfaces the engine error when
  // bound (the component renders no error UI of its own, per the contract).
  const resolvedFieldName = dataFieldName ?? name
  const hasValue = currentValue.length > 0
  const engineError =
    formContext && name ? formContext.engine.getError(name) : undefined
  // Screen-reader invalid state: honour the caller's explicit `aria-invalid`,
  // otherwise fall back to the form-engine error so a bound field's validation
  // failure is programmatically exposed on every digit cell (WCAG 4.1.2). A
  // caller passing `false` is preserved (?? keeps false).
  const resolvedAriaInvalid = ariaInvalid ?? (engineError ? true : undefined)
  const rootDataProps = {
    'data-component': 'ConfirmationCodeInput',
    ...(resolvedFieldName && { 'data-field-name': resolvedFieldName }),
    'data-filled': hasValue ? 'true' : undefined,
    ...(engineError && { 'data-error': 'true' }),
  }

  if (showSuccessState) {
    // Render the success message at the consumer-controlled heading level
    // (default h3). Capitalised tag name so JSX treats it as an element type.
    const SuccessHeading = `h${successMessageHeadingLevel}` as
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
    return (
      // role="status" (an aria-live region) so the transition into the success
      // state is announced to screen-reader users, whose focus was on the now-
      // unmounted Verify button — otherwise the confirmation is silent (4.1.3).
      <div
        className={cssStyles.successContainer}
        data-theme={theme}
        role="status"
        {...rootDataProps}
      >
        {/* CheckCircleOutline applies its own inline style to the <svg>, which
            beats a className. Source the three theme-driven properties from
            CSS custom properties (defined on .successContainer[data-theme])
            so the values still live in CSS as a single source of truth. The
            icon is decorative — the heading already conveys success — so it is
            hidden from assistive tech (WCAG 1.1.1). */}
        <CheckCircleOutline
          aria-hidden="true"
          focusable="false"
          style={{
            fontSize: 'var(--cci-success-icon-size)',
            color: 'var(--cci-success-icon-color)',
            filter: 'var(--cci-success-icon-filter)',
          }}
        />
        <SuccessHeading className={cssStyles.successMessage}>
          {successMessage}
        </SuccessHeading>
        <div className={cssStyles.buttonContainer}>
          <CustomButton
            text="Disable Verification"
            styles={{
              theme: styles?.theme || 'light',
              width: '100%',
              height: '40px',
            }}
            {...disableVerificationButtonProps}
            onClick={() => {
              void onDisableVerification()
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cssStyles.root}
      data-theme={theme}
      {...(isDisabled && { 'data-disabled': 'true' })}
      {...rootDataProps}
      style={containerOverrideStyle}
      role="group"
      aria-label={ariaLabel || 'Confirmation Code'}
    >
      {isSacredTheme && <SacredGlyphs />}
      <div className={cssStyles.mainContent}>
        <div className={cssStyles.inputsRow}>
          <div className={cssStyles.inputGroup}>
            {Array.from({ length: codeLength }).map((_, index) => (
              <input
                key={index}
                ref={el => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                // `one-time-code` lets the platform offer SMS/authenticator
                // autofill on the first cell (the multi-char value is then
                // distributed across the cells by handleInputChange); the
                // remaining cells opt out so browsers don't surface unrelated
                // autofill suggestions on each box.
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                value={digits[index] || ''}
                onChange={e => handleInputChange(e, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                onPaste={e => handlePaste(e, index)}
                onBlur={() => boundOnBlur?.()}
                aria-label={`${ariaLabel || 'Confirmation Code'} digit ${index + 1} of ${codeLength}`}
                aria-required={ariaRequired}
                aria-invalid={resolvedAriaInvalid}
                disabled={isDisabled}
                className={cssStyles.input}
              />
            ))}
          </div>
          {/* The coloured dot is a live region. An empty element whose only
              state cue is a swapped aria-label does NOT re-announce on change,
              so the actual state text is rendered as visually-hidden CONTENT —
              a content mutation the role="status" region announces (4.1.3).
              The dot itself also shows a checkmark glyph when valid so the
              valid/invalid distinction is not carried by colour alone (1.4.1). */}
          <div
            className={cssStyles.statusIndicator}
            data-valid={isValid ? 'true' : 'false'}
            role="status"
            aria-label={isValid ? 'Code is valid' : 'Code is invalid'}
          >
            <span className={cssStyles.statusText}>
              {isValid ? 'Code is valid' : 'Code is invalid'}
            </span>
          </div>
        </div>
        {showActionButtons && (
          <div className={cssStyles.buttonContainer}>
            {showSendResendButton && (
              <CustomButton
                text={codeSent ? 'Resend Code' : 'Send Code'}
                styles={{
                  theme: styles?.theme || 'light',
                  width: '180px',
                  height: '44px',
                }}
                {...sendResendButtonProps}
                onClick={() => onSendResend && void onSendResend()}
              />
            )}
            <CustomButton
              text="Verify"
              styles={{
                theme: styles?.theme || 'light',
                width: '180px',
                height: '44px',
              }}
              {...verifyButtonProps}
              onClick={() => onVerify && void onVerify()}
              disabled={!allFieldsFilled}
            />
          </div>
        )}
      </div>
      {isSacredTheme && <SacredBottomDecorations />}
    </div>
  )
}

export default ConfirmationCodeInputs
