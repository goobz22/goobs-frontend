'use client'
import React, { useState, useEffect, useCallback, FC } from 'react'
import InfoIcon from '../Icons/Info'
import CheckCircleIcon from '../Icons/CheckCircle'
import StyledTooltip from '../Tooltip'
import CustomButton from '../Button'
import Dropdown from '../Field/Dropdown/Regular'

export interface PricingProps {
  tabletitle?: { text: string }
  packagecolumns?: { packagenames: string[] }
  monthlyprice?: { prices: string[] }
  annualprice?: { annualprices: string[] }
  features?: Feature[]
  buttoncolumns?: {
    buttontexts: string[]
    buttonlinks: string[]
  }
  router?: { push(url: string): void }
  sacredtheme?: boolean
}

export interface SubFeature {
  title: string
  infopopuptext?: string
  tiedtopackage?: { tiedtopackages: string[] }
}

export interface Feature {
  title: string
  infopopuptext?: string
  subfeatures?: SubFeature[]
  tiedtopackage?: { tiedtopackages: string[] }
}

const getStyles = (sacredtheme?: boolean) => ({
  container: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    height: '100%',
    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
    borderRadius: '0.375rem',
    borderTopWidth: '12px',
    ...(sacredtheme
      ? {
          borderTopColor: '#FFD700',
          backgroundColor: '#1C1917',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          backgroundImage:
            'linear-gradient(rgba(255,215,0,0.02),rgba(255,215,0,0.02)),radial-gradient(circle at top right,rgba(255,215,0,0.08) 0%,transparent 50%)',
          position: 'relative',
          overflow: 'hidden',
        }
      : { borderTopColor: '#00B8D4', backgroundColor: 'white' }),
  } as React.CSSProperties,
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    borderBottom: `1px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.3)' : '#E5E7EB'}`,
    ...(sacredtheme && {
      backgroundImage:
        'linear-gradient(to right, rgba(255, 215, 0, 0.1), transparent)',
    }),
  } as React.CSSProperties,
  title: {
    fontSize: '1.125rem',
    fontWeight: 600,
    margin: 0,
    ...(sacredtheme && {
      letterSpacing: '0.05em',
      color: '#FFD700',
      animation: 'sacred-glow 1.5s infinite alternate',
    }),
  } as React.CSSProperties,
  price: {
    fontSize: '1rem',
    ...(sacredtheme && {
      fontWeight: 500,
      letterSpacing: '0.025em',
      color: '#FFD700',
    }),
  } as React.CSSProperties,
  annualPrice: {
    fontSize: '1rem',
    ...(sacredtheme && {
      fontStyle: 'italic',
      color: 'rgba(255, 215, 0, 0.8)',
    }),
  } as React.CSSProperties,
  featuresSection: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
  } as React.CSSProperties,
  featureItem: {
    marginBottom: '1rem',
  } as React.CSSProperties,
  featureTitleContainer: {
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  featureTitle: {
    fontSize: '1rem',
    ...(sacredtheme && {
      fontWeight: 500,
      letterSpacing: '0.025em',
      color: '#FFD700',
    }),
  } as React.CSSProperties,
  iconContainer: {
    marginLeft: '0.5rem',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  subFeatureContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '1.5rem',
    marginTop: '0.5rem',
  } as React.CSSProperties,
  subFeatureTitle: {
    fontSize: '1rem',
    ...(sacredtheme && { color: 'rgba(255, 215, 0, 0.9)' }),
  } as React.CSSProperties,
  buttonSection: {
    padding: '1rem',
    ...(sacredtheme && {
      borderTop: '1px solid rgba(255, 215, 0, 0.3)',
      backgroundImage:
        'linear-gradient(to top, rgba(255, 215, 0, 0.05), transparent)',
    }),
  } as React.CSSProperties,
  sacredFooter: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.25rem',
    paddingBottom: '0.25rem',
  } as React.CSSProperties,
  sacredFooterGlyph: {
    color: 'rgba(255, 215, 0, 0.3)',
    fontSize: '0.75rem',
    animation: 'sacred-float 3s infinite ease-in-out',
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    fontSize: '1.5rem',
    color: 'rgba(255, 215, 0, 0.2)',
    animation: 'glyph-rotate 20s linear infinite',
  } as React.CSSProperties,
  checkIcon: {
    animation: sacredtheme ? 'sacred-float 2s infinite' : 'none',
  } as React.CSSProperties,
})

