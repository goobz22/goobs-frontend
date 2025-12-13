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
}

const Popover: React.FC<PopoverProps> = ({
  open,
  onClose,
  anchorEl,
  children,
  styles,
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

      console.log('[Popover] handleClickOutside called', {
        clickStartedInside: clickStartedInsideRef.current,
        target: (target as HTMLElement)?.tagName,
        targetText: (target as HTMLElement)?.textContent?.slice(0, 30),
        popoverExists: !!popover,
        popoverContainsTarget: popover?.contains(target),
        anchorContainsTarget: anchorEl?.contains(target),
      })

      // If click started inside popover, don't close
      if (clickStartedInsideRef.current) {
        console.log('[Popover] Click started inside, not closing')
        clickStartedInsideRef.current = false
        return
      }

      // Check if click is inside popover
      if (popover && popover.contains(target)) {
        console.log('[Popover] Click is inside popover, not closing')
        return
      }

      // Check if click is on anchor element
      if (anchorEl && anchorEl.contains(target)) {
        console.log('[Popover] Click is on anchor, not closing')
        return
      }

      console.log('[Popover] Closing popover')
      onCloseRef.current()
    },
    [anchorEl]
  )

  const handleMouseDownInside = useCallback(() => {
    console.log('[Popover] mousedown inside popover - setting flag')
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
    >
      {children}
    </div>
  )

  // Use portal to render at document body level
  return createPortal(popoverContent, document.body)
}

export default Popover
