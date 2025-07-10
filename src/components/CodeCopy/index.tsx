// src/components/CodeCopy/index.tsx

'use client'

import React, { useRef, useEffect, useState } from 'react'
import CustomButton from '../../components/Button'
import ContentCopyIcon from '../Icons/ContentCopy'
import hljs from 'highlight.js'
import { SACRED_GLYPHS } from '../../styles/sacredGlyphs'

export interface CodeCopyProps {
  code: string
  language: string
  sacredtheme?: boolean
}

const getStyles = (sacredtheme?: boolean) => ({
  container: {
    position: 'relative',
    borderRadius: '0px',
    borderWidth: '0px',
    backgroundColor: 'black',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    ...(sacredtheme && {
      backgroundColor: '#1C1917',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      animation: 'sacred-box-glow 2s infinite alternate',
    }),
  } as React.CSSProperties,
  shimmer: {
    '::before': {
      content: '""',
      position: 'absolute',
      inset: '0px',
      backgroundImage:
        'linear-gradient(to bottom right, transparent, rgba(255, 215, 0, 0.05), transparent)',
      backgroundSize: '200% 100%',
      animation: 'sacred-code-shimmer 4s linear infinite',
      pointerEvents: 'none',
      zIndex: 10,
    },
  } as React.CSSProperties,
  header: {
    height: '2.5rem',
    width: '100%',
    backgroundColor: '#D1D5DB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
    borderTopLeftRadius: 'inherit',
    borderTopRightRadius: 'inherit',
    position: 'relative',
    zIndex: 20,
    ...(sacredtheme && {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
      backgroundImage:
        'linear-gradient(to right, rgba(255, 215, 0, 0.1), transparent)',
    }),
  } as React.CSSProperties,
  langIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties,
  langGlyph: {
    color: 'rgba(255, 215, 0, 0.6)',
    fontSize: '0.875rem',
    animation: 'glyph-rotate 10s linear infinite',
  } as React.CSSProperties,
  langText: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    ...(sacredtheme
      ? {
          color: 'rgba(255, 215, 0, 0.8)',
          fontFamily: 'Cinzel, serif',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textShadow: '0 0 2px rgba(255,215,0,0.3)',
        }
      : {
          color: 'black',
          fontFamily: 'monospace',
        }),
  } as React.CSSProperties,
  codeBlock: {
    backgroundColor: sacredtheme ? 'transparent' : 'black',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.9)' : 'white',
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    position: 'relative',
    zIndex: 20,
  } as React.CSSProperties,
  lineNumbers: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRight: '1px solid rgba(255, 215, 0, 0.2)',
    padding: '1rem 0.5rem',
    userSelect: 'none',
    position: 'relative',
  } as React.CSSProperties,
  lineNumbersGlyph: {
    position: 'absolute',
    top: '0.25rem',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255, 215, 0, 0.2)',
    fontSize: '0.75rem',
  } as React.CSSProperties,
  lineNumber: {
    color: 'rgba(255, 215, 0, 0.4)',
    fontSize: '0.75rem',
    lineHeight: '1.5rem',
    fontFamily: 'monospace',
    textAlign: 'right',
    paddingRight: '0.5rem',
  } as React.CSSProperties,
  pre: {
    backgroundColor: 'transparent',
    margin: 0,
    flexGrow: 1,
    padding: '1rem',
    overflow: 'auto',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    ...(sacredtheme && {
      color: 'rgba(255, 215, 0, 0.9)',
      textShadow: '0 0 2px rgba(255,215,0,0.2)',
    }),
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    fontSize: '1rem',
    color: 'rgba(255, 215, 0, 0.2)',
    pointerEvents: 'none',
    opacity: 0.3,
  } as React.CSSProperties,
})

const CodeCopy: React.FC<CodeCopyProps> = ({
  code,
  language,
  sacredtheme = false,
}) => {
  const codeRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const styles = getStyles(sacredtheme)

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current)
      if (sacredtheme && codeRef.current) {
        const keywords = codeRef.current.querySelectorAll('.hljs-keyword')
        keywords.forEach(el => {
          ;(el as HTMLElement).style.color = '#FFD700'
          ;(el as HTMLElement).style.textShadow =
            '0 0 4px rgba(255, 215, 0, 0.5)'
        })
        const strings = codeRef.current.querySelectorAll('.hljs-string')
        strings.forEach(el => {
          ;(el as HTMLElement).style.color = 'rgba(255, 215, 0, 0.8)'
        })
        const comments = codeRef.current.querySelectorAll('.hljs-comment')
        comments.forEach(el => {
          ;(el as HTMLElement).style.color = 'rgba(255, 215, 0, 0.5)'
          ;(el as HTMLElement).style.fontStyle = 'italic'
        })
        const functions = codeRef.current.querySelectorAll(
          '.hljs-function, .hljs-title'
        )
        functions.forEach(el => {
          ;(el as HTMLElement).style.color = 'rgba(255, 215, 0, 0.9)'
        })
      }
    }
  }, [code, language, sacredtheme])

  const handleCopy = () => {
    const codeElement = codeRef.current
    if (codeElement) {
      const textArea = document.createElement('textarea')
      textArea.value = codeElement.innerText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    }
  }

  const lineCount = code.split('\n').length
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)

  return (
    <div style={{ ...styles.container, ...(sacredtheme && styles.shimmer) }}>
      <div style={styles.header}>
        <div style={styles.langIndicator}>
          {sacredtheme && (
            <span style={styles.langGlyph}>{SACRED_GLYPHS[5]}</span>
          )}
          <span style={styles.langText}>{language}</span>
        </div>
        <CustomButton
          text={copied ? 'Copied!' : 'Copy Code'}
          icon={
            <ContentCopyIcon
              style={{
                animation:
                  copied && sacredtheme ? 'copy-success 0.5s ease-out' : '',
              }}
            />
          }
          iconlocation="left"
          fontcolor={sacredtheme ? '#FFD700' : 'black'}
          iconcolor={sacredtheme ? '#FFD700' : 'black'}
          backgroundcolor="none"
          onClick={handleCopy}
          sacredtheme={sacredtheme}
        />
      </div>

      <div style={styles.codeBlock}>
        {sacredtheme && (
          <div style={styles.lineNumbers}>
            <div style={styles.lineNumbersGlyph}>{SACRED_GLYPHS[11]}</div>
            {lineNumbers.map(num => (
              <div
                key={num}
                style={{
                  ...styles.lineNumber,
                  animation: `line-number-glow ${3 + (num % 3)}s ease-in-out infinite`,
                  animationDelay: `${num * 0.1}s`,
                }}
              >
                {num}
              </div>
            ))}
          </div>
        )}
        <pre style={styles.pre}>
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>
        {sacredtheme && (
          <>
            <div
              style={{
                ...styles.glyph,
                bottom: '0.5rem',
                right: '0.5rem',
                fontSize: '3.75rem',
                pointerEvents: 'none',
              }}
            >
              {SACRED_GLYPHS[18]}
            </div>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                gap: '0.5rem',
                opacity: 0.05,
                pointerEvents: 'none',
              }}
            >
              {[SACRED_GLYPHS[8], SACRED_GLYPHS[12], SACRED_GLYPHS[16]].map(
                (glyph, i) => (
                  <div
                    key={i}
                    style={{
                      color: '#FFD700',
                      fontSize: '1.5rem',
                      animation: `sacred-glyph-float ${4 + i}s infinite`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  >
                    {glyph}
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CodeCopy
