'use client'

import React, { useCallback, type FC, type ReactNode } from 'react'
import cssStyles from './Pagination.module.css'
import { emitDiag } from '../../utils/diag'
import FirstPageIcon from '../Icons/FirstPage'
import LastPageIcon from '../Icons/LastPage'
import KeyboardArrowLeftIcon from '../Icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '../Icons/KeyboardArrowRight'

function mergeClassNames(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(' ')
}

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
  'aria-label'?: string
}> = ({ onClick, disabled, children, 'aria-label': ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={mergeClassNames(cssStyles.button, cssStyles.navButton)}
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
  renderItem?: (item: PaginationRenderItemParams) => ReactNode
}> = ({ item, page, onChange, renderItem }) => {
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

    return <div className={cssStyles.ellipsis}>…</div>
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

  return (
    <button
      onClick={handleClick}
      className={mergeClassNames(cssStyles.button, cssStyles.pageButton)}
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
  // Preserve the pre-migration default: only an explicit `theme: 'sacred'`
  // rendered the gold palette (old `isSacredTheme = styles?.theme === 'sacred'`).
  // Every other value — including no theme at all — rendered the MUI palette,
  // which is the bare `.root` default in Pagination.module.css and
  // `[data-theme='sacred']` carries the gold. Emitting the raw theme (no
  // sacred fallback) keeps a no-theme callsite on the MUI palette so the
  // rendered output matches HEAD exactly.
  const theme = styles?.theme

  const items = usePagination({
    count,
    page,
    siblingCount,
    boundaryCount,
  })

  // Additive diagnostics: emit a single nav.change for every page change
  // (nav buttons AND numbered page items route through this), then fire the
  // caller's own onChange. emitDiag is a no-op without a host bus.
  const handleChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, nextPage: number) => {
      emitDiag({
        type: 'nav.change',
        component: 'Pagination',
        to: String(nextPage),
      })
      onChange(event, nextPage)
    },
    [onChange]
  )

  const handleFirstPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        handleChange(event, 1)
      }
    },
    [handleChange, isDisabled]
  )

  const handlePreviousPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        handleChange(event, page - 1)
      }
    },
    [handleChange, page, isDisabled]
  )

  const handleNextPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        handleChange(event, page + 1)
      }
    },
    [handleChange, page, isDisabled]
  )

  const handleLastPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        handleChange(event, count)
      }
    },
    [handleChange, count, isDisabled]
  )

  if (count <= 1) {
    return null
  }

  return (
    <nav
      className={cssStyles.root}
      data-component="Pagination"
      data-theme={theme}
      role="navigation"
      aria-label={ariaLabel ?? 'pagination navigation'}
      data-pagination-root="true"
      data-pagination-current-page={page}
      data-pagination-count={count}
      {...(dataField !== undefined && { 'data-pagination-field': dataField })}
      {...rest}
    >
      <div className={cssStyles.buttonContainer}>
        {showFirstButton && (
          <PaginationButton
            onClick={handleFirstPage}
            disabled={page <= 1 || !!isDisabled}
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
            onChange={handleChange}
            {...(renderItem ? { renderItem } : {})}
          />
        ))}

        {!hideNextButton && (
          <PaginationButton
            onClick={handleNextPage}
            disabled={page >= count || !!isDisabled}
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
