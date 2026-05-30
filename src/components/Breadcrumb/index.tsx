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

    if (item.href && !item.isActive) {
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

    return (
      <span
        key={index}
        className={itemClassName}
        style={itemOverride}
        onClick={event => handleItemClick(item, event)}
        role={item.onClick ? 'button' : undefined}
        tabIndex={item.onClick ? 0 : undefined}
        onKeyPress={event => {
          if (item.onClick && (event.key === 'Enter' || event.key === ' ')) {
            // Convert keyboard event to mouse event for consistency
            const syntheticEvent = {
              ...event,
              preventDefault: event.preventDefault.bind(event),
              stopPropagation: event.stopPropagation.bind(event),
            } as unknown as React.MouseEvent<HTMLElement>
            item.onClick(syntheticEvent)
          }
        }}
      >
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
      >
        {defaultSeparator}
      </span>
    )
  }

  return (
    <nav
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
