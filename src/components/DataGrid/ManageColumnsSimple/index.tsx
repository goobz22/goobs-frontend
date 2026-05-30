'use client'

import React from 'react'
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
        className={cssStyles.manageColumnsModal}
        data-theme={theme}
        onClick={e => e.stopPropagation()}
      >
        <h3 className={cssStyles.manageColumnsTitle}>{'Manage Columns'}</h3>

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
                  styles={{
                    theme: isSacredTheme ? 'sacred' : 'light',
                  }}
                />
              </div>
            )
          })}
        </div>

        <button onClick={onClose} className={cssStyles.manageColumnsDoneBtn}>
          Done
        </button>
      </div>
    </div>
  )
}

export default ManageColumnsSimple
