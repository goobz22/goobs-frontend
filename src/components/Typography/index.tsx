/**
 * @fileoverview Defines the Typography component for rendering text with various styles and themes.
 * It supports multiple semantic HTML tags and theming through a centralized theme system.
 */
'use client'
import React, { useEffect } from 'react'
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
  /** Sacred theme flag - used for theming but filtered out before DOM rendering */
  sacredtheme?: boolean
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
  // Extract sacredtheme prop to prevent it from being passed to DOM elements
  const { sacredtheme, ...validProps } = rest as any
  // sacredtheme is intentionally excluded from the props passed to the DOM element
  void sacredtheme
  // Inject sacred animation keyframes when sacred theme is used
  useEffect(() => {
    if (styles?.theme === 'sacred') {
      const styleElement = document.getElementById('sacred-keyframes')
      if (!styleElement) {
        const style = document.createElement('style')
        style.id = 'sacred-keyframes'
        style.textContent = `
          @keyframes sacredTextGlow {
            0% {
              text-shadow: 
                0 0 20px rgba(255, 215, 0, 0.8), 
                0 0 40px rgba(255, 215, 0, 0.4);
            }
            100% {
              text-shadow: 
                0 0 30px rgba(255, 215, 0, 1), 
                0 0 60px rgba(255, 215, 0, 0.6),
                0 0 90px rgba(255, 215, 0, 0.3);
            }
          }
        `
        document.head.appendChild(style)
      }
    }
  }, [styles?.theme])

  const computedStyles = getTypographyStyles(styles || {})

  const content = children || text

  return (
    <p style={computedStyles.container} {...validProps}>
      {content}
    </p>
  )
}

Typography.displayName = 'Typography'

export default Typography
