'use client'

import React, { useState } from 'react'
import { Box, useMediaQuery } from '@mui/material'
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

  // Use a media query for "tablet or below" (900px as an example).
  const isTabletOrBelow = useMediaQuery('(max-width:900px)')

  const handleOpen = () => {
    console.log('Footer handleOpen')
    setIsOpen(true)
  }

  const handleClose = () => {
    console.log('Footer handleClose')
    setIsOpen(false)
  }

  const totalPages = Math.ceil(rowCount / pageSize)

  return (
    <Box
      className="custom-footer-container"
      sx={{
        width: '100%',
        minWidth: '100%',
        // On tablet/phone, let height auto-expand;
        // on larger screens, keep a fixed 56px
        height: isTabletOrBelow ? 'auto' : '56px',
        position: 'sticky',
        left: 0,
        // Only add checkbox offset margin on larger screens
        marginLeft: isTabletOrBelow ? 0 : `${checkboxWidth}px`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          // On tablet/phone, stack them vertically;
          // on desktop, lay them out in a row
          flexDirection: isTabletOrBelow ? 'column' : 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          px: 2,
        }}
      >
        {/* Left Section: Manage Columns Button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            // For smaller screens, reduce bottom margin
            mb: isTabletOrBelow ? '4px' : 0,
          }}
          className="left-box"
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              // Less margin on mobile
              mr: isTabletOrBelow ? '5px' : '10px',
            }}
          >
            <VerticalDivider />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              // On mobile, smaller gap/padding
              gap: isTabletOrBelow ? '5px' : '8px',
              pr: isTabletOrBelow ? '5px' : '8px',
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
              ml: isTabletOrBelow ? '5px' : '10px',
              mr: isTabletOrBelow ? '5px' : '10px',
            }}
          >
            <VerticalDivider />
          </Box>
        </Box>

        {/* Right Section: Pagination */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            // On smaller screens, minimal top margin so it sits closer
            mt: isTabletOrBelow ? '4px' : 0,
            // Center on mobile, right-align on desktop
            justifyContent: isTabletOrBelow ? 'center' : 'flex-end',
            // Eliminate the margin-left on mobile
            ml: isTabletOrBelow ? 0 : 'auto',
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
