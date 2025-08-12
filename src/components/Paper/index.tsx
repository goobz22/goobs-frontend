/**
 * @fileoverview This file defines the Paper component, a versatile container with themeable surface styling.
 * It supports light, dark, and sacred themes with extensive customization options.
 */
'use client'

import React, { forwardRef } from 'react'
import { getPaperStyles, SACRED_GLYPHS } from '../../theme'
import type { PaperStyles } from '../../theme'

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

// Generate deterministic pseudo-random values based on index
const getPseudoRandom = (seed: number, multiplier: number) => {
  const x = Math.sin(seed * 12.9898 + multiplier * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const SacredBackground: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isVisible || !isClient) return null

  // Pre-calculate deterministic positions for each glyph
  const glyphConfigs = SACRED_GLYPHS.slice(0, 6).map((glyph, index) => ({
    glyph,
    fontSize: getPseudoRandom(index, 1) * 30 + 15,
    left: getPseudoRandom(index, 2) * 90 + 5,
    top: getPseudoRandom(index, 3) * 90 + 5,
    rotation: getPseudoRandom(index, 4) * 360,
    duration: getPseudoRandom(index, 5) * 30 + 30,
  }))

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
      {glyphConfigs.map((config, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            fontSize: `${config.fontSize}px`,
            opacity: 0.03,
            color: '#FFD700',
            left: `${config.left}%`,
            top: `${config.top}%`,
            transform: `rotate(${config.rotation}deg)`,
            userSelect: 'none',
            animation: `rotateGlyph ${config.duration}s linear infinite`,
          }}
        >
          {config.glyph}
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
