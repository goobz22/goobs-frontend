'use client'

import React from 'react'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'

/**
 * Returns the elements in array 'a' that are not in array 'b'
 * @param {readonly string[]} a - The first array
 * @param {readonly string[]} b - The second array
 * @returns {string[]} The elements in 'a' that are not in 'b'
 */
function not(a: readonly string[], b: readonly string[]) {
  return a.filter(value => b.indexOf(value) === -1)
}

/**
 * Returns the common elements between arrays 'a' and 'b'
 * @param {readonly string[]} a - The first array
 * @param {readonly string[]} b - The second array
 * @returns {string[]} The common elements between 'a' and 'b'
 */
function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter(value => b.indexOf(value) !== -1)
}

/**
 * Props interface for the TransferList component
 */
export interface TransferListProps {
  leftItems: readonly string[]
  rightItems: readonly string[]
  onChange?: (items: string[]) => void
}

/**
 * TransferList component that allows moving items between two lists
 * @param {TransferListProps} props - The props for the TransferList component
 * @returns {JSX.Element} The rendered TransferList component
 */
const TransferList: React.FC<TransferListProps> = ({
  leftItems,
  rightItems,
  onChange,
}) => {
  const [checked, setChecked] = React.useState<readonly string[]>([])
  const [left, setLeft] = React.useState<readonly string[]>(leftItems)
  const [right, setRight] = React.useState<readonly string[]>(rightItems)

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  /**
   * Toggles the checked state of an item
   * @param {string} value - The value to toggle
   */
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

  /**
   * Moves all items from left to right
   */
  const handleAllRight = () => {
    const newRight = right.concat(left)
    setRight(newRight)
    setLeft([])
    if (onChange) {
      onChange(newRight)
    }
  }

  /**
   * Moves checked items from left to right
   */
  const handleCheckedRight = () => {
    const newRight = right.concat(leftChecked)
    const newLeft = not(left, leftChecked)
    setRight(newRight)
    setLeft(newLeft)
    setChecked(not(checked, leftChecked))
    if (onChange) {
      onChange(newRight)
    }
  }

  /**
   * Moves checked items from right to left
   */
  const handleCheckedLeft = () => {
    const newLeft = left.concat(rightChecked)
    const newRight = not(right, rightChecked)
    setLeft(newLeft)
    setRight(newRight)
    setChecked(not(checked, rightChecked))
    if (onChange) {
      onChange(newRight)
    }
  }

  /**
   * Moves all items from right to left
   */
  const handleAllLeft = () => {
    const newLeft = left.concat(right)
    setLeft(newLeft)
    setRight([])
    if (onChange) {
      onChange([])
    }
  }

  /**
   * Renders a custom list of items
   * @param {readonly string[]} items - The items to render in the list
   * @returns {JSX.Element} The rendered list
   */
  const customList = (items: readonly string[]) => (
    <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((value: string) => {
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

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList(left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(right)}</Grid>
    </Grid>
  )
}

export default TransferList
