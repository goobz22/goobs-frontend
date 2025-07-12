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
        {children}
      </div>
    </div>
  )
}

export default Dialog
