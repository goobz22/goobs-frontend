'use client'

import React, { useState, useEffect } from 'react'
import Alert, { AlertProps } from '../Alert'
import cssStyles from './Snackbar.module.css'

export interface SnackbarProps {
  open: boolean
  onClose: () => void
  message: string
  severity: AlertProps['severity']
  autoHideDuration?: number
  /**
   * Styling forwarded to the inner Alert (theme selection + container/
   * severity/close-button overrides). Typed off AlertProps so Snackbar never
   * has to import the Alert theme module directly — the inner Alert owns all
   * visual theming; Snackbar owns only fixed positioning (see
   * Snackbar.module.css).
   */
  styles?: AlertProps['styles']
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
    <div className={cssStyles.root}>
      <Alert
        message={message}
        severity={severity}
        onClose={onClose}
        {...(styles && { styles })}
      />
    </div>
  )
}

export default Snackbar
