// src\components\TransferList\index.tsx
'use client'

import React, { useEffect, useState } from 'react'
// Import your custom Grid (which internally uses MUI Grid2):
import CustomGrid from '../Grid'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { Box, Typography } from '@mui/material'

import Dropdown, { DropdownOption } from '../Dropdown'

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
}

/**
 * A TransferList with two columns:
 * - Left side: either static lists (singleSelection) or
 *   a dropdown + dynamic lists (multipleSelection).
 * - Middle: 4 buttons (≫, >, <, ≪) to move items.
 * - Right side: assigned items.
 */
const TransferList: React.FC<TransferListProps> = ({
  variant = 'singleSelection',
  leftItems = [],
  rightItems = [],
  dropdownLabel,
  dropdownOptions = [],
  dropdownDataMap = {},
  onChange,

  leftTitle = 'Unassigned',
  rightTitle = 'Assigned',
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
    <Paper sx={{ width: '100%', height: 230, overflow: 'auto', mt: 1 }}>
      <List dense component="div" role="list">
        {items.map(value => {
          const labelId = `transfer-list-item-${value}-label`
          return (
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItemButton>
          )
        })}
      </List>
    </Paper>
  )

  /**
   * Renders the left column:
   * - singleSelection => show "leftTitle" + the list
   * - multipleSelection => show a dropdown + dynamic lists
   */
  const renderLeftColumn = () => {
    if (variant === 'singleSelection') {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {leftTitle}
          </Typography>
          {renderList(left)}
        </Box>
      )
    }

    // multipleSelection => show the dropdown above
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Dropdown
          label={dropdownLabel || ''}
          name="transferListDropdown"
          options={dropdownOptions}
          value={selectedDropdownValue}
          onChange={e => {
            const newValue = e.target.value as string
            setSelectedDropdownValue(newValue)
          }}
        />
        {renderList(left)}
      </Box>
    )
  }

  return (
    <CustomGrid
      container // We set "container" so our CustomGrid is the outer container
      spacing={2}
      alignItems="flex-start"
      columnconfig={[
        // We'll define a single "row" with 3 "columns": left, middle, right
        // row=1, column=1 => left
        // row=1, column=2 => middle
        // row=1, column=3 => right
        {
          row: 1,
          column: 1,
          component: <Box sx={{ width: '100%' }}>{renderLeftColumn()}</Box>,
        },
        {
          row: 1,
          column: 2,
          component: (
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
              >
                ≫
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleAllLeft}
                disabled={right.length === 0}
                aria-label="move all left"
              >
                ≪
              </Button>
            </Box>
          ),
        },
        {
          row: 1,
          column: 3,
          component: (
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {rightTitle}
              </Typography>
              {renderList(right)}
            </Box>
          ),
        },
      ]}
    />
  )
}

export default TransferList
