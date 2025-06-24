'use client'

import React from 'react'
import { Box, Popover, IconButton, alpha, keyframes } from '@mui/material'
import { useManageColumn } from '../utils/useManageColumn'
import CustomButton from '../../Button'
import Searchbar from '../../Field/Search'
import Checkbox from '../../Checkbox'
import ShowHideEyeIcon from '../../Icons/ShowHideEye'
import { ColumnDef } from '../types'
import Typography from '../../Typography'
import * as palette from '../../../styles/palette'

// Sacred animations
const glowPulse = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
  100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.4); }
`

const floatGlyph = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-2px) rotate(180deg); }
  100% { transform: translateY(0px) rotate(360deg); }
`

const egyptianStyles = {
  goldColor: '#FFD700',
  cardBackground: alpha('#000000', 0.9),
}

const SACRED_GLYPHS = ['𓏭', '𓊵', '𓂋', '𓊹']

interface ManageColumnProps {
  open?: boolean
  handleClose?: () => void
  columns: ColumnDef[]
  /** Enable Egyptian/Sacred theming */
  sacredtheme?: boolean
}

function ManageColumns({
  open = false,
  handleClose = () => {},
  columns,
  sacredtheme = false,
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
          border: sacredtheme
            ? `2px solid ${alpha(egyptianStyles.goldColor, 0.5)}`
            : `1px solid ${palette.black.main}`,
          borderRadius: sacredtheme ? 3 : 2,
          minWidth: '250px',
          boxShadow: sacredtheme
            ? `0 0 30px ${alpha(egyptianStyles.goldColor, 0.3)}`
            : 24,
          ...(sacredtheme && {
            animation: `${glowPulse} 3s ease-in-out infinite`,
          }),
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: sacredtheme
            ? egyptianStyles.cardBackground
            : palette.white.main,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          ...(sacredtheme && {
            backdropFilter: 'blur(10px)',
          }),
        }}
      >
        {/* Sacred corner glyphs */}
        {sacredtheme && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                color: alpha(egyptianStyles.goldColor, 0.3),
                fontSize: '14px',
                animation: `${floatGlyph} 4s ease-in-out infinite`,
              }}
            >
              {SACRED_GLYPHS[0]}
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                color: alpha(egyptianStyles.goldColor, 0.3),
                fontSize: '14px',
                animation: `${floatGlyph} 4s ease-in-out infinite reverse`,
              }}
            >
              {SACRED_GLYPHS[1]}
            </Box>
          </>
        )}

        <Typography
          text={sacredtheme ? 'Sacred Columns' : 'Manage Columns'}
          fontvariant="merriparagraph"
          fontcolor={
            sacredtheme ? egyptianStyles.goldColor : palette.black.main
          }
          align="center"
          sx={{
            mb: 0,
            ...(sacredtheme && {
              fontFamily: '"Cinzel", serif',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
            }),
          }}
        />
        <Box sx={{ mt: 1, mb: 0 }}>
          <Searchbar
            value={searchInput}
            onChange={handleSearchChange}
            placeholder={sacredtheme ? 'Seek columns...' : 'Search Columns'}
            iconcolor={
              sacredtheme ? egyptianStyles.goldColor : palette.black.main
            }
            outlinecolor={
              sacredtheme ? egyptianStyles.goldColor : palette.black.main
            }
            sacredtheme={sacredtheme}
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
            fontcolor={
              sacredtheme
                ? alpha(egyptianStyles.goldColor, 0.9)
                : palette.black.main
            }
            sx={{
              fontWeight: 'bold',
              ...(sacredtheme && {
                fontFamily: '"Crimson Text", serif',
              }),
            }}
          />
          <Box sx={{ marginRight: '-4px' }}>
            <Checkbox
              checked={isAllChecked}
              indeterminate={someColumnsVisible && !isAllChecked}
              onChange={handleCheckboxChange}
              sacredtheme={sacredtheme}
            />
          </Box>
        </Box>
        <Box
          sx={{
            maxHeight: '160px',
            overflowY: 'auto',
            marginBottom: '10px',
            ...(sacredtheme && {
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255, 215, 0, 0.5)',
                borderRadius: '3px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.7)',
                },
              },
            }),
          }}
        >
          {filteredColumns.map((column, index) => {
            const isVisible = visibleColumns[column.field] === true
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  ...(sacredtheme && {
                    '&:hover': {
                      backgroundColor: alpha(egyptianStyles.goldColor, 0.1),
                      borderRadius: 1,
                      px: 0.5,
                      mx: -0.5,
                    },
                  }),
                }}
              >
                <Typography
                  text={formatColumnName(column.field)}
                  fontvariant="merriparagraph"
                  fontcolor={
                    sacredtheme ? alpha('#ffffff', 0.9) : palette.black.main
                  }
                  sx={{
                    flexGrow: 1,
                    mr: 1,
                    ...(sacredtheme && {
                      fontFamily: '"Crimson Text", serif',
                    }),
                  }}
                />
                <IconButton
                  onClick={() => handleEyeClick(column.field)}
                  size="small"
                  sx={
                    sacredtheme
                      ? {
                          color: egyptianStyles.goldColor,
                          '&:hover': {
                            backgroundColor: alpha(
                              egyptianStyles.goldColor,
                              0.1
                            ),
                          },
                        }
                      : {}
                  }
                >
                  <ShowHideEyeIcon
                    visible={isVisible}
                    sacredtheme={sacredtheme}
                  />
                </IconButton>
              </Box>
            )
          })}
        </Box>
        <CustomButton
          text="Save"
          backgroundcolor={
            sacredtheme ? egyptianStyles.goldColor : palette.black.main
          }
          variant="contained"
          fontcolor={sacredtheme ? palette.black.main : palette.white.main}
          fontvariant="merriparagraph"
          sx={{ mt: 0 }}
          fullWidth
          onClick={onSaveColumnView}
          sacredtheme={sacredtheme}
        />
      </Box>
    </Popover>
  )
}

export default ManageColumns
