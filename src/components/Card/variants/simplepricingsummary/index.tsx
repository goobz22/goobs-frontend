'use client'

import React from 'react'
import Typography from '../../../../components/Typography'
import CustomButton from '../../../../components/Button'
import { SACRED_GLYPHS } from '../../../../styles/sacredGlyphs'

interface SimplePricingSummaryProps {
  height?: string | number
  subtotal?: string
  total?: string
  proceedText?: string
  taxText?: string
  discountText?: string
  onProceed?: () => void
  sacredtheme?: boolean
}

const getStyles = (sacredtheme?: boolean) => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: '1rem',
    overflow: 'hidden',
    ...(sacredtheme
      ? {
          border: '1px solid rgba(255, 215, 0, 0.3)',
          backgroundColor: 'black',
          animation: 'simple-pricing-summary-glow 2s infinite alternate',
          backgroundImage:
            'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.05), transparent)',
        }
      : {
          border: '1px solid #E5E7EB',
          backgroundColor: 'white',
        }),
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    color: 'rgba(255, 215, 0, 0.2)',
    fontSize: '2.25rem',
    animation: 'simple-pricing-summary-glyph-rotate 15s linear infinite',
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
    ...(sacredtheme
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
  totalLabel: {
    ...(sacredtheme && {
      fontFamily: 'Cinzel, serif',
      fontWeight: 'bold',
      letterSpacing: '0.1em',
      textShadow: '0 0 5px rgba(255,215,0,0.5)',
    }),
  } as React.CSSProperties,
  totalPrice: {
    ...(sacredtheme && {
      fontFamily: 'Cinzel, serif',
      fontWeight: 'bold',
      textShadow: '0 0 5px rgba(255,215,0,0.5)',
    }),
  } as React.CSSProperties,
  buttonContainer: {
    marginTop: '1rem',
  } as React.CSSProperties,
  infoText: {
    marginTop: '0.5rem',
    fontSize: '0.75rem',
    ...(sacredtheme && {
      fontStyle: 'italic',
    }),
  } as React.CSSProperties,
})

const SimplePricingSummary: React.FC<SimplePricingSummaryProps> = ({
  height,
  subtotal = 'USD 180.00',
  total = 'USD 180.00',
  proceedText = 'Proceed to checkout',
  taxText = 'Taxes may apply before placing an order.',
  discountText = 'Coupons and discounts will apply on the next step.',
  onProceed,
  sacredtheme = false,
}) => {
  const styles = getStyles(sacredtheme)
  return (
    <div style={{ ...styles.container, minHeight: height }}>
      {sacredtheme && <div style={styles.glyph}>{SACRED_GLYPHS[2]}</div>}
      <div style={styles.summaryContainer}>
        <div style={styles.subtotalRow}>
          <Typography
            text="Subtotal"
            fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.9)' : 'black'}
            fontvariant="merriparagraph"
          />
          <Typography
            text={subtotal}
            fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
            fontvariant="merriparagraph"
          />
        </div>
        <div style={styles.totalSection}>
          <div style={styles.totalRow}>
            <Typography
              text="TOTAL"
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              fontvariant="merrih5"
              style={styles.totalLabel}
            />
            <Typography
              text={total}
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              fontvariant="merrih5"
              style={styles.totalPrice}
            />
          </div>
        </div>
      </div>
      <div style={styles.buttonContainer}>
        <CustomButton
          text={proceedText}
          backgroundcolor={sacredtheme ? 'rgba(0,0,0,0.9)' : 'black'}
          fontcolor={sacredtheme ? '#FFD700' : 'white'}
          onClick={onProceed}
          width="100%"
          sacredtheme={sacredtheme}
        />
      </div>
      <Typography
        text={taxText}
        fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.6)' : 'black'}
        fontvariant="merriparagraph"
        style={{ ...styles.infoText, marginTop: '0.5rem' }}
      />
      <Typography
        text={discountText}
        fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.6)' : 'black'}
        fontvariant="merriparagraph"
        style={{ ...styles.infoText, marginTop: '0.25rem' }}
      />
    </div>
  )
}

export default SimplePricingSummary
