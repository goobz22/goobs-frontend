'use client'

import React from 'react'
import { Paper, Stack, Box, useMediaQuery } from '@mui/material'
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
  // Update these to accept an array of strings if you want
  // them to receive the selected row IDs directly:
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
  const isMobile = useMediaQuery('(max-width:600px)')

  const handleActionSelection = (type: ModalType) => {
    switch (type) {
      case 'duplicate':
        onDuplicate?.() // We've already passed selectedRows from DataGrid
        handleClose()
        break
      case 'delete':
        onDelete?.() // same here
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

  const handleExport = () => {
    const selectedData = rows.filter(row =>
      selectedRows.includes((row.id ?? row._id) as string)
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
        minWidth: isMobile ? 'auto' : '560px',
        padding: isMobile ? '0 5px' : '0 10px',
        userSelect: 'none',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box display="flex" alignItems="center" gap={1} sx={{ width: '100%' }}>
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

        <Stack
          component="div"
          spacing={0}
          direction="row"
          justifyContent="center"
          sx={{ '& > div:not(:last-child)': { marginRight: '2px' } }}
        >
          {/* If exactly 1 item selected, show Manage / Show */}
          {selectedRows.length === 1 && (
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

          {/* Duplicate, Delete, Export */}
          {selectedRows.length > 0 && (
            <Box display="flex" flexDirection="row" alignItems="center">
              {onDuplicate && !isMobile && (
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

              {(!isMobile || onExport) && (
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
      </Box>
    </Paper>
  )
}

export default ManageRow
