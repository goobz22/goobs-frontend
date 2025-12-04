// src/components/Form/DataGrid/index.tsx

'use client'

import React, { useMemo } from 'react'
import type { DatagridProps } from '../../DataGrid/types'
import DataGrid from '../../DataGrid'
import Alert, { AlertProps } from '../../Alert'

export interface FormDataGridProps {
  title: string
  description: string
  datagrid: DatagridProps
  sacredtheme?: boolean
  alert?: AlertProps
}

const getStyles = (sacredtheme?: boolean) => ({
  container: {
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
    // Container should not add extra spacing; inner wrapper will handle gutters
    boxSizing: 'border-box' as const,
    ...(sacredtheme && {
      position: 'relative',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '2px solid rgba(255, 215, 0, 0.5)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      animation: 'form-datagrid-glow-pulse 2s infinite alternate',
    }),
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    color: 'rgba(255, 215, 0, 0.3)',
    fontSize: '1.125rem',
    zIndex: 10,
    animation: 'form-datagrid-float 8s infinite alternate',
  } as React.CSSProperties,
  headerGlyphs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.375rem',
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  titleContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '0.75rem',
    ...(sacredtheme && {
      textAlign: 'center',
      borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
      paddingBottom: '0.75rem',
    }),
  } as React.CSSProperties,
  title: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Merriweather, serif',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'black',
    ...(sacredtheme && {
      fontFamily: 'Cinzel, serif',
      color: '#FFD700',
      textAlign: 'center',
      fontSize: '2rem',
      letterSpacing: '0.05em',
      textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
      marginBottom: '0.5rem',
    }),
  } as React.CSSProperties,
  description: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Merriweather, serif',
    fontSize: '1.25rem',
    fontWeight: 400,
    color: 'black',
    ...(sacredtheme && {
      fontFamily: 'Crimson Text, serif',
      color: 'rgba(255,255,255,0.9)',
      textAlign: 'center',
      fontSize: '1.125rem',
      letterSpacing: '0.05em',
      marginBottom: '0.5rem',
    }),
  } as React.CSSProperties,
  shimmer: {
    position: 'absolute',
    bottom: '-10px',
    left: 0,
    right: 0,
    height: '2px',
    overflow: 'hidden',
    '::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage:
        'linear-gradient(to right, transparent, #FFD700, transparent)',
      animation: 'form-datagrid-data-flow 3s infinite',
    },
  } as React.CSSProperties,
  alertContainer: {
    marginBottom: '0.75rem',
  } as React.CSSProperties,
  dataGridContainer: {
    ...(sacredtheme && {
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'rgba(0,0,0,0.5)',
      boxSizing: 'border-box',
    }),
  } as React.CSSProperties,
  footerGlyphs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.125rem',
    marginTop: '0.5rem',
    opacity: 0.5,
  } as React.CSSProperties,
  footerGlyph: {
    color: '#FFD700',
    fontSize: '0.75rem',
    animation: 'form-datagrid-float 3s infinite alternate',
  } as React.CSSProperties,
})

function FormDataGrid({
  title,
  description,
  datagrid,
  sacredtheme = true,
  alert,
}: FormDataGridProps) {
  const styles = getStyles(sacredtheme)

  // Memoize the styles to prevent infinite re-renders
  const dataGridStyles = useMemo(
    () => ({
      theme: sacredtheme ? 'sacred' : ('light' as 'sacred' | 'light'),
    }),
    [sacredtheme]
  )

  const alertStyles = useMemo(
    () => ({
      theme: sacredtheme ? 'sacred' : ('light' as 'sacred' | 'light'),
    }),
    [sacredtheme]
  )

  return (
    <div style={styles.container}>
      <div style={{ ...styles.titleContainer, position: 'relative' }}>
        <div style={styles.title}>{title}</div>
        <div style={styles.description}>{description}</div>
        {sacredtheme && <div style={styles.shimmer} />}
      </div>

      {alert && (
        <div style={styles.alertContainer}>
          {(() => {
            const baseProps: AlertProps = {
              severity: alert.severity,
              message: alert.message,
              styles: alertStyles,
            }
            return alert.onClose ? (
              <Alert {...baseProps} onClose={alert.onClose} />
            ) : (
              <Alert {...baseProps} />
            )
          })()}
        </div>
      )}

      <div style={styles.dataGridContainer}>
        <DataGrid {...datagrid} styles={dataGridStyles} />
      </div>
    </div>
  )
}

export default FormDataGrid
