'use client'

import React from 'react'
import Dropdown, { DropdownProps } from '../../Field/Dropdown/Regular'

export interface RightProps {
  /** A single dropdown to render. (We'll render multiple <Right> if needed.) */
  dropdown: DropdownProps
  sacredtheme?: boolean
}

const premiumStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    height: '100%',
    padding: '0 16px',
    gap: '10px',
    width: '12rem', // w-48
  } as React.CSSProperties,
}

const sacredStyles = {
  container: {
    ...premiumStyles.container,
  } as React.CSSProperties,
}

function Right({ dropdown, sacredtheme }: RightProps) {
  const styles = sacredtheme ? sacredStyles : premiumStyles
  return (
    <div style={styles.container}>
      <Dropdown
        outlinecolor={
          sacredtheme ? '#FFD700' : dropdown.outlinecolor || 'black'
        }
        fontcolor={sacredtheme ? '#FFD700' : dropdown.fontcolor || 'black'}
        shrunkfontcolor={
          sacredtheme ? '#FFD700' : dropdown.shrunkfontcolor || 'black'
        }
        backgroundcolor={
          sacredtheme ? 'rgba(0, 0, 0, 0.6)' : dropdown.backgroundcolor
        }
        {...dropdown}
        sacredtheme={sacredtheme}
      />
    </div>
  )
}

export default Right
