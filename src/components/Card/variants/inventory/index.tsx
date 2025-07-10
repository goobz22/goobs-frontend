'use client'

import React, { useState } from 'react'
import Typography from '../../../../components/Typography'
import Link from 'next/link'
import { SACRED_GLYPHS } from '../../../../styles/sacredGlyphs'

interface InventoryCardProps {
  title?: string
  image?: string
  height?: string | number
  license?: string
  developmentUse?: string
  productionUse?: string
  updates?: string
  support?: string
  price?: string
  quantity?: number
  sacredtheme?: boolean
  onRemove?: () => void
}

const getStyles = (sacredtheme?: boolean, image?: string) => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    overflow: 'hidden',
    ...(sacredtheme
      ? {
          border: '1px solid rgba(255, 215, 0, 0.3)',
          backgroundColor: 'black',
          animation: 'inventory-card-border-glow 2s infinite alternate',
        }
      : {
          border: '1px solid #E5E7EB',
          backgroundColor: 'white',
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
    backgroundImage: `url(${image})`,
    ...(sacredtheme && {
      '::after': {
        content: '""',
        position: 'absolute',
        inset: '0px',
        backgroundImage:
          'linear-gradient(to right, transparent, rgba(0,0,0,0.8))',
      },
    }),
  } as React.CSSProperties,
  content: {
    padding: '1rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 20,
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    color: 'rgba(255, 215, 0, 0.2)',
    fontSize: '2.25rem',
    animation: 'inventory-card-pulse 3s infinite',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
      fontWeight: 600,
      textShadow: '0 0 3px rgba(255,215,0,0.5)',
    }),
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
  removeText: {
    ...(sacredtheme && {
      textDecoration: 'underline',
    }),
  } as React.CSSProperties,
  removeTextHover: {
    ...(sacredtheme && {
      color: '#FBBF24',
      textShadow: '0 0 5px rgba(255,215,0,0.5)',
    }),
  } as React.CSSProperties,
})

const InventoryCard: React.FC<InventoryCardProps> = ({
  title,
  image,
  height,
  license,
  developmentUse,
  productionUse,
  updates,
  support,
  price,
  quantity,
  sacredtheme = false,
  onRemove,
}) => {
  const [removeHover, setRemoveHover] = useState(false)
  const styles = getStyles(sacredtheme, image)

  return (
    <div style={{ ...styles.container, minHeight: height }}>
      {sacredtheme && <div style={styles.shimmer} />}
      <div style={styles.imageContainer} />
      <div style={styles.content}>
        {sacredtheme && <div style={styles.glyph}>{SACRED_GLYPHS[2]}</div>}
        <div style={styles.header}>
          {title && (
            <Typography
              text={title}
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              fontvariant="merrih5"
              style={styles.title}
            />
          )}
          <div style={{ textAlign: 'right' }}>
            <Typography
              text={`${quantity} x ${price}`}
              fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.9)' : 'black'}
              fontvariant="merriparagraph"
              style={styles.price}
            />
          </div>
        </div>

        <div style={styles.details}>
          <div style={styles.detailItem}>
            <Typography
              text={`License: ${license || ''}`}
              fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
              fontvariant="merriparagraph"
            />
          </div>
          <div style={styles.detailItem}>
            <Typography
              text={`Development use: ${developmentUse || ''}`}
              fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
              fontvariant="merriparagraph"
            />
          </div>
          <div style={styles.detailItem}>
            <Typography
              text={`Production use: ${productionUse || ''}`}
              fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
              fontvariant="merriparagraph"
            />
          </div>
          <div style={styles.detailItem}>
            <Typography
              text={`Updates: ${updates || ''}`}
              fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
              fontvariant="merriparagraph"
            />
          </div>
          <div style={styles.detailItem}>
            <Typography
              text={`Support: ${support || ''}`}
              fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black'}
              fontvariant="merriparagraph"
            />
          </div>
        </div>

        <div style={styles.removeLink}>
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
            >
              <Typography
                text="Remove"
                fontcolor={sacredtheme ? '#FFD700' : 'black'}
                fontvariant="merriparagraph"
                style={{
                  ...styles.removeText,
                  ...(removeHover && styles.removeTextHover),
                }}
              />
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default InventoryCard
