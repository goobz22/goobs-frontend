/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Drawer, Box, Stack, Divider, keyframes, alpha } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Typography } from '../Typography'

// Replaced SearchableDropdown import with Dropdown import
import SearchableDropdown from '../Field/Dropdown/Searchable'
import { white, ocean, semiTransparentWhite } from '../../styles/palette'

// New imports for split components
import ExpandingNav from './VerticalVariant/mainNav/expanding'
import ListNav from './VerticalVariant/mainNav/list'
import ExpandingSubNav from './VerticalVariant/subNav/expanding'
import ListSubNav from './VerticalVariant/subNav/list'
import ViewNav from './VerticalVariant/viewNav'
// Import new components for subViewNav and subSubViewNav support
import ExpandingViewNav from './VerticalVariant/viewNav/expanding'
import SubViewNav from './VerticalVariant/subViewNav/list'
import ExpandingSubViewNav from './VerticalVariant/subViewNav/expanding'
import SubSubViewNav from './VerticalVariant/subSubViewNav/list'

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

const glowPulse = keyframes`
  0% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5); }
  100% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3); }
`

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`

const rotateGlyph = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

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

// --------------------------------------------------------------------------
// INTERFACES
// --------------------------------------------------------------------------

/**
 * A single interface that covers all vertical nav items:
 *   - navType = 'mainNav' => can have subnavs
 *   - navType = 'subNav' => can have views
 *   - navType = 'viewNav' => can have subViewNavs
 *   - navType = 'subViewNav' => can have subSubViewNavs
 *   - navType = 'subSubViewNav' => no children
 */
export interface NavItem {
  navType: 'mainNav' | 'subNav' | 'viewNav' | 'subViewNav' | 'subSubViewNav'
  title: string
  route?: string
  trigger?: 'route' | 'onClick'
  onClick?: () => void
  // Explicit flag to indicate if this item should expand
  expanding?: boolean
  // For mainNav items only:
  subnavs?: NavItem[]
  // For subNav items only:
  views?: NavItem[]
  // For viewNav items only:
  subViewNavs?: NavItem[]
  // For subViewNav items only:
  subSubViewNavs?: NavItem[]
}

/**
 * NavProps for the vertical nav component.
 */
export interface NavProps {
  /** The entire nav data array (mainNav, subNav, viewNav items). */
  items?: NavItem[]

  /** Whether to show the search box. */
  showSearchableNav?: boolean

  /** Whether to show the nav title. */
  showTitle?: boolean

  /** Whether to show a horizontal divider line. */
  showLine?: boolean

  /** Title text for the nav. */
  verticalNavTitle?: string

  /** Label for the search box. */
  searchableNavLabel?: string

  /** Side on which the Drawer anchors. */
  anchor?: 'left' | 'right'

  /** Background color (drawer or items). */
  backgroundcolor?: string

  /** Label color when shrunk (search box). */
  shrunkfontcolor?: string

  /** Label color when not shrunk (search box). */
  unshrunkfontcolor?: string

  /** Destination route if user clicks the nav title. */
  titleUrl?: string

  /** Controls mobile drawer open state. */
  mobileOpen?: boolean

  /** Handler for closing the mobile drawer. */
  onClose?: () => void

  /** MUI Drawer variant: 'temporary' or 'permanent'. */
  variant?: 'temporary' | 'permanent'

  /** Spacing from the top of the screen. */
  spacingfromtopofscreen?: string

  /** Margin above the nav title. */
  marginabovetitle?: string

  /** Margin below the nav title. */
  marginbelowtitle?: string

  /**
   * Optional router object for route navigation (instead of `useRouter`).
   * If omitted and an item has `trigger === 'route'`, no action will occur.
   */
  router?: {
    push: (route: string) => void
  }

  /** NEW: Enable Egyptian/Sacred theming */
  sacredtheme?: boolean

  /** NEW: Custom sacred title (overrides verticalNavTitle when sacred theme is enabled) */
  sacredTitle?: string

  /** NEW: Sacred subtitle */
  sacredSubtitle?: string

  /** The current path, to determine the active nav item. If not provided, will use Next.js's usePathname. */
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

    // Initialize floating hieroglyphs
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

        // Gentle pulsing opacity
        particle.opacity =
          particle.maxOpacity *
          (0.7 + 0.3 * Math.sin(time * 0.001 + particle.x * 0.01))

        // Wrap around edges
        if (particle.x < -20) particle.x = width + 20
        if (particle.x > width + 20) particle.x = -20
        if (particle.y < -20) particle.y = height + 20
        if (particle.y > height + 20) particle.y = -20

        // Draw glyph with golden glow
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
  showSearchableNav = true,
  showTitle = true,
  showLine = true,
  verticalNavTitle = 'Navigation',
  searchableNavLabel = 'Search or select a nav',
  anchor = 'left',
  shrunkfontcolor = 'white',
  backgroundcolor,
  titleUrl,
  mobileOpen = false,
  onClose,
  variant = 'permanent',
  spacingfromtopofscreen,
  marginabovetitle = '0px',
  marginbelowtitle = '5px',
  router,
  sacredtheme = false,
  sacredTitle,
  sacredSubtitle,
  pathname: propPathname,
}: NavProps) {
  // States for expanded mainNavs, subNavs, viewNavs, and subViewNavs
  const [expandedNavs, setExpandedNavs] = useState<string[]>([])
  const [expandedSubnavs, setExpandedSubnavs] = useState<string[]>([])
  const [expandedViewNavs, setExpandedViewNavs] = useState<string[]>([])
  const [expandedSubViewNavs, setExpandedSubViewNavs] = useState<string[]>([])
  const [dropdownSelection, setDropdownSelection] = useState<
    string | undefined
  >()

  const nextPathname = usePathname()
  const pathname = propPathname || nextPathname

  // Default width for the vertical nav
  const [verticalNavWidth] = useState<string>('250px')

  // Sacred theme container ref for background
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({
    width: 280,
    height: 600,
  })

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

  // Update container size for sacred background
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

  // Build search dropdown options from mainNav items
  const navOptions = items
    .filter(item => item.navType === 'mainNav')
    .map(item => ({ value: item.title }))

  // Handle route or onClick triggers for mainNav/subNav/viewNav/subViewNav/subSubViewNav
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

  // Recursively render mainNav -> subNav -> viewNav -> subViewNav -> subSubViewNav
  function renderItem(
    item: NavItem,
    level: number,
    activeAndHoverColor = sacredtheme
      ? alpha('#FFD700', 0.15)
      : semiTransparentWhite.main
  ) {
    const isActive = item.route === pathname
    switch (item.navType) {
      // 1) MAIN NAV
      case 'mainNav': {
        const hasChildren = !!item.subnavs?.length
        if (hasChildren) {
          // Render the expanding version
          return (
            <ExpandingNav
              key={item.title}
              title={item.title}
              expandedNavs={expandedNavs}
              setExpandedNavs={setExpandedNavs}
              onClick={() => handleNavClick(item)}
              level={level}
            >
              {item.subnavs?.map(subItem =>
                renderItem(subItem, level + 1, activeAndHoverColor)
              )}
            </ExpandingNav>
          )
        } else {
          // Render the simple list version (no children)
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

      // 2) SUB NAV
      case 'subNav': {
        const hasChildren = !!item.views?.length
        if (hasChildren) {
          // Render the expanding subNav
          return (
            <ExpandingSubNav
              key={item.title}
              title={item.title}
              expandedSubnavs={expandedSubnavs}
              setExpandedSubnavs={setExpandedSubnavs}
              onClick={() => handleNavClick(item)}
            >
              {item.views?.map(view =>
                renderItem(view, level + 2, activeAndHoverColor)
              )}
            </ExpandingSubNav>
          )
        } else {
          // Render the simple list subNav
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

      // 3) VIEW NAV
      case 'viewNav': {
        // Use the explicit expanding property instead of checking for children
        const shouldExpand = item.expanding === true
        if (shouldExpand) {
          // Render the expanding viewNav
          return (
            <ExpandingViewNav
              key={item.title}
              title={item.title}
              expandedNavs={expandedViewNavs}
              setExpandedNavs={setExpandedViewNavs}
              onClick={() => handleNavClick(item)}
              level={level}
            >
              {item.subViewNavs?.map(subViewItem =>
                renderItem(subViewItem, level + 1, activeAndHoverColor)
              )}
            </ExpandingViewNav>
          )
        } else {
          // Render the simple viewNav
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

      // 4) SUB VIEW NAV
      case 'subViewNav': {
        // Check if this subViewNav has children and should expand
        const shouldExpand =
          item.expanding === true && !!item.subSubViewNavs?.length

        if (shouldExpand) {
          // Render the expanding subViewNav
          return (
            <ExpandingSubViewNav
              key={item.title}
              title={item.title}
              expandedNavs={expandedSubViewNavs}
              setExpandedNavs={setExpandedSubViewNavs}
              onClick={() => handleNavClick(item)}
            >
              {item.subSubViewNavs?.map(subSubViewItem =>
                renderItem(subSubViewItem, level + 1, activeAndHoverColor)
              )}
            </ExpandingSubViewNav>
          )
        } else {
          // Render the standard subViewNav item
          return (
            <SubViewNav
              key={item.title}
              title={item.title}
              route={item.route}
              trigger={item.trigger}
              onClick={item.onClick}
              activeAndHoverColor={activeAndHoverColor}
              onClose={onClose}
              variant={variant}
              isActive={isActive}
            />
          )
        }
      }

      // 5) SUB SUB VIEW NAV
      case 'subSubViewNav': {
        return (
          <SubSubViewNav
            key={item.title}
            title={item.title}
            route={item.route}
            trigger={item.trigger}
            onClick={item.onClick}
            activeAndHoverColor={activeAndHoverColor}
            onClose={onClose}
            variant={variant}
            isActive={isActive}
          />
        )
      }

      default:
        return null
    }
  }

  // Sacred Title Component
  const SacredTitle = () => (
    <Box
      sx={{
        textAlign: 'center',
        py: 2,
        px: 1,
        position: 'relative',
      }}
    >
      {/* Decorative header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 1,
            background:
              'linear-gradient(to right, transparent, #FFD700, transparent)',
          }}
        />
        <Box
          sx={{
            color: '#FFD700',
            fontSize: 16,
            animation: `${rotateGlyph} 20s linear infinite`,
          }}
        >
          𓊹
        </Box>
        <Box
          sx={{
            width: 40,
            height: 1,
            background:
              'linear-gradient(to right, transparent, #FFD700, transparent)',
          }}
        />
      </Box>

      {/* Main title */}
      <Link
        href={titleUrl || '/'}
        passHref
        style={{ textDecoration: 'none' }}
        onClick={variant === 'temporary' ? onClose : undefined}
      >
        <Typography
          sx={{
            color: '#FFD700',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            animation: `${glowPulse} 3s ease-in-out infinite`,
            fontFamily: '"Cinzel", serif',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
            },
          }}
        >
          {sacredTitle || verticalNavTitle}
        </Typography>
      </Link>

      {/* Subtitle if provided */}
      {sacredSubtitle && (
        <Typography
          sx={{
            color: alpha('#FFD700', 0.7),
            fontSize: 12,
            fontStyle: 'italic',
            mt: 0.5,
            letterSpacing: 1,
          }}
        >
          {sacredSubtitle}
        </Typography>
      )}

      {/* Sacred hieroglyphs */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 1,
          gap: 0.5,
        }}
      >
        {['𓏏', '𓊖', '𓍯', '𓏏', '𓊖'].map((glyph, i) => (
          <Box
            key={i}
            sx={{
              color: alpha('#FFD700', 0.6),
              fontSize: 10,
              animation: `${floatAnimation} ${2 + i * 0.3}s ease-in-out infinite`,
            }}
          >
            {glyph}
          </Box>
        ))}
      </Box>
    </Box>
  )

  // Sacred Divider Component
  const SacredDivider = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 1,
        px: 2,
      }}
    >
      <Box
        sx={{
          width: '30%',
          height: 1,
          background:
            'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.5), transparent)',
        }}
      />
      <Box
        sx={{
          color: '#FFD700',
          fontSize: 14,
          px: 1,
          animation: `${rotateGlyph} 15s linear infinite reverse`,
        }}
      >
        𓋹
      </Box>
      <Box
        sx={{
          width: '30%',
          height: 1,
          background:
            'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.5), transparent)',
        }}
      />
    </Box>
  )

  // Drawer Content: Title, optional search, optional divider, then items
  const drawerContent = (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Sacred background animation */}
      {sacredtheme && (
        <SacredBackground
          width={containerSize.width}
          height={containerSize.height}
        />
      )}

      {/* Main content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          // Custom scrollbar for sacred theme
          ...(sacredtheme && {
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 215, 0, 0.5)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.7)',
              },
            },
          }),
        }}
      >
        <Box px="15px" sx={{ whiteSpace: 'nowrap' }}>
          {showTitle && (
            <Box mt={marginabovetitle} mb={marginbelowtitle}>
              {sacredtheme ? (
                <SacredTitle />
              ) : (
                <Link
                  href={titleUrl || '/'}
                  passHref
                  style={{ textDecoration: 'none' }}
                  onClick={variant === 'temporary' ? onClose : undefined}
                >
                  <Typography
                    fontvariant="merrih4"
                    fontcolor={white.main}
                    text={verticalNavTitle}
                  />
                </Link>
              )}
            </Box>
          )}

          {showSearchableNav && (
            <Stack mt={{ lg: 0 }} spacing={0}>
              <Box
                sx={{
                  position: 'relative',
                  zIndex: theme => theme.zIndex.drawer + 1,
                  width: '100%',
                  minHeight: '40px',
                  whiteSpace: 'nowrap',
                }}
              >
                <SearchableDropdown
                  label={searchableNavLabel}
                  options={navOptions}
                  defaultValue={dropdownSelection}
                  backgroundcolor={
                    sacredtheme
                      ? alpha('#000000', 0.6)
                      : backgroundcolor || semiTransparentWhite.main
                  }
                  outlinecolor={sacredtheme ? '#FFD700' : 'none'}
                  shrunkfontcolor={sacredtheme ? '#FFD700' : shrunkfontcolor}
                  shrunklabelposition="aboveNotch"
                  sacredtheme={sacredtheme}
                  sacredTitle="No Divine Paths"
                  sacredSubtitle="Ancient wisdom awaits your search"
                  onChange={option => {
                    const selectedValue = option ? option.value : null
                    setDropdownSelection(selectedValue || undefined)

                    // If a nav is selected, automatically expand it
                    if (selectedValue) {
                      // Find the selected nav item
                      const selectedNavItem = items.find(
                        item =>
                          item.navType === 'mainNav' &&
                          item.title === selectedValue
                      )

                      // If the item has subnavs, expand it
                      if (selectedNavItem?.subnavs?.length) {
                        // Add to expandedNavs if not already there
                        if (!expandedNavs.includes(selectedValue)) {
                          setExpandedNavs([...expandedNavs, selectedValue])
                        }
                      }
                    }
                  }}
                />
              </Box>
            </Stack>
          )}
        </Box>

        {showLine &&
          (sacredtheme ? (
            <SacredDivider />
          ) : (
            <Divider
              sx={{
                width: '100%',
                backgroundColor: white.main,
                mt: 2.5,
              }}
            />
          ))}

        {items.map(i => renderItem(i, 0))}

        {/* Sacred footer for sacred theme */}
        {sacredtheme && (
          <Box
            sx={{
              textAlign: 'center',
              py: 3,
              px: 2,
            }}
          >
            <Typography
              sx={{
                color: alpha('#FFD700', 0.6),
                fontSize: 10,
                fontStyle: 'italic',
                letterSpacing: 1,
                mb: 1,
              }}
            >
              "Through wisdom, navigate the divine"
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              {['𓅨', '𓂋', '𓏭', '𓊵'].map((glyph, i) => (
                <Box
                  key={i}
                  sx={{
                    color: alpha('#FFD700', 0.4),
                    fontSize: 12,
                    animation: `${glowPulse} ${4 + i * 0.5}s ease-in-out infinite`,
                  }}
                >
                  {glyph}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )

  // Render the Drawer
  return (
    <Drawer
      variant={variant}
      anchor={anchor}
      open={variant === 'temporary' ? mobileOpen : true}
      onClose={onClose}
      elevation={0}
      sx={{
        width: 'auto',
        height: '100%',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          minWidth: verticalNavWidth,
          width: '280px',
          whiteSpace: 'nowrap',
          // Remove horizontal scrollbar:
          overflowX: 'hidden',
          // Optionally allow vertical scrolling if content is taller:
          overflowY: 'auto',
          border: 0,
          zIndex: theme =>
            variant === 'temporary'
              ? theme.zIndex.drawer + 2
              : theme.zIndex.drawer - 1,
          backgroundColor: sacredtheme ? '#0a0a0a' : ocean.main,
          ...(sacredtheme && {
            backgroundImage: `
              linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
              radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
            `,
            border: `1px solid ${alpha('#FFD700', 0.2)}`,
            boxShadow: `
              0 0 30px rgba(255, 215, 0, 0.1),
              inset 0 0 60px rgba(255, 215, 0, 0.03)
            `,
          }),
          pt: '17px',
          boxSizing: 'border-box',
          marginTop: spacingfromtopofscreen,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default Nav
