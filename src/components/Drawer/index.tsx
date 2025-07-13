'use client'

import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { DrawerStyles, getDrawerStyles } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

interface DrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  anchor?: 'left' | 'right'
  variant?: 'permanent' | 'temporary'
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DrawerStyles
}

// --------------------------------------------------------------------------
// MAIN DRAWER COMPONENT
// --------------------------------------------------------------------------

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  children,
  anchor = 'left',
  variant = 'permanent',
  styles,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null)

  const isDisabled = styles?.disabled

  const computedStyles = useMemo(
    () => getDrawerStyles(styles, open, anchor, variant),
    [styles, open, anchor, variant]
  )

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    },
    [onClose]
  )

  const handleBackdropClick = useCallback(() => {
    if (!isDisabled) {
      onClose()
    }
  }, [onClose, isDisabled])

  useEffect(() => {
    if (open && variant === 'temporary') {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, variant, handleClickOutside])

  if (variant === 'permanent') {
    return <div style={computedStyles.permanent}>{children}</div>
  }

  return (
    <>
      {open && (
        <div
          style={computedStyles.temporaryBackdrop}
          onClick={handleBackdropClick}
        />
      )}
      <div ref={drawerRef} style={computedStyles.temporaryDrawer}>
        {children}
      </div>
    </>
  )
}

export default Drawer
