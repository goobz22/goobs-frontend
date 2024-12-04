'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Popover, Stack, Paper, Box, IconButton } from '@mui/material'
import Typography from '../../Typography'
import DuplicateIcon from '@mui/icons-material/FileCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import ExportIcon from '@mui/icons-material/Download'

type ModalType = 'duplicate' | 'delete' | 'export'

interface ManageRowProps {
  open?: boolean
  handleClose?: () => void
  selectedRows?: string[]
  rows?: Array<{ [key: string]: unknown }>
  onDuplicate?: () => void
  onDelete?: () => void
}

function ManageRow({
  open = false,
  handleClose = () => {},
  selectedRows = [],
  rows = [],
  onDuplicate,
  onDelete,
}: ManageRowProps) {
  const [actionType, setActionType] = useState<ModalType | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const popoverRef = useRef<HTMLDivElement>(null)

  const iconMap: { [key in ModalType]: React.ReactElement } = {
    duplicate: <DuplicateIcon />,
    delete: <DeleteIcon />,
    export: <ExportIcon />,
  }

  const handleActionSelection = (type: ModalType) => {
    setActionType(type)
    switch (type) {
      case 'duplicate':
        onDuplicate?.()
        break
      case 'delete':
        onDelete?.()
        break
      case 'export':
        handleExport()
        break
    }
    handleClose()
  }

  const handleExport = () => {
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
    <Stack component="div" spacing={0} direction="row" justifyContent="center">
      {(['duplicate', 'delete', 'export'] as ModalType[]).map(type => (
        <Box
          key={type}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <IconButton
            size="small"
            onClick={() => handleActionSelection(type)}
            sx={{ color: 'black' }}
          >
            {iconMap[type]}
          </IconButton>
          <Typography
            fontvariant="merriparagraph"
            text={type.charAt(0).toUpperCase() + type.slice(1)}
          />
        </Box>
      ))}
    </Stack>
  )

  useEffect(() => {
    const popover = popoverRef.current
    if (!popover) return

    let isDragging = false
    let startX: number, startY: number

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true
      startX = e.clientX - position.x
      startY = e.clientY - position.y
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const newX = e.clientX - startX
      const newY = e.clientY - startY
      setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      isDragging = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    popover.addEventListener('mousedown', handleMouseDown)

    return () => {
      popover.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [position])

  return (
    <Popover
      open={open}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: position.y, left: position.x }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          ref: popoverRef,
          component: Paper,
          style: {
            zIndex: 1300,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '60px',
            minWidth: '560px',
            padding: '0 10px',
            cursor: 'move',
          },
        },
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
          text={`${selectedRows.length} items selected`}
        />
      </Box>
      {!actionType && actionButtons}
    </Popover>
  )
}

export default ManageRow
