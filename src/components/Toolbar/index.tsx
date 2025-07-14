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
      .toolbar-container {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }
      
      @media (min-width: 768px) {
        .toolbar-mobile-container {
          display: none !important;
        }
        .toolbar-tablet-container {
          display: flex !important;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          gap: 1rem;
          overflow: hidden;
        }
      }
      @media (min-width: 1280px) {
        .toolbar-container {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            max-width: 100%;
            box-sizing: border-box;
            overflow: hidden;
        }
        .toolbar-tablet-container {
            display: none !important;
        }
        .toolbar-desktop-left, .toolbar-desktop-right {
          display: flex !important;
          align-items: center;
          gap: 1rem;
          flex-wrap: nowrap;
          min-width: 0;
          box-sizing: border-box;
          overflow: hidden;
        }
        .toolbar-desktop-left {
          flex: 0 0 auto;
          max-width: 50%;
        }
        .toolbar-desktop-right {
          flex: 1 1 auto;
          justify-content: flex-end;
          max-width: 50%;
          min-width: 0;
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div
      style={{
        ...computedStyles.container,
        width: '100%',
        maxWidth: '100%',
        minWidth: '0',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      className="toolbar-container"
    >
      {isSacredTheme && <span style={computedStyles.glyph}>𓊗</span>}

      {/* Desktop */}
      <div style={computedStyles.desktopLeft} className="toolbar-desktop-left">
        <Left buttons={buttons} styles={styles} />
        {searchbarProps && <LeftCenter {...searchbarProps} styles={styles} />}
      </div>
      <div
        style={{
          ...computedStyles.desktopRight,
          minWidth: '0',
          flex: '1 1 auto',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
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
        style={{
          ...computedStyles.tabletContainer,
          maxWidth: '100%',
          overflow: 'hidden',
        }}
        className="toolbar-tablet-container"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            flex: '1 1 auto',
            minWidth: '0',
            overflow: 'hidden',
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
            flex: '0 0 auto',
            minWidth: '0',
            maxWidth: '100%',
            overflow: 'hidden',
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
        style={{
          ...computedStyles.mobileContainer,
          maxWidth: '100%',
          overflow: 'hidden',
        }}
        className="toolbar-mobile-container"
      >
        <div style={computedStyles.mobileRow}>
          <Left buttons={buttons} styles={styles} />
        </div>
        {rightCenterProps && (
          <div style={{ minWidth: '0', maxWidth: '100%' }}>
            <RightCenter {...rightCenterProps} styles={styles} />
          </div>
        )}
        {dropdowns?.map((dd, index) => (
          <div key={index} style={{ minWidth: '0', maxWidth: '100%' }}>
            <Right dropdown={dd} styles={styles} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomToolbar
