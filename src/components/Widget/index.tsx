'use client'

import React, { ReactNode } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  alpha,
  keyframes,
  Fade,
} from '@mui/material'
import Typography from '../Typography'

// Sacred theming constants
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

const sacredFloat = keyframes`
  0% { transform: translateY(0px) scale(1); opacity: 0.6; }
  50% { transform: translateY(-3px) scale(1.05); opacity: 0.8; }
  100% { transform: translateY(0px) scale(1); opacity: 0.6; }
`

const sacredGlowPulse = keyframes`
  0% { 
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3), inset 0 0 5px rgba(255, 215, 0, 0.2);
  }
  50% { 
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 10px rgba(255, 215, 0, 0.3);
  }
  100% { 
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3), inset 0 0 5px rgba(255, 215, 0, 0.2);
  }
`

export interface WidgetProps {
  /** The title of the widget */
  title?: string
  /** Optional icon to display in the header */
  icon?: ReactNode
  /** Widget variant for different styling */
  variant?: 'standard' | 'highlighted' | 'temple'
  /** Glow intensity for sacred theming */
  glowIntensity?: 'low' | 'medium' | 'high'
  /** Actions to display in the widget footer */
  actions?: ReactNode
  /** Corner glyphs for sacred theming */
  cornerGlyphs?: string[]
  /** Enable hieroglyphic decoration */
  hieroglyphicDecoration?: boolean
  /** Enable sacred theming */
  sacredTheme?: boolean
  /** Widget content */
  children: ReactNode
  /** Animation delay for entrance */
  delay?: number
  /** Full width */
  fullWidth?: boolean
  /** Custom height */
  height?: string | number
  /** Disable elevation */
  flat?: boolean
}

