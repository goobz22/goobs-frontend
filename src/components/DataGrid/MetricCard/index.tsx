'use client'
import React, { useState, useEffect } from 'react'
import type { DataGridStyles } from '../../../theme'

export interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  glyph?: string
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
}

// Enhanced sacred theming animations
const keyframes = `
@keyframes rotateGlyph {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes sacredGlow {
  0% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.5);
  }
  50% { 
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
    border-color: rgba(255, 215, 0, 0.8);
  }
  100% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.5);
  }
}

@keyframes floatAnimation {
  0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
  33% { transform: translateY(-3px) rotate(120deg); opacity: 0.6; }
  66% { transform: translateY(1px) rotate(240deg); opacity: 0.4; }
  100% { transform: translateY(0px) rotate(360deg); opacity: 0.3; }
}

@keyframes sacredShimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes dataStreamAnimation {
  0% { 
    transform: translateY(-100%);
    opacity: 0;
  }
  50% { 
    opacity: 0.3;
  }
  100% { 
    transform: translateY(100%);
    opacity: 0;
  }
}

@keyframes standardHover {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-4px); }
}

@keyframes sacredHover {
  0% { transform: translateY(0px) scale(1); }
  100% { transform: translateY(-8px) scale(1.02); }
}
`

// Enhanced sacred hieroglyphs
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

// Enhanced Egyptian styling constants
const egyptianStyles = {
  goldColor: '#FFD700',
  goldGradient:
    'linear-gradient(135deg, #FFD700 0%, #F4A460 50%, #DAA520 100%)',
  darkGold: '#B8860B',
  temple: '#1a1a2e',
  obsidian: '#16213e',
  turquoise: '#0f3460',
  textShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
  cardBackground: 'rgba(0, 0, 0, 0.85)',
  glowEffect:
    '0 0 30px rgba(255, 215, 0, 0.3), 0 0 60px rgba(255, 215, 0, 0.1)',
}

