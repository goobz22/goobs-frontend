'use client'
import React, { useState } from 'react'
import { Box, Paper } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Typography } from '../Typography'
import StyledTooltip from '../Tooltip'
import CustomButton from '../Button'
import StyledComponent from '../StyledComponent'
import CustomGrid from '@/components/Grid'
import { columnconfig, gridconfig } from '@/components/Grid/'
import defaultConfig from './defaultconfig'
import { useRouter } from 'next/navigation'
import {
  black,
  white,
  semiTransparentBlack,
  stainlessSteel,
  aqua,
} from '../../styles/palette'

/**
 * Interface for sub-features in the pricing table
 */
interface SubFeature {
  title: string
  titlelink?: string
  infopopuptext?: string
  columnconfig?: columnconfig
  tiedtopackage?: {
    row?: number
    column?: number
    tiedtopackages?: string
    mobilewidth?: string
    tabletwidth?: string
    computerwidth?: string
  }
}

/**
 * Interface for main features in the pricing table
 */
interface Feature {
  title: string
  infopopuptext?: string
  titlelink?: string
  subfeatures: SubFeature[]
  columnconfig?: columnconfig
  tiedtopackage?: {
    row?: number
    column?: number
    tiedtopackages?: string
    mobilewidth?: string
    tabletwidth?: string
    computerwidth?: string
  }
}

/**
 * Interface for the props of the PricingTable component
 */
export interface PricingProps {
  headerGridConfig?: gridconfig
  tabletitle?: {
    text?: string
    columnconfig?: columnconfig
  }
  packagecolumns?: {
    columnheaders?: string
    packagenames?: string
    columnconfig?: columnconfig
  }
  monthlyprice?: {
    prices?: string
    columnconfig?: columnconfig
  }
  annualprice?: {
    annualprices?: string
    columnconfig?: columnconfig
  }
  featureGridConfig?: gridconfig
  features?: Feature[]
  buttoncolumns?: {
    buttontexts?: string
    buttonlinks?: string
    columnconfig?: columnconfig
  }
}

/**
 * PricingTable component for rendering a customizable pricing table
 * @param {PricingProps} props - The props for the component
 * @returns {JSX.Element} The rendered PricingTable component
 */
