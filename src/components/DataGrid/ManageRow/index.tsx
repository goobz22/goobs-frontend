'use client'

import React from 'react'
import Add from '../../Icons/Add'
import ContentCopy from '../../Icons/ContentCopy'
import Delete from '../../Icons/Delete'
import Edit from '../../Icons/Edit'
import Visibility from '../../Icons/Visibility'
import type { DataGridStyles } from '../../../theme'

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
  const isSacredTheme = styles?.theme === 'sacred'
  const isDarkTheme = styles?.theme === 'dark'
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

  // Theme colors
  const colors = {
    bg: isSacredTheme
      ? 'rgba(0, 0, 0, 0.95)'
      : isDarkTheme
        ? '#1E293B'
        : '#FFFFFF',
    border: isSacredTheme
      ? 'rgba(255, 215, 0, 0.3)'
      : isDarkTheme
        ? '#334155'
        : '#E2E8F0',
    text: isSacredTheme ? '#FFD700' : isDarkTheme ? '#E2E8F0' : '#374151',
    textMuted: isSacredTheme
      ? 'rgba(255, 215, 0, 0.5)'
      : isDarkTheme
        ? '#64748B'
        : '#9CA3AF',
    icon: isSacredTheme ? '#FFD700' : isDarkTheme ? '#94A3B8' : '#6B7280',
    buttonHoverBg: isSacredTheme
      ? 'rgba(255, 215, 0, 0.12)'
      : isDarkTheme
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)',
    deleteIcon: isSacredTheme ? '#FFD700' : '#EF4444',
    deleteHoverBg: isSacredTheme
      ? 'rgba(255, 215, 0, 0.12)'
      : 'rgba(239, 68, 68, 0.08)',
    divider: isSacredTheme
      ? 'rgba(255, 215, 0, 0.2)'
      : isDarkTheme
        ? '#475569'
        : '#E5E7EB',
  }

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    height: '37px',
    padding: '0 6px',
    backgroundColor: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    transition: 'all 0.15s ease',
  }

  const countStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '18px',
    height: '18px',
    padding: '0 4px',
    backgroundColor: hasSelection
      ? isSacredTheme
        ? 'rgba(255, 215, 0, 0.15)'
        : isDarkTheme
          ? 'rgba(59, 130, 246, 0.15)'
          : 'rgba(59, 130, 246, 0.1)'
      : 'transparent',
    borderRadius: '9px',
    fontSize: '11px',
    fontWeight: 600,
    color: hasSelection
      ? isSacredTheme
        ? '#FFD700'
        : '#3B82F6'
      : colors.textMuted,
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 500,
    color: hasSelection ? colors.text : colors.textMuted,
    marginLeft: '4px',
    marginRight: '4px',
    whiteSpace: 'nowrap',
  }

  const dividerStyle: React.CSSProperties = {
    width: '1px',
    height: '16px',
    backgroundColor: colors.divider,
    margin: '0 2px',
  }

  const ActionButton = ({
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
  }) => {
    const [isHovered, setIsHovered] = React.useState(false)

    const buttonStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '26px',
      height: '26px',
      padding: 0,
      backgroundColor: isHovered
        ? isDelete
          ? colors.deleteHoverBg
          : colors.buttonHoverBg
        : 'transparent',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.12s ease',
      color: isDelete ? colors.deleteIcon : colors.icon,
    }

    return (
      <button
        onClick={e => {
          e.stopPropagation()
          onClick()
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={buttonStyle}
        title={title}
        type="button"
        data-action={action}
        aria-label={title}
      >
        {icon}
      </button>
    )
  }

  const hasAnyAction = onManage || onShow || onDuplicate || onDelete
  const hasSingleRowActions = onManage || onShow || onDuplicate

  // Add button color (green/primary)
  const addColor = isSacredTheme ? '#FFD700' : '#22C55E'
  const addHoverBg = isSacredTheme
    ? 'rgba(255, 215, 0, 0.12)'
    : 'rgba(34, 197, 94, 0.08)'

  const AddButton = () => {
    const [isHovered, setIsHovered] = React.useState(false)

    const buttonStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1px',
      padding: '4px 8px',
      backgroundColor: isHovered ? addHoverBg : 'transparent',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.12s ease',
      color: addColor,
    }

    const labelStyle: React.CSSProperties = {
      fontSize: '9px',
      fontWeight: 500,
      lineHeight: 1,
    }

    return (
      <button
        onClick={e => {
          e.stopPropagation()
          onAdd?.()
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={buttonStyle}
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
        <span style={labelStyle}>Add</span>
      </button>
    )
  }

  return (
    <div
      style={containerStyle}
      // Outer marker so tests can assert "the row-level toolbar exists"
      // and read the current selection count from a stable attribute
      // rather than parsing the .countBadge text.
      data-grid-managerow="true"
      data-selected-count={selectedRows.length}
      role="toolbar"
      aria-label="Row actions"
    >
      {/* Add button - always visible when onAdd is provided */}
      {onAdd && (
        <>
          <AddButton />
          <div style={dividerStyle} />
        </>
      )}

      <div style={countStyle}>{selectedRows.length}</div>
      <span style={labelStyle}>{hasSelection ? 'selected' : 'select'}</span>

      {hasSelection && hasAnyAction && (
        <>
          <div style={dividerStyle} />

          {isSingleSelection && hasSingleRowActions && (
            <>
              {onManage && (
                <ActionButton
                  action="manage"
                  onClick={() => handleActionSelection('manage')}
                  icon={
                    <Edit
                      styles={{ theme: styles?.theme || 'light' }}
                      width="14"
                      height="14"
                    />
                  }
                  title="Edit"
                />
              )}
              {onShow && (
                <ActionButton
                  action="show"
                  onClick={() => handleActionSelection('show')}
                  icon={
                    <Visibility
                      styles={{ theme: styles?.theme || 'light' }}
                      width="14"
                      height="14"
                    />
                  }
                  title="View"
                />
              )}
              {onDuplicate && (
                <ActionButton
                  action="duplicate"
                  onClick={() => handleActionSelection('duplicate')}
                  icon={
                    <ContentCopy
                      styles={{ theme: styles?.theme || 'light' }}
                      width="14"
                      height="14"
                    />
                  }
                  title="Duplicate"
                />
              )}
            </>
          )}

          {onDelete && (
            <ActionButton
              action="delete"
              onClick={() => handleActionSelection('delete')}
              icon={
                <Delete
                  styles={{ theme: styles?.theme || 'light' }}
                  width="14"
                  height="14"
                />
              }
              title="Delete"
              isDelete
            />
          )}
        </>
      )}
    </div>
  )
}

export default ManageRow
