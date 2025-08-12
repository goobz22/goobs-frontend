import { TRANSITIONS, SHADOWS } from './shared'
import type { FormFieldStyles } from './formField'
import type React from 'react'

export interface BigCalendarTheme {
  // Container styling
  container: {
    backgroundColor: string
    borderRadius: string
    fontFamily: string
  }

  // Toolbar styling
  toolbar: {
    backgroundColor: string
    borderColor: string
    borderRadius: string
    padding: string
    height: string
  }

  // Calendar container
  calendarContainer: {
    backgroundColor: string
    borderRadius: string
    overflow: string
  }

  // Grid layout
  grid: {
    display: string
    flexDirection: string
    height: string
  }

  // Header styling
  header: {
    backgroundColor: string
    borderColor: string
    height: string
  }

  // Cell styling
  cell: {
    borderColor: string
    backgroundColor: string
    hoverBackgroundColor: string
    todayBackgroundColor: string
    otherMonthBackgroundColor: string
    otherMonthColor: string
    padding: string
    minHeight: string
  }

  // Event styling
  event: {
    borderRadius: string
    padding: string
    fontSize: string
    defaultColor: string
  }

  // Time column styling
  timeColumn: {
    width: string
    backgroundColor: string
    borderColor: string
  }

  // Sacred theme specific
  sacred: {
    glow: string
    borderGlow: string
    textGlow: string
    backgroundImage: string
  }

  transition: string
}

export interface BigCalendarStyles extends FormFieldStyles {
  // Toolbar overrides
  toolbarBackground?: string
  toolbarBorderColor?: string
  toolbarPadding?: string
  toolbarHeight?: string

  // Calendar overrides
  calendarBackground?: string
  calendarBorderRadius?: string

  // Header overrides
  headerBackground?: string
  headerBorderColor?: string
  headerHeight?: string

  // Cell overrides
  cellBorderColor?: string
  cellBackground?: string
  cellHoverBackground?: string
  cellTodayBackground?: string
  cellOtherMonthBackground?: string
  cellOtherMonthColor?: string
  cellPadding?: string
  cellMinHeight?: string

  // Event overrides
  eventBorderRadius?: string
  eventPadding?: string
  eventFontSize?: string
  eventDefaultColor?: string

  // Time column overrides
  timeColumnWidth?: string
  timeColumnBackground?: string
  timeColumnBorderColor?: string

  // Sacred theme overrides
  sacredGlow?: string
  sacredBorderGlow?: string
  sacredTextGlow?: string
  sacredBackgroundImage?: string
}

export const bigCalendarThemes: Record<
  'light' | 'dark' | 'sacred',
  BigCalendarTheme
