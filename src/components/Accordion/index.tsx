// src/components/Accordion/index.tsx
'use client'
import React, { useState, useEffect, FC, ReactNode } from 'react'
import ExpandMoreIcon from '../Icons/ExpandMore'

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

// Sacred theme CSS styles
const sacredStyles = {
  container: {
    marginBottom: '8px',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    boxShadow:
      '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
    backdropFilter: 'blur(4px)',
    backgroundImage: `
      radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  containerHover: {
    transform: 'translateY(-2px)',
    borderColor: 'rgba(255, 215, 0, 0.6)',
    boxShadow:
      '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
  } as React.CSSProperties,

  containerExpanded: {
    borderColor: '#FFD700',
    boxShadow:
      '0 0 40px rgba(255, 215, 0, 0.6), 0 0 80px rgba(255, 215, 0, 0.3)',
    backgroundImage: `
      linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),
      radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  summary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
    transition: 'all 0.3s ease',
    position: 'relative',
    backgroundColor: 'transparent',
    color: 'rgba(255, 215, 0, 0.9)',
    fontFamily: '"Cinzel", serif',
    fontWeight: 600,
    fontSize: '20px',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    minHeight: '64px',
    textShadow: '0 0 10px #FFD700, 0 0 20px rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,

  summaryHover: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    color: '#FFD700',
    textShadow: '0 0 15px #FFD700, 0 0 30px rgba(255, 215, 0, 0.7)',
  } as React.CSSProperties,

  summaryExpanded: {
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
    color: '#FFD700',
    textShadow: '0 0 20px #FFD700, 0 0 40px rgba(255, 215, 0, 0.8)',
  } as React.CSSProperties,

  details: {
    padding: '24px',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderTop: '1px solid rgba(255, 215, 0, 0.2)',
    color: 'rgba(245, 245, 220, 0.9)',
    fontFamily: '"Merriweather", serif',
    lineHeight: 1.6,
    backdropFilter: 'blur(2px)',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    color: 'rgba(255, 215, 0, 0.4)',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    opacity: 0,
  } as React.CSSProperties,

  glyphLeft: {
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
  } as React.CSSProperties,

  glyphRight: {
    right: '48px',
    top: '50%',
    transform: 'translateY(-50%)',
  } as React.CSSProperties,

  glyphVisible: {
    opacity: 1,
  } as React.CSSProperties,

  glyphExpanded: {
    opacity: 1,
    animation: 'sacredGlyphRotate 20s linear infinite',
  } as React.CSSProperties,

  icon: {
    width: '24px',
    height: '24px',
    transition: 'all 0.3s ease',
    color: '#FFD700',
    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
  } as React.CSSProperties,

  iconExpanded: {
    transform: 'rotate(180deg)',
    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.9))',
  } as React.CSSProperties,

  backgroundGlyphs: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    color: 'rgba(255, 215, 0, 0.2)',
    fontSize: '12px',
    animation: 'sacredFloat 3s ease-in-out infinite',
    pointerEvents: 'none',
  } as React.CSSProperties,

  decorativeGlyphs: {
    position: 'absolute',
    bottom: '8px',
    right: '16px',
    display: 'flex',
    gap: '4px',
    opacity: 0.3,
  } as React.CSSProperties,

  decorativeGlyph: {
    color: '#FFD700',
    fontSize: '12px',
    animation: 'sacredGlow 3s ease-in-out infinite',
  } as React.CSSProperties,
}

