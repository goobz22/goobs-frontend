'use client'
import React, { useState } from 'react'
import Typography from '../../Typography'
import type { DataGridStyles } from '../../../theme'
import { SACRED_GLYPHS } from '../../../theme'

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

const getStyles = (isSacredTheme?: boolean, color?: string) => ({
  container: {
    height: '100%',
    borderRadius: '0.75rem',
    borderWidth: '2px',
    transition: 'all 0.3s ease-in-out',
    ...(isSacredTheme
      ? {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backgroundImage: 'linear-gradient(to bottom right, #000, #1a1a1a)',
          borderColor: `rgba(${parseInt(color?.slice(1, 3) || '0', 16)}, ${parseInt(color?.slice(3, 5) || '0', 16)}, ${parseInt(color?.slice(5, 7) || '0', 16)}, 0.5)`,
          animation: 'metric-card-glow 2s infinite alternate',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(32px)',
        }
      : {
          backgroundImage: 'linear-gradient(to bottom right, white, #F9FAFB)',
          borderColor: `rgba(${parseInt(color?.slice(1, 3) || '0', 16)}, ${parseInt(color?.slice(3, 5) || '0', 16)}, ${parseInt(color?.slice(5, 7) || '0', 16)}, 0.2)`,
        }),
  } as React.CSSProperties,
  containerHover: {
    transform: isSacredTheme
      ? 'translateY(-0.5rem) scale(1.05)'
      : 'translateY(-0.25rem)',
    boxShadow:
      '0 1rem 1.5rem -0.5rem rgba(0,0,0,0.1), 0 0.5rem 1rem -0.25rem rgba(0,0,0,0.05)',
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    fontSize: '2.25rem',
    zIndex: 20,
    transition: 'all 0.3s ease-in-out',
    animation: 'metric-card-float 4s infinite ease-in-out',
    color: `rgba(${parseInt(color?.slice(1, 3) || '0', 16)}, ${parseInt(color?.slice(3, 5) || '0', 16)}, ${parseInt(color?.slice(5, 7) || '0', 16)}, 0.4)`,
  } as React.CSSProperties,
  dataStream: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0.125rem',
    height: '100%',
    overflow: 'hidden',
    zIndex: 10,
    '::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage:
        'linear-gradient(to top, transparent, currentColor, transparent)',
      animation: 'metric-card-data-stream 3s linear infinite',
    },
  } as React.CSSProperties,
  content: {
    position: 'relative',
    zIndex: 30,
    padding: '0.75rem',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  iconContainer: {
    marginRight: '0.5rem',
    padding: '0.25rem',
    borderRadius: '0.5rem',
    border: '1px solid',
    boxShadow:
      '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    color: color,
    backgroundColor: `rgba(${parseInt(color?.slice(1, 3) || '0', 16)}, ${parseInt(color?.slice(3, 5) || '0', 16)}, ${parseInt(color?.slice(5, 7) || '0', 16)}, 0.15)`,
    borderColor: `rgba(${parseInt(color?.slice(1, 3) || '0', 16)}, ${parseInt(color?.slice(3, 5) || '0', 16)}, ${parseInt(color?.slice(5, 7) || '0', 16)}, 0.3)`,
  } as React.CSSProperties,
  titleContainer: {
    flex: 1,
  } as React.CSSProperties,
  title: {
    fontWeight: 600,
    letterSpacing: '0.025em',
    fontFamily: isSacredTheme ? 'Cinzel, serif' : 'Inter, sans-serif',
    color: isSacredTheme ? 'rgba(255,255,255,0.9)' : '#6B7280',
    textShadow: isSacredTheme
      ? `0 0 10px rgba(${parseInt(color?.slice(1, 3) || '0', 16)}, ${parseInt(color?.slice(3, 5) || '0', 16)}, ${parseInt(color?.slice(5, 7) || '0', 16)}, 0.3)`
      : 'none',
  } as React.CSSProperties,
  value: {
    fontSize: '2.25rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
    fontFamily: isSacredTheme ? 'Cinzel, serif' : 'sans-serif',
    letterSpacing: isSacredTheme ? '-0.025em' : 'normal',
    color: color,
    textShadow: `0 0 15px rgba(${parseInt(color?.slice(1, 3) || '0', 16)}, ${parseInt(color?.slice(3, 5) || '0', 16)}, ${parseInt(color?.slice(5, 7) || '0', 16)}, 0.5)`,
  } as React.CSSProperties,
  subtitle: {
    marginBottom: '0.25rem',
    fontFamily: isSacredTheme ? 'Crimson Text, serif' : 'Inter, sans-serif',
    fontSize: isSacredTheme ? '1rem' : '0.875rem',
    letterSpacing: isSacredTheme ? '0.05em' : 'normal',
    color: isSacredTheme ? 'rgba(255,255,255,0.8)' : '#6B7280',
  } as React.CSSProperties,
  trendContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '0.25rem',
  } as React.CSSProperties,
  trend: {
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.125rem',
    fontFamily: isSacredTheme ? 'Crimson Text, serif' : 'Inter, sans-serif',
    fontSize: '1rem',
  } as React.CSSProperties,
  shimmer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    backgroundImage:
      'linear-gradient(to right, transparent, currentColor, transparent)',
    animation: 'metric-card-shimmer 3s infinite',
    animationDelay: '1.5s',
    opacity: 0.6,
  } as React.CSSProperties,
})

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  glyph,
  styles,
}: MetricCardProps) {
  const isSacredTheme = styles?.theme === 'sacred'
  const selectedGlyph =
    glyph || SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]

  const getColorValue = () => {
    const sacredColors = {
      primary: '#FFD700',
      secondary: '#8B5CF6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    }
    const standardColors = {
      primary: '#1976d2',
      secondary: '#9c27b0',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
    }

    // Default to primary color based on theme
    return isSacredTheme ? sacredColors.primary : standardColors.primary
  }

  const cardColor = getColorValue()
  const componentStyles = getStyles(isSacredTheme, cardColor)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      style={{
        ...componentStyles.container,
        ...(isHovered && componentStyles.containerHover),
        ...(styles?.backgroundColor && {
          backgroundColor: styles.backgroundColor,
        }),
        ...(styles?.borderColor && { borderColor: styles.borderColor }),
        ...(styles?.borderRadius && { borderRadius: styles.borderRadius }),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isSacredTheme && (
        <>
          <div style={componentStyles.glyph}>{selectedGlyph}</div>
          <div style={componentStyles.dataStream} />
          <div style={componentStyles.shimmer} />
        </>
      )}
      <div style={componentStyles.content}>
        <div style={componentStyles.header}>
          {icon && (
            <div
              style={{
                ...componentStyles.iconContainer,
                color: cardColor,
                backgroundColor: `rgba(${parseInt(cardColor.slice(1, 3), 16)}, ${parseInt(cardColor.slice(3, 5), 16)}, ${parseInt(cardColor.slice(5, 7), 16)}, 0.1)`,
                borderColor: `rgba(${parseInt(cardColor.slice(1, 3), 16)}, ${parseInt(cardColor.slice(3, 5), 16)}, ${parseInt(cardColor.slice(5, 7), 16)}, 0.3)`,
              }}
            >
              {icon}
            </div>
          )}
          <div style={componentStyles.titleContainer}>
            <Typography>{title}</Typography>
          </div>
        </div>
        <Typography>{value}</Typography>
        {subtitle && <Typography>{subtitle}</Typography>}
        {trend && (
          <div style={componentStyles.trendContainer}>
            <Typography>
              <span style={{ fontSize: '1.125rem' }}>
                {trend.isPositive ? '↗' : '↘'}
              </span>
              {Math.abs(trend.value)}%
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}
