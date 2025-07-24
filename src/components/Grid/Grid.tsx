import React from 'react'

export interface GridProps {
  container?: boolean
  size?: number | 'auto'
  spacing?: number
  children: React.ReactNode
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  styles?: {
    theme?: 'sacred' | 'default'
    [key: string]: any
  }
}

const Grid: React.FC<GridProps> = ({
  container = false,
  size,
  spacing = 0,
  children,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  direction = 'row',
  styles = {},
}) => {
  const { ...customStyles } = styles

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    flexWrap: 'wrap',
    justifyContent,
    alignItems,
    gap: `${spacing * 8}px`,
    width: '100%',
    ...customStyles,
  }

  const itemStyles: React.CSSProperties = {
    flex: size === 'auto' ? '1 1 auto' : `0 0 ${(size! / 12) * 100}%`,
    maxWidth: size === 'auto' ? '100%' : `${(size! / 12) * 100}%`,
    ...customStyles,
  }

  if (container) {
    return <div style={containerStyles}>{children}</div>
  }

  return <div style={itemStyles}>{children}</div>
}

export default Grid
