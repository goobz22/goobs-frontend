/**
 * @fileoverview Defines the PricingTable component for displaying pricing plans and features.
 * It supports light, dark, and sacred themes with comprehensive customization options.
 */
'use client'
import React, { FC } from 'react'
import InfoIcon from '../Icons/Info'
import CheckCircleIcon from '../Icons/CheckCircle'
import StyledTooltip from '../Tooltip'
import CustomButton from '../Button'
// Remove Switch import
// import Switch from '../Switch';
import { SACRED_GLYPHS } from '../../theme'
// Remove clsx import

// --------------------------------------------------------------------------
// PROPS INTERFACE (keep existing, perhaps adjust if needed)
// --------------------------------------------------------------------------

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
  /** Theme selection */
  theme?: 'light' | 'dark' | 'sacred'
  /** Disabled state */
  disabled?: boolean
  highlightedPackageIndex?: number
  defaultBilling?: 'monthly' | 'annual'
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

// --------------------------------------------------------------------------
// THEME STYLES
// --------------------------------------------------------------------------

const getThemeStyles = (theme: string = 'light', disabled: boolean = false) => {
  const opacity = disabled
    ? { opacity: 0.5, pointerEvents: 'none' as const }
    : {}

  const common = {
    container: {
      padding: '1.5rem',
      borderRadius: '0.375rem',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      ...opacity,
    },
    glyph: {
      position: 'absolute' as const,
      top: '1rem',
      right: '1rem',
      fontSize: '1.5rem',
    },
    header: {
      fontSize: '1.125rem',
      fontWeight: 600,
      marginBottom: '1rem',
    },
    priceLabel: {
      fontSize: '1rem',
      fontStyle: 'italic',
    },
    packageName: {
      fontWeight: 'bold',
      textAlign: 'center' as const,
      padding: '0.5rem 0',
    },
    price: {
      textAlign: 'center' as const,
      padding: '0.25rem 0',
      fontWeight: 600,
    },
    annualPrice: {
      textAlign: 'center' as const,
      padding: '0.25rem 0',
      fontStyle: 'italic',
    },
    featureTitle: {
      fontWeight: 500,
      padding: '0.5rem 0 0.5rem 0.5rem',
    },
    subFeatureTitle: {
      fontWeight: 400,
      padding: '0.25rem 0 0.25rem 1.5rem',
    },
    checkCell: {
      textAlign: 'center' as const,
      padding: '0.5rem 0',
      borderRight: '1px solid rgba(255,255,255,0.1)', // for dark/sacred
    },
    checkIcon: {},
    buttonSection: {
      marginTop: '1rem',
    },
    button: {
      width: '100%',
    },
    sacredFooter: {
      display: 'flex' as const,
      justifyContent: 'center' as const,
      gap: '0.25rem',
      marginTop: '1rem',
    },
    sacredFooterGlyph: {},
    rowEven: { backgroundColor: 'rgba(0,0,0,0.02)' },
    cellBorder: { borderRight: '1px solid rgba(0,0,0,0.1)' },
    highlighted: {
      backgroundColor: 'rgba(255,215,0,0.05)',
      boxShadow: 'inset 0 0 10px rgba(255,215,0,0.3)',
    },
    badge: {
      display: 'inline-block',
      backgroundColor: '#4F46E5',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: 600,
      marginLeft: '0.5rem',
    },
    toggleBackground: '#E5E7EB',
  }

  switch (theme) {
    case 'sacred':
      return {
        ...common,
        container: {
          ...common.container,
          backgroundColor: 'rgba(0,0,0,0.95)',
          border: '1px solid rgba(154,132,0,0.3)',
          boxShadow: '0 0 20px rgba(255,215,0,0.3)',
          backdropFilter: 'blur(4px)',
        },
        glyph: {
          ...common.glyph,
          color: 'rgba(255,215,0,0.2)',
          animation: 'spin 20s linear infinite',
          position: 'absolute' as const,
        },
        header: {
          ...common.header,
          color: '#FFD700',
          fontFamily: 'serif',
          textShadow: '0 0 5px rgba(255,215,0,0.5)',
        },
        priceLabel: {
          ...common.priceLabel,
          color: 'rgba(255,215,0,0.8)',
        },
        packageName: {
          ...common.packageName,
          color: '#FFD700',
          backgroundColor: 'rgba(154,132,0,0.1)',
          borderTopLeftRadius: '0.375rem',
          borderTopRightRadius: '0.375rem',
        },
        price: {
          ...common.price,
          color: '#FFD700',
        },
        annualPrice: {
          ...common.annualPrice,
          color: 'rgba(255,215,0,0.7)',
        },
        featureTitle: {
          ...common.featureTitle,
          color: '#FFD700',
          backgroundColor: 'rgba(154,132,0,0.05)',
        },
        subFeatureTitle: {
          ...common.subFeatureTitle,
          color: 'rgba(255,215,0,0.9)',
        },
        checkIcon: {
          color: '#FFD700',
          fontSize: '1.25rem',
        },
        sacredFooterGlyph: {
          color: 'rgba(255,215,0,0.3)',
          fontSize: '0.75rem',
          animation: 'float 3s ease-in-out infinite',
        },
        toggleBackground: 'rgba(0,0,0,0.8)',
      }
    case 'dark':
      return {
        ...common,
        container: {
          ...common.container,
          backgroundColor: 'rgba(31,41,55,0.95)',
          border: '1px solid rgba(75,85,99,0.8)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
        },
        glyph: { display: 'none' },
        header: {
          ...common.header,
          color: '#F3F4F6',
        },
        priceLabel: {
          ...common.priceLabel,
          color: '#9CA3AF',
        },
        packageName: {
          ...common.packageName,
          color: '#F9FAFB',
          backgroundColor: 'rgba(55,65,81,0.5)',
        },
        price: {
          ...common.price,
          color: '#E5E7EB',
        },
        annualPrice: {
          ...common.annualPrice,
          color: '#9CA3AF',
        },
        featureTitle: {
          ...common.featureTitle,
          color: '#D1D5DB',
          backgroundColor: 'rgba(55,65,81,0.2)',
        },
        subFeatureTitle: {
          ...common.subFeatureTitle,
          color: '#9CA3AF',
        },
        checkIcon: {
          color: '#4ADE80',
        },
        sacredFooter: { display: 'none' },
        toggleBackground: '#374151',
      }
    default:
      return {
        ...common,
        container: {
          ...common.container,
          backgroundColor: 'rgba(255,255,255,0.95)',
          border: '1px solid rgba(226,232,240,0.8)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(4px)',
        },
        glyph: { display: 'none' },
        header: {
          ...common.header,
          color: '#1F2937',
        },
        priceLabel: {
          ...common.priceLabel,
          color: '#6B7280',
        },
        packageName: {
          ...common.packageName,
          color: '#1F2937',
          backgroundColor: '#F3F4F6',
        },
        price: {
          ...common.price,
          color: '#1F2937',
        },
        annualPrice: {
          ...common.annualPrice,
          color: '#6B7280',
        },
        featureTitle: {
          ...common.featureTitle,
          color: '#374151',
          backgroundColor: '#F9FAFB',
        },
        subFeatureTitle: {
          ...common.subFeatureTitle,
          color: '#4B5563',
        },
        checkIcon: {
          color: '#22C55E',
        },
        sacredFooter: { display: 'none' },
        toggleBackground: '#E5E7EB',
      }
  }
}

