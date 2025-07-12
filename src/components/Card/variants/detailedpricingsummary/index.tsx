/**
 * @fileoverview Defines the DetailedPricingSummary component, a card for displaying a detailed pricing summary.
 */
'use client'

import React, { useState, useMemo } from 'react'
import { CardStyles, getCardStyles, SACRED_GLYPHS } from '../../../../theme'
import Typography from '../../../../components/Typography'
import Button from '../../../../components/Button'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

interface DetailedPricingSummaryProps {
  /** Product name */
  product?: string
  /** Vendor name */
  vendor?: string
  /** Vendor price */
  vendorPrice?: string
  /** Subtotal amount */
  subtotal?: string
  /** VAT amount */
  vat?: string
  /** Total amount */
  total?: string
  /** Proceed button text */
  proceedText?: string
  /** Proceed callback */
  onProceed?: () => void
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: CardStyles
}

// --------------------------------------------------------------------------
// MAIN DETAILED PRICING SUMMARY COMPONENT
// --------------------------------------------------------------------------

const DetailedPricingSummary: React.FC<DetailedPricingSummaryProps> = ({
  product = 'Goobs Repo Unlimited × 1',
  vendor = 'Technologies Unlimited',
  vendorPrice = '$180.00',
  subtotal = '$180.00',
  vat = '$0.00',
  total = '$180.00',
  proceedText = 'Proceed to checkout',
  onProceed,
  styles,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const isSacredTheme = styles?.theme === 'sacred'

  const computedStyles = useMemo(
    () =>
      getCardStyles(
        { ...styles, variant: 'detailedpricingsummary' },
        isHovered
      ),
    [styles, isHovered]
  )

  const detailedPricingStyles = {
    container: {
      ...computedStyles.pricingSummary,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      padding: '1rem',
      overflow: 'hidden',
      ...(isSacredTheme && {
        border: '1px solid rgba(255, 215, 0, 0.3)',
        backgroundColor: 'black',
        animation: 'detailed-pricing-summary-glow 2s infinite alternate',
        backgroundImage:
          'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.05), transparent)',
      }),
    } as React.CSSProperties,
    summaryContainer: {
      display: 'flex',
      flexDirection: 'column',
    } as React.CSSProperties,
    productDescription: {
      marginTop: '0.5rem',
    } as React.CSSProperties,
    vendorSection: {
      marginTop: '1rem',
    } as React.CSSProperties,
    vendorRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as React.CSSProperties,
    vendorPrice: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    } as React.CSSProperties,
    subtotalSection: {
      marginTop: '1rem',
    } as React.CSSProperties,
    vatSection: {
      marginTop: '0.5rem',
    } as React.CSSProperties,
    totalSection: {
      marginTop: '0.5rem',
      paddingTop: '0.5rem',
      ...(isSacredTheme
        ? {
            borderTop: '1px solid rgba(255, 215, 0, 0.3)',
            backgroundImage:
              'linear-gradient(to right, rgba(255, 215, 0, 0.05), transparent, rgba(255, 215, 0, 0.05))',
          }
        : {
            borderTop: '1px solid #E5E7EB',
          }),
    } as React.CSSProperties,
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as React.CSSProperties,
    buttonContainer: {
      marginTop: '1rem',
    } as React.CSSProperties,
  }

  return (
    <div
      style={detailedPricingStyles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sacred theme glyph */}
      {isSacredTheme && (
        <div
          style={{
            ...computedStyles.glyph,
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            color: 'rgba(255, 215, 0, 0.2)',
            fontSize: '1.5rem',
            animation: 'detailed-pricing-summary-float 5s infinite alternate',
          }}
        >
          {SACRED_GLYPHS[0]}
        </div>
      )}

      {/* Summary container */}
      <div style={detailedPricingStyles.summaryContainer}>
        {/* Product section */}
        <Typography
          text="Product"
          variant="merriparagraph"
          styles={{
            color: isSacredTheme ? '#FFD700' : computedStyles.title.color,
            fontFamily: isSacredTheme ? 'Cinzel, serif' : undefined,
            fontWeight: isSacredTheme ? 600 : undefined,
            letterSpacing: isSacredTheme ? '0.05em' : undefined,
            textShadow: isSacredTheme
              ? '0 0 5px rgba(255,215,0,0.5)'
              : undefined,
          }}
        />
        <Typography
          text={product}
          variant="merriparagraph"
          styles={{
            color: isSacredTheme
              ? 'rgba(255, 215, 0, 0.8)'
              : computedStyles.bodyText.color,
            marginTop: '0.5rem',
          }}
        />

        {/* Vendor section */}
        <div style={detailedPricingStyles.vendorSection}>
          <div style={detailedPricingStyles.vendorRow}>
            <Typography
              text="Vendor:"
              variant="merriparagraph"
              styles={{
                color: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.9)'
                  : computedStyles.bodyText.color,
              }}
            />
            <Typography
              text={vendor}
              variant="merriparagraph"
              styles={{
                color: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.8)'
                  : computedStyles.bodyText.color,
              }}
            />
          </div>
          <div style={detailedPricingStyles.vendorPrice}>
            <Typography
              text={vendorPrice}
              variant="merriparagraph"
              styles={{
                color: isSacredTheme ? '#FFD700' : computedStyles.price.color,
                fontWeight: isSacredTheme ? 600 : undefined,
                textShadow: isSacredTheme
                  ? '0 0 3px rgba(255,215,0,0.5)'
                  : undefined,
              }}
            />
          </div>
        </div>

        {/* Subtotal section */}
        <div style={detailedPricingStyles.subtotalSection}>
          <Typography
            text="Subtotal"
            variant="merriparagraph"
            styles={{
              color: isSacredTheme
                ? 'rgba(255, 215, 0, 0.9)'
                : computedStyles.bodyText.color,
            }}
          />
          <Typography
            text={subtotal}
            variant="merriparagraph"
            styles={{
              color: isSacredTheme
                ? 'rgba(255, 215, 0, 0.8)'
                : computedStyles.bodyText.color,
              textAlign: 'right',
            }}
          />
        </div>

        {/* VAT section */}
        <div style={detailedPricingStyles.vatSection}>
          <Typography
            text="VAT"
            variant="merriparagraph"
            styles={{
              color: isSacredTheme
                ? 'rgba(255, 215, 0, 0.9)'
                : computedStyles.bodyText.color,
            }}
          />
          <Typography
            text={vat}
            variant="merriparagraph"
            styles={{
              color: isSacredTheme
                ? 'rgba(255, 215, 0, 0.8)'
                : computedStyles.bodyText.color,
              textAlign: 'right',
            }}
          />
        </div>

        {/* Total section */}
        <div style={detailedPricingStyles.totalSection}>
          <div style={detailedPricingStyles.totalRow}>
            <Typography
              text="Total"
              variant="merrih5"
              styles={{
                color: isSacredTheme ? '#FFD700' : computedStyles.title.color,
                fontFamily: isSacredTheme ? 'Cinzel, serif' : undefined,
                fontWeight: isSacredTheme ? 'bold' : undefined,
                letterSpacing: isSacredTheme ? '0.1em' : undefined,
                textShadow: isSacredTheme
                  ? '0 0 5px rgba(255,215,0,0.5)'
                  : undefined,
              }}
            />
            <Typography
              text={total}
              variant="merrih5"
              styles={{
                color: isSacredTheme ? '#FFD700' : computedStyles.price.color,
                fontFamily: isSacredTheme ? 'Cinzel, serif' : undefined,
                fontWeight: isSacredTheme ? 'bold' : undefined,
                letterSpacing: isSacredTheme ? '0.1em' : undefined,
                textShadow: isSacredTheme
                  ? '0 0 5px rgba(255,215,0,0.5)'
                  : undefined,
              }}
            />
          </div>
        </div>
      </div>

      {/* Proceed button */}
      <div style={detailedPricingStyles.buttonContainer}>
        <Button
          text={proceedText}
          styles={{
            theme: isSacredTheme ? 'sacred' : styles?.theme || 'light',
            backgroundColor: isSacredTheme ? 'rgba(0,0,0,0.9)' : undefined,
            color: isSacredTheme ? '#FFD700' : undefined,
            width: '100%',
          }}
          onClick={onProceed}
        />
      </div>
    </div>
  )
}

DetailedPricingSummary.displayName = 'DetailedPricingSummary'

export default DetailedPricingSummary
