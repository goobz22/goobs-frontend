'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import ReactDOM from 'react-dom'
import cssStyles from './SearchableSimple.module.css'
import FieldShell, {
  type FieldStyleOverrides,
  useEscape,
  useArrowKeyNav,
} from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'

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
  /** HTML-style field name. Alias for dataFieldName so the test contract can target the field by either; data-field-name is emitted from dataFieldName ?? name. */
  name?: string
  styles?: FieldStyleOverrides
}

const SearchableSimple: React.FC<SearchableSimpleProps> = ({
  label,
  options,
  value: valuePropRaw,
  defaultValue,
  onChange: onChangeProp,
  placeholder = 'Select...',
  helperText,
  error,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  // Tier-1 form binding. This field reads an id (`string | number`) via its
  // `value` prop but emits the full option object via `onChange`. The binding
  // hook carries a single type `T`, so we bind on the *id* channel
  // (`string | number | null`) with an identity adapter — that is the value
  // the store should hold and the value the `value` prop consumes. The
  // option-shaped original `onChange` is preserved and still fired from
  // `handleSelect` below, and the resolved id (`option._id ?? option.value`)
  // — exactly the value the spec's `payloadToStore` produces — is what the
  // bound id-writer persists to the engine. Outside a <Form> (or with an
  // explicit `value`), the binding is a pass-through: `valuePropRaw` flows
  // through unchanged and behavior is byte-for-byte as before.
  const {
    value: valueProp,
    onChange: bindingWriteId,
    onBlur: boundOnBlur,
  } = useFieldBinding<string | number | null>({
    name,
    value: valuePropRaw,
    adapter: {
      payloadToStore: (storedId: string | number | null): unknown => storedId,
      valueFromStore: (stored: unknown): string | number | null =>
        stored == null ? null : (stored as string | number),
    },
  })

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [internalValue, setInternalValue] = useState<string | number>(
    defaultValue ?? ''
  )
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 300,
  })

  const disabled = styles?.disabled || false
  // When bound, the hook always returns a defined value (the engine's stored
  // id, or `null` when empty), so `!== undefined` keeps the engine in control
  // even when the field is empty. Unbound back-compat is unchanged.
  const isControlled = valueProp !== undefined
  const value = isControlled ? (valueProp ?? '') : internalValue

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

  // Position the portalled menu anchored to the trigger. Anchoring the menu to
  // the trigger — recomputed on open AND on scroll/resize, rather than closing
  // on any scroll — is what keeps it interactable for keyboard users, assistive
  // tech, and automated tests that must scroll an option into view.
  const computeMenuPosition = React.useCallback(() => {
    const trigger = buttonRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const GAP = 4
    const spaceBelow = window.innerHeight - rect.bottom - GAP
    // Clamp the menu height to the room below the trigger so a fixed-position
    // menu never spills past the viewport edge (it scrolls internally beyond
    // that); the floor keeps it usable when the field sits low on screen.
    const maxHeight = Math.max(160, Math.min(300, spaceBelow))
    setDropdownPosition({
      top: rect.bottom + GAP,
      left: rect.left,
      width: rect.width,
      maxHeight,
    })
  }, [])

  const closeMenu = React.useCallback(() => {
    setIsOpen(false)
    setSearchTerm('')
  }, [])

  // Open from the trigger's event handlers (not an effect) so the open-time
  // setup runs exactly once per open, on every open path (pointer + keyboard).
  const openMenu = React.useCallback(() => {
    setIsOpen(true)
    // Reset highlight so arrow keys start at the top.
    setActiveIndex(-1)
    computeMenuPosition()
    // Focus the search input WITHOUT scrolling the page. A page scroll here
    // (when the field is low in the viewport) is exactly what used to dismiss
    // the freshly-opened menu.
    requestAnimationFrame(() =>
      searchInputRef.current?.focus({ preventScroll: true })
    )
  }, [computeMenuPosition])

  // Click-outside closes. Scroll/resize REPOSITIONS the anchored menu instead of
  // dismissing it, so scrolling an option into view — by a user, assistive tech,
  // or an automated test — keeps the menu open; it closes only when the trigger
  // scrolls fully out of view. Capture phase catches scroll on any ancestor.
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const insideTrigger =
        buttonRef.current && buttonRef.current.contains(target)
      const insideMenu = menuRef.current && menuRef.current.contains(target)
      if (!insideTrigger && !insideMenu) {
        closeMenu()
      }
    }

    const handleReposition = (event: Event) => {
      // Scrolling inside the menu itself just moves the option list — leave the
      // menu anchored where it is.
      if (
        event.type === 'scroll' &&
        menuRef.current &&
        menuRef.current.contains(event.target as Node)
      ) {
        return
      }
      const rect = buttonRef.current?.getBoundingClientRect()
      // Close only once the trigger has scrolled entirely out of the viewport.
      if (rect && (rect.bottom < 0 || rect.top > window.innerHeight)) {
        closeMenu()
        return
      }
      computeMenuPosition()
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [isOpen, computeMenuPosition, closeMenu])

  // Escape closes the popover when focus is anywhere in this
  // component's subtree (trigger button or the search input inside
  // the portalled menu).
  useEscape(isOpen, () => {
    closeMenu()
    buttonRef.current?.focus()
  })

  const handleSelect = (option: DropdownOption) => {
    if (!isControlled) setInternalValue(option.value)
    // Preserve the original option-shaped onChange contract.
    onChangeProp?.(option)
    // Persist the resolved id to the form engine when bound (no-op otherwise).
    // `option._id ?? option.value` is exactly what the spec's payloadToStore
    // resolves to.
    bindingWriteId?.(option._id ?? option.value)
    closeMenu()
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
      dataFieldName={dataFieldName ?? name}
      name={name}
      filled={hasValue}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => {
        const listboxId = `${inputId}-listbox`
        // Stable per-option DOM ids so the (focused) search input can point
        // aria-activedescendant at the arrow-key-highlighted option, exposing
        // the roving highlight to assistive tech (WCAG 4.1.2 / 2.1.1).
        const optionDomId = (index: number): string =>
          `${listboxId}-option-${index}`
        const activeOptionId =
          activeIndex >= 0 && filteredOptions[activeIndex]
            ? optionDomId(activeIndex)
            : undefined
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
              onClick={() => {
                if (disabled) return
                if (isOpen) closeMenu()
                else openMenu()
              }}
              onBlur={() => boundOnBlur?.()}
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
                  openMenu()
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
                    maxHeight: `${dropdownPosition.maxHeight}px`,
                  }}
                >
                  <div className={cssStyles.searchContainer}>
                    <input
                      ref={searchInputRef}
                      type="text"
                      className={cssStyles.searchInput}
                      placeholder="Search..."
                      value={searchTerm}
                      aria-label={`Search ${label}`}
                      // The search input holds DOM focus while the menu is open,
                      // so it — not the trigger — owns the roving-highlight ARIA:
                      // aria-controls links it to the listbox and
                      // aria-activedescendant names the active option.
                      aria-controls={listboxId}
                      aria-activedescendant={activeOptionId}
                      onChange={e => {
                        setSearchTerm(e.target.value)
                        // A new filter changes the option list — drop the stale
                        // highlight so aria-activedescendant never dangles.
                        setActiveIndex(-1)
                      }}
                      onKeyDown={handleKeyDown}
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
                            id={optionDomId(index)}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            {...(isActive && { 'data-active': 'true' })}
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
