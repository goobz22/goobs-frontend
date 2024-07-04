'use client'

import React from 'react'
import { styled } from '@mui/material/styles'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import { ExpandMore } from '@mui/icons-material'
import { black } from '../../styles/palette'

/**
 * Custom styled Accordion component.
 * Wraps MUI's Accordion with custom styling and disables gutters by default.
 */
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters {...props} />
))({})

/**
 * Custom styled AccordionSummary component.
 * Wraps MUI's AccordionSummary with custom styling and a custom expand icon.
 */
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ExpandMore sx={{ color: black.main }} />}
    {...props}
  />
))({
  fontSize: '20px',
  fontFamily: 'merriweather',
  fontWeight: 500,
})

/**
 * Custom styled AccordionDetails component.
 * Wraps MUI's AccordionDetails with custom padding based on the theme's spacing.
 */
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
}))

export { Accordion, AccordionSummary, AccordionDetails }
