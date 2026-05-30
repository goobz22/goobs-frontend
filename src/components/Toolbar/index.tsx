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
 * sacred) now drives a `data-theme` attribute on the root and all
 * container / glyph / divider styling lives in `Toolbar.module.css`.
 *
 * The interface is preserved verbatim so existing consumer call-sites and
 * generated typings keep compiling; the component itself only reads
 * `styles.theme` today (the remaining fields are reserved passthrough
 * tokens documented on the original theme type).
 */
export interface ToolbarStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  backdropFilter?: string
  backgroundImage?: string
  padding?: string
  containerAnimation?: string

  // Glyph styling
  glyphColor?: string
  glyphFontSize?: string
  glyphAnimation?: string

  // Layout and spacing
  gap?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  disabled?: boolean
  outline?: boolean

  // Dimensions
  width?: string
  maxWidth?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
}

export interface CustomToolbarProps {
  buttons?: ButtonProps[]
  searchbarProps?: SearchbarProps
  filterDropdown?: {
    label?: string
    options: DropdownOption[]
    value: string
    onChange: (value: string) => void
  }
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

  return (
    <div className={cssStyles.root} data-theme={theme}>
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
