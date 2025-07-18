/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchableHistory, {
  DropdownOption,
} from '../Field/Dropdown/SearchableHistory'
import Accordion from '../Accordion'
import Drawer from '../Drawer'
import Typography from '../Typography'
import { NavStyles, getNavStyles, SACRED_GLYPHS } from '../../theme'

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
  verticalNavTitle?: string
  searchableNavLabel?: string
  titleUrl?: string
  mobileOpen?: boolean
  onClose?: () => void
  router?: { push: (route: string) => void }
  pathname?: string
  styles?: NavStyles
  title?: string
  subtitle?: string
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
// MAIN NAV COMPONENT
// --------------------------------------------------------------------------

function Nav({
  items = [],
  verticalNavTitle = 'Navigation',
  searchableNavLabel = 'Search or select a nav',
  titleUrl,
  mobileOpen = false,
  onClose,
  router,
  pathname: propPathname,
  styles,
  title,
  subtitle,
}: NavProps) {
  const [dropdownSelection, setDropdownSelection] = useState<
    string | undefined
  >()
  const [titleHover, setTitleHover] = useState(false)
  const [externalHistoryUpdate, setExternalHistoryUpdate] =
    useState<DropdownOption | null>(null)

  const nextPathname = usePathname()
  const pathname = propPathname || nextPathname

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({
    width: 280,
    height: 600,
  })

  // Get theme styles based on the styles prop
  const themeStyles = getNavStyles(styles, titleHover)
  const isSacredTheme = styles?.theme === 'sacred'
  const showSearchableNav = styles?.showSearchableNav ?? true
  const showTitle = styles?.showTitle ?? true
  const showLine = styles?.showLine ?? true
  const anchor = styles?.anchor || 'left'
  const variant = styles?.variant || 'permanent'
  const spacingFromTopOfScreen = styles?.spacingFromTopOfScreen
  // Use title and subtitle props, fallback to styles if not provided (for backwards compatibility)
  const displayTitle = title || styles?.sacredTitle
  const displaySubtitle = subtitle || styles?.sacredSubtitle

  // Add webkit scrollbar styles to the document for sacred theme
  useEffect(() => {
    if (isSacredTheme) {
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
  }, [isSacredTheme])

  useEffect(() => {
    const activePath = findActiveItemPath(items, pathname)
    if (activePath) {
      const mainNavItemTitle = activePath[0]?.title
      setDropdownSelection(mainNavItemTitle)
    }
  }, [pathname, items])

  useEffect(() => {
    if (!isSacredTheme || !containerRef.current) return
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
  }, [isSacredTheme])

  // Build navOptions to include all items (both parent and child items)
  const buildNavOptions = (navItems: NavItem[]): DropdownOption[] => {
    const options: DropdownOption[] = []

    const addItem = (item: NavItem) => {
      options.push({ value: item.title })
      if (item.children) {
        item.children.forEach(child => addItem(child))
      }
    }

    navItems.forEach(item => addItem(item))
    return options
  }

  const navOptions = buildNavOptions(items)

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

    // Update dropdown selection and external history for SearchableHistory component
    const historyOption: DropdownOption = { value: item.title }
    setDropdownSelection(item.title)
    setExternalHistoryUpdate(historyOption)

    // Reset the external history update after a brief delay to allow the effect to run
    setTimeout(() => setExternalHistoryUpdate(null), 100)
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
            theme: isSacredTheme ? 'sacred' : 'light',
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
            theme: isSacredTheme ? 'sacred' : 'light',
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
    <div style={themeStyles.sacredTitleContainer}>
      {/* Decorative header */}
      <div style={themeStyles.sacredTitleHeader}>
        <div style={themeStyles.sacredTitleHeaderLine} />
        <div style={themeStyles.sacredTitleHeaderGlyph}>𓊹</div>
        <div style={themeStyles.sacredTitleHeaderLine} />
      </div>

      {/* Main title */}
      <Link
        href={titleUrl || '/'}
        style={themeStyles.titleLink}
        onClick={variant === 'temporary' ? onClose : undefined}
      >
        <div
          style={themeStyles.sacredTitleMain}
          onMouseEnter={() => setTitleHover(true)}
          onMouseLeave={() => setTitleHover(false)}
        >
          {displayTitle || verticalNavTitle}
        </div>
      </Link>

      {/* Subtitle if provided */}
      {displaySubtitle && (
        <div style={themeStyles.sacredSubtitle}>{displaySubtitle}</div>
      )}

      {/* Sacred hieroglyphs */}
      <div style={themeStyles.sacredGlyphsContainer}>
        {['𓏏', '𓊖', '𓍯', '𓏏', '𓊖'].map((glyph, i) => (
          <div
            key={i}
            style={{
              ...themeStyles.sacredGlyph,
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
    <div style={themeStyles.titleContainer}>
      <Link href={titleUrl || '/'} style={themeStyles.titleLink}>
        <Typography styles={{ theme: 'sacred', variant: 'cinzelh4' }}>
          {verticalNavTitle}
        </Typography>
      </Link>
    </div>
  )

  const SacredDivider = () => (
    <div style={themeStyles.sacredDivider}>
      <div style={themeStyles.sacredDividerLine} />
      <div style={themeStyles.sacredDividerGlyph}>𓋹</div>
      <div style={themeStyles.sacredDividerLine} />
    </div>
  )

  const navContent = (
    <div ref={containerRef} style={themeStyles.contentContainer}>
      {/* Sacred background */}
      {isSacredTheme && (
        <SacredBackground
          width={containerSize.width}
          height={containerSize.height}
        />
      )}

      {/* Main content */}
      <div
        style={themeStyles.navList}
        className={isSacredTheme ? 'nav-sacred-scrollbar' : ''}
      >
        {/* Title */}
        {showTitle && (isSacredTheme ? <SacredTitle /> : <RegularTitle />)}

        {/* Search dropdown */}
        {showSearchableNav && (
          <div style={themeStyles.searchContainer}>
            <SearchableHistory
              label={searchableNavLabel}
              options={navOptions}
              onChange={handleDropdownChange}
              defaultValue={dropdownSelection}
              externalHistoryUpdate={externalHistoryUpdate}
              styles={{
                theme: isSacredTheme ? 'sacred' : 'light',
                backgroundColor: isSacredTheme
                  ? 'rgba(0, 0, 0, 0.6)'
                  : undefined,
                borderColor: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.4)'
                  : undefined,
                borderFocusedColor: isSacredTheme
                  ? 'rgba(255, 215, 0, 1)'
                  : undefined,
                labelColor: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.8)'
                  : undefined,
                textColor: isSacredTheme ? 'rgba(255, 215, 0, 1)' : undefined,
              }}
            />
          </div>
        )}

        {/* Divider */}
        {showLine &&
          (isSacredTheme ? (
            <SacredDivider />
          ) : (
            <div style={themeStyles.divider} />
          ))}

        {/* Navigation items */}
        <div style={{ overflow: 'visible', minWidth: 'fit-content' }}>
          {selectedMainNavItem
            ? renderNavItem(selectedMainNavItem, 0)
            : items.map(item => renderNavItem(item, 0))}
        </div>

        {/* Sacred footer */}
        {isSacredTheme && (
          <div style={themeStyles.sacredFooter}>
            <div style={themeStyles.sacredFooterText}>
              "Through wisdom, navigate the divine"
            </div>
            <div style={themeStyles.sacredFooterGlyphs}>
              {['𓅨', '𓂋', '𓏭', '𓊵'].map((glyph, i) => (
                <div
                  key={i}
                  style={{
                    ...themeStyles.sacredFooterGlyph,
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
    <div style={themeStyles.container}>
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
            top: spacingFromTopOfScreen,
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
