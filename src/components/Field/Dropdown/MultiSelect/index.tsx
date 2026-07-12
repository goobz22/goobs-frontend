'use client'

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'
import Chip from '../../../Chip'
import cssStyles from './MultiSelect.module.css'
import FieldShell, {
  type FieldStyleOverrides,
  useEscape,
  useArrowKeyNav,
  useTypeahead,
} from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'

export interface SelectOption {
  value: string
  _id?: string
}

export interface MultiSelectChipProps {
  label?: React.ReactNode
  /**
   * Accessible name for the `role="combobox"` trigger when no visible `label`
   * renders (bare multi-selects in toolbars, filter bars, …). Forwarded to
   * FieldShell, which merges it into the trigger's spread `inputAriaProps` as
   * `aria-label` ONLY when no visible label is present — a visible `label` stays
   * the name source (WCAG 2.5.3 Label in Name). Additive; omitting it preserves
   * the previous behaviour byte-for-byte.
   */
  ariaLabel?: string
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
  ariaLabel,
  options = [],
  value: valuePropRaw,
  defaultSelected = [],
  onChange: onChangeProp,
  onFocus,
  helperText,
  error,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  // Tier-1 form binding. Value type is `string[]` (selected ids/values),
  // which matches both the `value` prop and the `onChange` payload exactly —
  // so no adapter is needed. When bound (inside a <Form> with a `name` and no
  // explicit `value`), `valueProp` is the engine's array and `onChange` writes
  // back to it; otherwise it's a pass-through and behaves byte-for-byte as
  // before. `boundOnBlur` marks the field touched on trigger blur.
  const {
    value: valueProp,
    onChange,
    onBlur: boundOnBlur,
  } = useFieldBinding<string[]>({
    name,
    value: valuePropRaw,
    onChange: onChangeProp,
  })

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
    maxHeight: 200,
  })

  const disabled = styles?.disabled || false

  // No sync effect needed — `selectedValues` reads directly from
  // `valueProp` when controlled, otherwise from `internalSelected`.
  // Initial `defaultSelected` covers the uncontrolled case.

  // Anchor the portalled menu to the trigger — recomputed on open and on
  // scroll/resize (rather than closing on any scroll) so it stays interactable
  // for keyboard users, assistive tech, and automated tests that scroll an
  // option into view.
  const computeMenuPosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const GAP = 4
    const spaceBelow = window.innerHeight - rect.bottom - GAP
    const maxHeight = Math.max(120, Math.min(200, spaceBelow))
    setDropdownPosition({
      top: rect.bottom + GAP,
      left: rect.left,
      width: rect.width,
      maxHeight,
    })
  }, [])

  const closeMenu = useCallback(() => setIsOpen(false), [])

  // Open from the event handlers (not an effect) so open-time setup runs once
  // per open on every path (pointer + keyboard).
  const openMenu = useCallback(() => {
    setIsOpen(true)
    setActiveIndex(-1)
    computeMenuPosition()
  }, [computeMenuPosition])

  // Click-outside closes; scroll/resize REPOSITIONS the anchored menu instead of
  // dismissing it (closing only when the trigger scrolls fully out of view), so
  // reaching an option by scroll keeps the menu open.
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const insideTrigger =
        containerRef.current && containerRef.current.contains(target)
      const insideMenu = menuRef.current && menuRef.current.contains(target)
      if (!insideTrigger && !insideMenu) closeMenu()
    }
    const handleReposition = (event: Event) => {
      if (
        event.type === 'scroll' &&
        menuRef.current &&
        menuRef.current.contains(event.target as Node)
      ) {
        return
      }
      const rect = triggerRef.current?.getBoundingClientRect()
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

  useEscape(isOpen, () => {
    closeMenu()
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

  // APG type-ahead: while the menu is open, typing a printable character roves
  // the highlight to the next option whose value starts with it. This chip
  // multi-select has no filter input, so this is its only jump-to-option
  // affordance; the labels match the visible option text, index-aligned with
  // the option list `useArrowKeyNav` roves over.
  const typeaheadLabels = useMemo(
    () => options.map(option => option.value),
    [options]
  )
  const handleTypeahead = useTypeahead({
    labels: typeaheadLabels,
    activeIndex,
    onMatch: setActiveIndex,
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
      openMenu()
      return
    }
    if (isOpen) {
      // Arrow-nav first: it preventDefaults every key it consumes, and
      // useTypeahead early-returns on defaultPrevented, so the two never fight
      // over the same key.
      handleKeyDown(event)
      handleTypeahead(event)
    }
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
      ariaLabel={ariaLabel}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={styles?.required}
      state={isOpen ? 'open' : undefined}
      dataField={dataField}
      dataFieldName={dataFieldName ?? name}
      name={name}
      filled={Boolean(selectedValues && selectedValues.length > 0)}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => {
        const listboxId = `${inputId}-listbox`
        // Stable per-option DOM ids so the combobox trigger can point
        // aria-activedescendant at the arrow-key-highlighted option, exposing
        // the roving highlight to assistive tech (WCAG 4.1.2 / 2.1.1).
        const optionDomId = (index: number): string =>
          `${listboxId}-option-${index}`
        const activeOptionId =
          activeIndex >= 0 && options[activeIndex]
            ? optionDomId(activeIndex)
            : undefined
        return (
          <div className={cssStyles.wrapper} ref={containerRef}>
            <div
              ref={triggerRef}
              id={inputId}
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-controls={listboxId}
              aria-activedescendant={activeOptionId}
              aria-label={label === '' ? undefined : (label as string)}
              data-action={isOpen ? 'close' : 'open'}
              data-subject={dataField}
              tabIndex={disabled ? -1 : 0}
              className={cssStyles.chipContainer}
              onClick={() => {
                if (disabled) return
                if (isOpen) closeMenu()
                else openMenu()
              }}
              onFocus={onFocus}
              onBlur={() => boundOnBlur?.()}
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
                        // Forward the field's theme so chips follow the
                        // light/dark palettes instead of always rendering
                        // the sacred default (gold text on translucent
                        // black — which composites to #999999 over a light
                        // trigger surface, a 2.03 contrast ratio).
                        ...(styles?.theme ? { theme: styles.theme } : {}),
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
                    maxHeight: `${dropdownPosition.maxHeight}px`,
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
                        id={optionDomId(index)}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        {...(isActive && { 'data-active': 'true' })}
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
