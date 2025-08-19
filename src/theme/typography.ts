// --------------------------------------------------------------------------
// TYPOGRAPHY THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS } from './shared'

export interface TypographyTheme {
  base: {
    margin: string
    padding: string
    lineHeight: string | number
    letterSpacing: string
    position: string
    transition: string
  }
  variants: {
    merrih1: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    merrih2: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    merrih3: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    merrih4: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    merrih5: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    merrih6: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    merriparagraph: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    merrihelperfooter: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    merrihelperheader: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    cinzelh1: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    cinzelh2: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    cinzelh3: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    cinzelh4: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    cinzelh5: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    cinzelh6: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    cinzelparagraph: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    cinzelhelperfooter: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
    cinzelhelperheader: {
      fontSize: string
      fontWeight: string | number
      fontFamily: string
      color: string
      textShadow?: string
      animation?: string
    }
  }
  alignment: {
    left: {
      textAlign: 'left'
    }
    center: {
      textAlign: 'center'
    }
    right: {
      textAlign: 'right'
    }
  }
  gutterBottom: {
    marginBottom: string
  }
  outline: {
    textStroke: string
    WebkitTextStroke: string
  }
}

export interface TypographyStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Typography variant
  variant?:
    | 'merrih1'
    | 'merrih2'
    | 'merrih3'
    | 'merrih4'
    | 'merrih5'
    | 'merrih6'
    | 'merriparagraph'
    | 'merrihelperfooter'
    | 'merrihelperheader'
    | 'cinzelh1'
    | 'cinzelh2'
    | 'cinzelh3'
    | 'cinzelh4'
    | 'cinzelh5'
    | 'cinzelh6'
    | 'cinzelparagraph'
    | 'cinzelhelperfooter'
    | 'cinzelhelperheader'

  // Text styling
  color?: string
  fontSize?: string
  fontWeight?: string | number
  fontFamily?: string
  fontStyle?: string
  textShadow?: string
  textAlign?: 'left' | 'center' | 'right'
  lineHeight?: string | number
  letterSpacing?: string

  // Layout and spacing
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
  padding?: string
  paddingTop?: string
  paddingBottom?: string
  paddingLeft?: string
  paddingRight?: string

  // States
  gutterBottom?: boolean
  outline?: boolean

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // Animations
  animation?: string
  animationDelay?: string

  // Dimensions
  width?: string
  maxWidth?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string

  // Position
  position?: string
}

export const typographyThemes: Record<
  'light' | 'dark' | 'sacred',
  TypographyTheme
