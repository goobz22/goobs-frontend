'use client'

import React, { useRef, useEffect } from 'react'
import cssStyles from './Search.module.css'
import FieldShell, { type FieldStyleOverrides } from '../Shell'
import { useFieldBinding } from '../Shell/useFieldBinding'

export interface SearchbarProps {
  label?: string
  /**
   * Accessible name for the search input when no visible `label` is
   * rendered. A `placeholder` is NOT an accessible name (WCAG 4.1.2), so a
   * label-less search field would otherwise be unnamed for screen-reader /
   * voice-control users. When `label` is set the input is named by the
   * `<label htmlFor>` association and this prop is ignored (to avoid
   * overriding the visible label). When `label` is omitted this value — or,
   * if unset, the `placeholder` string — becomes the input's `aria-label`.
   */
  ariaLabel?: string
  /** Placeholder text (default 'Search...'). */
  placeholder?: string
  /** Controlled query string; the input always mirrors this prop. */
  value: string
  /**
   * Canonical value-shape onChange. Receives the raw input string —
   * consumers wire this directly into setState without unwrapping a
   * synthetic event.
   */
  onChange: (value: string) => void
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  className?: string
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /**
   * Form-engine binding key. When set inside a `<Form>`, the field auto-binds
   * value/onChange to the engine and FieldShell derives error/required and
   * emits `data-field-name`. Inert outside a `<Form>`.
   */
  name?: string
  styles?: FieldStyleOverrides & {
    // Search-specific overrides that don't fit the FieldShell
    // CSS-variable contract (color-of-icon, padding-of-inner-input,
    // etc.). Forwarded as inline styles on the inner input wrapper /
    // input itself rather than the shell wrapper.
    color?: string
    adornmentColor?: string
  }
}

/**
 * Search input built on FieldShell with a leading magnifier icon inside the
 * frame. `onChange` emits the plain string value — not a DOM event.
 * Controlled via `value`; inside a goobs `<Form>` a `name` lets the form
 * engine drive value/onChange instead.
 */
const Searchbar: React.FC<SearchbarProps> = ({
  label,
  ariaLabel,
  placeholder = 'Search...',
  value: valueProp,
  onChange: onChangeProp,
  helperText,
  error,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  // Tier-1 form binding. Inside a <Form> with a `name` and no explicit value,
  // the engine drives value/onChange; this is a byte-for-byte pass-through
  // otherwise. The destructured value/onChange SHADOW the incoming props so
  // all downstream code uses the bound versions unchanged. Search has no blur
  // concept (no onBlur prop), so no touched-mark is wired.
  const { value: boundValue, onChange: boundOnChange } =
    useFieldBinding<string>({
      name,
      value: valueProp,
      onChange: onChangeProp,
    })
  const value = boundValue ?? ''
  // onChange is required on SearchbarProps, so it is defined when unbound.
  const onChange = boundOnChange ?? onChangeProp

  const inputRef = useRef<HTMLInputElement>(null)

  // Listen for native 'input' events to support browser automation
  // tools that set `input.value` directly and dispatch a native input
  // event, bypassing React's synthetic event system.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== value) {
        onChange(target.value)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, value])

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  // Accessible-name fallback (WCAG 4.1.2 Name, Role, Value). FieldShell only
  // renders a `<label htmlFor>` when `label` is a non-empty string; without
  // one the search input's only text would be the placeholder, which is NOT
  // an accessible name. So when there's no visible label we apply an
  // aria-label — the explicit `ariaLabel` prop wins, otherwise the visible
  // placeholder string is used. When a visible label IS present we leave
  // aria-label undefined so it can't override the `<label>` association.
  //
  // The `||` chain (not `??`) is deliberate: if a consumer blanks the
  // placeholder (`placeholder=""`) with no label and no `ariaLabel`, `??`
  // would resolve to the empty string and emit `aria-label=""` — a broken,
  // empty accessible name that some assistive tech announces as an unlabelled
  // control. `||` skips empty strings so we emit a real name or leave the
  // attribute off entirely (never an empty one).
  const hasVisibleLabel = Boolean(label)
  const resolvedAriaLabel = hasVisibleLabel
    ? undefined
    : ariaLabel || placeholder || undefined

  // Inner frame (icon + input border) lives in Search.module.css — the
  // sacred-gold border is the hardcoded default. Caller-supplied overrides
  // (height/borderWidth/radius/padding/font/colors) are forwarded as CSS
  // custom properties; the disabled chrome is driven by the .disabled
  // modifier on the wrapper. The leading SVG uses fill: currentColor so it
  // inherits the icon container's color.
  const adornmentColor = styles?.adornmentColor
  const wrapperCssVars: Record<string, string> = {}
  if (styles?.height) wrapperCssVars['--search-height'] = styles.height
  if (styles?.borderWidth) {
    wrapperCssVars['--search-border-width'] = styles.borderWidth
  }
  if (styles?.borderRadius) {
    wrapperCssVars['--search-radius'] = styles.borderRadius
  }
  if (adornmentColor) {
    wrapperCssVars['--search-adornment-color'] = adornmentColor
  }
  if (styles?.paddingLeft) {
    wrapperCssVars['--search-padding-left'] = styles.paddingLeft
  }
  if (styles?.paddingRight) {
    wrapperCssVars['--search-padding-right'] = styles.paddingRight
  }
  if (styles?.paddingTop) {
    wrapperCssVars['--search-padding-top'] = styles.paddingTop
  }
  if (styles?.paddingBottom) {
    wrapperCssVars['--search-padding-bottom'] = styles.paddingBottom
  }
  if (styles?.fontSize) wrapperCssVars['--search-font-size'] = styles.fontSize
  if (styles?.fontWeight !== undefined) {
    wrapperCssVars['--search-font-weight'] = String(styles.fontWeight)
  }
  if (styles?.lineHeight) {
    wrapperCssVars['--search-line-height'] = styles.lineHeight
  }
  if (styles?.fontFamily) {
    wrapperCssVars['--search-font-family'] = styles.fontFamily
  }
  const textColorOverride = styles?.textColor || styles?.color
  if (textColorOverride) {
    wrapperCssVars['--search-text-color'] = textColorOverride
  }

  const wrapperClassNames = [
    cssStyles.inputWrapper,
    disabled && cssStyles.disabled,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <FieldShell
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={required}
      dataField={dataField}
      dataFieldName={dataFieldName}
      name={name}
      filled={Boolean(value && value.length > 0)}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => (
        <div
          className={wrapperClassNames}
          style={wrapperCssVars as React.CSSProperties}
        >
          <div className={cssStyles.searchIcon}>
            {/* Decorative magnifier — the input is already named by the
                label/aria-label, so hide the glyph from assistive tech
                (WCAG 1.1.1) and keep it out of the tab order. */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 0 24 24"
              width="20"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>

          <input
            ref={inputRef}
            id={inputId}
            data-field-name={dataFieldName}
            // Native search semantics: type="search" exposes role="searchbox"
            // for correct AT announcement (WCAG 1.3.1 / 4.1.2) — the
            // semantically correct element for a search field.
            type="search"
            // enterKeyHint="search" labels the on-screen keyboard's Enter key
            // as a "search" action on touch devices, so the field's purpose is
            // conveyed at the point of input (WCAG 3.3.2 Labels or
            // Instructions) instead of relying on the UA's per-browser default
            // for type="search".
            enterKeyHint="search"
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            aria-label={resolvedAriaLabel}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className={cssStyles.input}
            {...inputAriaProps}
          />
        </div>
      )}
    </FieldShell>
  )
}

Searchbar.displayName = 'Searchbar'

export default Searchbar
