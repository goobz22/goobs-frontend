'use client'

import React, { useEffect, useState } from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { Box, Typography, keyframes, alpha } from '@mui/material'
import Dropdown, { DropdownOption } from '../Field/Dropdown/Regular'

// Sacred theming animations
const glowPulse = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
`

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
`

/** Utility functions for array handling */
function not(a: readonly string[], b: readonly string[]) {
  return a.filter(value => b.indexOf(value) === -1)
}
function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter(value => b.indexOf(value) !== -1)
}

/** Available display modes for the TransferList. */
export type TransferListVariant = 'singleSelection' | 'multipleSelection'

/**
 * For multipleSelection mode, you can pass a map of:
 *   dropdownValue -> { leftItems, rightItems }
 * Example:
 * {
 *   topics:   { leftItems: ['Topic1','Topic2'], rightItems: [] },
 *   articles: { leftItems: ['Article1','Article2'], rightItems: [] },
 * }
 */
export interface TransferListDropdownDataMap {
  [dropdownValue: string]: {
    leftItems: string[]
    rightItems: string[]
  }
}

export interface TransferListProps {
  /**
   * If `variant="singleSelection"`, we use `leftItems` & `rightItems` directly.
   * If `variant="multipleSelection"`, you must provide dropdown props.
   */
  variant?: TransferListVariant

  /** Used ONLY if variant="singleSelection". */
  leftItems?: readonly string[]
  rightItems?: readonly string[]

  /** Used ONLY if variant="multipleSelection". */
  dropdownLabel?: string
  dropdownOptions?: DropdownOption[]
  dropdownDataMap?: TransferListDropdownDataMap

  /**
   * A map from item-value to label.
   * e.g. { "HIGH": "High Priority", "LOW": "Low Priority" }.
   * If provided, we'll display `itemLabelMap[value]` in the list
   * rather than the raw `value`.
   */
  itemLabelMap?: Record<string, string>

  /**
   * Fired whenever left/right arrays change (user clicks the arrows).
   * @param leftItems  Updated array for the "left" column
   * @param rightItems Updated array for the "right" column
   * @param dropdownValue For multipleSelection mode
   */
  onChange: (
    leftItems: string[],
    rightItems: string[],
    dropdownValue?: string
  ) => void

  /** The title shown above the left column. Defaults to "Unassigned". */
  leftTitle?: string

  /** The title shown above the right column. Defaults to "Assigned". */
  rightTitle?: string

  /** Enable Egyptian/Sacred theming */
  sacredTheme?: boolean
}

