// src/components/Accordion/index.tsx

'use client'

import React from 'react'
import { styled } from '@mui/material/styles'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import { ExpandMore } from '@mui/icons-material'
import { black } from '../../styles/palette'

export interface AccordionProps {
  summary: React.ReactNode
  details: React.ReactNode
  expanded?: boolean
  /** Add this line: */
  defaultExpanded?: boolean
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void
  disabled?: boolean
  style?: React.CSSProperties
}

const StyledAccordion = styled(MuiAccordion)({
  '&.MuiAccordion-root': {
    '&:before': {
      display: 'none',
    },
  },
})

const StyledAccordionSummary = styled(MuiAccordionSummary)({
  fontSize: '20px',
  fontFamily: 'merriweather',
  fontWeight: 500,
})

const StyledAccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
}))

function Accordion({ summary, details, style, ...props }: AccordionProps) {
  return (
    <StyledAccordion disableGutters style={style} {...props}>
      <StyledAccordionSummary
        expandIcon={<ExpandMore sx={{ color: black.main }} />}
      >
        {summary}
      </StyledAccordionSummary>
      <StyledAccordionDetails>{details}</StyledAccordionDetails>
    </StyledAccordion>
  )
}

Accordion.displayName = 'Accordion'
export default Accordion
