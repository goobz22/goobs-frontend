// src/components/Nav/VerticalVariant/subNav/expanding.tsx
'use client'
import React, { FC } from 'react'
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  List,
  alpha,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { white } from '../../../../styles/palette'
import { Typography } from '../../../Typography'

interface ExpandingSubNavProps {
  title?: string
  expandedSubnavs: string[]
  setExpandedSubnavs: React.Dispatch<React.SetStateAction<string[]>>
  onClose?: () => void
  children?: React.ReactNode
  /**
   * Click handler for the accordion summary.
   */
  onClick?: () => void
  activeAndHoverColor?: string
}

/**
 * SubNav item that expands if it has children.
 */
const ExpandingSubNav: FC<ExpandingSubNavProps> = ({
  title,
  expandedSubnavs,
  setExpandedSubnavs,
  children,
  onClick,
  activeAndHoverColor,
}) => {
  const isExpanded = expandedSubnavs.includes(title ?? '')
  const issacredtheme =
    activeAndHoverColor &&
    (activeAndHoverColor.includes('255, 215, 0') ||
      activeAndHoverColor === alpha('#FFD700', 0.15))

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
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              // Keep transparent if you only want icon to show on hover/expand
              color: 'transparent',
              ...(issacredtheme && {
                color: isExpanded ? '#FFD700' : 'transparent',
                transition: 'color 0.3s ease',
              }),
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
          // Indent the entire accordion summary using marginLeft
          marginLeft: '22px',
          // Move arrow to the left of text, minimal gap
          '& .MuiAccordionSummary-expandIconWrapper': {
            order: -1,
            marginRight: '4px',
          },
          '& .MuiAccordionSummary-content': {
            m: 0,
            whiteSpace: 'nowrap',
          },
          '&:hover': {
            '& .MuiSvgIcon-root': {
              color: issacredtheme ? '#FFD700' : white.main,
            },
          },
          '&.Mui-expanded': {
            '& .MuiSvgIcon-root': {
              color: issacredtheme ? '#FFD700' : white.main,
            },
          },
        }}
        onClick={onClick}
      >
        <Typography
          fontvariant="merrih6"
          fontcolor={issacredtheme ? alpha('#FFD700', 0.9) : white.main}
          text={title ?? ''}
          sx={{
            whiteSpace: 'nowrap',
            // Remove any left margin to keep text right next to arrow
            marginLeft: 0,
            ...(issacredtheme && {
              fontWeight: 500,
              letterSpacing: 0.8,
              transition: 'all 0.3s ease',
              textShadow: isExpanded
                ? '0 0 8px rgba(255, 215, 0, 0.7)'
                : 'none',
            }),
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

export default ExpandingSubNav
