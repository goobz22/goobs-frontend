// src/components/Checkbox/index.tsx

'use client'

import { Checkbox, styled, keyframes, alpha } from '@mui/material'
import React from 'react'
import * as palette from '../../styles/palette'

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
    filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5));
    transform: scale(1);
  }
  50% { 
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.9));
    transform: scale(1.05);
  }
  100% { 
    filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5));
    transform: scale(1);
  }
`

const sacredCheckAppear = keyframes`
  0% { 
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% { 
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`

const sacredBorderGlow = keyframes`
  0% { 
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 5px rgba(255, 215, 0, 0.2);
  }
  50% { 
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.6), inset 0 0 10px rgba(255, 215, 0, 0.4);
  }
  100% { 
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 5px rgba(255, 215, 0, 0.2);
  }
`

const floatGlyph = keyframes`
  0% { transform: translateY(0px); opacity: 0.3; }
  50% { transform: translateY(-2px); opacity: 0.6; }
  100% { transform: translateY(0px); opacity: 0.3; }
`

export interface CheckboxProps {
  onClick?: (event: React.MouseEvent) => void
  checked?: boolean
  indeterminate?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  /** Enable Egyptian/Sacred theming */
  sacredTheme?: boolean
}

// Create a styled version of MUI Checkbox with our custom styles
const StyledCheckbox = styled(Checkbox)<{ sacredtheme?: boolean }>(
  ({ sacredtheme }) => ({
    padding: '8px',
    position: 'relative',
    '& .MuiSvgIcon-root': {
      fontSize: '24px',
    },

    // Style for unchecked state
    '&:not(.Mui-checked):not(.Mui-indeterminate):not(.Mui-disabled)': {
      '& .MuiSvgIcon-root': {
        color: 'transparent',
        backgroundColor: sacredtheme
          ? alpha('#000000', 0.8)
          : palette.grey.light,
        border: `2px solid ${sacredtheme ? alpha('#FFD700', 0.6) : palette.marine.main}`,
        borderRadius: '3px',
        transition: 'all 0.3s ease',
        ...(sacredtheme && {
          animation: `${sacredBorderGlow} 3s ease-in-out infinite`,
        }),
      },
    },

    // Checked state
    '&.Mui-checked .MuiSvgIcon-root': {
      color: sacredtheme ? '#FFD700' : palette.marine.main,
      backgroundColor: sacredtheme ? alpha('#000000', 0.9) : 'transparent',
      border: sacredtheme ? `2px solid #FFD700` : 'none',
      borderRadius: sacredtheme ? '3px' : '0',
      ...(sacredtheme && {
        animation: `${sacredGlowPulse} 2s ease-in-out infinite`,
        filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
      }),
    },

    // Checked animation
    '&.Mui-checked': {
      ...(sacredtheme && {
        '& .MuiSvgIcon-root path': {
          animation: `${sacredCheckAppear} 0.4s ease-out`,
        },
      }),
    },

    // Indeterminate state
    '&.Mui-indeterminate .MuiSvgIcon-root': {
      color: sacredtheme ? '#FFD700' : palette.marine.main,
      backgroundColor: sacredtheme ? alpha('#000000', 0.9) : 'transparent',
      border: sacredtheme ? `2px solid #FFD700` : 'none',
      borderRadius: sacredtheme ? '3px' : '0',
      ...(sacredtheme && {
        animation: `${sacredGlowPulse} 1.5s ease-in-out infinite`,
        filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
      }),
    },

    // Disabled state
    '&.Mui-disabled .MuiSvgIcon-root': {
      color: sacredtheme ? alpha('#FFD700', 0.2) : palette.grey.main,
      backgroundColor: sacredtheme ? alpha('#000000', 0.6) : 'transparent',
      border: `2px solid ${sacredtheme ? alpha('#FFD700', 0.2) : palette.grey.main}`,
      borderRadius: '3px',
    },

    // Hover state
    '&:hover': {
      backgroundColor: sacredtheme
        ? alpha('#FFD700', 0.1)
        : `${palette.marine.light}33`,
      ...(sacredtheme && {
        '& .MuiSvgIcon-root': {
          borderColor: '#FFD700',
          transform: 'scale(1.1)',
        },
      }),
    },

    // Sacred decorative elements
    ...(sacredtheme && {
      '&::before': {
        content: `"${SACRED_GLYPHS[11]}"`,
        position: 'absolute',
        left: '-20px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: alpha('#FFD700', 0.3),
        fontSize: '12px',
        animation: `${floatGlyph} 3s ease-in-out infinite`,
      },
      '&::after': {
        content: `"${SACRED_GLYPHS[15]}"`,
        position: 'absolute',
        right: '-20px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: alpha('#FFD700', 0.3),
        fontSize: '12px',
        animation: `${floatGlyph} 3s ease-in-out infinite 1.5s`,
      },
    }),
  })
)

// Sacred wrapper for additional effects
const SacredCheckboxWrapper = styled('div')<{ sacredtheme?: boolean }>(
  ({ sacredtheme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...(sacredtheme && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha('#FFD700', 0.1)} 0%, transparent 70%)`,
        opacity: 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      },
      '&:hover::before': {
        opacity: 1,
      },
    }),
  })
)

function CustomCheckbox({
  onClick,
  checked,
  indeterminate,
  onChange,
  disabled,
  sacredTheme = false,
  ...props
}: CheckboxProps) {
  const handleClick = (event: React.MouseEvent) => {
    if (onClick) {
      onClick(event)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()

    if (onChange) {
      onChange(event)
    }
  }

  return (
    <SacredCheckboxWrapper sacredtheme={sacredTheme}>
      <StyledCheckbox
        checked={checked}
        indeterminate={indeterminate}
        onClick={handleClick}
        onChange={handleChange}
        disabled={disabled}
        disableRipple
        sacredtheme={sacredTheme}
        {...props}
      />
    </SacredCheckboxWrapper>
  )
}

export default CustomCheckbox
