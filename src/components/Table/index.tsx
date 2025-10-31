'use client'

import React from 'react'
import {
  getTableStyles,
  type TableStyles as ThemeTableStyles,
} from '../../theme'

export type TableStyles = ThemeTableStyles

export interface SimpleTableProps {
  children: React.ReactNode
  styles?: TableStyles
}

export interface TableContainerProps {
  children: React.ReactNode
  styles?: TableStyles
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

export const TableContainer: React.FC<TableContainerProps> = ({
  children,
  styles,
}) => {
  const themeConfig = getTableStyles(styles)

  return <div style={themeConfig.container}>{children}</div>
}

export const Table: React.FC<SimpleTableProps> = ({ children, styles }) => {
  const themeConfig = getTableStyles(styles)
  return <table style={themeConfig.table}>{children}</table>
}

export const TableHead: React.FC<TableHeadProps> = ({ children, styles }) => {
  const themeConfig = getTableStyles(styles)
  return <thead style={themeConfig.header}>{children}</thead>
}

export const TableBody: React.FC<TableBodyProps> = ({ children, styles }) => {
  const themeConfig = getTableStyles(styles)
  return <tbody style={themeConfig.table}>{children}</tbody>
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  hover = false,
  styles,
}) => {
  const themeConfig = getTableStyles(styles)
  const rowStyle: React.CSSProperties = {
    ...themeConfig.row,
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (hover) {
      e.currentTarget.style.backgroundColor =
        themeConfig.rowHoverBackgroundColor
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
  const themeConfig = getTableStyles(styles)
  const isHeader =
    React.isValidElement(children) &&
    (children as React.ReactElement).type === 'th'

  const cellStyle: React.CSSProperties = {
    ...themeConfig.cell,
    textAlign: align,
    borderBottom: `1px solid ${themeConfig.cell.borderColor || 'transparent'}`,
    ...(isHeader && themeConfig.header),
  }

  return <td style={cellStyle}>{children}</td>
}

export default Table
