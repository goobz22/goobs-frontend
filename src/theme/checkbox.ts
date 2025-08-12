// --------------------------------------------------------------------------
// CHECKBOX THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface CheckboxTheme {
  wrapper: {
    transition: string
  }
  container: {
    width: string
    height: string
  }
  box: {
    borderWidth: string
    borderStyle: string
    borderColor: string
    borderRadius: string
    backgroundColor: string
    backdropFilter: string
    boxShadow: string
    backgroundImage?: string
    transition: string
  }
  boxHover: {
    backgroundColor: string
    borderWidth?: string
    borderStyle?: string
    borderColor: string
    transform: string
    boxShadow: string
    backgroundImage?: string
  }
  boxChecked: {
    backgroundColor: string
    borderWidth?: string
    borderStyle?: string
    borderColor: string
    boxShadow: string
    backgroundImage?: string
  }
  boxIndeterminate: {
    backgroundColor: string
    borderWidth?: string
    borderStyle?: string
    borderColor: string
    boxShadow: string
    backgroundImage?: string
  }
  boxDisabled: {
    backgroundColor: string
    borderWidth?: string
    borderStyle?: string
    borderColor: string
    transform: string
    boxShadow: string
  }
  icon: {
    color: string
    filter?: string
    transform: string
    transition: string
  }
  iconVisible: {
    opacity: number
    transform: string
    filter?: string
  }
  iconDisabled: {
    color: string
    filter?: string
  }
}

export interface CheckboxStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  width?: string
  height?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  backgroundColor?: string
  backdropFilter?: string
  boxShadow?: string
  backgroundImage?: string

  // Hover states
  hoverBackgroundColor?: string
  hoverBorderColor?: string
  hoverBoxShadow?: string
  hoverTransform?: string
  hoverBackgroundImage?: string

  // Checked states
  checkedBackgroundColor?: string
  checkedBorderColor?: string
  checkedBoxShadow?: string
  checkedBackgroundImage?: string

  // Indeterminate states
  indeterminateBackgroundColor?: string
  indeterminateBorderColor?: string
  indeterminateBoxShadow?: string
  indeterminateBackgroundImage?: string

  // Disabled states
  disabledBackgroundColor?: string
  disabledBorderColor?: string
  disabledBoxShadow?: string
  disabledTransform?: string

  // Icon styling
  iconColor?: string
  iconFilter?: string
  iconTransform?: string
  iconVisibleOpacity?: number
  iconVisibleTransform?: string
  iconVisibleFilter?: string
  iconDisabledColor?: string
  iconDisabledFilter?: string

  // Layout and spacing
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  disabled?: boolean
  outline?: boolean
}

export const checkboxThemes: Record<
  'light' | 'dark' | 'sacred',
  CheckboxTheme
