// src/components/Nav/VerticalVariant/viewNav/expanding.tsx
'use client'
import React, { FC } from 'react'
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  List,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { white } from '../../../../styles/palette'
import { Typography } from '../../../Typography'

interface ExpandingViewNavProps {
  title?: string
  /**
   * The titles that are currently expanded at the viewNav level.
   */
  expandedNavs: string[]
  /**
   * Setter for `expandedNavs`.
   */
  setExpandedNavs: React.Dispatch<React.SetStateAction<string[]>>
  /**
   * Click handler for route or other actions
   */
  onClick?: () => void
  /**
   * The nesting level for indentation.
   */
  level: number
  /**
   * Child nodes (subViewNav) to show if expanded.
   */
  children?: React.ReactNode
}

const ExpandingViewNav: FC<ExpandingViewNavProps> = ({
  title,
  expandedNavs,
  setExpandedNavs,
  onClick,
  children,
}) => {
  const isExpanded = expandedNavs.includes(title ?? '')

  return (
    <MuiAccordion
      disableGutters
      elevation={0}
      square
      expanded={isExpanded}
      onChange={() => {
        // Toggle expanded state for this title
        if (isExpanded) {
          setExpandedNavs(expandedNavs.filter(t => t !== title))
        } else {
          setExpandedNavs([...expandedNavs, title ?? ''])
        }
      }}
      sx={{
        pl: 0,
        backgroundColor: 'transparent',
        '.MuiAccordionSummary-root': {
          pl: 0,
          whiteSpace: 'nowrap', // No wrapping
        },
        '&:before': {
          display: 'none', // Remove default Mui divider line
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              // Keep transparent if you only want it visible on hover/expand
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
          minHeight: 0,
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          // Match indentation with ViewNav component - more indented than subNav
          marginLeft: '36px',
          // Force icon to appear first
          '& .MuiAccordionSummary-expandIconWrapper': {
            order: -1,
            marginRight: '8px',
          },
          '& .MuiAccordionSummary-content': {
            m: 0,
            whiteSpace: 'nowrap', // Keep text on one line
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
        onClick={() => {
          if (onClick) onClick()
        }}
      >
        <Typography
          fontvariant="merriparagraph"
          fontcolor={white.main}
          text={title ?? ''}
          sx={{
            whiteSpace: 'nowrap', // No wrapping
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
        <List
          sx={{
            py: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {children}
        </List>
      </AccordionDetails>
    </MuiAccordion>
  )
}

export default ExpandingViewNav
