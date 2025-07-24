// --------------------------------------------------------------------------
// LIST THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'

// --------------------------------------------------------------------------
// T Y P E S
// --------------------------------------------------------------------------

export interface ListTheme {
  container: React.CSSProperties
  listItem: React.CSSProperties
  listItemIcon: React.CSSProperties
  listItemTextPrimary: React.CSSProperties
  listItemTextSecondary: React.CSSProperties
}

export interface ListStyles {
  theme?: 'light' | 'dark' | 'sacred'
  dense?: boolean
  customStyles?: {
    container?: React.CSSProperties
    listItem?: React.CSSProperties
    listItemIcon?: React.CSSProperties
    listItemTextPrimary?: React.CSSProperties
    listItemTextSecondary?: React.CSSProperties
  }
}

// --------------------------------------------------------------------------
// H E L P E R   F U N C T I O N S
// --------------------------------------------------------------------------

const baseThemes: Record<'light' | 'dark' | 'sacred', ListTheme> = {
  light: {
    container: {
      backgroundColor: 'transparent',
      color: 'inherit',
      padding: '8px 0',
    },
    listItem: {
      padding: '8px 16px',
    },
    listItemIcon: {
      marginRight: '16px',
      color: 'inherit',
    },
    listItemTextPrimary: {
      color: 'inherit',
      fontFamily: 'inherit',
      fontSize: '1rem',
    },
    listItemTextSecondary: {
      color: 'rgba(0, 0, 0, 0.54)',
      fontFamily: 'inherit',
      fontSize: '0.875rem',
    },
  },
  dark: {
    container: {
      backgroundColor: 'transparent',
      color: 'rgb(243, 244, 246)',
      padding: '8px 0',
    },
    listItem: {
      padding: '8px 16px',
    },
    listItemIcon: {
      marginRight: '16px',
      color: 'rgb(243, 244, 246)',
    },
    listItemTextPrimary: {
      color: 'rgb(243, 244, 246)',
      fontFamily: 'inherit',
      fontSize: '1rem',
    },
    listItemTextSecondary: {
      color: 'rgb(156, 163, 175)',
      fontFamily: 'inherit',
      fontSize: '0.875rem',
    },
  },
  sacred: {
    container: {
      backgroundColor: 'transparent',
      color: 'rgba(255, 215, 0, 0.9)',
      padding: '8px 0',
    },
    listItem: {
      padding: '8px 16px',
    },
    listItemIcon: {
      marginRight: '16px',
      color: 'rgba(255, 215, 0, 0.9)',
    },
    listItemTextPrimary: {
      color: 'rgba(255, 215, 0, 0.9)',
      fontFamily: '"Cinzel", serif',
      fontSize: '1rem',
    },
    listItemTextSecondary: {
      color: 'rgba(255, 215, 0, 0.7)',
      fontFamily: '"Cinzel", serif',
      fontSize: '0.875rem',
    },
  },
}

export const getListStyles = (
  styles?: ListStyles
): {
  container: React.CSSProperties
  listItem: React.CSSProperties
  listItemIcon: React.CSSProperties
  listItemTextPrimary: React.CSSProperties
  listItemTextSecondary: React.CSSProperties
} => {
  const theme = styles?.theme || 'light'
  const baseTheme = baseThemes[theme]

  const container: React.CSSProperties = {
    ...baseTheme.container,
    listStyle: 'none',
    margin: 0,
    padding: styles?.dense ? '4px 0' : baseTheme.container.padding,
    ...styles?.customStyles?.container,
  }

  const listItem: React.CSSProperties = {
    ...baseTheme.listItem,
    display: 'flex',
    alignItems: 'center',
    ...styles?.customStyles?.listItem,
  }

  const listItemIcon: React.CSSProperties = {
    ...baseTheme.listItemIcon,
    display: 'flex',
    alignItems: 'center',
    ...styles?.customStyles?.listItemIcon,
  }

  const listItemTextPrimary: React.CSSProperties = {
    ...baseTheme.listItemTextPrimary,
    ...styles?.customStyles?.listItemTextPrimary,
  }

  const listItemTextSecondary: React.CSSProperties = {
    ...baseTheme.listItemTextSecondary,
    ...styles?.customStyles?.listItemTextSecondary,
  }

  return {
    container,
    listItem,
    listItemIcon,
    listItemTextPrimary,
    listItemTextSecondary,
  }
}
