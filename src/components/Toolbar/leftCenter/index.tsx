// src/components/Toolbar/leftCenter/index.tsx

'use client'

import React, { FC } from 'react'
import Searchbar, { SearchbarProps } from '../../Field/Search'

interface LeftCenterProps extends Partial<SearchbarProps> {
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  backgroundcolor?: string
  iconcolor?: string
  outlinecolor?: string
  fontcolor?: string
  sacredtheme?: boolean
}

const premiumStyles = {
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
  } as React.CSSProperties,
  glyph: {
    display: 'none',
  } as React.CSSProperties,
}

const sacredStyles = {
  container: {
    ...premiumStyles.container,
  } as React.CSSProperties,
  searchbarContainer: {
    ...premiumStyles.searchbarContainer,
    animation: 'sacred-glow 1.5s infinite alternate',
    borderRadius: '0.375rem', // rounded
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
  } as React.CSSProperties,
}

const LeftCenter: FC<LeftCenterProps> = props => {
  const {
    shrunklabelposition,
    label,
    placeholder,
    sacredtheme,
    value = '',
    onChange = () => {},
  } = props

  const styles = sacredtheme ? sacredStyles : premiumStyles

  return (
    <div style={styles.container}>
      {sacredtheme && <div style={styles.glyph} />}
      <div style={styles.searchbarContainer}>
        <Searchbar
          shrunklabelposition={shrunklabelposition}
          label={sacredtheme ? 'Divine Search' : label}
          placeholder={sacredtheme ? 'Seek ancient wisdom...' : placeholder}
          value={value}
          onChange={onChange}
          sacredtheme={sacredtheme}
        />
      </div>
    </div>
  )
}

export default LeftCenter
