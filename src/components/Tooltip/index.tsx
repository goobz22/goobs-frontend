'use client'
import {
  Tooltip,
  TooltipProps,
  tooltipClasses,
  keyframes,
  alpha,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'

// Sacred theming animation
const sacredGlow = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.6); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.4); }
  100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.6); }
`

/**
 * Interface extending TooltipProps with custom properties for StyledTooltip
 */
export interface CustomTooltipProps extends TooltipProps {
  tooltipcolor: string
  tooltipplacement: 'left' | 'right' | 'top' | 'bottom'
  offsetX: number
  offsetY: number
  sacredTheme?: boolean
}

/**
 * StyledTooltip component that extends Material-UI Tooltip with custom styling and positioning
 *
 * @param {CustomTooltipProps} props - The props for the StyledTooltip component
 * @returns {React.FC<CustomTooltipProps>} A styled Tooltip component
 */
const StyledTooltip = styled(
  ({
    className,
    tooltipplacement,
    offsetX,
    offsetY,
    ...props
  }: CustomTooltipProps) => (
    <Tooltip
      {...props}
      classes={{ popper: className }}
      placement={tooltipplacement}
      PopperProps={{
        popperOptions: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [offsetX, offsetY],
              },
            },
          ],
        },
      }}
    />
  )
)(({ tooltipcolor, sacredTheme }) => ({
  // Styling for the tooltip content
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: sacredTheme ? '#FFD700' : tooltipcolor,
    fontSize: '16px',
    fontFamily: sacredTheme ? '"Cinzel", serif' : 'Merriweather',
    fontWeight: sacredTheme ? 600 : 400,
    padding: '5px 8px',
    ...(sacredTheme && {
      color: '#000000',
      letterSpacing: '0.5px',
      animation: `${sacredGlow} 2s ease-in-out infinite`,
      border: `1px solid ${alpha('#FFD700', 0.8)}`,
    }),
  },
  // Styling for the tooltip arrow
  [`& .${tooltipClasses.arrow}`]: {
    color: sacredTheme ? '#FFD700' : tooltipcolor,
    ...(sacredTheme && {
      filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
    }),
  },
}))

export default StyledTooltip
