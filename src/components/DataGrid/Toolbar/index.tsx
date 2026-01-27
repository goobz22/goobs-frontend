'use client'

import React, { useMemo, type FC } from 'react'
import Button, { type ButtonProps } from '../../Button'
import ManageRow from '../ManageRow'
import type { DataGridStyles } from '../../../theme'

export interface DataGridToolbarProps {
  buttons?: ButtonProps[]
  manageRowProps?: {
    selectedRows?: string[]
    rows?: Array<{ [key: string]: unknown }>
    onAdd?: () => void
    onDuplicate?: () => void
    onDelete?: () => void
    onManage?: () => void
    onShow?: () => void
    onExport?: () => void
    handleClose?: () => void
    permissions?:
      | {
          access: 'no-access' | 'read' | 'write'
        }
      | undefined
  }
  styles?: DataGridStyles
  permissions?:
    | {
        access: 'no-access' | 'read' | 'write'
      }
    | undefined
}

const DataGridToolbar: FC<DataGridToolbarProps> = ({
  buttons,
  manageRowProps,
  styles,
  permissions,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    padding: '0.5rem 0.5rem',
    flexWrap: 'wrap',
  }

  const leftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flex: '1 1 auto',
    minWidth: 0,
    flexWrap: 'wrap',
  }

  const rightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    flex: '1 1 auto',
    minWidth: 0,
    flexWrap: 'wrap',
  }

  // Filter buttons based on permissions
  const filteredButtons = useMemo(() => {
    if (!permissions || permissions.access === 'write') {
      return buttons // Show all buttons for write access
    }
    // For read-only access, filter out action buttons (like Create, Delete, etc.)
    return buttons?.filter(btn => {
      const text = btn.text?.toLowerCase() || ''
      // Hide buttons that perform write operations
      return (
        !text.includes('create') &&
        !text.includes('add') &&
        !text.includes('delete') &&
        !text.includes('remove') &&
        !text.includes('edit') &&
        !text.includes('update')
      )
    })
  }, [buttons, permissions])

  return (
    <div style={containerStyle}>
      {/* Left: Buttons */}
      <div style={leftStyle}>
        {filteredButtons?.map((btn, idx) => (
          <Button
            key={idx}
            {...btn}
            styles={{
              ...btn.styles,
              theme: btn.styles?.theme || styles?.theme || 'light',
            }}
          />
        ))}
      </div>

      {/* Right: ManageRow actions - always visible */}
      <div style={rightStyle}>
        <ManageRow
          selectedRows={manageRowProps?.selectedRows || []}
          {...(manageRowProps?.onAdd ? { onAdd: manageRowProps.onAdd } : {})}
          {...(manageRowProps?.onDuplicate
            ? { onDuplicate: manageRowProps.onDuplicate }
            : {})}
          {...(manageRowProps?.onDelete
            ? { onDelete: manageRowProps.onDelete }
            : {})}
          {...(manageRowProps?.onManage
            ? { onManage: manageRowProps.onManage }
            : {})}
          {...(manageRowProps?.onShow ? { onShow: manageRowProps.onShow } : {})}
          {...(manageRowProps?.handleClose
            ? { handleClose: manageRowProps.handleClose }
            : {})}
          {...(styles ? { styles } : {})}
        />
      </div>
    </div>
  )
}

export default DataGridToolbar