const PricingTable: FC<PricingProps> = props => {
  const { router, sacredtheme } = props
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState('')
  const config = props
  const styles = getStyles(sacredtheme)

  useEffect(() => {
    if (config.packagecolumns?.packagenames?.length) {
      setSelectedPackage(config.packagecolumns.packagenames[0])
    }
  }, [config.packagecolumns?.packagenames])

  const handlePackageChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const newValue = event.target.value as string
      const newIndex =
        config.packagecolumns?.packagenames?.indexOf(newValue) ?? 0
      setSelectedPackageIndex(newIndex)
      setSelectedPackage(newValue)
    },
    [config.packagecolumns?.packagenames]
  )

  return (
    <div style={styles.container}>
      {sacredtheme && <div style={styles.glyph}>𓁟</div>}
      <div style={styles.header}>
        {config.tabletitle && (
          <h5 style={styles.title}>{config.tabletitle.text || ''}</h5>
        )}
        {config.packagecolumns && (
          <div style={{ minWidth: sacredtheme ? '200px' : undefined }}>
            <Dropdown
              label="Packages"
              options={(config.packagecolumns.packagenames || []).map(name => ({
                value: name,
              }))}
              defaultValue={selectedPackage}
              onChange={handlePackageChange}
              sacredtheme={sacredtheme}
            />
          </div>
        )}
        {config.monthlyprice && (
          <span style={styles.price}>
            {config.monthlyprice.prices?.[selectedPackageIndex] || ''}
          </span>
        )}
        {config.annualprice && (
          <span style={styles.annualPrice}>
            {config.annualprice.annualprices?.[selectedPackageIndex] || ''}
          </span>
        )}
      </div>

      <div style={styles.featuresSection}>
        {config.features?.map((feature, featureIndex) => (
          <div key={`feature-${featureIndex}`} style={styles.featureItem}>
            <div style={styles.featureTitleContainer}>
              <span style={styles.featureTitle}>{feature.title}</span>
              {feature.infopopuptext && (
                <div style={styles.iconContainer}>
                  <StyledTooltip
                    tooltipplacement="right"
                    title={feature.infopopuptext}
                    sacredtheme={sacredtheme}
                  >
                    <InfoIcon fontSize="small" />
                  </StyledTooltip>
                </div>
              )}
              {feature.tiedtopackage && (
                <div style={styles.iconContainer}>
                  {feature.tiedtopackage.tiedtopackages?.[
                    selectedPackageIndex
                  ] ? (
                    <CheckCircleIcon
                      fontSize="small"
                      style={styles.checkIcon}
                    />
                  ) : (
                    <div style={{ width: '24px', height: '24px' }} />
                  )}
                </div>
              )}
            </div>
            {feature.subfeatures?.map((subFeature, subFeatureIndex) => (
              <div
                key={`subfeature-${subFeatureIndex}`}
                style={styles.subFeatureContainer}
              >
                <span style={styles.subFeatureTitle}>{subFeature.title}</span>
                {subFeature.infopopuptext && (
                  <div style={styles.iconContainer}>
                    <StyledTooltip
                      tooltipplacement="right"
                      title={subFeature.infopopuptext}
                      sacredtheme={sacredtheme}
                    >
                      <InfoIcon fontSize="small" />
                    </StyledTooltip>
                  </div>
                )}
                {subFeature.tiedtopackage && (
                  <div style={styles.iconContainer}>
                    {subFeature.tiedtopackage.tiedtopackages?.[
                      selectedPackageIndex
                    ] ? (
                      <CheckCircleIcon fontSize="small" />
                    ) : (
                      <div style={{ width: '24px', height: '24px' }} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {config.buttoncolumns && (
        <div style={styles.buttonSection}>
          <CustomButton
            backgroundcolor={sacredtheme ? '#FFD700' : 'black'}
            fontcolor={sacredtheme ? '#000000' : 'white'}
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
        </div>
      )}

      {sacredtheme && (
        <div style={styles.sacredFooter}>
          {['𓊹', '𓋹', '𓊹'].map((glyph, i) => (
            <span
              key={i}
              style={{
                ...styles.sacredFooterGlyph,
                animationDuration: `${2 + i * 0.3}s`,
              }}
            >
              {glyph}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default PricingTable
