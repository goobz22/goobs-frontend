/**
 * @fileoverview Defines the AppBar component, a top navigation bar with theming support.
 * It supports light, dark, and sacred themes with extensive customization options.
 */
'use client'

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  type FC,
  type ReactNode,
} from 'react'
import { getAppBarStyles, type AppBarStyles } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface AppBarProps {
  /** Content displayed in the app bar (typically navigation, search, actions) */
  children?: ReactNode
  /** Position of the app bar */
  position?: 'static' | 'fixed' | 'absolute' | 'sticky' | 'relative'
  /** Whether the app bar should have elevation (box shadow) */
  elevated?: boolean
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: AppBarStyles
  /** Additional CSS class name */
  className?: string
  /** Callback fired when the app bar is clicked */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

// --------------------------------------------------------------------------
// SACRED THEME COMPONENTS
// --------------------------------------------------------------------------

const SacredGlyphs: FC<{
  isHovered: boolean
  isDisabled: boolean
}> = () => {
  return null
}

const SacredShimmer: FC = () => {
  const shimmerStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      top: '0',
      left: '0',
      right: '0',
      height: '1px',
      background:
        'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent)',
      backgroundSize: '200% 100%',
      animation: 'sacredShimmer 3s linear infinite',
      zIndex: 3,
    }),
    []
  )

  return <div style={shimmerStyle} />
}

// --------------------------------------------------------------------------
// MAIN APPBAR COMPONENT
// --------------------------------------------------------------------------

/**
 * A top navigation bar component with comprehensive theming support.
 */
const AppBar: FC<AppBarProps> = props => {
  const {
    children,
    position = 'static',
    elevated = true,
    styles,
    className,
    onClick,
    ...rest
  } = props

  const [isHovered, setIsHovered] = useState(false)

  const isDisabled = styles?.disabled
  const isSacredTheme = styles?.theme === 'sacred'

  const computedStyles = useMemo(() => {
    const finalStyles = {
      ...styles,
      // Only use default position if not provided in styles
      position: styles?.position || position,
      elevated,
    }
    return getAppBarStyles(finalStyles, isDisabled)
  }, [styles, position, elevated, isDisabled])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isDisabled && onClick) {
        onClick(event)
      }
    },
    [isDisabled, onClick]
  )

  // Inject keyframes for sacred theme animations
  useEffect(() => {
    if (isSacredTheme && typeof document !== 'undefined') {
      const styleElement = document.createElement('style')
      styleElement.textContent = `
        @keyframes sacredFloat {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          33% { transform: translateY(-3px); opacity: 0.5; }
          66% { transform: translateY(1px); opacity: 0.4; }
          100% { transform: translateY(0px); opacity: 0.3; }
        }

        @keyframes sacredGlow {
          0% { 
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
            border-color: rgba(255, 215, 0, 0.5);
          }
          50% { 
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
            border-color: rgba(255, 215, 0, 0.8);
          }
          100% { 
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
            border-color: rgba(255, 215, 0, 0.5);
          }
        }

        @keyframes sacredShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `

      if (!document.head.querySelector('style[data-appbar-keyframes="true"]')) {
        styleElement.setAttribute('data-appbar-keyframes', 'true')
        document.head.appendChild(styleElement)
      }

      return () => {
        if (document.head.contains(styleElement)) {
          document.head.removeChild(styleElement)
        }
      }
    }
  }, [isSacredTheme])

  return (
    <div
      style={computedStyles.container}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="banner"
      data-testid="app-bar"
      {...rest}
    >
      {isSacredTheme && (
        <>
          <SacredShimmer />
          <SacredGlyphs isHovered={isHovered} isDisabled={!!isDisabled} />
        </>
      )}

      <div style={computedStyles.toolbar}>{children}</div>
    </div>
  )
}

AppBar.displayName = 'AppBar'
export default AppBar