// Inject keyframes into document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = keyframes
  if (!document.head.querySelector('style[data-metric-card]')) {
    style.setAttribute('data-metric-card', 'true')
    document.head.appendChild(style)
  }
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  glyph,
  styles,
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedGlyph, setSelectedGlyph] = useState(glyph || SACRED_GLYPHS[0])
  const [isHydrated, setIsHydrated] = useState(false)
  const isSacredTheme = styles?.theme === 'sacred'

  // Set random glyph only on client side after hydration if no glyph prop provided
  useEffect(() => {
    if (!isHydrated && !glyph) {
      setSelectedGlyph(
        SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
      )
      setIsHydrated(true)
    }
  }, [isHydrated, glyph])

  const getColorValue = (colorName: string = 'primary') => {
    if (isSacredTheme) {
      switch (colorName) {
        case 'success':
          return '#10B981'
        case 'warning':
          return '#F59E0B'
        case 'error':
          return '#EF4444'
        case 'info':
          return '#3B82F6'
        case 'secondary':
          return '#8B5CF6'
        default:
          return egyptianStyles.goldColor
      }
    } else {
      switch (colorName) {
        case 'success':
          return '#4caf50'
        case 'warning':
          return '#ff9800'
        case 'error':
          return '#f44336'
        case 'info':
          return '#2196f3'
        case 'secondary':
          return '#9c27b0'
        default:
          return '#1976d2'
      }
    }
  }

  const cardColor = getColorValue('primary')
  const hexToRgb = (hex: string) => {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!match) {
      return { r: 0, g: 0, b: 0 }
    }
    const rHex = match[1]!
    const gHex = match[2]!
    const bHex = match[3]!
    return {
      r: parseInt(rHex, 16),
      g: parseInt(gHex, 16),
      b: parseInt(bHex, 16),
    }
  }

  const rgb = hexToRgb(cardColor)
  const rgbaColor = (alpha: number) =>
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`

  if (!isSacredTheme) {
    // Enhanced standard theme
    const standardCardStyle: React.CSSProperties = {
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: rgbaColor(0.2),
      borderRadius: '12px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      ...(isHovered
        ? {
            transform: 'translateY(-4px)',
            boxShadow: `0 10px 25px ${rgbaColor(0.2)}`,
            borderColor: rgbaColor(0.4),
          }
        : {}),
    }

    const standardContentStyle: React.CSSProperties = {
      padding: '24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }

    const standardHeaderStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '16px',
    }

    const standardIconStyle: React.CSSProperties = {
      marginRight: '16px',
      color: cardColor,
      padding: '8px',
      borderRadius: '8px',
      backgroundColor: rgbaColor(0.1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }

    const standardTitleStyle: React.CSSProperties = {
      color: '#6B7280',
      fontWeight: 600,
      letterSpacing: '0.5px',
      fontSize: '16px',
      lineHeight: '1.2',
      margin: 0,
    }

    const standardValueStyle: React.CSSProperties = {
      color: cardColor,
      fontWeight: 700,
      fontSize: '48px',
      lineHeight: '1.1',
      fontFamily: '"Inter", sans-serif',
      margin: '0 0 8px 0',
    }

    const standardSubtitleStyle: React.CSSProperties = {
      fontSize: '14px',
      color: '#6B7280',
      margin: '0 0 8px 0',
      lineHeight: '1.3',
    }

    const standardTrendStyle: React.CSSProperties = {
      fontSize: '14px',
      color: trend?.isPositive ? '#10B981' : '#EF4444',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      marginTop: 'auto',
    }

    return (
      <div
        style={standardCardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={standardContentStyle}>
          <div style={standardHeaderStyle}>
            {icon && <div style={standardIconStyle}>{icon}</div>}
            <h3 style={standardTitleStyle}>{title}</h3>
          </div>

          <div style={standardValueStyle}>{value}</div>

          {subtitle && <div style={standardSubtitleStyle}>{subtitle}</div>}

          {trend && (
            <div style={standardTrendStyle}>
              <span style={{ fontSize: '16px' }}>
                {trend.isPositive ? '↗' : '↘'}
              </span>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </div>
    )
  }

  // Enhanced sacred theme with full Egyptian styling
  const sacredCardStyle: React.CSSProperties = {
    height: '100%',
    background: `linear-gradient(135deg, ${egyptianStyles.cardBackground} 0%, rgba(22, 33, 62, 0.95) 100%)`,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: rgbaColor(0.5),
    borderRadius: '12px',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    animation: 'sacredGlow 4s ease-in-out infinite',
    cursor: 'pointer',
    ...(isHovered
      ? {
          transform: 'translateY(-8px) scale(1.02)',
          borderColor: rgbaColor(0.8),
          boxShadow: `0 20px 40px rgba(0, 0, 0, 0.6), 0 0 40px ${rgbaColor(0.4)}, inset 0 0 20px ${rgbaColor(0.1)}`,
        }
      : {}),
  }

  const cosmicEnergyStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `conic-gradient(from 0deg at 50% 50%, ${rgbaColor(0.1)} 0deg, transparent 60deg, ${rgbaColor(0.05)} 120deg, transparent 180deg, ${rgbaColor(0.1)} 240deg, transparent 300deg, ${rgbaColor(0.05)} 360deg)`,
    opacity: 0.4,
    zIndex: 0,
    animation: 'rotateGlyph 60s linear infinite',
  }

  const borderShimmerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${cardColor}, transparent)`,
    backgroundSize: '200% 100%',
    animation: 'sacredShimmer 3s linear infinite',
    zIndex: 1,
  }

  const sacredGlyphStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    color: rgbaColor(0.4),
    fontSize: '28px',
    animation: 'floatAnimation 8s ease-in-out infinite',
    zIndex: 2,
    transition: 'all 0.3s ease',
    textShadow: `0 0 10px ${rgbaColor(0.3)}`,
    ...(isHovered
      ? {
          transform: 'scale(1.1) rotate(15deg)',
        }
      : {}),
  }

  const dataStreamStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '2px',
    height: '100%',
    overflow: 'hidden',
    zIndex: 1,
  }

  const dataStreamAfterStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(180deg, transparent, ${cardColor}, transparent)`,
    animation: 'dataStreamAnimation 6s linear infinite',
  }

  const sacredContentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 3,
    padding: '24px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }

  const sacredHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '16px',
  }

  const sacredIconStyle: React.CSSProperties = {
    marginRight: '16px',
    color: cardColor,
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: rgbaColor(0.15),
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: rgbaColor(0.3),
    boxShadow: `0 0 10px ${rgbaColor(0.2)}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const sacredTitleStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 600,
    letterSpacing: '0.5px',
    fontFamily: '"Cinzel", serif',
    textShadow: `0 0 10px ${rgbaColor(0.3)}`,
    fontSize: '16px',
    lineHeight: '1.2',
    margin: 0,
    flex: 1,
  }

  const sacredValueStyle: React.CSSProperties = {
    color: cardColor,
    fontWeight: 700,
    fontSize: '48px',
    lineHeight: '1.1',
    margin: '0 0 8px 0',
    textShadow: `0 0 15px ${rgbaColor(0.5)}`,
    fontFamily: '"Cinzel", serif',
    letterSpacing: '0.02em',
  }

  const sacredSubtitleStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.8)',
    margin: '0 0 8px 0',
    fontFamily: '"Crimson Text", serif',
    fontSize: '16px',
    letterSpacing: '0.025em',
    lineHeight: '1.3',
  }

  const sacredTrendStyle: React.CSSProperties = {
    color: trend?.isPositive ? '#10B981' : '#EF4444',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: '"Crimson Text", serif',
    textShadow: `0 0 8px ${trend?.isPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
    fontSize: '15px',
    marginTop: 'auto',
  }

  const bottomShimmerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${cardColor}, transparent)`,
    backgroundSize: '200% 100%',
    animation: 'sacredShimmer 3s linear infinite',
    animationDelay: '1.5s',
    opacity: 0.6,
  }

  return (
    <div
      style={sacredCardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cosmic energy pattern */}
      <div style={cosmicEnergyStyle} />

      {/* Animated border shimmer */}
      <div style={borderShimmerStyle} />

      {/* Sacred glyph decoration */}
      <div style={sacredGlyphStyle}>{selectedGlyph}</div>

      {/* Data stream animation */}
      <div style={dataStreamStyle}>
        <div style={dataStreamAfterStyle} />
      </div>

      {/* Main content */}
      <div style={sacredContentStyle}>
        <div style={sacredHeaderStyle}>
          {icon && <div style={sacredIconStyle}>{icon}</div>}
          <h3 style={sacredTitleStyle}>{title}</h3>
        </div>

        <div style={sacredValueStyle}>{value}</div>

        {subtitle && <div style={sacredSubtitleStyle}>{subtitle}</div>}

        {trend && (
          <div style={sacredTrendStyle}>
            <span style={{ fontSize: '17px' }}>
              {trend.isPositive ? '↗' : '↘'}
            </span>
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      {/* Bottom border shimmer */}
      <div style={bottomShimmerStyle} />
    </div>
  )
}
