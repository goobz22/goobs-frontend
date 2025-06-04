import { Box, styled, alpha } from '@mui/material'

interface VerticalDividerProps {
  sacredTheme?: boolean
}

export const VerticalDivider = styled(Box, {
  shouldForwardProp: prop => prop !== 'sacredTheme',
})<VerticalDividerProps>(({ sacredTheme }) => ({
  borderLeft: sacredTheme
    ? `2px solid ${alpha('#FFD700', 0.4)}`
    : '2px solid black',
  height: '20px',
  ...(sacredTheme && {
    boxShadow: `0 0 4px ${alpha('#FFD700', 0.6)}`,
  }),
}))
