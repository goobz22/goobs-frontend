'use client'

import React, { JSX } from 'react'
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

type CustomAccordionProps = Omit<AccordionProps, 'children'> & {
  children: NonNullable<React.ReactNode>
}

type CustomAccordionSummaryProps = Omit<AccordionSummaryProps, 'children'> & {
  children: NonNullable<React.ReactNode>
}

type CustomAccordionDetailsProps = Omit<AccordionDetailsProps, 'children'> & {
  children: NonNullable<React.ReactNode>
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

function Accordion({ children, ...props }: CustomAccordionProps): JSX.Element {
  return (
    <StyledAccordion disableGutters {...props}>
      {children}
    </StyledAccordion>
  )
}

function AccordionSummary({
  children,
  ...props
}: CustomAccordionSummaryProps): JSX.Element {
  return (
    <StyledAccordionSummary
      expandIcon={<ExpandMore sx={{ color: black.main }} />}
      {...props}
    >
      {children}
    </StyledAccordionSummary>
  )
}

function AccordionDetails({
  children,
  ...props
}: CustomAccordionDetailsProps): JSX.Element {
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
