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

interface CheckCircleIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
}

const CheckCircleIcon: React.FC<CheckCircleIconProps> = ({
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
    return (
      <span style={{ fontSize: '1.2em', color: '#4CAF50' }}>
        {currentGlyph}
      </span>
    )
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
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
        fill="#4CAF50"
      />
    </svg>
  )
}

export default CheckCircleIcon
