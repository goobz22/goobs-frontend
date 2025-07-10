'use client'

import React, { useEffect } from 'react'
import ContentSection from '../../Content'
import { ProjectBoardProps } from '../../ProjectBoard/types'
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
  } as React.CSSProperties,

  titleContainer: {
    marginTop: '4px',
    marginBottom: '12px',
    width: '100%',
    position: 'relative',
  } as React.CSSProperties,

  title: {
    marginBottom: '2px',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Merriweather, serif',
    fontSize: '24px',
    fontWeight: 'normal',
    color: 'rgba(0, 0, 0, 1)',
  } as React.CSSProperties,

  description: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Merriweather, serif',
    fontSize: '20px',
    fontWeight: 'normal',
    color: 'rgba(0, 0, 0, 1)',
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
    padding: '24px',
    animation: 'formProjectBoardGlowPulse 4s ease-in-out infinite',
  } as React.CSSProperties,

  topShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background:
      'linear-gradient(90deg, transparent, rgba(255, 215, 0, 1), transparent)',
    animation: 'formProjectBoardShimmer 3s linear infinite',
  } as React.CSSProperties,

  bottomShimmer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background:
      'linear-gradient(90deg, transparent, rgba(255, 215, 0, 1), transparent)',
    animation: 'formProjectBoardShimmer 3s linear infinite',
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
  } as React.CSSProperties,

  title: {
    marginBottom: '4px',
    width: '100%',
    textAlign: 'center',
    fontFamily: '"Cinzel", serif',
    fontSize: '30px',
    fontWeight: 600,
    color: 'rgba(255, 215, 0, 1)',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
    letterSpacing: '0.05em',
  } as React.CSSProperties,

  description: {
    width: '100%',
    textAlign: 'center',
    fontFamily: '"Crimson Text", serif',
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: '0.025em',
    marginBottom: '8px',
  } as React.CSSProperties,

  underline: {
    position: 'absolute',
    bottom: '-10px',
    left: 0,
    right: 0,
    height: '2px',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(90deg, transparent, rgba(255, 215, 0, 1), transparent)',
      animation: 'formProjectBoardTaskFlow 4s linear infinite',
    },
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
  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes formProjectBoardGlowPulse {
          0%, 100% { 
            border-color: rgba(255, 215, 0, 0.5);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          }
          50% { 
            border-color: rgba(255, 215, 0, 0.8);
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
          }
        }
        @keyframes formProjectBoardShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes formProjectBoardFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-5px) rotate(180deg); opacity: 0.5; }
        }
        @keyframes formProjectBoardTaskFlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [sacredtheme])

  const styles = sacredtheme ? sacredStyles : premiumStyles

  return (
    <div style={styles.container}>
      {sacredtheme && (
        <>
          <div style={sacredStyles.topShimmer} />
          <div style={sacredStyles.bottomShimmer} />
          <div
            style={{
              ...sacredStyles.decorativeGlyph,
              ...sacredStyles.topLeftGlyph,
            }}
          >
            {SACRED_GLYPHS[22]}
          </div>
          <div
            style={{
              ...sacredStyles.decorativeGlyph,
              ...sacredStyles.topRightGlyph,
            }}
          >
            {SACRED_GLYPHS[23]}
          </div>
        </>
      )}

      {sacredtheme && (
        <div style={sacredStyles.headerGlyphs}>
          {[
            SACRED_GLYPHS[6],
            SACRED_GLYPHS[14],
            SACRED_GLYPHS[17],
            SACRED_GLYPHS[14],
            SACRED_GLYPHS[6],
          ].map((glyph, index) => (
            <Typography
              key={index}
              style={{
                color: 'rgba(255, 215, 0, 0.6)',
                fontSize: '16px',
                animation: 'formProjectBoardFloat 5s ease-in-out infinite',
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

      {sacredtheme && (
        <div style={sacredStyles.bottomGlyphs}>
          {['𓊖', '𓊗', '𓊖'].map((glyph, index) => (
            <Typography
              key={index}
              style={{
                color: 'rgba(255, 215, 0, 1)',
                fontSize: '12px',
                animation: 'formProjectBoardFloat 5s ease-in-out infinite',
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

export default FormProjectBoard