> = {
  light: {
    base: {
      margin: '0',
      padding: '0',
      lineHeight: '1.6',
      letterSpacing: '0.01em',
      position: 'relative',
      transition: TRANSITIONS.medium,
    },
    variants: {
      merrih1: {
        fontSize: '2.25rem',
        fontWeight: '700',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(17, 24, 39)',
      },
      merrih2: {
        fontSize: '1.875rem',
        fontWeight: '600',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(17, 24, 39)',
      },
      merrih3: {
        fontSize: '1.5rem',
        fontWeight: '600',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(17, 24, 39)',
      },
      merrih4: {
        fontSize: '1.25rem',
        fontWeight: '600',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(17, 24, 39)',
      },
      merrih5: {
        fontSize: '1.125rem',
        fontWeight: '600',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(17, 24, 39)',
      },
      merrih6: {
        fontSize: '1rem',
        fontWeight: '600',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(17, 24, 39)',
      },
      merriparagraph: {
        fontSize: '1rem',
        fontWeight: '400',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(55, 65, 81)',
      },
      merrihelperfooter: {
        fontSize: '0.875rem',
        fontWeight: '400',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(107, 114, 128)',
      },
      merrihelperheader: {
        fontSize: '1rem',
        fontWeight: '500',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(17, 24, 39)',
      },
      cinzelh1: {
        fontSize: '2.25rem',
        fontWeight: '700',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(17, 24, 39)',
      },
      cinzelh2: {
        fontSize: '1.875rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(17, 24, 39)',
      },
      cinzelh3: {
        fontSize: '1.5rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(17, 24, 39)',
      },
      cinzelh4: {
        fontSize: '1.25rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(17, 24, 39)',
      },
      cinzelh5: {
        fontSize: '1.125rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(17, 24, 39)',
      },
      cinzelh6: {
        fontSize: '1rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(17, 24, 39)',
      },
      cinzelparagraph: {
        fontSize: '1rem',
        fontWeight: '400',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(55, 65, 81)',
      },
      cinzelhelperfooter: {
        fontSize: '0.875rem',
        fontWeight: '400',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(107, 114, 128)',
      },
      cinzelhelperheader: {
        fontSize: '1rem',
        fontWeight: '500',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(17, 24, 39)',
      },
    },
    alignment: {
      left: {
        textAlign: 'left',
      },
      center: {
        textAlign: 'center',
      },
      right: {
        textAlign: 'right',
      },
    },
    gutterBottom: {
      marginBottom: '1rem',
    },
    outline: {
      textStroke: '1px rgb(17, 24, 39)',
      WebkitTextStroke: '1px rgb(17, 24, 39)',
    },
  },
  dark: {
    base: {
      margin: '0',
      padding: '0',
      lineHeight: '1.6',
      letterSpacing: '0.01em',
      position: 'relative',
      transition: TRANSITIONS.medium,
    },
    variants: {
      merrih1: {
        fontSize: '2.25rem',
        fontWeight: '700',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(243, 244, 246)',
      },
      merrih2: {
        fontSize: '1.875rem',
        fontWeight: '600',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(243, 244, 246)',
      },
      merrih3: {
        fontSize: '1.5rem',
        fontWeight: '600',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(243, 244, 246)',
      },
      merrih4: {
        fontSize: '1.25rem',
        fontWeight: '600',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(243, 244, 246)',
      },
      merrih5: {
        fontSize: '1.125rem',
        fontWeight: '600',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(243, 244, 246)',
      },
      merrih6: {
        fontSize: '1rem',
        fontWeight: '600',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(243, 244, 246)',
      },
      merriparagraph: {
        fontSize: '1rem',
        fontWeight: '400',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(209, 213, 219)',
      },
      merrihelperfooter: {
        fontSize: '0.875rem',
        fontWeight: '400',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(156, 163, 175)',
      },
      merrihelperheader: {
        fontSize: '1rem',
        fontWeight: '500',
        fontFamily: 'Merriweather, serif',
        color: 'rgb(243, 244, 246)',
      },
      cinzelh1: {
        fontSize: '2.25rem',
        fontWeight: '700',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(243, 244, 246)',
      },
      cinzelh2: {
        fontSize: '1.875rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(243, 244, 246)',
      },
      cinzelh3: {
        fontSize: '1.5rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(243, 244, 246)',
      },
      cinzelh4: {
        fontSize: '1.25rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(243, 244, 246)',
      },
      cinzelh5: {
        fontSize: '1.125rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(243, 244, 246)',
      },
      cinzelh6: {
        fontSize: '1rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(243, 244, 246)',
      },
      cinzelparagraph: {
        fontSize: '1rem',
        fontWeight: '400',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(209, 213, 219)',
      },
      cinzelhelperfooter: {
        fontSize: '0.875rem',
        fontWeight: '400',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(156, 163, 175)',
      },
      cinzelhelperheader: {
        fontSize: '1rem',
        fontWeight: '500',
        fontFamily: 'Cinzel, serif',
        color: 'rgb(243, 244, 246)',
      },
    },
    alignment: {
      left: {
        textAlign: 'left',
      },
      center: {
        textAlign: 'center',
      },
      right: {
        textAlign: 'right',
      },
    },
    gutterBottom: {
      marginBottom: '1rem',
    },
    outline: {
      textStroke: '1px rgb(243, 244, 246)',
      WebkitTextStroke: '1px rgb(243, 244, 246)',
    },
  },
  sacred: {
    base: {
      margin: '0',
      padding: '0',
      lineHeight: '1.6',
      letterSpacing: '0.02em',
      position: 'relative',
      transition: TRANSITIONS.premium,
    },
    variants: {
      merrih1: {
        fontSize: '2.5rem',
        fontWeight: '700',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow:
          '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)',
        animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
      },
      merrih2: {
        fontSize: '2rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow:
          '0 0 15px rgba(255, 215, 0, 0.7), 0 0 30px rgba(255, 215, 0, 0.3)',
        animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
      },
      merrih3: {
        fontSize: '1.75rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow:
          '0 0 12px rgba(255, 215, 0, 0.6), 0 0 25px rgba(255, 215, 0, 0.2)',
        animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
      },
      merrih4: {
        fontSize: '1.5rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow:
          '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.2)',
        animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
      },
      merrih5: {
        fontSize: '1.25rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow:
          '0 0 8px rgba(255, 215, 0, 0.4), 0 0 16px rgba(255, 215, 0, 0.2)',
        animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
      },
      merrih6: {
        fontSize: '1.125rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow:
          '0 0 6px rgba(255, 215, 0, 0.3), 0 0 12px rgba(255, 215, 0, 0.1)',
        animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
      },
      merriparagraph: {
        fontSize: '1rem',
        fontWeight: '400',
        fontFamily: 'Cinzel, serif',
        color: 'rgba(245, 245, 220, 0.9)',
        textShadow: '0 0 5px rgba(255, 215, 0, 0.2)',
      },
      merrihelperfooter: {
        fontSize: '0.875rem',
        fontWeight: '400',
        fontFamily: 'Cinzel, serif',
        color: 'rgba(245, 245, 220, 0.7)',
        textShadow: '0 0 3px rgba(255, 215, 0, 0.1)',
      },
      merrihelperheader: {
        fontSize: '1rem',
        fontWeight: '500',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow: '0 0 5px rgba(255, 215, 0, 0.3)',
      },
      cinzelh1: {
        fontSize: '2.5rem',
        fontWeight: '700',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow:
          '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)',
        animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
      },
      cinzelh2: {
        fontSize: '2rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow:
          '0 0 15px rgba(255, 215, 0, 0.7), 0 0 30px rgba(255, 215, 0, 0.3)',
        animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
      },
      cinzelh3: {
        fontSize: '1.75rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow:
          '0 0 12px rgba(255, 215, 0, 0.6), 0 0 25px rgba(255, 215, 0, 0.2)',
        animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
      },
      cinzelh4: {
        fontSize: '1.5rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow:
          '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.2)',
        animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
      },
      cinzelh5: {
        fontSize: '1.25rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow:
          '0 0 8px rgba(255, 215, 0, 0.4), 0 0 16px rgba(255, 215, 0, 0.2)',
        animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
      },
      cinzelh6: {
        fontSize: '1.125rem',
        fontWeight: '600',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow:
          '0 0 6px rgba(255, 215, 0, 0.3), 0 0 12px rgba(255, 215, 0, 0.1)',
        animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
      },
      cinzelparagraph: {
        fontSize: '1rem',
        fontWeight: '400',
        fontFamily: 'Cinzel, serif',
        color: 'rgba(245, 245, 220, 0.9)',
        textShadow: '0 0 5px rgba(255, 215, 0, 0.2)',
      },
      cinzelhelperfooter: {
        fontSize: '0.875rem',
        fontWeight: '400',
        fontFamily: 'Cinzel, serif',
        color: 'rgba(245, 245, 220, 0.7)',
        textShadow: '0 0 3px rgba(255, 215, 0, 0.1)',
      },
      cinzelhelperheader: {
        fontSize: '1rem',
        fontWeight: '500',
        fontFamily: 'Cinzel, serif',
        color: '#FFD700',
        textShadow: '0 0 5px rgba(255, 215, 0, 0.3)',
      },
    },
    alignment: {
      left: {
        textAlign: 'left',
      },
      center: {
        textAlign: 'center',
      },
      right: {
        textAlign: 'right',
      },
    },
    gutterBottom: {
      marginBottom: '1rem',
    },
    outline: {
      textStroke: '1px #FFD700',
      WebkitTextStroke: '1px #FFD700',
    },
  },
}

