'use client'
import React from 'react'
import { Paper, Stack, Box } from '@mui/material'
import Typography from '../../Typography'
import DuplicateIcon from '@mui/icons-material/FileCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import ExportIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'

type ModalType = 'duplicate' | 'delete' | 'export' | 'manage' | 'show'

interface ManageRowProps {
  handleClose?: () => void
  selectedRows?: string[]
  rows?: Array<{ [key: string]: unknown }>
  onDuplicate?: () => void
  onDelete?: () => void
  onManage?: () => void
  onShow?: () => void
  onExport?: () => void
}

function ManageRow({
  handleClose = () => {},
  selectedRows = [],
  rows = [],
  onDuplicate,
  onDelete,
  onManage,
  onShow,
  onExport,
}: ManageRowProps) {
  console.log('ManageRow rendered with props:', {
    selectedRowsCount: selectedRows.length,
    selectedRows,
    hasManageHandler: !!onManage,
  })

  const handleActionSelection = (type: ModalType) => {
    console.log('Action selected:', type, {
      selectedRows,
      hasManageHandler: !!onManage,
      timestamp: new Date().toISOString(),
    })

    switch (type) {
      case 'duplicate':
        onDuplicate?.()
        handleClose()
        break
      case 'delete':
        onDelete?.()
        handleClose()
        break
      case 'export':
        if (onExport) {
          onExport()
        } else {
          handleExport()
        }
        handleClose()
        break
      case 'manage':
        if (selectedRows.length === 1 && onManage) {
          console.log('Triggering manage with selection:', selectedRows[0])
          onManage()
          // Don't call handleClose for manage
          return
        } else {
          console.warn('Invalid manage state:', {
            selectedRows,
            hasManageHandler: !!onManage,
          })
        }
        break
      case 'show':
        onShow?.()
        handleClose()
        break
    }
  }

  const handleExport = () => {
    console.log('Exporting data for rows:', selectedRows)
    const selectedData = rows.filter(row =>
      selectedRows.includes(row.id as string)
    )
    const csvContent = selectedData
      .map(row => Object.values(row).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'exported_data.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const actionButtons = (
    <Stack
      component="div"
      spacing={0}
      direction="row"
      justifyContent="center"
      sx={{ '& > div:not(:last-child)': { marginRight: '2px' } }}
    >
      {/* First group: Manage, Show */}
      {(onManage || onShow) && selectedRows.length === 1 && (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          sx={{
            borderRight: '1px solid #e0e0e0',
            paddingRight: '8px',
            marginRight: '8px',
          }}
        >
          {onManage && (
            <Box
              onClick={e => {
                e.stopPropagation()
                handleActionSelection('manage')
              }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                padding: '8px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                userSelect: 'none',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'black',
                }}
              >
                <EditIcon />
                <Typography fontvariant="merriparagraph" text="Manage" />
              </Box>
            </Box>
          )}
          {onShow && (
            <Box
              onClick={e => {
                e.stopPropagation()
                handleActionSelection('show')
              }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                padding: '8px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                userSelect: 'none',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'black',
                }}
              >
                <VisibilityIcon />
                <Typography fontvariant="merriparagraph" text="Show" />
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Second group: Duplicate, Delete, Export */}
      {selectedRows.length > 0 && (
        <Box display="flex" flexDirection="row" alignItems="center">
          {onDuplicate && (
            <Box
              onClick={e => {
                e.stopPropagation()
                handleActionSelection('duplicate')
              }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                padding: '8px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                userSelect: 'none',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'black',
                }}
              >
                <DuplicateIcon />
                <Typography fontvariant="merriparagraph" text="Duplicate" />
              </Box>
            </Box>
          )}
          {onDelete && (
            <Box
              onClick={e => {
                e.stopPropagation()
                handleActionSelection('delete')
              }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                padding: '8px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                userSelect: 'none',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'black',
                }}
              >
                <DeleteIcon />
                <Typography fontvariant="merriparagraph" text="Delete" />
              </Box>
            </Box>
          )}
          {(onExport || rows.length > 0) && (
            <Box
              onClick={e => {
                e.stopPropagation()
                handleActionSelection('export')
              }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                padding: '8px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                userSelect: 'none',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'black',
                }}
              >
                <ExportIcon />
                <Typography fontvariant="merriparagraph" text="Export" />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Stack>
  )

  if (selectedRows.length === 0) return null

  return (
    <Paper
      elevation={3}
      sx={{
        zIndex: 1300,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
        minWidth: '560px',
        padding: '0 10px',
        userSelect: 'none',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{
          width: '100%',
        }}
      >
        <Box
          flexGrow={1}
          display="flex"
          alignItems="center"
          paddingLeft="16px"
          paddingRight="16px"
        >
          <Typography
            fontvariant="merriparagraph"
            text={`${selectedRows.length} ${
              selectedRows.length === 1 ? 'item' : 'items'
            } selected`}
          />
        </Box>
        {actionButtons}
      </Box>
    </Paper>
  )
}

export default ManageRow