const PricingTable: React.FC<PricingProps> = props => {
  // Merge default config with provided props
  const config: PricingProps = { ...defaultConfig, ...props }

  // State for selected package
  const [selectedPackage, setSelectedPackage] = useState<string>(
    'goobs-frontend-unlimited'
  )

  const router = useRouter()

  /**
   * Renders column configurations for the pricing table
   * @returns {{ headerColumnConfigs: columnconfig[], featureColumnConfigs: columnconfig[] }}
   */
  const renderColumnConfigs = () => {
    const headerColumnConfigs: columnconfig[] = []
    const featureColumnConfigs: columnconfig[] = []

    // Render table title
    if (config.tabletitle && config.tabletitle.columnconfig) {
      headerColumnConfigs.push({
        ...config.tabletitle.columnconfig,
        component: (
          <Typography
            text={config.tabletitle.text || ''}
            fontcolor={black.main}
            fontvariant="merrih4"
            noWrap
          />
        ),
      })
    }

    // Render package dropdown
    if (config.packagecolumns && config.packagecolumns.columnconfig) {
      headerColumnConfigs.push({
        ...config.packagecolumns.columnconfig,
        component: (
          <StyledComponent
            label="Packages"
            shrunklabellocation="above"
            componentvariant="dropdown"
            shrunkfontcolor={black.main}
            value={selectedPackage}
            outlinecolor={black.main}
            backgroundcolor={semiTransparentBlack.main}
            options={['goobs-frontend-unlimited']}
            onChange={e => setSelectedPackage(e.target.value)}
          />
        ),
      })
    }

    // Render monthly price
    if (config.monthlyprice && config.monthlyprice.columnconfig) {
      headerColumnConfigs.push({
        ...config.monthlyprice.columnconfig,
        component: (
          <Typography
            text={config.monthlyprice.prices}
            fontcolor={black.main}
            fontvariant="merrih6"
          />
        ),
      })
    }

    // Render annual price
    if (config.annualprice && config.annualprice.columnconfig) {
      headerColumnConfigs.push({
        ...config.annualprice.columnconfig,
        component: (
          <Typography
            text={config.annualprice.annualprices}
            fontcolor={black.main}
            fontvariant="merrih6"
          />
        ),
      })
    }

    /**
     * Renders a feature and its subfeatures
     * @param {Feature} feature - The feature to render
     */
    const renderFeature = (feature: Feature) => {
      // Render main feature
      if (feature.columnconfig) {
        featureColumnConfigs.push({
          ...feature.columnconfig,
          component: (
            <Box
              // @ts-ignore
              display="flex"
              alignItems="center"
            >
              <Typography
                text={feature.title}
                fontcolor={black.main}
                fontvariant="merrih5"
                noWrap
              />
              {feature.infopopuptext && (
                <Box ml={1} display="flex" alignItems="center">
                  <StyledTooltip
                    arrow
                    tooltipcolor={stainlessSteel.dark}
                    tooltipplacement="right"
                    title={feature.infopopuptext}
                    offsetX={0}
                    offsetY={0}
                  >
                    <InfoIcon fontSize="small" />
                  </StyledTooltip>
                </Box>
              )}
            </Box>
          ),
        })
      }

      // Render feature checkbox
      if (feature.tiedtopackage) {
        featureColumnConfigs.push({
          ...feature.tiedtopackage,
          cellconfig: {
            border: 'solid',
            minHeight: '40px',
          },
          component: feature.tiedtopackage.tiedtopackages ? (
            <CheckCircleIcon />
          ) : (
            <Box
              // @ts-ignore
              sx={{ width: '24px', height: '24px' }}
            />
          ),
        })
      }

      // Render subfeatures
      feature.subfeatures.forEach(subFeature => {
        if (subFeature.columnconfig) {
          featureColumnConfigs.push({
            ...subFeature.columnconfig,
            component: (
              <Box display="flex" alignItems="center">
                <Typography
                  text={subFeature.title}
                  fontcolor={black.main}
                  fontvariant="merrih6"
                  noWrap
                />
                {subFeature.infopopuptext && (
                  <Box ml={1} display="flex" alignItems="center">
                    <StyledTooltip
                      arrow
                      tooltipcolor={stainlessSteel.dark}
                      tooltipplacement="right"
                      title={subFeature.infopopuptext}
                      offsetX={0}
                      offsetY={0}
                    >
                      <InfoIcon fontSize="small" />
                    </StyledTooltip>
                  </Box>
                )}
              </Box>
            ),
          })
        }

        // Render subfeature checkbox
        if (subFeature.tiedtopackage) {
          featureColumnConfigs.push({
            ...subFeature.tiedtopackage,
            cellconfig: {
              border: 'solid',
              minHeight: '40px',
            },
            component: subFeature.tiedtopackage.tiedtopackages ? (
              <CheckCircleIcon />
            ) : (
              <Box sx={{ width: '24px', height: '24px' }} />
            ),
          })
        }
      })
    }

    // Render all features
    config.features?.forEach(renderFeature)

    // Render button columns
    if (config.buttoncolumns && config.buttoncolumns.columnconfig) {
      const buttonLink = config.buttoncolumns.buttonlinks || '#'

      featureColumnConfigs.push({
        ...config.buttoncolumns.columnconfig,
        component: (
          <CustomButton
            variant="contained"
            fontcolor={white.main}
            backgroundcolor={black.main}
            href={buttonLink}
            onClick={() => router.push(buttonLink)}
            text={config.buttoncolumns.buttontexts}
          />
        ),
      })
    }

    return { headerColumnConfigs, featureColumnConfigs }
  }

  const { headerColumnConfigs, featureColumnConfigs } = renderColumnConfigs()

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
      <CustomGrid
        gridconfig={config.headerGridConfig}
        columnconfig={headerColumnConfigs}
      />
      <CustomGrid
        gridconfig={config.featureGridConfig}
        columnconfig={featureColumnConfigs}
      />
    </Paper>
  )
}

export default PricingTable
