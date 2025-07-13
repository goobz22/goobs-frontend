'use client'

import React, { useEffect, useRef } from 'react'
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, onClose, anchorEl])

  if (!open || !anchorEl) {
    return null
  }

  const rect = anchorEl.getBoundingClientRect()
  const computedStyles = getPopoverStyles(styles, rect)

  return (
    <div ref={popoverRef} style={computedStyles.popover}>
      {children}
    </div>
  )
}

export default Popover
