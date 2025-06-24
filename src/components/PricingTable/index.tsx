'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Box, Paper, SelectChangeEvent, keyframes, alpha } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Typography } from '../Typography'
import StyledTooltip from '../Tooltip'
import CustomButton from '../Button'
import Dropdown from '../Field/Dropdown/Regular'
import { black, white, stainlessSteel, aqua } from '../../styles/palette'

// Sacred theming constants
const SACRED_GLYPHS = ['𓁟', '𓂀', '𓃀', '𓄿', '𓊖', '𓊗', '𓋴', '𓏏', '𓊨', '𓁦']

const sacredGlowPulse = keyframes`
  0% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5); }
  100% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3); }
`

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`

const rotateGlyph = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export interface PricingProps {
  tabletitle?: {
    text: string
  }
  packagecolumns?: {
    packagenames: string[]
  }
  monthlyprice?: {
    prices: string[]
  }
  annualprice?: {
    annualprices: string[]
  }
  features?: Feature[]
  buttoncolumns?: {
    buttontexts: string[]
    buttonlinks: string[]
  }
  /**
   * A router with a push method (e.g. from Next.js) to handle navigation.
   */
  router?: {
    push(url: string): void
  }
  /** NEW: Enable Egyptian/Sacred theming */
  sacredtheme?: boolean
}

export interface SubFeature {
  title: string
  infopopuptext?: string
  tiedtopackage?: {
    tiedtopackages: string[]
  }
}

export interface Feature {
  title: string
  infopopuptext?: string
  subfeatures?: SubFeature[]
  tiedtopackage?: {
    tiedtopackages: string[]
  }
}

const PricingTable: React.FC<PricingProps> = props => {
  const { router, sacredtheme } = props

  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState('')

  // Use props directly as the configuration
  const config = props

  useEffect(() => {
    if (
      config.packagecolumns?.packagenames &&
      config.packagecolumns.packagenames.length > 0
    ) {
      setSelectedPackage(config.packagecolumns.packagenames[0])
    }
  }, [config.packagecolumns?.packagenames])

  const handlePackageChange = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      const newValue = event.target.value as string
      const newIndex =
        config.packagecolumns?.packagenames?.indexOf(newValue) ?? 0
      setSelectedPackageIndex(newIndex)
      setSelectedPackage(newValue)
    },
    [config.packagecolumns?.packagenames]
  )

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: '6px',
        borderTop: sacredtheme
          ? `12px solid #FFD700`
          : `12px solid ${aqua.main}`,
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        height: '100%',
        ...(sacredtheme && {
          backgroundColor: '#0a0a0a',
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
            radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
          `,
          border: `1px solid ${alpha('#FFD700', 0.3)}`,
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: `"${SACRED_GLYPHS[0]}"`,
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontSize: '24px',
            color: alpha('#FFD700', 0.2),
            animation: `${rotateGlyph} 15s linear infinite`,
          },
        }),
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: sacredtheme
            ? `1px solid ${alpha('#FFD700', 0.3)}`
            : '1px solid #ccc',
          ...(sacredtheme && {
            background: `linear-gradient(135deg, ${alpha('#FFD700', 0.1)} 0%, transparent 100%)`,
          }),
        }}
      >
        {config.tabletitle && (
          <Typography
            text={config.tabletitle.text || ''}
            fontcolor={sacredtheme ? '#FFD700' : undefined}
            sx={
              sacredtheme
                ? {
                    animation: `${sacredGlowPulse} 3s ease-in-out infinite`,
                    fontWeight: 600,
                    letterSpacing: '1px',
                  }
                : undefined
            }
          />
        )}
        {config.packagecolumns && (
          <Box sx={sacredtheme ? { minWidth: '200px' } : undefined}>
            <Dropdown
              label="Packages"
              options={(config.packagecolumns.packagenames || []).map(name => ({
                value: name,
              }))}
              defaultValue={selectedPackage}
              onChange={handlePackageChange}
              backgroundcolor={sacredtheme ? alpha('#000000', 0.6) : undefined}
              outlinecolor={sacredtheme ? '#FFD700' : undefined}
              fontcolor={sacredtheme ? '#FFD700' : undefined}
              shrunkfontcolor={sacredtheme ? '#FFD700' : undefined}
            />
          </Box>
        )}
        {config.monthlyprice && (
          <Typography
            text={config.monthlyprice.prices?.[selectedPackageIndex] || ''}
            fontcolor={sacredtheme ? '#FFD700' : undefined}
            sx={
              sacredtheme
                ? {
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                  }
                : undefined
            }
          />
        )}
        {config.annualprice && (
          <Typography
            text={config.annualprice.annualprices?.[selectedPackageIndex] || ''}
            fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : undefined}
            sx={
              sacredtheme
                ? {
                    fontStyle: 'italic',
                  }
                : undefined
            }
          />
        )}
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          ...(sacredtheme && {
            '& .MuiSvgIcon-root': {
              color: '#FFD700',
              filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
            },
          }),
        }}
      >
        {config.features?.map((feature, featureIndex) => (
          <Box key={`feature-${featureIndex}`} sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center">
              <Typography
                text={feature.title}
                fontcolor={sacredtheme ? '#FFD700' : undefined}
                sx={
                  sacredtheme
                    ? {
                        fontWeight: 500,
                        letterSpacing: '0.5px',
                      }
                    : undefined
                }
              />
              {feature.infopopuptext && (
                <Box ml={1} display="flex" alignItems="center">
                  <StyledTooltip
                    arrow
                    tooltipcolor={sacredtheme ? '#FFD700' : stainlessSteel.main}
                    tooltipplacement="right"
                    title={feature.infopopuptext}
                    offsetX={0}
                    offsetY={0}
                  >
                    <InfoIcon fontSize="small" />
                  </StyledTooltip>
                </Box>
              )}
              {feature.tiedtopackage && (
                <Box ml={1} display="flex" alignItems="center">
                  {feature.tiedtopackage.tiedtopackages?.[
                    selectedPackageIndex
                  ] ? (
                    <CheckCircleIcon
                      fontSize="small"
                      sx={
                        sacredtheme
                          ? {
                              animation: `${floatAnimation} 2s ease-in-out infinite`,
                            }
                          : undefined
                      }
                    />
                  ) : (
                    <Box sx={{ width: '24px', height: '24px' }} />
                  )}
                </Box>
              )}
            </Box>
            {feature.subfeatures?.map((subFeature, subFeatureIndex) => (
              <Box
                key={`subfeature-${subFeatureIndex}`}
                display="flex"
                alignItems="center"
                ml={3}
                mt={1}
              >
                <Typography
                  text={subFeature.title}
                  fontcolor={sacredtheme ? alpha('#FFD700', 0.9) : undefined}
                />
                {subFeature.infopopuptext && (
                  <Box ml={1} display="flex" alignItems="center">
                    <StyledTooltip
                      arrow
                      tooltipcolor={
                        sacredtheme ? '#FFD700' : stainlessSteel.main
                      }
                      tooltipplacement="right"
                      title={subFeature.infopopuptext}
                      offsetX={0}
                      offsetY={0}
                    >
                      <InfoIcon fontSize="small" />
                    </StyledTooltip>
                  </Box>
                )}
                {subFeature.tiedtopackage && (
                  <Box ml={1} display="flex" alignItems="center">
                    {subFeature.tiedtopackage.tiedtopackages?.[
                      selectedPackageIndex
                    ] ? (
                      <CheckCircleIcon fontSize="small" />
                    ) : (
                      <Box sx={{ width: '24px', height: '24px' }} />
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Button Section */}
      {config.buttoncolumns && (
        <Box
          sx={{
            p: 2,
            ...(sacredtheme && {
              borderTop: `1px solid ${alpha('#FFD700', 0.3)}`,
              background: `linear-gradient(0deg, ${alpha('#FFD700', 0.05)} 0%, transparent 100%)`,
            }),
          }}
        >
          <CustomButton
            variant="contained"
            backgroundcolor={sacredtheme ? '#FFD700' : black.main}
            fontcolor={sacredtheme ? '#000000' : white.main}
            href={config.buttoncolumns.buttonlinks[selectedPackageIndex] || '#'}
            width="100%"
            onClick={() => {
              if (router && config.buttoncolumns) {
                router.push(
                  config.buttoncolumns.buttonlinks[selectedPackageIndex] || '#'
                )
              } else {
                console.warn('No router provided; skipping navigation.')
              }
            }}
            text={config.buttoncolumns.buttontexts[selectedPackageIndex] || ''}
            sacredtheme={sacredtheme}
          />
        </Box>
      )}

      {/* Sacred decorative footer */}
      {sacredtheme && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            pb: 1,
          }}
        >
          {['𓊹', '𓋹', '𓊹'].map((glyph, i) => (
            <Box
              key={i}
              sx={{
                color: alpha('#FFD700', 0.3),
                fontSize: 12,
                animation: `${floatAnimation} ${2 + i * 0.3}s ease-in-out infinite`,
              }}
            >
              {glyph}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  )
}

export default PricingTable
