'use client'

import React, { useState, useEffect, useRef } from 'react'
import Alert, { AlertProps } from '../Alert'
import { emitDiag } from '../../utils/diag'
import cssStyles from './Snackbar.module.css'

export interface SnackbarProps {
  open: boolean
  onClose: () => void
  message: string
  severity: AlertProps['severity']
  /**
   * Milliseconds before the snackbar automatically hides. Defaults to 6000
   * when omitted (`undefined`). Pass `0` (or any non-positive value) to
   * DISABLE auto-hide entirely — the snackbar then stays visible until it is
   * dismissed manually (close button / `onClose`).
   */
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

  // Diagnostic bus — emit the snackbar open/closed lifecycle as a
  // `component.state` transition so outcome tests can assert the snackbar
  // appeared/dismissed without scraping the DOM. Edge-triggered off `isOpen`
  // so it fires once per transition, not on every render. The inner Alert
  // emits its own `toast.shown`; this beacon is the container-level open/closed
  // state, which is additive. No-op when no bus is present.
  const wasOpenRef = useRef(false)
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true
      emitDiag({
        type: 'component.state',
        component: 'Snackbar',
        state: 'open',
      })
    } else if (!isOpen && wasOpenRef.current) {
      wasOpenRef.current = false
      emitDiag({
        type: 'component.state',
        component: 'Snackbar',
        state: 'closed',
      })
    }
  }, [isOpen])

  // Auto-hide timer. A non-positive `autoHideDuration` (e.g. `0`) means
  // "never auto-hide": no timer is scheduled, so the snackbar stays open
  // until dismissed manually. (Previously the timer was ALWAYS scheduled, so
  // `autoHideDuration={0}` hid the snackbar after 0ms instead of disabling.)
  useEffect(() => {
    if (isOpen && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setIsOpen(false)
        onClose()
      }, autoHideDuration)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [isOpen, autoHideDuration, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={cssStyles.root}
      data-component="Snackbar"
      data-state={isOpen ? 'open' : 'closed'}
    >
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
