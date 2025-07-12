'use client'

import React from 'react'
import ManageRow from '../../DataGrid/ManageRow'
import { ToolbarStyles } from '../../../theme'

export interface RightCenterProps {
  selectedRows?: string[]
  rows?: Array<{ [key: string]: unknown }>
  onDuplicate?: () => void
  onDelete?: () => void
  onManage?: () => void
  onShow?: () => void
  onExport?: () => void
  handleClose?: () => void
  styles?: ToolbarStyles
}

const getStyles = () => {
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      height: '100%',
      padding: '0 16px',
    } as React.CSSProperties,
  }
}

function RightCenter({
  selectedRows = [],
  rows = [],
  onDuplicate,
  onDelete,
  onManage,
  onShow,
  onExport,
  handleClose,
  styles,
}: RightCenterProps) {
  const computedStyles = getStyles()
  return (
    <div style={computedStyles.container}>
      <ManageRow
        selectedRows={selectedRows}
        rows={rows}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onManage={onManage}
        onShow={onShow}
        onExport={onExport}
        handleClose={handleClose}
        styles={{ theme: styles?.theme }}
      />
    </div>
  )
}

export default RightCenter
