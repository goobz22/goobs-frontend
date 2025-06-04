// src/components/Card/variants/task/index.tsx

'use client'

import React from 'react'
import { Paper, Box, keyframes, alpha } from '@mui/material'
import Typography from '../../../../components/Typography'
import CustomCheckbox from '../../../../components/Checkbox'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = ['𓃀', '𓄿', '𓊖', '𓊗']

const sacredTaskGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.4); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.2); }
`

const glyphFloat = keyframes`
  0% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
  33% { transform: translateY(-2px) translateX(2px); opacity: 0.3; }
  66% { transform: translateY(1px) translateX(-1px); opacity: 0.2; }
  100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
`

interface TaskCardProps {
  title?: string
  description?: string
  /** Whether the card is currently checked/selected. */
  checked?: boolean
  /** Disables the checkbox (prevents selection). */
  disabled?: boolean
  /** Called when the user toggles the checkbox. */
  onCheck?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Height of the card. */
  height?: string | number
  /** Enable Egyptian/Sacred theming */
  sacredTheme?: boolean
  /** Whether the task card is draggable */
  draggable?: boolean
  /** Called when drag starts */
  onDragStart?: (event: React.DragEvent) => void
  /** Called when dragging over */
  onDragOver?: (event: React.DragEvent) => void
  /** Called when dropping */
  onDrop?: (event: React.DragEvent) => void
}

const TaskCard: React.FC<TaskCardProps> = ({
  title = 'Task Title',
  description = 'Description',
  checked = false,
  disabled = false,
  onCheck,
  height = 'auto',
  sacredTheme = false,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <Paper
      elevation={1}
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
        height,
        p: 2,
        border: sacredTheme
          ? `1px solid ${checked ? '#FFD700' : alpha('#FFD700', 0.3)}`
          : '1px solid #e8e8e8',
        backgroundColor: sacredTheme ? '#0a0a0a' : 'white',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        cursor: draggable ? 'grab' : 'default',
        ...(sacredTheme && {
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02))
          `,
          ...(checked && {
            backgroundColor: alpha('#FFD700', 0.05),
            animation: `${sacredTaskGlow} 2s ease-in-out infinite`,
          }),
          '&::before': {
            content: `"${SACRED_GLYPHS[checked ? 2 : 0]}"`,
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            color: alpha('#FFD700', 0.15),
            fontSize: '24px',
            animation: `${glyphFloat} 4s ease-in-out infinite`,
            transition: 'all 0.3s ease',
          },
          '&:hover': {
            borderColor: '#FFD700',
            '&::before': {
              color: alpha('#FFD700', 0.3),
            },
          },
        }),
      }}
    >
      {/* A checkbox in the upper-right corner */}
      <CustomCheckbox
        checked={checked}
        disabled={disabled}
        onChange={onCheck}
        sacredTheme={sacredTheme}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: 4 }}>
        <Typography
          text={title}
          fontcolor={
            sacredTheme
              ? checked
                ? '#FFD700'
                : alpha('#FFD700', 0.9)
              : 'black'
          }
          fontvariant="merrih5"
          sx={{
            marginBottom: '4px',
            ...(sacredTheme && {
              fontFamily: '"Cinzel", serif',
              fontWeight: checked ? 700 : 600,
              letterSpacing: '0.5px',
              textDecoration: checked ? 'line-through' : 'none',
              textDecorationColor: alpha('#FFD700', 0.5),
              textShadow: checked ? '0 0 8px rgba(255, 215, 0, 0.5)' : 'none',
              transition: 'all 0.3s ease',
            }),
          }}
        />
        <Typography
          text={description}
          fontcolor={
            sacredTheme
              ? checked
                ? alpha('#FFD700', 0.6)
                : alpha('#FFD700', 0.8)
              : 'black'
          }
          fontvariant="merriparagraph"
          sx={{
            ...(sacredTheme && {
              textDecoration: checked ? 'line-through' : 'none',
              textDecorationColor: alpha('#FFD700', 0.3),
              opacity: checked ? 0.8 : 1,
              transition: 'all 0.3s ease',
            }),
          }}
        />
      </Box>

      {/* Sacred completion indicator */}
      {sacredTheme && checked && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            display: 'flex',
            gap: '4px',
          }}
        >
          {['𓏭', '𓊵', '𓁟'].map((glyph, i) => (
            <Box
              key={i}
              sx={{
                color: alpha('#FFD700', 0.4 - i * 0.1),
                fontSize: '10px',
                animation: `${glyphFloat} ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {glyph}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  )
}

export default TaskCard