> = {
  light: {
    wrapper: {
      transition: TRANSITIONS.medium,
    },
    container: {
      width: '24px',
      height: '24px',
    },
    box: {
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'rgb(59, 130, 246)',
      borderRadius: '4px',
      backgroundColor: 'rgba(249, 250, 251, 0.9)',
      backdropFilter: 'blur(4px)',
      boxShadow: SHADOWS.light.small,
      transition: TRANSITIONS.medium,
    },
    boxHover: {
      backgroundColor: 'rgba(239, 246, 255, 0.8)',
      borderColor: 'rgb(37, 99, 235)',
      transform: 'scale(1.05)',
      boxShadow:
        '0 4px 12px rgba(59, 130, 246, 0.2), 0 2px 6px rgba(59, 130, 246, 0.1)',
    },
    boxChecked: {
      backgroundColor: 'rgb(59, 130, 246)',
      borderColor: 'transparent',
      boxShadow:
        '0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 6px rgba(59, 130, 246, 0.2)',
    },
    boxIndeterminate: {
      backgroundColor: 'rgb(59, 130, 246)',
      borderColor: 'transparent',
      boxShadow:
        '0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 6px rgba(59, 130, 246, 0.2)',
    },
    boxDisabled: {
      backgroundColor: 'rgba(249, 250, 251, 0.5)',
      borderColor: 'rgb(156, 163, 175)',
      transform: 'none',
      boxShadow: 'none',
    },
    icon: {
      color: 'white',
      transform: 'scale(0.8) translate(2px, 1px)',
      transition: TRANSITIONS.medium,
    },
    iconVisible: {
      opacity: 1,
      transform: 'scale(1) translate(2px, 1px)',
    },
    iconDisabled: {
      color: 'rgb(156, 163, 175)',
    },
  },
  dark: {
    wrapper: {
      transition: TRANSITIONS.medium,
    },
    container: {
      width: '24px',
      height: '24px',
    },
    box: {
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'rgb(96, 165, 250)',
      borderRadius: '4px',
      backgroundColor: 'rgba(31, 41, 55, 0.9)',
      backdropFilter: 'blur(4px)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
      transition: TRANSITIONS.medium,
    },
    boxHover: {
      backgroundColor: 'rgba(30, 58, 138, 0.3)',
      borderColor: 'rgb(59, 130, 246)',
      transform: 'scale(1.05)',
      boxShadow:
        '0 4px 12px rgba(96, 165, 250, 0.3), 0 2px 6px rgba(96, 165, 250, 0.2)',
    },
    boxChecked: {
      backgroundColor: 'rgb(96, 165, 250)',
      borderColor: 'transparent',
      boxShadow:
        '0 4px 12px rgba(96, 165, 250, 0.4), 0 2px 6px rgba(96, 165, 250, 0.3)',
    },
    boxIndeterminate: {
      backgroundColor: 'rgb(96, 165, 250)',
      borderColor: 'transparent',
      boxShadow:
        '0 4px 12px rgba(96, 165, 250, 0.4), 0 2px 6px rgba(96, 165, 250, 0.3)',
    },
    boxDisabled: {
      backgroundColor: 'rgba(17, 24, 39, 0.5)',
      borderColor: 'rgb(75, 85, 99)',
      transform: 'none',
      boxShadow: 'none',
    },
    icon: {
      color: 'white',
      transform: 'scale(0.8) translate(2px, 1px)',
      transition: TRANSITIONS.medium,
    },
    iconVisible: {
      opacity: 1,
      transform: 'scale(1) translate(2px, 1px)',
    },
    iconDisabled: {
      color: 'rgb(75, 85, 99)',
    },
  },
  sacred: {
    wrapper: {
      transition: TRANSITIONS.premium,
    },
    container: {
      width: '28px',
      height: '28px',
    },
    box: {
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'rgba(255, 215, 0, 0.4)',
      borderRadius: '6px',
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      backdropFilter: 'blur(8px)',
      boxShadow: SHADOWS.sacred.small,
      backgroundImage:
        'radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 50%)',
      transition: TRANSITIONS.premium,
    },
    boxHover: {
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      borderColor: 'rgba(255, 215, 0, 0.8)',
      transform: 'scale(1.1)',
      boxShadow: SHADOWS.sacred.medium,
      backgroundImage:
        'radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
    },
    boxChecked: {
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      borderColor: '#FFD700',
      boxShadow: SHADOWS.sacred.large,
      backgroundImage: `
        linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),
        radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, transparent 50%)
      `,
    },
    boxIndeterminate: {
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      borderColor: '#FFD700',
      boxShadow: SHADOWS.sacred.large,
      backgroundImage: `
        linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),
        radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, transparent 50%)
      `,
    },
    boxDisabled: {
      backgroundColor: 'rgba(10, 10, 10, 0.6)',
      borderColor: 'rgba(255, 215, 0, 0.2)',
      transform: 'none',
      boxShadow: 'none',
    },
    icon: {
      color: '#FFD700',
      filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
      transform: 'scale(0.8) rotate(-10deg) translate(2px, 1px)',
      transition: TRANSITIONS.premium,
    },
    iconVisible: {
      opacity: 1,
      transform: 'scale(1) rotate(0deg) translate(2px, 1px)',
      filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
    },
    iconDisabled: {
      color: 'rgba(255, 215, 0, 0.3)',
      filter: 'none',
    },
  },
}

