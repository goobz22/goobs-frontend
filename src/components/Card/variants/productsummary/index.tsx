// src/components/Card/variants/productsummary/index.tsx

'use client'

import React, { useState } from 'react'
import Typography from '../../../../components/Typography'
import CustomButton, { CustomButtonProps } from '../../../../components/Button'
import Switch from '../../../../components/Switch'
import { SACRED_GLYPHS } from '../../../../styles/sacredGlyphs'

interface ProductSummaryCardProps {
  title?: string
  body?: string
  annualPrice?: string
  monthlyPrice?: string
  button1Props?: CustomButtonProps
  button2Props?: CustomButtonProps
  height?: string | number
  sacredtheme?: boolean
}

const getStyles = (sacredtheme?: boolean) => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    overflow: 'hidden',
    ...(sacredtheme
      ? {
          border: '1px solid rgba(255, 215, 0, 0.3)',
          backgroundColor: 'black',
          boxShadow: '0 0 1.5rem rgba(255, 215, 0, 0.2)',
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
    bottom: '1rem',
    left: '1rem',
    color: 'rgba(255, 215, 0, 0.15)',
    fontSize: '4.5rem',
    animation: 'product-summary-float 5s infinite alternate',
    zIndex: 0,
  } as React.CSSProperties,
  header: {
    width: '100%',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
    ...(sacredtheme
      ? {
          borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
          backgroundImage:
            'linear-gradient(to right, rgba(255, 215, 0, 0.05), transparent, rgba(255, 215, 0, 0.05))',
        }
      : {
          borderBottom: '1px solid #E5E7EB',
        }),
  } as React.CSSProperties,
  title: {
    ...(sacredtheme && {
      fontFamily: 'Cinzel, serif',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
    }),
  } as React.CSSProperties,
  price: {
    ...(sacredtheme && {
      fontWeight: 'bold',
      textShadow: '0 0 5px rgba(255,215,0,0.5)',
      animation: 'product-summary-pulse 2s infinite alternate',
    }),
  } as React.CSSProperties,
  body: {
    padding: '1rem',
    position: 'relative',
    zIndex: 10,
  } as React.CSSProperties,
  bodyText: {
    ...(sacredtheme && {
      letterSpacing: '0.025em',
    }),
  } as React.CSSProperties,
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    marginTop: 'auto',
    position: 'relative',
    zIndex: 10,
  } as React.CSSProperties,
  pricingToggle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties,
  toggleLabel: {
    ...(sacredtheme && {
      color: 'rgba(255, 215, 0, 0.7)',
    }),
  } as React.CSSProperties,
  activeToggleLabel: {
    ...(sacredtheme && {
      color: '#FFD700',
      textShadow: '0 0 3px rgba(255,215,0,0.5)',
    }),
  } as React.CSSProperties,
})

const ProductSummaryCard: React.FC<ProductSummaryCardProps> = ({
  title,
  body,
  annualPrice,
  monthlyPrice,
  height,
  button1Props,
  button2Props,
  sacredtheme = false,
}) => {
  const [isAnnualPricing, setIsAnnualPricing] = useState(true)
  const styles = getStyles(sacredtheme)

  const handlePricingToggle = () => {
    setIsAnnualPricing(!isAnnualPricing)
  }

  return (
    <div style={{ ...styles.container, height }}>
      {sacredtheme && <div style={styles.glyph}>{SACRED_GLYPHS[1]}</div>}
      <div style={styles.header}>
        <Typography
          text={title}
          fontcolor={sacredtheme ? '#FFD700' : 'black'}
          fontvariant="merrih5"
          style={styles.title}
        />
        <Typography
          text={isAnnualPricing ? `$${annualPrice}` : `$${monthlyPrice}`}
          fontcolor={sacredtheme ? '#FFD700' : 'blue'}
          fontvariant="merrih6"
          style={styles.price}
        />
      </div>

      {body && (
        <div style={styles.body}>
          <Typography
            text={body}
            fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
            fontvariant="merriparagraph"
            style={styles.bodyText}
          />
        </div>
      )}

      <div style={styles.footer}>
        {button1Props && (
          <CustomButton {...button1Props} sacredtheme={sacredtheme} />
        )}
        <div style={styles.pricingToggle}>
          <Typography
            text="Monthly"
            fontvariant="merriparagraph"
            style={{
              ...styles.toggleLabel,
              ...(!isAnnualPricing && styles.activeToggleLabel),
              marginRight: '0.5rem',
            }}
          />
          <Switch
            checked={isAnnualPricing}
            onChange={handlePricingToggle}
            sacredtheme={sacredtheme}
          />
          <Typography
            text="Annual"
            fontvariant="merriparagraph"
            style={{
              ...styles.toggleLabel,
              ...(isAnnualPricing && styles.activeToggleLabel),
              marginLeft: '0.5rem',
            }}
          />
        </div>
        {button2Props && (
          <CustomButton {...button2Props} sacredtheme={sacredtheme} />
        )}
      </div>
    </div>
  )
}

export default ProductSummaryCard