// Premium theme CSS styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    marginBottom: '12px',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    backdropFilter: 'blur(8px)',
  } as React.CSSProperties,

  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
    background: 'rgba(255, 255, 255, 0.6)',
  } as React.CSSProperties,

  containerHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  } as React.CSSProperties,

  containerExpanded: {
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
    background:
      'linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)',
  } as React.CSSProperties,

  summary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    backgroundColor: 'rgba(248, 250, 252, 0.5)',
    color: 'rgb(31, 41, 55)',
    fontFamily: '"Inter", sans-serif',
    fontWeight: 600,
    fontSize: '18px',
    letterSpacing: '-0.025em',
    cursor: 'pointer',
    minHeight: '72px',
    borderBottom: '1px solid transparent',
  } as React.CSSProperties,

  summaryHover: {
    backgroundColor: 'rgba(239, 246, 255, 0.6)',
    color: 'rgb(29, 78, 216)',
    transform: 'translateX(4px)',
  } as React.CSSProperties,

  summaryExpanded: {
    backgroundColor: 'rgba(239, 246, 255, 0.8)',
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
    color: 'rgb(29, 78, 216)',
    fontWeight: 700,
  } as React.CSSProperties,

  details: {
    padding: '24px',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTop: '1px solid rgba(226, 232, 240, 0.5)',
    color: 'rgb(55, 65, 81)',
    fontFamily: '"Inter", sans-serif',
    fontSize: '16px',
    lineHeight: 1.7,
    backdropFilter: 'blur(4px)',
  } as React.CSSProperties,

  detailsNoOutline: {
    borderTop: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  } as React.CSSProperties,

  icon: {
    width: '24px',
    height: '24px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: 'rgb(107, 114, 128)',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
  } as React.CSSProperties,

  iconHover: {
    color: 'rgb(29, 78, 216)',
    transform: 'scale(1.1)',
    filter: 'drop-shadow(0 2px 4px rgba(29, 78, 216, 0.2))',
  } as React.CSSProperties,

  iconExpanded: {
    transform: 'rotate(180deg) scale(1.1)',
    color: 'rgb(29, 78, 216)',
    filter: 'drop-shadow(0 2px 4px rgba(29, 78, 216, 0.3))',
  } as React.CSSProperties,

  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background:
      'linear-gradient(180deg, rgb(59, 130, 246) 0%, rgb(147, 197, 253) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  } as React.CSSProperties,

  accentVisible: {
    opacity: 1,
  } as React.CSSProperties,

  shimmer: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
    transition: 'left 0.5s ease',
  } as React.CSSProperties,

  shimmerActive: {
    left: '100%',
  } as React.CSSProperties,
}

export interface AccordionProps {
  /** Content displayed in the accordion header */
  summary: ReactNode
  /** Content displayed when accordion is expanded */
  details: ReactNode
  /** Controls expanded state (for controlled component) */
  expanded?: boolean
  /** Sets initial expanded state (for uncontrolled component) */
  defaultExpanded?: boolean
  /** Callback fired when expanded state changes */
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void
  /** Disables the accordion if true */
  disabled?: boolean
  /** Custom styles applied to the accordion */
  style?: React.CSSProperties
  /** Enable Egyptian/Sacred theming */
  sacredtheme?: boolean
  /** Show/hide the outline border (default: true) */
  outline?: boolean
}

