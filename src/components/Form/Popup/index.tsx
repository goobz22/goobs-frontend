'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Close } from '@mui/icons-material'
import {
  Dialog,
  IconButton,
  Box,
  alpha,
  keyframes,
  Typography,
} from '@mui/material'
import ContentSection, { ContentSectionProps } from '../../Content'
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

const closeButtonGlow = keyframes`
  0% { 
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
    transform: rotate(0deg);
  }
  50% { 
    text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
    transform: rotate(180deg);
  }
  100% { 
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
    transform: rotate(360deg);
  }
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

export interface PopupProps {
  open: boolean
  /**
   * Optional flag indicating the popup should be closed from the parent.
   */
  close: boolean
  /**
   * Optional callback so the parent can be informed when user closes the dialog.
   */
  onClose: () => void
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

function Popup({
  open,
  close,
  onClose,
  title,
  description,
  grids,
  content,
  width = 450,
  buttons,
  sacredTheme = true,
}: PopupProps) {
  // Local state syncing with props
  const [isOpen, setIsOpen] = useState(open)
  const [, setIsClosed] = useState(!open)

  useEffect(() => {
    setIsOpen(open)
    setIsClosed(!open)
  }, [open])

  useEffect(() => {
    if (typeof close === 'boolean') {
      setIsOpen(!close)
      setIsClosed(close)
    }
  }, [close])

  // Create a header grid using the new ContentSection interface.
  // We only supply the typography array without any layout properties.
  const headerGrid = useMemo(
    (): ContentSectionProps['grids'][0] => ({
      typography: [
        {
          text: title,
          // Cast to literal type as expected by goobs-frontend.
          fontvariant: 'merrih4' as const,
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
          fontvariant: 'merrih5' as const,
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
      ],
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

  const handleClose = () => {
    setIsOpen(false)
    setIsClosed(true)
    onClose?.()
  }

  const dialogPaperStyles = useMemo(() => {
    const baseStyles = {
      width: `${width}px`,
      borderRadius: sacredTheme ? '12px' : '16px',
      backgroundColor: sacredTheme ? egyptianStyles.cardBackground : white.main,
      boxShadow: sacredTheme
        ? egyptianStyles.glowEffect
        : '0px 4px 10px rgba(0, 0, 0, 0.2)',
      padding: sacredTheme ? '24px 32px 20px 32px' : '24px',
      pointerEvents: 'auto' as const,
      position: 'relative' as const,
      overflow: 'visible' as const,
    }

    if (!sacredTheme) return baseStyles

    return {
      ...baseStyles,
      backdropFilter: 'blur(20px)',
      border: `2px solid ${alpha(egyptianStyles.goldColor, 0.5)}`,
      animation: `${glowPulse} 4s ease-in-out infinite`,
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
    <Dialog
      open={isOpen}
      onClose={handleClose} // Clicking outside/backdrop or pressing ESC triggers this
      fullWidth
      maxWidth={false}
      slotProps={{
        paper: {
          sx: dialogPaperStyles,
        },
        backdrop: sacredTheme
          ? {
              sx: {
                backgroundColor: alpha('#000000', 0.85),
                backdropFilter: 'blur(5px)',
              },
            }
          : undefined,
      }}
    >
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
              right: '48px',
              color: alpha(egyptianStyles.goldColor, 0.3),
              fontSize: '18px',
              animation: `${floatAnimation} 5s ease-in-out infinite reverse`,
            }}
          >
            {SACRED_GLYPHS[11]}
          </Box>
        </>
      )}

      <IconButton
        size="small"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: sacredTheme
            ? egyptianStyles.goldColor
            : theme => theme.palette.grey[500],
          // Ensure it's on top and clickable
          zIndex: theme => theme.zIndex.modal + 1,
          cursor: 'pointer',
          ...(sacredTheme && {
            animation: `${closeButtonGlow} 6s ease-in-out infinite`,
            '&:hover': {
              color: egyptianStyles.goldColor,
              backgroundColor: alpha(egyptianStyles.goldColor, 0.1),
              transform: 'scale(1.1)',
              transition: 'all 0.3s ease',
            },
          }),
          ...(!sacredTheme && {
            '&:hover': {
              color: theme => theme.palette.grey[700],
            },
          }),
        }}
      >
        <Close />
      </IconButton>

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
    </Dialog>
  )
}

export default Popup
