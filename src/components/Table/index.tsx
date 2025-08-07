'use client'

import React from 'react'

// Alpha utility function
const alpha = (color: string, opacity: number): string => {
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  return color
}

export interface TableStyles {
  theme?: 'sacred' | 'light' | 'dark'
  backgroundColor?: string
  borderColor?: string
  width?: string
  maxWidth?: string
  borderRadius?: string
}

export interface SimpleTableProps {
  children: React.ReactNode
  styles?: TableStyles
}

export interface TableContainerProps {
  children: React.ReactNode
  styles?: TableStyles
  sx?: React.CSSProperties
}

export interface TableHeadProps {
  children: React.ReactNode
  styles?: TableStyles
}

export interface TableBodyProps {
  children: React.ReactNode
  styles?: TableStyles
}

export interface TableRowProps {
  children: React.ReactNode
  hover?: boolean
  styles?: TableStyles
}

export interface TableCellProps {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  styles?: TableStyles
}

const getTableTheme = (styles?: TableStyles) => {
  const theme = styles?.theme || 'light'
  const goldColor = '#FFD700'

  switch (theme) {
    case 'sacred':
      return {
        container: {
          backgroundColor: alpha('#000000', 0.8),
          borderColor: alpha(goldColor, 0.3),
          borderRadius: '8px',
        },
        table: {
          backgroundColor: 'transparent',
        },
        header: {
          backgroundColor: alpha(goldColor, 0.1),
          borderColor: alpha(goldColor, 0.3),
          color: goldColor,
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.05em',
        },
        cell: {
          borderColor: alpha(goldColor, 0.2),
          color: alpha(goldColor, 0.9),
          fontFamily: '"Merriweather", serif',
        },
        row: {
          '&:hover': {
            backgroundColor: alpha(goldColor, 0.05),
          },
        },
      }
    case 'dark':
      return {
        container: {
          backgroundColor: '#1a1a1a',
          borderColor: '#333333',
          borderRadius: '4px',
        },
        table: {
          backgroundColor: 'transparent',
        },
        header: {
          backgroundColor: '#2a2a2a',
          borderColor: '#444444',
          color: '#ffffff',
          fontWeight: 600,
        },
        cell: {
          borderColor: '#333333',
          color: '#ffffff',
        },
        row: {
          '&:hover': {
            backgroundColor: alpha('#ffffff', 0.05),
          },
        },
      }
    default: // light
      return {
        container: {
          backgroundColor: '#ffffff',
          borderColor: '#e0e0e0',
          borderRadius: '4px',
        },
        table: {
          backgroundColor: 'transparent',
        },
        header: {
          backgroundColor: '#f5f5f5',
          borderColor: '#e0e0e0',
          color: '#333333',
          fontWeight: 600,
        },
        cell: {
          borderColor: '#e0e0e0',
          color: '#333333',
        },
        row: {
          '&:hover': {
            backgroundColor: alpha('#000000', 0.05),
          },
        },
      }
  }
}

export const TableContainer: React.FC<TableContainerProps> = ({
  children,
  styles,
  sx,
}) => {
  const themeConfig = getTableTheme(styles)

  const containerStyle: React.CSSProperties = {
    ...themeConfig.container,
    border: `1px solid ${themeConfig.container.borderColor}`,
    overflowX: 'auto',
    width: styles?.width || '100%',
    maxWidth: styles?.maxWidth || '100%',
    ...sx,
  }

  return <div style={containerStyle}>{children}</div>
}

export const Table: React.FC<SimpleTableProps> = ({ children, styles }) => {
  const themeConfig = getTableTheme(styles)

  const tableStyle: React.CSSProperties = {
    ...themeConfig.table,
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'auto',
  }

  return <table style={tableStyle}>{children}</table>
}

export const TableHead: React.FC<TableHeadProps> = ({ children, styles }) => {
  const themeConfig = getTableTheme(styles)

  const headStyle: React.CSSProperties = {
    ...themeConfig.header,
  }

  return <thead style={headStyle}>{children}</thead>
}

export const TableBody: React.FC<TableBodyProps> = ({ children, styles }) => {
  const themeConfig = getTableTheme(styles)

  const bodyStyle: React.CSSProperties = {
    ...themeConfig.table,
  }

  return <tbody style={bodyStyle}>{children}</tbody>
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  hover = false,
  styles,
}) => {
  const rowStyle: React.CSSProperties = {
    ...(hover && {
      transition: 'background-color 0.2s ease',
    }),
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (hover && styles?.theme === 'sacred') {
      e.currentTarget.style.backgroundColor = alpha('#FFD700', 0.05)
    } else if (hover && styles?.theme === 'dark') {
      e.currentTarget.style.backgroundColor = alpha('#ffffff', 0.05)
    } else if (hover) {
      e.currentTarget.style.backgroundColor = alpha('#000000', 0.05)
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (hover) {
      e.currentTarget.style.backgroundColor = 'transparent'
    }
  }

  return (
    <tr
      style={rowStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </tr>
  )
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  align = 'left',
  styles,
}) => {
  const themeConfig = getTableTheme(styles)
  const isHeader =
    React.isValidElement(children) &&
    (children as React.ReactElement).type === 'th'

  const cellStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: align,
    borderBottom: `1px solid ${themeConfig.cell.borderColor}`,
    color: themeConfig.cell.color,
    fontFamily: themeConfig.cell.fontFamily,
    verticalAlign: 'middle',
    ...(isHeader && themeConfig.header),
  }

  return <td style={cellStyle}>{children}</td>
}

export default Table
