'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Box, Paper, SelectChangeEvent } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Typography } from '../Typography'
import StyledTooltip from '../Tooltip'
import CustomButton from '../Button'
import Dropdown from '../Dropdown'
import { black, white, stainlessSteel, aqua } from '../../styles/palette'

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
  const { router } = props

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
        borderTop: `12px solid ${aqua.main}`,
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        height: '100%',
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
          borderBottom: '1px solid #ccc',
        }}
      >
        {config.tabletitle && (
          <Typography text={config.tabletitle.text || ''} />
        )}
        {config.packagecolumns && (
          <Dropdown
            label="Packages"
            options={(config.packagecolumns.packagenames || []).map(name => ({
              value: name,
            }))}
            defaultValue={selectedPackage}
            onChange={handlePackageChange}
          />
        )}
        {config.monthlyprice && (
          <Typography
            text={config.monthlyprice.prices?.[selectedPackageIndex] || ''}
          />
        )}
        {config.annualprice && (
          <Typography
            text={config.annualprice.annualprices?.[selectedPackageIndex] || ''}
          />
        )}
      </Box>

      {/* Features Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
        {config.features?.map((feature, featureIndex) => (
          <Box key={`feature-${featureIndex}`} sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center">
              <Typography text={feature.title} />
              {feature.infopopuptext && (
                <Box ml={1} display="flex" alignItems="center">
                  <StyledTooltip
                    arrow
                    tooltipcolor={stainlessSteel.main}
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
                    <CheckCircleIcon fontSize="small" />
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
                <Typography text={subFeature.title} />
                {subFeature.infopopuptext && (
                  <Box ml={1} display="flex" alignItems="center">
                    <StyledTooltip
                      arrow
                      tooltipcolor={stainlessSteel.main}
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
        <Box sx={{ p: 2 }}>
          <CustomButton
            variant="contained"
            backgroundcolor={black.main}
            fontcolor={white.main}
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
          />
        </Box>
      )}
    </Paper>
  )
}

export default PricingTable
