'use client'

import React, { useState } from 'react'
import { getBreadcrumbStyles, type BreadcrumbStyles } from '../../theme'

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
// SACRED THEME COMPONENTS
// --------------------------------------------------------------------------

const SacredGlyph: React.FC<{
  isHovered: boolean
}> = () => {
  return null
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
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const computedStyles = getBreadcrumbStyles(styles)
  const isSacredTheme = styles?.theme === 'sacred'

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
    const isHovered = hoveredItem === index

    if ('isEllipsis' in item && item.isEllipsis) {
      return (
        <span key={index} style={computedStyles.ellipsis}>
          {item.label}
        </span>
      )
    }

    const itemStyles = {
      ...computedStyles.item,
      ...(item.isActive && computedStyles.activeItem),
      ...(isHovered && !item.isActive && computedStyles.itemHover),
    }

    const content = (
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
        }}
        onMouseEnter={() => setHoveredItem(index)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {item.label}
        {isSacredTheme && !item.isActive && (
          <SacredGlyph isHovered={isHovered} />
        )}
      </span>
    )

    if (item.href && !item.isActive) {
      return (
        <a
          key={index}
          href={item.href}
          style={itemStyles}
          onClick={event => handleItemClick(item, event)}
        >
          {content}
        </a>
      )
    }

    return (
      <span
        key={index}
        style={itemStyles}
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
      <span key={`separator-${index}`} style={computedStyles.separator}>
        {defaultSeparator}
      </span>
    )
  }

  return (
    <nav aria-label={ariaLabel} style={computedStyles.container}>
      <ol style={computedStyles.list}>
        {displayItems.map((item, index) => (
          <li key={index} style={computedStyles.listItem}>
            {renderItem(item, index)}
            {index < displayItems.length - 1 && renderSeparator(index)}
          </li>
        ))}
      </ol>
      {isSacredTheme && <div style={computedStyles.sacred?.shimmer} />}
    </nav>
  )
}

export default Breadcrumb
