'use client'
import React, { useState, useEffect, useMemo } from 'react'
import type { JSX } from 'react'
import HorizontalVariant from './HorizontalVariant'
import VerticalVariant from './VerticalVariant'
import { get, JSONValue } from 'goobs-cache'

// Type definition for alignment options
type Alignment = 'left' | 'center' | 'right' | 'inherit' | 'justify'

/**
 * Interface for the props of the Nav component and its sub-components
 */
export interface NavProps {
  items?: (NavProps | SubNav | View)[] // Array of navigation items
  showSearchbar?: boolean // Flag to show/hide search bar
  showDropdown?: boolean // Flag to show/hide dropdown
  showTitle?: boolean // Flag to show/hide title
  showLine?: boolean // Flag to show/hide divider line
  verticalNavTitle?: string // Title for vertical navigation
  dropdownLabel?: string // Label for dropdown
  searchbarLabel?: string // Label for search bar
  anchor?: 'left' | 'right' // Position of vertical navigation
  orientation?: 'vertical' | 'horizontal' // Orientation of navigation
  height?: string // Height of navigation (for horizontal)
  alignment?: Alignment // Alignment of items (for horizontal)
  navname?: string // Name of the navigation
  title?: string // Title of the navigation item
  route?: string // Route for the navigation item
  subnavs?: SubNav[] // Sub-navigation items
  onClick?: () => void // Click handler for the item
  hasleftborder?: string // Flag for left border
  hasrightborder?: string // Flag for right border
  trigger?: 'route' | 'onClick' | 'routeonhorizontal' // Trigger type for the item
}

/**
 * Type definition for sub-navigation items
 */
export type SubNav = {
  title?: string // Title of the sub-nav
  route?: string // Route for the sub-nav
  subtitle?: string // Subtitle for the sub-nav
  views?: View[] // Views within the sub-nav
  navname?: string // Name of the sub-nav
}

/**
 * Type definition for view items
 */
export type View = {
  route?: string // Route for the view
  title?: string // Title of the view
  subtitle?: string // Subtitle for the view
  navname?: string // Name of the view
}

/**
 * Nav component that renders either a vertical or horizontal navigation
 * @param {NavProps} props - The props for the component
 * @returns {JSX.Element} The rendered Nav component
 */
function Nav({
  items = [],
  showSearchbar = true,
  showDropdown = true,
  showTitle = true,
  showLine = true,
  verticalNavTitle = 'Navigation',
  dropdownLabel = 'Select a nav',
  searchbarLabel = 'Search your navs',
  anchor = 'left',
  orientation,
  height = '80px',
  alignment = 'left',
  navname,
}: NavProps): JSX.Element {
  // State for expanded navigation items
  const [expandedNavs, setExpandedNavs] = useState<string[]>([])
  const [expandedSubnavs, setExpandedSubnavs] = useState<string[]>([])
  const [verticalNavWidth, setVerticalNavWidth] = useState<number>(250) // Default width

  // Memoized navigation items
  const navs = useMemo(() => {
    const navs: NavProps[] = []
    const subnavs: SubNav[] = []
    const views: View[] = []
    items.forEach((item: NavProps | SubNav | View) => {
      if ('title' in item && 'subnavs' in item) {
        navs.push(item as NavProps)
      } else if ('title' in item && 'views' in item) {
        subnavs.push(item as SubNav)
      } else if ('title' in item && 'route' in item) {
        views.push(item as View)
      }
    })
    return navs
  }, [items])

  // Effect to fetch vertical nav width from cache
  useEffect(() => {
    const fetchVerticalNavWidth = async () => {
      const result = await get('verticalNavWidth', 'client')
      if (result && typeof result === 'object' && 'value' in result) {
        setVerticalNavWidth((result as JSONValue).value as number)
      }
    }
    fetchVerticalNavWidth()
  }, [])

  // Render vertical or horizontal variant based on orientation
  if (orientation === 'vertical') {
    return (
      <VerticalVariant
        items={navs}
        showSearchbar={showSearchbar}
        showDropdown={showDropdown}
        showTitle={showTitle}
        showLine={showLine}
        verticalNavTitle={verticalNavTitle}
        dropdownLabel={dropdownLabel}
        searchbarLabel={searchbarLabel}
        anchor={anchor}
        expandedNavs={expandedNavs}
        setExpandedNavs={setExpandedNavs}
        expandedSubnavs={expandedSubnavs}
        setExpandedSubnavs={setExpandedSubnavs}
        verticalNavWidth={`${verticalNavWidth}px`}
      />
    )
  } else {
    return (
      <HorizontalVariant
        items={items}
        height={height}
        alignment={alignment}
        navname={navname}
      />
    )
  }
}

export default Nav
