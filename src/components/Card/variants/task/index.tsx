/**
 * @fileoverview Defines the TaskCard component, a card for displaying a single task.
 */
'use client'

import React, { useState, useMemo } from 'react'
import { CardStyles, getCardStyles, SACRED_GLYPHS } from '../../../../theme'
import Typography from '../../../../components/Typography'
import CustomCheckbox from '../../../../components/Checkbox'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface TaskCardProps {
  /** Task title */
  title?: string
  /** Task description */
  description?: string
  /** Whether the task is checked/completed */
  checked?: boolean
  /** Whether the task is disabled */
  disabled?: boolean
  /** Callback when check state changes */
  onCheck?: (checked: boolean) => void
  /** Custom height */
  height?: string | number
  /** Whether the card is draggable */
  draggable?: boolean
  /** Drag event handlers */
  onDragStart?: (event: React.DragEvent) => void
  onDragOver?: (event: React.DragEvent) => void
  onDrop?: (event: React.DragEvent) => void
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: CardStyles
}

// --------------------------------------------------------------------------
// MAIN TASK CARD COMPONENT
// --------------------------------------------------------------------------

const TaskCard: React.FC<TaskCardProps> = ({
  title = 'Task Title',
  description = 'Description',
  checked = false,
  disabled = false,
  onCheck,
  height = 'auto',
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  styles,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const isSacredTheme = styles?.theme === 'sacred'
  const outline = styles?.outline !== false

  const computedStyles = useMemo(
    () => getCardStyles({ ...styles, variant: 'task' }, isHovered, disabled),
    [styles, isHovered, disabled]
  )

  const containerStyle = {
    ...computedStyles.taskContainer,
    ...(checked && {
      backgroundColor: isSacredTheme
        ? 'rgba(255, 215, 0, 0.05)'
        : 'rgba(239, 246, 255, 0.8)',
      borderColor: isSacredTheme ? '#FFD700' : 'rgba(34, 197, 94, 0.4)',
    }),
    ...(draggable && { cursor: 'grab' }),
    height: typeof height === 'number' ? `${height}px` : height,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  }

  const titleStyle = {
    marginBottom: '4px',
    transition: 'all 0.3s ease',
    ...(checked && {
      textDecoration: 'line-through',
      textDecorationColor: isSacredTheme
        ? 'rgba(255, 215, 0, 0.5)'
        : 'rgba(34, 197, 94, 0.5)',
    }),
  }

  const descriptionStyle = {
    transition: 'all 0.3s ease',
    ...(checked && {
      textDecoration: 'line-through',
      textDecorationColor: isSacredTheme
        ? 'rgba(255, 215, 0, 0.3)'
        : 'rgba(34, 197, 94, 0.3)',
      opacity: 0.8,
    }),
  }

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium theme accent bar */}
      {!isSacredTheme && outline && checked && (
        <div
          style={{
            ...computedStyles.accent,
            ...computedStyles.accentVisible,
            background:
              'linear-gradient(180deg, rgb(34, 197, 94) 0%, rgb(74, 222, 128) 100%)',
          }}
        />
      )}

      {/* Sacred theme glyphs */}
      {isSacredTheme && (
        <>
          <div
            style={{
              ...computedStyles.glyph,
              ...computedStyles.glyphBottomLeft,
              fontSize: '32px',
              bottom: '8px',
              left: '8px',
            }}
          >
            {SACRED_GLYPHS[checked ? 2 : 0]}
          </div>

          {checked && (
            <div
              style={{
                ...computedStyles.glyph,
                ...computedStyles.glyphTopRight,
                fontSize: '12px',
                top: '8px',
                right: '8px',
                display: 'flex',
                gap: '4px',
              }}
            >
              {['𓏭', '𓊵', '𓁟'].map((glyph, i) => (
                <div
                  key={i}
                  style={{
                    color: 'rgba(255, 215, 0, 0.4)',
                    animationDelay: `${i * 0.3}s`,
                    opacity: 0.4 - i * 0.1,
                  }}
                >
                  {glyph}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <CustomCheckbox
        checked={checked}
        disabled={disabled}
        onChange={onCheck}
        styles={{
          theme: isSacredTheme ? 'sacred' : styles?.theme || 'light',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography
          text={title}
          variant="merrih5"
          styles={{
            ...titleStyle,
            color: isSacredTheme
              ? checked
                ? '#FFD700'
                : 'rgba(255, 215, 0, 0.9)'
              : checked
                ? 'rgb(34, 197, 94)'
                : computedStyles.title.color,
            fontFamily: isSacredTheme ? '"Cinzel", serif' : undefined,
            fontWeight: isSacredTheme ? 600 : undefined,
            letterSpacing: isSacredTheme ? '0.025em' : undefined,
            textShadow:
              isSacredTheme && checked
                ? '0 0 8px rgba(255, 215, 0, 0.3)'
                : undefined,
          }}
        />
        <Typography
          text={description}
          variant="merriparagraph"
          styles={{
            ...descriptionStyle,
            color: isSacredTheme
              ? checked
                ? 'rgba(255, 215, 0, 0.6)'
                : 'rgba(255, 215, 0, 0.8)'
              : checked
                ? 'rgb(107, 114, 128)'
                : computedStyles.bodyText.color,
            fontFamily: isSacredTheme ? '"Merriweather", serif' : undefined,
            lineHeight: isSacredTheme ? 1.6 : undefined,
          }}
        />
      </div>
    </div>
  )
}

TaskCard.displayName = 'TaskCard'

export default TaskCard
