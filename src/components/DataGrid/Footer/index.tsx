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

export interface CustomFooterProps {
  page: number
  pageSize: number
  rowCount: number
  onPageChange: (newPage: number) => void
  onPageSizeChange: (newPageSize: number) => void
  columns: ColumnDef[]
  sacredtheme?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    width: '100%',
    minWidth: '100%',
    height: '56px',
    position: 'sticky',
    left: 0,
  } as React.CSSProperties,

  innerContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '0 8px',
    overflow: 'hidden',
  } as React.CSSProperties,

  leftSection: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  } as React.CSSProperties,

  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    marginRight: '4px',
  } as React.CSSProperties,

  dividerContainerMd: {
    marginRight: '8px',
  } as React.CSSProperties,

  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    gap: '4px',
    paddingRight: '4px',
    overflow: 'hidden',
  } as React.CSSProperties,

  buttonContainerMd: {
    gap: '8px',
    paddingRight: '8px',
  } as React.CSSProperties,

  rightSection: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    marginLeft: 'auto',
    overflow: 'hidden',
    paddingRight: '16px',
  } as React.CSSProperties,

  paginationContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,

  paginationButton: {
    padding: '4px',
    borderRadius: '50%',
    transition: 'colors 0.3s ease',
    color: 'rgba(75, 85, 99, 1)',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(229, 231, 235, 1)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  } as React.CSSProperties,

  paginationText: {
    fontSize: '14px',
    color: 'rgba(55, 65, 81, 1)',
  } as React.CSSProperties,

  buttonStyle: {
    minWidth: 'unset',
    padding: '8px',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    width: '100%',
    minWidth: '100%',
    height: '56px',
    position: 'sticky',
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderTop: '2px solid rgba(255, 215, 0, 0.3)',
    backdropFilter: 'blur(8px)',
  } as React.CSSProperties,

  innerContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '0 8px',
    overflow: 'hidden',
  } as React.CSSProperties,

  leftSection: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  } as React.CSSProperties,

  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    marginRight: '4px',
  } as React.CSSProperties,

  dividerContainerMd: {
    marginRight: '8px',
  } as React.CSSProperties,

  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    gap: '4px',
    paddingRight: '4px',
    overflow: 'hidden',
  } as React.CSSProperties,

  buttonContainerMd: {
    gap: '8px',
    paddingRight: '8px',
  } as React.CSSProperties,

  rightSection: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    marginLeft: 'auto',
    overflow: 'hidden',
    paddingRight: '16px',
  } as React.CSSProperties,

  paginationContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,

  paginationButton: {
    padding: '4px',
    borderRadius: '50%',
    transition: 'colors 0.3s ease',
    color: 'rgba(255, 215, 0, 1)',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    '&:disabled': {
      opacity: 0.5,
      color: 'rgba(255, 215, 0, 0.3)',
      cursor: 'not-allowed',
    },
  } as React.CSSProperties,

  paginationText: {
    fontSize: '14px',
    color: 'rgba(255, 215, 0, 0.9)',
    fontFamily: '"Crimson Text", serif',
  } as React.CSSProperties,

  buttonStyle: {
    minWidth: 'unset',
    padding: '8px',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    '&:hover': {
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      borderColor: 'rgba(255, 215, 0, 1)',
    },
  } as React.CSSProperties,
}

const TablePagination: React.FC<{
  page: number
  pageSize: number
  rowCount: number
  onPageChange: (newPage: number) => void
  sacredtheme?: boolean
}> = ({ page, pageSize, rowCount, onPageChange, sacredtheme }) => {
  const totalPages = Math.ceil(rowCount / pageSize)
  const from = rowCount === 0 ? 0 : page * pageSize + 1
  const to = Math.min(rowCount, (page + 1) * pageSize)

  const handleFirstPage = () => onPageChange(0)
  const handleBackPage = () => onPageChange(page - 1)
  const handleNextPage = () => onPageChange(page + 1)
  const handleLastPage = () => onPageChange(totalPages - 1)

  const styles = sacredtheme ? sacredStyles : premiumStyles

  return (
    <div style={styles.paginationContainer}>
      <button
        onClick={handleFirstPage}
        disabled={page === 0}
        style={styles.paginationButton}
      >
        <FirstPageIcon />
      </button>
      <button
        onClick={handleBackPage}
        disabled={page === 0}
        style={styles.paginationButton}
      >
        <KeyboardArrowLeftIcon />
      </button>
      <span style={styles.paginationText}>
        {from}-{to} of {rowCount}
      </span>
      <button
        onClick={handleNextPage}
        disabled={page >= totalPages - 1}
        style={styles.paginationButton}
      >
        <KeyboardArrowRightIcon />
      </button>
      <button
        onClick={handleLastPage}
        disabled={page >= totalPages - 1}
        style={styles.paginationButton}
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
  sacredtheme = false,
}: Omit<CustomFooterProps, 'onPageSizeChange'>) {
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setAnchorEl(null)
  }

  const styles = sacredtheme ? sacredStyles : premiumStyles

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        {/* Left Section: Manage Columns Button */}
        <div style={styles.leftSection}>
          <div style={styles.dividerContainer}>
            <VerticalDivider sacredtheme={sacredtheme} />
          </div>
          <div style={styles.buttonContainer}>
            <CustomButton
              onClick={handleOpen}
              text={'Columns'}
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              backgroundcolor="none"
              icon={
                <ShowHideEyeIcon visible={true} sacredtheme={sacredtheme} />
              }
              iconcolor={sacredtheme ? '#FFD700' : 'black'}
              iconlocation="left"
              disableButton="false"
              sacredtheme={sacredtheme}
              style={styles.buttonStyle}
            />
          </div>
          <div style={styles.dividerContainer}>
            <VerticalDivider sacredtheme={sacredtheme} />
          </div>
        </div>

        {/* Right Section: Pagination */}
        <div style={styles.rightSection}>
          <TablePagination
            page={page}
            pageSize={pageSize}
            rowCount={rowCount}
            onPageChange={onPageChange}
            sacredtheme={sacredtheme}
          />
        </div>
      </div>

      <ManageColumn
        open={isOpen}
        handleClose={handleClose}
        columns={columns}
        sacredtheme={sacredtheme}
        anchorEl={anchorEl}
      />
    </div>
  )
}

export default CustomFooter
