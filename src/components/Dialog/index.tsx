'use client'

import React, { useEffect, useRef, useState } from 'react'
import { alpha } from '../../utils'
import { emitDiag } from '../../utils/diag'

const SACRED_GOLD = '#FFD700'

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  )

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 640) {
        setScreenSize('mobile')
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return screenSize
}

export interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  styles?: {
    theme?: string
    maxWidth?: string
    width?: string
    height?: string
    minHeight?: string
    maxHeight?: string
    padding?: string
    borderRadius?: string
    backgroundColor?: string
    border?: string
    borderColor?: string
    topOffset?: string
    fullWidth?: boolean
    backdropBackgroundColor?: string
    backdropFilter?: string
    boxShadow?: string
  }
  customDialogStyles?: React.CSSProperties
  /**
   * Legacy boolean — when true, renders `data-dialog-paper="true"` on the
   * dialog root. Preserved for back-compat with existing call sites; new
   * code should use `dataDialog` and `dataSubject` instead.
   */
  dataDialogPaper?: boolean
  /**
   * Stable test selector emitted as `data-dialog="<value>"` on the dialog
   * root. Convention is a verb-noun like `"confirm-delete"`,
   * `"create-contract"`, `"manage-category"` so Playwright tests can
   * locate the dialog without depending on visible title text:
   *   `await expect(page.locator('[data-dialog="confirm-delete"]')).toBeVisible()`
   */
  dataDialog?: string
  /**
   * Singular entity noun (e.g. `"contract"`, `"category"`, `"employee"`)
   * emitted as `data-subject="<value>"` on the dialog root. Pairs with
   * `dataDialog` so multiple confirm dialogs on the same page disambiguate
   * by entity:
   *   `[data-dialog="confirm-delete"][data-subject="category"]`
   */
  dataSubject?: string
  /**
   * `aria-labelledby` for the dialog. Should be the id of the heading
   * inside `children` (typically a `<Typography text="..." id="...">`).
   * Required for proper screenreader announcement of the dialog purpose.
   */
  ariaLabelledBy?: string
  /**
   * `aria-describedby` for the dialog. Optional — point at a paragraph
   * id inside `children` for screenreader description below the heading.
   */
  ariaDescribedBy?: string
  /**
   * `aria-label` fallback when there is no visible heading id to point
   * `ariaLabelledBy` at (rare — prefer `ariaLabelledBy` so the heading
   * is the source of truth).
   */
  ariaLabel?: string
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  children,
  styles,
  customDialogStyles,
  dataDialogPaper,
  dataDialog,
  dataSubject,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaLabel,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const styleRef = useRef<HTMLStyleElement | null>(null)
  const screenSize = useScreenSize()

  const isSacredTheme = styles?.theme === 'sacred'

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

  // Diagnostic bus — emit modal open/close transitions so outcome tests (and
  // the dev diagnostics stream) can assert dialog lifecycle without scraping
  // the DOM. Edge-triggered off `open` so it fires once per transition, not
  // on every render. The dialog only knows about backdrop/Escape closes here
  // (action: 'dismiss'); a caller that closes via a confirm/cancel button is
  // responsible for emitting its own outcome. No-op when no bus is present.
  const wasOpenRef = useRef(false)
  useEffect(() => {
    const id = dataDialog || dataSubject || 'dialog'
    if (open && !wasOpenRef.current) {
      wasOpenRef.current = true
      emitDiag({ type: 'dialog.opened', id })
    } else if (!open && wasOpenRef.current) {
      wasOpenRef.current = false
      emitDiag({ type: 'dialog.closed', id, action: 'dismiss' })
    }
  }, [open, dataDialog, dataSubject])

  useEffect(() => {
    if (open) {
      // Inject custom scrollbar styles
      if (styleRef.current) {
        document.head.removeChild(styleRef.current)
      }

      const scrollbarCSS = isSacredTheme
        ? `
          .dialog-content::-webkit-scrollbar {
            width: 8px;
          }
          .dialog-content::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
          }
          .dialog-content::-webkit-scrollbar-thumb {
            background: ${alpha(SACRED_GOLD, 0.5)};
            border-radius: 4px;
          }
          .dialog-content::-webkit-scrollbar-thumb:hover {
            background: ${alpha(SACRED_GOLD, 0.7)};
          }
        `
        : `
          .dialog-content::-webkit-scrollbar {
            width: 8px;
          }
          .dialog-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .dialog-content::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .dialog-content::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `

      const styleElement = document.createElement('style')
      styleElement.textContent = scrollbarCSS
      document.head.appendChild(styleElement)
      styleRef.current = styleElement

      document.body.style.overflow = 'hidden'

      const handleWheelEvent = (event: WheelEvent) => {
        if (dialogRef.current) {
          let scrollableContent = dialogRef.current.querySelector(
            'div[style*="overflow-y: auto"]'
          ) as HTMLElement
          if (!scrollableContent) {
            scrollableContent = dialogRef.current.querySelector(
              'div[style*="overflow"]'
            ) as HTMLElement
          }
          if (!scrollableContent) {
            scrollableContent = dialogRef.current.querySelector(
              'div'
            ) as HTMLElement
          }

          if (scrollableContent) {
            const hasVerticalScrollbar =
              scrollableContent.scrollHeight > scrollableContent.clientHeight
            if (hasVerticalScrollbar) {
              const canScrollDown =
                scrollableContent.scrollTop <
                scrollableContent.scrollHeight - scrollableContent.clientHeight
              const canScrollUp = scrollableContent.scrollTop > 0

              if (
                (event.deltaY > 0 && canScrollDown) ||
                (event.deltaY < 0 && canScrollUp)
              ) {
                scrollableContent.scrollTop += event.deltaY
                event.preventDefault()
              }
            }
          }
        }
      }

      const backdrop = dialogRef.current?.parentElement
      const dialog = dialogRef.current

      if (backdrop) {
        backdrop.addEventListener('wheel', handleWheelEvent, { passive: false })
      }

      if (dialog) {
        dialog.addEventListener('wheel', handleWheelEvent, { passive: false })
      }

      return () => {
        document.body.style.overflow = ''
        if (backdrop) {
          backdrop.removeEventListener('wheel', handleWheelEvent)
        }
        if (dialog) {
          dialog.removeEventListener('wheel', handleWheelEvent)
        }
      }
    }

    return () => {
      if (styleRef.current && document.head.contains(styleRef.current)) {
        document.head.removeChild(styleRef.current)
        styleRef.current = null
      }
      document.body.style.overflow = ''
    }
  }, [open, isSacredTheme])

  if (!open) {
    return null
  }

  const getMaxWidth = () => {
    if (screenSize === 'mobile') return '95vw'
    if (screenSize === 'tablet') return '80vw'
    return styles?.maxWidth || '600px'
  }

  const getMaxHeight = () => {
    if (screenSize === 'mobile') return '90vh'
    return styles?.maxHeight || '80vh'
  }

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:
      styles?.backdropBackgroundColor ||
      (isSacredTheme ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.5)'),
    display: 'flex',
    alignItems: styles?.topOffset ? 'flex-start' : 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
    paddingTop: styles?.topOffset || '16px',
    backdropFilter: styles?.backdropFilter,
  }

  // Construct border value
  const dialogBorder = styles?.border
    ? styles.border
    : styles?.borderColor
      ? `2px solid ${styles.borderColor}`
      : isSacredTheme
        ? `2px solid ${alpha(SACRED_GOLD, 0.5)}`
        : '1px solid rgba(0, 0, 0, 0.12)'

  const dialogStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: isSacredTheme ? 'rgba(0, 0, 0, 0.95)' : '#ffffff',
    border: dialogBorder,
    borderRadius: styles?.borderRadius || '12px',
    boxShadow:
      styles?.boxShadow ||
      (isSacredTheme
        ? `0 8px 32px ${alpha(SACRED_GOLD, 0.3)}`
        : '0 8px 32px rgba(0, 0, 0, 0.2)'),
    maxWidth: styles?.fullWidth ? '100%' : getMaxWidth(),
    width: styles?.fullWidth ? '100%' : styles?.width || '100%',
    maxHeight: getMaxHeight(),
    minHeight: styles?.minHeight,
    height: styles?.height || 'auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }

  const contentStyle: React.CSSProperties = {
    padding: styles?.padding || '24px',
    overflowY: 'auto',
    overflowX: 'hidden',
    color: isSacredTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
    fontFamily: isSacredTheme ? '"Crimson Text", serif' : 'inherit',
  }

  return (
    <div style={backdropStyle} onClick={onClose} data-dialog-backdrop="true">
      <div
        ref={dialogRef}
        style={{
          ...dialogStyle,
          ...customDialogStyles,
        }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-label={!ariaLabelledBy ? ariaLabel : undefined}
        data-dialog-paper={dataDialogPaper ? 'true' : undefined}
        data-dialog={dataDialog}
        data-subject={dataSubject}
      >
        <div className="dialog-content" style={contentStyle}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Dialog
