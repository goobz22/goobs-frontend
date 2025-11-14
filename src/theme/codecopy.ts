/**
 * @fileoverview CodeCopy component theme system with light, dark, and sacred themes.
 */
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface CodeCopyTheme {
  /** Base container styling */
  container: React.CSSProperties
  /** Header section styling */
  header: React.CSSProperties
  /** Language indicator styling */
  langIndicator: React.CSSProperties
  /** Language glyph styling (sacred theme only) */
  langGlyph: React.CSSProperties
  /** Language text styling */
  langText: React.CSSProperties
  /** Code block container styling */
  codeBlock: React.CSSProperties
  /** Line numbers section styling */
  lineNumbers: React.CSSProperties
  /** Line numbers glyph styling (sacred theme only) */
  lineNumbersGlyph: React.CSSProperties
  /** Individual line number styling */
  lineNumber: React.CSSProperties
  /** Pre element styling */
  pre: React.CSSProperties
  /** Sacred shimmer effect styling */
  shimmer: React.CSSProperties
  /** Sacred decorative glyph styling */
  glyph: React.CSSProperties
}

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
  /** Custom animation duration for sacred theme */
  animationDuration?: string
}

const lightTheme: CodeCopyTheme = {
  container: {
    position: 'relative',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #D1D5DB',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    transition: TRANSITIONS.medium,
    boxSizing: 'border-box',
  },
  header: {
    height: '2.5rem',
    width: '100%',
    maxWidth: '100%',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
    borderTopLeftRadius: 'inherit',
    borderTopRightRadius: 'inherit',
    borderBottom: '1px solid #D1D5DB',
    position: 'relative',
    zIndex: 20,
    overflow: 'hidden',
    minWidth: 0,
    boxSizing: 'border-box',
  },
  langIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  langGlyph: {
    display: 'none',
  },
  langText: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: '#374151',
    fontFamily: 'monospace',
    fontWeight: 600,
    letterSpacing: '0.05em',
  },
  codeBlock: {
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    position: 'relative',
    zIndex: 20,
  },
  lineNumbers: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRight: '1px solid #D1D5DB',
    padding: '1rem 0.5rem',
    userSelect: 'none',
    position: 'relative',
  },
  lineNumbersGlyph: {
    display: 'none',
  },
  lineNumber: {
    color: '#6B7280',
    fontSize: '0.75rem',
    lineHeight: '1.5rem',
    fontFamily: 'monospace',
    textAlign: 'right',
    paddingRight: '0.5rem',
  },
  pre: {
    backgroundColor: 'transparent',
    margin: 0,
    flexGrow: 1,
    padding: '1rem',
    overflow: 'auto',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    color: '#1F2937',
  },
  shimmer: {
    display: 'none',
  },
  glyph: {
    display: 'none',
  },
}

const darkTheme: CodeCopyTheme = {
  container: {
    position: 'relative',
    borderRadius: '8px',
    backgroundColor: '#1F2937',
    border: '1px solid #374151',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    transition: TRANSITIONS.medium,
    boxSizing: 'border-box',
  },
  header: {
    height: '2.5rem',
    width: '100%',
    maxWidth: '100%',
    backgroundColor: '#111827',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
    borderTopLeftRadius: 'inherit',
    borderTopRightRadius: 'inherit',
    borderBottom: '1px solid #374151',
    position: 'relative',
    zIndex: 20,
    overflow: 'hidden',
    minWidth: 0,
    boxSizing: 'border-box',
  },
  langIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  langGlyph: {
    display: 'none',
  },
  langText: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: '#D1D5DB',
    fontFamily: 'monospace',
    fontWeight: 600,
    letterSpacing: '0.05em',
  },
  codeBlock: {
    backgroundColor: '#000000',
    color: '#F9FAFB',
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    position: 'relative',
    zIndex: 20,
  },
  lineNumbers: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRight: '1px solid #374151',
    padding: '1rem 0.5rem',
    userSelect: 'none',
    position: 'relative',
  },
  lineNumbersGlyph: {
    display: 'none',
  },
  lineNumber: {
    color: '#9CA3AF',
    fontSize: '0.75rem',
    lineHeight: '1.5rem',
    fontFamily: 'monospace',
    textAlign: 'right',
    paddingRight: '0.5rem',
  },
  pre: {
    backgroundColor: 'transparent',
    margin: 0,
    flexGrow: 1,
    padding: '1rem',
    overflow: 'auto',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    color: '#F9FAFB',
  },
  shimmer: {
    display: 'none',
  },
  glyph: {
    display: 'none',
  },
}

