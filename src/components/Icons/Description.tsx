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

interface DescriptionIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
}

const DescriptionIcon: React.FC<DescriptionIconProps> = ({
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
        d="M14 2H6C5.45 2 4.95 2.22 4.59 2.59C4.22 2.95 4 3.45 4 4V20C4 20.55 4.22 21.05 4.59 21.41C4.95 21.78 5.45 22 6 22H18C18.55 22 19.05 21.78 19.41 21.41C19.78 21.05 20 20.55 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 12H16V14H8V12ZM8 16H13V18H8V16Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default DescriptionIcon
