'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import ReactDOM from 'react-dom'
import cssStyles from './SearchableSimple.module.css'
import FieldShell, {
  type FieldStyleOverrides,
  useEscape,
  useArrowKeyNav,
} from '../../Shell'

export interface DropdownOption {
  value: string | number
  _id?: string
}

export interface SearchableSimpleProps {
  label: string
  options: DropdownOption[]
  /** Controlled value. Pair with `onChange` for fully-controlled mode. */
  value?: string | number
  /** Uncontrolled initial value. Ignored when `value` is provided. */
  defaultValue?: string | number
  /**
   * Canonical onChange shape — receives the full option object (or
   * null when cleared). Object payload is preserved here because the
   * value is structural (`{ value, _id }`), not a primitive.
   */
  onChange?: (value: DropdownOption | null) => void
  placeholder?: string
  helperText?: string
  /** Error message rendered below the trigger; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  styles?: FieldStyleOverrides
}

const SearchableSimple: React.FC<SearchableSimpleProps> = ({
  label,
  options,
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = 'Select...',
  helperText,
  error,
  dataField,
  dataFieldName,
  styles,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [internalValue, setInternalValue] = useState<string | number>(
    defaultValue ?? ''
  )
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  })

  const disabled = styles?.disabled || false
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : internalValue

  const filteredOptions = useMemo(() => {
    const filtered = searchTerm
      ? options.filter(option =>
          String(option.value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options
    // Limit to first 100 results for performance with very large lists.
    return filtered.slice(0, 100)
  }, [searchTerm, options])

  // No sync effect needed — `value` is computed from props (when
  // controlled) or from internal state (when uncontrolled). Mode
  // swaps are rare enough that the initial `defaultValue` is the
  // documented contract.

  // Position the portalled menu under the trigger button each time
  // it opens. Re-runs on every open because the trigger may have
  // scrolled within its viewport since last render.
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      })
      // Reset highlight when opening so arrow keys start at the top.
      setActiveIndex(-1)
    }
  }, [isOpen])

  // Click-outside + scroll dismissal. Scroll listener uses capture
  // phase so it catches scroll on any ancestor (including window).
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const insideTrigger =
        buttonRef.current && buttonRef.current.contains(target)
      const insideMenu = menuRef.current && menuRef.current.contains(target)
      if (!insideTrigger && !insideMenu) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    const handleScroll = (event: Event) => {
      // Don't close if scrolling inside the dropdown menu itself —
      // long lists need to scroll without closing.
      if (menuRef.current && menuRef.current.contains(event.target as Node)) {
        return
      }
      setIsOpen(false)
      setSearchTerm('')
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  // Escape closes the popover when focus is anywhere in this
  // component's subtree (trigger button or the search input inside
  // the portalled menu).
  useEscape(isOpen, () => {
    setIsOpen(false)
    setSearchTerm('')
    buttonRef.current?.focus()
  })

  const handleSelect = (option: DropdownOption) => {
    if (!isControlled) setInternalValue(option.value)
    onChange?.(option)
    setIsOpen(false)
    setSearchTerm('')
    buttonRef.current?.focus()
  }

  // Arrow-key nav handler attached to the trigger button so users
  // can navigate options without leaving the trigger (the WAI-ARIA
  // combobox 1.2 pattern).
  const handleKeyDown = useArrowKeyNav({
    count: filteredOptions.length,
    activeIndex,
    onActiveIndexChange: setActiveIndex,
    onActivate: index => {
      const option = filteredOptions[index]
      if (option) handleSelect(option)
    },
  })

  const selectedOption = options.find(
    opt =>
      String(opt.value) === String(value) || String(opt._id) === String(value)
  )
  const displayValue = selectedOption?.value || value || placeholder
  const hasValue = Boolean(selectedOption || value)

  const buttonClassNames = [cssStyles.button, isOpen && cssStyles.open]
    .filter(Boolean)
    .join(' ')
  const arrowClassNames = [cssStyles.arrow, isOpen && cssStyles.open]
    .filter(Boolean)
    .join(' ')

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
      styles={styles}
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
              aria-label={!hasValue ? label : undefined}
              data-action={isOpen ? 'close' : 'open'}
              data-subject={dataField}
              className={buttonClassNames}
              onClick={() => !disabled && setIsOpen(!isOpen)}
              onKeyDown={event => {
                // Open on Down/Up if currently closed (combobox 1.2)
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

            {isOpen &&
              !disabled &&
              typeof document !== 'undefined' &&
              ReactDOM.createPortal(
                <div
                  ref={menuRef}
                  id={listboxId}
                  role="listbox"
                  aria-labelledby={inputId}
                  data-popover="searchable-simple"
                  data-subject={dataField}
                  className={cssStyles.menu}
                  data-theme={styles?.theme || 'sacred'}
                  style={{
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`,
                    width: `${dropdownPosition.width}px`,
                  }}
                >
                  <div className={cssStyles.searchContainer}>
                    <input
                      type="text"
                      className={cssStyles.searchInput}
                      placeholder="Search..."
                      value={searchTerm}
                      aria-label={`Search ${label}`}
                      onChange={e => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                    />
                  </div>

                  <div>
                    {filteredOptions.length === 0 ? (
                      <div
                        className={cssStyles.emptyState}
                        role="status"
                        aria-live="polite"
                      >
                        No options found
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
                </div>,
                document.body
              )}
          </>
        )
      }}
    </FieldShell>
  )
}

export default SearchableSimple
