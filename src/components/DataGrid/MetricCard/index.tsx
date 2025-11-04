'use client'

import React, { useState, memo } from 'react'
import { alpha } from '../../../utils'

const SACRED_GOLD = '#FFD700'

export interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  styles?: {
    theme?: string
    [key: string]: any
  }
}

const MetricCard = memo(function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  styles,
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isSacredTheme = styles?.theme === 'sacred'

  const cardStyle: React.CSSProperties = {
    height: '100%',
    width: 'max-content',
    minWidth: '250px',
    background: isSacredTheme
      ? `linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(22, 33, 62, 0.95) 100%)`
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: `2px solid ${isSacredTheme ? alpha(SACRED_GOLD, 0.5) : 'rgba(0, 0, 0, 0.1)'}`,
    borderRadius: '12px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: isSacredTheme
      ? `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px ${alpha(SACRED_GOLD, 0.2)}`
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
    transform: isHovered
      ? isSacredTheme
        ? 'translateY(-8px) scale(1.02)'
        : 'translateY(-4px)'
      : 'none',
  }

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    padding: '24px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '16px',
  }

  const iconStyle: React.CSSProperties = {
    marginRight: '16px',
    color: isSacredTheme ? SACRED_GOLD : '#1976d2',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: isSacredTheme ? alpha(SACRED_GOLD, 0.15) : 'rgba(25, 118, 210, 0.1)',
    border: isSacredTheme ? `1px solid ${alpha(SACRED_GOLD, 0.3)}` : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const titleStyle: React.CSSProperties = {
    color: isSacredTheme ? 'rgba(255, 255, 255, 0.9)' : '#6B7280',
    fontWeight: 600,
    letterSpacing: '0.5px',
    fontFamily: isSacredTheme ? '"Cinzel", serif' : 'inherit',
    fontSize: '16px',
    lineHeight: '1.2',
    margin: 0,
    flex: 1,
  }

  const valueStyle: React.CSSProperties = {
    color: isSacredTheme ? SACRED_GOLD : '#1976d2',
    fontWeight: 700,
    fontSize: '48px',
    lineHeight: '1.1',
    margin: '0 0 8px 0',
    fontFamily: isSacredTheme ? '"Cinzel", serif' : '"Inter", sans-serif',
    letterSpacing: '0.02em',
  }

  const subtitleStyle: React.CSSProperties = {
    color: isSacredTheme ? 'rgba(255, 255, 255, 0.8)' : '#6B7280',
    margin: '0 0 8px 0',
    fontFamily: isSacredTheme ? '"Crimson Text", serif' : 'inherit',
    fontSize: isSacredTheme ? '16px' : '14px',
    letterSpacing: '0.025em',
    lineHeight: '1.3',
  }

  const trendStyle: React.CSSProperties = {
    color: trend?.isPositive ? '#10B981' : '#EF4444',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: isSacredTheme ? '"Crimson Text", serif' : 'inherit',
    fontSize: isSacredTheme ? '15px' : '14px',
    marginTop: 'auto',
  }

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={contentStyle}>
        <div style={headerStyle}>
          {icon && <div style={iconStyle}>{icon}</div>}
          <h3 style={titleStyle}>{title}</h3>
        </div>

        <div style={valueStyle}>{value}</div>

        {subtitle && <div style={subtitleStyle}>{subtitle}</div>}

        {trend && (
          <div style={trendStyle}>
            <span style={{ fontSize: isSacredTheme ? '17px' : '16px' }}>
              {trend.isPositive ? '↗' : '↘'}
            </span>
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </div>
  )
})

MetricCard.displayName = 'MetricCard'

export default MetricCard
