'use client'

import React from 'react'
import Typography from '../../../../components/Typography'
import CustomButton from '../../../../components/Button'
import { SACRED_GLYPHS } from '../../../../styles/sacredGlyphs'

interface DetailedPricingSummaryProps {
  width?: string
  height?: string | number
  product?: string
  vendor?: string
  vendorPrice?: string
  subtotal?: string
  vat?: string
  total?: string
  proceedText?: string
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
          animation: 'detailed-pricing-summary-glow 2s infinite alternate',
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
    top: '0.5rem',
    right: '0.5rem',
    color: 'rgba(255, 215, 0, 0.2)',
    fontSize: '1.5rem',
    animation: 'detailed-pricing-summary-float 5s infinite alternate',
  } as React.CSSProperties,
  summaryContainer: {
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,
  productTitle: {
    ...(sacredtheme && {
      fontFamily: 'Cinzel, serif',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textShadow: '0 0 5px rgba(255,215,0,0.5)',
    }),
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
  vendorPriceText: {
    ...(sacredtheme && {
      fontWeight: 600,
      textShadow: '0 0 3px rgba(255,215,0,0.5)',
    }),
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
  buttonContainer: {
    marginTop: '1rem',
  } as React.CSSProperties,
})

const DetailedPricingSummary: React.FC<DetailedPricingSummaryProps> = ({
  height,
  product = 'Goobs Repo Unlimited × 1',
  vendor = 'Technologies Unlimited',
  vendorPrice = '$180.00',
  subtotal = '$180.00',
  vat = '$0.00',
  total = '$180.00',
  proceedText = 'Proceed to checkout',
  onProceed,
  sacredtheme = false,
}) => {
  const styles = getStyles(sacredtheme)
  return (
    <div style={{ ...styles.container, minHeight: height }}>
      {sacredtheme && <div style={styles.glyph}>{SACRED_GLYPHS[0]}</div>}
      <div style={styles.summaryContainer}>
        <Typography
          text="Product"
          fontcolor={sacredtheme ? '#FFD700' : 'black'}
          fontvariant="merriparagraph"
          style={styles.productTitle}
        />
        <Typography
          text={product}
          fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
          fontvariant="merriparagraph"
          style={styles.productDescription}
        />
        <div style={styles.vendorSection}>
          <div style={styles.vendorRow}>
            <Typography
              text="Vendor:"
              fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.9)' : 'black'}
              fontvariant="merriparagraph"
            />
            <Typography
              text={vendor}
              fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
              fontvariant="merriparagraph"
            />
          </div>
          <div style={styles.vendorPrice}>
            <Typography
              text={vendorPrice}
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              fontvariant="merriparagraph"
              style={styles.vendorPriceText}
            />
          </div>
        </div>
        <div style={styles.subtotalSection}>
          <Typography
            text="Subtotal"
            fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.9)' : 'black'}
            fontvariant="merriparagraph"
          />
          <Typography
            text={subtotal}
            fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
            fontvariant="merriparagraph"
            align="right"
          />
        </div>
        <div style={styles.vatSection}>
          <Typography
            text="VAT"
            fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.9)' : 'black'}
            fontvariant="merriparagraph"
          />
          <Typography
            text={vat}
            fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
            fontvariant="merriparagraph"
            align="right"
          />
        </div>
        <div style={styles.totalSection}>
          <div style={styles.totalRow}>
            <Typography
              text="Total"
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              fontvariant="merrih5"
              style={styles.totalLabel}
            />
            <Typography
              text={total}
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              fontvariant="merrih5"
              style={styles.totalLabel}
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
    </div>
  )
}

export default DetailedPricingSummary
