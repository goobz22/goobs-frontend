'use client'

import React, { useMemo } from 'react'
import { Box, alpha, keyframes, Typography } from '@mui/material'
import ContentSection, { ContentSectionProps } from '../../Content'
import { TypographyProps } from '../../Typography'
import CustomButton, { CustomButtonProps } from '../../Button'
import { white } from '../../../styles/palette'

// Sacred geometry animations
const glowPulse = keyframes`
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
  33% { transform: translateY(-5px) rotate(120deg); opacity: 0.5; }
  66% { transform: translateY(2px) rotate(240deg); opacity: 0.4; }
  100% { transform: translateY(0px) rotate(360deg); opacity: 0.3; }
`

const sacredShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

// Egyptian styling constants
const egyptianStyles = {
  goldColor: '#FFD700',
  goldGradient:
    'linear-gradient(135deg, #FFD700 0%, #F4A460 50%, #DAA520 100%)',
  darkGold: '#B8860B',
  textShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
  cardBackground: alpha('#000000', 0.85),
  glowEffect: `0 0 30px ${alpha('#FFD700', 0.3)}, 0 0 60px ${alpha('#FFD700', 0.1)}`,
}

// Sacred hieroglyphs for decoration
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

export interface CustomDialogProps {
  title?: string
  description?: string
  grids?: ContentSectionProps['grids']
  content?: React.ReactNode
  width?: number
  /** Optional array of button props for footer buttons */
  buttons?: CustomButtonProps[]
  /** Enable Egyptian/Sacred theming */
  sacredTheme?: boolean
}

function CustomDialog({
  title,
  description,
  grids,
  content,
  width = 450,
  buttons,
  sacredTheme = true,
}: CustomDialogProps) {
  const headerGrid = useMemo(
    (): ContentSectionProps['grids'][0] => ({
      typography: [
        {
          text: title,
          fontvariant: 'merrih4',
          fontcolor: sacredTheme ? egyptianStyles.goldColor : 'black',
          style: sacredTheme
            ? {
                fontFamily: '"Cinzel", serif',
                textShadow: egyptianStyles.textShadow,
                letterSpacing: '0.1em',
                textAlign: 'center',
              }
            : undefined,
          sacredTheme: sacredTheme,
        },
        {
          text: description,
          fontvariant: 'merrih5',
          fontcolor: sacredTheme ? alpha('#ffffff', 0.9) : 'black',
          style: sacredTheme
            ? {
                fontFamily: '"Crimson Text", serif',
                textAlign: 'center',
                marginTop: '8px',
              }
            : undefined,
          sacredTheme: sacredTheme,
        },
      ] as TypographyProps[],
      style: sacredTheme
        ? {
            marginBottom: '16px',
          }
        : undefined,
    }),
    [title, description, sacredTheme]
  )

  const renderHeader = useMemo(() => {
    if (!title && !description) return null

    return (
      <>
        {sacredTheme && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1.5,
              mb: 1,
            }}
          >
            {SACRED_GLYPHS.slice(0, 5).map((glyph, index) => (
              <Typography
                key={index}
                sx={{
                  color: alpha(egyptianStyles.goldColor, 0.6),
                  fontSize: '1rem',
                  animation: `${floatAnimation} ${3 + index * 0.5}s ease-in-out infinite`,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {glyph}
              </Typography>
            ))}
          </Box>
        )}
        <ContentSection grids={[headerGrid]} />
      </>
    )
  }, [headerGrid, sacredTheme, title, description])

  const renderButtons = useMemo(() => {
    if (!buttons || buttons.length === 0) return null

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 2,
          marginTop: sacredTheme ? '16px' : '15px',
          ...(sacredTheme && {
            borderTop: `1px solid ${alpha(egyptianStyles.goldColor, 0.2)}`,
            paddingTop: '16px',
          }),
        }}
      >
        {buttons.map((buttonProps, index) => (
          <CustomButton
            key={index}
            {...buttonProps}
            sacredTheme={sacredTheme}
            style={
              sacredTheme
                ? {
                    fontFamily: '"Cinzel", serif',
                    letterSpacing: '0.05em',
                    boxShadow: `0 0 15px ${alpha(egyptianStyles.goldColor, 0.3)}`,
                    ...buttonProps.style,
                  }
                : buttonProps.style
            }
          />
        ))}
      </Box>
    )
  }, [buttons, sacredTheme])

  const containerStyles = useMemo(() => {
    if (!sacredTheme) {
      return {
        width: `${width}px`,
        maxWidth: '100%',
        borderRadius: '16px',
        boxShadow: 3,
        margin: '0 auto',
        padding: 3,
        bgcolor: white.main,
      }
    }

    return {
      width: `${width}px`,
      maxWidth: '100%',
      borderRadius: '12px',
      margin: '0 auto',
      padding: '24px 32px 20px 32px',
      position: 'relative' as const,
      bgcolor: egyptianStyles.cardBackground,
      backdropFilter: 'blur(20px)',
      border: `2px solid ${alpha(egyptianStyles.goldColor, 0.5)}`,
      animation: `${glowPulse} 4s ease-in-out infinite`,
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${egyptianStyles.goldColor}, transparent)`,
        backgroundSize: '200% 100%',
        animation: `${sacredShimmer} 3s linear infinite`,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${egyptianStyles.goldColor}, transparent)`,
        backgroundSize: '200% 100%',
        animation: `${sacredShimmer} 3s linear infinite`,
        animationDelay: '1.5s',
      },
    }
  }, [sacredTheme, width])

  return (
    <Box sx={containerStyles}>
      {/* Top corner decorations */}
      {sacredTheme && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              color: alpha(egyptianStyles.goldColor, 0.3),
              fontSize: '18px',
              animation: `${floatAnimation} 5s ease-in-out infinite`,
            }}
          >
            {SACRED_GLYPHS[10]}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: alpha(egyptianStyles.goldColor, 0.3),
              fontSize: '18px',
              animation: `${floatAnimation} 5s ease-in-out infinite reverse`,
            }}
          >
            {SACRED_GLYPHS[11]}
          </Box>
        </>
      )}

      {renderHeader}

      <Box sx={sacredTheme ? { position: 'relative', zIndex: 1 } : undefined}>
        {content ||
          (grids && <ContentSection grids={grids} sacredTheme={sacredTheme} />)}
      </Box>

      {renderButtons}

      {/* Bottom decoration */}
      {sacredTheme && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 0.5,
            mt: 2,
            opacity: 0.5,
          }}
        >
          {['𓊖', '𓊗', '𓊖'].map((glyph, index) => (
            <Typography
              key={index}
              sx={{
                color: egyptianStyles.goldColor,
                fontSize: '12px',
                animation: `${floatAnimation} ${2 + index * 0.3}s ease-in-out infinite`,
              }}
            >
              {glyph}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default CustomDialog
