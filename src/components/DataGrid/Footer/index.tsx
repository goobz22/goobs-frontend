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
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const totalPages = Math.ceil(rowCount / pageSize)

  return (
    <Box
      className="custom-footer-container"
      sx={{
        width: '100%',
        minWidth: '100%',
        // Fixed height on all devices
        height: '56px',
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
          flexDirection: isTabletOrBelow ? 'row' : 'row',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          px: 2,
          overflow: 'hidden',
        }}
      >
        {/* Left Section: Manage Columns Button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            // For smaller screens, reduce bottom margin
            mb: 0,
          }}
          className="left-box"
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
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
              height: '100%',
              // On mobile, smaller gap/padding
              gap: isTabletOrBelow ? '5px' : '8px',
              pr: isTabletOrBelow ? '5px' : '8px',
              overflow: 'hidden',
            }}
          >
            <CustomButton
              onClick={handleOpen}
              text={isTabletOrBelow ? 'Columns' : 'Manage Columns'}
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
              height: '100%',
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
            height: '100%',
            // On smaller screens, minimal top margin so it sits closer
            mt: 0,
            // Center on mobile, right-align on desktop
            justifyContent: isTabletOrBelow ? 'flex-end' : 'flex-end',
            // Eliminate the margin-left on mobile
            ml: 'auto',
            overflow: 'hidden',
            paddingRight: '15px',
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
            // Remove rows per page options to hide the selector
            rowsPerPageOptions={[]}
            // Hide the rows per page label
            labelRowsPerPage=""
            slotProps={{
              actions: {
                previousButton: {
                  disabled: page === 0,
                },
                nextButton: {
                  disabled: page >= totalPages - 1,
                },
              },
              select: {
                sx: { display: 'none' },
              },
            }}
            showFirstButton
            showLastButton
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
            }
            sx={{
              '.MuiTablePagination-toolbar': {
                minHeight: '56px',
                height: '56px',
                padding: isTabletOrBelow ? '0 8px' : '0 16px',
              },
              '.MuiTablePagination-displayedRows': {
                margin: 0,
              },
            }}
          />
        </Box>
      </Box>

      {/* ManageColumn modal */}
      <ManageColumn open={isOpen} handleClose={handleClose} columns={columns} />
    </Box>
  )
}

export default CustomFooter
