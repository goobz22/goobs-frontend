// src/components/Form/DataGrid/index.tsx

'use client'

import React from 'react'
import type { DatagridProps } from '../../DataGrid/types'
import DataGrid from '../../DataGrid'
import MetricSection from '../../DataGrid/MetricSection'
import Typography from '../../Typography'
import Alert, { AlertProps } from '../../Alert'
import LinearProgress from '../../LinearProgress'
import { SACRED_GLYPHS } from '../../../styles/sacredGlyphs'

export interface FormDataGridProps {
  title: string
  description: string
  datagrid: DatagridProps
  sacredtheme?: boolean
  isLoading?: boolean
  alert?: AlertProps
}

const getStyles = (sacredtheme?: boolean) => ({
  container: {
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
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
  headerGlyph: {
    color: 'rgba(255, 215, 0, 0.6)',
    fontSize: '1rem',
    animation: 'form-datagrid-float 4s infinite alternate',
  } as React.CSSProperties,
  titleContainer: {
    marginTop: '0.25rem',
    marginBottom: '0.75rem',
    width: '100%',
  } as React.CSSProperties,
  title: {
    marginBottom: '0.125rem',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Merriweather, serif',
    fontSize: '1.5rem',
    fontWeight: 400,
    color: 'black',
    ...(sacredtheme && {
      fontFamily: 'Cinzel, serif',
      color: '#FFD700',
      textShadow: '0 0 10px rgba(255,215,0,0.5)',
      letterSpacing: '0.1em',
      fontSize: '1.875rem',
      fontWeight: 600,
      textAlign: 'center',
      marginBottom: '0.25rem',
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
  metricsContainer: {
    marginBottom: '0.75rem',
  } as React.CSSProperties,
  alertContainer: {
    marginBottom: '0.75rem',
  } as React.CSSProperties,
  dataGridContainer: {
    ...(sacredtheme && {
      position: 'relative',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      backgroundColor: 'rgba(0,0,0,0.5)',
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
  isLoading = false,
  alert,
}: FormDataGridProps) {
  const { metrics, ...dataGridPropsWithoutMetrics } = datagrid
  const styles = getStyles(sacredtheme)

  if (isLoading) {
    return (
      <div style={styles.container}>
        {sacredtheme && (
          <>
            <div style={{ ...styles.glyph, top: '0.75rem', left: '0.75rem' }}>
              {SACRED_GLYPHS[10]}
            </div>
            <div
              style={{
                ...styles.glyph,
                top: '0.75rem',
                right: '0.75rem',
                animationDirection: 'reverse',
              }}
            >
              {SACRED_GLYPHS[11]}
            </div>
          </>
        )}
        {sacredtheme && (
          <div style={styles.headerGlyphs}>
            {[
              SACRED_GLYPHS[13],
              SACRED_GLYPHS[3],
              SACRED_GLYPHS[23],
              SACRED_GLYPHS[3],
              SACRED_GLYPHS[13],
            ].map((glyph, index) => (
              <Typography
                key={index}
                style={{
                  ...styles.headerGlyph,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {glyph}
              </Typography>
            ))}
          </div>
        )}
        <div style={styles.titleContainer}>
          <div style={styles.title}>{title}</div>
          <div style={styles.description}>{description}</div>
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <LinearProgress sacredtheme={sacredtheme} />
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {sacredtheme && (
        <>
          <div style={{ ...styles.glyph, top: '0.75rem', left: '0.75rem' }}>
            {SACRED_GLYPHS[10]}
          </div>
          <div
            style={{
              ...styles.glyph,
              top: '0.75rem',
              right: '0.75rem',
              animationDirection: 'reverse',
            }}
          >
            {SACRED_GLYPHS[11]}
          </div>
        </>
      )}

      {sacredtheme && (
        <div style={styles.headerGlyphs}>
          {[
            SACRED_GLYPHS[13],
            SACRED_GLYPHS[3],
            SACRED_GLYPHS[23],
            SACRED_GLYPHS[3],
            SACRED_GLYPHS[13],
          ].map((glyph, index) => (
            <Typography
              key={index}
              style={{
                ...styles.headerGlyph,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              {glyph}
            </Typography>
          ))}
        </div>
      )}

      <div style={{ ...styles.titleContainer, position: 'relative' }}>
        <div style={styles.title}>{title}</div>
        <div style={styles.description}>{description}</div>
        {sacredtheme && <div style={styles.shimmer} />}
      </div>

      {metrics && Array.isArray(metrics) && metrics.length > 0 && (
        <div style={styles.metricsContainer}>
          <MetricSection metrics={metrics} sacredtheme={sacredtheme} />
        </div>
      )}

      {alert && !isLoading && (
        <div style={styles.alertContainer}>
          <Alert
            severity={alert.severity}
            message={alert.message}
            onClose={alert.onClose}
            sacredtheme={sacredtheme}
          />
        </div>
      )}

      <div style={styles.dataGridContainer}>
        <DataGrid {...dataGridPropsWithoutMetrics} sacredtheme={sacredtheme} />
      </div>

      {sacredtheme && (
        <div style={styles.footerGlyphs}>
          {['𓊖', '𓊗', '𓊖'].map((glyph, index) => (
            <Typography
              key={index}
              style={{
                ...styles.footerGlyph,
                animationDelay: `${2 + index * 0.3}s`,
              }}
            >
              {glyph}
            </Typography>
          ))}
        </div>
      )}
    </div>
  )
}

export default FormDataGrid