const sacredTheme: CodeCopyTheme = {
  container: {
    position: 'relative',
    borderRadius: '0px',
    backgroundColor: '#1C1917',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    boxShadow: SHADOWS.sacred.medium,
    boxSizing: 'border-box',
  },
  header: {
    height: '2.5rem',
    width: '100%',
    maxWidth: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
    backgroundImage:
      'linear-gradient(to right, rgba(255, 215, 0, 0.1), transparent)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
    borderTopLeftRadius: 'inherit',
    borderTopRightRadius: 'inherit',
    position: 'relative',
    zIndex: 20,
    overflow: 'hidden',
    minWidth: 0,
    boxSizing: 'border-box',
  },
  langIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  langGlyph: {
    color: 'rgba(255, 215, 0, 0.6)',
    fontSize: '0.875rem',
  },
  langText: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: 'rgba(255, 215, 0, 0.8)',
    fontFamily: 'Cinzel, serif',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textShadow: '0 0 2px rgba(255,215,0,0.3)',
  },
  codeBlock: {
    backgroundColor: 'transparent',
    color: 'rgba(255, 215, 0, 0.9)',
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    position: 'relative',
    zIndex: 20,
  },
  lineNumbers: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRight: '1px solid rgba(255, 215, 0, 0.2)',
    padding: '1rem 0.5rem',
    userSelect: 'none',
    position: 'relative',
  },
  lineNumbersGlyph: {
    position: 'absolute',
    top: '0.25rem',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255, 215, 0, 0.2)',
    fontSize: '0.75rem',
  },
  lineNumber: {
    color: 'rgba(255, 215, 0, 0.4)',
    fontSize: '0.75rem',
    lineHeight: '1.5rem',
    fontFamily: 'monospace',
    textAlign: 'right',
    paddingRight: '0.5rem',
  },
  pre: {
    backgroundColor: 'transparent',
    margin: 0,
    flexGrow: 1,
    padding: '1rem',
    overflow: 'auto',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    color: 'rgba(255, 215, 0, 0.9)',
    textShadow: '0 0 2px rgba(255,215,0,0.2)',
  },
  shimmer: {
    position: 'absolute',
    inset: '0px',
    backgroundImage:
      'linear-gradient(to bottom right, transparent, rgba(255, 215, 0, 0.05), transparent)',
    backgroundSize: '200% 100%',
    pointerEvents: 'none',
    zIndex: 10,
  },
  glyph: {
    position: 'absolute',
    fontSize: '1rem',
    color: 'rgba(255, 215, 0, 0.2)',
    pointerEvents: 'none',
    opacity: 0.3,
  },
}

export const getCodeCopyStyles = (
  styles?: CodeCopyStyles,
  isDisabled?: boolean
): CodeCopyTheme => {
  const baseTheme =
    styles?.theme === 'light'
      ? lightTheme
      : styles?.theme === 'sacred'
        ? sacredTheme
        : darkTheme

  const customStyles: CodeCopyTheme = {
    container: {
      ...baseTheme.container,
      ...(styles?.containerBackground && {
        backgroundColor: styles.containerBackground,
      }),
      ...(styles?.borderColor && { borderColor: styles.borderColor }),
      ...(styles?.borderRadius && { borderRadius: styles.borderRadius }),
      ...(isDisabled && {
        opacity: 0.6,
        pointerEvents: 'none',
        filter: 'grayscale(0.5)',
      }),
    },
    header: {
      ...baseTheme.header,
      ...(styles?.headerBackground && {
        backgroundColor: styles.headerBackground,
      }),
    },
    langIndicator: baseTheme.langIndicator,
    langGlyph: baseTheme.langGlyph,
    langText: {
      ...baseTheme.langText,
      ...(styles?.textColor && { color: styles.textColor }),
    },
    codeBlock: {
      ...baseTheme.codeBlock,
      ...(styles?.codeBackground && { backgroundColor: styles.codeBackground }),
    },
    lineNumbers: {
      ...baseTheme.lineNumbers,
      ...(styles?.showLineNumbers === false && { display: 'none' }),
    },
    lineNumbersGlyph: baseTheme.lineNumbersGlyph,
    lineNumber: baseTheme.lineNumber,
    pre: {
      ...baseTheme.pre,
      ...(styles?.fontFamily && { fontFamily: styles.fontFamily }),
      ...(styles?.fontSize && { fontSize: styles.fontSize }),
      ...(styles?.lineHeight && { lineHeight: styles.lineHeight }),
      ...(styles?.textColor && { color: styles.textColor }),
    },
    shimmer: baseTheme.shimmer,
    glyph: baseTheme.glyph,
  }

  return customStyles
}
