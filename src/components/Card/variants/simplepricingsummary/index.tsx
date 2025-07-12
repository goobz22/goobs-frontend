/**
 * @fileoverview Defines the SimplePricingSummary component, a card for displaying a simple pricing summary.
 */
'use client'

import React, { useState, useMemo } from 'react'
import { CardStyles, getCardStyles, SACRED_GLYPHS } from '../../../../theme'
import Typography from '../../../../components/Typography'
import Button from '../../../../components/Button'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

interface SimplePricingSummaryProps {
  /** Subtotal amount */
  subtotal?: string
  /** Total amount */
  total?: string
  /** Proceed button text */
  proceedText?: string
  /** Tax information text */
  taxText?: string
  /** Discount information text */
  discountText?: string
  /** Proceed callback */
  onProceed?: () => void
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: CardStyles
}

// --------------------------------------------------------------------------
// MAIN SIMPLE PRICING SUMMARY COMPONENT
// --------------------------------------------------------------------------

const SimplePricingSummary: React.FC<SimplePricingSummaryProps> = ({
  subtotal = 'USD 180.00',
  total = 'USD 180.00',
  proceedText = 'Proceed to checkout',
  taxText = 'Taxes may apply before placing an order.',
  discountText = 'Coupons and discounts will apply on the next step.',
  onProceed,
  styles,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const isSacredTheme = styles?.theme === 'sacred'

  const computedStyles = useMemo(
    () =>
      getCardStyles({ ...styles, variant: 'simplepricingsummary' }, isHovered),
    [styles, isHovered]
  )

  const pricingSummaryStyles = {
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
        animation: 'simple-pricing-summary-glow 2s infinite alternate',
        backgroundImage:
          'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.05), transparent)',
      }),
    } as React.CSSProperties,
    summaryContainer: {
      display: 'flex',
      flexDirection: 'column',
    } as React.CSSProperties,
    subtotalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      style={pricingSummaryStyles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sacred theme glyph */}
      {isSacredTheme && (
        <div
          style={{
            ...computedStyles.glyph,
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: 'rgba(255, 215, 0, 0.2)',
            fontSize: '2.25rem',
            animation:
              'simple-pricing-summary-glyph-rotate 15s linear infinite',
          }}
        >
          {SACRED_GLYPHS[2]}
        </div>
      )}

      {/* Summary container */}
      <div style={pricingSummaryStyles.summaryContainer}>
        {/* Subtotal row */}
        <div style={pricingSummaryStyles.subtotalRow}>
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
            }}
          />
        </div>

        {/* Total section */}
        <div style={pricingSummaryStyles.totalSection}>
          <div style={pricingSummaryStyles.totalRow}>
            <Typography
              text="TOTAL"
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
                textShadow: isSacredTheme
                  ? '0 0 5px rgba(255,215,0,0.5)'
                  : undefined,
              }}
            />
          </div>
        </div>
      </div>

      {/* Proceed button */}
      <div style={pricingSummaryStyles.buttonContainer}>
        <Button
          text={proceedText}
          styles={{
            backgroundColor: isSacredTheme ? 'rgba(0,0,0,0.9)' : undefined,
            color: isSacredTheme ? '#FFD700' : undefined,
            width: '100%',
            theme: isSacredTheme ? 'sacred' : styles?.theme || 'light',
          }}
          onClick={onProceed}
        />
      </div>

      {/* Tax information */}
      <Typography
        text={taxText}
        variant="merriparagraph"
        styles={{
          color: isSacredTheme
            ? 'rgba(255, 215, 0, 0.6)'
            : computedStyles.bodyText.color,
          marginTop: '0.5rem',
          fontSize: '0.75rem',
        }}
      />

      {/* Discount information */}
      <Typography
        text={discountText}
        variant="merriparagraph"
        styles={{
          color: isSacredTheme
            ? 'rgba(255, 215, 0, 0.6)'
            : computedStyles.bodyText.color,
          marginTop: '0.25rem',
          fontSize: '0.75rem',
        }}
      />
    </div>
  )
}

SimplePricingSummary.displayName = 'SimplePricingSummary'

export default SimplePricingSummary
