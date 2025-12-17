'use client'

import React from 'react'
import ContentSection from '../../Content'
import { ProjectBoardProps } from '../../ProjectBoard/types'

// Sacred glyphs removed

export interface FormProjectBoardProps {
  title: string
  description: string
  projectboard: ProjectBoardProps
  sacredtheme?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
    boxSizing: 'border-box',
  } as React.CSSProperties,

  titleContainer: {
    marginTop: '4px',
    marginBottom: '12px',
    width: '100%',
    position: 'relative',
    padding: '0 8px',
    boxSizing: 'border-box',
  } as React.CSSProperties,

  title: {
    marginBottom: '2px',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Merriweather, serif',
    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
    fontWeight: 'normal',
    color: 'rgba(0, 0, 0, 1)',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  } as React.CSSProperties,

  description: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Merriweather, serif',
    fontSize: 'clamp(1rem, 3vw, 1.25rem)',
    fontWeight: 'normal',
    color: 'rgba(0, 0, 0, 1)',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  } as React.CSSProperties,

  projectBoardContainer: {
    position: 'relative',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(32px)',
    border: '2px solid rgba(255, 215, 0, 0.5)',
    borderRadius: '12px',
    padding: '16px',
    boxSizing: 'border-box',
  } as React.CSSProperties,

  topShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,

  bottomShimmer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,

  decorativeGlyph: {
    position: 'absolute',
    fontSize: '18px',
    color: 'rgba(255, 215, 0, 0.3)',
    animation: 'formProjectBoardFloat 5s ease-in-out infinite',
    zIndex: 10,
  } as React.CSSProperties,

  topLeftGlyph: {
    top: '12px',
    left: '12px',
  } as React.CSSProperties,

  topRightGlyph: {
    top: '12px',
    right: '12px',
    animationDirection: 'reverse',
  } as React.CSSProperties,

  headerGlyphs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '4px',
  } as React.CSSProperties,

  titleContainer: {
    marginTop: '4px',
    marginBottom: '12px',
    width: '100%',
    position: 'relative',
    padding: '0 8px',
    boxSizing: 'border-box',
  } as React.CSSProperties,

  title: {
    marginBottom: '4px',
    width: '100%',
    textAlign: 'center',
    fontFamily: '"Cinzel", serif',
    fontSize: 'clamp(1.5rem, 5vw, 1.875rem)',
    fontWeight: 600,
    color: 'rgba(255, 215, 0, 1)',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
    letterSpacing: '0.05em',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  } as React.CSSProperties,

  description: {
    width: '100%',
    textAlign: 'center',
    fontFamily: '"Crimson Text", serif',
    fontSize: 'clamp(1rem, 3vw, 1.125rem)',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: '0.025em',
    marginBottom: '8px',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  } as React.CSSProperties,

  underline: {
    position: 'absolute',
    bottom: '-10px',
    left: 0,
    right: 0,
    height: '2px',
    background: 'rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,

  projectBoardContainer: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'visible',
  } as React.CSSProperties,

  bottomGlyphs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2px',
    marginTop: '8px',
    opacity: 0.5,
  } as React.CSSProperties,
}

function FormProjectBoard({
  title,
  description,
  projectboard,
  sacredtheme = true,
}: FormProjectBoardProps) {
  const styles = sacredtheme ? sacredStyles : premiumStyles

  return (
    <div style={styles.container}>
      {sacredtheme && (
        <>
          <div style={sacredStyles.topShimmer} />
          <div style={sacredStyles.bottomShimmer} />
        </>
      )}

      <div style={styles.titleContainer}>
        <div style={styles.title}>{title}</div>
        <div style={styles.description}>{description}</div>

        {sacredtheme && <div style={sacredStyles.underline} />}
      </div>

      <div style={styles.projectBoardContainer}>
        <ContentSection
          grids={[
            {
              projectboard: projectboard,
            },
          ]}
          sacredtheme={sacredtheme}
        />
      </div>
    </div>
  )
}

export default FormProjectBoard
