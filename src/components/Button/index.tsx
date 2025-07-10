// src/components/Button/index.tsx
'use client'
import * as Agnostic from '../../framework-agnostic'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
]

interface IconProps {
  style?: Agnostic.CSSProperties
  className?: string
}

export interface CustomButtonProps
  extends Omit<Agnostic.ComponentProps, 'style'> {
  text?: string
  backgroundcolor?: string
  fontcolor?: string
  width?: string
  height?: string
  disableButton?: 'true' | 'false'
  icon?:
    | Agnostic.VirtualElement
    | ((props: IconProps) => Agnostic.VirtualElement)
    | string
  iconcolor?: string
  iconsize?: string
  iconlocation?: 'left' | 'right' | 'above'
  fontlocation?: 'left' | 'center' | 'right'
  sacredtheme?: boolean
  outline?: boolean
  onClick?: (event: Agnostic.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
  style?: Agnostic.CSSProperties
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '10px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    cursor: 'pointer',
    fontFamily: '"Inter", sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    letterSpacing: '-0.025em',
    color: 'rgb(55, 65, 81)',
    textAlign: 'center',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    padding: '12px 24px',
    minHeight: '44px',
    gap: '8px',
  } as Agnostic.CSSProperties,

  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  } as Agnostic.CSSProperties,

  containerHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(239, 246, 255, 0.95)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    color: 'rgb(29, 78, 216)',
  } as Agnostic.CSSProperties,

  containerActive: {
    transform: 'translateY(0px)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
  } as Agnostic.CSSProperties,

  containerDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    color: 'rgb(156, 163, 175)',
    transform: 'none',
    boxShadow: 'none',
  } as Agnostic.CSSProperties,

  containerIconOnly: {
    width: '44px',
    height: '44px',
    padding: '10px',
    borderRadius: '10px',
    justifyContent: 'center',
  } as Agnostic.CSSProperties,

  containerIconAbove: {
    flexDirection: 'column',
    padding: '16px',
    minHeight: '80px',
    gap: '8px',
  } as Agnostic.CSSProperties,

  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background:
      'linear-gradient(180deg, rgb(59, 130, 246) 0%, rgb(147, 197, 253) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    borderRadius: '2px 0 0 2px',
  } as Agnostic.CSSProperties,

  accentVisible: {
    opacity: 1,
  } as Agnostic.CSSProperties,

  shimmer: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
    transition: 'left 0.5s ease',
  } as Agnostic.CSSProperties,

  shimmerActive: {
    left: '100%',
  } as Agnostic.CSSProperties,

  text: {
    position: 'relative',
    zIndex: 1,
    lineHeight: 1,
  } as Agnostic.CSSProperties,

  icon: {
    position: 'relative',
    zIndex: 1,
    transition: 'all 0.3s ease',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
  } as Agnostic.CSSProperties,

  iconHover: {
    transform: 'scale(1.05)',
    filter: 'drop-shadow(0 2px 4px rgba(29, 78, 216, 0.2))',
  } as Agnostic.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s ease',
    borderRadius: '12px',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    backdropFilter: 'blur(8px)',
    boxShadow:
      '0 0 20px rgba(255, 215, 0, 0.2), 0 0 40px rgba(255, 215, 0, 0.1)',
    cursor: 'pointer',
    fontFamily: '"Cinzel", serif',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'rgba(255, 215, 0, 0.9)',
    textAlign: 'center',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    padding: '16px 32px',
    minHeight: '52px',
    gap: '12px',
    backgroundImage: `
      radial-gradient(circle at top right, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.02) 0%, transparent 50%)
    `,
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
  } as Agnostic.CSSProperties,

  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
  } as Agnostic.CSSProperties,

  containerHover: {
    transform: 'translateY(-2px)',
    borderColor: 'rgba(255, 215, 0, 0.8)',
    boxShadow:
      '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)',
    color: '#FFD700',
    textShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
    backgroundImage: `
      linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),
      radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
    `,
  } as Agnostic.CSSProperties,

  containerActive: {
    transform: 'translateY(-1px)',
    boxShadow:
      '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.15)',
  } as Agnostic.CSSProperties,

  containerDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    color: 'rgba(255, 215, 0, 0.3)',
    borderColor: 'rgba(255, 215, 0, 0.2)',
    transform: 'none',
    boxShadow: 'none',
    textShadow: 'none',
  } as Agnostic.CSSProperties,

  containerIconOnly: {
    width: '52px',
    height: '52px',
    padding: '12px',
    borderRadius: '12px',
    justifyContent: 'center',
  } as Agnostic.CSSProperties,

  containerIconAbove: {
    flexDirection: 'column',
    padding: '20px',
    minHeight: '90px',
    gap: '12px',
  } as Agnostic.CSSProperties,

  text: {
    position: 'relative',
    zIndex: 1,
    lineHeight: 1,
  } as Agnostic.CSSProperties,

  icon: {
    position: 'relative',
    zIndex: 1,
    transition: 'all 0.3s ease',
    filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
  } as Agnostic.CSSProperties,

  iconHover: {
    transform: 'scale(1.1) rotate(5deg)',
    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
  } as Agnostic.CSSProperties,

  glyph: {
    position: 'absolute',
    fontSize: '14px',
    color: 'rgba(255, 215, 0, 0.3)',
    transition: 'all 0.3s ease',
    opacity: 0,
    pointerEvents: 'none',
  } as Agnostic.CSSProperties,

  glyphLeft: {
    left: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
  } as Agnostic.CSSProperties,

  glyphRight: {
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
  } as Agnostic.CSSProperties,

  glyphVisible: {
    opacity: 1,
  } as Agnostic.CSSProperties,

  glyphRotate: {
    animation: 'sacredGlyphRotate 20s linear infinite',
  } as Agnostic.CSSProperties,

  glyphRotateReverse: {
    animation: 'sacredGlyphRotateReverse 20s linear infinite',
  } as Agnostic.CSSProperties,
}

