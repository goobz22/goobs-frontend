/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchableDropdown, {
  DropdownOption,
} from '../Field/Dropdown/Searchable'
import Accordion from '../Accordion'
import Drawer from '../Drawer'
import Typography from '../Typography'

// --------------------------------------------------------------------------
// EGYPTIAN THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
]

// --------------------------------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------------------------------

/**
 * Recursively searches for the active navigation item based on the current path
 * and returns the trail of parent items leading to it.
 */
const findActiveItemPath = (
  items: NavItem[],
  currentPath: string
): NavItem[] | null => {
  for (const item of items) {
    if (item.route && item.route === currentPath) {
      return [item]
    }

    if (item.children && item.children.length > 0) {
      const childPath = findActiveItemPath(item.children, currentPath)
      if (childPath) {
        return [item, ...childPath]
      }
    }
  }
  return null
}

// --------------------------------------------------------------------------
// INTERFACES
// --------------------------------------------------------------------------

/**
 * Simplified navigation item interface using accordion structure
 */
export interface NavItem {
  title: string
  route?: string
  trigger?: 'route' | 'onClick'
  onClick?: () => void
  children?: NavItem[]
  expanding?: boolean
}

export interface NavProps {
  items?: NavItem[]
  showSearchableNav?: boolean
  showTitle?: boolean
  showLine?: boolean
  verticalNavTitle?: string
  searchableNavLabel?: string
  anchor?: 'left' | 'right'
  backgroundcolor?: string
  titleUrl?: string
  mobileOpen?: boolean
  onClose?: () => void
  variant?: 'temporary' | 'permanent'
  spacingfromtopofscreen?: string
  marginabovetitle?: string
  marginbelowtitle?: string
  router?: { push: (route: string) => void }
  sacredtheme?: boolean
  sacredTitle?: string
  sacredSubtitle?: string
  pathname?: string
}

// --------------------------------------------------------------------------
// SACRED BACKGROUND COMPONENT
// --------------------------------------------------------------------------

interface SacredBackgroundProps {
  width: number
  height: number
}

