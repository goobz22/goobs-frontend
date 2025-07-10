import React, { useState } from 'react'
import Typography from '../../../../components/Typography'
import InfoIcon from '../../../../components/Icons/Info'
import StyledTooltip from '../../../../components/Tooltip'
import CustomButton from '../../../../components/Button'
import Link from 'next/link'
import FavoriteIcon from '../../../../components/Icons/FavoriteIcon'
import {
  CustomStepper,
  CustomStepperProps,
} from '../../../../components/Stepper'

interface DefaultCardProps {
  title?: string
  titleUnderline?: boolean
  body?: string
  image?: string
  imagePosition?: 'top' | 'left'
  parentText?: string
  parentLink?: string
  childText?: string
  childLink?: string
  grandchildLink?: string
  favoriteEnabled?: boolean
  breadcrumbEnabled?: boolean
  linkEnabled?: boolean
  width?: string | number
  height?: string | number
  stepperEnabled?: boolean
  stepperSteps?: CustomStepperProps['steps']
  className?: string
  sacredtheme?: boolean
  outline?: boolean
}

// Sacred glyphs for theming
const SACRED_GLYPHS = ['𓁟', '𓂀', '𓃀', '𓄿', '𓊖', '𓊗', '𓋴', '𓏏']

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '"Inter", sans-serif',
  } as React.CSSProperties,

  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  } as React.CSSProperties,

  containerHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  } as React.CSSProperties,

  containerWithImage: {
    flexDirection: 'row',
  } as React.CSSProperties,

  image: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    flexShrink: 0,
  } as React.CSSProperties,

  imageTop: {
    width: '100%',
    height: '192px',
  } as React.CSSProperties,

  imageLeft: {
    width: '192px',
    height: '100%',
  } as React.CSSProperties,

  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  } as React.CSSProperties,

  header: {
    width: '100%',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
    backgroundColor: 'rgba(248, 250, 252, 0.5)',
  } as React.CSSProperties,

  headerNoUnderline: {
    borderBottom: 'none',
  } as React.CSSProperties,

  bodySection: {
    padding: '24px',
  } as React.CSSProperties,

  bodyMobile: {
    padding: '24px',
    display: 'block',
  } as React.CSSProperties,

  bodyDesktop: {
    display: 'none',
  } as React.CSSProperties,

  footer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    marginTop: 'auto',
    borderTop: '1px solid rgba(226, 232, 240, 0.3)',
    backgroundColor: 'rgba(248, 250, 252, 0.3)',
  } as React.CSSProperties,

  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,

  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background:
      'linear-gradient(180deg, rgb(59, 130, 246) 0%, rgb(147, 197, 253) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  } as React.CSSProperties,

  accentVisible: {
    opacity: 1,
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    borderRadius: '12px',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    backdropFilter: 'blur(8px)',
    boxShadow:
      '0 0 20px rgba(255, 215, 0, 0.2), 0 0 40px rgba(255, 215, 0, 0.1)',
    overflow: 'hidden',
    transition: 'all 0.4s ease',
    fontFamily: '"Cinzel", serif',
    backgroundImage: `
      radial-gradient(circle at top right, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.02) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
  } as React.CSSProperties,

  containerHover: {
    transform: 'translateY(-2px)',
    borderColor: 'rgba(255, 215, 0, 0.8)',
    boxShadow:
      '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)',
    backgroundImage: `
      linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),
      radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  containerWithImage: {
    flexDirection: 'row',
  } as React.CSSProperties,

  image: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    flexShrink: 0,
    position: 'relative',
  } as React.CSSProperties,

  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(45deg, transparent 0%, rgba(255, 215, 0, 0.1) 50%, transparent 100%)',
  } as React.CSSProperties,

  imageTop: {
    width: '100%',
    height: '192px',
  } as React.CSSProperties,

  imageLeft: {
    width: '192px',
    height: '100%',
  } as React.CSSProperties,

  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  } as React.CSSProperties,

  header: {
    width: '100%',
    padding: '20px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  } as React.CSSProperties,

  headerNoUnderline: {
    borderBottom: 'none',
  } as React.CSSProperties,

  bodySection: {
    padding: '28px',
  } as React.CSSProperties,

  bodyMobile: {
    padding: '28px',
    display: 'block',
  } as React.CSSProperties,

  bodyDesktop: {
    display: 'none',
  } as React.CSSProperties,

  footer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 28px',
    marginTop: 'auto',
    borderTop: '1px solid rgba(255, 215, 0, 0.3)',
    backgroundColor: 'rgba(255, 215, 0, 0.03)',
  } as React.CSSProperties,

  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    fontSize: '16px',
    color: 'rgba(255, 215, 0, 0.2)',
    pointerEvents: 'none',
    opacity: 0.3,
  } as React.CSSProperties,

  glyphTopRight: {
    top: '12px',
    right: '12px',
  } as React.CSSProperties,

  glyphBottomLeft: {
    bottom: '12px',
    left: '12px',
  } as React.CSSProperties,
}

