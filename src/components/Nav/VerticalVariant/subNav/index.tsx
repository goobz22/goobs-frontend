'use client'
import React, { FC } from 'react'
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  List,
  MenuItem,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Link from 'next/link'
import { white } from '../../../../styles/palette'
import { Typography } from '../../../Typography'

interface SubNavComponentProps {
  title?: string
  route?: string
  trigger?: 'route' | 'onClick'
  expandedSubnavs: string[]
  setExpandedSubnavs: React.Dispatch<React.SetStateAction<string[]>>
  activeAndHoverColor: string
  onClose?: () => void
  variant?: 'temporary' | 'permanent'
  hasChildren: boolean
  children?: React.ReactNode
}

const SubNavComponent: FC<SubNavComponentProps> = ({
  title,
  route,
  trigger,
  expandedSubnavs,
  setExpandedSubnavs,
  activeAndHoverColor,
  onClose,
  variant,
  hasChildren,
  children,
}) => {
  const isExpanded = expandedSubnavs.includes(title ?? '')

  // If no children => a single route
  if (!hasChildren) {
    return (
      <Link
        key={title}
        style={{ textDecoration: 'none', color: 'white' }}
        href={route ?? ''}
      >
        <MenuItem
          sx={{
            color: white.main,
            ml: '25px',
            '&:hover': { backgroundColor: activeAndHoverColor },
            '&:active': { backgroundColor: activeAndHoverColor },
            whiteSpace: 'nowrap', // keep text on a single line
          }}
          onClick={() => {
            if (trigger === 'route' && variant === 'temporary' && onClose) {
              onClose()
            }
          }}
        >
          <Typography
            fontvariant="merrih6"
            text={title ?? ''}
            fontcolor={white.main}
          />
        </MenuItem>
      </Link>
    )
  }

  // If we do have children => an accordion with view items
  return (
    <MuiAccordion
      key={title}
      disableGutters
      elevation={0}
      square
      expanded={isExpanded}
      onChange={() => {
        if (isExpanded) {
          setExpandedSubnavs(expandedSubnavs.filter(t => t !== title))
        } else {
          setExpandedSubnavs([...expandedSubnavs, title ?? ''])
        }
      }}
      sx={{
        pl: 0,
        backgroundColor: 'transparent',
        '.MuiAccordionSummary-root': {
          pl: 0,
          whiteSpace: 'nowrap',
        },
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              color: 'transparent',
            }}
          />
        }
        aria-controls="accordion-content"
        id="accordion-header"
        sx={{
          boxSizing: 'border-box',
          border: 'none',
          py: '6px',
          mt: 0,
          ml: '8px',
          minHeight: 0,
          height: '32px',
          '& .MuiAccordionSummary-content': {
            m: 0,
            whiteSpace: 'nowrap',
          },
          '&:hover': {
            '& .MuiSvgIcon-root': {
              color: white.main,
            },
          },
          '&.Mui-expanded': {
            '& .MuiSvgIcon-root': {
              color: white.main,
            },
          },
        }}
      >
        <Typography
          fontvariant="merrih6"
          fontcolor={white.main}
          text={title ?? ''}
          marginLeft={4}
          sx={{
            whiteSpace: 'nowrap',
          }}
        />
      </AccordionSummary>
      <AccordionDetails
        sx={{
          border: 'none',
          p: 0,
          whiteSpace: 'nowrap',
        }}
      >
        <List sx={{ py: 0, whiteSpace: 'nowrap' }}>{children}</List>
      </AccordionDetails>
    </MuiAccordion>
  )
}

export default SubNavComponent
