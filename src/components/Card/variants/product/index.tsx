// src/components/Card/variants/product/index.tsx

'use client'

import React, { useState } from 'react'
import Typography from '../../../../components/Typography'
import CustomButton from '../../../../components/Button'
import AddIcon from '../../../../components/Icons/Add'
import RemoveIcon from '../../../../components/Icons/Remove'
import { SACRED_GLYPHS } from '../../../../styles/sacredGlyphs'

interface ProductCardProps {
  title?: string
  numDevelopers?: number
  onAddDeveloper?: () => void
  onRemoveDeveloper?: () => void
  licenses?: number
  unitPrice?: number
  total?: number
  onBuy?: () => void
  onLivePreview?: () => void
  featuredescriptions?: string[]
  releaseDate?: string
  onContact?: () => void
  createdBy?: string
  sacredtheme?: boolean
  height?: string | number
}

const getStyles = (sacredtheme?: boolean) => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    overflow: 'hidden',
    ...(sacredtheme
      ? {
          border: '1px solid rgba(255, 215, 0, 0.3)',
          backgroundColor: 'black',
          animation: 'product-card-glow 2s infinite alternate',
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
    fontSize: '3rem',
    animation: 'product-card-rotate-glyph 15s linear infinite',
    zIndex: 0,
  } as React.CSSProperties,
  section: {
    marginBottom: '0.5rem',
    position: 'relative',
    zIndex: 10,
  } as React.CSSProperties,
  developerCountContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '0.25rem',
  } as React.CSSProperties,
  developerButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '0.375rem',
    transition: 'all 0.3s ease',
    ...(sacredtheme
      ? {
          color: '#FFD700',
        }
      : {
          color: '#4B5563',
        }),
  } as React.CSSProperties,
  developerButtonHover: {
    ...(sacredtheme
      ? {
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          transform: 'scale(1.1)',
        }
      : {
          backgroundColor: '#E5E7EB',
        }),
  } as React.CSSProperties,
  input: {
    width: '100%',
    border: '1px solid',
    borderRadius: '0.375rem',
    padding: '0.25rem',
    textAlign: 'center',
    ...(sacredtheme
      ? {
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderColor: 'rgba(255, 215, 0, 0.5)',
          color: '#FFD700',
          fontWeight: 600,
          animation: 'product-card-counter-glow 1.5s infinite alternate',
        }
      : {
          backgroundColor: 'white',
          borderColor: '#D1D5DB',
          color: 'black',
        }),
  } as React.CSSProperties,
  buttonGroup: {
    marginBottom: '0.5rem',
    display: 'flex',
    justifyContent: 'flex-start',
    position: 'relative',
    zIndex: 10,
  } as React.CSSProperties,
  contact: {
    marginTop: '0.5rem',
    cursor: 'pointer',
    position: 'relative',
    zIndex: 10,
  } as React.CSSProperties,
  contactHover: {
    ...(sacredtheme && {
      color: '#FBBF24',
      textShadow: '0 0 5px rgba(255,215,0,0.5)',
    }),
  } as React.CSSProperties,
})

const ProductCard: React.FC<ProductCardProps> = ({
  numDevelopers = 1,
  onAddDeveloper,
  onRemoveDeveloper,
  licenses = 1,
  unitPrice = 180,
  onBuy,
  onLivePreview,
  featuredescriptions = [],
  releaseDate,
  onContact,
  createdBy,
  sacredtheme = false,
  height,
}) => {
  const [numDevelopersInput, setNumDevelopersInput] = useState(
    numDevelopers.toString()
  )
  const [numLicenses, setNumLicenses] = useState(licenses)
  const [addHover, setAddHover] = useState(false)
  const [removeHover, setRemoveHover] = useState(false)
  const [contactHover, setContactHover] = useState(false)
  const styles = getStyles(sacredtheme)

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

  return (
    <div style={{ ...styles.container, minHeight: height }}>
      {sacredtheme && <div style={styles.glyph}>{SACRED_GLYPHS[4]}</div>}

      <div style={styles.section}>
        <Typography
          text="Number of developers"
          fontvariant="merriparagraph"
          fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.9)' : 'black'}
          style={
            sacredtheme ? { fontWeight: 600, letterSpacing: '0.025em' } : {}
          }
        />
        <div style={styles.developerCountContainer}>
          <button
            onClick={handleRemoveDeveloper}
            style={{
              ...styles.developerButton,
              ...(removeHover && styles.developerButtonHover),
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
              style={styles.input}
            />
          </div>
          <button
            onClick={handleAddDeveloper}
            style={{
              ...styles.developerButton,
              ...(addHover && styles.developerButtonHover),
            }}
            onMouseEnter={() => setAddHover(true)}
            onMouseLeave={() => setAddHover(false)}
          >
            <AddIcon style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>
      </div>

      <div style={styles.section}>
        <div>
          <Typography
            text={`Licenses: ${numLicenses}`}
            fontvariant="merriparagraph"
            fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
          />
        </div>
        <div>
          <Typography
            text={`Unit price: $ ${unitPrice}`}
            fontvariant="merriparagraph"
            fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
          />
        </div>
        <div style={{ fontWeight: 'bold' }}>
          <Typography
            text={`Total: $ ${(unitPrice * numLicenses).toFixed(2)}`}
            fontvariant="merriparagraph"
            fontcolor={sacredtheme ? '#FFD700' : 'black'}
            style={
              sacredtheme
                ? {
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    textShadow: '0 0 5px rgba(255,215,0,0.5)',
                  }
                : {}
            }
          />
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <div style={{ marginRight: '0.125rem' }}>
          <CustomButton
            text="Buy now"
            fontcolor={sacredtheme ? '#FFD700' : 'white'}
            backgroundcolor={sacredtheme ? 'rgba(0,0,0,0.9)' : 'black'}
            onClick={onBuy}
            sacredtheme={sacredtheme}
          />
        </div>
        <div style={{ marginLeft: '0.125rem' }}>
          <CustomButton
            text="Live Preview"
            fontcolor={sacredtheme ? '#FFD700' : 'white'}
            backgroundcolor={sacredtheme ? 'rgba(0,0,0,0.9)' : 'black'}
            onClick={onLivePreview}
            sacredtheme={sacredtheme}
          />
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        {featuredescriptions.map((feature, index) => (
          <div key={index}>
            <Typography
              text={`✓ ${feature}`}
              fontvariant="merriparagraph"
              fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '0.5rem', position: 'relative', zIndex: 10 }}>
        <Typography
          text={`First release: ${releaseDate}`}
          fontvariant="merriparagraph"
          fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.7)' : 'black'}
        />
      </div>

      <div
        onClick={onContact}
        style={{ ...styles.contact, ...(contactHover && styles.contactHover) }}
        onMouseEnter={() => setContactHover(true)}
        onMouseLeave={() => setContactHover(false)}
      >
        <Typography
          text="Questions? Contact us"
          fontvariant="merriparagraph"
          fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
        />
      </div>

      <div style={{ marginTop: '0.5rem', position: 'relative', zIndex: 10 }}>
        <Typography
          text={`Created by ${createdBy}`}
          fontvariant="merriparagraph"
          fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.7)' : 'black'}
        />
      </div>
    </div>
  )
}

export default ProductCard