const DefaultCard: React.FC<DefaultCardProps> = ({
  title,
  titleUnderline = true,
  body,
  image,
  imagePosition = 'top',
  parentText = 'Parent',
  parentLink = '/',
  childText = 'Child',
  childLink = '/',
  grandchildLink = '/',
  favoriteEnabled = false,
  breadcrumbEnabled = false,
  linkEnabled = false,
  width = '100%',
  height,
  stepperEnabled = false,
  stepperSteps = [],
  className,
  sacredtheme = false,
  outline = true,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const styles = sacredtheme ? sacredStyles : premiumStyles

  const containerStyle = {
    ...styles.container,
    ...(!outline && styles.containerNoOutline),
    ...(image && imagePosition === 'left' && styles.containerWithImage),
    ...(isHovered && styles.containerHover),
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  const imageStyle = {
    ...styles.image,
    ...(imagePosition === 'top' ? styles.imageTop : styles.imageLeft),
    backgroundImage: image ? `url(${image})` : undefined,
  }

  const headerStyle = {
    ...styles.header,
    ...(!titleUnderline && styles.headerNoUnderline),
  }

  return (
    <div
      className={className}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {/* Sacred glyphs */}
      {sacredtheme && (
        <>
          <div style={{ ...sacredStyles.glyph, ...sacredStyles.glyphTopRight }}>
            {SACRED_GLYPHS[0]}
          </div>
          <div
            style={{ ...sacredStyles.glyph, ...sacredStyles.glyphBottomLeft }}
          >
            {SACRED_GLYPHS[1]}
          </div>
        </>
      )}

      {/* Blue accent bar for premium theme */}
      {!sacredtheme && outline && (
        <div
          style={{
            ...premiumStyles.accent,
            ...(isHovered && premiumStyles.accentVisible),
          }}
        />
      )}

      {/* Image */}
      {image && (
        <div style={imageStyle}>
          {sacredtheme && <div style={sacredStyles.imageOverlay} />}
        </div>
      )}

      {/* Content */}
      <div style={styles.content}>
        {/* Header */}
        {title && (
          <div style={headerStyle}>
            <Typography
              text={title}
              fontcolor={sacredtheme ? '#FFD700' : 'rgb(31, 41, 55)'}
              fontvariant="merrih5"
              style={{
                ...(sacredtheme && {
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 700,
                  textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                }),
              }}
            />
            {favoriteEnabled && <FavoriteIcon />}
          </div>
        )}

        {/* Body - Desktop */}
        {body && (
          <div className="hidden md:block" style={styles.bodySection}>
            <Typography
              text={body}
              fontcolor={
                sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'rgb(55, 65, 81)'
              }
              fontvariant="merriparagraph"
              style={{
                ...(sacredtheme && {
                  fontFamily: '"Merriweather", serif',
                  lineHeight: 1.6,
                }),
              }}
            />
          </div>
        )}

        {/* Body - Mobile (with tooltip) */}
        {body && (
          <div className="block md:hidden" style={styles.bodySection}>
            <StyledTooltip
              title={body}
              arrow
              tooltipplacement="right"
              offsetX={0}
              offsetY={0}
              sacredtheme={sacredtheme}
            >
              <InfoIcon
                style={{
                  color: sacredtheme ? '#FFD700' : 'black',
                  cursor: 'pointer',
                  ...(sacredtheme && {
                    filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
                  }),
                }}
              />
            </StyledTooltip>
          </div>
        )}

        {/* Stepper */}
        {stepperEnabled && (
          <div style={{ padding: '0 24px' }}>
            <CustomStepper orientation="vertical" steps={stepperSteps} />
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <div>
            {breadcrumbEnabled && (
              <div style={styles.breadcrumb}>
                <Link href={parentLink} passHref>
                  <Typography
                    text={parentText}
                    fontcolor={
                      sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'rgb(75, 85, 99)'
                    }
                    fontvariant="merriparagraph"
                    style={{
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      ...(sacredtheme && {
                        '&:hover': {
                          color: '#FFD700',
                          textShadow: '0 0 8px rgba(255, 215, 0, 0.8)',
                        },
                      }),
                    }}
                  />
                </Link>
                <Typography
                  text=">"
                  fontcolor={
                    sacredtheme
                      ? 'rgba(255, 215, 0, 0.6)'
                      : 'rgb(107, 114, 128)'
                  }
                  fontvariant="merriparagraph"
                />
                <Link href={childLink} passHref>
                  <Typography
                    text={childText}
                    fontcolor={
                      sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'rgb(75, 85, 99)'
                    }
                    fontvariant="merriparagraph"
                    style={{
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      ...(sacredtheme && {
                        '&:hover': {
                          color: '#FFD700',
                          textShadow: '0 0 8px rgba(255, 215, 0, 0.8)',
                        },
                      }),
                    }}
                  />
                </Link>
              </div>
            )}
          </div>
          <div style={{ paddingLeft: '16px' }}>
            {linkEnabled && (
              <Link href={grandchildLink} passHref>
                <CustomButton
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  }
                  iconcolor={sacredtheme ? '#FFD700' : 'rgb(55, 65, 81)'}
                  iconsize="15px"
                  iconlocation="right"
                  backgroundcolor="none"
                  sacredtheme={sacredtheme}
                  outline={outline}
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefaultCard
