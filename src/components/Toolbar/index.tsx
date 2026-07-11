'use client'

import React, { type FC, useCallback, useEffect, useRef } from 'react'
import CustomButton, { ButtonProps } from '../Button'
import Searchbar, { SearchbarProps } from '../Field/Search'
import Dropdown, { type DropdownOption } from '../Field/Dropdown/Regular'
import type { FieldStyleOverrides } from '../Field/Shell/types'
import cssStyles from './Toolbar.module.css'

/**
 * Public styling surface for the Toolbar. Migrated off
 * `theme/toolbar.ts:ToolbarStyles` — the theme variant (light / dark /
 * sacred) drives a `data-theme` attribute on the root and all
 * container / glyph / divider styling lives in `Toolbar.module.css`.
 *
 * The interface is intentionally minimal: it holds exactly the knobs the
 * component honors. `theme` selects the variant; `glyphColor` and
 * `backgroundImage` override the matching `--toolbar-*` custom properties
 * the CSS module already consumes.
 */
export interface ToolbarStyles {
  /** Theme variant; selects the `data-theme` styling block. Default 'light'. */
  theme?: 'light' | 'dark' | 'sacred'
  /**
   * Overrides `--toolbar-glyph-color` — the color of the decorative 𓊗 glyph.
   * Observable only on the sacred theme (the glyph renders only there).
   */
  glyphColor?: string
  /**
   * Overrides `--toolbar-bg-image` — the root container's background-image
   * (per-theme default: sacred dual radial-gradient, light/dark none).
   */
  backgroundImage?: string
}

export interface CustomToolbarProps {
  /**
   * Action buttons rendered left-to-right after the divider. Only each
   * entry's `text`, `onClick`, and `disabled` are forwarded to the underlying
   * Button; when `styles.theme` is set it is passed as the button theme too.
   */
  buttons?: ButtonProps[]
  /**
   * When provided, renders a Searchbar at the end of the toolbar. Its
   * `value`/`onChange`/`label`/`placeholder` are forwarded; the field is
   * restyled with a fixed per-theme palette matching the toolbar theme
   * (caller `styles` on this prop are not forwarded).
   */
  searchbarProps?: SearchbarProps
  /** When provided, renders a controlled filter Dropdown themed to match the toolbar. */
  filterDropdown?: {
    /** Dropdown field label. Default 'Filter'. */
    label?: string
    /** Selectable filter options. */
    options: DropdownOption[]
    /** Controlled selected value. */
    value: string
    /** Called with the newly selected value. */
    onChange: (value: string) => void
  }
  /** Theme plus glyph/background overrides. See ToolbarStyles. */
  styles?: ToolbarStyles
  /**
   * Accessible name for the toolbar's `role="toolbar"` grouping, exposed as
   * `aria-label` on the root (WCAG 4.1.2). Defaults to `'Toolbar'`; override to
   * disambiguate when a page renders more than one toolbar. Ignored when
   * `ariaLabelledBy` is provided.
   */
  ariaLabel?: string
  /**
   * ID(s) of visible element(s) that name the toolbar, exposed as
   * `aria-labelledby` on the root. Takes precedence over `ariaLabel`.
   */
  ariaLabelledBy?: string
}

// Translate the Toolbar theme into FieldStyleOverrides for the inner
// Searchbar. Color/border tokens previously expressed as
// FormFieldStyles fields go through FieldShell's CSS-variable
// translation now. This stays in JS: it is data-driven child-component
// configuration, not Toolbar container styling.
const createSearchbarStyles = (
  toolbarStyles?: ToolbarStyles
): FieldStyleOverrides => {
  const theme = toolbarStyles?.theme || 'light'

  switch (theme) {
    case 'dark':
      return {
        theme: 'dark',
        backgroundColor: 'var(--goobs-dark-surface)',
        borderColor: 'var(--goobs-dark-border)',
        borderFocusedColor: 'var(--goobs-dark-border-strong)',
        textColor: 'var(--goobs-light-border)',
        labelColor: 'var(--goobs-light-border)',
        labelFocusedColor: '#F1F5F9',
        adornmentColor: '#9CA3AF',
        adornmentFocusedColor: 'var(--goobs-light-border)',
        borderRadius: '8px',
        height: '40px',
        fontFamily: 'Inter, sans-serif',
      }
    case 'sacred':
      return {
        theme: 'sacred',
        backgroundColor: 'var(--goobs-black-a90)',
        borderColor: 'var(--goobs-gold-a50)',
        borderFocusedColor: 'var(--goobs-gold-a80)',
        textColor: 'var(--goobs-dark-warn-text)',
        labelColor: 'var(--goobs-dark-warn-text)',
        labelFocusedColor: 'var(--goobs-gold)',
        adornmentColor: 'var(--goobs-gold-a60)',
        adornmentFocusedColor: 'var(--goobs-gold)',
        borderRadius: '8px',
        height: '40px',
        fontFamily: 'Cinzel, serif',
      }
    default: // light theme
      return {
        theme: 'light',
        backgroundColor: 'var(--goobs-light-surface)',
        borderColor: 'var(--goobs-light-border)',
        borderFocusedColor: 'var(--goobs-dark-text-muted)',
        textColor: 'var(--goobs-light-text-secondary)',
        labelColor: 'var(--goobs-light-text-secondary)',
        labelFocusedColor: 'var(--goobs-light-text)',
        adornmentColor: '#6B7280',
        adornmentFocusedColor: 'var(--goobs-light-text-secondary)',
        borderRadius: '8px',
        height: '40px',
        fontFamily: 'Inter, sans-serif',
      }
  }
}

