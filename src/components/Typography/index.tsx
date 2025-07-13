/**
 * @fileoverview Defines the Typography component for rendering text with various styles and themes.
 * It supports multiple semantic HTML tags and theming through a centralized theme system.
 */
'use client'
import React, { JSX } from 'react'
import {
  getTypographyStyles,
  type TypographyStyles,
} from '../../theme/typography'

// --------------------------------------------------------------------------
// TYPE DEFINITIONS
// --------------------------------------------------------------------------

export type CustomTypographyVariant =
  | 'merriparagraph'
  | 'merrihelperfooter'
  | 'merrih1'
  | 'merrih2'
  | 'merrih3'
  | 'merrih4'
  | 'merrih5'
  | 'merrih6'

export interface TypographyProps {
  /** The text content to display. Can be used instead of children. */
  text?: string
  /** The content to display. Takes precedence over the `text` prop. */
  children?: React.ReactNode
  /** The typography variant to apply. Determines the style and semantic tag. */
  variant?: CustomTypographyVariant
  /** Custom styles to apply to the component using the theme system. */
  styles?: TypographyStyles
}

// --------------------------------------------------------------------------
// VARIANT MAPPING
// --------------------------------------------------------------------------

// Mapping variants to semantic HTML tags
const variantMapping: Record<
  CustomTypographyVariant,
  keyof JSX.IntrinsicElements
> = {
  merrih1: 'h1',
  merrih2: 'h2',
  merrih3: 'h3',
  merrih4: 'h4',
  merrih5: 'h5',
  merrih6: 'h6',
  merriparagraph: 'p',
  merrihelperfooter: 'p',
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
  variant = 'merriparagraph',
  styles,
  ...rest
}) => {
  console.log('Typography component rendered with props:', {
    variant,
    text: text || children,
    styles,
  })

  // Merge component props with styles
  const mergedStyles: TypographyStyles = {
    variant,
    ...styles,
  }

  const computedStyles = getTypographyStyles(mergedStyles)

  const Component = variantMapping[variant] || 'p'
  const content = children || text

  return (
    <Component style={computedStyles.container} {...rest}>
      {content}
    </Component>
  )
}

Typography.displayName = 'Typography'

export default Typography
