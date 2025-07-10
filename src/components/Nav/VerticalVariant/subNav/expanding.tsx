// src/components/Nav/VerticalVariant/subNav/expanding.tsx
'use client'
import React, { FC } from 'react'
import Accordion from '../../../Accordion'
import ExpandMoreIcon from '../../../Icons/ExpandMore'
import { white } from '../../../../styles/palette'
import { Typography } from '../../../Typography'

interface ExpandingSubNavProps {
  title?: string
  expandedSubnavs: string[]
  setExpandedSubnavs: React.Dispatch<React.SetStateAction<string[]>>
  onClose?: () => void
  children?: React.ReactNode
  activeAndHoverColor?: string
}

// Premium theme styles (when not sacred theme)
const premiumStyles = {
  container: {
    width: '100%',
    paddingLeft: 0,
  } as React.CSSProperties,

  iconContainer: {
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,

  icon: {
    transform: 'rotate(0deg)',
    transition: 'transform 0.2s ease',
    marginRight: '4px',
    color: 'transparent',
  } as React.CSSProperties,

  iconExpanded: {
    transform: 'rotate(180deg)',
  } as React.CSSProperties,

  iconCollapsed: {
    color: 'transparent',
  } as React.CSSProperties,

  typography: {
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  typographyExpanded: {
    // No special styles for premium theme when expanded
  } as React.CSSProperties,

  childrenContainer: {
    paddingLeft: '16px',
  } as React.CSSProperties,

  summaryStyle: {
    padding: 0,
    marginLeft: '20px',
    marginTop: 0,
    height: '32px',
  } as React.CSSProperties,
}

// Sacred theme styles
const sacredStyles = {
  container: {
    width: '100%',
    paddingLeft: 0,
  } as React.CSSProperties,

  iconContainer: {
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,

  icon: {
    transform: 'rotate(0deg)',
    transition: 'transform 0.2s ease',
    marginRight: '4px',
    color: 'transparent',
  } as React.CSSProperties,

  iconExpanded: {
    transform: 'rotate(180deg)',
    color: 'rgba(255, 215, 0, 1)',
  } as React.CSSProperties,

  iconCollapsed: {
    color: 'transparent',
  } as React.CSSProperties,

  typography: {
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
    fontWeight: 500,
    letterSpacing: '0.015em',
  } as React.CSSProperties,

  typographyExpanded: {
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,

  childrenContainer: {
    paddingLeft: '16px',
  } as React.CSSProperties,

  summaryStyle: {
    padding: 0,
    marginLeft: '20px',
    marginTop: 0,
    height: '32px',
  } as React.CSSProperties,
}

const ExpandingSubNav: FC<ExpandingSubNavProps> = ({
  title,
  expandedSubnavs,
  setExpandedSubnavs,
  children,
  activeAndHoverColor,
}) => {
  const isExpanded = expandedSubnavs.includes(title ?? '')
  const issacredtheme =
    activeAndHoverColor &&
    activeAndHoverColor.includes('rgba(255, 215, 0, 0.15)')

  const handleToggle = () => {
    if (isExpanded) {
      setExpandedSubnavs(expandedSubnavs.filter(t => t !== title))
    } else {
      setExpandedSubnavs([...expandedSubnavs, title ?? ''])
    }
  }

  const styles = issacredtheme ? sacredStyles : premiumStyles

  const iconStyle = {
    ...styles.icon,
    ...(isExpanded ? styles.iconExpanded : {}),
    ...(issacredtheme && !isExpanded ? styles.iconCollapsed : {}),
  }

  const typographyStyle = {
    ...styles.typography,
    ...(issacredtheme && isExpanded ? styles.typographyExpanded : {}),
  }

  const summaryContent = (
    <div style={styles.iconContainer}>
      <ExpandMoreIcon style={iconStyle} />
      <Typography
        fontvariant="merrih6"
        fontcolor={issacredtheme ? 'rgba(255, 215, 0, 0.9)' : white.main}
        text={title ?? ''}
        style={typographyStyle}
      />
    </div>
  )

  return (
    <Accordion
      key={title}
      expanded={isExpanded}
      onChange={handleToggle}
      summary={summaryContent}
      details={<div style={styles.childrenContainer}>{children}</div>}
      style={styles.container}
      sacredtheme={!!issacredtheme}
    />
  )
}

export default ExpandingSubNav
