'use client'

import React, { useState } from 'react'
import { VerticalDivider } from '../VerticalDivider'
import ManageColumn from '../ManageColumn'
import { ColumnDef } from '../types'
import CustomButton from '../../Button'
import ShowHideEyeIcon from '../../Icons/ShowHideEye'
import FirstPageIcon from '../../Icons/FirstPage'
import LastPageIcon from '../../Icons/LastPage'
import KeyboardArrowLeftIcon from '../../Icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '../../Icons/KeyboardArrowRight'
import type { DataGridStyles } from '../../../theme'

export interface CustomFooterProps {
  page: number
  pageSize: number
  rowCount: number
  onPageChange: (newPage: number) => void
  onPageSizeChange: (newPageSize: number) => void
  columns: ColumnDef[]
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
}

const TablePagination: React.FC<{
  page: number
  pageSize: number
  rowCount: number
  onPageChange: (newPage: number) => void
  styles?: DataGridStyles
}> = ({ page, pageSize, rowCount, onPageChange, styles }) => {
  const totalPages = Math.ceil(rowCount / pageSize)
  const from = rowCount === 0 ? 0 : page * pageSize + 1
  const to = Math.min(rowCount, (page + 1) * pageSize)
  const isSacredTheme = styles?.theme === 'sacred'

  const handleFirstPage = () => onPageChange(0)
  const handleBackPage = () => onPageChange(page - 1)
  const handleNextPage = () => onPageChange(page + 1)
  const handleLastPage = () => onPageChange(totalPages - 1)

  const paginationContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }

  const paginationButtonStyle = {
    padding: '4px',
    borderRadius: '50%',
    transition: 'colors 0.3s ease',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: isSacredTheme ? 'rgba(255, 215, 0, 1)' : 'rgba(75, 85, 99, 1)',
  }

  const paginationTextStyle = {
    fontSize: '14px',
    color: isSacredTheme ? 'rgba(255, 215, 0, 0.9)' : 'rgba(55, 65, 81, 1)',
    fontFamily: isSacredTheme ? '"Crimson Text", serif' : 'inherit',
  }

  return (
    <div style={paginationContainerStyle}>
      <button
        onClick={handleFirstPage}
        disabled={page === 0}
        style={{
          ...paginationButtonStyle,
          opacity: page === 0 ? 0.5 : 1,
          cursor: page === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        <FirstPageIcon />
      </button>
      <button
        onClick={handleBackPage}
        disabled={page === 0}
        style={{
          ...paginationButtonStyle,
          opacity: page === 0 ? 0.5 : 1,
          cursor: page === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        <KeyboardArrowLeftIcon />
      </button>
      <span style={paginationTextStyle}>
        {from}-{to} of {rowCount}
      </span>
      <button
        onClick={handleNextPage}
        disabled={page >= totalPages - 1}
        style={{
          ...paginationButtonStyle,
          opacity: page >= totalPages - 1 ? 0.5 : 1,
          cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
        }}
      >
        <KeyboardArrowRightIcon />
      </button>
      <button
        onClick={handleLastPage}
        disabled={page >= totalPages - 1}
        style={{
          ...paginationButtonStyle,
          opacity: page >= totalPages - 1 ? 0.5 : 1,
          cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
        }}
      >
        <LastPageIcon />
      </button>
    </div>
  )
}

function CustomFooter({
  page,
  pageSize,
  rowCount,
  onPageChange,
  columns,
  styles,
}: Omit<CustomFooterProps, 'onPageSizeChange'>) {
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isSacredTheme = styles?.theme === 'sacred'

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setAnchorEl(null)
  }

  const containerStyle = {
    width: '100%',
    minWidth: '100%',
    height: '56px',
    position: 'sticky' as const,
    left: 0,
    ...(isSacredTheme && {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderTop: '2px solid rgba(255, 215, 0, 0.3)',
      backdropFilter: 'blur(8px)',
    }),
  }

  const innerContainerStyle = {
    display: 'flex',
    flexWrap: 'nowrap' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '0 8px',
    overflow: 'hidden',
  }

  const leftSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  }

  const dividerContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    marginRight: '4px',
  }

  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    gap: '4px',
    paddingRight: '4px',
    overflow: 'hidden',
  }

  const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    marginLeft: 'auto',
    overflow: 'hidden',
    paddingRight: '16px',
  }

  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        {/* Left Section: Manage Columns Button */}
        <div style={leftSectionStyle}>
          <div style={dividerContainerStyle}>
            <VerticalDivider styles={styles} />
          </div>
          <div style={buttonContainerStyle}>
            <CustomButton
              onClick={handleOpen}
              text={'Columns'}
              icon={
                <ShowHideEyeIcon visible={true} sacredtheme={isSacredTheme} />
              }
              styles={{
                theme: isSacredTheme ? 'sacred' : 'light',
                iconLocation: 'left',
                disabled: false,
                minWidth: 'unset',
                padding: '8px',
              }}
            />
          </div>
          <div style={dividerContainerStyle}>
            <VerticalDivider styles={styles} />
          </div>
        </div>

        {/* Right Section: Pagination */}
        <div style={rightSectionStyle}>
          <TablePagination
            page={page}
            pageSize={pageSize}
            rowCount={rowCount}
            onPageChange={onPageChange}
            styles={styles}
          />
        </div>
      </div>

      <ManageColumn
        open={isOpen}
        handleClose={handleClose}
        columns={columns}
        styles={styles}
        anchorEl={anchorEl}
      />
    </div>
  )
}

export default CustomFooter