const TransferList: React.FC<TransferListProps> = ({
  variant = 'singleSelection',
  leftItems = [],
  rightItems = [],
  dropdownLabel,
  dropdownOptions = [],
  dropdownDataMap = {},
  itemLabelMap,
  onChange,
  leftTitle = 'Unassigned',
  rightTitle = 'Assigned',
  sacredTheme = false,
}) => {
  // The currently selected dropdown value (multipleSelection only)
  const [selectedDropdownValue, setSelectedDropdownValue] = useState<string>('')

  // Local states for the items displayed on left vs. right
  const [left, setLeft] = useState<readonly string[]>([])
  const [right, setRight] = useState<readonly string[]>([])

  // Which items are "checked" by the user
  const [checked, setChecked] = useState<readonly string[]>([])

  /**
   * SINGLE-SELECTION: rely on leftItems / rightItems props.
   * Only update local state if they've changed, to avoid an infinite loop.
   */
  useEffect(() => {
    if (variant === 'singleSelection') {
      let changed = false
      if (
        leftItems.length !== left.length ||
        !leftItems.every((val, idx) => left[idx] === val)
      ) {
        setLeft(leftItems)
        changed = true
      }
      if (
        rightItems.length !== right.length ||
        !rightItems.every((val, idx) => right[idx] === val)
      ) {
        setRight(rightItems)
        changed = true
      }
      if (changed) {
        setChecked([])
      }
    }
  }, [variant, leftItems, rightItems, left, right])

  /**
   * MULTIPLE-SELECTION: load from dropdownDataMap whenever
   * the user picks a new dropdown value.
   */
  useEffect(() => {
    if (variant === 'multipleSelection') {
      if (!selectedDropdownValue) return
      const dataForValue = dropdownDataMap[selectedDropdownValue]
      if (dataForValue) {
        setLeft(dataForValue.leftItems)
        setRight(dataForValue.rightItems)
      } else {
        setLeft([])
        setRight([])
      }
      setChecked([])
    }
  }, [variant, selectedDropdownValue, dropdownDataMap])

  // Intersection of checked+left, and checked+right
  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  /** Toggle check/uncheck for a given item. */
  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]
    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }

  /** Move ALL from left => right. */
  const handleAllRight = () => {
    const newRight = [...right, ...left]
    setRight(newRight)
    setLeft([])
    setChecked([])

    onChange(
      [],
      newRight,
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
  }

  /** Move SELECTED from left => right. */
  const handleCheckedRight = () => {
    const newRight = [...right, ...leftChecked]
    const newLeft = not(left, leftChecked)
    setRight(newRight)
    setLeft(newLeft)
    setChecked(not(checked, leftChecked))

    onChange(
      newLeft,
      newRight,
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
  }

  /** Move SELECTED from right => left. */
  const handleCheckedLeft = () => {
    const newLeft = [...left, ...rightChecked]
    const newRight = not(right, rightChecked)
    setLeft(newLeft)
    setRight(newRight)
    setChecked(not(checked, rightChecked))

    onChange(
      newLeft,
      newRight,
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
  }

  /** Move ALL from right => left. */
  const handleAllLeft = () => {
    const newLeft = [...left, ...right]
    setLeft(newLeft)
    setRight([])
    setChecked([])

    onChange(
      newLeft,
      [],
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
  }

  /** Renders a scrollable list of items */
  const renderList = (items: readonly string[]) => (
    <Paper
      sx={{
        width: '100%',
        height: 230,
        overflow: 'auto',
        mt: 1,
        ...(sacredTheme && {
          backgroundColor: alpha('#000000', 0.8),
          border: `1px solid ${alpha('#FFD700', 0.3)}`,
          animation: `${glowPulse} 3s ease-in-out infinite`,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 215, 0, 0.5)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(255, 215, 0, 0.7)',
            },
          },
        }),
      }}
    >
      <List dense component="div" role="list">
        {items.map(value => {
          const labelId = `transfer-list-item-${value}-label`
          const isChecked = checked.indexOf(value) !== -1
          const displayedLabel =
            itemLabelMap && itemLabelMap[value] ? itemLabelMap[value] : value

          return (
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
              sx={{
                ...(sacredTheme && {
                  color: alpha('#FFD700', 0.9),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: alpha('#FFD700', 0.1),
                    transform: 'translateX(5px)',
                  },
                  ...(isChecked && {
                    backgroundColor: alpha('#FFD700', 0.15),
                    borderLeft: `3px solid #FFD700`,
                  }),
                }),
              }}
            >
              <ListItemIcon>
                <Checkbox
                  checked={isChecked}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                  sx={
                    sacredTheme
                      ? {
                          color: alpha('#FFD700', 0.6),
                          '&.Mui-checked': {
                            color: '#FFD700',
                            filter:
                              'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
                          },
                        }
                      : undefined
                  }
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={displayedLabel}
                sx={
                  sacredTheme
                    ? {
                        '& .MuiListItemText-primary': {
                          color: alpha('#FFD700', 0.9),
                          fontWeight: 500,
                        },
                      }
                    : undefined
                }
              />
            </ListItemButton>
          )
        })}
      </List>
    </Paper>
  )

  /**
   * Renders the left column:
   * - singleSelection => show "leftTitle" + the list
   * - multipleSelection => show a dropdown above the list
   */
  const renderLeftColumn = () => {
    if (variant === 'singleSelection') {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 1,
              ...(sacredTheme && {
                color: '#FFD700',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
              }),
            }}
          >
            {leftTitle}
          </Typography>
          {renderList(left)}
        </Box>
      )
    }
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Dropdown
          label={dropdownLabel || ''}
          options={dropdownOptions}
          value={selectedDropdownValue}
          onChange={e => {
            const newValue = e.target.value
            setSelectedDropdownValue(newValue)
          }}
          backgroundcolor={sacredTheme ? alpha('#000000', 0.6) : undefined}
          outlinecolor={sacredTheme ? '#FFD700' : undefined}
          fontcolor={sacredTheme ? '#FFD700' : undefined}
          shrunkfontcolor={sacredTheme ? '#FFD700' : undefined}
        />
        {renderList(left)}
      </Box>
    )
  }

  const buttonStyles = sacredTheme
    ? {
        color: '#FFD700',
        borderColor: '#FFD700',
        backgroundColor: alpha('#000000', 0.8),
        '&:hover': {
          backgroundColor: alpha('#FFD700', 0.1),
          borderColor: '#FFD700',
          transform: 'scale(1.1)',
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
        },
        '&:disabled': {
          color: alpha('#FFD700', 0.3),
          borderColor: alpha('#FFD700', 0.3),
        },
      }
    : undefined

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'flex-start',
        ...(sacredTheme && {
          padding: 2,
          backgroundColor: alpha('#000000', 0.6),
          borderRadius: 2,
          border: `1px solid ${alpha('#FFD700', 0.3)}`,
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
            radial-gradient(circle at center, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
          `,
          position: 'relative',
          '&::before': {
            content: '"𓊨"',
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '20px',
            color: alpha('#FFD700', 0.2),
            animation: 'rotate 25s linear infinite',
          },
        }),
      }}
    >
      <Box sx={{ width: '100%' }}>{renderLeftColumn()}</Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: { xs: 2, sm: 4 },
          gap: '4px',
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={handleAllRight}
          disabled={left.length === 0}
          aria-label="move all right"
          sx={{
            ...buttonStyles,
            ...(sacredTheme && {
              animation: `${floatAnimation} 2s ease-in-out infinite`,
            }),
          }}
        >
          ≫
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="move selected right"
          sx={buttonStyles}
        >
          &gt;
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label="move selected left"
          sx={buttonStyles}
        >
          &lt;
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleAllLeft}
          disabled={right.length === 0}
          aria-label="move all left"
          sx={{
            ...buttonStyles,
            ...(sacredTheme && {
              animation: `${floatAnimation} 2.5s ease-in-out infinite`,
            }),
          }}
        >
          ≪
        </Button>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 1,
            ...(sacredTheme && {
              color: '#FFD700',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
            }),
          }}
        >
          {rightTitle}
        </Typography>
        {renderList(right)}
      </Box>
    </Box>
  )
}

export default TransferList
