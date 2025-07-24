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

interface ChevronLeftIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
}

const ChevronLeftIcon: React.FC<ChevronLeftIconProps> = ({
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
        d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default ChevronLeftIcon
