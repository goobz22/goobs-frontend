'use client'

import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { Close, DragIndicator } from '@mui/icons-material'
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

const scrollbarGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.6); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
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

  // Drag functionality state
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

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

  // Reset drag position when opening
  useEffect(() => {
    if (open) {
      setDragPosition({ x: 0, y: 0 })
    }
  }, [open])

  // Drag handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)

      // If starting from center (0,0), convert to absolute coordinates
      let currentX = dragPosition.x
      let currentY = dragPosition.y

      if (dragPosition.x === 0 && dragPosition.y === 0) {
        // Get the actual popup element position when centered
        const popup = document.querySelector('.MuiDialog-paper') as HTMLElement
        if (popup) {
          const rect = popup.getBoundingClientRect()
          currentX = rect.left
          currentY = rect.top
        } else {
          // Fallback to calculated center
          currentX = window.innerWidth / 2 - width / 2
          currentY = window.innerHeight / 2 - 300 // estimated height
        }
      }

      setDragOffset({
        x: e.clientX - currentX,
        y: e.clientY - currentY,
      })
    },
    [dragPosition, width]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y

        // Keep within reasonable bounds (allow some off-screen movement)
        const maxX = window.innerWidth - 100
        const minX = -width + 100
        const maxY = window.innerHeight - 100
        const minY = -200

        setDragPosition({
          x: Math.max(minX, Math.min(maxX, newX)),
          y: Math.max(minY, Math.min(maxY, newY)),
        })
      }
    },
    [isDragging, dragOffset, width]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add and remove mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none' // Prevent text selection while dragging
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

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
      maxHeight: '90vh',
      borderRadius: sacredTheme ? '12px' : '16px',
      backgroundColor: sacredTheme ? egyptianStyles.cardBackground : white.main,
      boxShadow: sacredTheme
        ? egyptianStyles.glowEffect
        : '0px 4px 10px rgba(0, 0, 0, 0.2)',
      padding: sacredTheme ? '24px 32px 20px 32px' : '24px',
      pointerEvents: 'auto' as const,
      position: 'fixed' as const,
      overflow: 'auto' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      // Drag positioning
      top: dragPosition.y === 0 ? '50%' : `${dragPosition.y}px`,
      left: dragPosition.x === 0 ? '50%' : `${dragPosition.x}px`,
      transform:
        dragPosition.x === 0 && dragPosition.y === 0
          ? 'translate(-50%, -50%)'
          : 'none',
      cursor: isDragging ? 'grabbing' : 'default',
    }

    if (!sacredTheme) return baseStyles

    return {
      ...baseStyles,
      backdropFilter: 'blur(20px)',
      border: `2px solid ${alpha(egyptianStyles.goldColor, 0.5)}`,
      animation: `${glowPulse} 4s ease-in-out infinite`,
      // Sacred scrollbar styling for the main container
      '&::-webkit-scrollbar': {
        width: '12px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: alpha('#000000', 0.3),
        borderRadius: '6px',
        border: `1px solid ${alpha(egyptianStyles.goldColor, 0.2)}`,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: alpha(egyptianStyles.goldColor, 0.6),
        borderRadius: '6px',
        border: `1px solid ${alpha(egyptianStyles.goldColor, 0.4)}`,
        boxShadow: `0 0 8px ${alpha(egyptianStyles.goldColor, 0.4)}`,
        animation: `${scrollbarGlow} 3s ease-in-out infinite`,
        '&:hover': {
          backgroundColor: alpha(egyptianStyles.goldColor, 0.8),
          boxShadow: `0 0 12px ${alpha(egyptianStyles.goldColor, 0.6)}`,
        },
      },
      '&::-webkit-scrollbar-thumb:active': {
        backgroundColor: egyptianStyles.goldColor,
        boxShadow: `0 0 15px ${alpha(egyptianStyles.goldColor, 0.8)}`,
      },
      // Firefox scrollbar styling
      scrollbarWidth: 'thin',
      scrollbarColor: `${alpha(egyptianStyles.goldColor, 0.6)} ${alpha('#000000', 0.3)}`,
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
  }, [sacredTheme, width, dragPosition, isDragging])

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

      {/* Top-right controls: Drag icon and Close button */}
      <Box
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          zIndex: theme => theme.zIndex.modal + 1,
        }}
      >
        {/* Drag indicator */}
        <IconButton
          size="small"
          onMouseDown={handleMouseDown}
          sx={{
            color: sacredTheme
              ? egyptianStyles.goldColor
              : theme => theme.palette.grey[500],
            cursor: isDragging ? 'grabbing' : 'grab',
            ...(sacredTheme && {
              animation: `${closeButtonGlow} 6s ease-in-out infinite`,
              animationDelay: '1s',
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
                backgroundColor: alpha('#000', 0.04),
              },
            }),
          }}
        >
          <DragIndicator />
        </IconButton>

        {/* Close button */}
        <IconButton
          size="small"
          onClick={handleClose}
          onMouseDown={e => e.stopPropagation()} // Prevent drag when clicking close
          sx={{
            color: sacredTheme
              ? egyptianStyles.goldColor
              : theme => theme.palette.grey[500],
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
                backgroundColor: alpha('#000', 0.04),
              },
            }),
          }}
        >
          <Close />
        </IconButton>
      </Box>

      {renderHeader}

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          minHeight: 0,
          paddingRight: '10px',
          ...(sacredTheme
            ? {
                position: 'relative',
                zIndex: 1,
                // Custom scrollbar styling for sacred theme
                '&::-webkit-scrollbar': {
                  width: '12px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: alpha('#000000', 0.3),
                  borderRadius: '6px',
                  border: `1px solid ${alpha(egyptianStyles.goldColor, 0.2)}`,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(egyptianStyles.goldColor, 0.6),
                  borderRadius: '6px',
                  border: `1px solid ${alpha(egyptianStyles.goldColor, 0.4)}`,
                  boxShadow: `0 0 8px ${alpha(egyptianStyles.goldColor, 0.4)}`,
                  animation: `${scrollbarGlow} 3s ease-in-out infinite`,
                  '&:hover': {
                    backgroundColor: alpha(egyptianStyles.goldColor, 0.8),
                    boxShadow: `0 0 12px ${alpha(egyptianStyles.goldColor, 0.6)}`,
                  },
                },
                '&::-webkit-scrollbar-thumb:active': {
                  backgroundColor: egyptianStyles.goldColor,
                  boxShadow: `0 0 15px ${alpha(egyptianStyles.goldColor, 0.8)}`,
                },
                // Firefox scrollbar styling
                scrollbarWidth: 'thin',
                scrollbarColor: `${alpha(egyptianStyles.goldColor, 0.6)} ${alpha('#000000', 0.3)}`,
              }
            : {}),
        }}
      >
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
