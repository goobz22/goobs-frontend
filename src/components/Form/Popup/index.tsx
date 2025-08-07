'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Dialog from '../../Dialog'
import CloseIcon from '../../Icons/Close'
import DragIcon from '../../Icons/Drag'
import ContentSection, { ContentSectionProps } from '../../Content'
import CustomButton, { ButtonProps } from '../../Button'
import Typography from '../../Typography'

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
  close: boolean
  onClose: () => void
  title?: string
  description?: string
  grids?: ContentSectionProps['grids']
  content?: React.ReactNode
  width?: number
  buttons?: ButtonProps[]
  sacredtheme?: boolean
  theme?: 'sacred' | 'light' | 'dark'
}

const getStyles = (
  sacredtheme?: boolean,
  width: number = 450,
  dragPosition?: { x: number; y: number },
  isDragging?: boolean,
  theme?: 'sacred' | 'light' | 'dark'
) => {
  // Determine the actual theme, with backward compatibility
  const actualTheme = theme || (sacredtheme ? 'sacred' : 'light')

  // Theme-specific colors for action buttons
  const getActionButtonColors = () => {
    switch (actualTheme) {
      case 'sacred':
        return {
          color: '#FFD700',
          hoverBg: 'rgba(255, 215, 0, 0.1)',
          animation: 'popup-close-button-glow 1.5s infinite alternate',
        }
      case 'dark':
        return {
          color: '#D1D5DB',
          hoverBg: 'rgba(75, 85, 99, 0.3)',
          animation: 'none',
        }
      case 'light':
      default:
        return {
          color: '#6B7280',
          hoverBg: '#F3F4F6',
          animation: 'none',
        }
    }
  }

  const actionButtonColors = getActionButtonColors()

  return {
    dialog: {
      width: `${width}px`,
      maxHeight: '90vh',
      top: dragPosition?.y === 0 ? '50%' : `${dragPosition?.y}px`,
      left: dragPosition?.x === 0 ? '50%' : `${dragPosition?.x}px`,
      transform:
        dragPosition?.x === 0 && dragPosition?.y === 0
          ? 'translate(-50%, -50%)'
          : 'none',
      cursor: isDragging ? 'grabbing' : 'default',
      backgroundColor:
        actualTheme === 'sacred'
          ? 'rgba(0,0,0,0.85)'
          : actualTheme === 'dark'
            ? '#1F2937'
            : 'white',
      backdropFilter: actualTheme === 'sacred' ? 'blur(16px)' : 'none',
      border:
        actualTheme === 'sacred'
          ? '2px solid rgba(255, 215, 0, 0.5)'
          : actualTheme === 'dark'
            ? '1px solid #374151'
            : 'none',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      animation:
        actualTheme === 'sacred'
          ? 'popup-glow-pulse 2s infinite alternate'
          : 'none',
      boxShadow:
        actualTheme === 'sacred'
          ? 'none'
          : actualTheme === 'dark'
            ? '0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.15)'
            : '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    } as React.CSSProperties,
    glyph: {
      position: 'absolute',
      color: 'rgba(255, 215, 0, 0.3)',
      fontSize: '1.125rem',
      zIndex: 10,
      animation: 'popup-float 8s infinite alternate',
    } as React.CSSProperties,
    headerActions: {
      position: 'absolute',
      right: '0.5rem',
      top: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.125rem',
      zIndex: 20,
    } as React.CSSProperties,
    actionButton: {
      padding: '0.25rem',
      borderRadius: '9999px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      color: actionButtonColors.color,
      animation: actionButtonColors.animation,
      border: 'none',
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as React.CSSProperties,
    actionButtonHover: {
      backgroundColor: actionButtonColors.hoverBg,
      transform: 'scale(1.1)',
    } as React.CSSProperties,
    contentContainer: {
      flex: 1,
      overflow: 'auto',
      minHeight: 0,
      padding: '1rem', // Add padding to all sides for better spacing
      paddingRight: '1.5rem', // Extra padding on right for scrollbar
      borderRadius: '0.5rem', // Match the popup's rounded corners
      ...(actualTheme === 'sacred' && {
        // Add subtle border for sacred theme to define the scroll area
        border: '1px solid rgba(255, 215, 0, 0.1)',
      }),
    } as React.CSSProperties,
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: '0.5rem',
      marginTop: '1rem',
      ...(actualTheme === 'sacred' && {
        borderTop: '1px solid rgba(255, 215, 0, 0.2)',
        paddingTop: '1rem',
      }),
      ...(actualTheme === 'dark' && {
        borderTop: '1px solid #374151',
        paddingTop: '1rem',
      }),
    } as React.CSSProperties,
    footerGlyphs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.125rem',
      marginTop: '0.5rem',
      opacity: 0.5,
    } as React.CSSProperties,
    footerGlyph: {
      color: '#FFD700',
      fontSize: '0.75rem',
      animation: 'popup-float 3s infinite alternate',
    } as React.CSSProperties,
  }
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
  sacredtheme = true,
  theme,
}: PopupProps) {
  const [isOpen, setIsOpen] = useState(open)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const actualTheme = theme || (sacredtheme ? 'sacred' : 'light')
  const styles = getStyles(
    sacredtheme,
    width,
    dragPosition,
    isDragging,
    actualTheme
  )

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  useEffect(() => {
    if (typeof close === 'boolean') {
      setIsOpen(!close)
    }
  }, [close])

  useEffect(() => {
    if (open) {
      setDragPosition({ x: 0, y: 0 })
    }
  }, [open])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      let currentX = dragPosition.x
      let currentY = dragPosition.y
      if (dragPosition.x === 0 && dragPosition.y === 0) {
        const popup = document.querySelector(
          '[data-dialog-paper="true"]'
        ) as HTMLElement
        if (popup) {
          const rect = popup.getBoundingClientRect()
          currentX = rect.left
          currentY = rect.top
        } else {
          currentX = window.innerWidth / 2 - width / 2
          currentY = window.innerHeight / 2 - 300
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

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
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

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      styles={{
        theme: actualTheme,
      }}
    >
      {actualTheme === 'sacred' && (
        <>
          <div style={{ ...styles.glyph, top: '0.75rem', left: '0.75rem' }}>
            {SACRED_GLYPHS[10]}
          </div>
          <div
            style={{
              ...styles.glyph,
              top: '0.75rem',
              right: '3rem',
              animationDirection: 'reverse',
            }}
          >
            {SACRED_GLYPHS[11]}
          </div>
        </>
      )}

      <div style={styles.headerActions}>
        <button
          onMouseDown={handleMouseDown}
          style={{
            ...styles.actionButton,
            ...(hoveredButton === 'drag' && styles.actionButtonHover),
          }}
          onMouseEnter={() => setHoveredButton('drag')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <DragIcon styles={{ theme: actualTheme || 'sacred' }} />
        </button>
        <button
          onClick={handleClose}
          onMouseDown={e => e.stopPropagation()}
          style={{
            ...styles.actionButton,
            ...(hoveredButton === 'close' && styles.actionButtonHover),
          }}
          onMouseEnter={() => setHoveredButton('close')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <CloseIcon styles={{ theme: actualTheme || 'sacred' }} />
        </button>
      </div>

      {title && (
        <Typography
          text={title}
          styles={{
            variant: actualTheme === 'sacred' ? 'cinzelh4' : 'merrih4',
            theme: actualTheme,
            textAlign: 'center',
            padding: '0 1rem',
            marginBottom: '0.25rem',
          }}
        />
      )}
      {description && (
        <Typography
          text={description}
          styles={{
            variant:
              actualTheme === 'sacred' ? 'cinzelparagraph' : 'merriparagraph',
            theme: actualTheme,
            textAlign: 'center',
            padding: '0 1.5rem',
            marginBottom: '1rem',
          }}
        />
      )}

      <div style={styles.contentContainer}>
        {content ||
          (grids && (
            <ContentSection
              grids={grids}
              sacredtheme={actualTheme === 'sacred'}
            />
          ))}
      </div>

      {buttons && buttons.length > 0 && (
        <div style={styles.buttonContainer}>
          {buttons.map((buttonProps, index) => (
            <CustomButton
              key={index}
              {...buttonProps}
              styles={{
                theme: actualTheme,
                ...buttonProps.styles,
              }}
            />
          ))}
        </div>
      )}

      {actualTheme === 'sacred' && (
        <div style={styles.footerGlyphs}>
          {['𓊖', '𓊗', '𓊖'].map((glyph, index) => (
            <Typography key={index}>{glyph}</Typography>
          ))}
        </div>
      )}
    </Dialog>
  )
}

export default Popup