const SacredBackground: React.FC<SacredBackgroundProps> = ({
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      glyph: string
      size: number
      opacity: number
      maxOpacity: number
    }> = []

    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        glyph: SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)],
        size: 12 + Math.random() * 8,
        opacity: Math.random() * 0.2 + 0.1,
        maxOpacity: Math.random() * 0.3 + 0.2,
      })
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.opacity =
          particle.maxOpacity *
          (0.7 + 0.3 * Math.sin(time * 0.001 + particle.x * 0.01))
        if (particle.x < -20) particle.x = width + 20
        if (particle.x > width + 20) particle.x = -20
        if (particle.y < -20) particle.y = height + 20
        if (particle.y > height + 20) particle.y = -20
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = '#FFD700'
        ctx.font = `${particle.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(255, 215, 0, 0.5)'
        ctx.shadowBlur = 4
        ctx.fillText(particle.glyph, particle.x, particle.y)
        ctx.restore()
      })
      animationRef.current = requestAnimationFrame(animate)
    }
    animate(0)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.4,
        pointerEvents: 'none',
      }}
    />
  )
}

// --------------------------------------------------------------------------
// STYLES
// --------------------------------------------------------------------------

const getStyles = (sacredtheme?: boolean, backgroundcolor?: string) => {
  return {
    navContainer: {
      height: '100%',
      backgroundColor: sacredtheme ? '#0a0a0a' : backgroundcolor || '#F3F4F6',
      color: sacredtheme ? '#FFD700' : 'inherit',
      ...(sacredtheme && {
        backgroundImage: `
          linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
          radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
        `,
        border: `1px solid rgba(255, 215, 0, 0.2)`,
        boxShadow: `
          0 0 30px rgba(255, 215, 0, 0.1),
          inset 0 0 60px rgba(255, 215, 0, 0.03)
        `,
      }),
    } as React.CSSProperties,
    contentContainer: {
      position: 'relative',
      height: '100%',
      overflow: 'visible',
      minWidth: 'fit-content',
    } as React.CSSProperties,
    navList: {
      position: 'relative',
      zIndex: 1,
      height: '100%',
      overflowY: 'auto',
      overflowX: 'visible',
      padding: '0 15px',
      boxSizing: 'border-box',
      minWidth: 'fit-content',
      ...(sacredtheme && {
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255, 215, 0, 0.5) rgba(0, 0, 0, 0.3)',
      }),
    } as React.CSSProperties,
    titleContainer: {
      textAlign: 'center',
      padding: '8px 8px',
      position: 'relative',
      whiteSpace: 'nowrap',
      minWidth: 'fit-content',
    } as React.CSSProperties,
    titleLink: {
      textDecoration: 'none',
      color: 'inherit',
    } as React.CSSProperties,
    searchContainer: {
      position: 'relative',
      zIndex: 1000,
      minHeight: '40px',
      whiteSpace: 'nowrap',
      marginTop: '0',
      paddingLeft: '10px',
      minWidth: 'fit-content',
    } as React.CSSProperties,
    divider: {
      width: '100%',
      height: '1px',
      backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.3)' : 'white',
      marginTop: '20px',
      marginBottom: '8px',
      minWidth: '280px',
    } as React.CSSProperties,
    // Sacred theme specific styles
    sacredTitleContainer: {
      textAlign: 'center',
      padding: '8px 8px',
      position: 'relative',
      whiteSpace: 'nowrap',
      minWidth: 'fit-content',
    } as React.CSSProperties,
    sacredTitleHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
      gap: '8px',
    } as React.CSSProperties,
    sacredTitleHeaderLine: {
      width: '40px',
      height: '1px',
      background:
        'linear-gradient(to right, transparent, #FFD700, transparent)',
    } as React.CSSProperties,
    sacredTitleHeaderGlyph: {
      color: '#FFD700',
      fontSize: '16px',
      animation: 'nav-rotate-glyph 20s linear infinite',
    } as React.CSSProperties,
    sacredTitleMain: {
      color: '#FFD700',
      fontSize: '18px',
      fontWeight: 700,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      animation: 'nav-glow-pulse 3s ease-in-out infinite',
      fontFamily: '"Cinzel", serif',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap',
    } as React.CSSProperties,
    sacredTitleMainHover: {
      transform: 'scale(1.05)',
      textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
    } as React.CSSProperties,
    sacredSubtitle: {
      color: 'rgba(255, 215, 0, 0.7)',
      fontSize: '12px',
      fontStyle: 'italic',
      marginTop: '4px',
      letterSpacing: '1px',
      whiteSpace: 'nowrap',
    } as React.CSSProperties,
    sacredGlyphsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '4px',
      marginTop: '4px',
    } as React.CSSProperties,
    sacredGlyph: {
      color: 'rgba(255, 215, 0, 0.6)',
      fontSize: '10px',
    } as React.CSSProperties,
    sacredDivider: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 16px',
      marginBottom: '-12px',
      minWidth: '280px',
    } as React.CSSProperties,
    sacredDividerLine: {
      width: '30%',
      height: '1px',
      background:
        'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.5), transparent)',
    } as React.CSSProperties,
    sacredDividerGlyph: {
      color: '#FFD700',
      fontSize: '14px',
      padding: '0 8px',
      animation: 'nav-rotate-glyph 15s linear infinite reverse',
    } as React.CSSProperties,
    sacredFooter: {
      textAlign: 'center',
      padding: '24px 16px',
    } as React.CSSProperties,
    sacredFooterText: {
      color: 'rgba(255, 215, 0, 0.6)',
      fontSize: '10px',
      fontStyle: 'italic',
      letterSpacing: '1px',
      marginBottom: '8px',
    } as React.CSSProperties,
    sacredFooterGlyphs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
    } as React.CSSProperties,
    sacredFooterGlyph: {
      color: 'rgba(255, 215, 0, 0.4)',
      fontSize: '12px',
    } as React.CSSProperties,
  }
}

// --------------------------------------------------------------------------
// MAIN NAV COMPONENT
// --------------------------------------------------------------------------

function Nav({
  items = [],
  showSearchableNav = true,
  showTitle = true,
  showLine = true,
  verticalNavTitle = 'Navigation',
  searchableNavLabel = 'Search or select a nav',
  anchor = 'left',
  backgroundcolor,
  titleUrl,
  mobileOpen = false,
  onClose,
  variant = 'permanent',
  spacingfromtopofscreen,
  marginabovetitle = '0px',
  marginbelowtitle = '0px',
  router,
  sacredtheme = false,
  sacredTitle,
  sacredSubtitle,
  pathname: propPathname,
}: NavProps) {
  const [dropdownSelection, setDropdownSelection] = useState<
    string | undefined
  >()
  const [titleHover, setTitleHover] = useState(false)

  const nextPathname = usePathname()
  const pathname = propPathname || nextPathname

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({
    width: 280,
    height: 600,
  })
  const styles = getStyles(sacredtheme, backgroundcolor)

  // Add webkit scrollbar styles to the document for sacred theme
  useEffect(() => {
    if (sacredtheme) {
      const style = document.createElement('style')
      style.textContent = `
        .nav-sacred-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .nav-sacred-scrollbar::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }
        .nav-sacred-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 215, 0, 0.5);
          border-radius: 4px;
        }
        .nav-sacred-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 215, 0, 0.7);
        }
      `
      document.head.appendChild(style)
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [sacredtheme])

  useEffect(() => {
    const activePath = findActiveItemPath(items, pathname)
    if (activePath) {
      const mainNavItemTitle = activePath[0]?.title
      setDropdownSelection(mainNavItemTitle)
    }
  }, [pathname, items])

  useEffect(() => {
    if (!sacredtheme || !containerRef.current) return
    const updateSize = () => {
      const container = containerRef.current
      if (container) {
        setContainerSize({
          width: container.offsetWidth,
          height: container.offsetHeight,
        })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [sacredtheme])

  const navOptions = items.map(item => ({ value: item.title }))

  function handleNavClick(item: NavItem) {
    if (item.trigger === 'route' && item.route && router) {
      router.push(item.route)
      if (variant === 'temporary' && onClose) {
        onClose()
      }
    } else if (item.trigger === 'onClick' && item.onClick) {
      item.onClick()
      if (variant === 'temporary' && onClose) {
        onClose()
      }
    }
  }

  function renderNavItem(item: NavItem, level: number = 0): React.ReactNode {
    const isActive = item.route === pathname
    const hasChildren = item.children && item.children.length > 0

    if (hasChildren) {
      // Accordion with expandable children
      return (
        <Accordion
          key={item.title}
          summary={item.title}
          details={
            <div style={{ padding: '0' }}>
              {item.children?.map(child => renderNavItem(child, level + 1))}
            </div>
          }
          styles={{
            theme: sacredtheme ? 'sacred' : 'light',
            level,
            levelIndentBase: 16,
            levelIndentIncrement: 12,
            outline: false,
          }}
        />
      )
    } else {
      // Menu item (non-expandable)
      return (
        <Accordion
          key={item.title}
          type="menu"
          summary={item.title}
          href={item.route}
          onClick={() => handleNavClick(item)}
          isActive={isActive}
          styles={{
            theme: sacredtheme ? 'sacred' : 'light',
            level,
            levelIndentBase: 16,
            levelIndentIncrement: 12,
            outline: false,
          }}
        />
      )
    }
  }

  const handleDropdownChange = (option: DropdownOption | null) => {
    if (option) {
      setDropdownSelection(option.value)
    }
  }

  const selectedMainNavItem = items.find(
    item => item.title === dropdownSelection
  )

  // Sacred Title Component
  const SacredTitle = () => (
    <div style={styles.sacredTitleContainer}>
      {/* Decorative header */}
      <div style={styles.sacredTitleHeader}>
        <div style={styles.sacredTitleHeaderLine} />
        <div style={styles.sacredTitleHeaderGlyph}>𓊹</div>
        <div style={styles.sacredTitleHeaderLine} />
      </div>

      {/* Main title */}
      <Link
        href={titleUrl || '/'}
        style={styles.titleLink}
        onClick={variant === 'temporary' ? onClose : undefined}
      >
        <div
          style={{
            ...styles.sacredTitleMain,
            ...(titleHover ? styles.sacredTitleMainHover : {}),
          }}
          onMouseEnter={() => setTitleHover(true)}
          onMouseLeave={() => setTitleHover(false)}
        >
          {sacredTitle || verticalNavTitle}
        </div>
      </Link>

      {/* Subtitle if provided */}
      {sacredSubtitle && (
        <div style={styles.sacredSubtitle}>{sacredSubtitle}</div>
      )}

      {/* Sacred hieroglyphs */}
      <div style={styles.sacredGlyphsContainer}>
        {['𓏏', '𓊖', '𓍯', '𓏏', '𓊖'].map((glyph, i) => (
          <div
            key={i}
            style={{
              ...styles.sacredGlyph,
              animation: `nav-float ${2 + i * 0.3}s ease-in-out infinite`,
            }}
          >
            {glyph}
          </div>
        ))}
      </div>
    </div>
  )

  const RegularTitle = () => (
    <div
      style={{
        ...styles.titleContainer,
        marginTop: marginabovetitle,
        marginBottom: marginbelowtitle,
      }}
    >
      <Link href={titleUrl || '/'} style={styles.titleLink}>
        <Typography variant="merrih4" styles={{ color: 'black' }}>
          {verticalNavTitle}
        </Typography>
      </Link>
    </div>
  )

  const SacredDivider = () => (
    <div style={styles.sacredDivider}>
      <div style={styles.sacredDividerLine} />
      <div style={styles.sacredDividerGlyph}>𓋹</div>
      <div style={styles.sacredDividerLine} />
    </div>
  )

  const navContent = (
    <div ref={containerRef} style={styles.contentContainer}>
      {/* Sacred background */}
      {sacredtheme && (
        <SacredBackground
          width={containerSize.width}
          height={containerSize.height}
        />
      )}

      {/* Main content */}
      <div
        style={styles.navList}
        className={sacredtheme ? 'nav-sacred-scrollbar' : ''}
      >
        {/* Title */}
        {showTitle && (sacredtheme ? <SacredTitle /> : <RegularTitle />)}

        {/* Search dropdown */}
        {showSearchableNav && (
          <div style={styles.searchContainer}>
            <SearchableDropdown
              label={searchableNavLabel}
              options={navOptions}
              onChange={handleDropdownChange}
              defaultValue={dropdownSelection}
              styles={{
                theme: sacredtheme ? 'sacred' : 'light',
                backgroundColor: sacredtheme ? 'rgba(0, 0, 0, 0.6)' : undefined,
                borderColor: sacredtheme ? 'rgba(255, 215, 0, 0.4)' : undefined,
                borderFocusedColor: sacredtheme
                  ? 'rgba(255, 215, 0, 1)'
                  : undefined,
                labelColor: sacredtheme ? 'rgba(255, 215, 0, 0.8)' : undefined,
                textColor: sacredtheme ? 'rgba(255, 215, 0, 1)' : undefined,
              }}
            />
          </div>
        )}

        {/* Divider */}
        {showLine &&
          (sacredtheme ? <SacredDivider /> : <div style={styles.divider} />)}

        {/* Navigation items */}
        <div style={{ overflow: 'visible', minWidth: 'fit-content' }}>
          {selectedMainNavItem
            ? renderNavItem(selectedMainNavItem, 0)
            : items.map(item => renderNavItem(item, 0))}
        </div>

        {/* Sacred footer */}
        {sacredtheme && (
          <div style={styles.sacredFooter}>
            <div style={styles.sacredFooterText}>
              "Through wisdom, navigate the divine"
            </div>
            <div style={styles.sacredFooterGlyphs}>
              {['𓅨', '𓂋', '𓏭', '𓊵'].map((glyph, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.sacredFooterGlyph,
                    animation: `nav-glow-pulse ${4 + i * 0.5}s ease-in-out infinite`,
                  }}
                >
                  {glyph}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div
      style={{
        ...styles.navContainer,
        minWidth: 'fit-content',
        overflow: 'visible',
      }}
    >
      {variant === 'temporary' ? (
        <Drawer
          anchor={anchor}
          open={mobileOpen}
          onClose={onClose || (() => {})}
        >
          <div
            style={{
              minWidth: '320px',
              width: 'fit-content',
              overflow: 'visible',
            }}
          >
            {navContent}
          </div>
        </Drawer>
      ) : (
        <div
          style={{
            minWidth: '320px',
            width: 'fit-content',
            height: '100vh',
            position: 'fixed',
            top: spacingfromtopofscreen,
            [anchor]: 0,
            paddingTop: '17px',
            boxSizing: 'border-box',
            overflow: 'visible',
          }}
        >
          {navContent}
        </div>
      )}
    </div>
  )
}

export default Nav
