// --------------------------------------------------------------------------
// TABLE THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { alpha } from '../utils/alpha'

export interface TableTheme {
  container: React.CSSProperties
  table: React.CSSProperties
  header: React.CSSProperties
  cell: React.CSSProperties
  row: React.CSSProperties
  rowHoverBackgroundColor: string
}

export interface TableStyles {
  theme?: 'sacred' | 'light' | 'dark'
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  width?: string
  maxWidth?: string
  color?: string
  headerBackgroundColor?: string
  headerColor?: string
  fontFamily?: string
  cellBorderColor?: string
}

const goldColor = '#FFD700'

const lightTheme: TableTheme = {
  container: {
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    overflowX: 'auto',
    width: '100%',
    maxWidth: '100%',
  },
  table: {
    backgroundColor: 'transparent',
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'auto',
  },
  header: {
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
    color: '#333333',
    fontWeight: 600,
  },
  cell: {
    borderColor: '#e0e0e0',
    color: '#333333',
    padding: '12px 16px',
    verticalAlign: 'middle',
  },
  row: {
    transition: 'background-color 0.2s ease',
  },
  rowHoverBackgroundColor: alpha('#000000', 0.05),
}

const darkTheme: TableTheme = {
  container: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333333',
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    overflowX: 'auto',
    width: '100%',
    maxWidth: '100%',
  },
  table: {
    backgroundColor: 'transparent',
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'auto',
  },
  header: {
    backgroundColor: '#2a2a2a',
    borderBottom: '1px solid #444444',
    color: '#ffffff',
    fontWeight: 600,
  },
  cell: {
    borderColor: '#333333',
    color: '#ffffff',
    padding: '12px 16px',
    verticalAlign: 'middle',
  },
  row: {
    transition: 'background-color 0.2s ease',
  },
  rowHoverBackgroundColor: alpha('#ffffff', 0.05),
}

const sacredTheme: TableTheme = {
  container: {
    backgroundColor: alpha('#000000', 0.8),
    borderColor: alpha(goldColor, 0.3),
    borderRadius: '8px',
    borderStyle: 'solid',
    borderWidth: '1px',
    overflowX: 'auto',
    width: '100%',
    maxWidth: '100%',
  },
  table: {
    backgroundColor: 'transparent',
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'auto',
  },
  header: {
    backgroundColor: alpha(goldColor, 0.1),
    borderBottom: `1px solid ${alpha(goldColor, 0.3)}`,
    color: goldColor,
    fontFamily: '"Cinzel", serif',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  cell: {
    borderColor: alpha(goldColor, 0.2),
    color: alpha(goldColor, 0.9),
    fontFamily: '"Merriweather", serif',
    padding: '12px 16px',
    verticalAlign: 'middle',
  },
  row: {
    transition: 'background-color 0.2s ease',
  },
  rowHoverBackgroundColor: alpha(goldColor, 0.05),
}

export const tableThemes: Record<'light' | 'dark' | 'sacred', TableTheme> = {
  light: lightTheme,
  dark: darkTheme,
  sacred: sacredTheme,
}

export const getTableTheme = (styles?: TableStyles): TableTheme => {
  const theme: 'light' | 'dark' | 'sacred' = styles?.theme || 'light'
  const base = tableThemes[theme]

  const container: React.CSSProperties = {
    ...base.container,
    ...(styles?.backgroundColor && { backgroundColor: styles.backgroundColor }),
    ...(styles?.borderColor && { borderColor: styles.borderColor }),
    ...(styles?.borderRadius && { borderRadius: styles.borderRadius }),
    ...(styles?.width && { width: styles.width }),
    ...(styles?.maxWidth && { maxWidth: styles.maxWidth }),
  }

  const header: React.CSSProperties = {
    ...base.header,
    ...(styles?.headerBackgroundColor && {
      backgroundColor: styles.headerBackgroundColor,
    }),
    ...(styles?.headerColor && { color: styles.headerColor }),
    ...(styles?.fontFamily && { fontFamily: styles.fontFamily }),
  }

  const cell: React.CSSProperties = {
    ...base.cell,
    ...(styles?.color && { color: styles.color }),
    ...(styles?.fontFamily && { fontFamily: styles.fontFamily }),
    ...(styles?.cellBorderColor && { borderColor: styles.cellBorderColor }),
  }

  return {
    container,
    table: base.table,
    header,
    cell,
    row: base.row,
    rowHoverBackgroundColor: base.rowHoverBackgroundColor,
  }
}

export const getTableStyles = (styles?: TableStyles): TableTheme => {
  return getTableTheme(styles)
}
