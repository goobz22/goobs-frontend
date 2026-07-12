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

// Compose CSS-module class names without clsx/classnames (repo convention:
// no CSS-in-JS class libraries — a tiny local join helper instead).
const cx = (...names: Array<string | false | null | undefined>): string =>
  names.filter(Boolean).join(' ')

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
// MAIN PRICING TABLE COMPONENT
//
// Theming is entirely CSS-module driven (PricingTable.module.css): the root
// carries data-theme={'light'|'dark'|'sacred'} and the per-theme descendant
// blocks set every color/background against the shared --goobs-* design tokens.
// The old getThemeStyles() JS helper (a sanctioned-pattern violation per
// .claude/rules/goobs.md — "never reintroduce a getXStyles-style JS theming
// module", and a JS-side --goobs-* token leak caught by the
// theme-literal-in-js a11y lint) has been removed. The only runtime scalar
// still passed from JS is the per-glyph float duration (a CSS custom property),
// and the included-check icon color, which reads the per-theme
// --pt-check-color custom property the container sets.
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
        { id: headingId, className: cssStyles.header },
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
          className={cx(
            cssStyles.checkCell,
            fIndex % 2 === 0 && cssStyles.rowEven,
            pIndex === highlightedPackageIndex && cssStyles.highlighted
          )}
        >
          {included ? (
            <>
              <CheckCircleIcon
                styles={{ theme: isSacredTheme ? 'sacred' : theme }}
                style={{ color: 'var(--pt-check-color)' }}
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
      className={cssStyles.container}
      data-theme={theme}
      data-component="PricingTable"
      data-subject={tabletitle?.text}
      data-state={disabled ? 'disabled' : 'enabled'}
    >
      {/* Decorative rotating corner glyph — pure ornament, hidden from AT. */}
      {isSacredTheme && (
        <div
          className={cx(cssStyles.glyph, cssStyles.sacredGlyph)}
          aria-hidden="true"
        >
          ✦
        </div>
      )}

      {titleHeading}

      {/* Horizontal-scroll container. Made keyboard-focusable (tabIndex={0})
          and given a group role+name so a keyboard-only user can scroll a table
          that overflows its width EVEN when it has no focusable control inside
          (e.g. no buttoncolumns) — otherwise the off-screen package columns are
          unreachable by keyboard (WCAG 2.1.1 Keyboard; axe
          `scrollable-region-focusable`). The name reuses the table's own so the
          focus stop announces what it is. */}
      <div
        style={{ overflowX: 'auto' }}
        tabIndex={0}
        role="group"
        aria-labelledby={tabletitle ? headingId : undefined}
        aria-label={tabletitle ? undefined : 'Pricing plans'}
      >
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
                  className={cx(
                    cssStyles.packageName,
                    i === highlightedPackageIndex && cssStyles.highlighted
                  )}
                >
                  {name}
                  {i === highlightedPackageIndex && (
                    <span className={cssStyles.badge}>Popular</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Monthly Price Row */}
            {monthlyprice && (
              <tr>
                <th scope="row" className={cssStyles.priceLabel}>
                  Monthly Price
                </th>
                {monthlyprice.prices.slice(0, numPackages).map((price, i) => (
                  <td
                    key={i}
                    className={cx(
                      cssStyles.price,
                      i === highlightedPackageIndex && cssStyles.highlighted
                    )}
                  >
                    {price.replace(/Monthly - |Annually - /, '')}
                  </td>
                ))}
              </tr>
            )}

            {/* Annual Price Row */}
            {annualprice && (
              <tr>
                <th scope="row" className={cssStyles.priceLabel}>
                  Annual Price
                </th>
                {annualprice.annualprices
                  .slice(0, numPackages)
                  .map((price, i) => (
                    <td
                      key={i}
                      className={cx(
                        cssStyles.annualPrice,
                        i === highlightedPackageIndex && cssStyles.highlighted
                      )}
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
                    className={cx(
                      cssStyles.featureTitle,
                      fIndex % 2 === 0 && cssStyles.rowEven
                    )}
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
                    <th scope="row" className={cssStyles.subFeatureTitle}>
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
                    <td key={i} className={cssStyles.buttonSection}>
                      {/* Pricing CTAs are commonly identical across columns
                          ("Learn More", "Choose plan", "Buy"). When a screen
                          reader user tab-navigates to a footer button the
                          column-header association is not reliably announced, so
                          identical labels are indistinguishable. Fold the
                          package name into the button's accessible name so each
                          CTA says which plan it selects (WCAG 2.4.6 Headings &
                          Labels / 4.1.2). The visible label is unchanged and is
                          contained in the accessible name, satisfying WCAG 2.5.3
                          Label in Name. */}
                      <CustomButton
                        text={text}
                        onClick={() => handleButtonClick(i)}
                        action="select"
                        aria-label={`${text}, ${packagenames[i]}`}
                        styles={{ theme, width: '100%' }}
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
        <div className={cssStyles.sacredFooter} aria-hidden="true">
          {['✦', '◆', '✦'].map((glyph, i) => {
            // Drift animation + its staggered duration live in the CSS module
            // (reduced-motion aware); the per-glyph duration passes through as
            // a custom property.
            const glyphStyle: React.CSSProperties & Record<string, string> = {
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