// Helper function to get computed theme with custom style overrides
export const getCheckboxTheme = (styles?: CheckboxStyles): CheckboxTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = checkboxThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    wrapper: {
      transition: styles.transitionDuration
        ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
        : baseTheme.wrapper.transition,
    },
    container: {
      width: styles.width || baseTheme.container.width,
      height: styles.height || baseTheme.container.height,
    },
    box: {
      borderWidth: styles.borderWidth || baseTheme.box.borderWidth,
      borderStyle: styles.borderColor ? 'solid' : baseTheme.box.borderStyle,
      borderColor: styles.borderColor || baseTheme.box.borderColor,
      borderRadius: styles.borderRadius || baseTheme.box.borderRadius,
      backgroundColor: styles.backgroundColor || baseTheme.box.backgroundColor,
      backdropFilter: styles.backdropFilter || baseTheme.box.backdropFilter,
      boxShadow: styles.boxShadow || baseTheme.box.boxShadow,
      transition: baseTheme.box.transition,
      ...((styles.backgroundImage ?? baseTheme.box.backgroundImage)
        ? {
            backgroundImage: (styles.backgroundImage ??
              baseTheme.box.backgroundImage) as string,
          }
        : {}),
    },
    boxHover: {
      backgroundColor:
        styles.hoverBackgroundColor || baseTheme.boxHover.backgroundColor,
      borderColor: styles.hoverBorderColor || baseTheme.boxHover.borderColor,
      transform: styles.hoverTransform || baseTheme.boxHover.transform,
      boxShadow: styles.hoverBoxShadow || baseTheme.boxHover.boxShadow,
      ...((styles.hoverBackgroundImage ?? baseTheme.boxHover.backgroundImage)
        ? {
            backgroundImage: (styles.hoverBackgroundImage ??
              baseTheme.boxHover.backgroundImage) as string,
          }
        : {}),
    },
    boxChecked: {
      backgroundColor:
        styles.checkedBackgroundColor || baseTheme.boxChecked.backgroundColor,
      borderColor:
        styles.checkedBorderColor || baseTheme.boxChecked.borderColor,
      boxShadow: styles.checkedBoxShadow || baseTheme.boxChecked.boxShadow,
      ...((styles.checkedBackgroundImage ??
      baseTheme.boxChecked.backgroundImage)
        ? {
            backgroundImage: (styles.checkedBackgroundImage ??
              baseTheme.boxChecked.backgroundImage) as string,
          }
        : {}),
    },
    boxIndeterminate: {
      backgroundColor:
        styles.indeterminateBackgroundColor ||
        baseTheme.boxIndeterminate.backgroundColor,
      borderColor:
        styles.indeterminateBorderColor ||
        baseTheme.boxIndeterminate.borderColor,
      boxShadow:
        styles.indeterminateBoxShadow || baseTheme.boxIndeterminate.boxShadow,
      ...((styles.indeterminateBackgroundImage ??
      baseTheme.boxIndeterminate.backgroundImage)
        ? {
            backgroundImage: (styles.indeterminateBackgroundImage ??
              baseTheme.boxIndeterminate.backgroundImage) as string,
          }
        : {}),
    },
    boxDisabled: {
      backgroundColor:
        styles.disabledBackgroundColor || baseTheme.boxDisabled.backgroundColor,
      borderColor:
        styles.disabledBorderColor || baseTheme.boxDisabled.borderColor,
      transform: styles.disabledTransform || baseTheme.boxDisabled.transform,
      boxShadow: styles.disabledBoxShadow || baseTheme.boxDisabled.boxShadow,
    },
    icon: {
      color: styles.iconColor || baseTheme.icon.color,
      transform: styles.iconTransform || baseTheme.icon.transform,
      transition: baseTheme.icon.transition,
      ...((styles.iconFilter ?? baseTheme.icon.filter)
        ? { filter: (styles.iconFilter ?? baseTheme.icon.filter) as string }
        : {}),
    },
    iconVisible: {
      opacity: styles.iconVisibleOpacity ?? baseTheme.iconVisible.opacity,
      transform: styles.iconVisibleTransform || baseTheme.iconVisible.transform,
      ...((styles.iconVisibleFilter ?? baseTheme.iconVisible.filter)
        ? {
            filter: (styles.iconVisibleFilter ??
              baseTheme.iconVisible.filter) as string,
          }
        : {}),
    },
    iconDisabled: {
      color: styles.iconDisabledColor || baseTheme.iconDisabled.color,
      ...((styles.iconDisabledFilter ?? baseTheme.iconDisabled.filter)
        ? {
            filter: (styles.iconDisabledFilter ??
              baseTheme.iconDisabled.filter) as string,
          }
        : {}),
    },
  }
}

