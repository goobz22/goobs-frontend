'use client'

import React from 'react'
import { Box, Popover, IconButton } from '@mui/material'
import { useManageColumn } from '../utils/useManageColumn'
import CustomButton from '../../Button'
import Searchbar from '../../Field/Search'
import Checkbox from '../../Checkbox'
import ShowHideEyeIcon from '../../Icons/ShowHideEye'
import { ColumnDef } from '../types'
import Typography from '../../Typography'
import * as palette from '../../../styles/palette'

interface ManageColumnProps {
  open?: boolean
  handleClose?: () => void
  columns: ColumnDef[]
}

function ManageColumns({
  open = false,
  handleClose = () => {},
  columns,
}: ManageColumnProps) {
  const {
    handleAllCols,
    toggleColumnState,
    visibleColumns,
    onSaveColumnView,
    formatColumnName,
    searchInput,
    setSearchInput,
    isAllChecked,
  } = useManageColumn({
    columns,
    handleClose,
    isPopupOpen: open,
  })

  const someColumnsVisible = React.useMemo(() => {
    return (
      columns.some(column => visibleColumns[column.field] === true) &&
      !columns.every(column => visibleColumns[column.field] === true)
    )
  }, [columns, visibleColumns])

  const handleEyeClick = (columnField: string) => {
    toggleColumnState(columnField)
  }

  const handleCloseAndUpdate = () => {
    handleClose?.()
    setSearchInput('')
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const filteredColumns = columns.filter(column => {
    return formatColumnName(column.field)
      .toLowerCase()
      .includes(searchInput.toLowerCase())
  })

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    handleAllCols(event.target.checked)
  }

  return (
    <Popover
      id="manage-columns-popover"
      open={Boolean(open)}
      onClose={handleCloseAndUpdate}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      sx={{
        '& .MuiPaper-root': {
          border: `1px solid ${palette.black.main}`,
          borderRadius: 2,
          minWidth: '250px',
          boxShadow: 24,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: palette.white.main,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          text="Manage Columns"
          fontvariant="merriparagraph"
          fontcolor={palette.black.main}
          align="center"
          sx={{ mb: 0 }}
        />
        <Box sx={{ mt: 1, mb: 0 }}>
          <Searchbar
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search Columns"
            iconcolor={palette.black.main}
            outlinecolor={palette.black.main}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 0,
            mb: 0,
            justifyContent: 'space-between',
          }}
        >
          <Typography
            text="All Columns"
            fontvariant="merriparagraph"
            fontcolor={palette.black.main}
            sx={{ fontWeight: 'bold' }}
          />
          <Box sx={{ marginRight: '-4px' }}>
            <Checkbox
              checked={isAllChecked}
              indeterminate={someColumnsVisible && !isAllChecked}
              onChange={handleCheckboxChange}
            />
          </Box>
        </Box>
        <Box
          sx={{ maxHeight: '160px', overflowY: 'auto', marginBottom: '10px' }}
        >
          {filteredColumns.map((column, index) => {
            const isVisible = visibleColumns[column.field] === true
            return (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <Typography
                  text={formatColumnName(column.field)}
                  fontvariant="merriparagraph"
                  fontcolor={palette.black.main}
                  sx={{ flexGrow: 1, mr: 1 }}
                />
                <IconButton
                  onClick={() => handleEyeClick(column.field)}
                  size="small"
                >
                  <ShowHideEyeIcon visible={isVisible} />
                </IconButton>
              </Box>
            )
          })}
        </Box>
        <CustomButton
          text="Save"
          backgroundcolor={palette.black.main}
          variant="contained"
          fontcolor={palette.white.main}
          fontvariant="merriparagraph"
          sx={{ mt: 0 }}
          fullWidth
          onClick={onSaveColumnView}
        />
      </Box>
    </Popover>
  )
}

export default ManageColumns
