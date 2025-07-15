/**
 * @fileoverview Defines the Chip component, a compact element for displaying labels or tags.
 */
'use client'

import React, { useState } from 'react'
import CloseIcon from '../Icons/Close'
import { ChipStyles, getChipStyles, SACRED_GLYPHS } from '../../theme'

export interface ChipProps {
  label: string
  onDelete?: () => void
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: ChipStyles
}

const Chip: React.FC<ChipProps> = ({ label, onDelete, styles }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isCloseHovered, setIsCloseHovered] = useState(false)

  const isDisabled = styles?.disabled
  const isSacredTheme = styles?.theme === 'sacred'

  const computedStyles = getChipStyles(styles, isHovered, isDisabled)

  const closeButtonStyle = {
    ...computedStyles.closeButton,
    ...(isCloseHovered && !isDisabled && computedStyles.closeButtonHover),
    ...(isDisabled && computedStyles.closeButtonDisabled),
  }

  return (
    <div
      style={computedStyles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sacred theme effects */}
      {isSacredTheme && (
        <>
          <span
            style={{
              ...computedStyles.glyph,
              ...computedStyles.glyphLeft,
              ...(isHovered && !isDisabled && computedStyles.glyphVisible),
            }}
          >
            {SACRED_GLYPHS[7]}
          </span>
          <span
            style={{
              ...computedStyles.glyph,
              ...computedStyles.glyphRight,
              ...(isHovered && !isDisabled && computedStyles.glyphVisible),
            }}
          >
            {SACRED_GLYPHS[13]}
          </span>
          {isHovered && !isDisabled && <div style={computedStyles.shimmer} />}
        </>
      )}

      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>

      {onDelete && (
        <button
          onClick={isDisabled ? undefined : onDelete}
          style={closeButtonStyle}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          disabled={isDisabled}
          aria-label="Remove chip"
        >
          <CloseIcon style={{ width: '16px', height: '16px' }} />
        </button>
      )}
    </div>
  )
}

export default Chip
