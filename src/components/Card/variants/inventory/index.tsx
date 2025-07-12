/**
 * @fileoverview Defines the InventoryCard component, a card for displaying an inventory item.
 */
'use client'

import React, { useState, useMemo } from 'react'
import { CardStyles, getCardStyles, SACRED_GLYPHS } from '../../../../theme'
import Typography from '../../../../components/Typography'
import Link from 'next/link'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

interface InventoryCardProps {
  /** Item title */
  title?: string
  /** Item image URL */
  image?: string
  /** License type */
  license?: string
  /** Development use description */
  developmentUse?: string
  /** Production use description */
  productionUse?: string
  /** Updates description */
  updates?: string
  /** Support description */
  support?: string
  /** Price per item */
  price?: string
  /** Quantity */
  quantity?: number
  /** Remove item callback */
  onRemove?: () => void
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: CardStyles
}

// --------------------------------------------------------------------------
// MAIN INVENTORY CARD COMPONENT
// --------------------------------------------------------------------------

const InventoryCard: React.FC<InventoryCardProps> = ({
  title,
  image,
  license,
  developmentUse,
  productionUse,
  updates,
  support,
  price,
  quantity,
  onRemove,
  styles,
}) => {
  const [removeHover, setRemoveHover] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isSacredTheme = styles?.theme === 'sacred'

  const computedStyles = useMemo(
    () => getCardStyles({ ...styles, variant: 'inventory' }, isHovered),
    [styles, isHovered]
  )

  const inventoryStyles = {
    container: {
      ...computedStyles.inventoryContainer,
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      overflow: 'hidden',
      ...(isSacredTheme && {
        border: '1px solid rgba(255, 215, 0, 0.3)',
        backgroundColor: 'black',
        animation: 'inventory-card-border-glow 2s infinite alternate',
      }),
    } as React.CSSProperties,
    shimmer: {
      position: 'absolute',
      inset: '0px',
      backgroundImage:
        'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.05), transparent)',
      animation: 'inventory-card-shimmer 3s infinite',
      pointerEvents: 'none',
      zIndex: 10,
    } as React.CSSProperties,
    imageContainer: {
      width: '200px',
      minHeight: '100%',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      flexShrink: 0,
      position: 'relative',
      zIndex: 20,
    } as React.CSSProperties,
    content: {
      padding: '1rem',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 20,
    } as React.CSSProperties,
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    } as React.CSSProperties,
    details: {
      marginTop: 'auto',
      paddingBottom: '0.625rem',
    } as React.CSSProperties,
    detailItem: {
      marginTop: '0.25rem',
    } as React.CSSProperties,
    removeLink: {
      marginTop: 'auto',
      alignSelf: 'flex-end',
    } as React.CSSProperties,
  }

  return (
    <div
      style={inventoryStyles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sacred theme shimmer effect */}
      {isSacredTheme && <div style={inventoryStyles.shimmer} />}

      {/* Image section */}
      <div
        style={{
          ...inventoryStyles.imageContainer,
          backgroundImage: image ? `url(${image})` : undefined,
        }}
      />

      {/* Content section */}
      <div style={inventoryStyles.content}>
        {/* Sacred theme glyph */}
        {isSacredTheme && (
          <div
            style={{
              ...computedStyles.glyph,
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              color: 'rgba(255, 215, 0, 0.2)',
              fontSize: '2.25rem',
              animation: 'inventory-card-pulse 3s infinite',
            }}
          >
            {SACRED_GLYPHS[2]}
          </div>
        )}

        {/* Header with title and price */}
        <div style={inventoryStyles.header}>
          {title && (
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
          )}
          <div style={{ textAlign: 'right' }}>
            <Typography
              text={`${quantity} x ${price}`}
              variant="merriparagraph"
              styles={{
                color: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.9)'
                  : computedStyles.price.color,
                fontWeight: isSacredTheme ? 600 : undefined,
                textShadow: isSacredTheme
                  ? '0 0 3px rgba(255,215,0,0.5)'
                  : undefined,
              }}
            />
          </div>
        </div>

        {/* Details section */}
        <div style={inventoryStyles.details}>
          <div style={inventoryStyles.detailItem}>
            <Typography
              text={`License: ${license || ''}`}
              variant="merriparagraph"
              styles={{
                color: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.8)'
                  : computedStyles.bodyText.color,
              }}
            />
          </div>
          <div style={inventoryStyles.detailItem}>
            <Typography
              text={`Development use: ${developmentUse || ''}`}
              variant="merriparagraph"
              styles={{
                color: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.8)'
                  : computedStyles.bodyText.color,
              }}
            />
          </div>
          <div style={inventoryStyles.detailItem}>
            <Typography
              text={`Production use: ${productionUse || ''}`}
              variant="merriparagraph"
              styles={{
                color: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.8)'
                  : computedStyles.bodyText.color,
              }}
            />
          </div>
          <div style={inventoryStyles.detailItem}>
            <Typography
              text={`Updates: ${updates || ''}`}
              variant="merriparagraph"
              styles={{
                color: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.8)'
                  : computedStyles.bodyText.color,
              }}
            />
          </div>
          <div style={inventoryStyles.detailItem}>
            <Typography
              text={`Support: ${support || ''}`}
              variant="merriparagraph"
              styles={{
                color: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.8)'
                  : computedStyles.bodyText.color,
              }}
            />
          </div>
        </div>

        {/* Remove link */}
        <div style={inventoryStyles.removeLink}>
          <Link
            href="#"
            passHref
            onClick={e => {
              e.preventDefault()
              onRemove?.()
            }}
          >
            <span
              onMouseEnter={() => setRemoveHover(true)}
              onMouseLeave={() => setRemoveHover(false)}
              style={{
                textDecoration: isSacredTheme ? 'underline' : undefined,
              }}
            >
              <Typography
                text="Remove"
                variant="merriparagraph"
                styles={{
                  color: removeHover
                    ? isSacredTheme
                      ? '#FBBF24'
                      : computedStyles.title.color
                    : isSacredTheme
                      ? '#FFD700'
                      : computedStyles.bodyText.color,
                  textShadow:
                    removeHover && isSacredTheme
                      ? '0 0 5px rgba(255,215,0,0.5)'
                      : undefined,
                }}
              />
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

InventoryCard.displayName = 'InventoryCard'

export default InventoryCard
