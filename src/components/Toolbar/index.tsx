'use client'

import React, { FC, useEffect } from 'react'
import Left from './left'
import LeftCenter from './leftCenter'
import Right from './right'
import RightCenter, { RightCenterProps } from './rightCenter'
import { CustomButtonProps } from '../Button'
import { DropdownProps } from '../Field/Dropdown/Regular'
import { SearchbarProps } from '../Field/Search'

export interface CustomToolbarProps {
  buttons?: CustomButtonProps[]
  searchbarProps?: SearchbarProps
  rightCenterProps?: RightCenterProps
  dropdowns?: DropdownProps[]
  sacredtheme?: boolean
}

const getStyles = (sacredtheme?: boolean) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '1rem',
    ...(sacredtheme && {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '0.5rem',
      padding: '1rem',
      position: 'relative',
      animation: 'sacred-glow-pulse 2s infinite alternate',
    }),
  } as React.CSSProperties,
  sacredGlyph: {
    position: 'absolute',
    top: '0.25rem',
    right: '0.5rem',
    color: 'rgba(255, 215, 0, 0.2)',
    fontSize: '0.875rem',
    animation: 'glyph-rotate 10s linear infinite',
  } as React.CSSProperties,
  desktopLeft: {
    display: 'none',
  } as React.CSSProperties,
  desktopRight: {
    display: 'none',
  } as React.CSSProperties,
  tabletContainer: {
    display: 'none',
  } as React.CSSProperties,
  mobileContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
  } as React.CSSProperties,
  mobileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  } as React.CSSProperties,
})

const CustomToolbar: FC<CustomToolbarProps> = ({
  buttons,
  searchbarProps,
  rightCenterProps,
  dropdowns,
  sacredtheme,
}) => {
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

  const styles = getStyles(sacredtheme)

  return (
    <div style={styles.container} className="toolbar-container">
      {sacredtheme && <span style={styles.sacredGlyph}>𓊗</span>}

      {/* Desktop */}
      <div style={styles.desktopLeft} className="toolbar-desktop-left">
        <Left buttons={buttons} sacredtheme={sacredtheme} />
        {searchbarProps && (
          <LeftCenter {...searchbarProps} sacredtheme={sacredtheme} />
        )}
      </div>
      <div style={styles.desktopRight} className="toolbar-desktop-right">
        {rightCenterProps && (
          <RightCenter {...rightCenterProps} sacredtheme={sacredtheme} />
        )}
        {dropdowns?.map((dd, index) => (
          <Right key={index} dropdown={dd} sacredtheme={sacredtheme} />
        ))}
      </div>

      {/* Tablet */}
      <div style={styles.tabletContainer} className="toolbar-tablet-container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Left buttons={buttons} sacredtheme={sacredtheme} />
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
            <RightCenter {...rightCenterProps} sacredtheme={sacredtheme} />
          )}
          {dropdowns?.map((dd, index) => (
            <Right key={index} dropdown={dd} sacredtheme={sacredtheme} />
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div style={styles.mobileContainer} className="toolbar-mobile-container">
        <div style={styles.mobileRow}>
          <Left buttons={buttons} sacredtheme={sacredtheme} />
        </div>
        {rightCenterProps && (
          <div>
            <RightCenter {...rightCenterProps} sacredtheme={sacredtheme} />
          </div>
        )}
        {dropdowns?.map((dd, index) => (
          <div key={index}>
            <Right dropdown={dd} sacredtheme={sacredtheme} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomToolbar
