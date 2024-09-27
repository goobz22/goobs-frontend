'use client'

import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'

function not(a: readonly string[], b: readonly string[]) {
  return a.filter(value => b.indexOf(value) === -1)
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter(value => b.indexOf(value) !== -1)
}

export interface TransferListProps {
  leftItems: readonly string[]
  rightItems: readonly string[]
  onChange: (leftItems: string[], rightItems: string[]) => void
}

const TransferList: React.FC<TransferListProps> = ({
  leftItems,
  rightItems,
  onChange,
}) => {
  const [checked, setChecked] = React.useState<readonly string[]>([])
  const [left, setLeft] = React.useState<readonly string[]>(leftItems)
  const [right, setRight] = React.useState<readonly string[]>(rightItems)

  useEffect(() => {
    setLeft(leftItems)
    setRight(rightItems)
  }, [leftItems, rightItems])

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

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

  const handleAllRight = () => {
    const newRight = right.concat(left)
    setRight(newRight)
    setLeft([])
    onChange([], newRight)
  }

  const handleCheckedRight = () => {
    const newRight = right.concat(leftChecked)
    const newLeft = not(left, leftChecked)
    setRight(newRight)
    setLeft(newLeft)
    setChecked(not(checked, leftChecked))
    onChange(newLeft, newRight)
  }

  const handleCheckedLeft = () => {
    const newLeft = left.concat(rightChecked)
    const newRight = not(right, rightChecked)
    setLeft(newLeft)
    setRight(newRight)
    setChecked(not(checked, rightChecked))
    onChange(newLeft, newRight)
  }

  const handleAllLeft = () => {
    const newLeft = left.concat(right)
    setLeft(newLeft)
    setRight([])
    onChange(newLeft, [])
  }

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