function CustomButtonCore(
  props: CustomButtonProps
): Agnostic.VirtualElement | null {
  const {
    text,
    onClick,
    fontcolor,
    backgroundcolor,
    width,
    height,
    disableButton,
    icon,
    iconcolor,
    iconsize,
    iconlocation = 'left',
    fontlocation = 'center',
    disabled,
    className,
    sacredtheme = false,
    outline = true,
    style,
    ...restProps
  } = props

  const isHovered = Agnostic.useSignal(false)
  const isActive = Agnostic.useSignal(false)
  const leftGlyph = Agnostic.useSignal(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )
  const rightGlyph = Agnostic.useSignal(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )

  const isReallyDisabled = disabled || disableButton === 'true'
  const isIconOnly = !!icon && !text
  const isIconAbove = iconlocation === 'above'

  // CSS keyframes for sacred animations
  Agnostic.useEffect(() => {
    if (sacredtheme) {
      const styleSheet = document.styleSheets[0]
      if (styleSheet) {
        const keyframes = `
          @keyframes sacredGlyphRotate {
            from { transform: translateY(-50%) rotate(0deg); }
            to { transform: translateY(-50%) rotate(360deg); }
          }
          @keyframes sacredGlyphRotateReverse {
            from { transform: translateY(-50%) rotate(360deg); }
            to { transform: translateY(-50%) rotate(0deg); }
          }
        `
        try {
          styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
        } catch {
          // Keyframes might already exist
        }
      }
    }
  }, [])

  const handleButtonClick = (event: Agnostic.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (!isReallyDisabled && onClick) {
      onClick(event)
    }
  }

  const handleMouseDown = () => (isActive.value = true)
  const handleMouseUp = () => (isActive.value = false)
  const handleMouseLeave = () => {
    isHovered.value = false
    isActive.value = false
  }

  // Process icon with custom styling
  let IconComponent: Agnostic.VirtualElement | null = null
  if (icon) {
    const iconStyle = {
      color: isReallyDisabled
        ? sacredtheme
          ? 'rgba(255, 215, 0, 0.3)'
          : 'rgb(156, 163, 175)'
        : iconcolor || (sacredtheme ? '#FFD700' : 'currentColor'),
      fontSize: iconsize || '20px',
      minWidth: iconsize || '20px',
      minHeight: iconsize || '20px',
      margin: 0,
      ...(sacredtheme ? sacredStyles.icon : premiumStyles.icon),
      ...(isHovered.value &&
        !isReallyDisabled &&
        (sacredtheme ? sacredStyles.iconHover : premiumStyles.iconHover)),
    }

    if (typeof icon === 'object' && '__vnode' in icon) {
      // Framework-agnostic VirtualElement - pass type without casting
      IconComponent = Agnostic.createElement(icon.type, {
        ...icon.props,
        style: {
          ...(icon.props?.style || {}),
          ...(iconStyle as Agnostic.CSSProperties),
        },
      })
    } else if (typeof icon === 'function') {
      // Framework-agnostic component function
      IconComponent = icon({
        style: iconStyle as Agnostic.CSSProperties,
      })
    } else {
      // Fallback - treat as string
      IconComponent = Agnostic.createElement(
        'span',
        {
          style: iconStyle as Agnostic.CSSProperties,
        },
        String(icon)
      )
    }
  }

  if (sacredtheme) {
    const containerStyle = {
      ...sacredStyles.container,
      ...(!outline && sacredStyles.containerNoOutline),
      ...(isIconOnly && sacredStyles.containerIconOnly),
      ...(isIconAbove && sacredStyles.containerIconAbove),
      ...(isHovered.value && !isReallyDisabled && sacredStyles.containerHover),
      ...(isActive.value && !isReallyDisabled && sacredStyles.containerActive),
      ...(isReallyDisabled && sacredStyles.containerDisabled),
      ...(width && { width }),
      ...(height && { height }),
      ...(backgroundcolor &&
        !isReallyDisabled && { backgroundColor: backgroundcolor }),
      ...((style as Agnostic.CSSProperties) || {}),
    }

    const textStyle = {
      ...sacredStyles.text,
      color: isReallyDisabled
        ? 'rgba(255, 215, 0, 0.3)'
        : fontcolor || 'rgba(255, 215, 0, 0.9)',
      textAlign: fontlocation,
    }

    const justifyContent =
      fontlocation === 'left'
        ? 'flex-start'
        : fontlocation === 'right'
          ? 'flex-end'
          : 'center'

    // Create properly typed children array
    const children: (Agnostic.VirtualElement | string | null)[] = []

    // Add left glyph
    if (!isIconOnly) {
      children.push(
        Agnostic.createElement(
          'div',
          {
            style: {
              ...sacredStyles.glyph,
              ...sacredStyles.glyphLeft,
              ...(isHovered.value &&
                !isReallyDisabled &&
                sacredStyles.glyphVisible),
              ...(isHovered.value &&
                !isReallyDisabled &&
                sacredStyles.glyphRotate),
            },
          },
          leftGlyph.value
        )
      )
    }

    // Add right glyph
    if (!isIconOnly) {
      children.push(
        Agnostic.createElement(
          'div',
          {
            style: {
              ...sacredStyles.glyph,
              ...sacredStyles.glyphRight,
              ...(isHovered.value &&
                !isReallyDisabled &&
                sacredStyles.glyphVisible),
              ...(isHovered.value &&
                !isReallyDisabled &&
                sacredStyles.glyphRotateReverse),
            },
          },
          rightGlyph.value
        )
      )
    }

    // Add icon above
    if (isIconAbove && IconComponent) {
      children.push(IconComponent)
    }

    // Add left icon
    if (iconlocation === 'left' && !isIconAbove && IconComponent) {
      children.push(IconComponent)
    }

    // Add text
    if (text) {
      children.push(Agnostic.createElement('span', { style: textStyle }, text))
    }

    // Add right icon
    if (iconlocation === 'right' && !isIconAbove && IconComponent) {
      children.push(IconComponent)
    }

    return Agnostic.createElement(
      'button',
      {
        ...restProps,
        onClick: handleButtonClick,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onMouseEnter: () => (isHovered.value = true),
        onMouseLeave: handleMouseLeave,
        disabled: isReallyDisabled,
        className: className,
        style: {
          ...containerStyle,
          justifyContent: isIconAbove ? 'center' : justifyContent,
          flexDirection: isIconAbove ? 'column' : 'row',
        },
        'data-testid': isReallyDisabled ? 'disabled-button' : 'button',
      },
      ...children
    )
  }

  // Premium theme
  const containerStyle = {
    ...premiumStyles.container,
    ...(!outline && premiumStyles.containerNoOutline),
    ...(isIconOnly && premiumStyles.containerIconOnly),
    ...(isIconAbove && premiumStyles.containerIconAbove),
    ...(isHovered.value && !isReallyDisabled && premiumStyles.containerHover),
    ...(isActive.value && !isReallyDisabled && premiumStyles.containerActive),
    ...(isReallyDisabled && premiumStyles.containerDisabled),
    ...(width && { width }),
    ...(height && { height }),
    ...(backgroundcolor &&
      !isReallyDisabled && { backgroundColor: backgroundcolor }),
    ...((style as Agnostic.CSSProperties) || {}),
  }

  const textStyle = {
    ...premiumStyles.text,
    color: isReallyDisabled
      ? 'rgb(156, 163, 175)'
      : fontcolor || 'currentColor',
    textAlign: fontlocation,
  }

  const justifyContent =
    fontlocation === 'left'
      ? 'flex-start'
      : fontlocation === 'right'
        ? 'flex-end'
        : 'center'

  // Create properly typed children array
  const children: (Agnostic.VirtualElement | string | null)[] = []

  // Add accent
  if (outline) {
    children.push(
      Agnostic.createElement('div', {
        style: {
          ...premiumStyles.accent,
          ...(isHovered.value &&
            !isReallyDisabled &&
            premiumStyles.accentVisible),
        },
      })
    )
  }

  // Add shimmer
  if (isHovered.value && !isReallyDisabled) {
    children.push(
      Agnostic.createElement('div', {
        style: {
          ...premiumStyles.shimmer,
          ...premiumStyles.shimmerActive,
        },
      })
    )
  }

  // Add icon above
  if (isIconAbove && IconComponent) {
    children.push(IconComponent)
  }

  // Add left icon
  if (iconlocation === 'left' && !isIconAbove && IconComponent) {
    children.push(IconComponent)
  }

  // Add text
  if (text) {
    children.push(Agnostic.createElement('span', { style: textStyle }, text))
  }

  // Add right icon
  if (iconlocation === 'right' && !isIconAbove && IconComponent) {
    children.push(IconComponent)
  }

  return Agnostic.createElement(
    'button',
    {
      ...restProps,
      onClick: handleButtonClick,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseEnter: () => (isHovered.value = true),
      onMouseLeave: handleMouseLeave,
      disabled: isReallyDisabled,
      className: className,
      style: {
        ...containerStyle,
        justifyContent: isIconAbove ? 'center' : justifyContent,
        flexDirection: isIconAbove ? 'column' : 'row',
      },
      'data-testid': isReallyDisabled ? 'disabled-button' : 'button',
    },
    ...children
  )
}

// Export the framework-agnostic component directly
const CustomButton = CustomButtonCore

export default CustomButton
