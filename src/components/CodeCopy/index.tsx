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
  type CSSProperties,
  type FC,
} from 'react'
import Button from '../../components/Button'
import hljs from 'highlight.js'
import cssStyles from './CodeCopy.module.css'

// --------------------------------------------------------------------------
// PUBLIC STYLE OPTIONS
// --------------------------------------------------------------------------

export interface CodeCopyStyles {
  /** Theme selection: light, dark, or sacred */
  theme?: 'light' | 'dark' | 'sacred'
  /** Whether the component is disabled */
  disabled?: boolean
  /** Custom container background color */
  containerBackground?: string
  /** Custom header background color */
  headerBackground?: string
  /** Custom code block background color */
  codeBackground?: string
  /** Custom text color */
  textColor?: string
  /** Custom border color */
  borderColor?: string
  /** Custom border radius */
  borderRadius?: string
  /** Custom font family for code */
  fontFamily?: string
  /** Custom font size for code */
  fontSize?: string
  /** Custom line height for code */
  lineHeight?: string
  /** Whether to show line numbers */
  showLineNumbers?: boolean
}

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
// MAIN CODE COPY COMPONENT
// --------------------------------------------------------------------------

/**
 * A code display component with syntax highlighting and copy functionality.
 */
const CodeCopy: FC<CodeCopyProps> = props => {
  const { code, language, styles, ...rest } = props

  const codeRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  const theme = styles?.theme || 'dark'
  const isSacredTheme = theme === 'sacred'
  const shouldShowLineNumbers = styles?.showLineNumbers !== false

  const lineNumbers = useMemo(
    () => Array.from({ length: code.split('\n').length }, (_, i) => i + 1),
    [code]
  )

  // Caller-supplied overrides stay in JS — only applied when provided so
  // the CSS-module defaults win otherwise. Each maps to the exact property
  // the old getCodeCopyStyles() spread onto its respective element. These
  // are plain derived consts; the React Compiler memoizes them automatically
  // (manual useMemo here trips react-hooks/preserve-manual-memoization since
  // the inferred dep is the whole `styles` object).
  const containerOverrides: CSSProperties = {}
  if (styles?.containerBackground)
    containerOverrides.backgroundColor = styles.containerBackground
  if (styles?.borderColor) containerOverrides.borderColor = styles.borderColor
  if (styles?.borderRadius)
    containerOverrides.borderRadius = styles.borderRadius
  const containerStyle = Object.keys(containerOverrides).length
    ? containerOverrides
    : undefined

  const headerStyle: CSSProperties | undefined = styles?.headerBackground
    ? { backgroundColor: styles.headerBackground }
    : undefined

  const langTextStyle: CSSProperties | undefined = styles?.textColor
    ? { color: styles.textColor }
    : undefined

  const codeBlockStyle: CSSProperties | undefined = styles?.codeBackground
    ? { backgroundColor: styles.codeBackground }
    : undefined

  const preOverrides: CSSProperties = {}
  if (styles?.fontFamily) preOverrides.fontFamily = styles.fontFamily
  if (styles?.fontSize) preOverrides.fontSize = styles.fontSize
  if (styles?.lineHeight) preOverrides.lineHeight = styles.lineHeight
  if (styles?.textColor) preOverrides.color = styles.textColor
  const preStyle = Object.keys(preOverrides).length ? preOverrides : undefined

  const handleCopy = useCallback(() => {
    if (styles?.disabled) return

    const codeElement = codeRef.current
    if (!codeElement) return

    const markCopied = () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(codeElement.innerText).then(markCopied)
      return
    }
    // Fallback for non-secure contexts where the Clipboard API is unavailable.
    const textArea = document.createElement('textarea')
    textArea.value = codeElement.innerText
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    textArea.remove()
    markCopied()
  }, [styles?.disabled])

  // Apply syntax highlighting. The sacred-theme token recoloring that used
  // to run imperatively here now lives in CodeCopy.module.css under
  // [data-theme='sacred'] .pre :global(.hljs-*), so this effect only needs
  // to invoke highlight.js.
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current)
    }
  }, [code, language])

  return (
    <div
      className={cssStyles.container}
      data-component="CodeCopy"
      data-theme={theme}
      data-disabled={styles?.disabled ? 'true' : undefined}
      style={containerStyle}
      {...rest}
    >
      {isSacredTheme && <div className={cssStyles.shimmer} />}

      <div className={cssStyles.header} style={headerStyle}>
        <div className={cssStyles.langIndicator}>
          <span className={cssStyles.langText} style={langTextStyle}>
            {language}
          </span>
        </div>
        <div className={cssStyles.copyButtonSlot}>
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
                // The gold hover glow lives in CodeCopy.module.css
                // (.copyButtonSlot button:hover under [data-theme='sacred']) —
                // ButtonStyles has no hover text/glow keys.
                hoverBorderColor: 'rgba(255, 215, 0, 0.8)',
              }),
            }}
            disabled={styles?.disabled}
          />
        </div>
      </div>

      <div className={cssStyles.codeBlock} style={codeBlockStyle}>
        {shouldShowLineNumbers && (
          <div className={cssStyles.lineNumbers}>
            {lineNumbers.map(num => (
              <div key={num} className={cssStyles.lineNumber}>
                {num}
              </div>
            ))}
          </div>
        )}
        <pre className={cssStyles.pre} style={preStyle}>
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