// Main style generator function
export const getCheckboxStyles = (
  styles?: CheckboxStyles,
  isHovered?: boolean,
  isChecked?: boolean,
  isIndeterminate?: boolean,
  isDisabled?: boolean
) => {
  const themeConfig = getCheckboxTheme(styles)

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: themeConfig.wrapper.transition,
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: themeConfig.container.width,
    height: themeConfig.container.height,
    flexShrink: 0,
  }

  const inputStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    margin: 0,
    padding: 0,
    zIndex: 3,
  }

  const boxStyle: React.CSSProperties = {
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    borderWidth: themeConfig.box.borderWidth,
    borderStyle: themeConfig.box.borderStyle,
    borderColor: themeConfig.box.borderColor,
    borderRadius: themeConfig.box.borderRadius,
    transition: themeConfig.box.transition,
    backgroundColor: themeConfig.box.backgroundColor,
    backdropFilter: themeConfig.box.backdropFilter,
    boxShadow: themeConfig.box.boxShadow,
    backgroundImage: themeConfig.box.backgroundImage,
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: 1,
    // Apply state-based styling
    ...(isHovered &&
      !isDisabled && {
        backgroundColor: themeConfig.boxHover.backgroundColor,
        borderWidth:
          themeConfig.boxHover.borderWidth || themeConfig.box.borderWidth,
        borderStyle:
          themeConfig.boxHover.borderStyle || themeConfig.box.borderStyle,
        borderColor: themeConfig.boxHover.borderColor,
        transform: themeConfig.boxHover.transform,
        boxShadow: themeConfig.boxHover.boxShadow,
        backgroundImage: themeConfig.boxHover.backgroundImage,
      }),
    ...(isChecked && {
      backgroundColor: themeConfig.boxChecked.backgroundColor,
      borderWidth:
        themeConfig.boxChecked.borderWidth || themeConfig.box.borderWidth,
      borderStyle:
        themeConfig.boxChecked.borderStyle || themeConfig.box.borderStyle,
      borderColor: themeConfig.boxChecked.borderColor,
      boxShadow: themeConfig.boxChecked.boxShadow,
      backgroundImage: themeConfig.boxChecked.backgroundImage,
    }),
    ...(isIndeterminate && {
      backgroundColor: themeConfig.boxIndeterminate.backgroundColor,
      borderWidth:
        themeConfig.boxIndeterminate.borderWidth || themeConfig.box.borderWidth,
      borderStyle:
        themeConfig.boxIndeterminate.borderStyle || themeConfig.box.borderStyle,
      borderColor: themeConfig.boxIndeterminate.borderColor,
      boxShadow: themeConfig.boxIndeterminate.boxShadow,
      backgroundImage: themeConfig.boxIndeterminate.backgroundImage,
    }),
    ...(isDisabled && {
      backgroundColor: themeConfig.boxDisabled.backgroundColor,
      borderWidth:
        themeConfig.boxDisabled.borderWidth || themeConfig.box.borderWidth,
      borderStyle:
        themeConfig.boxDisabled.borderStyle || themeConfig.box.borderStyle,
      borderColor: themeConfig.boxDisabled.borderColor,
      transform: themeConfig.boxDisabled.transform,
      boxShadow: themeConfig.boxDisabled.boxShadow,
    }),
    // Apply outline override
    ...(styles?.outline === false && {
      borderWidth: '0',
      borderStyle: 'none',
      borderColor: 'transparent',
      boxShadow: 'none',
    }),
  }

  const iconStyle: React.CSSProperties = {
    pointerEvents: 'none',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    color: themeConfig.icon.color,
    opacity: 0,
    transition: themeConfig.icon.transition,
    transform: themeConfig.icon.transform,
    filter: themeConfig.icon.filter,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Apply state-based styling
    ...((isChecked || isIndeterminate) && {
      opacity: themeConfig.iconVisible.opacity,
      transform: themeConfig.iconVisible.transform,
      filter: themeConfig.iconVisible.filter,
    }),
    ...(isDisabled && {
      color: themeConfig.iconDisabled.color,
      filter: themeConfig.iconDisabled.filter,
    }),
    // Adjust positioning when no outline
    ...(styles?.outline === false && {
      transform:
        styles?.theme === 'sacred'
          ? isChecked || isIndeterminate
            ? 'scale(1) rotate(0deg) translate(0px, 1px)'
            : 'scale(0.8) rotate(-10deg) translate(0px, 1px)'
          : isChecked || isIndeterminate
            ? 'scale(1) translate(0px, 1px)'
            : 'scale(0.8) translate(0px, 1px)',
    }),
  }

  return {
    wrapper: wrapperStyle,
    container: containerStyle,
    input: inputStyle,
    box: boxStyle,
    icon: iconStyle,
  }
}
