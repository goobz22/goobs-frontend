/**
 * @fileoverview Defines the ProductCard component, a card for displaying product information and purchase options.
 */
'use client'

import React, { useState, useMemo } from 'react'
import { CardStyles, getCardStyles, SACRED_GLYPHS } from '../../../../theme'
import Typography from '../../../../components/Typography'
import Button from '../../../../components/Button'
import AddIcon from '../../../../components/Icons/Add'
import RemoveIcon from '../../../../components/Icons/Remove'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface ProductCardProps {
  /** Product title */
  title?: string
  /** Number of developers */
  numDevelopers?: number
  /** Callback to add developer */
  onAddDeveloper?: () => void
  /** Callback to remove developer */
  onRemoveDeveloper?: () => void
  /** Number of licenses */
  licenses?: number
  /** Unit price */
  unitPrice?: number
  /** Total price */
  total?: number
  /** Buy button callback */
  onBuy?: () => void
  /** Live preview callback */
  onLivePreview?: () => void
  /** Feature descriptions */
  featuredescriptions?: string[]
  /** Release date */
  releaseDate?: string
  /** Contact callback */
  onContact?: () => void
  /** Created by */
  createdBy?: string
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: CardStyles
}

// --------------------------------------------------------------------------
// MAIN PRODUCT CARD COMPONENT
// --------------------------------------------------------------------------

