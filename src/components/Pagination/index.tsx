'use client'

import React, { useState, useCallback, type FC, type ReactNode } from 'react'
import { alpha } from '../../utils'
import FirstPageIcon from '../Icons/FirstPage'
import LastPageIcon from '../Icons/LastPage'
import KeyboardArrowLeftIcon from '../Icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '../Icons/KeyboardArrowRight'

const SACRED_GOLD = '#FFD700'

export interface PaginationProps {
  page: number
  count: number
  onChange: (event: React.MouseEvent<HTMLButtonElement>, page: number) => void
  siblingCount?: number
  boundaryCount?: number
  hidePrevButton?: boolean
  hideNextButton?: boolean
  showFirstButton?: boolean
  showLastButton?: boolean
  color?: 'primary' | 'secondary' | 'standard'
  /**
   * Stable test selector — emitted as `data-pagination-field` on the
   * <nav> root. Use when the page has multiple pagination instances (e.g.
   * a contracts grid + a categories grid on the same workspace tab) so
   * tests / the harvest can locate the right one without relying on
   * positional traversal.
   */
  dataField?: string
  /**
   * ARIA label for the navigation landmark. Defaults to "pagination navigation".
   * Override per-instance when several paginations live on the same page so
   * screen reader users can disambiguate.
   */
  ariaLabel?: string
  styles?: {
    disabled?: boolean
    theme?: string
    gap?: string
    padding?: string
  }
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

const PaginationButton: FC<{
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled: boolean
  children: ReactNode
  isSacredTheme: boolean
  'aria-label'?: string
}> = ({
  onClick,
  disabled,
  children,
  isSacredTheme,
  'aria-label': ariaLabel,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const buttonStyle: React.CSSProperties = {
    minWidth: '32px',
    height: '32px',
    padding: '4px 8px',
    border: isSacredTheme
      ? `1px solid ${alpha(SACRED_GOLD, disabled ? 0.2 : isHovered ? 0.6 : 0.3)}`
      : '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
    backgroundColor: disabled
      ? 'rgba(0, 0, 0, 0.2)'
      : isHovered
        ? isSacredTheme
          ? alpha(SACRED_GOLD, 0.1)
          : 'rgba(0, 0, 0, 0.04)'
        : 'transparent',
    color: disabled
      ? 'rgba(255, 255, 255, 0.3)'
      : isSacredTheme
        ? SACRED_GOLD
        : 'rgba(0, 0, 0, 0.87)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    fontFamily: isSacredTheme ? '"Cinzel", serif' : 'inherit',
    fontSize: '14px',
    opacity: disabled ? 0.5 : 1,
  }

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

const PaginationItem: FC<{
  item: number | 'start-ellipsis' | 'end-ellipsis'
  page: number
  count: number
  onChange: (event: React.MouseEvent<HTMLButtonElement>, page: number) => void
  isSacredTheme: boolean
  renderItem?: (item: PaginationRenderItemParams) => ReactNode
}> = ({ item, page, onChange, isSacredTheme, renderItem }) => {
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

    const ellipsisStyle: React.CSSProperties = {
      minWidth: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isSacredTheme ? 'rgba(255, 215, 0, 0.6)' : 'rgba(0, 0, 0, 0.38)',
      fontFamily: isSacredTheme ? '"Cinzel", serif' : 'inherit',
      fontSize: '14px',
    }

    return <div style={ellipsisStyle}>…</div>
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

  const buttonStyle: React.CSSProperties = {
    minWidth: '32px',
    height: '32px',
    padding: '4px 8px',
    border: isSacredTheme
      ? `1px solid ${alpha(SACRED_GOLD, isSelected ? 0.6 : isHovered ? 0.4 : 0.3)}`
      : '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
    backgroundColor: isSelected
      ? isSacredTheme
        ? alpha(SACRED_GOLD, 0.2)
        : 'rgba(25, 118, 210, 0.12)'
      : isHovered
        ? isSacredTheme
          ? alpha(SACRED_GOLD, 0.1)
          : 'rgba(0, 0, 0, 0.04)'
        : 'transparent',
    color: isSelected
      ? isSacredTheme
        ? SACRED_GOLD
        : '#1976d2'
      : isSacredTheme
        ? 'rgba(255, 215, 0, 0.8)'
        : 'rgba(0, 0, 0, 0.87)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    fontFamily: isSacredTheme ? '"Cinzel", serif' : 'inherit',
    fontSize: '14px',
    fontWeight: isSelected ? 600 : 400,
    boxShadow:
      isSelected && isSacredTheme
        ? `0 0 10px ${alpha(SACRED_GOLD, 0.3)}`
        : 'none',
  }

  return (
    <button
      onClick={handleClick}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-current={isSelected ? 'page' : undefined}
      aria-label={`Go to page ${item}`}
      data-pagination-page={item}
      data-pagination-selected={isSelected ? 'true' : 'false'}
    >
      {item}
    </button>
  )
}

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
  dataField,
  ariaLabel,
  styles,
  renderItem,
  ...rest
}) => {
  const isDisabled = styles?.disabled
  const isSacredTheme = styles?.theme === 'sacred'

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

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
  }

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }

  return (
    <nav
      style={containerStyle}
      role="navigation"
      aria-label={ariaLabel ?? 'pagination navigation'}
      data-pagination-root="true"
      data-pagination-current-page={page}
      data-pagination-count={count}
      {...(dataField !== undefined && { 'data-pagination-field': dataField })}
      {...rest}
    >
      <div style={buttonContainerStyle}>
        {showFirstButton && (
          <PaginationButton
            onClick={handleFirstPage}
            disabled={page <= 1 || !!isDisabled}
            isSacredTheme={isSacredTheme}
            aria-label="Go to first page"
          >
            <FirstPageIcon
              styles={
                styles?.theme
                  ? { theme: styles.theme as 'sacred' | 'dark' | 'light' }
                  : {}
              }
            />
          </PaginationButton>
        )}

        {!hidePrevButton && (
          <PaginationButton
            onClick={handlePreviousPage}
            disabled={page <= 1 || !!isDisabled}
            isSacredTheme={isSacredTheme}
            aria-label="Go to previous page"
          >
            <KeyboardArrowLeftIcon
              styles={
                styles?.theme
                  ? { theme: styles.theme as 'sacred' | 'dark' | 'light' }
                  : {}
              }
            />
          </PaginationButton>
        )}

        {items.map((item, index) => (
          <PaginationItem
            key={index}
            item={item}
            page={page}
            count={count}
            onChange={onChange}
            isSacredTheme={isSacredTheme}
            {...(renderItem ? { renderItem } : {})}
          />
        ))}

        {!hideNextButton && (
          <PaginationButton
            onClick={handleNextPage}
            disabled={page >= count || !!isDisabled}
            isSacredTheme={isSacredTheme}
            aria-label="Go to next page"
          >
            <KeyboardArrowRightIcon
              styles={
                styles?.theme
                  ? { theme: styles.theme as 'sacred' | 'dark' | 'light' }
                  : {}
              }
            />
          </PaginationButton>
        )}

        {showLastButton && (
          <PaginationButton
            onClick={handleLastPage}
            disabled={page >= count || !!isDisabled}
            isSacredTheme={isSacredTheme}
            aria-label="Go to last page"
          >
            <LastPageIcon
              styles={
                styles?.theme
                  ? { theme: styles.theme as 'sacred' | 'dark' | 'light' }
                  : {}
              }
            />
          </PaginationButton>
        )}
      </div>
    </nav>
  )
}

Pagination.displayName = 'Pagination'
export default Pagination
