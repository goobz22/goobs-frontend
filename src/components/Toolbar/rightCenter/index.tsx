'use client'

import React from 'react'
import ManageRow from '../../DataGrid/ManageRow'
import type { ToolbarStyles } from '../../../theme'

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
      height: '100%',
      padding: '0 8px',
      minWidth: '0',
      flex: '1 1 auto',
      maxWidth: '100%',
      overflow: 'hidden',
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
        {...(onDuplicate ? { onDuplicate: onDuplicate as () => void } : {})}
        {...(onDelete ? { onDelete: onDelete as () => void } : {})}
        {...(onManage ? { onManage: onManage as () => void } : {})}
        {...(onShow ? { onShow: onShow as () => void } : {})}
        {...(onExport ? { onExport: onExport as () => void } : {})}
        {...(handleClose ? { handleClose: handleClose as () => void } : {})}
        {...(styles?.theme ? { styles: { theme: styles.theme } } : {})}
      />
    </div>
  )
}

export default RightCenter
