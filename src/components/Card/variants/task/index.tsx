// src/components/Card/variants/task/index.tsx

'use client'

import React, { useState } from 'react'
import Typography from '../../../../components/Typography'
import CustomCheckbox from '../../../../components/Checkbox'

interface TaskCardProps {
  title?: string
  description?: string
  checked?: boolean
  disabled?: boolean
  onCheck?: (event: React.ChangeEvent<HTMLInputElement>) => void
  height?: string | number
  sacredtheme?: boolean
  outline?: boolean
  draggable?: boolean
  onDragStart?: (event: React.DragEvent) => void
  onDragOver?: (event: React.DragEvent) => void
  onDrop?: (event: React.DragEvent) => void
}

// Sacred glyphs for theming
const SACRED_GLYPHS = ['𓁟', '𓂀', '𓃀', '𓄿', '𓊖', '𓊗', '𓋴', '𓏏']

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    fontFamily: '"Inter", sans-serif',
  } as React.CSSProperties,

  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  } as React.CSSProperties,

  containerDraggable: {
    cursor: 'grab',
  } as React.CSSProperties,

  containerDefault: {
    cursor: 'default',
  } as React.CSSProperties,

  containerHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  } as React.CSSProperties,

  containerCompleted: {
    backgroundColor: 'rgba(239, 246, 255, 0.8)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
  } as React.CSSProperties,

  content: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '16px',
  } as React.CSSProperties,

  title: {
    marginBottom: '4px',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  titleCompleted: {
    textDecoration: 'line-through',
    textDecorationColor: 'rgba(34, 197, 94, 0.5)',
  } as React.CSSProperties,

  description: {
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  descriptionCompleted: {
    textDecoration: 'line-through',
    textDecorationColor: 'rgba(34, 197, 94, 0.3)',
    opacity: 0.8,
  } as React.CSSProperties,

  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background:
      'linear-gradient(180deg, rgb(34, 197, 94) 0%, rgb(74, 222, 128) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  } as React.CSSProperties,

  accentVisible: {
    opacity: 1,
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: '20px',
    transition: 'all 0.4s ease',
    overflow: 'hidden',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    borderRadius: '12px',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    backdropFilter: 'blur(8px)',
    boxShadow:
      '0 0 20px rgba(255, 215, 0, 0.2), 0 0 40px rgba(255, 215, 0, 0.1)',
    fontFamily: '"Cinzel", serif',
    backgroundImage: `
      radial-gradient(circle at top right, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.02) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
  } as React.CSSProperties,

  containerDraggable: {
    cursor: 'grab',
  } as React.CSSProperties,

  containerDefault: {
    cursor: 'default',
  } as React.CSSProperties,

  containerHover: {
    transform: 'translateY(-2px)',
    borderColor: 'rgba(255, 215, 0, 0.8)',
    boxShadow:
      '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)',
  } as React.CSSProperties,

  containerCompleted: {
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderColor: '#FFD700',
    backgroundImage: `
      linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),
      radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  content: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '16px',
  } as React.CSSProperties,

  title: {
    marginBottom: '8px',
    transition: 'all 0.3s ease',
    fontFamily: '"Cinzel", serif',
    fontWeight: 600,
    letterSpacing: '0.025em',
  } as React.CSSProperties,

  titleCompleted: {
    textDecoration: 'line-through',
    textDecorationColor: 'rgba(255, 215, 0, 0.5)',
    fontWeight: 700,
    textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
  } as React.CSSProperties,

  description: {
    transition: 'all 0.3s ease',
    fontFamily: '"Merriweather", serif',
    lineHeight: 1.6,
  } as React.CSSProperties,

  descriptionCompleted: {
    textDecoration: 'line-through',
    textDecorationColor: 'rgba(255, 215, 0, 0.3)',
    opacity: 0.8,
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    fontSize: '32px',
    color: 'rgba(255, 215, 0, 0.15)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
  } as React.CSSProperties,

  glyphBottomLeft: {
    bottom: '8px',
    left: '8px',
  } as React.CSSProperties,

  glyphBottomRight: {
    bottom: '8px',
    right: '8px',
    display: 'flex',
    gap: '4px',
  } as React.CSSProperties,

  glyphSmall: {
    fontSize: '12px',
    color: 'rgba(255, 215, 0, 0.4)',
  } as React.CSSProperties,
}

const TaskCard: React.FC<TaskCardProps> = ({
  title = 'Task Title',
  description = 'Description',
  checked = false,
  disabled = false,
  onCheck,
  height = 'auto',
  sacredtheme = false,
  outline = true,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const styles = sacredtheme ? sacredStyles : premiumStyles

  const containerStyle = {
    ...styles.container,
    ...(!outline && styles.containerNoOutline),
    ...(draggable ? styles.containerDraggable : styles.containerDefault),
    ...(checked && styles.containerCompleted),
    ...(isHovered && styles.containerHover),
    height: typeof height === 'number' ? `${height}px` : height,
  }

  const titleStyle = {
    ...styles.title,
    ...(checked && styles.titleCompleted),
  }

  const descriptionStyle = {
    ...styles.description,
    ...(checked && styles.descriptionCompleted),
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
      {!sacredtheme && outline && checked && (
        <div
          style={{
            ...premiumStyles.accent,
            ...premiumStyles.accentVisible,
          }}
        />
      )}

      <CustomCheckbox
        checked={checked}
        disabled={disabled}
        onChange={onCheck}
        sacredtheme={sacredtheme}
      />

      <div style={styles.content}>
        <Typography
          text={title}
          fontcolor={
            sacredtheme
              ? checked
                ? '#FFD700'
                : 'rgba(255, 215, 0, 0.9)'
              : checked
                ? 'rgb(34, 197, 94)'
                : 'rgb(31, 41, 55)'
          }
          fontvariant="merrih5"
          style={titleStyle}
        />
        <Typography
          text={description}
          fontcolor={
            sacredtheme
              ? checked
                ? 'rgba(255, 215, 0, 0.6)'
                : 'rgba(255, 215, 0, 0.8)'
              : checked
                ? 'rgb(107, 114, 128)'
                : 'rgb(55, 65, 81)'
          }
          fontvariant="merriparagraph"
          style={descriptionStyle}
        />
      </div>

      {/* Sacred theme glyphs */}
      {sacredtheme && (
        <>
          <div
            style={{ ...sacredStyles.glyph, ...sacredStyles.glyphBottomLeft }}
          >
            {SACRED_GLYPHS[checked ? 2 : 0]}
          </div>

          {checked && (
            <div
              style={{
                ...sacredStyles.glyph,
                ...sacredStyles.glyphBottomRight,
              }}
            >
              {['𓏭', '𓊵', '𓁟'].map((glyph, i) => (
                <div
                  key={i}
                  style={{
                    ...sacredStyles.glyphSmall,
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
    </div>
  )
}

export default TaskCard