// A focused text-entry field (text input / textarea / contenteditable) owns the
// Arrow and Home/End keys for caret motion, so the toolbar's roving-tabindex
// handler must NOT hijack those keys while one is focused (the searchbar input).
const isTextEntryElement = (el: HTMLElement | null): boolean => {
  if (!el) return false
  if (el.isContentEditable) return true
  const tag = el.tagName
  if (tag === 'TEXTAREA') return true
  if (tag === 'INPUT') {
    const inputType = (el as HTMLInputElement).type
    return !['button', 'checkbox', 'radio', 'submit', 'reset', 'range', 'color'].includes(
      inputType
    )
  }
  return false
}

/**
 * Horizontal action bar composing optional action Buttons, a controlled
 * filter Dropdown, and a Searchbar — each section rendering only when its
 * prop is provided. Themed light (default) / dark / sacred via `data-theme`
 * on the root; the sacred variant adds a decorative glyph. The toolbar theme
 * propagates to every child it renders, including a fixed per-theme field
 * palette for the searchbar.
 *
 * Implements the WAI-ARIA APG Toolbar pattern: the root is a labelled
 * `role="toolbar"` and the contained controls share a single Tab stop, roved
 * with Left/Right Arrow + Home/End (a focused searchbar or open filter dropdown
 * keeps its own Arrow behavior).
 */
