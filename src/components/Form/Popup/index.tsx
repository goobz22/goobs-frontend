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
}

const getStyles = (
  sacredtheme?: boolean,
  width: number = 450,
  dragPosition?: { x: number; y: number },
  isDragging?: boolean
) => ({
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
    backgroundColor: sacredtheme ? 'rgba(0,0,0,0.85)' : 'white',
    backdropFilter: sacredtheme ? 'blur(16px)' : 'none',
    border: sacredtheme ? '2px solid rgba(255, 215, 0, 0.5)' : 'none',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    animation: sacredtheme ? 'popup-glow-pulse 2s infinite alternate' : 'none',
    boxShadow: sacredtheme
      ? 'none'
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
    color: sacredtheme ? '#FFD700' : '#6B7280',
    animation: sacredtheme
      ? 'popup-close-button-glow 1.5s infinite alternate'
      : 'none',
  } as React.CSSProperties,
  actionButtonHover: {
    backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.1)' : '#F3F4F6',
    transform: 'scale(1.1)',
  } as React.CSSProperties,
  title: {
    textAlign: 'center',
    marginBottom: '0.25rem',
    ...(sacredtheme && {
      fontFamily: 'Cinzel, serif',
      textShadow: '0 0 10px rgba(255,215,0,0.5)',
      letterSpacing: '0.1em',
    }),
  } as React.CSSProperties,
  description: {
    textAlign: 'center',
    marginBottom: '1rem',
    ...(sacredtheme && {
      fontFamily: 'Crimson Text, serif',
      letterSpacing: '0.05em',
    }),
  } as React.CSSProperties,
  contentContainer: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
    paddingRight: '0.625rem',
  } as React.CSSProperties,
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '0.5rem',
    marginTop: '1rem',
    ...(sacredtheme && {
      borderTop: '1px solid rgba(255, 215, 0, 0.2)',
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
})

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
}: PopupProps) {
  const [isOpen, setIsOpen] = useState(open)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const styles = getStyles(sacredtheme, width, dragPosition, isDragging)

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
        theme: sacredtheme ? 'sacred' : 'light',
      }}
    >
      {sacredtheme && (
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
          <DragIcon />
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
          <CloseIcon />
        </button>
      </div>

      {title && (
        <Typography
          text={title}
          styles={{
            color: sacredtheme ? 'gold' : 'black',
            theme: sacredtheme ? 'sacred' : 'light',
          }}
        />
      )}
      {description && (
        <Typography
          text={description}
          styles={{
            color: sacredtheme ? 'white' : 'black',
            theme: sacredtheme ? 'sacred' : 'light',
          }}
        />
      )}

      <div style={styles.contentContainer}>
        {content ||
          (grids && <ContentSection grids={grids} sacredtheme={sacredtheme} />)}
      </div>

      {buttons && buttons.length > 0 && (
        <div style={styles.buttonContainer}>
          {buttons.map((buttonProps, index) => (
            <CustomButton
              key={index}
              {...buttonProps}
              styles={{
                theme: sacredtheme ? 'sacred' : 'light',
                ...buttonProps.styles,
              }}
            />
          ))}
        </div>
      )}

      {sacredtheme && (
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
