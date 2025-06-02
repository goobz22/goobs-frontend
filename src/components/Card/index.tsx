// src/components/Card/variants/defaultconfig/index.tsx

import React from 'react'
import {
  Box,
  Paper,
  useMediaQuery,
  useTheme,
  keyframes,
  alpha,
} from '@mui/material'
import Typography from '../Typography'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import InfoIcon from '@mui/icons-material/Info'
import StyledTooltip from '../Tooltip'
import CustomButton from '../Button'
import Link from 'next/link'
import FavoriteIcon from '../Icons/FavoriteIcon'
import { CustomStepper, CustomStepperProps } from '../Stepper'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

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

const sacredGlowPulse = keyframes`
  0% { 
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.2);
  }
  50% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.3);
  }
  100% { 
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.2);
  }
`

const sacredShimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const floatGlyph = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-5px) rotate(180deg); opacity: 0.6; }
  100% { transform: translateY(0px) rotate(360deg); opacity: 0.3; }
`

/**
 * Props for the DefaultCard component.
 */
interface DefaultCardProps {
  /** Title of the card */
  title?: string
  /** Whether to show an underline for the title */
  titleUnderline?: boolean
  /** Body text of the card */
  body?: string
  /** URL or path of the image to display */
  image?: string
  /** Position of the image in the card */
  imagePosition?: 'top' | 'left'
  /** Text for the parent breadcrumb */
  parentText?: string
  /** Link for the parent breadcrumb */
  parentLink?: string
  /** Text for the child breadcrumb */
  childText?: string
  /** Link for the child breadcrumb */
  childLink?: string
  /** Link for the grandchild breadcrumb */
  grandchildLink?: string
  /** Whether to enable the favorite feature */
  favoriteEnabled?: boolean
  /** Whether to show breadcrumbs */
  breadcrumbEnabled?: boolean
  /** Whether to enable links */
  linkEnabled?: boolean
  /** Width of the card */
  width?: string | number
  /** Height of the card */
  height?: string | number
  /** Whether to show a stepper */
  stepperEnabled?: boolean
  /** Active step in the stepper */
  stepperActiveStep?: number
  /** Steps configuration for the stepper */
  stepperSteps?: CustomStepperProps['steps']
  /** Enable Egyptian/Sacred theming */
  sacredTheme?: boolean
}

/**
 * DefaultCard component renders a customizable card with various features such as
 * image, title, body text, breadcrumbs, favorite icon, and stepper.
 * It adapts its layout based on the screen size and provided props.
 */
const DefaultCard: React.FC<DefaultCardProps> = ({
  title,
  titleUnderline = true,
  body,
  image,
  imagePosition = 'top',
  parentText = 'Parent',
  parentLink = '/',
  childText = 'Child',
  childLink = '/',
  grandchildLink = '/',
  favoriteEnabled = false,
  breadcrumbEnabled = false,
  linkEnabled = false,
  width = '100%',
  height,
  stepperEnabled = false,
  stepperActiveStep = -1,
  stepperSteps = [],
  sacredTheme = false,
}) => {
  const theme = useTheme()
  /** Determines if the current viewport is mobile size */
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Paper
      elevation={1}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection:
          imagePosition === 'left' ? 'row' : isMobile ? 'row' : 'column',
        justifyContent: isMobile ? 'space-between' : 'flex-start',
        alignItems: isMobile ? 'center' : 'stretch',
        border: sacredTheme
          ? `1px solid ${alpha('#FFD700', 0.3)}`
          : '1px solid #e8e8e8',
        width: width,
        height: height,
        backgroundColor: sacredTheme ? '#0a0a0a' : 'white',
        overflow: 'hidden',
        ...(sacredTheme && {
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
            radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
          `,
          animation: `${sacredGlowPulse} 4s ease-in-out infinite`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, transparent, ${alpha('#FFD700', 0.1)}, transparent)`,
            backgroundSize: '200% 100%',
            animation: `${sacredShimmer} 3s ease-in-out infinite`,
            pointerEvents: 'none',
            zIndex: 1,
          },
          '&::after': {
            content: `"${SACRED_GLYPHS[8]}"`,
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            color: alpha('#FFD700', 0.2),
            fontSize: '48px',
            animation: `${floatGlyph} 8s ease-in-out infinite`,
            zIndex: 0,
          },
        }),
      }}
    >
      {/* Render image if provided */}
      {image && (
        <Box
          sx={{
            width: imagePosition === 'left' ? '200px' : '100%',
            height: imagePosition === 'left' ? '100%' : '200px',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            flexShrink: 0,
            position: 'relative',
            zIndex: 2,
            ...(sacredTheme && {
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(to bottom, transparent 60%, ${alpha('#000000', 0.7)} 100%)`,
              },
            }),
          }}
        />
      )}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Render title and favorite icon if title is provided */}
        {title && (
          <Box
            sx={{
              borderBottom: sacredTheme
                ? `1px solid ${alpha('#FFD700', 0.3)}`
                : titleUnderline
                  ? '1px solid #e8e8e8'
                  : 'none',
              width: '100%',
              paddingLeft: '15px',
              paddingRight: '15px',
              paddingBottom: '10px',
              paddingTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              ...(sacredTheme && {
                background: `linear-gradient(to right, ${alpha('#FFD700', 0.05)}, transparent)`,
              }),
            }}
          >
            <Typography
              text={title}
              fontcolor={sacredTheme ? '#FFD700' : 'black'}
              fontvariant="merrih5"
              sx={
                sacredTheme
                  ? {
                      fontFamily: '"Cinzel", serif',
                      fontWeight: 600,
                      letterSpacing: '1px',
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                    }
                  : undefined
              }
            />
            {favoriteEnabled && <FavoriteIcon sacredTheme={sacredTheme} />}
          </Box>
        )}
        {/* Render body text or info icon for mobile */}
        {body && (
          <Box sx={{ padding: isMobile ? '0 15px' : '16px 15px' }}>
            {!isMobile && (
              <Typography
                text={body}
                fontcolor={sacredTheme ? alpha('#FFD700', 0.8) : 'black'}
                fontvariant="merriparagraph"
                sx={
                  sacredTheme
                    ? {
                        letterSpacing: '0.5px',
                      }
                    : undefined
                }
              />
            )}
            {isMobile && (
              <StyledTooltip
                title={body}
                placement="right"
                arrow
                tooltipcolor={sacredTheme ? '#FFD700' : 'black'}
                tooltipplacement="right"
                offsetX={0}
                offsetY={0}
                disableHoverListener
              >
                <InfoIcon
                  style={{
                    color: sacredTheme ? '#FFD700' : 'black',
                    cursor: 'pointer',
                    filter: sacredTheme
                      ? 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))'
                      : 'none',
                  }}
                />
              </StyledTooltip>
            )}
          </Box>
        )}
        {/* Render stepper if enabled */}
        {stepperEnabled && (
          <Box sx={{ padding: '0px 15px' }}>
            <CustomStepper
              activeStep={stepperActiveStep}
              nonLinear
              orientation="vertical"
              steps={stepperSteps}
              sacredTheme={sacredTheme}
              sx={{
                '.MuiStepIcon-text': { display: 'none' },
                '.MuiStepConnector-line': { display: 'none' },
              }}
            />
          </Box>
        )}
        {/* Render breadcrumbs and link button */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '15px',
            paddingRight: '15px',
            paddingBottom: '10px',
            marginTop: 'auto',
          }}
        >
          <Box>
            {breadcrumbEnabled && (
              <>
                <Link href={parentLink} passHref>
                  <Typography
                    text={parentText}
                    fontcolor={sacredTheme ? alpha('#FFD700', 0.7) : 'black'}
                    fontvariant="merriparagraph"
                    sx={
                      sacredTheme
                        ? {
                            '&:hover': {
                              color: '#FFD700',
                              textDecoration: 'underline',
                            },
                          }
                        : undefined
                    }
                  />
                </Link>
                <Typography
                  text=">"
                  fontcolor={sacredTheme ? alpha('#FFD700', 0.5) : 'black'}
                  fontvariant="merriparagraph"
                />
                <Link href={childLink} passHref>
                  <Typography
                    text={childText}
                    fontcolor={sacredTheme ? alpha('#FFD700', 0.7) : 'black'}
                    fontvariant="merriparagraph"
                    sx={
                      sacredTheme
                        ? {
                            '&:hover': {
                              color: '#FFD700',
                              textDecoration: 'underline',
                            },
                          }
                        : undefined
                    }
                  />
                </Link>
              </>
            )}
          </Box>
          <Box sx={{ paddingLeft: '10px' }}>
            {linkEnabled && (
              <Link href={grandchildLink} passHref>
                <CustomButton
                  icon={<ArrowForwardIosIcon />}
                  iconcolor={sacredTheme ? '#FFD700' : 'black'}
                  iconsize="15px"
                  iconlocation="right"
                  backgroundcolor="none"
                  variant="text"
                  sacredTheme={sacredTheme}
                />
              </Link>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default DefaultCard
