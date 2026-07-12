'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import cssStyles from './Dropdown.module.css'
import FieldShell, {
  type FieldStyleOverrides,
  useEscape,
  useArrowKeyNav,
  useTypeahead,
} from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'

export interface DropdownOption {
  value: string | number
  icon?: React.ReactNode
  _id?: string
}

export interface DropdownProps {
  label: string
  /**
   * Accessible name for the `button[role="combobox"]` trigger. Emitted as
   * `aria-label`, falling back to the visible `label` when unset
   * (`aria-label={ariaLabel ?? label}`). Lets a label-less Dropdown (e.g.
   * TransferList's category selector, rendered with `label=""`) expose an
   * accessible name to assistive tech (WCAG 4.1.2). Additive — omitting it
   * preserves the previous `aria-label={label}` behaviour byte-for-byte.
   */
  ariaLabel?: string
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
  /**
   * Entity field key. Emitted as `data-field-name` (unless `dataFieldName`
   * is set explicitly) so a single `name="<entityFieldKey>"` gives the stable
   * test anchor the recommender targets via `[data-field-name="<key>"]`.
   */
  name?: string
  styles?: FieldStyleOverrides & { fullWidth?: boolean }
}

/**
 * Accessible single-select dropdown built on FieldShell, with a combobox
 * trigger, an absolutely-positioned listbox menu, and full keyboard navigation.
 * Auto-binds its value by `name` inside a goobs `<Form>` and emits the stable
 * `[role=combobox]`/`[role=option]` structure tests target.
 */
const Dropdown: React.FC<DropdownProps> = ({
  label,
  ariaLabel,
  options,
  defaultValue,
  onChange: onChangeProp,
  onBlur,
  onFocus,
  value: externalValueProp,
  showIdColumns = false,
  helperText,
  error,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  // Tier-1 form binding. When this Dropdown is rendered inside a <Form>
  // with a `name` and no explicit `value`, the binding takes over: `value`
  // comes from the form engine and `onChange` writes back to it (chaining
  // any original onChange). Outside a form, or with an explicit value, the
  // binding is a pass-through and behaves byte-for-byte as before.
  // `boundOnBlur` marks the field touched; it's chained into the button's
  // focus-event onBlur below (which keeps its own FocusEventHandler shape).
  // The canonical Dropdown onChange emits a string, so the original handler
  // is forwarded through a string-narrowing wrapper to satisfy the binding's
  // `(next: string | number) => void` contract.
  const {
    value: externalValue,
    onChange,
    onBlur: boundOnBlur,
  } = useFieldBinding<string | number>({
    name,
    value: externalValueProp,
    onChange: onChangeProp
      ? (next: string | number): void => onChangeProp(String(next))
      : undefined,
  })

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

  // Click-outside closes. The menu is absolutely positioned (it scrolls WITH the
  // field), so there is no detach to guard against — scrolling no longer closes
  // the menu, which keeps it interactable for keyboard users, assistive tech,
  // and automated tests that scroll an option into view.
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const insideTrigger =
        buttonRef.current && buttonRef.current.contains(target)
      const insideMenu = menuRef.current && menuRef.current.contains(target)
      if (!insideTrigger && !insideMenu) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
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

  // APG select-only combobox type-ahead: while the menu is open, typing a
  // printable character roves the highlight to the next option whose (rendered)
  // value starts with it. This filter-less Regular dropdown has no search input,
  // so this is its only jump-to-option affordance. The labels match the visible
  // option text (`String(option.value)`), index-aligned with the rendered list.
  const typeaheadLabels = useMemo(
    () => filteredOptions.map(option => String(option.value)),
    [filteredOptions]
  )
  const handleTypeahead = useTypeahead({
    labels: typeaheadLabels,
    activeIndex,
    onMatch: setActiveIndex,
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
      dataFieldName={dataFieldName ?? name}
      name={name}
      filled={value !== undefined && value !== null && value !== ''}
      styles={styleOverridesForShell}
    >
      {({ inputId, inputAriaProps }) => {
        const listboxId = `${inputId}-listbox`
        // Stable per-option DOM ids so the combobox can point
        // aria-activedescendant at the arrow-key-highlighted option — the
        // WAI-ARIA combobox model where focus stays on the trigger and the
        // active option is exposed to assistive tech via its id (WCAG 4.1.2 /
        // 2.1.1). Mirrors the SearchableHistory implementation.
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
              aria-activedescendant={activeOptionId}
              aria-label={ariaLabel ?? label}
              data-action={isOpen ? 'close' : 'open'}
              data-subject={dataField}
              className={buttonClassNames}
              onClick={() => !disabled && setIsOpen(!isOpen)}
              onBlur={event => {
                onBlur?.(event)
                boundOnBlur?.()
              }}
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
                if (isOpen) {
                  // Arrow-nav first: it preventDefaults every key it consumes,
                  // and useTypeahead early-returns on defaultPrevented, so the
                  // two never fight over the same key.
                  handleKeyDown(event)
                  handleTypeahead(event)
                }
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
            )}
          </>
        )
      }}
    </FieldShell>
  )
}

export default Dropdown
