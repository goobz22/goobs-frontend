'use client'

import React from 'react'
import Dropdown, { DropdownProps } from '../../Field/Dropdown/Regular'
import { ToolbarStyles } from '../../../theme'

export interface RightProps {
  /** A single dropdown to render. (We'll render multiple <Right> if needed.) */
  dropdown: DropdownProps
  styles?: ToolbarStyles
}

const getStyles = () => {
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      height: '100%',
      padding: '0 8px',
      gap: '10px',
      minWidth: '0',
      maxWidth: '12rem', // max-w-48
    } as React.CSSProperties,
  }
}

function Right({ dropdown, styles }: RightProps) {
  const computedStyles = getStyles()
  const dropdownWithTheme = {
    ...dropdown,
    styles: {
      theme: styles?.theme || 'light',
      ...dropdown.styles,
    },
  }
  return (
    <div style={computedStyles.container}>
      <Dropdown {...dropdownWithTheme} />
    </div>
  )
}

export default Right
