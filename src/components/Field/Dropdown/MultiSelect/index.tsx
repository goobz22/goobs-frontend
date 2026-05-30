'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Chip from '../../../Chip'
import cssStyles from './MultiSelect.module.css'
import FieldShell, {
  type FieldStyleOverrides,
  useEscape,
  useArrowKeyNav,
} from '../../Shell'

export interface SelectOption {
  value: string
  _id?: string
}

export interface MultiSelectChipProps {
  label?: React.ReactNode
  options?: SelectOption[]
  /**
   * Controlled list of selected ids (or values when no `_id` is set).
   * Pair with `onChange` for fully-controlled mode.
   */
  value?: string[]
  /** Uncontrolled initial selection. Ignored when `value` is provided. */
  defaultSelected?: string[]
  onChange?: (values: string[]) => void
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void
  helperText?: string
  /** Error message rendered below the trigger; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /**
   * Entity field key. Emitted as `data-field-name` (unless `dataFieldName`
   * is set explicitly) so a single `name="<entityFieldKey>"` gives the stable
   * test anchor the recommender targets via `[data-field-name="<key>"]`.
   */
  name?: string
  styles?: FieldStyleOverrides & {
    arrowRight?: string
    arrowTop?: string
    arrowPadding?: string
    arrowBottom?: string
  }
}

const MultiSelectChip: React.FC<MultiSelectChipProps> = ({
  label = '',
  options = [],
  value: valueProp,
  defaultSelected = [],
  onChange,
  onFocus,
  helperText,
  error,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  const isControlled = valueProp !== undefined
  const [internalSelected, setInternalSelected] =
    useState<string[]>(defaultSelected)
  const selectedValues = isControlled ? valueProp : internalSelected
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  })

  const disabled = styles?.disabled || false

  // No sync effect needed — `selectedValues` reads directly from
  // `valueProp` when controlled, otherwise from `internalSelected`.
  // Initial `defaultSelected` covers the uncontrolled case.

  // Position the portalled menu under the trigger every time it opens.
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      })
      setActiveIndex(-1)
    }
  }, [isOpen])

  // Click-outside + scroll dismissal.
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const insideTrigger =
        containerRef.current && containerRef.current.contains(target)
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
    triggerRef.current?.focus()
  })

  const handleToggle = useCallback(
    (val: string) => {
      if (disabled) return
      const next = selectedValues.includes(val)
        ? selectedValues.filter(v => v !== val)
        : [...selectedValues, val]
      if (!isControlled) setInternalSelected(next)
      onChange?.(next)
    },
    [selectedValues, onChange, disabled, isControlled]
  )

  const handleKeyDown = useArrowKeyNav({
    count: options.length,
    activeIndex,
    onActiveIndexChange: setActiveIndex,
    onActivate: index => {
      const option = options[index]
      if (option) handleToggle(option._id || option.value)
    },
  })

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (
      !isOpen &&
      (event.key === 'Enter' ||
        event.key === ' ' ||
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp')
    ) {
      event.preventDefault()
      setIsOpen(true)
      return
    }
    if (isOpen) handleKeyDown(event)
  }

  const arrowClassNames = [cssStyles.arrow, isOpen && cssStyles.open]
    .filter(Boolean)
    .join(' ')

  const iconWrapperStyleOverrides: React.CSSProperties = {}
  if (styles?.arrowTop) {
    iconWrapperStyleOverrides.top = styles.arrowTop
    iconWrapperStyleOverrides.transform = 'none'
  }
  if (styles?.arrowRight) iconWrapperStyleOverrides.right = styles.arrowRight
  if (styles?.arrowBottom) iconWrapperStyleOverrides.bottom = styles.arrowBottom
  if (styles?.arrowPadding)
    iconWrapperStyleOverrides.padding = styles.arrowPadding

  return (
    <FieldShell
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={styles?.required}
      state={isOpen ? 'open' : undefined}
      dataField={dataField}
      dataFieldName={dataFieldName ?? name}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => {
        const listboxId = `${inputId}-listbox`
        return (
          <div className={cssStyles.wrapper} ref={containerRef}>
            <div
              ref={triggerRef}
              id={inputId}
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-controls={listboxId}
              aria-label={label === '' ? undefined : (label as string)}
              data-action={isOpen ? 'close' : 'open'}
              data-subject={dataField}
              tabIndex={disabled ? -1 : 0}
              className={cssStyles.chipContainer}
              onClick={() => !disabled && setIsOpen(!isOpen)}
              onFocus={onFocus}
              onKeyDown={handleTriggerKeyDown}
              {...inputAriaProps}
            >
              {selectedValues.length === 0 ? (
                <span className={cssStyles.placeholder}>Select items...</span>
              ) : (
                selectedValues.map(selectedValue => {
                  const option =
                    options.find(opt => opt._id === selectedValue) ||
                    options.find(opt => opt.value === selectedValue)
                  const displayLabel = option ? option.value : selectedValue

                  return (
                    <Chip
                      key={selectedValue}
                      label={displayLabel}
                      {...(disabled
                        ? {}
                        : {
                            onDelete: () => handleToggle(selectedValue),
                          })}
                      styles={{
                        padding: '6px 12px',
                        height: 'auto',
                        fontSize: '14px',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                      }}
                    />
                  )
                })
              )}
            </div>
            <div
              aria-hidden="true"
              className={cssStyles.iconWrapper}
              style={
                Object.keys(iconWrapperStyleOverrides).length > 0
                  ? iconWrapperStyleOverrides
                  : undefined
              }
            >
              <div className={arrowClassNames} />
            </div>
            {isOpen &&
              typeof document !== 'undefined' &&
              ReactDOM.createPortal(
                <div
                  ref={menuRef}
                  id={listboxId}
                  role="listbox"
                  aria-multiselectable="true"
                  aria-labelledby={inputId}
                  data-popover="multi-select"
                  data-subject={dataField}
                  className={cssStyles.menu}
                  data-theme={styles?.theme || 'sacred'}
                  style={{
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`,
                    width: `${dropdownPosition.width}px`,
                  }}
                >
                  {options.map((option, index) => {
                    const optionId = option._id || option.value
                    const isSelected = selectedValues.includes(optionId)
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
                        key={optionId}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        data-value={optionId}
                        data-option-id={option._id}
                        className={optionClassNames}
                        onClick={() => handleToggle(optionId)}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          tabIndex={-1}
                          aria-hidden="true"
                        />
                        <span>{option.value}</span>
                      </button>
                    )
                  })}
                </div>,
                document.body
              )}
          </div>
        )
      }}
    </FieldShell>
  )
}

MultiSelectChip.displayName = 'MultiSelectChip'

export default MultiSelectChip
