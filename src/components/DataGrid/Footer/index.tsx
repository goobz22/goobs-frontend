'use client'

import React, { useState } from 'react'
import { Box } from '@mui/material'
import { VerticalDivider } from '../VerticalDivider'
import TablePagination from '@mui/material/TablePagination'
import ManageColumn from '../ManageColumn'
import { ColumnDef } from '../types'
import CustomButton from '../../Button'
import ShowHideEyeIcon from '../../Icons/ShowHideEye'

export interface CustomFooterProps {
  page: number
  pageSize: number
  rowCount: number
  onPageChange: (newPage: number) => void
  onPageSizeChange: (newPageSize: number) => void
  columns: ColumnDef[]
}

function CustomFooter({
  page,
  pageSize,
  rowCount,
  onPageChange,
  onPageSizeChange,
  columns,
}: CustomFooterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [checkboxWidth] = useState(45)

  const handleOpen = () => {
    console.log('Footer handleOpen')
    setIsOpen(true)
  }

  const handleClose = () => {
    console.log('Footer handleClose')
    setIsOpen(false)
  }

  // We no longer compute or apply a totalWidth based on columns.
  // The footer simply fills the view (100%).

  const totalPages = Math.ceil(rowCount / pageSize)

  return (
    <Box
      className="custom-footer-container"
      sx={{
        // Fill the view, ignoring any column widths
        width: '100%',
        minWidth: '100%',
        height: '56px',
        position: 'sticky',
        left: 0,
        // The margin-left offset can match your table's design (often equal to checkbox width)
        marginLeft: `${checkboxWidth}px`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          width: '100%',
          height: '100%',
          px: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          className="left-box"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mr: '10px' }}>
            <VerticalDivider />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              pr: '8px',
            }}
          >
            <CustomButton
              onClick={handleOpen}
              text="Manage Columns"
              fontvariant="merriparagraph"
              fontcolor="black"
              backgroundcolor="none"
              icon={<ShowHideEyeIcon visible={true} />}
              iconcolor="black"
              iconlocation="left"
              disableButton="false"
              sx={{
                minWidth: 'unset',
                padding: '8px',
                '& .MuiTypography-root': {
                  marginLeft: '16px',
                },
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: '10px',
              mr: '10px',
            }}
          >
            <VerticalDivider />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: 'auto',
          }}
          className="right-box"
        >
          <TablePagination
            component="div"
            count={rowCount}
            page={page}
            onPageChange={(_, newPage) => {
              onPageChange(newPage)
            }}
            rowsPerPage={pageSize}
            onRowsPerPageChange={event => {
              const newPageSize = parseInt(event.target.value, 10)
              onPageSizeChange(newPageSize)
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
            slotProps={{
              actions: {
                previousButton: {
                  disabled: page === 0,
                },
                nextButton: {
                  disabled: page >= totalPages - 1,
                },
              },
            }}
            showFirstButton
            showLastButton
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
            }
          />
        </Box>
      </Box>

      {/* ManageColumn modal */}
      <ManageColumn open={isOpen} handleClose={handleClose} columns={columns} />
    </Box>
  )
}

export default CustomFooter
