import { Box, styled, alpha } from '@mui/material'

interface VerticalDividerProps {
  sacredtheme?: boolean
}

export const VerticalDivider = styled(Box, {
  shouldForwardProp: prop => prop !== 'sacredtheme',
})<VerticalDividerProps>(({ sacredtheme }) => ({
  borderLeft: sacredtheme
    ? `2px solid ${alpha('#FFD700', 0.4)}`
    : '2px solid black',
  height: '20px',
  ...(sacredtheme && {
    boxShadow: `0 0 4px ${alpha('#FFD700', 0.6)}`,
  }),
}))
