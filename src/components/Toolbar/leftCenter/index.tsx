// src/components/Toolbar/leftCenter/index.tsx

'use client'

import React, { FC } from 'react'
import Searchbar, { SearchbarProps } from '../../Field/Search'
import { ToolbarStyles } from '../../../theme'

interface LeftCenterProps extends Partial<SearchbarProps> {
  styles?: ToolbarStyles
}

const getStyles = (styles?: ToolbarStyles) => {
  const isSacredTheme = styles?.theme === 'sacred'

  return {
    container: {
      display: 'flex',
      alignItems: 'flex-end',
      width: '24rem', // w-96
      height: '3.5rem', // h-14
      position: 'relative',
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

  return (
    <div style={computedStyles.container}>
      <div style={computedStyles.glyph} />
      <div style={computedStyles.searchbarContainer}>
        <Searchbar
          label={isSacredTheme ? 'Divine Search' : label}
          placeholder={isSacredTheme ? 'Seek ancient wisdom...' : placeholder}
          value={value}
          onChange={onChange}
          styles={{ theme: styles?.theme }}
        />
      </div>
    </div>
  )
}

export default LeftCenter
