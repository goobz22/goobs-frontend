'use client'

import React, { useState, useEffect } from 'react'
import { SACRED_GLYPHS } from '../../styles/sacredGlyphs'

interface WidgetProps {
  children: React.ReactNode
  sacredtheme?: boolean
  outline?: boolean
  disabled?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  widget: {
    position: 'relative',
    padding: '24px',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(229, 231, 235, 0.5)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)',
    fontFamily: 'Inter, system-ui, sans-serif',
  } as React.CSSProperties,

  widgetNoOutline: {
    border: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  } as React.CSSProperties,

  widgetHover: {
    transform: 'translateY(-2px)',
    boxShadow:
      '0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)',
  } as React.CSSProperties,

  widgetDisabled: {
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    cursor: 'not-allowed',
    opacity: 0.6,
    transform: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  } as React.CSSProperties,

  content: {
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  accent: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    height: '3px',
    background: 'linear-gradient(90deg, rgb(59, 130, 246), rgb(147, 197, 253))',
    borderRadius: '12px 12px 0 0',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  widget: {
    position: 'relative',
    padding: '32px',
    borderRadius: '16px',
    transition: 'all 0.4s ease',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    backdropFilter: 'blur(12px)',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    boxShadow:
      '0 0 30px rgba(255, 215, 0, 0.2), 0 0 60px rgba(255, 215, 0, 0.1)',
    fontFamily: 'Cinzel, serif',
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
    `,
    overflow: 'hidden',
  } as React.CSSProperties,

  widgetNoOutline: {
    border: 'none',
    boxShadow: 'none',
  } as React.CSSProperties,

  widgetHover: {
    transform: 'translateY(-4px) scale(1.02)',
    borderColor: 'rgba(255, 215, 0, 0.8)',
    boxShadow:
      '0 0 50px rgba(255, 215, 0, 0.4), 0 0 100px rgba(255, 215, 0, 0.2)',
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.15) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  widgetDisabled: {
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    borderColor: 'rgba(255, 215, 0, 0.2)',
    cursor: 'not-allowed',
    opacity: 0.6,
    transform: 'none',
    boxShadow: 'none',
  } as React.CSSProperties,

  content: {
    position: 'relative',
    zIndex: 10,
  } as React.CSSProperties,

  glyphContainer: {
    position: 'absolute',
    inset: '0',
    overflow: 'hidden',
    borderRadius: '16px',
    pointerEvents: 'none',
    zIndex: 1,
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    color: 'rgba(255, 215, 0, 0.2)',
    userSelect: 'none',
    pointerEvents: 'none',
    animation: 'sacredWidgetFloat 8s ease-in-out infinite',
  } as React.CSSProperties,

  glyphVisible: {
    color: 'rgba(255, 215, 0, 0.4)',
  } as React.CSSProperties,

  statusIndicator: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    opacity: 0.6,
    zIndex: 10,
  } as React.CSSProperties,

  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 215, 0, 0.6)',
    animation: 'sacredWidgetPulse 2s ease-in-out infinite',
  } as React.CSSProperties,

  statusText: {
    fontSize: '10px',
    color: 'rgba(255, 215, 0, 0.6)',
    fontWeight: '500',
  } as React.CSSProperties,

  shimmer: {
    position: 'absolute',
    top: '0',
    left: '-100%',
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
    animation: 'sacredWidgetShimmer 4s ease-in-out infinite',
    zIndex: 2,
  } as React.CSSProperties,
}

const Widget: React.FC<WidgetProps> = ({
  children,
  sacredtheme = false,
  outline = true,
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [glyphPositions, setGlyphPositions] = useState<
    Array<{
      top: number
      left: number
      glyph: string
      delay: number
      size: number
    }>
  >([])

  // Generate random glyph positions for sacred theme
  useEffect(() => {
    if (sacredtheme) {
      const positions = Array.from({ length: 8 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        glyph: SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)],
        delay: Math.random() * 8,
        size: Math.random() * 8 + 10,
      }))
      setGlyphPositions(positions)
    }
  }, [sacredtheme])

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes sacredWidgetFloat {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); opacity: 0.2; }
          25% { transform: translateY(-10px) rotateZ(2deg); opacity: 0.4; }
          50% { transform: translateY(-5px) rotateZ(-1deg); opacity: 0.3; }
          75% { transform: translateY(-8px) rotateZ(1deg); opacity: 0.4; }
        }
        @keyframes sacredWidgetPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes sacredWidgetShimmer {
          0% { left: '-100%'; }
          50% { left: '100%'; }
          100% { left: '100%'; }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [sacredtheme])

  const styles = sacredtheme ? sacredStyles : premiumStyles

  const widgetStyle = {
    ...styles.widget,
    ...(!outline && styles.widgetNoOutline),
    ...(isHovered && !disabled && styles.widgetHover),
    ...(disabled && styles.widgetDisabled),
  }

  return (
    <div
      style={widgetStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium theme accent */}
      {!sacredtheme && outline && <div style={premiumStyles.accent} />}

      {/* Sacred theme effects */}
      {sacredtheme && (
        <>
          <div style={sacredStyles.glyphContainer}>
            {glyphPositions.map((pos, i) => (
              <div
                key={i}
                style={{
                  ...sacredStyles.glyph,
                  ...(isHovered && sacredStyles.glyphVisible),
                  top: `${pos.top}%`,
                  left: `${pos.left}%`,
                  fontSize: `${pos.size}px`,
                  animationDelay: `${pos.delay}s`,
                }}
              >
                {pos.glyph}
              </div>
            ))}
          </div>

          {isHovered && <div style={sacredStyles.shimmer} />}

          <div style={sacredStyles.statusIndicator}>
            <div style={sacredStyles.statusDot} />
            <div style={sacredStyles.statusText}>Sacred Widget</div>
          </div>
        </>
      )}

      <div style={styles.content}>{children}</div>
    </div>
  )
}

export default Widget
export type { WidgetProps }
