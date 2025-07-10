/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchableDropdown, {
  DropdownOption,
} from '../Field/Dropdown/Searchable'
import ExpandingNav from './VerticalVariant/mainNav/expanding'
import ListNav from './VerticalVariant/mainNav/list'
import ExpandingSubNav from './VerticalVariant/subNav/expanding'
import ListSubNav from './VerticalVariant/subNav/list'
import ViewNav from './VerticalVariant/viewNav'
import ExpandingViewNav from './VerticalVariant/viewNav/expanding'
import SubViewNav from './VerticalVariant/subViewNav/list'
import ExpandingSubViewNav from './VerticalVariant/subViewNav/expanding'
import SubSubViewNav from './VerticalVariant/subSubViewNav/list'
import Drawer from '../Drawer'
import Typography from '../Typography'

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
  '',
  '𓊵',
]

const findActiveItemPath = (
  items: NavItem[],
  currentPath: string
): NavItem[] | null => {
  for (const item of items) {
    if (item.route && item.route === currentPath) {
      return [item]
    }

    let children: NavItem[] | undefined
    switch (item.navType) {
      case 'mainNav':
        children = item.subnavs
        break
      case 'subNav':
        children = item.views
        break
      case 'viewNav':
        children = item.subViewNavs
        break
      case 'subViewNav':
        children = item.subSubViewNavs
        break
    }

    if (children && children.length > 0) {
      const childPath = findActiveItemPath(children, currentPath)
      if (childPath) {
        return [item, ...childPath]
      }
    }
  }
  return null
}

