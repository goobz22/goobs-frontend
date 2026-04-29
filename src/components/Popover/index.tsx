'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { getPopoverStyles, type PopoverStyles } from '../../theme/popover'

export interface PopoverProps {
  /** Whether the popover is open */
  open: boolean
  /** Function to call when the popover should close */
  onClose: () => void
  /** The anchor element to position the popover relative to */
  anchorEl: HTMLElement | null
  /** The content to display in the popover */
  children: React.ReactNode
  /** Custom styles to apply to the popover using the theme system */
  styles?: PopoverStyles
  /**
   * ARIA role for the rendered surface. Defaults to `"dialog"`. Use
   * `"menu"` for action lists, `"tooltip"` for hover-tip content,
   * `"listbox"` for option pickers. Drives screenreader semantics.
   */
  role?: 'dialog' | 'menu' | 'tooltip' | 'listbox' | 'grid' | 'region'
  /** `aria-label` on the popover surface — used when no labelled-by id. */
  ariaLabel?: string
  /** `aria-labelledby` — id of the heading inside `children`. */
  ariaLabelledBy?: string
  /**
   * Stable test selector emitted as `data-popover="<value>"` on the
   * popover root. Convention is a kebab-cased noun like
   * `"row-actions"`, `"date-picker"`, `"filter-menu"`.
   */
  dataPopover?: string
  /** Singular entity noun emitted as `data-subject="<value>"`. */
  dataSubject?: string
}

const Popover: React.FC<PopoverProps> = ({
  open,
  onClose,
  anchorEl,
  children,
  styles,
  role = 'dialog',
  ariaLabel,
  ariaLabelledBy,
  dataPopover,
  dataSubject,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)
  // Use lazy initialization to check if we're on client side
  const [mounted] = useState(() => typeof window !== 'undefined')
  // Track if a click started inside the popover
  const clickStartedInsideRef = useRef(false)

  // Stable onClose reference - update in effect to avoid render-time ref mutation
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node
      const popover = popoverRef.current

      // mousedown started inside popover — treat the whole click as
      // internal even if mouseup landed outside (e.g. text drag-select).
      if (clickStartedInsideRef.current) {
        clickStartedInsideRef.current = false
        return
      }

      if (popover && popover.contains(target)) return
      if (anchorEl && anchorEl.contains(target)) return

      onCloseRef.current()
    },
    [anchorEl]
  )

  const handleMouseDownInside = useCallback(() => {
    clickStartedInsideRef.current = true
  }, [])

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onCloseRef.current()
    }
  }, [])

  useEffect(() => {
    if (!open) return

    // Add listeners after a tick to avoid catching the opening click
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true)
      document.addEventListener('keydown', handleEscape)
    }, 10)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside, true)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, handleClickOutside, handleEscape])

  if (!open || !anchorEl || !mounted) {
    return null
  }

  const rect = anchorEl.getBoundingClientRect()
  const computedStyles = getPopoverStyles(styles, rect)

  const popoverContent = (
    <div
      ref={popoverRef}
      style={computedStyles.popover}
      onMouseDown={handleMouseDownInside}
      role={role}
      aria-modal={role === 'dialog' ? true : undefined}
      aria-label={!ariaLabelledBy ? ariaLabel : undefined}
      aria-labelledby={ariaLabelledBy}
      data-popover={dataPopover}
      data-subject={dataSubject}
    >
      {children}
    </div>
  )

  // Use portal to render at document body level
  return createPortal(popoverContent, document.body)
}

export default Popover
