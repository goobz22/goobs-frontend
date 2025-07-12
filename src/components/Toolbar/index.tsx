'use client'

import React, { FC, useEffect, useMemo } from 'react'
import Left from './left'
import LeftCenter from './leftCenter'
import Right from './right'
import RightCenter, { RightCenterProps } from './rightCenter'
import { ButtonProps } from '../Button'
import { DropdownProps } from '../Field/Dropdown/Regular'
import { SearchbarProps } from '../Field/Search'
import { getToolbarStyles, ToolbarStyles } from '../../theme'

export interface CustomToolbarProps {
  buttons?: ButtonProps[]
  searchbarProps?: SearchbarProps
  rightCenterProps?: RightCenterProps
  dropdowns?: DropdownProps[]
  styles?: ToolbarStyles
}

const CustomToolbar: FC<CustomToolbarProps> = ({
  buttons,
  searchbarProps,
  rightCenterProps,
  dropdowns,
  styles,
}) => {
  const computedStyles = useMemo(() => getToolbarStyles(styles), [styles])

  const isSacredTheme = styles?.theme === 'sacred'

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @media (min-width: 768px) {
        .toolbar-mobile-container {
          display: none !important;
        }
        .toolbar-tablet-container {
          display: flex !important;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 1rem;
        }
      }
      @media (min-width: 1280px) {
        .toolbar-container {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
        .toolbar-tablet-container {
            display: none !important;
        }
        .toolbar-desktop-left, .toolbar-desktop-right {
          display: flex !important;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div style={computedStyles.container} className="toolbar-container">
      {isSacredTheme && <span style={computedStyles.glyph}>𓊗</span>}

      {/* Desktop */}
      <div style={computedStyles.desktopLeft} className="toolbar-desktop-left">
        <Left buttons={buttons} styles={styles} />
        {searchbarProps && <LeftCenter {...searchbarProps} styles={styles} />}
      </div>
      <div
        style={computedStyles.desktopRight}
        className="toolbar-desktop-right"
      >
        {rightCenterProps && (
          <RightCenter {...rightCenterProps} styles={styles} />
        )}
        {dropdowns?.map((dd, index) => (
          <Right key={index} dropdown={dd} styles={styles} />
        ))}
      </div>

      {/* Tablet */}
      <div
        style={computedStyles.tabletContainer}
        className="toolbar-tablet-container"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Left buttons={buttons} styles={styles} />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {rightCenterProps && (
            <RightCenter {...rightCenterProps} styles={styles} />
          )}
          {dropdowns?.map((dd, index) => (
            <Right key={index} dropdown={dd} styles={styles} />
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div
        style={computedStyles.mobileContainer}
        className="toolbar-mobile-container"
      >
        <div style={computedStyles.mobileRow}>
          <Left buttons={buttons} styles={styles} />
        </div>
        {rightCenterProps && (
          <div>
            <RightCenter {...rightCenterProps} styles={styles} />
          </div>
        )}
        {dropdowns?.map((dd, index) => (
          <div key={index}>
            <Right dropdown={dd} styles={styles} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomToolbar
