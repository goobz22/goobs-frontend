/**
 * @fileoverview Pagination component for navigating through pages of data.
 * Supports light, dark, and sacred themes with extensive customization options.
 */
'use client'

import React, {
  useState,
  useMemo,
  useCallback,
  type FC,
  type ReactNode,
} from 'react'
import {
  getPaginationStyles,
  SACRED_GLYPHS,
  type PaginationStyles,
} from '../../theme'
import FirstPageIcon from '../Icons/FirstPage'
import LastPageIcon from '../Icons/LastPage'
import KeyboardArrowLeftIcon from '../Icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '../Icons/KeyboardArrowRight'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface PaginationProps {
  /** Current page number (1-based) */
  page: number
  /** Total number of pages */
  count: number
  /** Callback fired when the page is changed */
  onChange: (event: React.MouseEvent<HTMLButtonElement>, page: number) => void
  /** Number of pages to show before and after current page */
  siblingCount?: number
  /** Number of pages to show at the beginning and end */
  boundaryCount?: number
  /** Hide the previous/next buttons */
  hidePrevButton?: boolean
  /** Hide the previous/next buttons */
  hideNextButton?: boolean
  /** Show first/last page buttons */
  showFirstButton?: boolean
  /** Show first/last page buttons */
  showLastButton?: boolean
  /** Custom color for the pagination */
  color?: 'primary' | 'secondary' | 'standard'
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: PaginationStyles
  /** Custom render function for page numbers */
  renderItem?: (item: PaginationRenderItemParams) => ReactNode
}

export interface PaginationRenderItemParams {
  page: number | null
  type:
    | 'page'
    | 'first'
    | 'last'
    | 'next'
    | 'previous'
    | 'start-ellipsis'
    | 'end-ellipsis'
  selected: boolean
  disabled: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

// --------------------------------------------------------------------------
// SACRED THEME COMPONENTS
// --------------------------------------------------------------------------

const SacredGlyphs: FC<{
  isHovered: boolean
  isDisabled: boolean
}> = () => {
  const glyphStyles = useMemo(
    () => ({
      backgroundGlyphs: {
        position: 'absolute' as const,
        top: '8px',
        right: '8px',
        color: 'rgba(255, 215, 0, 0.2)',
        fontSize: '12px',
        animation: 'sacredFloat 3s ease-in-out infinite',
        pointerEvents: 'none' as const,
      },
      decorativeGlyphs: {
        position: 'absolute' as const,
        bottom: '8px',
        left: '8px',
        display: 'flex',
        gap: '4px',
        opacity: 0.3,
      },
      decorativeGlyph: {
        color: '#FFD700',
        fontSize: '12px',
        animation: 'sacredGlow 3s ease-in-out infinite',
      },
    }),
    []
  )

  return (
    <>
      {/* Sacred background glyphs */}
      <div style={glyphStyles.backgroundGlyphs}>{SACRED_GLYPHS[0]}</div>

      {/* Decorative glyphs */}
      <div style={glyphStyles.decorativeGlyphs}>
        <span
          style={{
            ...glyphStyles.decorativeGlyph,
            animationDelay: '0s',
          }}
        >
          {SACRED_GLYPHS[15]}
        </span>
        <span
          style={{
            ...glyphStyles.decorativeGlyph,
            animationDelay: '1s',
          }}
        >
          {SACRED_GLYPHS[16]}
        </span>
        <span
          style={{
            ...glyphStyles.decorativeGlyph,
            animationDelay: '2s',
          }}
        >
          {SACRED_GLYPHS[17]}
        </span>
      </div>
    </>
  )
}

// --------------------------------------------------------------------------
// PAGINATION LOGIC HELPERS
// --------------------------------------------------------------------------

const range = (start: number, end: number): number[] => {
  const length = end - start + 1
  return Array.from({ length }, (_, i) => start + i)
}

const usePagination = ({
  count,
  page,
  siblingCount = 1,
  boundaryCount = 1,
}: {
  count: number
  page: number
  siblingCount?: number
  boundaryCount?: number
}) => {
  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count
  )

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  )
  const firstEndPage = endPages.length > 0 ? endPages[0] : undefined
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    firstEndPage !== undefined ? firstEndPage - 2 : count - 1
  )

  const itemList: (number | 'start-ellipsis' | 'end-ellipsis')[] = [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? ['start-ellipsis' as const]
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - boundaryCount - 1
      ? ['end-ellipsis' as const]
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),
    ...endPages,
  ]

  return itemList
}

// --------------------------------------------------------------------------
// PAGINATION BUTTON COMPONENT
// --------------------------------------------------------------------------

const PaginationButton: FC<{
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled: boolean
  children: ReactNode
  styles: ReturnType<typeof getPaginationStyles>
  'aria-label'?: string
}> = ({ onClick, disabled, children, styles, 'aria-label': ariaLabel }) => {
  const [isHovered, setIsHovered] = useState(false)

  const buttonStyle = disabled
    ? styles.buttonDisabled
    : isHovered
      ? styles.buttonHover
      : styles.button

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  )
}

