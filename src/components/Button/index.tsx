// src/components/Button/index.tsx

'use client'
import React from 'react'
import { Button, Box, ButtonProps, keyframes, alpha } from '@mui/material'
import Typography from '../Typography'
import { SvgIconProps } from '@mui/material/SvgIcon'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
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

const sacredGlowPulse = keyframes`
  0% { 
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3), inset 0 0 5px rgba(255, 215, 0, 0.2);
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
  50% { 
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 10px rgba(255, 215, 0, 0.3);
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  }
  100% { 
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3), inset 0 0 5px rgba(255, 215, 0, 0.2);
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
`

const sacredShimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const rotateGlyph = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const sacredFloat = keyframes`
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-2px) scale(1.05); }
  100% { transform: translateY(0px) scale(1); }
`

const sacredIconGlow = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.5)); }
  50% { filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.9)); }
  100% { filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.5)); }
`

export interface CustomButtonProps extends ButtonProps {
  text?: string
  /**
   * The background color for the button when not disabled.
   * If `backgroundcolor` is "none", it behaves like a text button.
   */
  backgroundcolor?: string
  /** The text color. Defaults to white unless disabled. */
  fontcolor?: string
  fontvariant?: 'merriparagraph' | 'merrihelperfooter'
  width?: string
  height?: string
  /**
   * If you want to disable the button in a custom way (string),
   * we unify this with MUI's `disabled` boolean.
   */
  disableButton?: 'true' | 'false'

  /** Optional icon to display. */
  icon?: React.ReactElement<SvgIconProps>
  iconcolor?: string
  iconsize?: string
  iconlocation?: 'left' | 'right' | 'above'
  fontlocation?: 'left' | 'center' | 'right'

  /** Enable Egyptian/Sacred theming */
  sacredTheme?: boolean
}

function CustomButton({
  text,
  variant = 'contained',
  fontvariant = 'merriparagraph',
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
  style = {},
  sacredTheme = false,
  ...restProps
}: CustomButtonProps) {
  // Merge MUI's "disabled" with our "disableButton"
  const isReallyDisabled = disabled || disableButton === 'true'

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onClick?.(event)
  }

  // If user provides an icon, clone it to override color/size if desired
  const IconComponent = icon
    ? React.cloneElement(icon, {
        sx: {
          color: sacredTheme
            ? isReallyDisabled
              ? alpha('#FFD700', 0.3)
              : iconcolor || '#FFD700'
            : iconcolor || 'inherit',
          fontSize: iconsize || '20px',
          minWidth: iconsize || '20px',
          minHeight: iconsize || '20px',
          margin: 0,
          ...(sacredTheme &&
            !isReallyDisabled && {
              animation: `${sacredIconGlow} 2s ease-in-out infinite`,
            }),
        },
      } as Partial<SvgIconProps>)
    : null

  // Determine if this is an icon-only button
  const isIconOnly = !!icon && !text

  // Adjust height for icon above text layout or icon-only buttons
  const isIconAbove = iconlocation === 'above'
  const defaultHeight = isIconOnly ? '36px' : isIconAbove ? 'auto' : '40px'
  const minHeight = isIconOnly ? '36px' : isIconAbove ? '70px' : '40px'

  // Random glyph selection for sacred theme
  const leftGlyph =
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  const rightGlyph =
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]

  // Base inline styles for the button
  const buttonStyle: React.CSSProperties = {
    minWidth: isIconOnly ? '36px' : 'fit-content',
    width: width || (isIconOnly ? '36px' : 'auto'),
    height: height || defaultHeight,
    minHeight: minHeight,
    padding: isIconOnly ? '6px' : isIconAbove ? '16px 16px' : '8px 16px',
    display: 'inline-flex',
    flexShrink: 0,
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    flexDirection: isIconAbove ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: isIconOnly
      ? 'center'
      : fontlocation === 'left'
        ? 'flex-start'
        : fontlocation === 'right'
          ? 'flex-end'
          : 'center',
    gap: isIconAbove ? '12px' : '8px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  }

  // Sacred theme styles
  if (sacredTheme && !isReallyDisabled) {
    buttonStyle.backgroundColor =
      backgroundcolor === 'none'
        ? 'transparent'
        : backgroundcolor || alpha('#000000', 0.9)
    buttonStyle.border = `2px solid ${alpha('#FFD700', 0.8)}`
    buttonStyle.borderRadius = '8px'
    buttonStyle.color = '#FFD700'
    buttonStyle.fontFamily = '"Cinzel", serif'
    buttonStyle.fontWeight = 600
    buttonStyle.letterSpacing = '1px'
    buttonStyle.textTransform = 'uppercase'
    buttonStyle.animation = `${sacredGlowPulse} 3s ease-in-out infinite`
    buttonStyle.backgroundImage =
      backgroundcolor !== 'none'
        ? `
      linear-gradient(135deg, 
        ${alpha('#FFD700', 0.1)} 0%, 
        ${alpha('#000000', 0.9)} 50%,
        ${alpha('#FFD700', 0.1)} 100%)
    `
        : undefined
  }

  // If disabled, force styling
  if (isReallyDisabled) {
    if (sacredTheme) {
      buttonStyle.backgroundColor = alpha('#000000', 0.6)
      buttonStyle.border = `2px solid ${alpha('#FFD700', 0.2)}`
      buttonStyle.color = alpha('#FFD700', 0.3)
      buttonStyle.animation = 'none'
      buttonStyle.backgroundImage = 'none'
    } else {
      buttonStyle.backgroundColor = '#cccccc'
    }
    buttonStyle.opacity = 1
    buttonStyle.cursor = 'not-allowed'
    buttonStyle.pointerEvents = 'auto'
  } else if (!sacredTheme && backgroundcolor && backgroundcolor !== 'none') {
    buttonStyle.backgroundColor = backgroundcolor
  } else if (!sacredTheme && backgroundcolor === 'none') {
    buttonStyle.backgroundColor = 'transparent'
  }

  // Inline styles for the top-level container (Box)
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: width || (isIconOnly ? '36px' : 'auto'),
    height: height || (isIconOnly ? '36px' : isIconAbove ? 'auto' : '40px'),
    minHeight: isIconOnly ? '36px' : isIconAbove ? minHeight : 'auto',
    minWidth: isIconOnly ? '36px' : 'fit-content',
    position: 'relative',
    ...style,
  }

  // Style for the inner content box
  const contentBoxStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isIconOnly
      ? 'center'
      : fontlocation === 'left'
        ? 'flex-start'
        : fontlocation === 'right'
          ? 'flex-end'
          : 'center',
    width: '100%',
    height: '100%',
    gap: '8px',
    position: 'relative',
    zIndex: 2,
  }

  return (
    <Box style={containerStyle}>
      <Button
        {...restProps}
        variant={variant}
        onClick={handleButtonClick}
        disabled={isReallyDisabled}
        disableElevation
        disableRipple
        style={buttonStyle}
        data-testid={isReallyDisabled ? 'disabled-button' : 'button'}
        sx={{
          ...(sacredTheme &&
            !isReallyDisabled && {
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, transparent, ${alpha('#FFD700', 0.2)}, transparent)`,
                backgroundSize: '200% 100%',
                animation: `${sacredShimmer} 2s ease-in-out infinite`,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&::after': {
                content: `"${leftGlyph}"`,
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: alpha('#FFD700', 0.3),
                fontSize: '14px',
                animation: `${rotateGlyph} 20s linear infinite`,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: '#FFD700',
                boxShadow:
                  '0 0 20px rgba(255, 215, 0, 0.6), 0 4px 8px rgba(0, 0, 0, 0.4)',
                '&::before': {
                  opacity: 1,
                },
                '&::after': {
                  opacity: 1,
                },
                '& .sacred-glyph-right': {
                  opacity: 1,
                },
              },
            }),
        }}
      >
        {/* Sacred floating glyph on the right */}
        {sacredTheme && !isReallyDisabled && (
          <Box
            className="sacred-glyph-right"
            sx={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: alpha('#FFD700', 0.3),
              fontSize: '14px',
              animation: `${rotateGlyph} 15s linear infinite reverse`,
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            {rightGlyph}
          </Box>
        )}

        {/* If iconlocation="above", show the icon first */}
        {isIconAbove && IconComponent}

        {/* The text+icon container */}
        <Box style={contentBoxStyle}>
          {iconlocation === 'left' && IconComponent}

          {text && (
            <Typography
              fontvariant={sacredTheme ? undefined : fontvariant}
              fontcolor={
                isReallyDisabled
                  ? sacredTheme
                    ? alpha('#FFD700', 0.3)
                    : 'grey'
                  : sacredTheme
                    ? '#FFD700'
                    : fontcolor || 'white'
              }
              text={text}
              sx={
                sacredTheme
                  ? {
                      fontFamily: '"Cinzel", serif',
                      fontWeight: 600,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      animation: isReallyDisabled
                        ? 'none'
                        : `${sacredFloat} 2s ease-in-out infinite`,
                    }
                  : undefined
              }
            />
          )}

          {iconlocation === 'right' && IconComponent}
        </Box>
      </Button>
    </Box>
  )
}

export default CustomButton
