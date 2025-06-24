// src/components/CodeCopy/index.tsx

'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Box, keyframes, alpha } from '@mui/material'
import CustomButton from '../../components/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import hljs from 'highlight.js'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
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

const sacredGlow = keyframes`
  0% { 
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.2);
  }
  50% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.3);
  }
  100% { 
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.2);
  }
`

const sacredCodeShimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const glyphRotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const glyphFloat = keyframes`
  0% { transform: translateY(0px); opacity: 0.3; }
  50% { transform: translateY(-5px); opacity: 0.6; }
  100% { transform: translateY(0px); opacity: 0.3; }
`

const copySuccess = keyframes`
  0% { 
    transform: scale(1);
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
  }
  50% { 
    transform: scale(1.2);
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.9));
  }
  100% { 
    transform: scale(1);
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
  }
`

const lineNumberGlow = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
`

/**
 * Props for the CodeCopy component.
 */
export interface CodeCopyProps {
  /** The code to be displayed and copied */
  code: string
  /** The programming language of the code (for syntax highlighting) */
  language: string
  /** Enable Egyptian/Sacred theming */
  sacredtheme?: boolean
}

/**
 * CodeCopy component renders a code block with syntax highlighting and a copy button.
 * It uses highlight.js for syntax highlighting and provides a mechanism to copy the code to clipboard.
 */
const CodeCopy: React.FC<CodeCopyProps> = ({
  code,
  language,
  sacredtheme = false,
}) => {
  /** Reference to the code element for applying syntax highlighting */
  const codeRef = useRef<HTMLElement>(null)
  /** State for copy animation */
  const [copied, setCopied] = useState(false)

  /**
   * Effect to apply syntax highlighting when the component mounts or when code/language changes
   */
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current)

      // Apply sacred theme styles to highlighted code
      if (sacredtheme && codeRef.current) {
        // Add golden tint to syntax highlighting
        const keywords = codeRef.current.querySelectorAll('.hljs-keyword')
        keywords.forEach(el => {
          ;(el as HTMLElement).style.color = '#FFD700'
          ;(el as HTMLElement).style.textShadow =
            '0 0 4px rgba(255, 215, 0, 0.5)'
        })

        const strings = codeRef.current.querySelectorAll('.hljs-string')
        strings.forEach(el => {
          ;(el as HTMLElement).style.color = alpha('#FFD700', 0.8)
        })

        const comments = codeRef.current.querySelectorAll('.hljs-comment')
        comments.forEach(el => {
          ;(el as HTMLElement).style.color = alpha('#FFD700', 0.5)
          ;(el as HTMLElement).style.fontStyle = 'italic'
        })

        const functions = codeRef.current.querySelectorAll(
          '.hljs-function, .hljs-title'
        )
        functions.forEach(el => {
          ;(el as HTMLElement).style.color = alpha('#FFD700', 0.9)
        })
      }
    }
  }, [code, language, sacredtheme])

  /**
   * Handles the copying of code to clipboard
   */
  const handleCopy = () => {
    const codeElement = codeRef.current
    if (codeElement) {
      const textArea = document.createElement('textarea')
      textArea.value = codeElement.innerText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()

      // Trigger copy animation
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    }
  }

  // Generate line numbers
  const lineCount = code.split('\n').length
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 1,
        backgroundColor: sacredtheme ? '#0a0a0a' : 'black',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        border: sacredtheme ? `1px solid ${alpha('#FFD700', 0.3)}` : 'none',
        overflow: 'hidden',
        ...(sacredtheme && {
          animation: `${sacredGlow} 4s ease-in-out infinite`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, transparent, ${alpha('#FFD700', 0.05)}, transparent)`,
            backgroundSize: '200% 100%',
            animation: `${sacredCodeShimmer} 6s ease-in-out infinite`,
            pointerEvents: 'none',
            zIndex: 1,
          },
        }),
      }}
    >
      {/* Header with Copy Button */}
      <Box
        sx={{
          height: '40px',
          width: '100%',
          backgroundColor: sacredtheme ? alpha('#000000', 0.9) : 'grey.300',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 2,
          paddingRight: 2,
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
          position: 'relative',
          zIndex: 2,
          ...(sacredtheme && {
            borderBottom: `1px solid ${alpha('#FFD700', 0.3)}`,
            background: `linear-gradient(to right, ${alpha('#FFD700', 0.1)}, transparent)`,
          }),
        }}
      >
        {/* Language indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {sacredtheme && (
            <Box
              sx={{
                color: alpha('#FFD700', 0.6),
                fontSize: '14px',
                animation: `${glyphRotate} 15s linear infinite`,
              }}
            >
              {SACRED_GLYPHS[5]}
            </Box>
          )}
          <Box
            sx={{
              color: sacredtheme ? alpha('#FFD700', 0.8) : 'black',
              fontSize: '12px',
              fontFamily: sacredtheme ? '"Cinzel", serif' : 'monospace',
              fontWeight: sacredtheme ? 600 : 400,
              letterSpacing: sacredtheme ? '1px' : 'normal',
              textTransform: 'uppercase',
              ...(sacredtheme && {
                textShadow: '0 0 6px rgba(255, 215, 0, 0.4)',
              }),
            }}
          >
            {language}
          </Box>
        </Box>

        <CustomButton
          text={copied ? 'Copied!' : 'Copy Code'}
          variant="text"
          icon={
            <ContentCopyIcon
              sx={
                copied && sacredtheme
                  ? {
                      animation: `${copySuccess} 0.5s ease-out`,
                    }
                  : undefined
              }
            />
          }
          iconlocation="left"
          fontcolor={sacredtheme ? '#FFD700' : 'black'}
          iconcolor={sacredtheme ? '#FFD700' : 'black'}
          onClick={handleCopy}
          sacredtheme={sacredtheme}
        />
      </Box>

      {/* Code Block */}
      <Box
        sx={{
          backgroundColor: sacredtheme ? 'transparent' : 'black',
          color: sacredtheme ? alpha('#FFD700', 0.9) : 'white',
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Line numbers */}
        {sacredtheme && (
          <Box
            sx={{
              backgroundColor: alpha('#000000', 0.5),
              borderRight: `1px solid ${alpha('#FFD700', 0.2)}`,
              padding: '16px 8px',
              userSelect: 'none',
              position: 'relative',
              '&::before': {
                content: `"${SACRED_GLYPHS[11]}"`,
                position: 'absolute',
                top: '4px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: alpha('#FFD700', 0.2),
                fontSize: '10px',
              },
            }}
          >
            {lineNumbers.map(num => (
              <Box
                key={num}
                sx={{
                  color: alpha('#FFD700', 0.4),
                  fontSize: '12px',
                  lineHeight: '1.5',
                  fontFamily: 'monospace',
                  textAlign: 'right',
                  paddingRight: '8px',
                  animation: `${lineNumberGlow} ${3 + (num % 3)}s ease-in-out infinite`,
                  animationDelay: `${num * 0.1}s`,
                }}
              >
                {num}
              </Box>
            ))}
          </Box>
        )}

        <pre
          style={{
            backgroundColor: 'transparent',
            color: sacredtheme ? alpha('#FFD700', 0.9) : 'white',
            margin: 0,
            flexGrow: 1,
            padding: '16px',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          <code
            ref={codeRef}
            className={`language-${language}`}
            style={
              sacredtheme
                ? {
                    textShadow: '0 0 2px rgba(255, 215, 0, 0.3)',
                  }
                : undefined
            }
          >
            {code}
          </code>
        </pre>

        {/* Sacred decorative elements */}
        {sacredtheme && (
          <>
            <Box
              sx={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                color: alpha('#FFD700', 0.1),
                fontSize: '64px',
                animation: `${glyphFloat} 6s ease-in-out infinite`,
                pointerEvents: 'none',
              }}
            >
              {SACRED_GLYPHS[18]}
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                gap: 2,
                opacity: 0.05,
                pointerEvents: 'none',
              }}
            >
              {[SACRED_GLYPHS[8], SACRED_GLYPHS[12], SACRED_GLYPHS[16]].map(
                (glyph, i) => (
                  <Box
                    key={i}
                    sx={{
                      color: '#FFD700',
                      fontSize: '24px',
                      animation: `${glyphFloat} ${4 + i}s ease-in-out infinite`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  >
                    {glyph}
                  </Box>
                )
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

export default CodeCopy
