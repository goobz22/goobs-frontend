'use client'

import React, { useEffect, useRef } from 'react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  anchor?: 'left' | 'right'
  variant?: 'permanent' | 'temporary'
  className?: string
  style?: React.CSSProperties
}

const getStyles = (open: boolean, anchor: 'left' | 'right' = 'left') => ({
  permanent: {
    height: '100%',
    position: 'fixed',
    top: 0,
    [anchor]: 0,
  } as React.CSSProperties,
  temporaryBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 40,
  } as React.CSSProperties,
  temporaryDrawer: {
    position: 'fixed',
    top: 0,
    height: '100%',
    zIndex: 50,
    transition: 'transform 0.3s ease-in-out',
    [anchor]: 0,
    transform: open
      ? 'translateX(0)'
      : anchor === 'left'
        ? 'translateX(-100%)'
        : 'translateX(100%)',
  } as React.CSSProperties,
})

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  children,
  anchor = 'left',
  variant = 'permanent',
  className,
  style,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const styles = getStyles(open, anchor)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (open && variant === 'temporary') {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, onClose, variant])

  if (variant === 'permanent') {
    return (
      <div style={{ ...styles.permanent, ...style }} className={className}>
        {children}
      </div>
    )
  }

  return (
    <>
      {open && <div style={styles.temporaryBackdrop} onClick={onClose} />}
      <div
        ref={drawerRef}
        style={{ ...styles.temporaryDrawer, ...style }}
        className={className}
      >
        {children}
      </div>
    </>
  )
}

export default Drawer
