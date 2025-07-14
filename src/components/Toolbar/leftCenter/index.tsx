// src/components/Toolbar/leftCenter/index.tsx

'use client'

import React, { FC } from 'react'
import Searchbar, { SearchbarProps } from '../../Field/Search'
import { ToolbarStyles } from '../../../theme'
import type { FormFieldStyles } from '../../../theme'

interface LeftCenterProps extends Partial<SearchbarProps> {
  styles?: ToolbarStyles
}

// Create themed FormFieldStyles based on DataGrid theme
const createSearchbarStyles = (
  toolbarStyles?: ToolbarStyles
): FormFieldStyles => {
  const theme = toolbarStyles?.theme || 'light'

  switch (theme) {
    case 'dark':
      return {
        theme: 'dark',
        backgroundColor: '#1E293B', // Dark theme contentWrapper background
        borderColor: '#334155', // Dark theme contentWrapper border
        borderFocusedColor: '#475569', // Slightly lighter for focus
        textColor: '#E2E8F0', // Dark theme text color
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
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Sacred theme contentWrapper background
        borderColor: 'rgba(255, 215, 0, 0.5)', // Sacred theme contentWrapper border
        borderFocusedColor: 'rgba(255, 215, 0, 0.8)', // Brighter gold for focus
        textColor: '#FBBF24', // Sacred theme text color
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
        backgroundColor: '#FFFFFF', // Light theme contentWrapper background
        borderColor: '#E2E8F0', // Light theme contentWrapper border
        borderFocusedColor: '#94A3B8', // Slightly darker for focus
        textColor: '#374151', // Light theme text color
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

const getStyles = (styles?: ToolbarStyles) => {
  const isSacredTheme = styles?.theme === 'sacred'

  return {
    container: {
      display: 'flex',
      alignItems: 'flex-end',
      width: '100%',
      maxWidth: '24rem', // max-w-96
      minWidth: '200px', // Minimum width for usability
      height: '3.5rem', // h-14
      position: 'relative',
      flex: '1 1 auto',
    } as React.CSSProperties,
    searchbarContainer: {
      marginBottom: '0.5rem', // mb-2
      width: '100%',
      ...(isSacredTheme && {
        animation: 'sacred-glow 1.5s infinite alternate',
        borderRadius: '0.375rem', // rounded
      }),
    } as React.CSSProperties,
    glyph: {
      content: '"𓂀"',
      position: 'absolute',
      top: '0.25rem', // top-1
      right: '-20px',
      fontSize: '1rem', // text-base
      color: 'rgba(255, 215, 0, 0.3)',
      animation: 'glyph-rotate 10s linear infinite',
      zIndex: 10,
      display: isSacredTheme ? 'block' : 'none',
    } as React.CSSProperties,
  }
}

const LeftCenter: FC<LeftCenterProps> = props => {
  const { label, placeholder, styles, value = '', onChange = () => {} } = props

  const computedStyles = getStyles(styles)
  const isSacredTheme = styles?.theme === 'sacred'

  // Create proper FormFieldStyles based on the DataGrid theme
  const searchbarStyles = createSearchbarStyles(styles)

  return (
    <div style={computedStyles.container}>
      <div style={computedStyles.glyph} />
      <div style={computedStyles.searchbarContainer}>
        <Searchbar
          label={isSacredTheme ? 'Divine Search' : label}
          placeholder={isSacredTheme ? 'Seek ancient wisdom...' : placeholder}
          value={value}
          onChange={onChange}
          styles={searchbarStyles}
        />
      </div>
    </div>
  )
}

export default LeftCenter
