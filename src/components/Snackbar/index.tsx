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

  // A11y (WCAG 2.2.1 Timing Adjustable) — the auto-hide countdown is a
  // content-imposed time limit on reading the message, so it must be
  // pausable/extendable by the user. We track hover and focus-within
  // independently and pause the timer whenever EITHER is active, so:
  //   • a pointer user hovering to read the toast, and
  //   • a keyboard/AT user who has tabbed to the Close button
  // never have it yanked away mid-interaction. When both release, the effect
  // below reschedules a FRESH full-duration timer, so the user always gets the
  // complete reading window after they stop interacting. (Turning auto-hide off
  // entirely remains available to the consumer via `autoHideDuration={0}`.)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocusWithin, setIsFocusWithin] = useState(false)
  const isPaused = isHovered || isFocusWithin

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  // Reset the WCAG 2.2.1 pause flags whenever the snackbar is CLOSED. A parent
  // almost always keeps this instance MOUNTED and merely toggles `open` (we
  // return null when !isOpen, so React state PERSISTS across an
  // open → closed → open cycle for the SAME instance). If a toast is dismissed
  // while it is paused, the DOM release handlers may never fire:
  //   • Enter/Space on the focused Close button runs Alert's 200ms exit, then
  //     onClose → parent sets open=false → this node unmounts while the button
  //     still holds focus; a native blur on an element removed during React's
  //     own commit is not reliably delivered to the delegated focus listener,
  //     so `handleBlur` never runs and isFocusWithin stays true.
  //   • Clicking the inner Close X while still hovering unmounts the node under
  //     the pointer, so no `mouseleave` fires and isHovered stays true.
  // Either way the flags would be STUCK true, and the NEXT open would see
  // isPaused still true so the auto-hide effect below never schedules a timer —
  // the reused toast would never auto-dismiss, silently breaking the auto-hide
  // contract on the a11y-critical keyboard/pointer path. Clearing on close
  // guarantees every reopen starts unpaused with a fresh full-duration timer.
  useEffect(() => {
    if (!isOpen) {
      setIsHovered(false)
      setIsFocusWithin(false)
    }
  }, [isOpen])

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
  //
  // The timer is ALSO suppressed while `isPaused` (hover or focus-within, see
  // above) — WCAG 2.2.1. Because `isPaused` is an effect dependency, releasing
  // the interaction re-runs this effect and schedules a fresh, full-duration
  // countdown rather than resuming a nearly-elapsed one.
  useEffect(() => {
    if (isOpen && !isPaused && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setIsOpen(false)
        onClose()
      }, autoHideDuration)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [isOpen, isPaused, autoHideDuration, onClose])

  // Focus leaving the snackbar entirely (relatedTarget is outside the root)
  // releases the focus pause; focus moving BETWEEN descendants keeps it paused.
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsFocusWithin(false)
    }
  }

  // A11y (WCAG 2.1.1 Keyboard) — Escape dismisses the toast when focus is WITHIN
  // it. This is the library-wide dismiss affordance for overlays (Dialog,
  // Popover, Drawer) and the standard behavior of dismissible-toast patterns
  // (Radix Toast / react-aria), giving a keyboard user who has Tabbed to the
  // Close control the universal "dismiss" key rather than requiring them to
  // land Enter/Space precisely on the small button.
  //
  // Scope matters for a NON-MODAL toast: this is a delegated `onKeyDown` on the
  // root, so it only fires when a descendant (the Close button) is focused and
  // the keydown bubbles up — it can NEVER hijack Escape for a user typing
  // elsewhere on the page (a document-level listener, which is correct for the
  // Popover the user just opened, would be wrong here). `stopPropagation` keeps
  // the Escape from ALSO dismissing an ancestor overlay (e.g. a Dialog the
  // snackbar renders inside) — the toast is the innermost dismissible surface.
  // Dismissal mirrors the auto-hide path exactly (`setIsOpen(false)` + `onClose`,
  // no exit animation), so a reused-and-remounted instance closes consistently.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      setIsOpen(false)
      onClose()
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={cssStyles.root}
      data-component="Snackbar"
      data-state={isOpen ? 'open' : 'closed'}
      // `data-paused` exposes the WCAG 2.2.1 hover/focus pause purely as an
      // additive test/observability hook (absent when running). It does not
      // alter semantics — the live-region announcement is owned by the inner
      // Alert's role="alert".
      data-paused={isPaused || undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocusWithin(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
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