const Accordion: FC<AccordionProps> = ({
  summary,
  details,
  style,
  expanded: controlledExpanded,
  defaultExpanded = false,
  onChange,
  disabled = false,
  sacredtheme = false,
  outline = true,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(
    controlledExpanded !== undefined ? !!controlledExpanded : !!defaultExpanded
  )
  const [isHovered, setIsHovered] = useState(false)

  const isControlled = controlledExpanded !== undefined
  const expanded = isControlled ? controlledExpanded : internalExpanded

  const handleToggle = (event: React.SyntheticEvent) => {
    if (disabled) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    const newExpanded = !expanded

    if (isControlled) {
      onChange?.(event, newExpanded)
    } else {
      setInternalExpanded(newExpanded)
      onChange?.(event, newExpanded)
    }
  }

  useEffect(() => {
    if (isControlled) {
      setInternalExpanded(controlledExpanded)
    }
  }, [controlledExpanded, isControlled])

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes sacredGlow {
          0%, 100% { text-shadow: 0 0 10px #FFD700, 0 0 20px rgba(255, 215, 0, 0.5); }
          50% { text-shadow: 0 0 20px #FFD700, 0 0 30px rgba(255, 215, 0, 0.8); }
        }
        @keyframes sacredFloat {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-3px); opacity: 0.6; }
        }
        @keyframes sacredGlyphRotate {
          from { transform: translateY(-50%) rotate(0deg); }
          to { transform: translateY(-50%) rotate(360deg); }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [sacredtheme])

  if (sacredtheme) {
    const containerStyle = {
      ...sacredStyles.container,
      ...(expanded && sacredStyles.containerExpanded),
      ...(isHovered && sacredStyles.containerHover),
      ...(!outline && { border: 'none', boxShadow: 'none' }),
      ...style,
    }

    const summaryStyle = {
      ...sacredStyles.summary,
      ...(isHovered && sacredStyles.summaryHover),
      ...(expanded && sacredStyles.summaryExpanded),
    }

    const iconStyle = {
      ...sacredStyles.icon,
      ...(expanded && sacredStyles.iconExpanded),
    }

    return (
      <div style={containerStyle}>
        {/* Sacred background glyphs */}
        <div style={sacredStyles.backgroundGlyphs}>{SACRED_GLYPHS[0]}</div>

        <div
          style={summaryStyle}
          onClick={handleToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleToggle(e)
            }
          }}
          aria-expanded={expanded}
          aria-controls="accordion-content"
          data-testid="accordion-summary"
        >
          {/* Left glyph */}
          <div
            style={{
              ...sacredStyles.glyph,
              ...sacredStyles.glyphLeft,
              ...(isHovered && sacredStyles.glyphVisible),
              ...(expanded && sacredStyles.glyphExpanded),
            }}
          >
            {SACRED_GLYPHS[3]}
          </div>

          <div style={{ flex: 1, paddingLeft: '24px', paddingRight: '24px' }}>
            {summary}
          </div>

          {/* Right glyph */}
          <div
            style={{
              ...sacredStyles.glyph,
              ...sacredStyles.glyphRight,
              ...(isHovered && sacredStyles.glyphVisible),
              ...(expanded && sacredStyles.glyphExpanded),
            }}
          >
            {SACRED_GLYPHS[7]}
          </div>

          <ExpandMoreIcon style={iconStyle} />
        </div>

        {expanded && (
          <div style={sacredStyles.details}>
            <div style={{ position: 'relative', zIndex: 1 }}>{details}</div>
            {/* Sacred glyph decorations */}
            <div style={sacredStyles.decorativeGlyphs}>
              <span
                style={{
                  ...sacredStyles.decorativeGlyph,
                  animationDelay: '0s',
                }}
              >
                {SACRED_GLYPHS[20]}
              </span>
              <span
                style={{
                  ...sacredStyles.decorativeGlyph,
                  animationDelay: '1s',
                }}
              >
                {SACRED_GLYPHS[21]}
              </span>
              <span
                style={{
                  ...sacredStyles.decorativeGlyph,
                  animationDelay: '2s',
                }}
              >
                {SACRED_GLYPHS[22]}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Premium theme using CSS-in-JS
  const containerStyle = {
    ...premiumStyles.container,
    ...(!outline && premiumStyles.containerNoOutline),
    ...(isHovered && premiumStyles.containerHover),
    ...(expanded && premiumStyles.containerExpanded),
    ...(disabled && { opacity: 0.7 }),
    ...style,
  }

  const summaryStyle = {
    ...premiumStyles.summary,
    ...(isHovered && premiumStyles.summaryHover),
    ...(expanded && premiumStyles.summaryExpanded),
    ...(disabled && { cursor: 'not-allowed' }),
  }

  const iconStyle = {
    ...premiumStyles.icon,
    ...(isHovered && premiumStyles.iconHover),
    ...(expanded && premiumStyles.iconExpanded),
    ...(disabled && { color: 'rgb(156, 163, 175)' }),
  }

  const detailsStyle = {
    ...premiumStyles.details,
    ...(!outline && premiumStyles.detailsNoOutline),
  }

  return (
    <div style={containerStyle}>
      {/* Blue accent bar */}
      <div
        style={{
          ...premiumStyles.accent,
          ...(isHovered && premiumStyles.accentVisible),
        }}
      />

      {/* Shimmer effect on expand */}
      {expanded && (
        <div
          style={{
            ...premiumStyles.shimmer,
            ...premiumStyles.shimmerActive,
          }}
        />
      )}

      <div
        style={summaryStyle}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle(e)
          }
        }}
        aria-expanded={expanded}
        aria-controls="accordion-content"
        data-testid="accordion-summary"
      >
        <div style={{ flex: 1 }}>{summary}</div>
        <ExpandMoreIcon style={iconStyle} />
      </div>

      {expanded && <div style={detailsStyle}>{details}</div>}
    </div>
  )
}

Accordion.displayName = 'Accordion'
export default Accordion
