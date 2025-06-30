'use client'
import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  SxProps,
  Theme,
  alpha,
  keyframes,
} from '@mui/material'

// Enhanced sacred theming animations
const rotateGlyph = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const sacredGlow = keyframes`
  0% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
    border-color: ${alpha('#FFD700', 0.5)};
  }
  50% { 
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
    border-color: ${alpha('#FFD700', 0.8)};
  }
  100% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
    border-color: ${alpha('#FFD700', 0.5)};
  }
`

const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
  33% { transform: translateY(-3px) rotate(120deg); opacity: 0.6; }
  66% { transform: translateY(1px) rotate(240deg); opacity: 0.4; }
  100% { transform: translateY(0px) rotate(360deg); opacity: 0.3; }
`

const sacredShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const dataStreamAnimation = keyframes`
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
  cardBackground: alpha('#000000', 0.85),
  glowEffect: `0 0 30px ${alpha('#FFD700', 0.3)}, 0 0 60px ${alpha('#FFD700', 0.1)}`,
}

export interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  glyph?: string
  sacredtheme?: boolean
  sx?: SxProps<Theme>
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  glyph,
  sacredtheme = false,
  sx,
}: MetricCardProps) {
  const selectedGlyph =
    glyph || SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]

  const getColorValue = (colorName: string) => {
    if (sacredtheme) {
      // Enhanced sacred theme colors
      switch (colorName) {
        case 'success':
          return '#10B981' // Emerald green
        case 'warning':
          return '#F59E0B' // Amber
        case 'error':
          return '#EF4444' // Red
        case 'info':
          return '#3B82F6' // Blue
        case 'secondary':
          return '#8B5CF6' // Purple
        default:
          return egyptianStyles.goldColor
      }
    } else {
      // Standard theme colors
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

  const cardColor = getColorValue(color)

  if (!sacredtheme) {
    // Enhanced standard theme
    return (
      <Card
        sx={{
          height: '100%',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: `2px solid ${alpha(cardColor, 0.2)}`,
          borderRadius: 3,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 10px 25px ${alpha(cardColor, 0.2)}`,
            borderColor: alpha(cardColor, 0.4),
          },
          ...sx,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            {icon && (
              <Box
                sx={{
                  mr: 2,
                  color: cardColor,
                  p: 1,
                  borderRadius: 2,
                  backgroundColor: alpha(cardColor, 0.1),
                }}
              >
                {icon}
              </Box>
            )}
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}
            >
              {title}
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{
              color: cardColor,
              fontWeight: 700,
              mb: 1,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {value}
          </Typography>

          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {subtitle}
            </Typography>
          )}

          {trend && (
            <Typography
              variant="body2"
              sx={{
                color: trend.isPositive ? '#10B981' : '#EF4444',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </Typography>
          )}
        </CardContent>
      </Card>
    )
  }

  // Enhanced sacred theme with full Egyptian styling
  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, 
          ${egyptianStyles.cardBackground} 0%, 
          ${alpha(egyptianStyles.obsidian, 0.95)} 100%
        )`,
        border: `2px solid ${alpha(cardColor, 0.5)}`,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        animation: `${sacredGlow} 4s ease-in-out infinite`,
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          borderColor: alpha(cardColor, 0.8),
          boxShadow: `
            0 20px 40px ${alpha('#000000', 0.6)}, 
            0 0 40px ${alpha(cardColor, 0.4)},
            inset 0 0 20px ${alpha(cardColor, 0.1)}
          `,
          '&::after': {
            opacity: 0.8,
          },
          '& .metric-glyph': {
            transform: 'scale(1.1) rotate(15deg)',
          },
        },
        // Cosmic energy pattern
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            conic-gradient(from 0deg at 50% 50%, 
              ${alpha(cardColor, 0.1)} 0deg,
              transparent 60deg,
              ${alpha(cardColor, 0.05)} 120deg,
              transparent 180deg,
              ${alpha(cardColor, 0.1)} 240deg,
              transparent 300deg,
              ${alpha(cardColor, 0.05)} 360deg
            )
          `,
          opacity: 0.4,
          zIndex: 0,
          animation: `${rotateGlyph} 60s linear infinite`,
        },
        // Animated border shimmer
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${cardColor}, transparent)`,
          backgroundSize: '200% 100%',
          animation: `${sacredShimmer} 3s linear infinite`,
          zIndex: 1,
        },
        ...sx,
      }}
    >
      {/* Sacred glyph decoration */}
      <Box
        className="metric-glyph"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: alpha(cardColor, 0.4),
          fontSize: '28px',
          animation: `${floatAnimation} 8s ease-in-out infinite`,
          zIndex: 2,
          transition: 'all 0.3s ease',
          textShadow: `0 0 10px ${alpha(cardColor, 0.3)}`,
        }}
      >
        {selectedGlyph}
      </Box>

      {/* Data stream animation */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '2px',
          height: '100%',
          overflow: 'hidden',
          zIndex: 1,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(180deg, transparent, ${cardColor}, transparent)`,
            animation: `${dataStreamAnimation} 6s linear infinite`,
          },
        }}
      />

      <CardContent sx={{ position: 'relative', zIndex: 3, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          {icon && (
            <Box
              sx={{
                mr: 2,
                color: cardColor,
                p: 1,
                borderRadius: 2,
                backgroundColor: alpha(cardColor, 0.15),
                border: `1px solid ${alpha(cardColor, 0.3)}`,
                boxShadow: `0 0 10px ${alpha(cardColor, 0.2)}`,
              }}
            >
              {icon}
            </Box>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: alpha('#ffffff', 0.9),
                fontWeight: 600,
                letterSpacing: '0.5px',
                fontFamily: '"Cinzel", serif',
                textShadow: `0 0 10px ${alpha(cardColor, 0.3)}`,
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h3"
          sx={{
            color: cardColor,
            fontWeight: 700,
            mb: 1,
            textShadow: `0 0 15px ${alpha(cardColor, 0.5)}`,
            fontFamily: '"Cinzel", serif',
            letterSpacing: '0.02em',
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: alpha('#ffffff', 0.8),
              mb: 1,
              fontFamily: '"Crimson Text", serif',
              fontSize: '1rem',
              letterSpacing: '0.025em',
            }}
          >
            {subtitle}
          </Typography>
        )}

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: trend.isPositive ? '#10B981' : '#EF4444',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontFamily: '"Crimson Text", serif',
                textShadow: `0 0 8px ${alpha(trend.isPositive ? '#10B981' : '#EF4444', 0.3)}`,
                fontSize: '0.95rem',
              }}
            >
              <span style={{ fontSize: '1.1em' }}>
                {trend.isPositive ? '↗' : '↘'}
              </span>
              {Math.abs(trend.value)}%
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Bottom border shimmer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${cardColor}, transparent)`,
          backgroundSize: '200% 100%',
          animation: `${sacredShimmer} 3s linear infinite`,
          animationDelay: '1.5s',
          opacity: 0.6,
        }}
      />
    </Card>
  )
}
