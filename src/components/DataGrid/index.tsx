'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  Box,
  Alert,
  useMediaQuery,
  alpha,
  keyframes,
  Typography,
} from '@mui/material'
import CustomToolbar from '../Toolbar'
import Table from './Table'
import CustomFooter from './Footer'
import { woad } from '../../styles/palette'
import { useSearchbar } from './utils/useToolbarSearchbar'
import { useManageRow } from './utils/useManageRow'
import { useInitializeGrid } from './utils/useInitializeGrid'
import { selectAllRows, selectRow } from './utils/useSelectRows'
import { useAutoRowHeight } from './utils/useAutoRowHeight'
import { DatagridProps, RowData } from './types'

// Sacred geometry animations
const glowPulse = keyframes`
  0% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
    border-color: ${alpha('#FFD700', 0.5)};
  }
  50% { 
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
    border-color: ${alpha('#FFD700', 0.8)};
  }
  100% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
    border-color: ${alpha('#FFD700', 0.5)};
  }
`

const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
  33% { transform: translateY(-5px) rotate(120deg); opacity: 0.5; }
  66% { transform: translateY(2px) rotate(240deg); opacity: 0.4; }
  100% { transform: translateY(0px) rotate(360deg); opacity: 0.3; }
`

const sacredShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const dataStreamAnimation = keyframes`
  0% { 
    transform: translateY(-100%);
    opacity: 0;
  }
  50% { 
    opacity: 0.3;
  }
  100% { 
    transform: translateY(100%);
    opacity: 0;
  }
