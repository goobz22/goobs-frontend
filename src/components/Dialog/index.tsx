'use client'

import React, { useEffect, useRef, useState } from 'react'
import { alpha } from '../../utils'

const SACRED_GOLD = '#FFD700'

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  )

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 640) {
        setScreenSize('mobile')
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return screenSize
}

export interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  styles?: {
    theme?: string
    maxWidth?: string
    width?: string
    height?: string
    maxHeight?: string
    padding?: string
    borderRadius?: string
    [key: string]: any
  }
  customDialogStyles?: React.CSSProperties
  dataDialogPaper?: boolean
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  children,
  styles,
  customDialogStyles,
  dataDialogPaper,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const styleRef = useRef<HTMLStyleElement | null>(null)
  const screenSize = useScreenSize()

  const isSacredTheme = styles?.theme === 'sacred'

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      // Inject custom scrollbar styles
      if (styleRef.current) {
        document.head.removeChild(styleRef.current)
      }

      const scrollbarCSS = isSacredTheme
        ? `
          .dialog-content::-webkit-scrollbar {
            width: 8px;
          }
          .dialog-content::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
          }
          .dialog-content::-webkit-scrollbar-thumb {
            background: ${alpha(SACRED_GOLD, 0.5)};
            border-radius: 4px;
          }
          .dialog-content::-webkit-scrollbar-thumb:hover {
            background: ${alpha(SACRED_GOLD, 0.7)};
          }
        `
        : `
          .dialog-content::-webkit-scrollbar {
            width: 8px;
          }
          .dialog-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .dialog-content::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .dialog-content::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `

      const styleElement = document.createElement('style')
      styleElement.textContent = scrollbarCSS
      document.head.appendChild(styleElement)
      styleRef.current = styleElement

      document.body.style.overflow = 'hidden'

      const handleWheelEvent = (event: WheelEvent) => {
        if (dialogRef.current) {
          let scrollableContent = dialogRef.current.querySelector(
            'div[style*="overflow-y: auto"]'
          ) as HTMLElement
          if (!scrollableContent) {
            scrollableContent = dialogRef.current.querySelector(
              'div[style*="overflow"]'
            ) as HTMLElement
          }
          if (!scrollableContent) {
            scrollableContent = dialogRef.current.querySelector(
              'div'
            ) as HTMLElement
          }

          if (scrollableContent) {
            const hasVerticalScrollbar =
              scrollableContent.scrollHeight > scrollableContent.clientHeight
            if (hasVerticalScrollbar) {
              const canScrollDown =
                scrollableContent.scrollTop <
                scrollableContent.scrollHeight - scrollableContent.clientHeight
              const canScrollUp = scrollableContent.scrollTop > 0

              if (
                (event.deltaY > 0 && canScrollDown) ||
                (event.deltaY < 0 && canScrollUp)
              ) {
                scrollableContent.scrollTop += event.deltaY
                event.preventDefault()
              }
            }
          }
        }
      }

      const backdrop = dialogRef.current?.parentElement
      const dialog = dialogRef.current

      if (backdrop) {
        backdrop.addEventListener('wheel', handleWheelEvent, { passive: false })
      }

      if (dialog) {
        dialog.addEventListener('wheel', handleWheelEvent, { passive: false })
      }

      return () => {
        document.body.style.overflow = ''
        if (backdrop) {
          backdrop.removeEventListener('wheel', handleWheelEvent)
        }
        if (dialog) {
          dialog.removeEventListener('wheel', handleWheelEvent)
        }
      }
    }

    return () => {
      if (styleRef.current && document.head.contains(styleRef.current)) {
        document.head.removeChild(styleRef.current)
        styleRef.current = null
      }
      document.body.style.overflow = ''
    }
  }, [open, isSacredTheme])

  if (!open) {
    return null
  }

  const getMaxWidth = () => {
    if (screenSize === 'mobile') return '95vw'
    if (screenSize === 'tablet') return '80vw'
    return styles?.maxWidth || '600px'
  }

  const getMaxHeight = () => {
    if (screenSize === 'mobile') return '90vh'
    return styles?.maxHeight || '80vh'
  }

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isSacredTheme
      ? 'rgba(0, 0, 0, 0.85)'
      : 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
  }

  const dialogStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: isSacredTheme ? 'rgba(0, 0, 0, 0.95)' : '#ffffff',
    border: isSacredTheme
      ? `2px solid ${alpha(SACRED_GOLD, 0.5)}`
      : '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: styles?.borderRadius || '12px',
    boxShadow: isSacredTheme
      ? `0 8px 32px ${alpha(SACRED_GOLD, 0.3)}`
      : '0 8px 32px rgba(0, 0, 0, 0.2)',
    maxWidth: getMaxWidth(),
    width: styles?.width || '100%',
    maxHeight: getMaxHeight(),
    height: styles?.height || 'auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }

  const contentStyle: React.CSSProperties = {
    padding: styles?.padding || '24px',
    overflowY: 'auto',
    overflowX: 'hidden',
    color: isSacredTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
    fontFamily: isSacredTheme ? '"Crimson Text", serif' : 'inherit',
  }

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div
        ref={dialogRef}
        style={{
          ...dialogStyle,
          ...customDialogStyles,
        }}
        onClick={e => e.stopPropagation()}
        data-dialog-paper={dataDialogPaper ? 'true' : undefined}
      >
        <div className="dialog-content" style={contentStyle}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Dialog
