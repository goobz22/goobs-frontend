'use client'

import React, { useEffect, useRef } from 'react'

interface PopoverProps {
  open: boolean
  onClose: () => void
  anchorEl: HTMLElement | null
  children: React.ReactNode
  className?: string
  sacredtheme?: boolean
}

const getStyles = (sacredtheme?: boolean) => ({
  popover: {
    marginTop: '0.5rem',
    ...(sacredtheme
      ? {
          backgroundColor: 'rgba(0,0,0,0.95)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '0.375rem',
          boxShadow:
            '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        }
      : {
          backgroundColor: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '0.375rem',
          boxShadow:
            '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        }),
  } as React.CSSProperties,
})

const Popover: React.FC<PopoverProps> = ({
  open,
  onClose,
  anchorEl,
  children,
  className,
  sacredtheme = false,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)
  const styles = getStyles(sacredtheme)

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
  const popoverStyle: React.CSSProperties = {
    position: 'fixed',
    top: rect.bottom,
    left: rect.left,
    zIndex: 1300,
  }

  return (
    <div
      ref={popoverRef}
      style={{ ...popoverStyle, ...styles.popover }}
      className={className}
    >
      {children}
    </div>
  )
}

export default Popover
