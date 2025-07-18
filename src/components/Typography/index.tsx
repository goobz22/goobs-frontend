/**
 * @fileoverview Defines the Typography component for rendering text with various styles and themes.
 * It supports multiple semantic HTML tags and theming through a centralized theme system.
 */
'use client'
import React from 'react'
import {
  getTypographyStyles,
  type TypographyStyles,
} from '../../theme/typography'

// --------------------------------------------------------------------------
// TYPE DEFINITIONS
// --------------------------------------------------------------------------

export interface TypographyProps {
  /** The text content to display. Can be used instead of children. */
  text?: string
  /** The content to display. Takes precedence over the `text` prop. */
  children?: React.ReactNode
  /** Custom styles to apply to the component using the theme system. */
  styles?: TypographyStyles
}

// --------------------------------------------------------------------------
// TYPOGRAPHY COMPONENT
// --------------------------------------------------------------------------

/**
 * A component for rendering text with consistent styling and theming.
 */
const Typography: React.FC<TypographyProps> = ({
  text,
  children,
  styles,
  ...rest
}) => {
  console.log('Typography component rendered with props:', {
    text: text || children,
    styles,
  })

  const computedStyles = getTypographyStyles(styles || {})

  const content = children || text

  return (
    <p style={computedStyles.container} {...rest}>
      {content}
    </p>
  )
}

Typography.displayName = 'Typography'

export default Typography
