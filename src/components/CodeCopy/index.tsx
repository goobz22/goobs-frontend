/**
 * @fileoverview Defines the CodeCopy component, a block for displaying and copying code snippets.
 */
'use client'

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type FC,
} from 'react'
import Button from '../../components/Button'
import hljs from 'highlight.js'
import { getCodeCopyStyles, type CodeCopyStyles } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface CodeCopyProps {
  /** Code content to display and copy */
  code: string
  /** Programming language for syntax highlighting */
  language: string
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: CodeCopyStyles
}

// --------------------------------------------------------------------------
// SACRED THEME COMPONENTS
// --------------------------------------------------------------------------

const SacredGlyphs: FC = () => {
  return null
}

const SacredLineNumbers: FC<{
  lineNumbers: number[]
  computedStyles: ReturnType<typeof getCodeCopyStyles>
}> = ({ lineNumbers, computedStyles }) => {
  return (
    <div style={computedStyles.lineNumbers}>
      {lineNumbers.map(num => (
        <div
          key={num}
          style={{
            ...computedStyles.lineNumber,
            animation: `line-number-glow ${3 + (num % 3)}s ease-in-out infinite`,
            animationDelay: `${num * 0.1}s`,
          }}
        >
          {num}
        </div>
      ))}
    </div>
  )
}

// --------------------------------------------------------------------------
// MAIN CODE COPY COMPONENT
// --------------------------------------------------------------------------

/**
 * A code display component with syntax highlighting and copy functionality.
 */
const CodeCopy: FC<CodeCopyProps> = props => {
  const { code, language, styles, ...rest } = props

  const codeRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  const computedStyles = useMemo(
    () => getCodeCopyStyles(styles, styles?.disabled),
    [styles]
  )

  const lineNumbers = useMemo(
    () => Array.from({ length: code.split('\n').length }, (_, i) => i + 1),
    [code]
  )

  const handleCopy = useCallback(() => {
    if (styles?.disabled) return

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
  }, [styles?.disabled])

  // Apply syntax highlighting
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current)

      // Sacred theme specific highlighting
      if (styles?.theme === 'sacred' && codeRef.current) {
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
  }, [code, language, styles?.theme])

  const isSacredTheme = styles?.theme === 'sacred'
  const shouldShowLineNumbers = styles?.showLineNumbers !== false

  return (
    <div style={computedStyles.container} {...rest}>
      {isSacredTheme && <div style={computedStyles.shimmer} />}
      {isSacredTheme && <SacredGlyphs />}

      <div style={computedStyles.header}>
        <div
          style={{
            ...computedStyles.langIndicator,
            flexShrink: 1,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              ...computedStyles.langText,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {language}
          </span>
        </div>
        <div
          style={{
            flexShrink: 1,
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
            maxWidth: '30%',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            text={copied ? '✓' : '⧉'}
            onClick={handleCopy}
            styles={{
              ...(!isSacredTheme && { theme: styles?.theme || 'dark' }),
              backgroundColor: 'transparent',
              padding: '4px 6px',
              minHeight: '28px',
              fontSize: '14px',
              borderRadius: '4px',
              borderWidth: '1px',
              borderColor: isSacredTheme
                ? 'rgba(255, 215, 0, 0.4)'
                : 'rgba(156, 163, 175, 0.4)',
              minWidth: '32px',
              maxWidth: '100%',
              ...(isSacredTheme && {
                color: '#FFD700',
                textShadow: '0 0 6px rgba(255, 215, 0, 0.4)',
                fontFamily: '"Cinzel", serif',
                fontWeight: 600,
                hoverColor: '#FFD700',
                hoverBorderColor: 'rgba(255, 215, 0, 0.8)',
                hoverTextShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
              }),
            }}
            disabled={styles?.disabled}
          />
        </div>
      </div>

      <div style={computedStyles.codeBlock}>
        {isSacredTheme && shouldShowLineNumbers && (
          <SacredLineNumbers
            lineNumbers={lineNumbers}
            computedStyles={computedStyles}
          />
        )}
        {!isSacredTheme && shouldShowLineNumbers && (
          <div style={computedStyles.lineNumbers}>
            {lineNumbers.map(num => (
              <div key={num} style={computedStyles.lineNumber}>
                {num}
              </div>
            ))}
          </div>
        )}
        <pre style={computedStyles.pre}>
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  )
}

CodeCopy.displayName = 'CodeCopy'
export default CodeCopy