const ProductCard: React.FC<ProductCardProps> = ({
  title: _title,
  numDevelopers = 1,
  onAddDeveloper,
  onRemoveDeveloper,
  licenses = 1,
  unitPrice = 180,
  total: _total,
  onBuy,
  onLivePreview,
  featuredescriptions = [],
  releaseDate,
  onContact,
  createdBy,
  styles,
}) => {
  const [numDevelopersInput, setNumDevelopersInput] = useState(
    numDevelopers.toString()
  )
  const [numLicenses, setNumLicenses] = useState(licenses)
  const [addHover, setAddHover] = useState(false)
  const [removeHover, setRemoveHover] = useState(false)
  const [contactHover, setContactHover] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isSacredTheme = styles?.theme === 'sacred'

  const computedStyles = useMemo(
    () => getCardStyles({ ...styles, variant: 'product' }, isHovered),
    [styles, isHovered]
  )

  const handleAddDeveloper = () => {
    const newNumDevelopers = parseInt(numDevelopersInput, 10) + 1
    setNumDevelopersInput(newNumDevelopers.toString())
    setNumLicenses(newNumDevelopers)
    onAddDeveloper?.()
  }

  const handleRemoveDeveloper = () => {
    const newNumDevelopers = parseInt(numDevelopersInput, 10) - 1
    if (newNumDevelopers >= 1) {
      setNumDevelopersInput(newNumDevelopers.toString())
      setNumLicenses(newNumDevelopers)
      onRemoveDeveloper?.()
    }
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value
    setNumDevelopersInput(value)
    setNumLicenses(parseInt(value, 10))
  }

  const containerStyle = {
    ...computedStyles.productContainer,
  }

  const developerButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '0.375rem',
    transition: 'all 0.3s ease',
    color: isSacredTheme ? '#FFD700' : '#4B5563',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  }

  const developerButtonHoverStyle = {
    backgroundColor: isSacredTheme ? 'rgba(255, 215, 0, 0.1)' : '#E5E7EB',
    transform: isSacredTheme ? 'scale(1.1)' : 'none',
  }

  const inputStyle = {
    width: '100%',
    border: '1px solid',
    borderRadius: '0.375rem',
    padding: '0.25rem',
    textAlign: 'center' as const,
    backgroundColor: isSacredTheme ? 'rgba(0,0,0,0.8)' : 'white',
    borderColor: isSacredTheme ? 'rgba(255, 215, 0, 0.5)' : '#D1D5DB',
    color: isSacredTheme ? '#FFD700' : 'black',
    fontWeight: isSacredTheme ? 600 : 'normal',
  }

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sacred theme glyph */}
      {isSacredTheme && (
        <div
          style={{
            ...computedStyles.glyph,
            ...computedStyles.glyphTopRight,
            fontSize: '3rem',
            animation: 'product-card-rotate-glyph 15s linear infinite',
            zIndex: 0,
          }}
        >
          {SACRED_GLYPHS[4]}
        </div>
      )}

      {/* Number of developers section */}
      <div style={{ marginBottom: '0.5rem', position: 'relative', zIndex: 10 }}>
        <Typography
          text="Number of developers"
          variant="merriparagraph"
          styles={{
            color: isSacredTheme
              ? 'rgba(255, 215, 0, 0.9)'
              : computedStyles.bodyText.color,
            fontWeight: isSacredTheme ? 600 : undefined,
            letterSpacing: isSacredTheme ? '0.025em' : undefined,
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '0.25rem',
          }}
        >
          <button
            onClick={handleRemoveDeveloper}
            style={{
              ...developerButtonStyle,
              ...(removeHover && developerButtonHoverStyle),
            }}
            onMouseEnter={() => setRemoveHover(true)}
            onMouseLeave={() => setRemoveHover(false)}
          >
            <RemoveIcon style={{ width: '1rem', height: '1rem' }} />
          </button>
          <div style={{ margin: '0 0.25rem', width: '3rem' }}>
            <input
              type="text"
              value={numDevelopersInput}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>
          <button
            onClick={handleAddDeveloper}
            style={{
              ...developerButtonStyle,
              ...(addHover && developerButtonHoverStyle),
            }}
            onMouseEnter={() => setAddHover(true)}
            onMouseLeave={() => setAddHover(false)}
          >
            <AddIcon style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>
      </div>

      {/* Pricing section */}
      <div style={{ marginBottom: '0.5rem', position: 'relative', zIndex: 10 }}>
        <div>
          <Typography
            text={`Licenses: ${numLicenses}`}
            variant="merriparagraph"
            styles={{
              color: isSacredTheme
                ? 'rgba(255, 215, 0, 0.8)'
                : computedStyles.bodyText.color,
            }}
          />
        </div>
        <div>
          <Typography
            text={`Unit price: $ ${unitPrice}`}
            variant="merriparagraph"
            styles={{
              color: isSacredTheme
                ? 'rgba(255, 215, 0, 0.8)'
                : computedStyles.bodyText.color,
            }}
          />
        </div>
        <div style={{ fontWeight: 'bold' }}>
          <Typography
            text={`Total: $ ${(unitPrice * numLicenses).toFixed(2)}`}
            variant="merriparagraph"
            styles={{
              color: isSacredTheme ? '#FFD700' : computedStyles.price.color,
              fontSize: isSacredTheme ? '1.125rem' : undefined,
              fontWeight: isSacredTheme ? 'bold' : undefined,
              textShadow: isSacredTheme
                ? '0 0 5px rgba(255,215,0,0.5)'
                : undefined,
            }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div
        style={{
          marginBottom: '0.5rem',
          display: 'flex',
          justifyContent: 'flex-start',
          position: 'relative',
          zIndex: 10,
          gap: '0.25rem',
        }}
      >
        <Button
          text="Buy now"
          styles={{
            theme: isSacredTheme ? 'sacred' : styles?.theme || 'light',
            backgroundColor: isSacredTheme ? 'rgba(0,0,0,0.9)' : undefined,
            color: isSacredTheme ? '#FFD700' : undefined,
          }}
          onClick={onBuy}
        />
        <Button
          text="Live Preview"
          styles={{
            theme: isSacredTheme ? 'sacred' : styles?.theme || 'light',
            backgroundColor: isSacredTheme ? 'rgba(0,0,0,0.9)' : undefined,
            color: isSacredTheme ? '#FFD700' : undefined,
          }}
          onClick={onLivePreview}
        />
      </div>

      {/* Features */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {featuredescriptions.map((feature, index) => (
          <div key={index}>
            <Typography
              text={`✓ ${feature}`}
              variant="merriparagraph"
              styles={{
                color: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.8)'
                  : computedStyles.bodyText.color,
              }}
            />
          </div>
        ))}
      </div>

      {/* Release date */}
      {releaseDate && (
        <div style={{ marginTop: '0.5rem', position: 'relative', zIndex: 10 }}>
          <Typography
            text={`First release: ${releaseDate}`}
            variant="merriparagraph"
            styles={{
              color: isSacredTheme
                ? 'rgba(255, 215, 0, 0.7)'
                : computedStyles.bodyText.color,
            }}
          />
        </div>
      )}

      {/* Contact */}
      {onContact && (
        <div
          onClick={onContact}
          style={{
            marginTop: '0.5rem',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 10,
          }}
          onMouseEnter={() => setContactHover(true)}
          onMouseLeave={() => setContactHover(false)}
        >
          <Typography
            text="Questions? Contact us"
            variant="merriparagraph"
            styles={{
              color:
                contactHover && isSacredTheme
                  ? '#FBBF24'
                  : isSacredTheme
                    ? 'rgba(255, 215, 0, 0.8)'
                    : computedStyles.bodyText.color,
              textShadow:
                contactHover && isSacredTheme
                  ? '0 0 5px rgba(255,215,0,0.5)'
                  : undefined,
            }}
          />
        </div>
      )}

      {/* Created by */}
      {createdBy && (
        <div style={{ marginTop: '0.5rem', position: 'relative', zIndex: 10 }}>
          <Typography
            text={`Created by ${createdBy}`}
            variant="merriparagraph"
            styles={{
              color: isSacredTheme
                ? 'rgba(255, 215, 0, 0.7)'
                : computedStyles.bodyText.color,
            }}
          />
        </div>
      )}
    </div>
  )
}

ProductCard.displayName = 'ProductCard'

export default ProductCard
