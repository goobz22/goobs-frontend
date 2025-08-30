'use client'

import React, { useEffect, useRef, useState } from 'react'
import { getDialogStyles, type DialogStyles } from '../../theme/dialog'

// Hook to detect screen size for responsive behavior
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

    // Check on mount
    checkScreenSize()

    // Add event listener
    window.addEventListener('resize', checkScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return screenSize
}

export interface DialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Function to call when the dialog should close */
  onClose: () => void
  /** The content to display in the dialog */
  children: React.ReactNode
  /** Custom styles to apply to the dialog using the theme system */
  styles?: DialogStyles
  /** Custom dialog styles for positioning (used for dragging) */
  customDialogStyles?: React.CSSProperties
  /** Data attribute for dialog paper (used for drag detection) */
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
    // Inject scrollbar CSS and handle scroll behavior when dialog opens
    if (open) {
      const computedStyles = getDialogStyles(styles, screenSize)

      // Remove existing style if it exists
      if (styleRef.current) {
        document.head.removeChild(styleRef.current)
      }

      // Create and inject new style
      const styleElement = document.createElement('style')
      styleElement.textContent = computedStyles.scrollbarCSS
      document.head.appendChild(styleElement)
      styleRef.current = styleElement

      // Block body scroll when dialog is open
      document.body.style.overflow = 'hidden'

      // Handle scroll events on backdrop to redirect to dialog content
      const handleWheelEvent = (event: WheelEvent) => {
        if (dialogRef.current) {
          // Try multiple selectors to find the scrollable content
          let scrollableContent = dialogRef.current.querySelector(
            'div[style*="overflow-y: auto"]'
          ) as HTMLElement
          if (!scrollableContent) {
            scrollableContent = dialogRef.current.querySelector(
              'div[style*="overflow"]'
            ) as HTMLElement
          }
          if (!scrollableContent) {
            // Fallback to the first child div (content wrapper)
            scrollableContent = dialogRef.current.querySelector(
              'div'
            ) as HTMLElement
          }

          if (scrollableContent) {
            // Check if content is scrollable and has room to scroll
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
                // Redirect scroll to the dialog content
                scrollableContent.scrollTop += event.deltaY
                event.preventDefault()
              }
            }
          }
        }
      }

      // Add wheel event listener to backdrop and dialog
      const backdrop = dialogRef.current?.parentElement
      const dialog = dialogRef.current

      if (backdrop) {
        backdrop.addEventListener('wheel', handleWheelEvent, { passive: false })
      }

      // Also add to dialog itself for direct popup scrolling
      if (dialog) {
        dialog.addEventListener('wheel', handleWheelEvent, { passive: false })
      }

      return () => {
        // Restore body scroll
        document.body.style.overflow = ''
        // Remove wheel event listeners
        if (backdrop) {
          backdrop.removeEventListener('wheel', handleWheelEvent)
        }
        if (dialog) {
          dialog.removeEventListener('wheel', handleWheelEvent)
        }
      }
    }

    // Cleanup on unmount or when dialog closes
    return () => {
      if (styleRef.current && document.head.contains(styleRef.current)) {
        document.head.removeChild(styleRef.current)
        styleRef.current = null
      }
      // Ensure body scroll is restored
      document.body.style.overflow = ''
    }
  }, [open, styles, screenSize])

  if (!open) {
    return null
  }

  const computedStyles = getDialogStyles(styles, screenSize)

  return (
    <div style={computedStyles.backdrop} onClick={onClose}>
      <div
        ref={dialogRef}
        style={{
          ...computedStyles.dialog,
          ...customDialogStyles,
        }}
        onClick={e => e.stopPropagation()}
        data-dialog-paper={dataDialogPaper ? 'true' : undefined}
      >
        <div
          className={computedStyles.contentClassName}
          style={computedStyles.content}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Dialog
