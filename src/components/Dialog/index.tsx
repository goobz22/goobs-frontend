'use client'

import React, { useEffect, useRef, useState, type CSSProperties } from 'react'
import { emitDiag } from '../../utils/diag'
import cssStyles from './Dialog.module.css'

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

/**
 * Modal dialog rendered over a backdrop with Escape-key and backdrop-click
 * dismissal, body scroll-lock, responsive sizing, and sacred/light theming.
 * Provides ARIA modal wiring and emits open/close diagnostics, plus stable
 * `data-dialog`/`data-subject` test selectors.
 */
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
  const contentRef = useRef<HTMLDivElement>(null)
  const screenSize = useScreenSize()

  // Theme variant is a data-attribute on the root. The old component computed
  // `isSacredTheme = styles?.theme === 'sacred'` and rendered the LIGHT palette
  // for every other value (undefined, 'light', 'dark', anything else). Preserve
  // that binary: only an explicit 'sacred' triggers the sacred styling; the
  // no-theme default resolves to 'light', NOT 'sacred'. The CSS module renders
  // 'dark' identically to 'light', matching the old ternary's single non-sacred
  // branch.
  const theme = styles?.theme === 'sacred' ? 'sacred' : 'light'

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

  // Body scroll-lock + wheel forwarding. The wheel handler reads runtime
  // measurements (scrollHeight / clientHeight / scrollTop) off the scrollable
  // content element — that measurement work legitimately stays in JS. The
  // custom scrollbar styling that used to be injected here at runtime now
  // lives statically in Dialog.module.css (scoped ::-webkit-scrollbar rules).
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ''
      return undefined
    }

    document.body.style.overflow = 'hidden'

    const handleWheelEvent = (event: WheelEvent) => {
      // The scrollable region is the content element; fall back to the first
      // descendant div for callers that render their own scroll container.
      const scrollableContent =
        contentRef.current ??
        (dialogRef.current?.querySelector('div') as HTMLElement | null)

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
  }, [open])

  if (!open) {
    return null
  }

  // Responsive max-width / max-height by screen size — runtime-measured, so
  // resolved in JS and handed to CSS as a custom property override.
  const getMaxWidth = () => {
    if (screenSize === 'mobile') return '95vw'
    if (screenSize === 'tablet') return '80vw'
    return styles?.maxWidth || '600px'
  }

  const getMaxHeight = () => {
    if (screenSize === 'mobile') return '90vh'
    return styles?.maxHeight || '80vh'
  }

  // Caller-supplied border override mirrors the old precedence:
  // explicit border > borderColor > theme default (CSS handles the default).
  const dialogBorderOverride = styles?.border
    ? styles.border
    : styles?.borderColor
      ? `2px solid ${styles.borderColor}`
      : undefined

  // Dynamic style: caller overrides + runtime-measured responsive sizes are
  // passed as CSS custom properties so the selectors stay in the module.
  // `undefined` values fall through to the CSS defaults via var() fallbacks.
  const backdropStyle: CSSProperties = {
    ['--dialog-align' as string]: styles?.topOffset ? 'flex-start' : 'center',
    ['--dialog-pad-top' as string]: styles?.topOffset || '16px',
    ...(styles?.backdropBackgroundColor && {
      ['--dialog-backdrop-bg' as string]: styles.backdropBackgroundColor,
    }),
    ...(styles?.backdropFilter && {
      ['--dialog-backdrop-filter' as string]: styles.backdropFilter,
    }),
  }

  const dialogStyle: CSSProperties = {
    ['--dialog-max-width' as string]: styles?.fullWidth
      ? '100%'
      : getMaxWidth(),
    ['--dialog-width' as string]: styles?.fullWidth
      ? '100%'
      : styles?.width || '100%',
    ['--dialog-max-height' as string]: getMaxHeight(),
    ['--dialog-height' as string]: styles?.height || 'auto',
    ...(styles?.minHeight && {
      ['--dialog-min-height' as string]: styles.minHeight,
    }),
    ...(styles?.backgroundColor && {
      ['--dialog-bg' as string]: styles.backgroundColor,
    }),
    ...(dialogBorderOverride && {
      ['--dialog-border' as string]: dialogBorderOverride,
    }),
    ...(styles?.borderRadius && {
      ['--dialog-radius' as string]: styles.borderRadius,
    }),
    ...(styles?.boxShadow && {
      ['--dialog-shadow' as string]: styles.boxShadow,
    }),
    ...customDialogStyles,
  }

  const contentStyle: CSSProperties | undefined = styles?.padding
    ? { ['--dialog-content-padding' as string]: styles.padding }
    : undefined

  return (
    <div
      className={cssStyles.backdrop}
      data-theme={theme}
      style={backdropStyle}
      onClick={onClose}
      data-dialog-backdrop="true"
    >
      <div
        ref={dialogRef}
        className={cssStyles.dialog}
        data-component="Dialog"
        data-state="open"
        data-theme={theme}
        style={dialogStyle}
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
        <div
          ref={contentRef}
          className={cssStyles.content}
          data-theme={theme}
          {...(contentStyle && { style: contentStyle })}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Dialog
