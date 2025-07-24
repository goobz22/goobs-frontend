'use client'

import React, { useState, useEffect } from 'react'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
]

interface ChevronRightIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
}

const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({
  sacredtheme = false,
  ...props
}) => {
  const [currentGlyph, setCurrentGlyph] = useState(SACRED_GLYPHS[0])

  useEffect(() => {
    if (!sacredtheme) return

    const interval = setInterval(() => {
      setCurrentGlyph(
        SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [sacredtheme])

  if (sacredtheme) {
    return <span style={{ fontSize: '1.2em' }}>{currentGlyph}</span>
  }

  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default ChevronRightIcon
