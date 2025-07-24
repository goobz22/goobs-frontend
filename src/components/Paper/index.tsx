/**
 * @fileoverview This file defines the Paper component, a versatile container with themeable surface styling.
 * It supports light, dark, and sacred themes with extensive customization options.
 */
'use client'

import React, { forwardRef } from 'react'
import { PaperStyles, getPaperStyles, SACRED_GLYPHS } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The content to display inside the paper container. */
  children: React.ReactNode
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: PaperStyles
  /** Optional elevation level for depth appearance (0-24). */
  elevation?: number
}

// --------------------------------------------------------------------------
// SACRED THEME BACKGROUND DECORATIONS
// --------------------------------------------------------------------------

const SacredBackground: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Sacred Glyphs Background */}
      {SACRED_GLYPHS.slice(0, 6).map((glyph, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            fontSize: Math.random() * 30 + 15,
            opacity: 0.03,
            color: '#FFD700',
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
            userSelect: 'none',
            animation: `rotateGlyph ${Math.random() * 30 + 30}s linear infinite`,
          }}
        >
          {glyph}
        </div>
      ))}
    </div>
  )
}

// --------------------------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------------------------

export const Paper = forwardRef<HTMLDivElement, PaperProps>(
  ({ children, styles, elevation = 1, className, ...restProps }, ref) => {
    const computedStyles = getPaperStyles(styles, elevation)

    return (
      <div
        ref={ref}
        className={className}
        style={computedStyles.container}
        {...restProps}
      >
        {/* Sacred theme background decorations */}
        <SacredBackground isVisible={styles?.theme === 'sacred'} />

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </div>
    )
  }
)

Paper.displayName = 'Paper'

export default Paper
