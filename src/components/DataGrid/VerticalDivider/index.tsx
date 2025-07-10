'use client'
import React from 'react'

interface VerticalDividerProps {
  sacredtheme?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  divider: {
    borderLeft: '2px solid rgba(0, 0, 0, 1)',
    height: '20px',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  divider: {
    borderLeft: '2px solid rgba(255, 215, 0, 0.4)',
    height: '20px',
    boxShadow:
      '0 4px 6px -1px rgba(255, 215, 0, 0.6), 0 2px 4px -1px rgba(255, 215, 0, 0.4)',
  } as React.CSSProperties,
}

export const VerticalDivider: React.FC<VerticalDividerProps> = ({
  sacredtheme,
}) => {
  const styles = sacredtheme ? sacredStyles : premiumStyles

  return <div style={styles.divider} />
}