// --------------------------------------------------------------------------
// MAIN PRICING TABLE COMPONENT
// --------------------------------------------------------------------------

const PricingTable: FC<PricingProps> = props => {
  const {
    tabletitle,
    packagecolumns,
    monthlyprice,
    annualprice,
    features,
    buttoncolumns,
    router,
    theme = 'light',
    disabled = false,
    highlightedPackageIndex,
  } = props

  const styles = getThemeStyles(theme, disabled)
  const isSacredTheme = theme === 'sacred'
  const packagenames = packagecolumns?.packagenames ?? []
  const numPackages = packagenames.length

  if (numPackages === 0) return null

  const handleButtonClick = (index: number) => {
    if (router && buttoncolumns?.buttonlinks?.[index]) {
      router.push(buttoncolumns.buttonlinks[index])
    }
  }

  return (
    <div style={styles.container}>
      {isSacredTheme && <div style={styles.glyph}>{SACRED_GLYPHS[0]}</div>}

      {tabletitle && <h5 style={styles.header}>{tabletitle.text}</h5>}

      <div style={{ overflowX: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gap: 0,
            gridTemplateColumns: `minmax(200px, 300px) repeat(${numPackages}, minmax(150px, 1fr))`,
            minWidth: 'fit-content',
          }}
        >
          {/* Package Names Row */}
          <div /> {/* Empty top-left */}
          {packagenames.map((name, i) => (
            <div
              key={i}
              style={{
                ...styles.packageName,
                ...(i === highlightedPackageIndex ? styles.highlighted : {}),
              }}
            >
              {name}
              {i === highlightedPackageIndex && (
                <span style={styles.badge}>Popular</span>
              )}
            </div>
          ))}
          {/* Monthly Price Row */}
          {monthlyprice && (
            <>
              <div style={styles.priceLabel}>Monthly Price</div>
              {monthlyprice.prices.slice(0, numPackages).map((price, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.price,
                    ...(i === highlightedPackageIndex
                      ? styles.highlighted
                      : {}),
                  }}
                >
                  {price.replace(/Monthly - |Annually - /, '')}
                </div>
              ))}
            </>
          )}
          {/* Annual Price Row */}
          {annualprice && (
            <>
              <div style={styles.priceLabel}>Annual Price</div>
              {annualprice.annualprices
                .slice(0, numPackages)
                .map((price, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.annualPrice,
                      ...(i === highlightedPackageIndex
                        ? styles.highlighted
                        : {}),
                    }}
                  >
                    {price.replace(/Monthly - |Annually - /, '')}
                  </div>
                ))}
            </>
          )}
          {/* Features Rows */}
          {features?.map((feature, fIndex) => (
            <React.Fragment key={fIndex}>
              <div
                style={{
                  ...styles.featureTitle,
                  ...(fIndex % 2 === 0 ? styles.rowEven : {}),
                }}
              >
                <span>{feature.title}</span>
                {feature.infopopuptext && (
                  <StyledTooltip
                    tooltipplacement="right"
                    title={feature.infopopuptext}
                    sacredtheme={isSacredTheme}
                  >
                    <InfoIcon
                      fontSize="small"
                      style={{ marginLeft: '0.5rem', display: 'inline-block' }}
                    />
                  </StyledTooltip>
                )}
              </div>
              {packagenames.map((_, pIndex) => (
                <div
                  key={pIndex}
                  style={{
                    ...styles.checkCell,
                    borderRight: '1px solid rgba(0,0,0,0.1)',
                    ...(fIndex % 2 === 0 ? styles.rowEven : {}),
                    ...(pIndex === highlightedPackageIndex
                      ? styles.highlighted
                      : {}),
                  }}
                >
                  {feature.tiedtopackage?.tiedtopackages?.[pIndex] ===
                    'true' && (
                    <CheckCircleIcon
                      style={styles.checkIcon}
                      fontSize="small"
                    />
                  )}
                </div>
              ))}

              {feature.subfeatures?.map((sub, sIndex) => (
                <React.Fragment key={sIndex}>
                  <div style={styles.subFeatureTitle}>
                    <span>{sub.title}</span>
                    {sub.infopopuptext && (
                      <StyledTooltip
                        tooltipplacement="right"
                        title={sub.infopopuptext}
                        sacredtheme={isSacredTheme}
                      >
                        <InfoIcon
                          fontSize="small"
                          style={{
                            marginLeft: '0.5rem',
                            display: 'inline-block',
                          }}
                        />
                      </StyledTooltip>
                    )}
                  </div>
                  {packagenames.map((_, pIndex) => (
                    <div
                      key={pIndex}
                      style={{
                        ...styles.checkCell,
                        borderRight: '1px solid rgba(0,0,0,0.1)',
                        ...(fIndex % 2 === 0 ? styles.rowEven : {}),
                        ...(pIndex === highlightedPackageIndex
                          ? styles.highlighted
                          : {}),
                      }}
                    >
                      {sub.tiedtopackage?.tiedtopackages?.[pIndex] ===
                        'true' && (
                        <CheckCircleIcon
                          style={styles.checkIcon}
                          fontSize="small"
                        />
                      )}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
          {/* Buttons Row */}
          <div /> {/* Empty */}
          {buttoncolumns?.buttontexts.slice(0, numPackages).map((text, i) => (
            <div key={i} style={styles.buttonSection}>
              <CustomButton
                text={text}
                onClick={() => handleButtonClick(i)}
                styles={{ theme, ...styles.button }}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      </div>

      {isSacredTheme && (
        <div style={styles.sacredFooter}>
          {[SACRED_GLYPHS[20], SACRED_GLYPHS[21], SACRED_GLYPHS[20]].map(
            (glyph, i) => (
              <span
                key={i}
                style={{
                  ...styles.sacredFooterGlyph,
                  animationDuration: `${2 + i * 0.3}s`,
                }}
              >
                {glyph}
              </span>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default PricingTable
