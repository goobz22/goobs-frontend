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
  /** Theme variant: 'light' (default), 'dark', or 'sacred'. */
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling overrides
  /** Surface background color. */
  backgroundColor?: string
  /** Surface border color; composes `<borderWidth> solid <borderColor>` (no border override without it). */
  borderColor?: string
  /** Surface border radius. */
  borderRadius?: string
  /** Border width used with borderColor (default 1px); ignored without borderColor. */
  borderWidth?: string
  /** Surface box shadow. */
  boxShadow?: string
  /** Surface backdrop-filter (e.g. a blur). */
  backdropFilter?: string
  /** Surface background-image. */
  backgroundImage?: string

  // Layout and sizing
  /** Surface max-width. */
  maxWidth?: string
  /** Surface width. */
  width?: string
  /** Surface min-width. */
  minWidth?: string
  /** Surface height. */
  height?: string
  /** Surface max-height. */
  maxHeight?: string
  /** Surface min-height. */
  minHeight?: string
  /** Surface padding. */
  padding?: string
  /** Surface margin. */
  margin?: string
  /** Surface top margin. */
  marginTop?: string

  // Positioning
  /** Surface z-index. */
  zIndex?: number
  /** CSS position override (default: fixed via the CSS module). */
  position?: string
  /** CSS `top`; replaces the anchor-derived position (default: the anchor rect's bottom). */
  top?: string
  /** CSS `left`; replaces the anchor-derived position (default: the anchor rect's left). */
  left?: string
  /** CSS `right`. */
  right?: string
  /** CSS `bottom`. */
  bottom?: string

  // Transitions
  /** Replaces the surface transition with `all <duration> <easing>`. */
  transitionDuration?: string
  /** Easing used with transitionDuration (default cubic-bezier(0.4, 0, 0.2, 1)); ignored without it. */
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

  // WCAG modal focus management (WAI-ARIA APG Dialog(Modal) pattern) —
  // `role="dialog"` ONLY, the modal case that emits `aria-modal="true"`. On
  // open: remember the trigger, then move focus into the surface. While open,
  // Tab is trapped so focus cycles within the surface (2.4.3 Focus Order),
  // honouring the `aria-modal="true"` promise that the background is not
  // keyboard-reachable. On close: restore focus to the trigger (4.1.2 Name,
  // Role, Value). Mirrors the sibling Drawer/Dialog modal effect.
  //
  // DELIBERATELY NOT copied from Drawer/Dialog (documented so a later pass does
  // not "restore parity" and regress this component):
  //   - No background `inert`/`aria-hidden` isolation. This surface has NO
  //     backdrop scrim and dismisses via the document-level outside-click
  //     listener above; marking the background `inert` would swallow those
  //     clicks and break outside-click dismissal for every consumer.
  //     `aria-modal` + focus containment is the standard lightweight-popover
  //     modal contract (react-modal / react-aria do the same).
  //   - No body scroll-lock. The popover REPOSITIONS on scroll to stay anchored
  //     to its trigger (see the reposition effect above); locking scroll would
  //     fight that feature. A consumer needing hard background isolation should
  //     use Drawer or Dialog, not Popover.
  // Non-dialog roles (menu/listbox/tooltip/grid/region) are non-modal and their
  // interior focus is consumer-managed, so they neither move focus nor trap.
  useEffect(() => {
    if (!open || role !== 'dialog') return undefined
    const popover = popoverRef.current
    if (!popover) return undefined

    // Remember the trigger so focus can be restored to it on close.
    const previouslyFocused = document.activeElement as HTMLElement | null

    const getFocusable = (): HTMLElement[] =>
      Array.from(
        popover.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(element => element.offsetParent !== null)

    // Move focus into the surface: first focusable child, else the container
    // (which carries tabIndex={-1} for exactly this programmatic-focus case).
    const firstFocusable = getFocusable()[0]
    if (firstFocusable) firstFocusable.focus()
    else popover.focus()

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) {
        // Nothing focusable inside — keep focus on the container, never let Tab
        // escape a surface that claims aria-modal.
        event.preventDefault()
        popover.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      const active = document.activeElement
      // Cycle ONLY at the boundaries. Deliberately NO "active outside surface →
      // recapture" branch: goobs overlays (SearchableSimple, MultiSelect, a
      // nested Popover, …) portal their menus to document.body, so a dropdown
      // opened inside this dialog legitimately holds focus OUTSIDE popoverRef;
      // recapturing there would yank focus out of the open menu and orphan it.
      // Native Tab handles focus while such a portalled descendant is active.
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => {
      document.removeEventListener('keydown', handleTab)
      // Restore focus to the element that opened the dialog (APG requirement).
      previouslyFocused?.focus?.()
    }
  }, [open, role])

  // Accessible name (WCAG 4.1.2 Name, Role, Value) — a `role="dialog"` surface
  // MUST expose an accessible name. It comes from consumer content via
  // `ariaLabelledBy` (a heading id inside `children`, preferred) or the
  // `ariaLabel` fallback; the component cannot invent it. Warn in development
  // when an OPEN dialog popover has neither so a nameless dialog surfaces at
  // author time instead of shipping silently to screen-reader users. Dev-only —
  // compiles out to a no-op in production bundles. Non-dialog roles are exempt
  // (a nameless tooltip/menu is valid).
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    if (!open || role !== 'dialog') return
    if (!ariaLabel && !ariaLabelledBy) {
      console.warn(
        'goobs Popover: rendered as role="dialog" without an accessible name. ' +
          'Pass `ariaLabelledBy` (the id of a heading inside the popover) or, as ' +
          'a fallback, `ariaLabel`, so screen readers announce it (WCAG 4.1.2).'
      )
    }
  }, [open, role, ariaLabel, ariaLabelledBy])

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
      // tabIndex={-1} on the modal surface only, so focus can be moved into the
      // container programmatically when it holds no focusable child (WCAG 2.4.3
      // Focus Order — the focus-trap fallback above depends on this).
      tabIndex={role === 'dialog' ? -1 : undefined}
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