`

// Egyptian styling constants
const egyptianStyles = {
  goldColor: '#FFD700',
  goldGradient:
    'linear-gradient(135deg, #FFD700 0%, #F4A460 50%, #DAA520 100%)',
  darkGold: '#B8860B',
  textShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
  cardBackground: alpha('#000000', 0.85),
  glowEffect: `0 0 30px ${alpha('#FFD700', 0.3)}, 0 0 60px ${alpha('#FFD700', 0.1)}`,
}

// Sacred hieroglyphs for decoration
const SACRED_GLYPHS = [
  '𓁟', // Eye of Horus
  '𓂀', // Eye
  '𓃀', // Foot
  '𓄿', // Vulture
  '𓊖', // House
  '𓊗', // Road
  '𓋴', // Life/Ankh symbol
  '𓏏', // Bread
  '𓊨', // Gate
  '𓁦', // Face
  '𓅓', // Owl
  '𓆄', // Bee
  '𓇳', // Sun
  '𓈖', // Water
  '𓊹', // Shrine
  '𓊺', // Support
  '𓊻', // Shrine with serpent
  '𓋹', // Protection
  '𓌻', // Arm
  '𓍿', // Leg
  '𓅨', // Goose
  '𓂋', // Mouth
  '𓏭', // Scribe's kit
  '𓊵', // Cartouche
]

function DataGrid({
  columns,
  rows: providedRows,
  buttons,
  dropdowns,
  searchbarProps,
  error = null,
  onDuplicate,
  onDelete,
  onManage,
  onShow,
  onSelectionChange,
  showIdColumns = false,
  sacredTheme = false,
}: DatagridProps) {
  // Detect mobile devices for responsive behavior
  const isMobile = !useMediaQuery('(min-width:500px)')

  // Create ref for the container to measure available height
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter columns to hide ID columns based on showIdColumns prop
  const filteredColumns = useMemo(() => {
    if (showIdColumns) {
      return columns
    }
    return columns.filter(col => col.field !== 'id' && col.field !== '_id')
  }, [columns, showIdColumns])

  // Local state
  const [rows, setRows] = useState<RowData[]>(providedRows || [])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [page, setPage] = useState(0)

  // Automatically calculate the number of rows that can fit in the container
  const autoPageSize = useAutoRowHeight(containerRef, {
    // Adjust these values based on your actual layout measurements
    headerHeight: 150, // Toolbar + table header
    footerHeight: 56, // Footer height
    rowHeight: 53, // Average row height
    minRows: 5, // Minimum number of rows to show
  })

  // Use calculated pageSize instead of fixed value
  const [pageSize, setPageSize] = useState<number>(10) // Initial default value

  // Update pageSize when autoPageSize changes
  useEffect(() => {
    if (autoPageSize > 0) {
      setPageSize(autoPageSize)
    }
  }, [autoPageSize])

  // Initialize columns/rows if needed
  useInitializeGrid({ columns: filteredColumns, providedRows, setRows })

  // 1) When row selection changes
  const handleSelectionChange = (newSelectedIds: string[]) => {
    setSelectedRows(newSelectedIds)
    onSelectionChange?.(newSelectedIds)
  }

  const handleRowClick = (row: RowData) => {
    selectRow(row, selectedRows, handleSelectionChange)
  }

  const handleRowCheckboxChange = (rowId: string) => {
    if (selectedRows.includes(rowId)) {
      handleSelectionChange(selectedRows.filter(id => id !== rowId))
    } else {
      handleSelectionChange([...selectedRows, rowId])
    }
  }

  const handleHeaderCheckboxChange: React.ChangeEventHandler<
    HTMLInputElement
  > = () => {
    selectAllRows(rows, selectedRows, handleSelectionChange)
  }

  // 2) Search logic
  const { filteredRows, updatedSearchbarProps } = useSearchbar({
    columns: filteredColumns,
    rows,
    searchbarProps,
  })

  // 3) Manage row logic
  const { handleManageRowClose, handleManage } = useManageRow({
    onManage,
    selectedRows,
    handleSelectionChange,
  })

  // 4) Pagination
  const startIndex = page * pageSize
  const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize)

  // Reset page when rowCount or pageSize changes to prevent empty pages
  useEffect(() => {
    const totalPages = Math.ceil(filteredRows.length / pageSize)
    if (page >= totalPages && totalPages > 0) {
      setPage(totalPages - 1)
    }
  }, [filteredRows.length, pageSize, page])

  // Determine if "all rows" are currently selected
  const allRowsSelected =
    rows.length > 0 &&
    rows.every(r => selectedRows.includes(String(r._id ?? r.id)))
  const someRowsSelected =
    rows.length > 0 &&
    selectedRows.length > 0 &&
    selectedRows.length < rows.length

  const containerStyles = useMemo(() => {
    const baseStyles = {
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      height: 'calc(100vh - 60px)',
      overflow: isMobile ? 'auto' : 'hidden',
      backgroundColor: woad.main,
    }

    if (!sacredTheme) return baseStyles

    return {
      ...baseStyles,
      backgroundColor: egyptianStyles.cardBackground,
      backdropFilter: 'blur(20px)',
      border: `2px solid ${alpha(egyptianStyles.goldColor, 0.5)}`,
      borderRadius: '12px',
      animation: `${glowPulse} 4s ease-in-out infinite`,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${egyptianStyles.goldColor}, transparent)`,
        backgroundSize: '200% 100%',
        animation: `${sacredShimmer} 3s linear infinite`,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${egyptianStyles.goldColor}, transparent)`,
        backgroundSize: '200% 100%',
        animation: `${sacredShimmer} 3s linear infinite`,
        animationDelay: '1.5s',
      },
    }
  }, [sacredTheme, isMobile])

  return (
    <Box ref={containerRef} sx={containerStyles}>
      {/* Top corner decorations */}
      {sacredTheme && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              color: alpha(egyptianStyles.goldColor, 0.3),
              fontSize: '18px',
              animation: `${floatAnimation} 5s ease-in-out infinite`,
              zIndex: 1,
            }}
          >
            {SACRED_GLYPHS[23]} {/* Cartouche - for data organization */}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: alpha(egyptianStyles.goldColor, 0.3),
              fontSize: '18px',
              animation: `${floatAnimation} 5s ease-in-out infinite reverse`,
              zIndex: 1,
            }}
          >
            {SACRED_GLYPHS[22]} {/* Scribe's kit - for data recording */}
          </Box>
        </>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            ...(sacredTheme && {
              backgroundColor: alpha('#DC2626', 0.1),
              color: '#DC2626',
              border: `1px solid ${alpha('#DC2626', 0.3)}`,
              '& .MuiAlert-icon': {
                color: '#DC2626',
              },
            }),
          }}
        >
          {error.message}
        </Alert>
      )}

      <CustomToolbar
        buttons={buttons}
        dropdowns={dropdowns?.[0] ? [dropdowns[0]] : undefined}
        searchbarProps={updatedSearchbarProps}
        rightCenterProps={
          selectedRows.length > 0
            ? {
                selectedRows,
                rows,
                onDuplicate: onDuplicate
                  ? () => onDuplicate(selectedRows)
                  : undefined,
                onDelete: onDelete
                  ? () => {
                      // Call the onDelete handler and clear selection after it completes
                      onDelete(selectedRows)
                      // Clear the selection after delete operation
                      handleSelectionChange([])
                    }
                  : undefined,
                onManage: handleManage,
                onShow: onShow,
                handleClose: handleManageRowClose,
              }
            : undefined
        }
        sacredTheme={sacredTheme}
      />

      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          overflow: isMobile ? 'visible' : 'hidden',
          position: 'relative',
          ...(sacredTheme && {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '2px',
              height: '100%',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(180deg, transparent, ${egyptianStyles.goldColor}, transparent)`,
                animation: `${dataStreamAnimation} 6s linear infinite`,
              },
            },
          }),
        }}
      >
        {/* Sacred header glyphs */}
        {sacredTheme && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1.5,
              mb: 1,
              width: '100%',
            }}
          >
            {[
              SACRED_GLYPHS[13],
              SACRED_GLYPHS[3],
              SACRED_GLYPHS[6],
              SACRED_GLYPHS[3],
              SACRED_GLYPHS[13],
            ].map((glyph, index) => (
              <Typography
                key={index}
                sx={{
                  color: alpha(egyptianStyles.goldColor, 0.6),
                  fontSize: '1rem',
                  animation: `${floatAnimation} ${3 + index * 0.5}s ease-in-out infinite`,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {glyph}
              </Typography>
            ))}
          </Box>
        )}

        {/* Table component */}
        <Table
          columns={filteredColumns}
          rows={visibleRows}
          selectedRowIds={selectedRows}
          onRowClick={handleRowClick}
          allRowsSelected={allRowsSelected}
          someRowsSelected={someRowsSelected}
          onHeaderCheckboxChange={handleHeaderCheckboxChange}
          onRowCheckboxChange={handleRowCheckboxChange}
          sacredTheme={sacredTheme}
        />

        <CustomFooter
          page={page}
          pageSize={pageSize}
          rowCount={filteredRows.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          columns={filteredColumns}
          sacredTheme={sacredTheme}
        />
      </Box>

      {/* Bottom decoration */}
      {sacredTheme && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 0.5,
            mt: 2,
            opacity: 0.5,
          }}
        >
          {['𓊖', '𓊗', '𓊖'].map((glyph, index) => (
            <Typography
              key={index}
              sx={{
                color: egyptianStyles.goldColor,
                fontSize: '12px',
                animation: `${floatAnimation} ${2 + index * 0.3}s ease-in-out infinite`,
              }}
            >
              {glyph}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default DataGrid
