'use client'

import React, { type FC } from 'react'
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
        backgroundColor: '#1E293B',
        borderColor: '#334155',
        borderFocusedColor: '#475569',
        textColor: '#E2E8F0',
        labelColor: '#E2E8F0',
        labelFocusedColor: '#F1F5F9',
        adornmentColor: '#9CA3AF',
        adornmentFocusedColor: '#E2E8F0',
        borderRadius: '8px',
        height: '40px',
        fontFamily: 'Inter, sans-serif',
      }
    case 'sacred':
      return {
        theme: 'sacred',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(255, 215, 0, 0.5)',
        borderFocusedColor: 'rgba(255, 215, 0, 0.8)',
        textColor: '#FBBF24',
        labelColor: '#FBBF24',
        labelFocusedColor: '#FFD700',
        adornmentColor: 'rgba(255, 215, 0, 0.6)',
        adornmentFocusedColor: '#FFD700',
        borderRadius: '8px',
        height: '40px',
        fontFamily: 'Cinzel, serif',
      }
    default: // light theme
      return {
        theme: 'light',
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        borderFocusedColor: '#94A3B8',
        textColor: '#374151',
        labelColor: '#374151',
        labelFocusedColor: '#1F2937',
        adornmentColor: '#6B7280',
        adornmentFocusedColor: '#374151',
        borderRadius: '8px',
        height: '40px',
        fontFamily: 'Inter, sans-serif',
      }
  }
}

/**
 * Horizontal action bar composing optional action Buttons, a controlled
 * filter Dropdown, and a Searchbar — each section rendering only when its
 * prop is provided. Themed light (default) / dark / sacred via `data-theme`
 * on the root; the sacred variant adds a decorative glyph. The toolbar theme
 * propagates to every child it renders, including a fixed per-theme field
 * palette for the searchbar.
 */
const CustomToolbar: FC<CustomToolbarProps> = ({
  buttons,
  searchbarProps,
  filterDropdown,
  styles,
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

  return (
    <div
      className={cssStyles.root}
      data-component="Toolbar"
      data-theme={theme}
      style={dynamicStyle}
    >
      {isSacredTheme && <span className={cssStyles.glyph}>𓊗</span>}

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
