/**
 * @fileoverview Defines the ProductSummaryCard component, a card for displaying a product summary.
 */
'use client'

import React, { useState, useMemo } from 'react'
import { CardStyles, getCardStyles, SACRED_GLYPHS } from '../../../../theme'
import Typography from '../../../../components/Typography'
import Button, { ButtonProps } from '../../../../components/Button'
import Switch from '../../../../components/Switch'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

interface ProductSummaryCardProps {
  /** Product title */
  title?: string
  /** Product description */
  body?: string
  /** Annual price */
  annualPrice?: string
  /** Monthly price */
  monthlyPrice?: string
  /** First button props */
  button1Props?: ButtonProps
  /** Second button props */
  button2Props?: ButtonProps
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: CardStyles
}

// --------------------------------------------------------------------------
// MAIN PRODUCT SUMMARY CARD COMPONENT
// --------------------------------------------------------------------------

const ProductSummaryCard: React.FC<ProductSummaryCardProps> = ({
  title,
  body,
  annualPrice,
  monthlyPrice,
  button1Props,
  button2Props,
  styles,
}) => {
  const [isAnnualPricing, setIsAnnualPricing] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const isSacredTheme = styles?.theme === 'sacred'

  const computedStyles = useMemo(
    () => getCardStyles({ ...styles, variant: 'productsummary' }, isHovered),
    [styles, isHovered]
  )

  const handlePricingToggle = () => {
    setIsAnnualPricing(!isAnnualPricing)
  }

  const productSummaryStyles = {
    container: {
      ...computedStyles.container,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      overflow: 'hidden',
      ...(isSacredTheme && {
        border: '1px solid rgba(255, 215, 0, 0.3)',
        backgroundColor: 'black',
        boxShadow: '0 0 1.5rem rgba(255, 215, 0, 0.2)',
        backgroundImage:
          'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.05), transparent)',
      }),
    } as React.CSSProperties,
    header: {
      width: '100%',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      zIndex: 10,
      ...(isSacredTheme
        ? {
            borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
            backgroundImage:
              'linear-gradient(to right, rgba(255, 215, 0, 0.05), transparent, rgba(255, 215, 0, 0.05))',
          }
        : {
            borderBottom: '1px solid #E5E7EB',
          }),
    } as React.CSSProperties,
    body: {
      padding: '1rem',
      position: 'relative',
      zIndex: 10,
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
  }

  return (
    <div
      style={productSummaryStyles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sacred theme glyph */}
      {isSacredTheme && (
        <div
          style={{
            ...computedStyles.glyph,
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            color: 'rgba(255, 215, 0, 0.15)',
            fontSize: '4.5rem',
            animation: 'product-summary-float 5s infinite alternate',
            zIndex: 0,
          }}
        >
          {SACRED_GLYPHS[1]}
        </div>
      )}

      {/* Header with title and price */}
      <div style={productSummaryStyles.header}>
        <Typography
          text={title}
          variant="merrih5"
          styles={{
            color: isSacredTheme ? '#FFD700' : computedStyles.title.color,
            fontFamily: isSacredTheme ? 'Cinzel, serif' : undefined,
            fontWeight: isSacredTheme ? 600 : undefined,
            letterSpacing: isSacredTheme ? '0.05em' : undefined,
            textShadow: isSacredTheme
              ? '0 0 5px rgba(255, 215, 0, 0.5)'
              : undefined,
          }}
        />
        <Typography
          text={isAnnualPricing ? `$${annualPrice}` : `$${monthlyPrice}`}
          variant="merrih6"
          styles={{
            color: isSacredTheme ? '#FFD700' : computedStyles.price.color,
            fontWeight: isSacredTheme ? 'bold' : undefined,
            textShadow: isSacredTheme
              ? '0 0 5px rgba(255,215,0,0.5)'
              : undefined,
          }}
        />
      </div>

      {/* Body section */}
      {body && (
        <div style={productSummaryStyles.body}>
          <Typography
            text={body}
            variant="merriparagraph"
            styles={{
              color: isSacredTheme
                ? 'rgba(255, 215, 0, 0.8)'
                : computedStyles.bodyText.color,
              letterSpacing: isSacredTheme ? '0.025em' : undefined,
            }}
          />
        </div>
      )}

      {/* Footer with buttons and toggle */}
      <div style={productSummaryStyles.footer}>
        {button1Props && (
          <Button
            {...button1Props}
            styles={{
              ...button1Props.styles,
              theme: isSacredTheme ? 'sacred' : styles?.theme || 'light',
            }}
          />
        )}

        {/* Pricing toggle */}
        <div style={productSummaryStyles.pricingToggle}>
          <Typography
            text="Monthly"
            variant="merriparagraph"
            styles={{
              color: !isAnnualPricing
                ? isSacredTheme
                  ? '#FFD700'
                  : computedStyles.activeToggleLabel.color
                : isSacredTheme
                  ? 'rgba(255, 215, 0, 0.7)'
                  : computedStyles.toggleLabel.color,
              textShadow:
                !isAnnualPricing && isSacredTheme
                  ? '0 0 3px rgba(255,215,0,0.5)'
                  : undefined,
              marginRight: '0.5rem',
            }}
          />
          <Switch
            checked={isAnnualPricing}
            onChange={handlePricingToggle}
            styles={{
              theme: isSacredTheme ? 'sacred' : styles?.theme || 'light',
            }}
          />
          <Typography
            text="Annual"
            variant="merriparagraph"
            styles={{
              color: isAnnualPricing
                ? isSacredTheme
                  ? '#FFD700'
                  : computedStyles.activeToggleLabel.color
                : isSacredTheme
                  ? 'rgba(255, 215, 0, 0.7)'
                  : computedStyles.toggleLabel.color,
              textShadow:
                isAnnualPricing && isSacredTheme
                  ? '0 0 3px rgba(255,215,0,0.5)'
                  : undefined,
              marginLeft: '0.5rem',
            }}
          />
        </div>

        {button2Props && (
          <Button
            {...button2Props}
            styles={{
              ...button2Props.styles,
              theme: isSacredTheme ? 'sacred' : styles?.theme || 'light',
            }}
          />
        )}
      </div>
    </div>
  )
}

ProductSummaryCard.displayName = 'ProductSummaryCard'

export default ProductSummaryCard
