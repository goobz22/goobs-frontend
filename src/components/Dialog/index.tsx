'use client'

import React, { useEffect, useRef } from 'react'
import { getDialogStyles, type DialogStyles } from '../../theme/dialog'

export interface DialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Function to call when the dialog should close */
  onClose: () => void
  /** The content to display in the dialog */
  children: React.ReactNode
  /** Custom styles to apply to the dialog using the theme system */
  styles?: DialogStyles
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, children, styles }) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const styleRef = useRef<HTMLStyleElement | null>(null)

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
    // Inject scrollbar CSS when dialog opens
    if (open) {
      const computedStyles = getDialogStyles(styles)

      // Remove existing style if it exists
      if (styleRef.current) {
        document.head.removeChild(styleRef.current)
      }

      // Create and inject new style
      const styleElement = document.createElement('style')
      styleElement.textContent = computedStyles.scrollbarCSS
      document.head.appendChild(styleElement)
      styleRef.current = styleElement
    }

    // Cleanup on unmount or when dialog closes
    return () => {
      if (styleRef.current && document.head.contains(styleRef.current)) {
        document.head.removeChild(styleRef.current)
        styleRef.current = null
      }
    }
  }, [open, styles])

  if (!open) {
    return null
  }

  const computedStyles = getDialogStyles(styles)

  return (
    <div style={computedStyles.backdrop} onClick={onClose}>
      <div
        ref={dialogRef}
        style={computedStyles.dialog}
        onClick={e => e.stopPropagation()}
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
