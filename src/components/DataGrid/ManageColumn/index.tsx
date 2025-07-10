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

const SACRED_GLYPHS = ['𓏭', '𓊵', '𓂋', '𓊹']

interface ManageColumnProps {
  open?: boolean
  handleClose?: () => void
  columns: ColumnDef[]
  sacredtheme?: boolean
  anchorEl?: HTMLElement | null
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  popover: {
    border: '1px solid rgba(0, 0, 0, 1)',
    borderRadius: '8px',
    minWidth: '250px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  } as React.CSSProperties,

  container: {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  } as React.CSSProperties,

  decorativeGlyph: {
    display: 'none', // Hidden for premium theme
  } as React.CSSProperties,

  topLeftGlyph: {
    display: 'none', // Hidden for premium theme
  } as React.CSSProperties,

  topRightGlyph: {
    display: 'none', // Hidden for premium theme
  } as React.CSSProperties,

  title: {
    marginBottom: 0,
  } as React.CSSProperties,

  searchContainer: {
    marginTop: '4px',
    marginBottom: 0,
  } as React.CSSProperties,

  allColumnsHeader: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    justifyContent: 'space-between',
  } as React.CSSProperties,

  allColumnsText: {
    fontWeight: 'bold',
  } as React.CSSProperties,

  checkboxContainer: {
    marginRight: '-4px',
  } as React.CSSProperties,

  scrollArea: {
    maxHeight: '160px',
    overflowY: 'auto',
    marginBottom: '10px',
  } as React.CSSProperties,

  columnRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '4px',
  } as React.CSSProperties,

  columnRowHover: {
    borderRadius: '6px',
    padding: '0 4px',
    margin: '0 -4px',
  } as React.CSSProperties,

  columnText: {
    flexGrow: 1,
    marginRight: '4px',
  } as React.CSSProperties,

  eyeButton: {
    padding: '4px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  } as React.CSSProperties,

  saveButton: {
    marginTop: 0,
    width: '100%',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  popover: {
    border: '1px solid rgba(255, 215, 0, 0.5)',
    borderRadius: '8px',
    minWidth: '250px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    animation: 'glowPulse 3s ease-in-out infinite',
    backdropFilter: 'blur(8px)',
  } as React.CSSProperties,

  container: {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backdropFilter: 'blur(20px)',
  } as React.CSSProperties,

  decorativeGlyph: {
    position: 'absolute',
    fontSize: '14px',
    color: 'rgba(255, 215, 0, 0.3)',
    animation: 'floatGlyphPopover 3s ease-in-out infinite',
  } as React.CSSProperties,

  topLeftGlyph: {
    top: '8px',
    left: '8px',
  } as React.CSSProperties,

  topRightGlyph: {
    top: '8px',
    right: '8px',
    animationDirection: 'reverse',
  } as React.CSSProperties,

  title: {
    marginBottom: 0,
    fontFamily: '"Cinzel", serif',
    fontWeight: 600,
    letterSpacing: '0.025em',
    textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,

  searchContainer: {
    marginTop: '4px',
    marginBottom: 0,
  } as React.CSSProperties,

  allColumnsHeader: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    justifyContent: 'space-between',
  } as React.CSSProperties,

  allColumnsText: {
    fontWeight: 'bold',
    fontFamily: '"Crimson Text", serif',
  } as React.CSSProperties,

  checkboxContainer: {
    marginRight: '-4px',
  } as React.CSSProperties,

  scrollArea: {
    maxHeight: '160px',
    overflowY: 'auto',
    marginBottom: '10px',
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
  } as React.CSSProperties,

  columnRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '4px',
  } as React.CSSProperties,

  columnRowHover: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: '6px',
    padding: '0 4px',
    margin: '0 -4px',
  } as React.CSSProperties,

  columnText: {
    flexGrow: 1,
    marginRight: '4px',
    fontFamily: '"Crimson Text", serif',
  } as React.CSSProperties,

  eyeButton: {
    padding: '4px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: 'rgba(255, 215, 0, 1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
  } as React.CSSProperties,

  saveButton: {
    marginTop: 0,
    width: '100%',
  } as React.CSSProperties,
}

function ManageColumns({
  open = false,
  handleClose = () => {},
  columns,
  sacredtheme = false,
  anchorEl = null,
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

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
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
  }, [sacredtheme])

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

  const styles = sacredtheme ? sacredStyles : premiumStyles

  return (
    <Popover
      open={Boolean(open)}
      onClose={handleCloseAndUpdate}
      anchorEl={anchorEl}
      sacredtheme={sacredtheme}
    >
      <div
        style={{
          ...styles.container,
          ...(sacredtheme ? styles.popover : premiumStyles.popover),
        }}
      >
        {sacredtheme && (
          <>
            <div
              style={{
                ...styles.decorativeGlyph,
                ...styles.topLeftGlyph,
              }}
            >
              {SACRED_GLYPHS[0]}
            </div>
            <div
              style={{
                ...styles.decorativeGlyph,
                ...styles.topRightGlyph,
              }}
            >
              {SACRED_GLYPHS[1]}
            </div>
          </>
        )}

        <Typography
          text={sacredtheme ? 'Sacred Columns' : 'Manage Columns'}
          fontvariant="merriparagraph"
          fontcolor={sacredtheme ? 'gold' : 'black'}
          align="center"
          style={{
            ...styles.title,
            ...(sacredtheme ? styles.title : {}),
          }}
        />
        <div style={styles.searchContainer}>
          <Searchbar
            value={searchInput}
            onChange={handleSearchChange}
            placeholder={sacredtheme ? 'Seek columns...' : 'Search Columns'}
            sacredtheme={sacredtheme}
          />
        </div>
        <div style={styles.allColumnsHeader}>
          <Typography
            text="All Columns"
            fontvariant="merriparagraph"
            fontcolor={sacredtheme ? 'gold' : 'black'}
            style={{
              fontWeight: 'bold',
              ...(sacredtheme ? styles.allColumnsText : {}),
            }}
          />
          <div style={styles.checkboxContainer}>
            <Checkbox
              checked={isAllChecked}
              indeterminate={someColumnsVisible && !isAllChecked}
              onChange={handleCheckboxChange}
              sacredtheme={sacredtheme}
            />
          </div>
        </div>
        <div style={styles.scrollArea}>
          {filteredColumns.map((column, index) => {
            const isVisible = visibleColumns[column.field] === true
            return (
              <div
                key={index}
                style={{
                  ...styles.columnRow,
                  ...(sacredtheme ? styles.columnRowHover : {}),
                }}
              >
                <Typography
                  text={formatColumnName(column.field)}
                  fontvariant="merriparagraph"
                  fontcolor={sacredtheme ? 'white' : 'black'}
                  style={{
                    ...styles.columnText,
                    ...(sacredtheme ? styles.columnText : {}),
                  }}
                />
                <button
                  onClick={() => handleEyeClick(column.field)}
                  style={styles.eyeButton}
                >
                  <ShowHideEyeIcon
                    visible={isVisible}
                    sacredtheme={sacredtheme}
                  />
                </button>
              </div>
            )
          })}
        </div>
        <CustomButton
          text="Save"
          backgroundcolor={sacredtheme ? 'gold' : 'black'}
          fontcolor={sacredtheme ? 'black' : 'white'}
          style={styles.saveButton}
          onClick={onSaveColumnView}
          sacredtheme={sacredtheme}
        />
      </div>
    </Popover>
  )
}

export default ManageColumns
