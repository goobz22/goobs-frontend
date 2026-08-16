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
import { loadHighlighter } from './highlighter'
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
  const preRef = useRef<HTMLPreElement>(null)
  // Three-state copy status so the failure path is representable, not just
  // success. 'error' is reached only when BOTH the async Clipboard API and the
  // execCommand fallback fail — see handleCopy (WCAG 4.1.3 failure path).
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>(
    'idle'
  )
  // The <pre> becomes a keyboard-focusable, named scroll region ONLY when the
  // code actually overflows horizontally. Gating on measured overflow keeps
  // narrow snippets out of the tab order and stops screen readers announcing an
  // empty "group" for code that never scrolls, while still satisfying WCAG 2.1.1
  // / axe scrollable-region-focusable when the region truly scrolls. Overflow is
  // unknowable at SSR, so it is measured client-side in the effect below.
  const [isPreScrollable, setIsPreScrollable] = useState(false)

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

    const text = codeElement.innerText

    // Flash a transient status, then settle back to idle. The visible glyph and
    // the role="status" live region both read from copyStatus, so 'error' is
    // announced to assistive tech instead of a false success (WCAG 4.1.3).
    const flashStatus = (next: 'copied' | 'error') => {
      setCopyStatus(next)
      setTimeout(() => setCopyStatus('idle'), 1000)
    }

    // Fallback for non-secure contexts (no Clipboard API) OR a rejected async
    // clipboard write (permission denied / document not focused). Reports
    // 'error' when even execCommand fails, so a silent copy failure is never
    // mistaken for success by a screen-reader user.
    const copyViaExecCommand = () => {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      let succeeded = false
      try {
        succeeded = document.execCommand('copy')
      } catch {
        succeeded = false
      }
      textArea.remove()
      flashStatus(succeeded ? 'copied' : 'error')
    }

    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => flashStatus('copied'))
        .catch(copyViaExecCommand)
      return
    }
    copyViaExecCommand()
  }, [styles?.disabled])

  // Apply syntax highlighting. The sacred-theme token recoloring that used
  // to run imperatively here now lives in CodeCopy.module.css under
  // [data-theme='sacred'] .pre :global(.hljs-*), so this effect only needs
  // to invoke highlight.js.
  //
  // highlight.js is loaded HERE, on first render of a code block, rather than
  // imported at module scope — see ./highlighter for why (the all-languages
  // entry point registers 192 grammars as a module side effect, so importing
  // it statically put ~872 KB into every consumer route, code block or not).
  // The load is async, so the element is re-read from the ref after the await
  // and a `cancelled` flag drops results that arrive after the code/language
  // changed again or the component unmounted.
  useEffect(() => {
    let cancelled = false
    void loadHighlighter(language).then(hljs => {
      const codeElement = codeRef.current
      if (cancelled || !codeElement) return
      // highlight.js marks an element it has already processed and warns (and
      // no-ops) on a second pass. Re-highlighting is normal here — `code` and
      // `language` are props that change in place — so clear the marker first.
      // Previously the highlight ran synchronously on mount and this case was
      // rarer; making the load async makes re-entry the common path.
      delete codeElement.dataset.highlighted
      hljs.highlightElement(codeElement)
    })
    return () => {
      cancelled = true
    }
  }, [code, language])

  // Measure whether the <pre> overflows horizontally so its keyboard-focus
  // affordances (tabIndex/role/aria-label below) are applied ONLY when the code
  // truly scrolls. Runs on the client (overflow is unknowable at SSR) and
  // re-measures on resize via ResizeObserver; re-runs when the code/language
  // change since that changes the rendered width.
  useEffect(() => {
    const preElement = preRef.current
    if (!preElement) return
    const measureOverflow = () => {
      setIsPreScrollable(preElement.scrollWidth > preElement.clientWidth)
    }
    measureOverflow()
    const resizeObserver = new ResizeObserver(measureOverflow)
    resizeObserver.observe(preElement)
    return () => resizeObserver.disconnect()
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
            text={
              copyStatus === 'copied'
                ? '✓'
                : copyStatus === 'error'
                  ? '✕'
                  : '⧉'
            }
            onClick={handleCopy}
            action="copy"
            // The visible label is a bare ⧉ / ✓ glyph with no text meaning, so
            // the button carries a stable accessible name for assistive tech
            // (WCAG 4.1.2). The transient "Copied" confirmation is announced
            // separately through the role="status" live region below rather than
            // by mutating this name, so the button's name stays stable under a
            // screen-reader's virtual cursor. type="button" guards against an
            // implicit form submit if CodeCopy is ever placed inside a <form>.
            aria-label="Copy code"
            type="button"
            styles={{
              ...(!isSacredTheme && { theme: styles?.theme || 'dark' }),
              backgroundColor: 'transparent',
              padding: '4px 6px',
              minHeight: '28px',
              fontSize: '14px',
              borderRadius: '4px',
              borderWidth: '1px',
              borderColor: isSacredTheme
                ? 'var(--goobs-gold-a40)'
                : 'rgba(156, 163, 175, 0.4)',
              minWidth: '32px',
              maxWidth: '100%',
              ...(isSacredTheme && {
                color: 'var(--goobs-gold)',
                textShadow: '0 0 6px var(--goobs-gold-a40)',
                fontFamily: '"Cinzel", serif',
                fontWeight: 600,
                // The gold hover glow lives in CodeCopy.module.css
                // (.copyButtonSlot button:hover under [data-theme='sacred']) —
                // ButtonStyles has no hover text/glow keys.
                hoverBorderColor: 'var(--goobs-gold-a80)',
              }),
            }}
            disabled={styles?.disabled}
          />
        </div>
      </div>

      {/* Visually-hidden polite live region: announces the copy result to
          assistive tech (WCAG 4.1.3). Kept in the DOM at all times so the live
          region is registered before its text changes; the ⧉→✓/✕ glyph swap is
          a silent, visual-only cue otherwise. Both the success and the failure
          branch are announced so a rejected copy is never read as a success. */}
      <div role="status" aria-live="polite" className={cssStyles.srStatus}>
        {copyStatus === 'copied'
          ? 'Copied to clipboard'
          : copyStatus === 'error'
            ? 'Copy failed'
            : ''}
      </div>

      <div className={cssStyles.codeBlock} style={codeBlockStyle}>
        {shouldShowLineNumbers && (
          // Line numbers are a decorative visual affordance; hiding them from
          // assistive tech keeps "1 2 3 4 …" out of the code's reading order
          // (WCAG 1.3.1). The <code> below carries the real, readable content.
          <div className={cssStyles.lineNumbers} aria-hidden="true">
            {lineNumbers.map(num => (
              <div key={num} className={cssStyles.lineNumber}>
                {num}
              </div>
            ))}
          </div>
        )}
        {/* The <pre> is a horizontal-scroll container (overflow:auto) whenever a
            code line is wider than the block. Without a tabindex it is NOT
            keyboard-focusable in Chromium/WebKit, so a keyboard-only user cannot
            scroll to read clipped wide code (WCAG 2.1.1; axe
            scrollable-region-focusable). BUT these affordances are applied ONLY
            when the code actually overflows (isPreScrollable, measured above):
            a non-scrolling snippet stays out of the tab order and is not
            announced as an empty region, avoiding tab-stop / screen-reader noise
            on the common narrow case. When it DOES scroll: tabIndex=0 makes it
            focusable and arrow-scrollable; role="group" + aria-label give it an
            accessible name announced on focus. role="group" is deliberate over
            "region": it supports naming (so aria-label is not an
            aria-prohibited-attr on a bare <pre>) WITHOUT registering a landmark
            per snippet, and it is not a name-from-content role so the code text
            inside stays readable. */}
        <pre
          ref={preRef}
          className={cssStyles.pre}
          style={preStyle}
          tabIndex={isPreScrollable ? 0 : undefined}
          role={isPreScrollable ? 'group' : undefined}
          aria-label={isPreScrollable ? `${language} code` : undefined}
        >
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
