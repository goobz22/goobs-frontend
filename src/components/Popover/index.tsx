'use client'

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import { emitDiag } from '../../utils/diag'
import cssStyles from './Popover.module.css'

/**
 * Caller-supplied styling + theme selection for the Popover surface.
 *
 * Theme palette / radius / shadow / border / blur / transition live in
 * `Popover.module.css` keyed off `data-theme`. The fields below are
 * OPTIONAL caller overrides — when set they win over the CSS defaults
 * via inline style, preserving the old `getPopoverStyles` override
 * semantics exactly. Anchor positioning is computed at runtime from
 * `getBoundingClientRect()` and piped in via CSS custom properties.
 */
export interface PopoverStyles {
  // Theme selection — drives `data-theme` on the surface. Default `light`.
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling overrides
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  backdropFilter?: string
  backgroundImage?: string

  // Layout and sizing
  maxWidth?: string
  width?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
  padding?: string
  margin?: string
  marginTop?: string

  // Positioning
  zIndex?: number
  position?: string
  top?: string
  left?: string
  right?: string
  bottom?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string
}

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
  // Bumped on scroll/resize while open so the render-time getBoundingClientRect
  // re-measures and the popover stays anchored to its trigger instead of
  // detaching when the page scrolls.
  const [, setRepositionTick] = useState(0)
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

  // Keep the popover anchored to its trigger while open: re-render on
  // scroll/resize so the render-time anchor measurement re-runs.
  useEffect(() => {
    if (!open) return
    const reposition = () => setRepositionTick(tick => tick + 1)
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open])

  // Diagnostic bus — emit an open/closed state transition whenever the
  // popover's `open` prop flips. Additive: observes the existing controlled
  // `open` state without altering any open/close behavior. No-op when no host
  // bus is present.
  useEffect(() => {
    emitDiag({
      type: 'component.state',
      component: 'Popover',
      ...(dataSubject !== undefined && { subject: dataSubject }),
      state: open ? 'open' : 'closed',
    })
  }, [open, dataSubject])

  if (!open || !anchorEl || !mounted) {
    return null
  }

  // Theme palette / radius / shadow / border / blur / transition come from
  // Popover.module.css keyed off this attribute. Default `light` matches the
  // old getPopoverTheme default (`styles?.theme || 'light'`).
  const theme = styles?.theme ?? 'light'

  // Runtime anchor measurement stays in JS (cardinal: getBoundingClientRect
  // positioning belongs in JS) and is piped to CSS via custom properties.
  // The old generator set top = styles.top || anchorRect.bottom and
  // left = styles.left || anchorRect.left.
  const rect = anchorEl.getBoundingClientRect()
  const resolvedTop = styles?.top ?? `${rect.bottom}px`
  const resolvedLeft = styles?.left ?? `${rect.left}px`

  // Caller-supplied overrides win over the CSS defaults via inline style —
  // exactly the override branch of the old getPopoverStyles. Only set a
  // property when the caller actually provided it, so the CSS theme value
  // applies otherwise.
  const dynamicStyle: CSSProperties = {
    ['--popover-top' as string]: resolvedTop,
    ['--popover-left' as string]: resolvedLeft,
    ...(styles?.backgroundColor !== undefined && {
      backgroundColor: styles.backgroundColor,
    }),
    // Old behavior: borderColor present → `${borderWidth || '1px'} solid <color>`
    ...(styles?.borderColor !== undefined && {
      border: `${styles.borderWidth ?? '1px'} solid ${styles.borderColor}`,
    }),
    ...(styles?.borderRadius !== undefined && {
      borderRadius: styles.borderRadius,
    }),
    ...(styles?.boxShadow !== undefined && { boxShadow: styles.boxShadow }),
    ...(styles?.backdropFilter !== undefined && {
      backdropFilter: styles.backdropFilter,
    }),
    ...(styles?.backgroundImage !== undefined && {
      backgroundImage: styles.backgroundImage,
    }),
    ...(styles?.marginTop !== undefined && { marginTop: styles.marginTop }),
    ...(styles?.zIndex !== undefined && { zIndex: styles.zIndex }),
    ...(styles?.position !== undefined && {
      position: styles.position as CSSProperties['position'],
    }),
    ...(styles?.transitionDuration !== undefined && {
      transition: `all ${styles.transitionDuration} ${styles.transitionEasing ?? 'cubic-bezier(0.4, 0, 0.2, 1)'}`,
    }),
    // Layout and sizing — caller-supplied only (unchanged from old generator).
    ...(styles?.maxWidth !== undefined && { maxWidth: styles.maxWidth }),
    ...(styles?.width !== undefined && { width: styles.width }),
    ...(styles?.minWidth !== undefined && { minWidth: styles.minWidth }),
    ...(styles?.height !== undefined && { height: styles.height }),
    ...(styles?.maxHeight !== undefined && { maxHeight: styles.maxHeight }),
    ...(styles?.minHeight !== undefined && { minHeight: styles.minHeight }),
    ...(styles?.padding !== undefined && { padding: styles.padding }),
    ...(styles?.margin !== undefined && { margin: styles.margin }),
    // Positioning overrides for the remaining edges.
    ...(styles?.right !== undefined && { right: styles.right }),
    ...(styles?.bottom !== undefined && { bottom: styles.bottom }),
  }

  const popoverContent = (
    <div
      ref={popoverRef}
      className={cssStyles.popover}
      data-component="Popover"
      data-theme={theme}
      data-state="open"
      style={dynamicStyle}
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
