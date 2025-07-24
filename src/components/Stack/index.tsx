/**
 * @fileoverview Stack component for flexible layout with consistent spacing and theming.
 */
'use client'

import React from 'react'

// Define stack themes
export interface StackTheme {
  container: {
    display: string
    gap?: string
    padding?: string
    margin?: string
    alignItems?: string
    justifyContent?: string
    flexDirection?: string
    flexWrap?: string
    width?: string
    height?: string
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
    zIndex?: string
    overflow?: string
    borderRadius?: string
    border?: string
    backgroundColor?: string
    boxShadow?: string
    backdropFilter?: string
    transition?: string
  }
}

// Define stack styles interface
export interface StackStyles {
  theme?: 'light' | 'dark' | 'sacred'
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  spacing?: number | string
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  width?: string
  height?: string
  padding?: string
  margin?: string
  backgroundColor?: string
  border?: string
  borderRadius?: string
  boxShadow?: string
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  zIndex?: string
  overflow?: string
  gap?: string
}

// Stack themes
const stackThemes: Record<'light' | 'dark' | 'sacred', StackTheme> = {
  light: {
    container: {
      display: 'flex',
      gap: '8px',
      flexDirection: 'column',
      position: 'relative',
    },
  },
  dark: {
    container: {
      display: 'flex',
      gap: '8px',
      flexDirection: 'column',
      position: 'relative',
    },
  },
  sacred: {
    container: {
      display: 'flex',
      gap: '8px',
      flexDirection: 'column',
      position: 'relative',
    },
  },
}

// Function to get stack styles
const getStackStyles = (styles?: StackStyles): React.CSSProperties => {
  const theme = styles?.theme || 'light'
  const baseTheme = stackThemes[theme]

  return {
    ...baseTheme.container,
    flexDirection: styles?.direction || 'column',
    gap: styles?.spacing
      ? typeof styles.spacing === 'number'
        ? `${styles.spacing}px`
        : styles.spacing
      : styles?.gap || '8px',
    alignItems: styles?.alignItems,
    justifyContent: styles?.justifyContent,
    flexWrap: styles?.flexWrap,
    width: styles?.width,
    height: styles?.height,
    padding: styles?.padding,
    margin: styles?.margin,
    backgroundColor: styles?.backgroundColor,
    border: styles?.border,
    borderRadius: styles?.borderRadius,
    boxShadow: styles?.boxShadow,
    position: styles?.position || 'relative',
    zIndex: styles?.zIndex,
    overflow: styles?.overflow,
  }
}

// Stack props interface
export interface StackProps {
  children: React.ReactNode
  styles?: StackStyles
  // Legacy props for backwards compatibility
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  spacing?: number | string
  style?: React.CSSProperties
}

// Stack component
const Stack: React.FC<StackProps> = ({
  children,
  styles,
  direction,
  spacing,
  style,
  ...rest
}) => {
  // Merge legacy props with styles prop
  const mergedStyles: StackStyles = {
    ...styles,
    ...(direction && { direction }),
    ...(spacing && { spacing }),
  }

  const computedStyles = getStackStyles(mergedStyles)

  return (
    <div
      style={{
        ...computedStyles,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

Stack.displayName = 'Stack'

export default Stack
