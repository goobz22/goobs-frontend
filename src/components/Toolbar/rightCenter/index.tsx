'use client'

import React from 'react'
import ManageRow from '../../DataGrid/ManageRow'

export interface RightCenterProps {
  selectedRows?: string[]
  rows?: Array<{ [key: string]: unknown }>
  onDuplicate?: () => void
  onDelete?: () => void
  onManage?: () => void
  onShow?: () => void
  onExport?: () => void
  handleClose?: () => void
  sacredtheme?: boolean
}

const premiumStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    height: '100%',
    padding: '0 16px',
  } as React.CSSProperties,
}

const sacredStyles = {
  container: {
    ...premiumStyles.container,
  } as React.CSSProperties,
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
  sacredtheme,
}: RightCenterProps) {
  const styles = sacredtheme ? sacredStyles : premiumStyles
  return (
    <div style={styles.container}>
      <ManageRow
        selectedRows={selectedRows}
        rows={rows}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onManage={onManage}
        onShow={onShow}
        onExport={onExport}
        handleClose={handleClose}
        sacredtheme={sacredtheme}
      />
    </div>
  )
}

export default RightCenter
