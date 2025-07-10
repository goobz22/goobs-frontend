'use client'

import React, { useEffect, useRef } from 'react'

interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  style?: React.CSSProperties
}

const getStyles = (maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false) => ({
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  } as React.CSSProperties,
  dialog: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow:
      '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    ...(maxWidth && {
      maxWidth: {
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
      }[maxWidth],
    }),
  } as React.CSSProperties,
})

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  children,
  className,
  fullWidth = false,
  maxWidth = 'sm',
  style,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const styles = getStyles(maxWidth)

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div
        ref={dialogRef}
        style={{
          ...styles.dialog,
          ...(fullWidth && { width: '100%' }),
          ...style,
        }}
        className={className}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Dialog
