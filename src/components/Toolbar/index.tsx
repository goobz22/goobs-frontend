'use client'

import React, { useMemo, type FC } from 'react'
import CustomButton, { ButtonProps } from '../Button'
import Searchbar, { SearchbarProps } from '../Field/Search'
import Dropdown, { type DropdownOption } from '../Field/Dropdown/Regular'
import {
  getToolbarStyles,
  type ToolbarStyles,
  type FormFieldStyles,
} from '../../theme'

export interface CustomToolbarProps {
  buttons?: ButtonProps[]
  searchbarProps?: SearchbarProps
  filterDropdown?: {
    label?: string
    options: DropdownOption[]
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  }
  styles?: ToolbarStyles
}

// Create themed FormFieldStyles based on toolbar theme
const createSearchbarStyles = (
  toolbarStyles?: ToolbarStyles
): FormFieldStyles => {
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
  const computedStyles = useMemo(() => getToolbarStyles(styles), [styles])
  const isSacredTheme = styles?.theme === 'sacred'
  const isDarkTheme = styles?.theme === 'dark'

  // Create proper FormFieldStyles based on the toolbar theme
  const searchbarStyles = createSearchbarStyles(styles)

  // Vertical divider styles
  const dividerStyle: React.CSSProperties = {
    height: '20px',
    borderLeft: isSacredTheme
      ? '2px solid rgba(255, 215, 0, 0.6)'
      : isDarkTheme
        ? '2px solid rgba(156, 163, 175, 0.6)'
        : '2px solid rgba(0, 0, 0, 0.6)',
    ...(isSacredTheme && {
      filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
    }),
  }

  // Content container styles - all left aligned
  const contentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
    flexWrap: 'wrap',
  }

  return (
    <div
      style={{
        ...computedStyles.container,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {isSacredTheme && <span style={computedStyles.glyph}>𓊗</span>}

      <div style={contentStyle}>
        {/* Vertical Divider */}
        <div style={{ padding: '0 8px' }}>
          <div style={dividerStyle} />
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
          <div
            style={{
              minWidth: '180px',
              maxWidth: '200px',
            }}
          >
            <Dropdown
              label={filterDropdown.label || 'Filter'}
              options={filterDropdown.options}
              value={filterDropdown.value}
              onChange={filterDropdown.onChange}
              styles={{ theme: styles?.theme || 'light' }}
            />
          </div>
        )}

        {/* Searchbar */}
        {searchbarProps && (
          <div
            style={{
              flex: '1 1 auto',
              maxWidth: '24rem',
              minWidth: '200px',
              marginBottom: '15px',
            }}
          >
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
