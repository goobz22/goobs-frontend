'use client'

import React from 'react'
import { Paper, Box, Checkbox } from '@mui/material'
import Typography from '../../../../components/Typography'

interface TaskCardProps {
  title?: string
  description?: string
  /** Whether the card is currently checked/selected. */
  checked?: boolean
  /** Called when the user toggles the checkbox. */
  onCheck?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Whether this card is “draggable.” Typically true only if `checked` is true. */
  draggable?: boolean
  /** Drag event handlers from your board logic. */
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void

  width?: string
  height?: string | number
}

const TaskCard: React.FC<TaskCardProps> = ({
  title = 'Task Title',
  description = 'Description',
  checked = false,
  onCheck,
  draggable = false, // default to not draggable
  onDragStart,
  onDragOver,
  onDrop,
  width = '100%',
  height = 'auto',
}) => {
  return (
    <Paper
      elevation={1}
      /* 
        Make the entire Paper draggable if the parent says so 
        (based on whether it’s selected).
      */
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width,
        height,
        p: 2,
        border: '1px solid #e8e8e8',
      }}
    >
      {/* A checkbox in the upper-right corner */}
      <Checkbox
        checked={checked}
        onChange={onCheck}
        color="primary"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: 4 }}>
        <Typography
          text={title}
          fontcolor="black"
          fontvariant="merrih5"
          sx={{ marginBottom: '4px' }}
        />
        <Typography
          text={description}
          fontcolor="black"
          fontvariant="merriparagraph"
        />
      </Box>
    </Paper>
  )
}

export default TaskCard