// Helper function to get computed theme with custom style overrides
export const getTypographyTheme = (
  styles?: TypographyStyles
): TypographyTheme => {
  const theme = styles?.theme || 'sacred'
  const baseTheme = typographyThemes[theme]

  if (!styles) {
    return baseTheme
  }

  const variant = styles.variant || 'merriparagraph'
  const baseVariant = baseTheme.variants[variant]

  return {
    ...baseTheme,
    variants: {
      ...baseTheme.variants,
      [variant]: {
        ...baseVariant,
        fontSize: styles.fontSize || baseVariant.fontSize,
        fontWeight: styles.fontWeight || baseVariant.fontWeight,
        fontFamily: styles.fontFamily || baseVariant.fontFamily,
        color: styles.color || baseVariant.color,
        textShadow: styles.textShadow || baseVariant.textShadow,
        animation: baseVariant.animation,
      },
    },
  }
}

// Main style generator function
export const getTypographyStyles = (styles?: TypographyStyles) => {
  const themeConfig = getTypographyTheme(styles)
  const variant = styles?.variant || 'merriparagraph'
  const align = styles?.textAlign || 'left'

  const variantStyle = themeConfig.variants[variant]
  const alignmentStyle = themeConfig.alignment[align]

  const containerStyle: React.CSSProperties = {
    ...themeConfig.base,
    ...variantStyle,
    ...alignmentStyle,
    ...(styles?.gutterBottom && themeConfig.gutterBottom),
    ...(styles?.outline && themeConfig.outline),
    // Text styling overrides
    fontStyle: styles?.fontStyle,
    // Layout styling
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    padding: styles?.padding,
    paddingTop: styles?.paddingTop,
    paddingBottom: styles?.paddingBottom,
    paddingLeft: styles?.paddingLeft,
    paddingRight: styles?.paddingRight,
    // Dimensions
    width: styles?.width,
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    height: styles?.height,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    // Position
    position: styles?.position as any,
    // Transitions
    transition: styles?.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : themeConfig.base.transition,
    // Animations - avoid mixing shorthand and longhand properties
    ...(styles?.animationDelay
      ? {
          // If animationDelay is provided, use longhand properties only
          animationName: variantStyle.animation ? 'sacredTextGlow' : undefined,
          animationDuration: variantStyle.animation ? '3s' : undefined,
          animationTimingFunction: variantStyle.animation
            ? 'ease-in-out'
            : undefined,
          animationIterationCount: variantStyle.animation
            ? 'infinite'
            : undefined,
          animationDirection: variantStyle.animation ? 'alternate' : undefined,
          animationDelay: styles.animationDelay,
        }
      : {
          // If no animationDelay, use shorthand or custom animation
          animation: styles?.animation || variantStyle.animation,
        }),
  }

  return {
    container: containerStyle,
  }
}
