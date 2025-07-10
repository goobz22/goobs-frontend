'use client'

import React from 'react'

interface LinearProgressProps {
  className?: string
  sacredtheme?: boolean
}

const getStyles = (sacredtheme?: boolean) => ({
  container: {
    width: '100%',
    height: '0.625rem',
    borderRadius: '9999px',
    backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.2)' : '#E5E7EB',
  } as React.CSSProperties,
  bar: {
    height: '0.625rem',
    borderRadius: '9999px',
    backgroundImage: sacredtheme
      ? 'linear-gradient(to right, #FBBF24, #F59E0B, #FBBF24)'
      : 'linear-gradient(to right, #2563EB, #3B82F6)',
  } as React.CSSProperties,
})

const LinearProgress: React.FC<LinearProgressProps> = ({
  className,
  sacredtheme,
}) => {
  const styles = getStyles(sacredtheme)
  return (
    <div style={styles.container} className={className}>
      <div style={styles.bar}></div>
    </div>
  )
}

export default LinearProgress
