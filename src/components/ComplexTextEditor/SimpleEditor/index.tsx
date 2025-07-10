// src/components/ComplexTextEditor/SimpleEditor/index.tsx

'use client'
import React, { useEffect, useState } from 'react'
import { SACRED_GLYPHS } from '../../../styles/sacredGlyphs'

type SimpleEditorProps = {
  value: string
  setValue: (value: string) => void
  minRows?: number
  label?: string
  error?: boolean
  helperText?: React.ReactNode
  required?: boolean
  style?: React.CSSProperties
  sacredtheme?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  } as React.CSSProperties,

  textarea: {
    width: '100%',
    padding: '8px',
    border: '1px solid rgba(209, 213, 219, 1)',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: '"Inter", sans-serif',
    fontSize: '14px',
    lineHeight: '1.5',
    resize: 'vertical',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:focus': {
      borderColor: 'rgba(59, 130, 246, 0.5)',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  } as React.CSSProperties,

  textareaError: {
    borderColor: 'rgba(239, 68, 68, 1)',
    '&:focus': {
      borderColor: 'rgba(239, 68, 68, 1)',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
    },
  } as React.CSSProperties,

  helperText: {
    fontSize: '12px',
    marginTop: '4px',
    color: 'rgba(107, 114, 128, 1)',
  } as React.CSSProperties,

  helperTextError: {
    color: 'rgba(239, 68, 68, 1)',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  } as React.CSSProperties,

  textarea: {
    width: '100%',
    padding: '8px',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'rgba(255, 215, 0, 0.9)',
    fontFamily: '"Cinzel", serif',
    fontSize: '14px',
    lineHeight: '1.5',
    letterSpacing: '0.025em',
    resize: 'vertical',
    outline: 'none',
    transition: 'all 0.4s ease',
    boxShadow:
      'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 5px rgba(255, 215, 0, 0.2)',
    animation: 'simpleEditorInputGlow 4s ease-in-out infinite',
    '&::placeholder': {
      color: 'rgba(255, 215, 0, 0.5)',
    },
  } as React.CSSProperties,

  textareaError: {
    borderColor: 'rgba(239, 68, 68, 1)',
    color: 'rgba(239, 68, 68, 0.9)',
  } as React.CSSProperties,

  helperText: {
    fontSize: '12px',
    marginTop: '4px',
    color: 'rgba(255, 215, 0, 0.7)',
    fontStyle: 'italic',
    fontFamily: '"Cinzel", serif',
  } as React.CSSProperties,

  helperTextError: {
    color: 'rgba(239, 68, 68, 1)',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    fontSize: '20px',
    color: 'rgba(255, 215, 0, 0.2)',
    pointerEvents: 'none',
    transition: 'all 0.3s ease',
    animation: 'simpleEditorGlyphPulse 3s ease-in-out infinite',
  } as React.CSSProperties,

  glyphTopRight: {
    top: '10px',
    right: '10px',
  } as React.CSSProperties,

  glyphBottomLeft: {
    bottom: '10px',
    left: '10px',
    animationDelay: '1.5s',
  } as React.CSSProperties,
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({
  value,
  setValue,
  minRows = 5,
  label,
  error,
  helperText,
  required,
  style,
  sacredtheme = false,
}) => {
  const [leftGlyph] = useState(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )
  const [rightGlyph] = useState(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
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
  }, [sacredtheme])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
  }

  const styles = sacredtheme ? sacredStyles : premiumStyles

  const containerStyle = {
    ...styles.container,
    ...style,
  }

  const textareaStyle = {
    ...styles.textarea,
    ...(error && styles.textareaError),
  }

  const helperTextStyle = {
    ...styles.helperText,
    ...(error && styles.helperTextError),
  }

  return (
    <div style={containerStyle}>
      <textarea
        value={value}
        onChange={handleChange}
        rows={minRows}
        placeholder={sacredtheme ? 'Inscribe your sacred text...' : label}
        required={required}
        style={textareaStyle}
      />
      {helperText && <p style={helperTextStyle}>{helperText}</p>}
      {sacredtheme && (
        <>
          <div
            style={{
              ...sacredStyles.glyph,
              ...sacredStyles.glyphTopRight,
            }}
          >
            {rightGlyph}
          </div>
          <div
            style={{
              ...sacredStyles.glyph,
              ...sacredStyles.glyphBottomLeft,
            }}
          >
            {leftGlyph}
          </div>
        </>
      )}
    </div>
  )
}

export default SimpleEditor