// --------------------------------------------------------------------------
// PAGINATION ITEM COMPONENT
// --------------------------------------------------------------------------

const PaginationItem: FC<{
  item: number | 'start-ellipsis' | 'end-ellipsis'
  page: number
  count: number
  onChange: (event: React.MouseEvent<HTMLButtonElement>, page: number) => void
  styles: ReturnType<typeof getPaginationStyles>
  renderItem?: (item: PaginationRenderItemParams) => ReactNode
}> = ({ item, page, onChange, styles, renderItem }) => {
  const [isHovered, setIsHovered] = useState(false)

  if (item === 'start-ellipsis' || item === 'end-ellipsis') {
    const ellipsisItem: PaginationRenderItemParams = {
      page: null,
      type: item,
      selected: false,
      disabled: true,
      onClick: () => {},
    }

    if (renderItem) {
      return <>{renderItem(ellipsisItem)}</>
    }

    return <div style={styles.ellipsis}>…</div>
  }

  const isSelected = item === page
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChange(event, item)
  }

  const renderItemParams: PaginationRenderItemParams = {
    page: item,
    type: 'page',
    selected: isSelected,
    disabled: false,
    onClick: handleClick,
  }

  if (renderItem) {
    return <>{renderItem(renderItemParams)}</>
  }

  const buttonStyle = isSelected
    ? styles.pageNumberActive
    : isHovered
      ? {
          ...styles.pageNumber,
          backgroundColor:
            styles.pageNumber.backgroundColor || 'rgba(255, 255, 255, 0.1)',
        }
      : styles.pageNumber

  return (
    <button
      onClick={handleClick}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-current={isSelected ? 'page' : undefined}
      aria-label={`Go to page ${item}`}
    >
      {item}
    </button>
  )
}

// --------------------------------------------------------------------------
// MAIN PAGINATION COMPONENT
// --------------------------------------------------------------------------

/**
 * A pagination component for navigating through pages of data.
 */
const Pagination: FC<PaginationProps> = ({
  page,
  count,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  hidePrevButton = false,
  hideNextButton = false,
  showFirstButton = false,
  showLastButton = false,
  styles,
  renderItem,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const isDisabled = styles?.disabled
  const isSacredTheme = styles?.theme === 'sacred'

  const computedStyles = useMemo(
    () => getPaginationStyles(styles, isDisabled),
    [styles, isDisabled]
  )

  const items = usePagination({
    count,
    page,
    siblingCount,
    boundaryCount,
  })

  const handleFirstPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        onChange(event, 1)
      }
    },
    [onChange, isDisabled]
  )

  const handlePreviousPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        onChange(event, page - 1)
      }
    },
    [onChange, page, isDisabled]
  )

  const handleNextPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        onChange(event, page + 1)
      }
    },
    [onChange, page, isDisabled]
  )

  const handleLastPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        onChange(event, count)
      }
    },
    [onChange, count, isDisabled]
  )

  if (count <= 1) {
    return null
  }

  return (
    <nav
      style={computedStyles.container}
      role="navigation"
      aria-label="pagination navigation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {isSacredTheme && (
        <SacredGlyphs isHovered={isHovered} isDisabled={!!isDisabled} />
      )}

      <div style={computedStyles.buttonContainer}>
        {/* First Page Button */}
        {showFirstButton && (
          <PaginationButton
            onClick={handleFirstPage}
            disabled={page <= 1 || !!isDisabled}
            styles={computedStyles}
            aria-label="Go to first page"
          >
            <FirstPageIcon styles={{ theme: styles?.theme || 'sacred' }} />
          </PaginationButton>
        )}

        {/* Previous Page Button */}
        {!hidePrevButton && (
          <PaginationButton
            onClick={handlePreviousPage}
            disabled={page <= 1 || !!isDisabled}
            styles={computedStyles}
            aria-label="Go to previous page"
          >
            <KeyboardArrowLeftIcon
              styles={{ theme: styles?.theme || 'sacred' }}
            />
          </PaginationButton>
        )}

        {/* Page Numbers */}
        {items.map((item, index) => (
          <PaginationItem
            key={index}
            item={item}
            page={page}
            count={count}
            onChange={onChange}
            styles={computedStyles}
            {...(renderItem ? { renderItem } : {})}
          />
        ))}

        {/* Next Page Button */}
        {!hideNextButton && (
          <PaginationButton
            onClick={handleNextPage}
            disabled={page >= count || !!isDisabled}
            styles={computedStyles}
            aria-label="Go to next page"
          >
            <KeyboardArrowRightIcon
              styles={{ theme: styles?.theme || 'sacred' }}
            />
          </PaginationButton>
        )}

        {/* Last Page Button */}
        {showLastButton && (
          <PaginationButton
            onClick={handleLastPage}
            disabled={page >= count || !!isDisabled}
            styles={computedStyles}
            aria-label="Go to last page"
          >
            <LastPageIcon styles={{ theme: styles?.theme || 'sacred' }} />
          </PaginationButton>
        )}
      </div>
    </nav>
  )
}

Pagination.displayName = 'Pagination'
export default Pagination
