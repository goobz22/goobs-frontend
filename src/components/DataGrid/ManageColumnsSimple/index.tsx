'use client'

import React, { useEffect, useId, useRef } from 'react'
import type { ColumnDef, DataGridStyles } from '../types'
import Checkbox from '../../Checkbox'
import cssStyles from '../DataGrid.module.css'

interface ManageColumnsSimpleProps {
  open: boolean
  onClose: () => void
  columns: ColumnDef[]
  hiddenColumns: Set<string>
  onColumnShow: (field: string) => void
  onColumnHide: (field: string) => void
  styles?: DataGridStyles
}

const ManageColumnsSimple: React.FC<ManageColumnsSimpleProps> = ({
  open,
  onClose,
  columns,
  hiddenColumns,
  onColumnShow,
  onColumnHide,
  styles,
}) => {
  const isSacredTheme = styles?.theme === 'sacred'
  // Modal chrome / colors / fonts are CSS now, keyed off data-theme; the
  // original only branched on sacred vs. not, so any non-sacred theme maps to
  // the light look. isSacredTheme is still used for the Checkbox theme prop.
  const theme = styles?.theme || 'light'

  const titleId = useId()
  const modalRef = useRef<HTMLDivElement>(null)
  const doneBtnRef = useRef<HTMLButtonElement>(null)

  // Dialog behavior (WCAG 2.1.2 / 2.4.3 / 4.1.2): trap Tab focus inside the
  // modal, close on Escape, move focus in on open, and restore focus to the
  // trigger on close.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null

    // Move focus into the dialog once it mounts.
    doneBtnRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusables = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]!
      const last = focusables[focusables.length - 1]!
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      // Restore focus to whatever opened the dialog.
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  // Calculate the number of currently visible columns
  const visibleColumnCount = columns.filter(
    col => !hiddenColumns.has(col.field)
  ).length

  const handleToggleColumn = (field: string, visible: boolean) => {
    if (visible) {
      onColumnShow(field)
    } else {
      // Prevent hiding the last visible column
      if (visibleColumnCount <= 1) {
        return
      }
      onColumnHide(field)
    }
  }

  // Check if a column can be hidden (not the last visible one)
  const canHideColumn = (field: string) => {
    const isVisible = !hiddenColumns.has(field)
    // Can hide if: column is hidden (checking won't hide it) OR there's more than 1 visible column
    return !isVisible || visibleColumnCount > 1
  }

  return (
    <div className={cssStyles.manageColumnsOverlay} onClick={onClose}>
      <div
        ref={modalRef}
        className={cssStyles.manageColumnsModal}
        data-theme={theme}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={e => e.stopPropagation()}
      >
        <h3 id={titleId} className={cssStyles.manageColumnsTitle}>
          {'Manage Columns'}
        </h3>

        <div>
          {columns.map(column => {
            const isVisible = !hiddenColumns.has(column.field)
            const canHide = canHideColumn(column.field)
            const isLastVisible = isVisible && visibleColumnCount === 1
            return (
              <div key={column.field} className={cssStyles.manageColumnsItem}>
                <span
                  className={cssStyles.manageColumnsName}
                  data-last-visible={isLastVisible ? 'true' : undefined}
                >
                  {column.headerName || column.field}
                  {isLastVisible && (
                    <span className={cssStyles.manageColumnsRequired}>
                      (required)
                    </span>
                  )}
                </span>
                <Checkbox
                  checked={isVisible}
                  disabled={!canHide}
                  onChange={checked =>
                    handleToggleColumn(column.field, checked)
                  }
                  // The adjacent column name is a plain <span>, not a <label>,
                  // so name the toggle programmatically (WCAG 1.3.1 / 4.1.2).
                  aria-label={`Show ${column.headerName || column.field} column`}
                  styles={{
                    theme: isSacredTheme ? 'sacred' : 'light',
                  }}
                />
              </div>
            )
          })}
        </div>

        <button
          ref={doneBtnRef}
          type="button"
          onClick={onClose}
          data-action="close"
          className={cssStyles.manageColumnsDoneBtn}
        >
          Done
        </button>
      </div>
    </div>
  )
}

export default ManageColumnsSimple
