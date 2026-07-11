'use client'

import React from 'react'
import cssStyles from './Breadcrumb.module.css'
import { emitDiag } from '../../utils/diag'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface BreadcrumbItem {
  /** The label text to display */
  label: string
  /** Optional href for the link */
  href?: string
  /** Whether this is the active/current item */
  isActive?: boolean
  /** Click handler for custom navigation */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

/**
 * Breadcrumb styles configuration. Theme selects the [data-theme] variant on
 * the root; the remaining fields are caller-supplied CSS overrides layered on
 * top of the CSS-module classes (parity with the old getBreadcrumbStyles
 * merge).
 */
export interface BreadcrumbStyles {
  /** Theme variant */
  theme?: 'light' | 'dark' | 'sacred'
  /** Custom container styles */
  container?: React.CSSProperties
  /** Custom item styles */
  item?: React.CSSProperties
  /** Custom separator styles */
  separator?: React.CSSProperties
  /** Custom active item styles */
  activeItem?: React.CSSProperties
  /** Custom hover styles */
  itemHover?: React.CSSProperties
}

export interface BreadcrumbProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[]
  /** Custom separator element */
  separator?: React.ReactNode
  /** Maximum number of items to show */
  maxItems?: number
  /** Comprehensive styling options */
  styles?: BreadcrumbStyles
  /** ARIA label for accessibility */
  'aria-label'?: string
  /**
   * Forwarded ref to the root `<nav>` breadcrumb landmark (React 19
   * ref-as-prop) so consumers can measure, scroll, or move focus into the
   * crumb bar. A breadcrumb renders one interactive `<button>`/`<a>` PER crumb,
   * so there is no single control to ref — the ref lands on the nav container
   * (the library's root-forwarding convention, matching TreeView).
   */
  ref?: React.Ref<HTMLElement>
}

// --------------------------------------------------------------------------
// MAIN BREADCRUMB COMPONENT
// --------------------------------------------------------------------------

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator,
  maxItems,
  styles,
  'aria-label': ariaLabel = 'breadcrumb',
  ref,
}) => {
  const theme = styles?.theme || 'sacred'

  // Handle max items display
  const displayItems =
    maxItems && items.length > maxItems
      ? [
          ...items.slice(0, 1),
          { label: '...', isEllipsis: true },
          ...items.slice(-(maxItems - 2)),
        ]
      : items

  const defaultSeparator = separator || '/'

  const handleItemClick = (
    item: BreadcrumbItem,
    event: React.MouseEvent<HTMLElement>
  ) => {
    // Additive diagnostics: every crumb click emits a nav.change keyed by the
    // crumb's destination (href when present, else its label). Ellipsis items
    // never reach this handler. emitDiag is a no-op without a host bus.
    emitDiag({
      type: 'nav.change',
      component: 'Breadcrumb',
      to: item.href ?? item.label,
    })
    if (item.onClick) {
      event.preventDefault()
      item.onClick(event)
    } else if (item.href && !item.isActive) {
      // Allow normal navigation
      return
    } else if (!item.href) {
      event.preventDefault()
    }
  }

  const renderItem = (
    item: BreadcrumbItem & { isEllipsis?: boolean },
    index: number
  ) => {
    if ('isEllipsis' in item && item.isEllipsis) {
      return (
        <span key={index} className={cssStyles.ellipsis}>
          {item.label}
        </span>
      )
    }

    const itemClassName = item.isActive
      ? `${cssStyles.item} ${cssStyles.activeItem}`
      : cssStyles.item

    // Caller-supplied overrides layered on top of the CSS-module classes
    // (parity with the old getBreadcrumbStyles merge of styles.item /
    // styles.activeItem).
    const itemOverride: React.CSSProperties | undefined = item.isActive
      ? { ...styles?.item, ...styles?.activeItem }
      : styles?.item

    const content = <span className={cssStyles.itemContent}>{item.label}</span>

    // Current page — flagged with aria-current="page" per the WAI-ARIA
    // breadcrumb pattern so assistive tech announces "current page".
    //
    // With no onClick the current page is non-navigable, non-interactive text
    // (the APG ideal — the current page is not a control). When the consumer
    // explicitly wires an onClick onto the active crumb they have opted it into
    // being an interactive control, so it renders as a native <button> — natively
    // keyboard-focusable and Enter/Space-operable — so keyboard users can
    // activate it exactly like mouse users (WCAG 2.1.1), while it still carries
    // aria-current="page". (A prior span+onClick fired on mouse click but was
    // NOT keyboard-focusable/operable — a keyboard-operability gap this closes;
    // onClick continues to fire for diagnostic / consumer-callback parity.)
    if (item.isActive) {
      if (item.onClick) {
        return (
          <button
            key={index}
            type="button"
            className={itemClassName}
            style={itemOverride}
            aria-current="page"
            data-action="navigate"
            onClick={event => handleItemClick(item, event)}
          >
            {content}
          </button>
        )
      }
      return (
        <span
          key={index}
          className={itemClassName}
          style={itemOverride}
          aria-current="page"
        >
          {content}
        </span>
      )
    }

    // Real anchor for href crumbs — crawlable and natively keyboard/focus
    // operable.
    if (item.href) {
      return (
        <a
          key={index}
          href={item.href}
          className={itemClassName}
          style={itemOverride}
          onClick={event => handleItemClick(item, event)}
        >
          {content}
        </a>
      )
    }

    // Interactive crumb without an href → a native <button>. The platform
    // supplies the accessible name (from its text), Enter/Space activation, and
    // focusability, replacing the former role="button" / tabIndex / onKeyPress
    // span (onKeyPress is deprecated and never prevented Space from scrolling).
    if (item.onClick) {
      return (
        <button
          key={index}
          type="button"
          className={itemClassName}
          style={itemOverride}
          data-action="navigate"
          onClick={event => handleItemClick(item, event)}
        >
          {content}
        </button>
      )
    }

    // Plain, non-interactive crumb text (no href, no onClick, not current).
    return (
      <span key={index} className={itemClassName} style={itemOverride}>
        {content}
      </span>
    )
  }

  const renderSeparator = (index: number) => {
    return (
      <span
        key={`separator-${index}`}
        className={cssStyles.separator}
        style={styles?.separator}
        // Purely decorative delimiter between crumbs — hidden from assistive
        // tech so screen readers don't announce "slash" / the icon between
        // every item (WCAG 1.3.1).
        aria-hidden="true"
      >
        {defaultSeparator}
      </span>
    )
  }

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={cssStyles.container}
      data-component="Breadcrumb"
      data-theme={theme}
      style={styles?.container}
    >
      <ol className={cssStyles.list}>
        {displayItems.map((item, index) => (
          <li key={index} className={cssStyles.listItem}>
            {renderItem(item, index)}
            {index < displayItems.length - 1 && renderSeparator(index)}
          </li>
        ))}
      </ol>
      {theme === 'sacred' && <div className={cssStyles.shimmer} />}
    </nav>
  )
}

export default Breadcrumb
