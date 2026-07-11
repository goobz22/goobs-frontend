/**
 * @fileoverview Defines the PricingTable component for displaying pricing plans and features.
 * It supports light, dark, and sacred themes with comprehensive customization options.
 */
'use client'
import React, { FC, useId } from 'react'
import InfoIcon from '../Icons/Info'
import CheckCircleIcon from '../Icons/CheckCircle'
import StyledTooltip from '../Tooltip'
import CustomButton from '../Button'
import { emitDiag } from '../../utils/diag'
import cssStyles from './PricingTable.module.css'
// Remove Switch import
// import Switch from '../Switch';
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
  /**
   * Heading level (1–6) for the table title, so the title slots into the
   * surrounding document outline instead of a fixed level (WCAG 1.3.1 / 2.4.6,
   * and crawlable heading semantics under SSR). The visual size is unchanged —
   * it comes from the theme's header style, not the tag. Defaults to `2`
   * (a page-level pricing section is typically an `<h2>`); a component nested
   * deeper should pass the level that matches its context. Also becomes the
   * table's programmatic accessible name via `aria-labelledby`.
   * (Was previously a hardcoded `<h5>`.)
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
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
          // Rotation now lives in PricingTable.module.css (.sacredGlyph) so it
          // can be disabled under prefers-reduced-motion (WCAG 2.3.3).
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
          // Drift now lives in PricingTable.module.css (.sacredFooterGlyph) so
          // it can be disabled under prefers-reduced-motion (WCAG 2.3.3).
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
    headingLevel = 2,
  } = props

  const styles = getThemeStyles(theme, disabled)
  const isSacredTheme = theme === 'sacred'
  const packagenames = packagecolumns?.packagenames ?? []
  const numPackages = packagenames.length

  // Stable, SSR-safe id linking the visible title heading to the <table> as its
  // programmatic accessible name (aria-labelledby). useId must run before the
  // early return so hook order stays stable across renders.
  const headingId = useId()

  if (numPackages === 0) return null

  const handleButtonClick = (index: number) => {
    if (router && buttoncolumns?.buttonlinks?.[index]) {
      emitDiag({
        type: 'nav.change',
        component: 'PricingTable',
        to: buttoncolumns.buttonlinks[index],
      })
      router.push(buttoncolumns.buttonlinks[index])
    }
  }

  // A real heading whose level the consumer controls (via React.createElement,
  // matching Accordion), replacing the hardcoded <h5> that skipped levels in
  // the document outline. Carries the id that names the table.
  const titleHeading = tabletitle
    ? React.createElement(
        `h${headingLevel}`,
        { id: headingId, style: styles.header },
        tabletitle.text
      )
    : null

  // One package (data) cell per column. When the feature is included the check
  // icon is decorative (aria-hidden) and a visually-hidden "Included" carries
  // the meaning to assistive tech; an excluded cell announces "Not included"
  // rather than rendering an ambiguous blank (WCAG 1.1.1 / 1.4.1 / 4.1.2).
  const renderPackageCells = (tied: string[] | undefined, fIndex: number) =>
    packagenames.map((_, pIndex) => {
      const included = tied?.[pIndex] === 'true'
      return (
        <td
          key={pIndex}
          style={{
            ...styles.checkCell,
            borderRight: '1px solid rgba(0,0,0,0.1)',
            ...(fIndex % 2 === 0 ? styles.rowEven : {}),
            ...(pIndex === highlightedPackageIndex ? styles.highlighted : {}),
          }}
        >
          {included ? (
            <>
              <CheckCircleIcon
                styles={{ theme: isSacredTheme ? 'sacred' : theme }}
                style={styles.checkIcon}
                fontSize="small"
                aria-hidden="true"
              />
              <span className={cssStyles.srOnly}>Included</span>
            </>
          ) : (
            <span className={cssStyles.srOnly}>Not included</span>
          )}
        </td>
      )
    })

  // The hover tooltip is the sighted affordance for a feature's info text; its
  // trigger is mouse-only (keyboard support is a deferred Tooltip fix), so the
  // same text is also exposed inline to assistive tech (WCAG 1.1.1 / 3.3.2).
  const renderInfoAffordance = (infopopuptext: string) => (
    <>
      <StyledTooltip
        tooltipplacement="right"
        title={infopopuptext}
        styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
      >
        <InfoIcon
          styles={{ theme: isSacredTheme ? 'sacred' : theme }}
          fontSize="small"
          style={{ marginLeft: '0.5rem', display: 'inline-block' }}
          aria-hidden="true"
        />
      </StyledTooltip>
      <span className={cssStyles.srOnly}>{infopopuptext}</span>
    </>
  )

  return (
    <div
      style={styles.container}
      data-component="PricingTable"
      data-subject={tabletitle?.text}
      data-state={disabled ? 'disabled' : 'enabled'}
    >
      {/* Decorative rotating corner glyph — pure ornament, hidden from AT. */}
      {isSacredTheme && (
        <div
          style={styles.glyph}
          className={cssStyles.sacredGlyph}
          aria-hidden="true"
        >
          ✦
        </div>
      )}

      {titleHeading}

      <div style={{ overflowX: 'auto' }}>
        {/* Real data table: package columns are <th scope="col">, each row's
            label is <th scope="row">, values are <td> — so assistive tech and
            crawlers get the row/column relationships (WCAG 1.3.1 / 4.1.2, and
            SSR-crawlable semantics). Named by the title heading via
            aria-labelledby, or a generic label when there is no title. */}
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            minWidth: 'fit-content',
          }}
          aria-labelledby={tabletitle ? headingId : undefined}
          aria-label={tabletitle ? undefined : 'Pricing plans'}
        >
          <colgroup>
            <col style={{ minWidth: '200px' }} />
            {packagenames.map((_, i) => (
              <col key={i} style={{ minWidth: '150px' }} />
            ))}
          </colgroup>

          <thead>
            <tr>
              {/* Empty corner: row-label column × package-header row. */}
              <td />
              {packagenames.map((name, i) => (
                <th
                  key={i}
                  scope="col"
                  style={{
                    ...styles.packageName,
                    ...(i === highlightedPackageIndex
                      ? styles.highlighted
                      : {}),
                  }}
                >
                  {name}
                  {i === highlightedPackageIndex && (
                    <span style={styles.badge}>Popular</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Monthly Price Row */}
            {monthlyprice && (
              <tr>
                <th scope="row" style={styles.priceLabel}>
                  Monthly Price
                </th>
                {monthlyprice.prices.slice(0, numPackages).map((price, i) => (
                  <td
                    key={i}
                    style={{
                      ...styles.price,
                      ...(i === highlightedPackageIndex
                        ? styles.highlighted
                        : {}),
                    }}
                  >
                    {price.replace(/Monthly - |Annually - /, '')}
                  </td>
                ))}
              </tr>
            )}

            {/* Annual Price Row */}
            {annualprice && (
              <tr>
                <th scope="row" style={styles.priceLabel}>
                  Annual Price
                </th>
                {annualprice.annualprices
                  .slice(0, numPackages)
                  .map((price, i) => (
                    <td
                      key={i}
                      style={{
                        ...styles.annualPrice,
                        ...(i === highlightedPackageIndex
                          ? styles.highlighted
                          : {}),
                      }}
                    >
                      {price.replace(/Monthly - |Annually - /, '')}
                    </td>
                  ))}
              </tr>
            )}

            {/* Features Rows */}
            {features?.map((feature, fIndex) => (
              <React.Fragment key={fIndex}>
                <tr>
                  <th
                    scope="row"
                    style={{
                      ...styles.featureTitle,
                      ...(fIndex % 2 === 0 ? styles.rowEven : {}),
                    }}
                  >
                    <span>{feature.title}</span>
                    {feature.infopopuptext &&
                      renderInfoAffordance(feature.infopopuptext)}
                  </th>
                  {renderPackageCells(
                    feature.tiedtopackage?.tiedtopackages,
                    fIndex
                  )}
                </tr>

                {feature.subfeatures?.map((sub, sIndex) => (
                  <tr key={sIndex}>
                    <th scope="row" style={styles.subFeatureTitle}>
                      <span>{sub.title}</span>
                      {sub.infopopuptext &&
                        renderInfoAffordance(sub.infopopuptext)}
                    </th>
                    {renderPackageCells(
                      sub.tiedtopackage?.tiedtopackages,
                      fIndex
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>

          {/* Buttons Row */}
          {buttoncolumns && (
            <tfoot>
              <tr>
                <td />
                {buttoncolumns.buttontexts
                  .slice(0, numPackages)
                  .map((text, i) => (
                    <td key={i} style={styles.buttonSection}>
                      <CustomButton
                        text={text}
                        onClick={() => handleButtonClick(i)}
                        action="select"
                        styles={{ theme, ...styles.button }}
                        disabled={disabled}
                      />
                    </td>
                  ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {isSacredTheme && (
        <div style={styles.sacredFooter} aria-hidden="true">
          {['✦', '◆', '✦'].map((glyph, i) => {
            // Drift animation + its staggered duration live in the CSS module
            // (reduced-motion aware); the per-glyph duration passes through as
            // a custom property.
            const glyphStyle: React.CSSProperties & Record<string, string> = {
              ...(styles.sacredFooterGlyph as Record<string, string>),
              '--pt-float-duration': `${2 + i * 0.3}s`,
            }
            return (
              <span
                key={i}
                className={cssStyles.sacredFooterGlyph}
                style={glyphStyle}
              >
                {glyph}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PricingTable