export interface NavItem {
  navType: 'mainNav' | 'subNav' | 'viewNav' | 'subViewNav' | 'subSubViewNav'
  title: string
  route?: string
  trigger?: 'route' | 'onClick'
  onClick?: () => void
  expanding?: boolean
  subnavs?: NavItem[]
  views?: NavItem[]
  subViewNavs?: NavItem[]
  subSubViewNavs?: NavItem[]
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
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
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

const getStyles = (sacredtheme?: boolean, backgroundcolor?: string) => ({
  navContainer: {
    height: '100%',
    backgroundColor: sacredtheme ? '#1C1917' : backgroundcolor || '#F3F4F6',
    color: sacredtheme ? '#FFD700' : 'inherit',
  } as React.CSSProperties,
  sacredDivider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 0.5rem',
    marginBottom: '-6px',
  } as React.CSSProperties,
  sacredDividerLine: {
    width: '30%',
    height: '1px',
    backgroundImage:
      'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.5), transparent)',
  } as React.CSSProperties,
  sacredDividerGlyph: {
    color: '#FFD700',
    fontSize: '0.875rem',
    padding: '0 0.25rem',
    animation: 'nav-rotate-glyph 10s linear infinite',
  } as React.CSSProperties,
  contentContainer: {
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
  } as React.CSSProperties,
  navList: {
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: '17px',
    boxSizing: 'content-box',
  } as React.CSSProperties,
  titleLink: {
    textDecoration: 'none',
  } as React.CSSProperties,
  sacredFooter: {
    textAlign: 'center',
    padding: '0.75rem 0.5rem',
  } as React.CSSProperties,
  sacredFooterText: {
    color: 'rgba(255, 215, 0, 0.6)',
    fontSize: '0.75rem',
    fontStyle: 'italic',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  sacredFooterGlyphs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.25rem',
  } as React.CSSProperties,
  sacredFooterGlyph: {
    color: 'rgba(255, 215, 0, 0.4)',
    fontSize: '0.75rem',
    animation: 'nav-glow-pulse 3s infinite alternate',
  } as React.CSSProperties,
})

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
  const [expandedNavs, setExpandedNavs] = useState<string[]>([])
  const [expandedSubnavs, setExpandedSubnavs] = useState<string[]>([])
  const [expandedViewNavs, setExpandedViewNavs] = useState<string[]>([])
  const [expandedSubViewNavs, setExpandedSubViewNavs] = useState<string[]>([])
  const [dropdownSelection, setDropdownSelection] = useState<
    string | undefined
  >()

  const nextPathname = usePathname()
  const pathname = propPathname || nextPathname

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({
    width: 280,
    height: 600,
  })
  const styles = getStyles(sacredtheme, backgroundcolor)

  useEffect(() => {
    const activePath = findActiveItemPath(items, pathname)
    if (activePath) {
      const mainNavItemTitle = activePath[0]?.title
      setDropdownSelection(mainNavItemTitle)
      const newExpandedNavs: string[] = []
      const newExpandedSubnavs: string[] = []
      const newExpandedViewNavs: string[] = []
      const newExpandedSubViewNavs: string[] = []

      activePath.forEach(pathItem => {
        const hasChildren =
          pathItem.subnavs?.length ||
          pathItem.views?.length ||
          pathItem.subViewNavs?.length ||
          pathItem.subSubViewNavs?.length
        if (hasChildren) {
          switch (pathItem.navType) {
            case 'mainNav':
              newExpandedNavs.push(pathItem.title)
              break
            case 'subNav':
              newExpandedSubnavs.push(pathItem.title)
              break
            case 'viewNav':
              newExpandedViewNavs.push(pathItem.title)
              break
            case 'subViewNav':
              newExpandedSubViewNavs.push(pathItem.title)
              break
          }
        }
      })
      setExpandedNavs(current => [...new Set([...current, ...newExpandedNavs])])
      setExpandedSubnavs(current => [
        ...new Set([...current, ...newExpandedSubnavs]),
      ])
      setExpandedViewNavs(current => [
        ...new Set([...current, ...newExpandedViewNavs]),
      ])
      setExpandedSubViewNavs(current => [
        ...new Set([...current, ...newExpandedSubViewNavs]),
      ])
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

  const navOptions = items
    .filter(item => item.navType === 'mainNav')
    .map(item => ({ value: item.title }))

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

  function renderItem(
    item: NavItem,
    level: number,
    activeAndHoverColor = sacredtheme
      ? 'rgba(255, 215, 0, 0.15)'
      : 'rgba(255,255,255,0.5)'
  ) {
    const isActive = item.route === pathname
    switch (item.navType) {
      case 'mainNav': {
        const hasChildren = !!item.subnavs?.length
        if (hasChildren) {
          return (
            <ExpandingNav
              key={item.title}
              title={item.title}
              expandedNavs={expandedNavs}
              setExpandedNavs={setExpandedNavs}
              level={level}
              activeAndHoverColor={activeAndHoverColor}
            >
              {item.subnavs?.map(subItem =>
                renderItem(subItem, level + 1, activeAndHoverColor)
              )}
            </ExpandingNav>
          )
        } else {
          return (
            <ListNav
              key={item.title}
              title={item.title}
              onClick={() => handleNavClick(item)}
              level={level}
              route={item.route}
              trigger={item.trigger}
              onClose={onClose}
              variant={variant}
              isActive={isActive}
              activeAndHoverColor={activeAndHoverColor}
            />
          )
        }
      }
      case 'subNav': {
        const hasChildren = !!item.views?.length
        if (hasChildren) {
          return (
            <ExpandingSubNav
              key={item.title}
              title={item.title}
              expandedSubnavs={expandedSubnavs}
              setExpandedSubnavs={setExpandedSubnavs}
              activeAndHoverColor={activeAndHoverColor}
            >
              {item.views?.map(view =>
                renderItem(view, level + 2, activeAndHoverColor)
              )}
            </ExpandingSubNav>
          )
        } else {
          return (
            <ListSubNav
              key={item.title}
              title={item.title}
              route={item.route}
              trigger={item.trigger}
              activeAndHoverColor={activeAndHoverColor}
              onClose={onClose}
              variant={variant}
              isActive={isActive}
            />
          )
        }
      }
      case 'viewNav': {
        const shouldExpand = item.expanding === true
        if (shouldExpand) {
          return (
            <ExpandingViewNav
              key={item.title}
              title={item.title}
              expandedNavs={expandedViewNavs}
              setExpandedNavs={setExpandedViewNavs}
              onClick={
                item.trigger !== 'route'
                  ? () => handleNavClick(item)
                  : undefined
              }
              level={level}
              activeAndHoverColor={activeAndHoverColor}
            >
              {item.subViewNavs?.map(subViewItem =>
                renderItem(subViewItem, level + 1, activeAndHoverColor)
              )}
            </ExpandingViewNav>
          )
        } else {
          return (
            <ViewNav
              key={item.title}
              title={item.title}
              route={item.route}
              trigger={item.trigger}
              onClick={item.onClick}
              level={level}
              activeAndHoverColor={activeAndHoverColor}
              onClose={onClose}
              variant={variant}
              isActive={isActive}
            />
          )
        }
      }
      case 'subViewNav': {
        const shouldExpand =
          item.expanding === true && !!item.subSubViewNavs?.length
        if (shouldExpand) {
          return (
            <ExpandingSubViewNav
              key={item.title}
              title={item.title}
              expandedNavs={expandedSubViewNavs}
              setExpandedNavs={setExpandedSubViewNavs}
              activeAndHoverColor={activeAndHoverColor}
            >
              {item.subSubViewNavs?.map(subSubViewItem =>
                renderItem(subSubViewItem, level + 1, activeAndHoverColor)
              )}
            </ExpandingSubViewNav>
          )
        } else {
          return (
            <SubViewNav
              key={item.title}
              title={item.title}
              route={item.route}
              trigger={item.trigger}
              onClick={item.onClick}
              activeAndHoverColor={activeAndHoverColor}
              onClose={onClose || (() => {})}
              variant={variant}
              isActive={isActive}
            />
          )
        }
      }
      case 'subSubViewNav': {
        return (
          <SubSubViewNav
            key={item.title}
            title={item.title}
            route={item.route}
            trigger={item.trigger}
            onClick={item.onClick}
            activeAndHoverColor={activeAndHoverColor}
            onClose={onClose || (() => {})}
            variant={variant}
            isActive={isActive}
          />
        )
      }
      default:
        return null
    }
  }

  const handleDropdownChange = (option: DropdownOption | null) => {
    if (option) {
      setDropdownSelection(option.value)
    }
  }

  const selectedMainNavItem = items.find(
    item => item.navType === 'mainNav' && item.title === dropdownSelection
  )

  const NavTitle = () => (
    <div
      style={{
        textAlign: 'center',
        marginTop: marginabovetitle,
        marginBottom: marginbelowtitle,
      }}
    >
      {sacredtheme ? (
        <>
          <Typography
            fontvariant="merrih2"
            style={{
              color: '#FFD700',
              textShadow: '0 0 10px rgba(255,215,0,0.7)',
              letterSpacing: '0.1em',
            }}
          >
            {sacredTitle}
          </Typography>
          <Typography
            fontvariant="merriparagraph"
            style={{
              color: 'rgba(255,215,0,0.8)',
              fontStyle: 'italic',
              marginTop: '0.25rem',
            }}
          >
            {sacredSubtitle}
          </Typography>
        </>
      ) : (
        <Link href={titleUrl || '/'} style={styles.titleLink}>
          <Typography fontvariant="merrih4" style={{ color: 'black' }}>
            {verticalNavTitle}
          </Typography>
        </Link>
      )}
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
      {sacredtheme && (
        <SacredBackground
          width={containerSize.width}
          height={containerSize.height}
        />
      )}
      <div style={styles.navList}>
        {showTitle && <NavTitle />}
        {sacredtheme && showLine && <SacredDivider />}

        <div style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>
          {showSearchableNav && (
            <SearchableDropdown
              label={searchableNavLabel}
              options={navOptions}
              onChange={handleDropdownChange}
              defaultValue={dropdownSelection}
              sacredtheme={sacredtheme}
            />
          )}
        </div>

        {selectedMainNavItem
          ? renderItem(selectedMainNavItem, 0)
          : items.map(item => renderItem(item, 0))}

        {sacredtheme && (
          <div style={styles.sacredFooter}>
            <Typography style={styles.sacredFooterText}>
              "Wisdom is the compass of the soul."
            </Typography>
            <div style={styles.sacredFooterGlyphs}>
              {['𓆙', '𓆗', '𓆘'].map((g, i) => (
                <span
                  key={i}
                  style={{
                    ...styles.sacredFooterGlyph,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ height: '100vh', ...styles.navContainer }}>
      {variant === 'temporary' ? (
        <Drawer
          anchor={anchor}
          open={mobileOpen}
          onClose={onClose || (() => {})}
        >
          {navContent}
        </Drawer>
      ) : (
        <div
          style={{
            width: '280px',
            height: '100%',
            position: 'fixed',
            top: spacingfromtopofscreen,
            [anchor]: 0,
          }}
        >
          {navContent}
        </div>
      )}
    </div>
  )
}

export default Nav