const CustomToolbar: FC<CustomToolbarProps> = ({
  buttons,
  searchbarProps,
  filterDropdown,
  styles,
  ariaLabel,
  ariaLabelledBy,
}) => {
  // Theme variant drives a data-attribute on the root; light is the parity
  // default the old getToolbarStyles used (styles?.theme || 'light').
  const theme = styles?.theme || 'light'
  const isSacredTheme = theme === 'sacred'

  // Create proper FieldStyleOverrides based on the toolbar theme
  const searchbarStyles = createSearchbarStyles(styles)

  // Caller-supplied overrides pass through as CSS custom properties; each var
  // is set ONLY when the caller provided it, so the theme value in
  // Toolbar.module.css applies otherwise.
  const dynamicStyle: React.CSSProperties & Record<string, string> = {}
  if (styles?.glyphColor)
    dynamicStyle['--toolbar-glyph-color'] = styles.glyphColor
  if (styles?.backgroundImage)
    dynamicStyle['--toolbar-bg-image'] = styles.backgroundImage

  // ---- WAI-ARIA APG Toolbar keyboard pattern (roving tabindex) -------------
  // `role="toolbar"` tells AT the control row is a SINGLE Tab stop navigated
  // with the Arrow keys. Implement it: exactly one control is tabbable
  // (tabIndex 0), the rest are tabIndex -1 and reached with Left/Right +
  // Home/End. The set is discovered live from the DOM (every enabled <button> —
  // the action buttons AND the filter combobox) so it stays correct as buttons
  // and disabled states mount/unmount. Runs client-only (refs + handlers) →
  // SSR-safe. A contained text field (the searchbar) or an open combobox keeps
  // its own Arrow/Home/End behavior; native Enter/Space activation is unchanged.
  const toolbarRef = useRef<HTMLDivElement>(null)

  const getToolbarControls = useCallback((): HTMLElement[] => {
    const root = toolbarRef.current
    if (!root) return []
    return Array.from(root.querySelectorAll<HTMLElement>('button')).filter(
      el =>
        !(el as HTMLButtonElement).disabled &&
        // an open combobox's own option buttons are not toolbar tab stops
        el.getAttribute('role') !== 'option'
    )
  }, [])

  // Make exactly one control tabbable. `preferred` keeps the roved position when
  // it is still in the set; otherwise the first control becomes the tab stop.
  const applyRovingTabIndex = useCallback(
    (preferred: HTMLElement | null) => {
      const controls = getToolbarControls()
      if (controls.length === 0) return
      const active =
        preferred && controls.includes(preferred) ? preferred : controls[0]
      controls.forEach(el => {
        el.tabIndex = el === active ? 0 : -1
      })
    },
    [getToolbarControls]
  )

  // Re-seed the single tab stop whenever the control set changes: buttons added/
  // removed, a button's disabled state toggles, or the dropdown/searchbar mount.
  const controlSignature = JSON.stringify({
    buttons: (buttons ?? []).map(btn => !!btn.disabled),
    filter: !!filterDropdown,
    search: !!searchbarProps,
  })
  useEffect(() => {
    applyRovingTabIndex(null)
  }, [applyRovingTabIndex, controlSignature])

  const handleToolbarKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const { key } = event
      if (
        key !== 'ArrowLeft' &&
        key !== 'ArrowRight' &&
        key !== 'Home' &&
        key !== 'End'
      ) {
        return
      }
      const focused = document.activeElement as HTMLElement | null
      // Don't hijack the Arrow/Home/End keys from a focused text field (the
      // searchbar caret) or an open combobox (its option navigation).
      if (isTextEntryElement(focused)) return
      if (focused?.getAttribute('aria-expanded') === 'true') return
      const controls = getToolbarControls()
      if (controls.length === 0) return
      const currentIndex = focused ? controls.indexOf(focused) : -1
      let nextIndex: number
      switch (key) {
        case 'ArrowRight':
          nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % controls.length
          break
        case 'ArrowLeft':
          nextIndex = currentIndex <= 0 ? controls.length - 1 : currentIndex - 1
          break
        case 'Home':
          nextIndex = 0
          break
        default: // 'End'
          nextIndex = controls.length - 1
          break
      }
      const next = controls[nextIndex]
      if (!next) return
      event.preventDefault()
      controls.forEach(el => {
        el.tabIndex = el === next ? 0 : -1
      })
      next.focus()
    },
    [getToolbarControls]
  )

  // Keep the tab stop on whichever control the user focuses (e.g. by mouse) so
  // Shift+Tab back into the toolbar returns to the last-used control.
  const handleToolbarFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      applyRovingTabIndex(event.target as HTMLElement)
    },
    [applyRovingTabIndex]
  )

  return (
    <div
      ref={toolbarRef}
      className={cssStyles.root}
      data-component="Toolbar"
      data-theme={theme}
      role="toolbar"
      aria-orientation="horizontal"
      {...(ariaLabelledBy
        ? { 'aria-labelledby': ariaLabelledBy }
        : { 'aria-label': ariaLabel || 'Toolbar' })}
      style={dynamicStyle}
      onKeyDown={handleToolbarKeyDown}
      onFocus={handleToolbarFocus}
    >
      {isSacredTheme && (
        <span className={cssStyles.glyph} aria-hidden="true">
          𓊗
        </span>
      )}

      <div className={cssStyles.content}>
        {/* Vertical Divider */}
        <div className={cssStyles.dividerWrap}>
          <div className={cssStyles.divider} />
        </div>

        {/* Buttons */}
        {buttons?.map((btn, i) => (
          <CustomButton
            key={i}
            {...(btn.text ? { text: btn.text } : {})}
            onClick={btn.onClick}
            disabled={!!btn.disabled}
            {...(styles?.theme ? { styles: { theme: styles.theme } } : {})}
          />
        ))}

        {/* Filter Dropdown */}
        {filterDropdown && (
          <div className={cssStyles.filterWrap}>
            <Dropdown
              label={filterDropdown.label || 'Filter'}
              options={filterDropdown.options}
              value={filterDropdown.value}
              onChange={filterDropdown.onChange}
              styles={{ theme }}
            />
          </div>
        )}

        {/* Searchbar */}
        {searchbarProps && (
          <div className={cssStyles.searchWrap}>
            <Searchbar
              value={searchbarProps.value}
              onChange={searchbarProps.onChange}
              {...(searchbarProps.label ? { label: searchbarProps.label } : {})}
              {...(searchbarProps.placeholder
                ? { placeholder: searchbarProps.placeholder }
                : {})}
              styles={searchbarStyles}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomToolbar
