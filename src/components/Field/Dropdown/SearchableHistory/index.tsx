'use client'

import React, { useState, useEffect, useRef, useId } from 'react'
import ReactDOM from 'react-dom'
import cssStyles from './SearchableHistory.module.css'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'
import SearchIcon from '../../../Icons/Search'
import HistoryIcon from '../../../Icons/History'
import {
  useEscape,
  getRequiredProps,
  type FieldStyleOverrides,
} from '../../Shell'

export type NavigationItem = {
  id: string
  label: string
  route?: string
  category?: string
  description?: string
  icon?: React.ReactNode
  type?: 'navigation' | 'data' | 'action'
  metadata?: Record<string, any>
}

export type SearchableHistoryProps = {
  label?: string
  items: NavigationItem[]
  onSelect?: (item: NavigationItem) => void
  placeholder?: string
  helperText?: string
  styles?: FieldStyleOverrides
  maxHistoryItems?: number
  /** Stable test selector — emitted as `data-field` on the container. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the container. */
  dataFieldName?: string
  /**
   * Entity field key. Emitted as `data-field-name` (unless `dataFieldName`
   * is set explicitly). NOTE: this is a navigation/search widget — selecting
   * an item fires `onSelect` to navigate, it does NOT hold a persisted form
   * value. There is therefore intentionally NO Tier-1 `useFieldBinding` value
   * wiring here; `name` only supplies the stable test anchor.
   */
  name?: string
}

const SearchableHistory: React.FC<SearchableHistoryProps> = ({
  label,
  items = [],
  onSelect,
  placeholder = 'Search navigation...',
  helperText,
  styles,
  maxHistoryItems = 10,
  dataField,
  dataFieldName,
  name,
}) => {
  // Stable, SSR-safe ids for label↔input + listbox ARIA wiring.
  const reactId = useId()
  const inputId = `searchable-history-${reactId}`
  const listboxId = `${inputId}-listbox`
  const helperId = `${inputId}-helper`
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null)
  // Use lazy initialization to load history from localStorage
  const [history, setHistory] = useState<NavigationItem[]>(() => {
    if (typeof window === 'undefined') return []
    const savedHistory = localStorage.getItem('searchableHistory')
    if (savedHistory) {
      try {
        return JSON.parse(savedHistory)
      } catch {
        return []
      }
    }
    return []
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchBoxRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 300,
  })

  // Anchor the portalled menu to the search box — recomputed on open and on
  // scroll/resize (rather than closing on any scroll) so it stays interactable
  // for keyboard users, assistive tech, and automated tests that scroll an
  // option into view.
  const computeMenuPosition = React.useCallback(() => {
    const anchor = searchBoxRef.current
    if (!anchor) return
    const rect = anchor.getBoundingClientRect()
    const GAP = 4
    const spaceBelow = window.innerHeight - rect.bottom - GAP
    const maxHeight = Math.max(160, Math.min(300, spaceBelow))
    setDropdownPosition({
      top: rect.bottom + GAP,
      left: rect.left,
      width: rect.width,
      maxHeight,
    })
  }, [])

  // The active theme drives the [data-theme] attribute on the container +
  // portalled menu; CSS switches all colors off of it. Defaults to sacred —
  // matching the deleted getFormFieldTheme default.
  const theme = styles?.theme ?? 'sacred'

  // Error state — was the deleted getSharedFormFieldStyles isError branch.
  // When set, the container + portalled menu redden their label / footer /
  // borders via the [data-error] CSS overrides.
  const isError = styles?.helperTextType === 'error'

  // Caller-supplied layout overrides (width / margins) are the only inline
  // styles left on the container — everything else moved to CSS.
  const containerStyleOverrides: React.CSSProperties = {}
  if (styles?.width) containerStyleOverrides.width = styles.width
  if (styles?.marginTop) containerStyleOverrides.marginTop = styles.marginTop
  if (styles?.marginBottom) {
    containerStyleOverrides.marginBottom = styles.marginBottom
  }
  if (styles?.marginLeft) containerStyleOverrides.marginLeft = styles.marginLeft
  if (styles?.marginRight) {
    containerStyleOverrides.marginRight = styles.marginRight
  }

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && history.length > 0) {
      localStorage.setItem('searchableHistory', JSON.stringify(history))
    }
  }, [history])

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      // Check if click is outside both the container AND the dropdown portal
      const clickedOutsideContainer =
        containerRef.current && !containerRef.current.contains(target)
      const clickedOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(target)

      if (clickedOutsideContainer && clickedOutsideDropdown) {
        setIsOpen(false)
      }
    }

    const handleReposition = (event: Event) => {
      // Scrolling inside the menu itself just moves the list — leave it open.
      if (
        event.type === 'scroll' &&
        dropdownRef.current &&
        dropdownRef.current.contains(event.target as Node)
      ) {
        return
      }
      const rect = searchBoxRef.current?.getBoundingClientRect()
      // Close only once the anchor has scrolled fully out of the viewport.
      if (rect && (rect.bottom < 0 || rect.top > window.innerHeight)) {
        setIsOpen(false)
        return
      }
      computeMenuPosition()
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Capture phase catches scroll on any scrollable ancestor.
      window.addEventListener('scroll', handleReposition, true)
      window.addEventListener('resize', handleReposition)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [isOpen, computeMenuPosition])

  // Position the menu when it opens.
  useEffect(() => {
    if (isOpen) computeMenuPosition()
  }, [isOpen, computeMenuPosition])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (!isOpen) {
      setIsOpen(true)
    }
    // Stay on current tab when typing
  }

  const handleInputFocus = () => {
    setIsOpen(true)
    setActiveTab('overview')
  }

  const handleItemSelect = (item: NavigationItem) => {
    setSelectedItem(item)
    setSearchTerm(item.label)
    setIsOpen(false)

    // Add to history
    setHistory(prev => {
      const filtered = prev.filter(h => h.id !== item.id)
      return [item, ...filtered].slice(0, maxHistoryItems)
    })

    onSelect?.(item)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('searchableHistory')
  }

  // Filter items based on search term
  const filteredItems = items.filter(item => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      item.label.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    )
  })

  const renderItem = (item: NavigationItem) => {
    const isSelected = selectedItem?.id === item.id
    const itemClassNames = [cssStyles.item, isSelected && cssStyles.selected]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        key={item.id}
        className={itemClassNames}
        onClick={() => handleItemSelect(item)}
      >
        <div className={cssStyles.itemLabel}>{item.label}</div>
        {item.description && (
          <div className={cssStyles.itemDescription}>{item.description}</div>
        )}
      </div>
    )
  }

  // Escape closes the dropdown when focus is anywhere in this
  // component's subtree (search input or the portalled menu).
  useEscape(isOpen, () => {
    setIsOpen(false)
    inputRef.current?.focus()
  })

  return (
    <div
      className={cssStyles.container}
      data-theme={theme}
      style={
        Object.keys(containerStyleOverrides).length > 0
          ? containerStyleOverrides
          : undefined
      }
      ref={containerRef}
      data-component="SearchableHistory"
      data-field={dataField}
      data-field-name={dataFieldName ?? name}
      data-state={isOpen ? 'open' : undefined}
      {...(isError && { 'data-error': 'true' })}
    >
      {label && (
        <label htmlFor={inputId} className={cssStyles.label}>
          {label}
          {styles?.required && (
            <span className={cssStyles.requiredIndicator}>
              {styles?.requiredIndicatorText || ' *'}
            </span>
          )}
        </label>
      )}

      <div className={cssStyles.searchAnchor}>
        <div
          ref={searchBoxRef}
          className={cssStyles.searchBox}
          {...(isOpen && { 'data-state': 'open' })}
        >
          <SearchIcon
            styles={{ theme, size: 18 }}
            style={{ marginTop: '5px' }}
          />
          <input
            ref={inputRef}
            id={inputId}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-label={!label ? placeholder : undefined}
            aria-describedby={helperText ? helperId : undefined}
            data-action={isOpen ? 'close' : 'open'}
            data-subject={dataField}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className={cssStyles.input}
            disabled={styles?.disabled}
            {...getRequiredProps(styles?.required)}
          />
          <button
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(!isOpen)
              if (!isOpen) {
                inputRef.current?.focus()
              }
            }}
            className={cssStyles.toggleButton}
            type="button"
            data-action={isOpen ? 'close' : 'open'}
            disabled={styles?.disabled}
          >
            <ArrowDropDownIcon
              styles={{ theme }}
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </button>
        </div>
        {isOpen &&
          typeof document !== 'undefined' &&
          ReactDOM.createPortal(
            <div
              ref={dropdownRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={inputId}
              data-popover="searchable-history"
              data-subject={dataField}
              className={cssStyles.dropdown}
              data-theme={theme}
              {...(isError && { 'data-error': 'true' })}
              style={{
                // Runtime position from getBoundingClientRect — cannot be
                // expressed statically, stays inline per the CSS-module recipe.
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
              }}
            >
              {/* Tabs for Overview, Search and History */}
              <div className={cssStyles.tabs}>
                <button
                  className={
                    activeTab === 'overview'
                      ? `${cssStyles.tab} ${cssStyles.active}`
                      : cssStyles.tab
                  }
                  onClick={e => {
                    e.stopPropagation()
                    e.preventDefault()
                    setActiveTab('overview')
                  }}
                  type="button"
                  data-action="select-tab"
                >
                  Overview
                </button>
                <button
                  className={
                    activeTab === 'history'
                      ? `${cssStyles.tab} ${cssStyles.tabHistory} ${cssStyles.active}`
                      : `${cssStyles.tab} ${cssStyles.tabHistory}`
                  }
                  onClick={e => {
                    e.stopPropagation()
                    e.preventDefault()
                    setActiveTab('history')
                  }}
                  type="button"
                  data-action="select-tab"
                >
                  <HistoryIcon styles={{ theme, size: 14 }} />
                  History
                </button>
              </div>

              {/* Content Area */}
              <div className={cssStyles.content}>
                {activeTab === 'overview' ? (
                  // Overview tab - show filtered items organized by category
                  <>
                    {['Workspace', 'Space', 'View'].map(category => {
                      const categoryItems = filteredItems.filter(
                        item => item.category === category
                      )
                      if (categoryItems.length === 0) return null

                      return (
                        <div key={category}>
                          <div className={cssStyles.categoryHeader}>
                            {category}s
                          </div>
                          {categoryItems.map(item => renderItem(item))}
                        </div>
                      )
                    })}
                    {filteredItems.length === 0 && (
                      <div className={cssStyles.emptyState}>
                        {searchTerm
                          ? `No results for "${searchTerm}"`
                          : 'No navigation items available'}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {history.length > 0 ? (
                      <>
                        {history.map(item => renderItem(item))}
                        <div className={cssStyles.historyFooter}>
                          <button
                            onClick={clearHistory}
                            className={cssStyles.clearButton}
                            type="button"
                            data-action="clear"
                          >
                            Clear History
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className={cssStyles.emptyState}>
                        No recent searches
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>,
            document.body
          )}
      </div>

      {helperText && (
        <div id={helperId} className={cssStyles.footerText}>
          {helperText}
        </div>
      )}
    </div>
  )
}

export default SearchableHistory
