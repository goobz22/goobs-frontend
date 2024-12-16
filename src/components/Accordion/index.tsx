'use client'

import React from 'react'
import { styled } from '@mui/material/styles'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails, {
  AccordionDetailsProps,
} from '@mui/material/AccordionDetails'
import { ExpandMore } from '@mui/icons-material'
import { black } from '../../styles/palette'

type CustomAccordionProps = AccordionProps & {
  children: React.ReactNode
}

type CustomAccordionSummaryProps = AccordionSummaryProps & {
  children: React.ReactNode
}

type CustomAccordionDetailsProps = AccordionDetailsProps & {
  children: React.ReactNode
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

function Accordion({ children, ...props }: CustomAccordionProps) {
  return (
    <StyledAccordion disableGutters {...props}>
      {children}
    </StyledAccordion>
  )
}

function AccordionSummary({ children, ...props }: CustomAccordionSummaryProps) {
  return (
    <StyledAccordionSummary
      expandIcon={<ExpandMore sx={{ color: black.main }} />}
      {...props}
    >
      {children}
    </StyledAccordionSummary>
  )
}

function AccordionDetails({ children, ...props }: CustomAccordionDetailsProps) {
  return <StyledAccordionDetails {...props}>{children}</StyledAccordionDetails>
}

Accordion.displayName = 'Accordion'
AccordionSummary.displayName = 'AccordionSummary'
AccordionDetails.displayName = 'AccordionDetails'

export { Accordion, AccordionSummary, AccordionDetails }
export type {
  CustomAccordionProps,
  CustomAccordionSummaryProps,
  CustomAccordionDetailsProps,
}
