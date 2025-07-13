'use client'

import React, { useMemo } from 'react'
import ContentSection, { ContentSectionProps } from '../../Content'
import { TypographyProps } from '../../Typography'
import CustomButton, { ButtonProps } from '../../Button'
import Typography from '../../Typography'

const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
]

export interface CustomDialogProps {
  title?: string
  description?: string
  grids?: ContentSectionProps['grids']
  content?: React.ReactNode
  width?: number
  buttons?: ButtonProps[]
  sacredtheme?: boolean
}

const getStyles = (sacredtheme?: boolean, width?: number) => ({
  container: {
    width: `${width}px`,
    maxWidth: '100%',
    maxHeight: '90vh',
    margin: 'auto',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    ...(sacredtheme
      ? {
          position: 'relative',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(255, 215, 0, 0.5)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          animation: 'dialog-glow-pulse 2s infinite alternate',
        }
      : {
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow:
            '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
          padding: '1.5rem',
        }),
  } as React.CSSProperties,
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    backgroundImage:
      'linear-gradient(to right, transparent, #FFD700, transparent)',
    animation: 'dialog-shimmer 3s infinite',
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    color: 'rgba(255, 215, 0, 0.3)',
    fontSize: '1.125rem',
    zIndex: 10,
    animation: 'dialog-float 8s infinite alternate',
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
    animation: 'dialog-float 4s infinite alternate',
  } as React.CSSProperties,
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '0.5rem',
    marginTop: '1rem',
    ...(sacredtheme && {
      borderTop: '1px solid rgba(255, 215, 0, 0.2)',
      paddingTop: '1rem',
    }),
  } as React.CSSProperties,
  contentContainer: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
    paddingRight: '0.625rem',
    ...(sacredtheme && {
      position: 'relative',
      zIndex: 10,
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
    animation: 'dialog-float 3s infinite alternate',
  } as React.CSSProperties,
})

function CustomDialog({
  title,
  description,
  grids,
  content,
  width = 450,
  buttons,
  sacredtheme = true,
}: CustomDialogProps) {
  const styles = getStyles(sacredtheme, width)
  const headerGrid = useMemo(
    (): ContentSectionProps['grids'][0] => ({
      typography: [
        {
          text: title,
          variant: 'merrih4',
          styles: {
            color: sacredtheme ? '#FFD700' : 'black',
            theme: sacredtheme ? 'sacred' : 'light',
          },
        },
        {
          text: description,
          variant: 'merrih5',
          styles: {
            color: sacredtheme ? 'rgba(255, 255, 255, 0.9)' : 'black',
            theme: sacredtheme ? 'sacred' : 'light',
          },
        },
      ] as TypographyProps[],
    }),
    [title, description, sacredtheme]
  )

  const renderHeader = useMemo(() => {
    if (!title && !description) return null
    return (
      <>
        {sacredtheme && (
          <div style={styles.headerGlyphs}>
            {SACRED_GLYPHS.slice(0, 5).map((glyph, index) => (
              <Typography key={index}>{glyph}</Typography>
            ))}
          </div>
        )}
        <ContentSection grids={[headerGrid]} />
      </>
    )
  }, [headerGrid, sacredtheme, title, description, styles])

  const renderButtons = useMemo(() => {
    if (!buttons || buttons.length === 0) return null
    return (
      <div style={styles.buttonContainer}>
        {buttons.map((buttonProps: ButtonProps, index: number) => (
          <CustomButton
            key={index}
            {...buttonProps}
            styles={{
              theme: sacredtheme ? 'sacred' : 'light',
              ...buttonProps.styles,
            }}
          />
        ))}
      </div>
    )
  }, [buttons, sacredtheme, styles])

  return (
    <div style={styles.container}>
      {sacredtheme && (
        <>
          <div style={{ ...styles.shimmer, animationDelay: '0s' }} />
          <div
            style={{
              ...styles.shimmer,
              bottom: 0,
              top: 'auto',
              animationDelay: '1.5s',
            }}
          />
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

      {renderHeader}

      <div style={styles.contentContainer}>
        {content ||
          (grids && <ContentSection grids={grids} sacredtheme={sacredtheme} />)}
      </div>

      {renderButtons}

      {sacredtheme && (
        <div style={styles.footerGlyphs}>
          {['𓊖', '𓊗', '𓊖'].map((glyph, index) => (
            <Typography key={index}>{glyph}</Typography>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomDialog
