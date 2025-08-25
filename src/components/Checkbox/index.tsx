/**
 * @fileoverview Defines the Checkbox component, a custom checkbox with theming.
 * It supports light, dark, and sacred themes with extensive customization options.
 */
'use client'

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
  useCallback,
} from 'react'
import type { ChangeEvent } from 'react'
import type { InputHTMLAttributes } from 'react'
import { getCheckboxStyles, SACRED_GLYPHS } from '../../theme'
import type { CheckboxStyles } from '../../theme'
import CheckIcon from '../Icons/Check'
import IndeterminateCheckBoxIcon from '../Icons/IndeterminateCheckBox'

// --------------------------------------------------------------------------
// STABLE ID GENERATOR
// --------------------------------------------------------------------------

let checkboxIdCounter = 0

const generateStableId = () => {
  return `checkbox-${++checkboxIdCounter}`
}

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'value' | 'defaultValue' | 'onChange' | 'onFocus' | 'onBlur'
  > {
  /** Whether the checkbox is checked */
  checked?: boolean
  /** Default checked state for uncontrolled mode */
  defaultChecked?: boolean
  /** Callback when checkbox state changes */
  onChange?: (checked: boolean) => void
  /** Callback when checkbox is focused */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Callback when checkbox loses focus */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Whether the checkbox is in indeterminate state */
  indeterminate?: boolean
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: CheckboxStyles
}

// --------------------------------------------------------------------------
// SACRED THEME COMPONENTS
// --------------------------------------------------------------------------

const SacredGlyphs: React.FC<{
  isHovered: boolean
}> = ({ isHovered }) => {
  const glyphStyles = useMemo(
    () => ({
      glyph: {
        position: 'absolute' as const,
        fontSize: '12px',
        color: 'rgba(255, 215, 0, 0.3)',
        transition: 'all 0.3s ease',
        pointerEvents: 'none' as const,
      },
      glyphLeft: {
        left: '-24px',
        top: '50%',
        transform: 'translateY(-50%)',
      },
      glyphRight: {
        right: '-24px',
        top: '50%',
        transform: 'translateY(-50%)',
      },
      glyphVisible: {
        opacity: 0.6,
      },
      glyphFloating: {
        animation: 'sacredFloat 3s ease-in-out infinite',
      },
      glyphDelayedFloating: {
        animation: 'sacredFloat 3s ease-in-out infinite 1.5s',
      },
    }),
    []
  )

  return (
    <>
      <span
        style={{
          ...glyphStyles.glyph,
          ...glyphStyles.glyphLeft,
          ...(isHovered && glyphStyles.glyphVisible),
          ...glyphStyles.glyphFloating,
        }}
      >
        {SACRED_GLYPHS[11]}
      </span>
      <span
        style={{
          ...glyphStyles.glyph,
          ...glyphStyles.glyphRight,
          ...(isHovered && glyphStyles.glyphVisible),
          ...glyphStyles.glyphDelayedFloating,
        }}
      >
        {SACRED_GLYPHS[15]}
      </span>
    </>
  )
}

const PremiumAccent: React.FC<{
  isChecked: boolean
  isIndeterminate: boolean
  outline: boolean
}> = ({ isChecked, isIndeterminate, outline }) => {
  const accentStyles = useMemo(
    () => ({
      accent: {
        position: 'absolute' as const,
        left: '-2px',
        top: '-2px',
        right: '-2px',
        bottom: '-2px',
        borderRadius: '6px',
        background:
          'linear-gradient(45deg, rgb(59, 130, 246), rgb(147, 197, 253))',
        opacity: 0.3,
        transition: 'opacity 0.3s ease',
        zIndex: -1,
      },
    }),
    []
  )

  if (!outline || (!isChecked && !isIndeterminate)) {
    return null
  }

  return <div style={accentStyles.accent} />
}

// --------------------------------------------------------------------------
// MAIN CHECKBOX COMPONENT
// --------------------------------------------------------------------------

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const {
    indeterminate,
    checked: controlledChecked,
    defaultChecked,
    onChange,
    onFocus,
    onBlur,
    styles,
    id: providedId,
    ...rest
  } = props

  const [stableId] = useState(() => providedId || generateStableId())
  const internalRef = useRef<HTMLInputElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // State management for controlled/uncontrolled component
  const [uncontrolledChecked, setUncontrolledChecked] = useState(
    defaultChecked || false
  )
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : uncontrolledChecked
  const isDisabled = !!(styles?.disabled || rest.disabled)
  const isSacredTheme = styles?.theme === 'sacred'

  const isChecked = checked
  const isIndeterminate = indeterminate && !isChecked

  const computedStyles = useMemo(
    () =>
      getCheckboxStyles(
        styles,
        isHovered,
        isChecked,
        isIndeterminate,
        isDisabled
      ),
    [styles, isHovered, isChecked, isIndeterminate, isDisabled]
  )

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(event)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event)
    },
    [onBlur]
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked

      if (!isControlled) {
        setUncontrolledChecked(newChecked)
      }

      onChange?.(newChecked)
    },
    [isControlled, onChange]
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  useImperativeHandle(ref, () => internalRef.current!)

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = indeterminate || false
    }
  }, [indeterminate])

  return (
    <label
      htmlFor={stableId}
      style={computedStyles.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isSacredTheme && <SacredGlyphs isHovered={isHovered} />}

      {!isSacredTheme && (
        <PremiumAccent
          isChecked={isChecked}
          isIndeterminate={!!isIndeterminate}
          outline={styles?.outline !== false}
        />
      )}

      <div style={computedStyles.container}>
        <input
          type="checkbox"
          id={stableId}
          ref={internalRef}
          style={computedStyles.input}
          aria-checked={indeterminate ? 'mixed' : undefined}
          disabled={isDisabled}
          checked={!!isChecked}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        <div style={computedStyles.box}></div>
        <div
          style={{
            ...computedStyles.icon,
            transform: indeterminate
              ? 'translateY(1px) translateX(2px)'
              : 'translateY(5px) translateX(3px)',
          }}
        >
          {indeterminate ? (
            <IndeterminateCheckBoxIcon
              styles={{
                theme: styles?.theme || 'sacred',
                size: styles?.theme === 'sacred' ? 20 : 18,
              }}
            />
          ) : (
            <CheckIcon
              styles={{
                theme: styles?.theme || 'sacred',
                size: styles?.theme === 'sacred' ? 20 : 18,
              }}
            />
          )}
        </div>
      </div>
    </label>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox
