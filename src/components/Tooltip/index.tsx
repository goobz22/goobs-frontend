'use client'
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'

/**
 * Interface extending TooltipProps with custom properties for StyledTooltip
 */
export interface CustomTooltipProps extends TooltipProps {
  tooltipcolor: string
  tooltipplacement: 'left' | 'right' | 'top' | 'bottom'
  offsetX: number
  offsetY: number
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
)(({ tooltipcolor }) => ({
  // Styling for the tooltip content
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: tooltipcolor,
    fontSize: '16px',
    fontFamily: 'Merriweather',
    fontWeight: 400,
    padding: '5px 8px',
  },
  // Styling for the tooltip arrow
  [`& .${tooltipClasses.arrow}`]: {
    color: tooltipcolor,
  },
}))

export default StyledTooltip
