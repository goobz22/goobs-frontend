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

interface MainNavComponentProps {
  /**
   * The label/title for this main navigation item.
   */
  title?: string

  /**
   * If `true`, we show an expand icon and child subNav items.
   */
  hasChildren: boolean

  /**
   * Which top-level nav titles are expanded
   */
  expandedNavs: string[]

  /**
   * Setter for expandedNavs
   */
  setExpandedNavs: React.Dispatch<React.SetStateAction<string[]>>

  /**
   * A callback for route or onClick triggers
   */
  onClick?: () => void

  /**
   * The nesting level for indentation
   */
  level: number

  /**
   * Child nodes (subNav) if `hasChildren` is true
   */
  children?: React.ReactNode

  /**
   * Hover color (not used in the example styling, but available if needed)
   */
  activeAndHoverColor?: string
}

const MainNavComponent: FC<MainNavComponentProps> = ({
  title,
  hasChildren,
  expandedNavs,
  setExpandedNavs,
  onClick,
  level,
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
          whiteSpace: 'nowrap', // no wrapping
        },
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          hasChildren ? (
            <ExpandMoreIcon
              sx={{
                color: 'transparent',
              }}
            />
          ) : null
        }
        aria-controls="accordion-content"
        id="accordion-header"
        sx={{
          boxSizing: 'border-box',
          border: 'none',
          py: '6px',
          mt: 2,
          ml: 3,
          minHeight: 0,
          height: '32px',
          '& .MuiAccordionSummary-content': {
            m: 0,
            whiteSpace: 'nowrap', // keep text on one line
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
          fontvariant="merrih5"
          fontcolor={white.main}
          text={title ?? ''}
          marginLeft={4 * level}
          sx={{
            whiteSpace: 'nowrap', // no wrapping
          }}
        />
      </AccordionSummary>

      {hasChildren && (
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
      )}
    </MuiAccordion>
  )
}

export default MainNavComponent
