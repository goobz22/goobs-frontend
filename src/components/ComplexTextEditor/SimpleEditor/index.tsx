// src/components/ComplexTextEditor/SimpleEditor/index.tsx

'use client'
import React, { useEffect, useState } from 'react'
import {
  ComplexTextEditorStyles,
  getComplexTextEditorStyles,
  SACRED_GLYPHS,
} from '../../../theme/'

type SimpleEditorProps = {
  value: string
  onChange: (value: string) => void
  minRows?: number
  styles?: ComplexTextEditorStyles
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({
  value,
  onChange,
  minRows = 5,
  styles,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  // Initialize with consistent values to prevent hydration mismatch
  const [leftGlyph, setLeftGlyph] = useState(SACRED_GLYPHS[0])
  const [rightGlyph, setRightGlyph] = useState(SACRED_GLYPHS[1])
  const [isHydrated, setIsHydrated] = useState(false)

  // Set random glyphs only on client side after hydration
  useEffect(() => {
    if (!isHydrated) {
      setLeftGlyph(
        SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
      )
      setRightGlyph(
        SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
      )
      setIsHydrated(true)
    }
  }, [isHydrated])

  const isSacredTheme = styles?.theme === 'sacred'

  // Get computed styles
  const computedStyles = getComplexTextEditorStyles(styles, isFocused)

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (isSacredTheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes simpleEditorInputGlow {
          0%, 100% { 
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1);
            border-color: rgba(255, 215, 0, 0.3);
          }
          50% { 
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.2);
            border-color: rgba(255, 215, 0, 0.5);
          }
        }
        @keyframes simpleEditorGlyphPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [isSacredTheme])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  // Label is now handled by parent component

  // Get textarea style with sacred glyph positioning
  const textareaStyle: React.CSSProperties = {
    ...computedStyles.editorArea,
    width: '100%',
    maxWidth: '100%',
    minWidth: '0',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    ...(isSacredTheme && {
      paddingRight: '50px', // Make room for glyphs
    }),
  }

  // Get scrollbar class name
  const scrollbarClassName = (computedStyles as any).scrollbarClassName || ''

  const glyphStyles = {
    glyph: {
      position: 'absolute' as const,
      fontSize: '20px',
      color: 'rgba(255, 215, 0, 0.2)',
      pointerEvents: 'none' as const,
      transition: 'all 0.3s ease',
      animation: 'simpleEditorGlyphPulse 3s ease-in-out infinite',
    },
    glyphTopRight: {
      top: '10px',
      right: '10px',
    },
    glyphBottomLeft: {
      bottom: '10px',
      left: '10px',
      animationDelay: '1.5s',
    },
  }

  return (
    <div
      style={{
        ...computedStyles.container,
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <textarea
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={minRows}
          placeholder={
            isSacredTheme ? 'Inscribe your sacred text...' : 'Enter text...'
          }
          style={textareaStyle}
          className={scrollbarClassName}
        />
        {isSacredTheme && (
          <>
            <div
              style={{
                ...glyphStyles.glyph,
                ...glyphStyles.glyphTopRight,
              }}
            >
              {rightGlyph}
            </div>
            <div
              style={{
                ...glyphStyles.glyph,
                ...glyphStyles.glyphBottomLeft,
              }}
            >
              {leftGlyph}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SimpleEditor
