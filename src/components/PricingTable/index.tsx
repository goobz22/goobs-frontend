'use client'
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Box, Paper, SelectChangeEvent, CircularProgress } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Typography } from '../Typography'
import StyledTooltip from '../Tooltip'
import CustomButton from '../Button'
import Dropdown from '../Dropdown'
import CustomGrid from './../../components/Grid'
import { columnconfig, gridconfig } from './../../components/Grid/'
import defaultConfig from './defaultconfig'
import { useRouter } from 'next/navigation'
import {
  black,
  white,
  semiTransparentBlack,
  stainlessSteel,
  aqua,
} from '../../styles/palette'

type TiedToPackage = {
  tiedtopackages?: string[]
  columnconfig?: Omit<columnconfig, 'component'>
}

interface SubFeature {
  title: string
  titlelink?: string
  infopopuptext?: string
  columnconfig?: Omit<columnconfig, 'component'>
  tiedtopackage?: TiedToPackage
}

interface Feature {
  title: string
  infopopuptext?: string
  titlelink?: string
  subfeatures: SubFeature[]
  columnconfig?: Omit<columnconfig, 'component'>
  tiedtopackage?: TiedToPackage
}

export interface PricingProps {
  headerGridConfig?: gridconfig
  tabletitle?: {
    text?: string
    columnconfig?: columnconfig
  }
  packagecolumns?: {
    columnheaders?: string
    packagenames?: string[]
    columnconfig?: columnconfig
  }
  monthlyprice?: {
    prices?: string[]
    columnconfig?: columnconfig
  }
  annualprice?: {
    annualprices?: string[]
    columnconfig?: columnconfig
  }
  featureGridConfig?: gridconfig
  features?: Feature[]
  buttoncolumns?: {
    buttontexts?: string[]
    buttonlinks?: string[]
    columnconfig?: columnconfig
  }
}

const PricingTable: React.FC<PricingProps> = props => {
  const router = useRouter()
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const config = useMemo(() => {
    return { ...defaultConfig, ...props }
  }, [props])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100) // Simulating a 100ms loading time

    return () => clearTimeout(timer)
  }, [])

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
      console.log('Package selection changed to:', newValue)
    },
    [config.packagecolumns?.packagenames]
  )

  const renderColumnConfigs = useCallback(() => {
    const headerColumnConfigs: columnconfig[] = []
    const featureColumnConfigs: columnconfig[] = []

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

    if (config.packagecolumns && config.packagecolumns.columnconfig) {
      headerColumnConfigs.push({
        ...config.packagecolumns.columnconfig,
        // Add 5px margin above (margintop: 0.625) and to the right (marginright: 0.625)
        margintop: 1,
        marginright: 0.625,
        component: (
          <Dropdown
            label="Packages"
            options={(config.packagecolumns.packagenames || []).map(name => ({
              value: name,
              label: name,
            }))}
            defaultValue={selectedPackage}
            backgroundcolor={semiTransparentBlack.main}
            shrunklabelposition="aboveNotch"
            outlinecolor={black.main}
            fontcolor={black.main}
            shrunkfontcolor={black.main}
            onChange={handlePackageChange}
          />
        ),
      })
    }

    if (config.monthlyprice && config.monthlyprice.columnconfig) {
      headerColumnConfigs.push({
        ...config.monthlyprice.columnconfig,
        component: (
          <Typography
            text={config.monthlyprice.prices?.[selectedPackageIndex] || ''}
            fontcolor={black.main}
            fontvariant="merrih5"
          />
        ),
      })
    }

    if (config.annualprice && config.annualprice.columnconfig) {
      headerColumnConfigs.push({
        ...config.annualprice.columnconfig,
        component: (
          <Typography
            text={config.annualprice.annualprices?.[selectedPackageIndex] || ''}
            fontcolor={black.main}
            fontvariant="merrih5"
          />
        ),
      })
    }

    const renderFeature = (feature: Feature) => {
      if (feature.columnconfig) {
        featureColumnConfigs.push({
          ...feature.columnconfig,
          margintop: 1,
          paddingleft: 2,
          component: (
            <Box display="flex" alignItems="center">
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
        } as columnconfig)
      }

      if (feature.tiedtopackage && feature.tiedtopackage.columnconfig) {
        const tiedConfig: columnconfig = {
          ...feature.tiedtopackage.columnconfig,
          margintop: 1,
          cellconfig: {
            minHeight: '40px',
          },
          component: feature.tiedtopackage.tiedtopackages?.[
            selectedPackageIndex
          ] ? (
            <CheckCircleIcon />
          ) : (
            <Box sx={{ width: '24px', height: '24px' }} />
          ),
        }
        featureColumnConfigs.push(tiedConfig)
      }

      feature.subfeatures.forEach(subFeature => {
        if (subFeature.columnconfig) {
          featureColumnConfigs.push({
            ...subFeature.columnconfig,
            margintop: 1,
            paddingleft: 3,
            component: (
              <Box display="flex" alignItems="center">
                <Typography
                  text={subFeature.title}
                  fontcolor={black.main}
                  fontvariant="merriparagraph"
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
          } as columnconfig)
        }

        if (subFeature.tiedtopackage && subFeature.tiedtopackage.columnconfig) {
          const tiedConfig: columnconfig = {
            ...subFeature.tiedtopackage.columnconfig,
            margintop: 1,
            cellconfig: {
              minHeight: '40px',
            },
            component: subFeature.tiedtopackage.tiedtopackages?.[
              selectedPackageIndex
            ] ? (
              <CheckCircleIcon />
            ) : (
              <Box sx={{ width: '24px', height: '24px' }} />
            ),
          }
          featureColumnConfigs.push(tiedConfig)
        }
      })
    }

    config.features?.forEach(renderFeature)

    if (config.buttoncolumns && config.buttoncolumns.columnconfig) {
      const buttonLink =
        config.buttoncolumns.buttonlinks?.[selectedPackageIndex] || '#'

      featureColumnConfigs.push({
        ...config.buttoncolumns.columnconfig,
        margintop: 1,
        component: (
          <CustomButton
            variant="contained"
            fontcolor={white.main}
            backgroundcolor={black.main}
            href={buttonLink}
            width="100%"
            onClick={() => router.push(buttonLink)}
            text={
              config.buttoncolumns.buttontexts?.[selectedPackageIndex] || ''
            }
          />
        ),
      })
    }

    return { headerColumnConfigs, featureColumnConfigs }
  }, [
    config,
    selectedPackageIndex,
    selectedPackage,
    router,
    handlePackageChange,
  ])

  const { headerColumnConfigs, featureColumnConfigs } = renderColumnConfigs()

  if (isLoading) {
    return (
      <CustomGrid
        gridconfig={{
          gridwidth: '100%',
          alignment: 'center',
        }}
        columnconfig={[
          {
            row: 1,
            column: 1,
            alignment: 'center',
            component: (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="350px"
                width="100%"
                overflow="auto"
              >
                <CircularProgress size={240} thickness={2} />
              </Box>
            ),
          },
        ]}
      />
    )
  }

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
