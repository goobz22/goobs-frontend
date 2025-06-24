'use client'

import React, { useMemo } from 'react'
import { Box, alpha, keyframes, Typography } from '@mui/material'
import ContentSection from '../../Content'
// Import the ProjectBoardProps type from your types folder:
import { ProjectBoardProps } from '../../ProjectBoard/types'

// Sacred geometry animations
const glowPulse = keyframes`
  0% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
    border-color: ${alpha('#FFD700', 0.5)};
  }
  50% { 
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
    border-color: ${alpha('#FFD700', 0.8)};
  }
  100% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
    border-color: ${alpha('#FFD700', 0.5)};
  }
`

const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
  33% { transform: translateY(-5px) rotate(120deg); opacity: 0.5; }
  66% { transform: translateY(2px) rotate(240deg); opacity: 0.4; }
  100% { transform: translateY(0px) rotate(360deg); opacity: 0.3; }
`

const sacredShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const taskFlowAnimation = keyframes`
  0% { 
    transform: translateX(-100%);
    opacity: 0;
  }
  50% { 
    opacity: 0.3;
  }
  100% { 
    transform: translateX(100%);
    opacity: 0;
  }
`

// Egyptian styling constants
const egyptianStyles = {
  goldColor: '#FFD700',
  goldGradient:
    'linear-gradient(135deg, #FFD700 0%, #F4A460 50%, #DAA520 100%)',
  darkGold: '#B8860B',
  textShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
  cardBackground: alpha('#000000', 0.85),
  glowEffect: `0 0 30px ${alpha('#FFD700', 0.3)}, 0 0 60px ${alpha('#FFD700', 0.1)}`,
}

// Sacred hieroglyphs for decoration
const SACRED_GLYPHS = [
  '𓁟', // Eye of Horus
  '𓂀', // Eye
  '𓃀', // Foot
  '𓄿', // Vulture
  '𓊖', // House
  '𓊗', // Road
  '𓋴', // Life/Ankh symbol
  '𓏏', // Bread
  '𓊨', // Gate
  '𓁦', // Face
  '𓅓', // Owl
  '𓆄', // Bee
  '𓇳', // Sun
  '𓈖', // Water
  '𓊹', // Shrine
  '𓊺', // Support
  '𓊻', // Shrine with serpent
  '𓋹', // Protection
  '𓌻', // Arm
  '𓍿', // Leg
  '𓅨', // Goose
  '𓂋', // Mouth
  '𓏭', // Scribe's kit
  '𓊵', // Cartouche
]

/**
 * Props for FormProjectBoard:
 * - A simple container that shows a title, description,
 *   and then renders a ProjectBoard via ContentSection.
 */
export interface FormProjectBoardProps {
  /** Title text displayed above the project board. */
  title: string

  /** Description text displayed under the title but above the project board. */
  description: string

  /** The data for the ProjectBoard (columns, tasks, etc.). */
  projectboard: ProjectBoardProps

  /** Enable Egyptian/Sacred theming */
  sacredtheme?: boolean
}

/**
 * FormProjectBoard replicates the idea of FormDataGrid:
 * - Displays title/description
 * - Renders the ProjectBoard through ContentSection (which uses useProjectBoard).
 */
function FormProjectBoard({
  title,
  description,
  projectboard,
  sacredtheme = true,
}: FormProjectBoardProps) {
  const containerStyles = useMemo(() => {
    const baseStyles = {
      width: '100%',
      height: 'auto',
      overflow: 'hidden',
      '& *': {
        overflow: 'hidden !important',
      },
    }

    if (!sacredtheme) return baseStyles

    return {
      ...baseStyles,
      position: 'relative' as const,
      bgcolor: egyptianStyles.cardBackground,
      backdropFilter: 'blur(20px)',
      border: `2px solid ${alpha(egyptianStyles.goldColor, 0.5)}`,
      borderRadius: '12px',
      padding: '24px',
      animation: `${glowPulse} 4s ease-in-out infinite`,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${egyptianStyles.goldColor}, transparent)`,
        backgroundSize: '200% 100%',
        animation: `${sacredShimmer} 3s linear infinite`,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${egyptianStyles.goldColor}, transparent)`,
        backgroundSize: '200% 100%',
        animation: `${sacredShimmer} 3s linear infinite`,
        animationDelay: '1.5s',
      },
    }
  }, [sacredtheme])

  const titleStyles = useMemo(() => {
    const baseStyles = {
      marginBottom: 0.5,
      width: '100%',
      textAlign: 'left' as const,
      fontFamily: 'Merriweather',
      marginLeft: sacredtheme ? 0 : 2,
      fontSize: '1.5rem',
      fontWeight: 400,
      color: 'black',
    }

    if (!sacredtheme) return baseStyles

    return {
      ...baseStyles,
      fontFamily: '"Cinzel", serif',
      color: egyptianStyles.goldColor,
      textShadow: egyptianStyles.textShadow,
      letterSpacing: '0.1em',
      fontSize: '1.75rem',
      fontWeight: 600,
      textAlign: 'center' as const,
      marginBottom: 1,
    }
  }, [sacredtheme])

  const descriptionStyles = useMemo(() => {
    const baseStyles = {
      width: '100%',
      textAlign: 'left' as const,
      fontFamily: 'Merriweather',
      fontSize: '1.25rem',
      marginLeft: sacredtheme ? 0 : 2,
      fontWeight: 400,
      color: 'black',
    }

    if (!sacredtheme) return baseStyles

    return {
      ...baseStyles,
      fontFamily: '"Crimson Text", serif',
      color: alpha('#ffffff', 0.9),
      textAlign: 'center' as const,
      fontSize: '1.1rem',
      letterSpacing: '0.05em',
      marginBottom: 2,
    }
  }, [sacredtheme])

  return (
    <Box sx={containerStyles}>
      {/* Top corner decorations */}
      {sacredtheme && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              color: alpha(egyptianStyles.goldColor, 0.3),
              fontSize: '18px',
              animation: `${floatAnimation} 5s ease-in-out infinite`,
              zIndex: 1,
            }}
          >
            {SACRED_GLYPHS[22]}{' '}
            {/* Scribe's kit - appropriate for project boards */}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: alpha(egyptianStyles.goldColor, 0.3),
              fontSize: '18px',
              animation: `${floatAnimation} 5s ease-in-out infinite reverse`,
              zIndex: 1,
            }}
          >
            {SACRED_GLYPHS[23]} {/* Cartouche - symbol of organization */}
          </Box>
        </>
      )}

      {/* Sacred glyphs decoration for header */}
      {sacredtheme && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1.5,
            mb: 1,
          }}
        >
          {[
            SACRED_GLYPHS[6],
            SACRED_GLYPHS[14],
            SACRED_GLYPHS[17],
            SACRED_GLYPHS[14],
            SACRED_GLYPHS[6],
          ].map((glyph, index) => (
            <Typography
              key={index}
              sx={{
                color: alpha(egyptianStyles.goldColor, 0.6),
                fontSize: '1rem',
                animation: `${floatAnimation} ${3 + index * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              {glyph}
            </Typography>
          ))}
        </Box>
      )}

      {/* Header area */}
      <Box
        sx={{
          marginTop: 1,
          marginBottom: sacredtheme ? 3 : 1,
          width: '100%',
          position: 'relative',
        }}
      >
        <Box sx={titleStyles}>{title}</Box>
        <Box sx={descriptionStyles}>{description}</Box>

        {/* Task flow animation */}
        {sacredtheme && (
          <Box
            sx={{
              position: 'absolute',
              bottom: -10,
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
                background: `linear-gradient(90deg, transparent, ${egyptianStyles.goldColor}, transparent)`,
                animation: `${taskFlowAnimation} 4s linear infinite`,
              },
            }}
          />
        )}
      </Box>

      {/* ProjectBoard wrapper with sacred styling */}
      <Box
        sx={
          sacredtheme
            ? {
                position: 'relative',
                borderRadius: '8px',
                overflow: 'visible',
                // Style the project board columns
                '& .project-board-container': {
                  backgroundColor: 'transparent',
                },
                // Style column headers
                '& .column-header': {
                  backgroundColor: alpha(egyptianStyles.goldColor, 0.1),
                  color: egyptianStyles.goldColor,
                  borderBottom: `2px solid ${alpha(egyptianStyles.goldColor, 0.3)}`,
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '12px',
                  borderRadius: '8px 8px 0 0',
                },
                // Style task cards
                '& .task-card': {
                  backgroundColor: alpha('#000000', 0.6),
                  border: `1px solid ${alpha(egyptianStyles.goldColor, 0.3)}`,
                  color: alpha('#ffffff', 0.9),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: alpha(egyptianStyles.goldColor, 0.1),
                    borderColor: egyptianStyles.goldColor,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(egyptianStyles.goldColor, 0.3)}`,
                  },
                },
                // Style drag preview
                '& .dragging': {
                  opacity: 0.8,
                  boxShadow: `0 0 20px ${alpha(egyptianStyles.goldColor, 0.6)}`,
                },
                // Style drop zones
                '& .drop-zone': {
                  backgroundColor: alpha(egyptianStyles.goldColor, 0.05),
                  border: `2px dashed ${alpha(egyptianStyles.goldColor, 0.3)}`,
                },
                // Style scrollbars
                '& ::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '& ::-webkit-scrollbar-track': {
                  backgroundColor: alpha('#000000', 0.3),
                  borderRadius: '4px',
                },
                '& ::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(egyptianStyles.goldColor, 0.5),
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: alpha(egyptianStyles.goldColor, 0.7),
                  },
                },
              }
            : {}
        }
      >
        {/* Use ContentSection to render the "projectboard" (via useProjectBoard). */}
        <ContentSection
          grids={[
            {
              projectboard: projectboard, // Pass the whole projectboard prop directly
            },
          ]}
          sacredtheme={sacredtheme}
        />
      </Box>

      {/* Bottom decoration */}
      {sacredtheme && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 0.5,
            mt: 2,
            opacity: 0.5,
          }}
        >
          {['𓊖', '𓊗', '𓊖'].map((glyph, index) => (
            <Typography
              key={index}
              sx={{
                color: egyptianStyles.goldColor,
                fontSize: '12px',
                animation: `${floatAnimation} ${2 + index * 0.3}s ease-in-out infinite`,
              }}
            >
              {glyph}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default FormProjectBoard
