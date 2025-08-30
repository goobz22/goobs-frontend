'use client'

import React, { useState, useEffect, useRef } from 'react'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import Dialog from '../../Dialog'
import CloseIcon from '../../Icons/Close'
import DragIcon from '../../Icons/Drag'
import ContentSection, { ContentSectionProps } from '../../Content'
import CustomButton, { ButtonProps } from '../../Button'
import Typography from '../../Typography'
import { SACRED_GLYPHS } from '../../../theme/shared'

export interface PopupStyles {
  theme?: 'sacred' | 'light' | 'dark'
  width?: number
}

export interface PopupProps {
  open: boolean
  close: boolean
  onClose: () => void
  title?: string
  description?: string
  grids?: ContentSectionProps['grids']
  content?: React.ReactNode
  buttons?: ButtonProps[]
  styles?: PopupStyles
}

const getStyles = (
  options: PopupStyles | undefined,
  dragPosition?: { x: number; y: number },
  isDragging?: boolean,
  hasDragged?: boolean
) => {
  const actualTheme = options?.theme || 'sacred'
  const width = options?.width ?? 450

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

  // Only apply positioning styles if the dialog has been dragged
  const positionStyles = hasDragged
    ? {
        position: 'fixed' as const,
        top: `${dragPosition?.y}px`,
        left: `${dragPosition?.x}px`,
        transform: 'none',
        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        willChange: 'transform',
      }
    : {}

  return {
    dialog: {
      width: `min(${width}px, calc(100vw - 2rem))`,
      maxWidth: '95vw',
      maxHeight: '90vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      cursor: isDragging ? 'grabbing' : 'default',
      ...positionStyles,
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
        actualTheme === 'sacred' && !isDragging
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
      maxHeight: '100%',
      padding: '1rem',
      paddingRight: '1.5rem',
      borderRadius: '0.5rem',
      ...(actualTheme === 'sacred' && {
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
  buttons,
  styles: popupStyles,
}: PopupProps) {
  const [isOpen, setIsOpen] = useState(open)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [hasDragged, setHasDragged] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const dragHandleRef = useRef<HTMLButtonElement>(null)
  const dragStartPos = useRef({ x: 0, y: 0, mouseX: 0, mouseY: 0 })
  const actualTheme = popupStyles?.theme || 'sacred'
  const widthValue = popupStyles?.width ?? 450
  const styles = getStyles(popupStyles, dragPosition, isDragging, hasDragged)

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
      setHasDragged(false)
    }
  }, [open])

  // Setup pragmatic-drag-and-drop
  useEffect(() => {
    const dragHandle = dragHandleRef.current
    if (!dragHandle || !isOpen) return

    const cleanup = draggable({
      element: dragHandle,
      getInitialData: () => ({ type: 'popup-drag-handle' }),
      onDragStart: () => {
        setIsDragging(true)

        // If first drag, capture the current position
        if (!hasDragged) {
          const popup = document.querySelector(
            '[data-dialog-paper="true"]'
          ) as HTMLElement
          if (popup) {
            const rect = popup.getBoundingClientRect()
            dragStartPos.current = {
              x: rect.left,
              y: rect.top,
              mouseX: 0,
              mouseY: 0,
            }
            setDragPosition({ x: rect.left, y: rect.top })
            setHasDragged(true)
          }
        } else {
          dragStartPos.current = {
            x: dragPosition.x,
            y: dragPosition.y,
            mouseX: 0,
            mouseY: 0,
          }
        }
      },
      onDrop: () => {
        setIsDragging(false)
      },
    })

    // Monitor drag movements
    const unsubscribe = monitorForElements({
      onDragStart: ({ location, source }) => {
        if (source.data.type === 'popup-drag-handle') {
          dragStartPos.current.mouseX = location.current.input.clientX
          dragStartPos.current.mouseY = location.current.input.clientY
        }
      },
      onDrag: ({ location, source }) => {
        if (source.data.type === 'popup-drag-handle') {
          const deltaX =
            location.current.input.clientX - dragStartPos.current.mouseX
          const deltaY =
            location.current.input.clientY - dragStartPos.current.mouseY

          const newX = dragStartPos.current.x + deltaX
          const newY = dragStartPos.current.y + deltaY

          // Apply boundaries - respect layout constraints
          const isDesktop = window.innerWidth >= 1200
          const drawerWidth = isDesktop ? 320 : 0
          const appBarHeight = 80
          const bottomPadding = 20

          const maxX = window.innerWidth - 100
          const minX = drawerWidth + (isDesktop ? 0 : -widthValue + 100)
          const maxY = window.innerHeight - bottomPadding - 50 // Leave space at bottom
          const minY = appBarHeight

          setDragPosition({
            x: Math.max(minX, Math.min(maxX, newX)),
            y: Math.max(minY, Math.min(maxY, newY)),
          })
        }
      },
    })

    return () => {
      cleanup()
      unsubscribe()
    }
  }, [isOpen, hasDragged, dragPosition, widthValue])

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      styles={{ theme: actualTheme }}
      customDialogStyles={styles.dialog}
      dataDialogPaper={true}
    >
      <div>
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
            ref={dragHandleRef}
            style={{
              ...styles.actionButton,
              cursor: isDragging ? 'grabbing' : 'grab',
              ...(hoveredButton === 'drag' && styles.actionButtonHover),
            }}
            onMouseEnter={() => setHoveredButton('drag')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <DragIcon styles={{ theme: actualTheme || 'sacred' }} />
          </button>
          <button
            onClick={handleClose}
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
              textAlign: 'left',
              paddingLeft: '1rem',
              paddingRight: '1.5rem',
              maxWidth: '100%',
              width: '100%',
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
      </div>
    </Dialog>
  )
}

export default Popup
