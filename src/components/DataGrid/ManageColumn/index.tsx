'use client'

import React, { useEffect } from 'react'
import { useManageColumn } from '../utils/useManageColumn'
import CustomButton from '../../Button'
import Searchbar from '../../Field/Search'
import Checkbox from '../../Checkbox'
import ShowHideEyeIcon from '../../Icons/ShowHideEye'
import { ColumnDef } from '../types'
import Typography from '../../Typography'
import Popover from '../../Popover'
import type { DataGridStyles } from '../../../theme'
import { SACRED_GLYPHS } from '../../../theme'

interface ManageColumnProps {
  open?: boolean
  handleClose?: () => void
  columns: ColumnDef[]
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
  anchorEl?: HTMLElement | null
}

function ManageColumns({
  open = false,
  handleClose = () => {},
  columns,
  styles,
  anchorEl = null,
}: ManageColumnProps) {
  const isSacredTheme = styles?.theme === 'sacred'

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

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (isSacredTheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes glowPulse {
          0%, 100% { 
            border-color: rgba(255, 215, 0, 0.5);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          }
          50% { 
            border-color: rgba(255, 215, 0, 0.8);
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
          }
        }
        @keyframes floatGlyphPopover {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-3px) rotate(180deg); opacity: 0.5; }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [isSacredTheme])

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

  const handleCheckboxChange = (checked: boolean) => {
    handleAllCols(checked)
  }

  const containerStyle = {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
    ...(isSacredTheme && {
      backdropFilter: 'blur(20px)',
    }),
  }

  const searchContainerStyle = {
    marginTop: '4px',
    marginBottom: 0,
  }

  const allColumnsHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    justifyContent: 'space-between',
  }

  const checkboxContainerStyle = {
    marginRight: '-4px',
  }

  const scrollAreaStyle = {
    maxHeight: '160px',
    overflowY: 'auto' as const,
    marginBottom: '10px',
    ...(isSacredTheme && {
      '&::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(255, 215, 0, 0.5)',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'rgba(255, 215, 0, 0.7)',
      },
    }),
  }

  const columnRowStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '4px',
  }

  const columnRowHoverStyle = {
    borderRadius: '6px',
    padding: '0 4px',
    margin: '0 -4px',
    ...(isSacredTheme && {
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
    }),
  }

  const eyeButtonStyle = {
    padding: '4px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    ...(isSacredTheme && {
      color: 'rgba(255, 215, 0, 1)',
      '&:hover': {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
      },
    }),
  }

  return (
    <Popover
      open={Boolean(open)}
      onClose={handleCloseAndUpdate}
      anchorEl={anchorEl}
      styles={{
        theme: isSacredTheme ? 'sacred' : 'light',
      }}
    >
      <div style={containerStyle}>
        {isSacredTheme && (
          <>
            <div
              style={{
                position: 'absolute',
                fontSize: '14px',
                color: 'rgba(255, 215, 0, 0.3)',
                animation: 'floatGlyphPopover 3s ease-in-out infinite',
                top: '8px',
                left: '8px',
              }}
            >
              {SACRED_GLYPHS[22]}
            </div>
            <div
              style={{
                position: 'absolute',
                fontSize: '14px',
                color: 'rgba(255, 215, 0, 0.3)',
                animation: 'floatGlyphPopover 3s ease-in-out infinite',
                top: '8px',
                right: '8px',
                animationDirection: 'reverse',
              }}
            >
              {SACRED_GLYPHS[23]}
            </div>
          </>
        )}

        <Typography
          text={isSacredTheme ? 'Sacred Columns' : 'Manage Columns'}
          variant="merriparagraph"
          styles={{
            color: isSacredTheme ? 'gold' : 'black',
          }}
        />
        <div style={searchContainerStyle}>
          <Searchbar
            value={searchInput}
            onChange={handleSearchChange}
            placeholder={isSacredTheme ? 'Seek columns...' : 'Search Columns'}
            styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
          />
        </div>
        <div style={allColumnsHeaderStyle}>
          <Typography
            text="All Columns"
            variant="merriparagraph"
            styles={{
              color: isSacredTheme ? 'gold' : 'black',
            }}
          />
          <div style={checkboxContainerStyle}>
            <Checkbox
              checked={isAllChecked}
              indeterminate={someColumnsVisible && !isAllChecked}
              onChange={handleCheckboxChange}
              styles={{
                theme: isSacredTheme ? 'sacred' : 'light',
              }}
            />
          </div>
        </div>
        <div style={scrollAreaStyle}>
          {filteredColumns.map((column, index) => {
            const isVisible = visibleColumns[column.field] === true
            return (
              <div
                key={index}
                style={{
                  ...columnRowStyle,
                  ...(isSacredTheme ? columnRowHoverStyle : {}),
                }}
              >
                <Typography
                  text={formatColumnName(column.field)}
                  variant="merriparagraph"
                  styles={{
                    color: isSacredTheme ? 'white' : 'black',
                  }}
                />
                <button
                  onClick={() => handleEyeClick(column.field)}
                  style={eyeButtonStyle}
                >
                  <ShowHideEyeIcon
                    visible={isVisible}
                    sacredtheme={isSacredTheme}
                  />
                </button>
              </div>
            )
          })}
        </div>
        <CustomButton
          text="Save"
          styles={{
            theme: isSacredTheme ? 'sacred' : 'light',
          }}
          onClick={onSaveColumnView}
        />
      </div>
    </Popover>
  )
}

export default ManageColumns