const Widget: React.FC<WidgetProps> = ({
  title,
  icon,
  variant = 'standard',
  glowIntensity = 'medium',
  actions,
  cornerGlyphs,
  hieroglyphicDecoration = false,
  sacredTheme = false,
  children,
  delay = 0,
  fullWidth = false,
  height,
  flat = false,
}) => {
  // Generate random glyphs if not provided and sacred theme is enabled
  const glyphs =
    sacredTheme && hieroglyphicDecoration
      ? cornerGlyphs || [
          SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)],
          SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)],
        ]
      : []

  // Glow intensity levels
  const glowLevels = {
    low: {
      borderOpacity: 0.3,
      shadowOpacity: 0.2,
      glowSize: '10px',
    },
    medium: {
      borderOpacity: 0.5,
      shadowOpacity: 0.3,
      glowSize: '15px',
    },
    high: {
      borderOpacity: 0.7,
      shadowOpacity: 0.4,
      glowSize: '20px',
    },
  }

  // Sacred color scheme
  const sacredColors = {
    gold: '#FFD700',
    temple: '#0a0a0a',
    obsidian: '#1a1a1a',
  }

  // Base styles
  const baseStyles = sacredTheme
    ? {
        backgroundColor: alpha(sacredColors.temple, 0.95),
        border: `2px solid ${alpha(sacredColors.gold, glowLevels[glowIntensity].borderOpacity)}`,
        borderRadius: '12px',
        color: sacredColors.gold,
        backgroundImage:
          variant === 'highlighted'
            ? `linear-gradient(135deg, 
          ${alpha(sacredColors.gold, 0.12)} 0%, 
          ${alpha(sacredColors.temple, 0.95)} 30%,
          ${alpha(sacredColors.gold, 0.08)} 70%,
          ${alpha(sacredColors.temple, 0.97)} 100%
        )`
            : variant === 'temple'
              ? `radial-gradient(circle at top right, ${alpha(sacredColors.gold, 0.07)} 0%, transparent 60%),
           radial-gradient(circle at bottom left, ${alpha(sacredColors.gold, 0.05)} 0%, transparent 60%),
           linear-gradient(135deg, 
             ${alpha(sacredColors.gold, 0.03)} 0%, 
             ${alpha(sacredColors.temple, 0.97)} 50%,
             ${alpha(sacredColors.gold, 0.02)} 100%
           )`
              : `linear-gradient(135deg, 
            ${alpha(sacredColors.gold, 0.05)} 0%, 
            ${alpha(sacredColors.temple, 0.98)} 50%,
            ${alpha(sacredColors.gold, 0.03)} 100%
          )`,
        boxShadow: `0 4px 20px ${alpha(sacredColors.gold, glowLevels[glowIntensity].shadowOpacity)}`,
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        '&:hover': {
          transform: 'translateY(-5px)',
          borderColor: alpha(
            sacredColors.gold,
            glowLevels[glowIntensity].borderOpacity + 0.2
          ),
          boxShadow: `0 15px 30px ${alpha('#000000', 0.6)}, 0 0 30px ${alpha(sacredColors.gold, glowLevels[glowIntensity].shadowOpacity + 0.15)}`,
          animation: `${sacredGlowPulse} 2s ease-in-out infinite`,
        },
        '&::before': hieroglyphicDecoration
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 'inherit',
              background: `
        conic-gradient(from 0deg at 50% 50%, 
          ${alpha(sacredColors.gold, 0.1)} 0deg,
          transparent 60deg,
          ${alpha(sacredColors.gold, 0.05)} 120deg,
          transparent 180deg,
          ${alpha(sacredColors.gold, 0.1)} 240deg,
          transparent 300deg,
          ${alpha(sacredColors.gold, 0.05)} 360deg
        )
      `,
              opacity: 0.3,
              zIndex: 0,
            }
          : {},
      }
    : {}

  const cardContent = (
    <Card
      elevation={flat ? 0 : 3}
      sx={{
        position: 'relative',
        overflow: 'visible',
        width: fullWidth ? '100%' : 'auto',
        height: height || 'auto',
        ...baseStyles,
      }}
    >
      {/* Sacred corner glyphs */}
      {sacredTheme && hieroglyphicDecoration && glyphs.length >= 2 && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              color: alpha(sacredColors.gold, 0.3),
              fontSize: '18px',
              animation: `${sacredFloat} 5s ease-in-out infinite`,
              zIndex: 1,
            }}
          >
            {glyphs[0]}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: alpha(sacredColors.gold, 0.3),
              fontSize: '18px',
              animation: `${sacredFloat} 6s ease-in-out infinite reverse`,
              zIndex: 1,
            }}
          >
            {glyphs[1]}
          </Box>
        </>
      )}

      {/* Header */}
      {(title || icon) && (
        <CardHeader
          avatar={
            icon && (
              <Box
                sx={{
                  color: sacredTheme ? sacredColors.gold : 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...(sacredTheme && {
                    filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.6))',
                    transition: 'all 0.3s ease',
                  }),
                }}
              >
                {icon}
              </Box>
            )
          }
          title={
            title && (
              <Typography
                variant="h6"
                sacredTheme={sacredTheme}
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  ...(sacredTheme && {
                    fontFamily: '"Cinzel", serif',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }),
                }}
              >
                {title}
              </Typography>
            )
          }
          sx={{
            position: 'relative',
            zIndex: 1,
            borderBottom:
              title && actions
                ? `1px solid ${alpha(sacredTheme ? sacredColors.gold : '#000', 0.1)}`
                : 'none',
          }}
        />
      )}

      {/* Content */}
      <CardContent
        sx={{
          position: 'relative',
          zIndex: 1,
          ...(sacredTheme && {
            '& *': {
              fontFamily: '"Cinzel", serif',
            },
          }),
        }}
      >
        {children}
      </CardContent>

      {/* Actions */}
      {actions && (
        <CardActions
          sx={{
            position: 'relative',
            zIndex: 1,
            borderTop: `1px solid ${alpha(sacredTheme ? sacredColors.gold : '#000', 0.1)}`,
            justifyContent: 'center',
          }}
        >
          {actions}
        </CardActions>
      )}
    </Card>
  )

  if (delay > 0) {
    return (
      <Fade in timeout={1000 + delay}>
        <Box>{cardContent}</Box>
      </Fade>
    )
  }

  return cardContent
}

export default Widget
