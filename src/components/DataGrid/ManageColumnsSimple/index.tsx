'use client'

import React from 'react'
import type { ColumnDef } from '../types'
import type { DataGridStyles } from '../../../theme'
import Checkbox from '../../Checkbox'

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

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  }

  const modalStyle: React.CSSProperties = {
    backgroundColor: isSacredTheme ? 'rgba(0, 0, 0, 0.95)' : 'white',
    borderRadius: '12px',
    padding: '24px',
    minWidth: '400px',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflow: 'auto',
    border: isSacredTheme ? '2px solid #FFD700' : '1px solid #E5E7EB',
    boxShadow: isSacredTheme
      ? '0 20px 40px rgba(255, 215, 0, 0.3)'
      : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: isSacredTheme ? '#FFD700' : '#1F2937',
    textAlign: 'center',
    fontFamily: isSacredTheme ? 'Cinzel, serif' : 'inherit',
  }

  const columnItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: `1px solid ${isSacredTheme ? 'rgba(255, 215, 0, 0.2)' : '#F3F4F6'}`,
  }

  const columnNameStyle: React.CSSProperties = {
    fontSize: '14px',
    color: isSacredTheme ? '#FBBF24' : '#374151',
    fontFamily: isSacredTheme ? 'Cinzel, serif' : 'inherit',
  }

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: isSacredTheme ? 'rgba(255, 215, 0, 0.1)' : '#F3F4F6',
    color: isSacredTheme ? '#FFD700' : '#374151',
    marginTop: '20px',
    width: '100%',
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <h3 style={titleStyle}>{'Manage Columns'}</h3>

        <div>
          {columns.map(column => {
            const isVisible = !hiddenColumns.has(column.field)
            const canHide = canHideColumn(column.field)
            const isLastVisible = isVisible && visibleColumnCount === 1
            return (
              <div key={column.field} style={columnItemStyle}>
                <span
                  style={{
                    ...columnNameStyle,
                    ...(isLastVisible && { opacity: 0.6 }),
                  }}
                >
                  {column.headerName || column.field}
                  {isLastVisible && (
                    <span
                      style={{
                        fontSize: '11px',
                        marginLeft: '8px',
                        color: isSacredTheme
                          ? 'rgba(255, 215, 0, 0.5)'
                          : '#9CA3AF',
                      }}
                    >
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

        <button
          onClick={onClose}
          style={buttonStyle}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = isSacredTheme
              ? 'rgba(255, 215, 0, 0.2)'
              : '#E5E7EB'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = isSacredTheme
              ? 'rgba(255, 215, 0, 0.1)'
              : '#F3F4F6'
          }}
        >
          Done
        </button>
      </div>
    </div>
  )
}

export default ManageColumnsSimple
