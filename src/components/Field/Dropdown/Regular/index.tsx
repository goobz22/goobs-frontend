'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import cssStyles from './Dropdown.module.css'
import FieldShell, {
  type FieldStyleOverrides,
  useEscape,
  useArrowKeyNav,
} from '../../Shell'

export interface DropdownOption {
  value: string | number
  icon?: React.ReactNode
  _id?: string
}

export interface DropdownProps {
  label: string
  options: DropdownOption[]
  defaultValue?: string | number
  /**
   * Canonical primitive-value onChange. Receives the resolved
   * selection value — `option._id` when present, otherwise
   * `option.value` — as a string. This collapses the previous
   * synthetic `ChangeEvent<HTMLSelectElement>` into the value-only
   * shape used by every other Field. Consumers that previously
   * destructured `e.target.value` simply use `value` directly.
   */
  onChange?: (value: string) => void
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
  onFocus?: React.FocusEventHandler<HTMLButtonElement>
  value?: string | number
  showIdColumns?: boolean
  helperText?: string
  /** Error message rendered below the trigger; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  styles?: FieldStyleOverrides & { fullWidth?: boolean }
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
  error,
  dataField,
  dataFieldName,
  styles,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const isControlled = externalValue !== undefined
  const [internalValue, setInternalValue] = useState<string | number>(
    defaultValue ?? ''
  )
  const value = isControlled ? externalValue : internalValue
  const disabled = styles?.disabled || false

  // No sync effect needed — `value` is computed from props (when
  // controlled) or from internal state (when uncontrolled). A
  // controlled→uncontrolled swap is a re-mount-class change and the
  // initial `defaultValue` covers it.

  const filteredOptions = useMemo(() => {
    if (showIdColumns) return options
    return options.filter(opt => {
      const val = String(opt.value).toLowerCase()
      return !(val === 'id' || val === '_id' || /^[0-9a-f]{24}$/.test(val))
    })
  }, [options, showIdColumns])

  // Reset highlight when transitioning open. Tracked via a previous
  // value compared at render time so the reset doesn't run inside an
  // effect (avoids the react-hooks/set-state-in-effect warning).
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) setActiveIndex(-1)
  }

  // Click-outside + scroll dismissal — same pattern as SearchableSimple.
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const insideTrigger =
        buttonRef.current && buttonRef.current.contains(target)
      const insideMenu = menuRef.current && menuRef.current.contains(target)
      if (!insideTrigger && !insideMenu) setIsOpen(false)
    }
    const handleScroll = (event: Event) => {
      if (menuRef.current && menuRef.current.contains(event.target as Node)) {
        return
      }
      setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  useEscape(isOpen, () => {
    setIsOpen(false)
    buttonRef.current?.focus()
  })

  const handleSelect = (option: DropdownOption) => {
    // Form-binding convention: prefer `_id` when present, otherwise
    // emit the option's own `value`. Both are coerced to string so
    // the canonical onChange shape stays primitive.
    const selected =
      option._id != null && option._id !== ''
        ? String(option._id)
        : String(option.value)
    if (!isControlled) setInternalValue(option.value)
    setIsOpen(false)
    onChange?.(selected)
    buttonRef.current?.focus()
  }

  const handleKeyDown = useArrowKeyNav({
    count: filteredOptions.length,
    activeIndex,
    onActiveIndexChange: setActiveIndex,
    onActivate: index => {
      const option = filteredOptions[index]
      if (option) handleSelect(option)
    },
  })

  const selectedOption = filteredOptions.find(
    opt =>
      String(opt.value) === String(value) || String(opt._id) === String(value)
  )
  const displayValue = selectedOption?.value || value || 'Select...'

  const buttonClassNames = [cssStyles.button, isOpen && cssStyles.open]
    .filter(Boolean)
    .join(' ')
  const arrowClassNames = [cssStyles.arrow, isOpen && cssStyles.open]
    .filter(Boolean)
    .join(' ')

  const fullWidth = styles?.fullWidth
  const styleOverridesForShell: FieldStyleOverrides | undefined =
    fullWidth || styles
      ? { ...styles, ...(fullWidth ? { width: '100%' } : {}) }
      : undefined

  return (
    <FieldShell
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={styles?.required}
      state={isOpen ? 'open' : undefined}
      dataField={dataField}
      dataFieldName={dataFieldName}
      styles={styleOverridesForShell}
    >
      {({ inputId, inputAriaProps }) => {
        const listboxId = `${inputId}-listbox`
        return (
          <>
            <button
              ref={buttonRef}
              id={inputId}
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-controls={listboxId}
              aria-label={label}
              data-action={isOpen ? 'close' : 'open'}
              data-subject={dataField}
              className={buttonClassNames}
              onClick={() => !disabled && setIsOpen(!isOpen)}
              onBlur={onBlur}
              onFocus={onFocus}
              onKeyDown={event => {
                if (
                  !isOpen &&
                  (event.key === 'ArrowDown' ||
                    event.key === 'ArrowUp' ||
                    event.key === 'Enter' ||
                    event.key === ' ')
                ) {
                  event.preventDefault()
                  setIsOpen(true)
                  return
                }
                if (isOpen) handleKeyDown(event)
              }}
              disabled={disabled}
              {...inputAriaProps}
            >
              <span>{displayValue}</span>
              <span aria-hidden="true" className={arrowClassNames} />
            </button>

            {isOpen && !disabled && (
              <div
                ref={menuRef}
                id={listboxId}
                role="listbox"
                aria-labelledby={inputId}
                data-popover="dropdown"
                data-subject={dataField}
                className={cssStyles.menu}
                data-theme={styles?.theme || 'sacred'}
              >
                {filteredOptions.length === 0 ? (
                  <div
                    className={cssStyles.emptyState}
                    role="status"
                    aria-live="polite"
                  >
                    No options available
                  </div>
                ) : (
                  filteredOptions.map((option, index) => {
                    const isSelected =
                      String(option.value) === String(value) ||
                      String(option._id) === String(value)
                    const isActive = index === activeIndex
                    const optionClassNames = [
                      cssStyles.option,
                      isSelected && cssStyles.selected,
                      isActive && cssStyles.active,
                    ]
                      .filter(Boolean)
                      .join(' ')
                    return (
                      <button
                        key={`${option._id ?? ''}-${option.value}-${index}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        data-value={option.value}
                        data-option-id={option._id}
                        className={optionClassNames}
                        onClick={() => handleSelect(option)}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        {String(option.value)}
                      </button>
                    )
                  })
                )}
              </div>
            )}
          </>
        )
      }}
    </FieldShell>
  )
}

export default Dropdown
