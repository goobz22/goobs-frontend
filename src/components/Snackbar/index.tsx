'use client'

import React, { useState, useEffect } from 'react'
import Alert, { AlertProps } from '../Alert'
import type { AlertStyles } from '../../theme'

export interface SnackbarProps {
  open: boolean
  onClose: () => void
  message: string
  severity: AlertProps['severity']
  autoHideDuration?: number
  styles?: AlertStyles
}

const Snackbar: React.FC<SnackbarProps> = ({
  open,
  onClose,
  message,
  severity,
  autoHideDuration = 6000,
  styles,
}) => {
  const [isOpen, setIsOpen] = useState(open)

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false)
        onClose()
      }, autoHideDuration)

      return () => clearTimeout(timer)
    }
  }, [isOpen, autoHideDuration, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1400,
      }}
    >
      <Alert
        message={message}
        severity={severity}
        onClose={onClose}
        styles={styles as AlertStyles}
      />
    </div>
  )
}

export default Snackbar
