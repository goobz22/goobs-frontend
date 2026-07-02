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
  /** Styling options: theme plus sizing/surface overrides forwarded as CSS custom properties. */
  styles?: {
    /** Theme variant: only 'sacred' selects the sacred palette; any other value (or unset) renders light. */
    theme?: string
    /** Dialog max-width on desktop (default 600px); mobile/tablet clamp to 95vw/80vw. Ignored with fullWidth. */
    maxWidth?: string
    /** Dialog width (default 100%). Ignored with fullWidth. */
    width?: string
    /** Dialog height (default auto). */
    height?: string
    /** Dialog min-height. */
    minHeight?: string
    /** Dialog max-height on desktop (default 80vh); mobile clamps to 90vh. */
    maxHeight?: string
    /** Content-area padding. */
    padding?: string
    /** Dialog border radius. */
    borderRadius?: string
    /** Dialog background color. */
    backgroundColor?: string
    /** Full border shorthand; wins over borderColor. */
    border?: string
    /** Border color; composes a `2px solid <borderColor>` border when `border` is not set. */
    borderColor?: string
    /** Anchors the dialog to the top of the backdrop with this padding instead of vertical centering. */
    topOffset?: string
    /** Stretches the dialog to 100% width/max-width. */
    fullWidth?: boolean
    /** Backdrop background color. */
    backdropBackgroundColor?: string
    /** Backdrop backdrop-filter (e.g. a blur). */
    backdropFilter?: string
    /** Dialog box shadow. */
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

  // Keep the latest onClose without making it an effect dependency, so the
  // focus-trap effect runs once per open-transition (not on every parent
  // re-render, which would otherwise yank focus back to the first element).
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // WCAG modal focus management (APG dialog pattern): on open, move focus into
  // the dialog and remember the trigger; while open, Escape closes and Tab is
  // trapped so focus cycles within the dialog; on close, restore focus to the
  // trigger. Replaces the previous Escape-only handler.
  useEffect(() => {
    if (!open) return undefined
    const previouslyFocused = document.activeElement as HTMLElement | null
    const dialogEl = dialogRef.current

    const getFocusable = (): HTMLElement[] =>
      dialogEl
        ? Array.from(
            dialogEl.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => el.offsetParent !== null)
        : []

    // Move focus into the dialog (first focusable, else the dialog container).
    const firstFocusable = getFocusable()[0]
    if (firstFocusable) firstFocusable.focus()
    else dialogEl?.focus()

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) {
        event.preventDefault()
        dialogEl?.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      const active = document.activeElement
      // Only cycle at the boundaries. Deliberately NO "active not in dialog →
      // recapture" branch: goobs overlays (SearchableSimple, Popover, MultiSelect,
      // Tooltip, …) portal their content to document.body, so a dropdown opened
      // inside a dialog legitimately holds focus OUTSIDE dialogRef. Recapturing
      // there would yank focus out of the open dropdown and orphan it — breaking
      // the canonical dropdown-in-dialog form interaction. Native Tab handles
      // focus while a portalled descendant is active.
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
      // Restore focus to the element that opened the dialog.
      previouslyFocused?.focus?.()
    }
  }, [open])

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
        tabIndex={-1}
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
