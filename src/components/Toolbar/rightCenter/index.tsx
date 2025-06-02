'use client'

import React from 'react'
import { Box, useMediaQuery } from '@mui/material'
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
  sacredTheme?: boolean
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
  sacredTheme,
}: RightCenterProps) {
  const isTabletOrBelow = useMediaQuery('(max-width:1024px)')

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        mt: isTabletOrBelow ? '5px' : 0,
        height: isTabletOrBelow ? 'auto' : '100%',
        padding: isTabletOrBelow ? '0 5px' : '0 15px',
      }}
    >
      <ManageRow
        selectedRows={selectedRows}
        rows={rows}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onManage={onManage}
        onShow={onShow}
        onExport={onExport}
        handleClose={handleClose}
        sacredTheme={sacredTheme}
      />
    </Box>
  )
}

export default RightCenter
