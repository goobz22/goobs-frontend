'use client'

import React from 'react'
import Add from '../../Icons/Add'
import ContentCopy from '../../Icons/ContentCopy'
import Delete from '../../Icons/Delete'
import Edit from '../../Icons/Edit'
import Visibility from '../../Icons/Visibility'
import type { DataGridStyles } from '../types'
import cssStyles from '../DataGrid.module.css'

type ModalType = 'duplicate' | 'delete' | 'manage' | 'show'

interface ManageRowProps {
  handleClose?: () => void
  selectedRows?: string[]
  onAdd?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  onManage?: () => void
  onShow?: () => void
  styles?: DataGridStyles
}

function ManageRow({
  handleClose = () => {},
  selectedRows = [],
  onAdd,
  onDuplicate,
  onDelete,
  onManage,
  onShow,
  styles,
}: ManageRowProps) {
  // Theme drives only the data-theme attribute now; all color/spacing tokens
  // live in DataGrid.module.css as CSS custom properties keyed off it.
  const theme = styles?.theme || 'sacred'
  const hasSelection = selectedRows.length > 0
  const isSingleSelection = selectedRows.length === 1

  const handleActionSelection = (type: ModalType) => {
    switch (type) {
      case 'duplicate':
        onDuplicate?.()
        handleClose()
        break
      case 'delete':
        if (onDelete) {
          onDelete()
          if (selectedRows.length > 0) {
            handleClose()
          }
        }
        break
      case 'manage':
        if (selectedRows.length === 1 && onManage) {
          onManage()
          return
        }
        break
      case 'show':
        onShow?.()
        handleClose()
        break
    }
  }

  // Render helpers (plain functions, NOT components — they hold no state now
  // that hover styling moved to CSS, so they're invoked directly rather than
  // mounted as <ActionButton />. This avoids the react-hooks/static-components
  // "component created during render" rule that capitalized inline components
  // trip, while keeping closure access to handlers/styles.)
  const renderActionButton = ({
    onClick,
    icon,
    title,
    action,
    isDelete = false,
  }: {
    onClick: () => void
    icon: React.ReactNode
    title: string
    /**
     * The kebab-cased verb identifier this button triggers — emitted as
     * `data-action` so Playwright tests can target the row-level CRUD
     * verb without depending on icon SVGs or visual hover state. Each
     * verb is unique within a ManageRow so `[data-action="delete"]`
     * locates a specific button deterministically.
     */
    action: 'manage' | 'show' | 'duplicate' | 'delete'
    isDelete?: boolean
  }) => (
    <button
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
      className={`${cssStyles.manageRowActionBtn} ${isDelete ? cssStyles.manageRowActionBtnDelete : ''}`}
      title={title}
      type="button"
      data-action={action}
      aria-label={title}
    >
      {icon}
    </button>
  )

  const hasAnyAction = onManage || onShow || onDuplicate || onDelete
  const hasSingleRowActions = onManage || onShow || onDuplicate

  const renderAddButton = () => (
    <button
      onClick={e => {
        e.stopPropagation()
        onAdd?.()
      }}
      className={cssStyles.manageRowAddBtn}
      title="Add"
      type="button"
      data-action="add"
      aria-label="Add"
    >
      <Add
        styles={{ theme: styles?.theme || 'light' }}
        width="14"
        height="14"
      />
      <span className={cssStyles.manageRowAddLabel}>Add</span>
    </button>
  )

  return (
    <div
      className={cssStyles.manageRow}
      data-theme={theme}
      // Outer marker so tests can assert "the row-level toolbar exists"
      // and read the current selection count from a stable attribute
      // rather than parsing the .countBadge text. data-has-selection drives
      // the count badge + label color via CSS.
      data-grid-managerow="true"
      data-has-selection={hasSelection ? 'true' : 'false'}
      data-selected-count={selectedRows.length}
      role="toolbar"
      aria-label="Row actions"
    >
      {/* Add button - always visible when onAdd is provided */}
      {onAdd && (
        <>
          {renderAddButton()}
          <div className={cssStyles.manageRowDivider} />
        </>
      )}

      <div
        className={cssStyles.manageRowCount}
        data-has-selection={hasSelection ? 'true' : 'false'}
      >
        {selectedRows.length}
      </div>
      <span className={cssStyles.manageRowLabel}>
        {hasSelection ? 'selected' : 'select'}
      </span>

      {hasSelection && hasAnyAction && (
        <>
          <div className={cssStyles.manageRowDivider} />

          {isSingleSelection && hasSingleRowActions && (
            <>
              {onManage &&
                renderActionButton({
                  action: 'manage',
                  onClick: () => handleActionSelection('manage'),
                  icon: (
                    <Edit
                      styles={{ theme: styles?.theme || 'light' }}
                      width="14"
                      height="14"
                    />
                  ),
                  title: 'Edit',
                })}
              {onShow &&
                renderActionButton({
                  action: 'show',
                  onClick: () => handleActionSelection('show'),
                  icon: (
                    <Visibility
                      styles={{ theme: styles?.theme || 'light' }}
                      width="14"
                      height="14"
                    />
                  ),
                  title: 'View',
                })}
              {onDuplicate &&
                renderActionButton({
                  action: 'duplicate',
                  onClick: () => handleActionSelection('duplicate'),
                  icon: (
                    <ContentCopy
                      styles={{ theme: styles?.theme || 'light' }}
                      width="14"
                      height="14"
                    />
                  ),
                  title: 'Duplicate',
                })}
            </>
          )}

          {onDelete &&
            renderActionButton({
              action: 'delete',
              onClick: () => handleActionSelection('delete'),
              icon: (
                <Delete
                  styles={{ theme: styles?.theme || 'light' }}
                  width="14"
                  height="14"
                />
              ),
              title: 'Delete',
              isDelete: true,
            })}
        </>
      )}
    </div>
  )
}

export default ManageRow