> = {
  light: {
    container: {
      backgroundColor: 'transparent',
      borderRadius: '8px',
      fontFamily: '"Inter", sans-serif',
    },
    toolbar: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: 'rgba(209, 213, 219, 1)',
      borderRadius: '8px',
      padding: '16px',
      height: '64px',
    },
    calendarContainer: {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    grid: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    header: {
      backgroundColor: 'rgba(249, 250, 251, 1)',
      borderColor: 'rgba(209, 213, 219, 1)',
      height: '48px',
    },
    cell: {
      borderColor: 'rgba(229, 231, 235, 1)',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      hoverBackgroundColor: 'rgba(249, 250, 251, 1)',
      todayBackgroundColor: 'rgba(219, 234, 254, 0.5)',
      otherMonthBackgroundColor: 'rgba(249, 250, 251, 0.5)',
      otherMonthColor: 'rgba(156, 163, 175, 1)',
      padding: '8px',
      minHeight: '80px',
    },
    event: {
      borderRadius: '4px',
      padding: '2px 6px',
      fontSize: '0.75rem',
      defaultColor: '#2196f3',
    },
    timeColumn: {
      width: '60px',
      backgroundColor: 'rgba(249, 250, 251, 1)',
      borderColor: 'rgba(209, 213, 219, 1)',
    },
    sacred: {
      glow: 'none',
      borderGlow: 'none',
      textGlow: 'none',
      backgroundImage: 'none',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      backgroundColor: 'transparent',
      borderRadius: '8px',
      fontFamily: '"Inter", sans-serif',
    },
    toolbar: {
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderColor: 'rgba(75, 85, 99, 1)',
      borderRadius: '8px',
      padding: '16px',
      height: '64px',
    },
    calendarContainer: {
      backgroundColor: 'rgba(17, 24, 39, 1)',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    grid: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    header: {
      backgroundColor: 'rgba(31, 41, 55, 1)',
      borderColor: 'rgba(75, 85, 99, 1)',
      height: '48px',
    },
    cell: {
      borderColor: 'rgba(55, 65, 81, 1)',
      backgroundColor: 'rgba(17, 24, 39, 1)',
      hoverBackgroundColor: 'rgba(31, 41, 55, 1)',
      todayBackgroundColor: 'rgba(59, 130, 246, 0.2)',
      otherMonthBackgroundColor: 'rgba(31, 41, 55, 0.3)',
      otherMonthColor: 'rgba(107, 114, 128, 1)',
      padding: '8px',
      minHeight: '80px',
    },
    event: {
      borderRadius: '4px',
      padding: '2px 6px',
      fontSize: '0.75rem',
      defaultColor: '#2196f3',
    },
    timeColumn: {
      width: '60px',
      backgroundColor: 'rgba(31, 41, 55, 1)',
      borderColor: 'rgba(75, 85, 99, 1)',
    },
    sacred: {
      glow: 'none',
      borderGlow: 'none',
      textGlow: 'none',
      backgroundImage: 'none',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      backgroundColor: 'transparent',
      borderRadius: '12px',
      fontFamily: '"Cinzel", serif',
    },
    toolbar: {
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      borderColor: 'rgba(255, 215, 0, 0.3)',
      borderRadius: '12px',
      padding: '20px',
      height: '72px',
    },
    calendarContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    grid: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    header: {
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      borderColor: 'rgba(255, 215, 0, 0.3)',
      height: '56px',
    },
    cell: {
      borderColor: 'rgba(255, 215, 0, 0.2)',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      hoverBackgroundColor: 'rgba(255, 215, 0, 0.1)',
      todayBackgroundColor: 'rgba(255, 215, 0, 0.2)',
      otherMonthBackgroundColor: 'rgba(10, 10, 10, 0.4)',
      otherMonthColor: 'rgba(255, 215, 0, 0.4)',
      padding: '12px',
      minHeight: '100px',
    },
    event: {
      borderRadius: '6px',
      padding: '4px 8px',
      fontSize: '0.8rem',
      defaultColor: 'rgba(255, 215, 0, 0.8)',
    },
    timeColumn: {
      width: '80px',
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    sacred: {
      glow: '0 0 20px rgba(255, 215, 0, 0.3)',
      borderGlow: '0 0 30px rgba(255, 215, 0, 0.4)',
      textGlow: '0 0 3px rgba(255, 215, 0, 0.3)',
      backgroundImage: `
        linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%, rgba(255, 215, 0, 0.05) 100%),
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
      `,
    },
    transition: TRANSITIONS.premium,
  },
}

// Helper function to get computed theme with custom style overrides
export const getBigCalendarTheme = (
  styles?: BigCalendarStyles
): BigCalendarTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = bigCalendarThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      backgroundColor:
        styles.backgroundColor || baseTheme.container.backgroundColor,
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      fontFamily: styles.fontFamily || baseTheme.container.fontFamily,
    },
    toolbar: {
      backgroundColor:
        styles.toolbarBackground || baseTheme.toolbar.backgroundColor,
      borderColor: styles.toolbarBorderColor || baseTheme.toolbar.borderColor,
      borderRadius: baseTheme.toolbar.borderRadius,
      padding: styles.toolbarPadding || baseTheme.toolbar.padding,
      height: styles.toolbarHeight || baseTheme.toolbar.height,
    },
    calendarContainer: {
      backgroundColor:
        styles.calendarBackground ||
        baseTheme.calendarContainer.backgroundColor,
      borderRadius:
        styles.calendarBorderRadius || baseTheme.calendarContainer.borderRadius,
      overflow: baseTheme.calendarContainer.overflow,
    },
    grid: baseTheme.grid,
    header: {
      backgroundColor:
        styles.headerBackground || baseTheme.header.backgroundColor,
      borderColor: styles.headerBorderColor || baseTheme.header.borderColor,
      height: styles.headerHeight || baseTheme.header.height,
    },
    cell: {
      borderColor: styles.cellBorderColor || baseTheme.cell.borderColor,
      backgroundColor: styles.cellBackground || baseTheme.cell.backgroundColor,
      hoverBackgroundColor:
        styles.cellHoverBackground || baseTheme.cell.hoverBackgroundColor,
      todayBackgroundColor:
        styles.cellTodayBackground || baseTheme.cell.todayBackgroundColor,
      otherMonthBackgroundColor:
        styles.cellOtherMonthBackground ||
        baseTheme.cell.otherMonthBackgroundColor,
      otherMonthColor:
        styles.cellOtherMonthColor || baseTheme.cell.otherMonthColor,
      padding: styles.cellPadding || baseTheme.cell.padding,
      minHeight: styles.cellMinHeight || baseTheme.cell.minHeight,
    },
    event: {
      borderRadius: styles.eventBorderRadius || baseTheme.event.borderRadius,
      padding: styles.eventPadding || baseTheme.event.padding,
      fontSize: styles.eventFontSize || baseTheme.event.fontSize,
      defaultColor: styles.eventDefaultColor || baseTheme.event.defaultColor,
    },
    timeColumn: {
      width: styles.timeColumnWidth || baseTheme.timeColumn.width,
      backgroundColor:
        styles.timeColumnBackground || baseTheme.timeColumn.backgroundColor,
      borderColor:
        styles.timeColumnBorderColor || baseTheme.timeColumn.borderColor,
    },
    sacred: {
      glow: styles.sacredGlow || baseTheme.sacred.glow,
      borderGlow: styles.sacredBorderGlow || baseTheme.sacred.borderGlow,
      textGlow: styles.sacredTextGlow || baseTheme.sacred.textGlow,
      backgroundImage:
        styles.sacredBackgroundImage || baseTheme.sacred.backgroundImage,
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getBigCalendarStyles = (styles?: BigCalendarStyles) => {
  const themeConfig = getBigCalendarTheme(styles)
  const isSacredTheme = styles?.theme === 'sacred'

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: themeConfig.container.backgroundColor,
    borderRadius: themeConfig.container.borderRadius,
    fontFamily: themeConfig.container.fontFamily,
    transition: themeConfig.transition,
    width: '100%',
    height: 'max-content',
    position: 'relative',
    overflow: 'visible',
    // Layout styling from FormFieldStyles
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    // Sacred theme effects
    ...(isSacredTheme && {
      boxShadow: themeConfig.sacred.borderGlow,
    }),
  }

  const toolbarStyle: React.CSSProperties = {
    padding: themeConfig.toolbar.padding,
    marginBottom: '16px',
    borderRadius: themeConfig.toolbar.borderRadius,
    height: themeConfig.toolbar.height,
    minHeight: themeConfig.toolbar.height,
    display: 'flex',
    alignItems: 'center',
    ...(isSacredTheme && {
      boxShadow: SHADOWS.sacred.small,
    }),
  }

  const toolbarContentStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  }

  const toolbarSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }

  const calendarContainerStyle: React.CSSProperties = {
    // Remove flex growth so month view can define its own height via rows,
    // letting the page scroll naturally
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: themeConfig.calendarContainer.borderRadius,
    overflow: themeConfig.calendarContainer.overflow,
    height: 'max-content',
    // Ensure top spacing matches header height to avoid overlap flicker on view switches
    marginTop: '0px',
    ...(isSacredTheme && {
      backgroundImage: themeConfig.sacred.backgroundImage,
      boxShadow: SHADOWS.sacred.medium,
    }),
  }

  const calendarGridStyle: React.CSSProperties = {
    display: themeConfig.grid.display as React.CSSProperties['display'],
    flexDirection: themeConfig.grid
      .flexDirection as React.CSSProperties['flexDirection'],
    height: themeConfig.grid.height,
    width: '100%',
  }

  const headerContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    width: '100%',
    backgroundColor: themeConfig.header.backgroundColor,
    // Use cell border color so header lines align perfectly with month/week grids
    borderBottom: `1px solid ${themeConfig.cell.borderColor}`,
    borderLeft: `1px solid ${themeConfig.cell.borderColor}`,
    height: 'auto',
    minHeight: themeConfig.header.height,
  }

  const headerCellStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRight: `1px solid ${themeConfig.cell.borderColor}`,
    boxSizing: 'border-box',
  }

  const monthGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    width: '100%',
    // Let the grid grow based on rows and allow container to scroll
    borderLeft: `1px solid ${themeConfig.cell.borderColor}`,
    // Ensure each week row is at least the min cell height, allowing the
    // grid to grow vertically and be scrollable in the container
    gridAutoRows: themeConfig.cell.minHeight,
  }

  const weekGridStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    overflow: 'auto',
  }

  const dayGridStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    overflow: 'auto',
  }

  const cellBaseStyle: React.CSSProperties = {
    borderRight: `1px solid ${themeConfig.cell.borderColor}`,
    borderBottom: `1px solid ${themeConfig.cell.borderColor}`,
    padding: themeConfig.cell.padding,
    position: 'relative',
    backgroundColor: themeConfig.cell.backgroundColor,
    transition: themeConfig.transition,
    cursor: 'pointer',
    boxSizing: 'border-box',
  }

  const cellSelectedStyle: React.CSSProperties = {
    backgroundColor: isSacredTheme
      ? 'rgba(255, 215, 0, 0.12)'
      : styles?.theme === 'dark'
        ? 'rgba(59, 130, 246, 0.12)'
        : 'rgba(59, 130, 246, 0.08)',
  }

  const hourSelectedStyle: React.CSSProperties = {
    backgroundColor: isSacredTheme
      ? 'rgba(255, 215, 0, 0.1)'
      : styles?.theme === 'dark'
        ? 'rgba(59, 130, 246, 0.1)'
        : 'rgba(59, 130, 246, 0.06)',
    outline: isSacredTheme
      ? '1px solid rgba(255, 215, 0, 0.4)'
      : '1px solid rgba(59,130,246,0.3)',
  }

  const cellHoverStyle: React.CSSProperties = {
    backgroundColor: themeConfig.cell.hoverBackgroundColor,
  }

  const cellOtherMonthStyle: React.CSSProperties = {
    backgroundColor: themeConfig.cell.otherMonthBackgroundColor,
    color: themeConfig.cell.otherMonthColor,
  }

  const cellTodayStyle: React.CSSProperties = {
    backgroundColor: themeConfig.cell.todayBackgroundColor,
    ...(isSacredTheme && {
      boxShadow: `inset ${themeConfig.sacred.glow}`,
    }),
  }

  const cellDateNumberStyle: React.CSSProperties = {
    position: 'absolute',
    top: '4px',
    right: '8px',
    ...(isSacredTheme && {
      textShadow: themeConfig.sacred.textGlow,
    }),
  }

  const cellEventContainerStyle: React.CSSProperties = {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    overflow: 'hidden',
  }

  const eventBaseStyle: React.CSSProperties = {
    borderRadius: themeConfig.event.borderRadius,
    padding: themeConfig.event.padding,
    fontSize: themeConfig.event.fontSize,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    transition: themeConfig.transition,
  }

  const eventCompactStyle: React.CSSProperties = {
    padding: '1px 4px',
    fontSize: '0.7rem',
  }

  const timeColumnStyle: React.CSSProperties = {
    width: themeConfig.timeColumn.width,
    minWidth: themeConfig.timeColumn.width,
    backgroundColor: themeConfig.timeColumn.backgroundColor,
    borderRight: `1px solid ${themeConfig.timeColumn.borderColor}`,
  }

  const timeCellStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: '4px',
    borderBottom: `1px solid ${themeConfig.cell.borderColor}`,
    color: isSacredTheme ? 'rgba(255, 215, 0, 0.7)' : undefined,
    fontSize: '0.7rem',
    paddingRight: '8px',
  }

  const weekDaysContainerStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
  }

  const weekDayColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${themeConfig.cell.borderColor}`,
  }

  const weekDayColumnSelectedStyle: React.CSSProperties = {
    backgroundColor: isSacredTheme
      ? 'rgba(255, 215, 0, 0.06)'
      : styles?.theme === 'dark'
        ? 'rgba(59, 130, 246, 0.06)'
        : 'rgba(59, 130, 246, 0.04)',
  }

  const dayContentColumnStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }

  const hourCellStyle: React.CSSProperties = {
    borderBottom: `1px solid ${themeConfig.cell.borderColor}`,
    padding: '4px 6px',
    position: 'relative',
    backgroundColor: themeConfig.cell.backgroundColor,
    transition: themeConfig.transition,
  }

  const currentHourStyle: React.CSSProperties = {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    ...(isSacredTheme && {
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
    }),
  }

  return {
    container: containerStyle,
    toolbar: toolbarStyle,
    toolbarContent: toolbarContentStyle,
    toolbarSection: toolbarSectionStyle,
    calendarContainer: calendarContainerStyle,
    calendarGrid: calendarGridStyle,
    header: {
      container: headerContainerStyle,
      cell: headerCellStyle,
      height: themeConfig.header.height,
    },
    monthGrid: monthGridStyle,
    weekGrid: weekGridStyle,
    dayGrid: dayGridStyle,
    cell: {
      base: cellBaseStyle,
      hover: cellHoverStyle,
      otherMonth: cellOtherMonthStyle,
      today: cellTodayStyle,
      dateNumber: cellDateNumberStyle,
      eventContainer: cellEventContainerStyle,
      todayDateColor: isSacredTheme ? 'rgba(255, 215, 0, 1)' : undefined,
      currentHour: currentHourStyle,
      selected: cellSelectedStyle,
      hourSelected: hourSelectedStyle,
    },
    event: {
      base: eventBaseStyle,
      compact: eventCompactStyle,
      defaultColor: themeConfig.event.defaultColor,
    },
    timeColumn: timeColumnStyle,
    timeCell: timeCellStyle,
    weekDaysContainer: weekDaysContainerStyle,
    weekDayColumn: weekDayColumnStyle,
    // Non-standard extension for selected background
    weekDayColumnSelected: weekDayColumnSelectedStyle,
    dayContentColumn: dayContentColumnStyle,
    hourCell: hourCellStyle,
  }
}
