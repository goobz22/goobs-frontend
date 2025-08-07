/**
 * @fileoverview Defines the Accordion component, a collapsible content panel.
 * It supports both controlled and uncontrolled states, and features light, dark, and sacred themes.
 * Also supports menu items for navigation.
 */
'use client'
import React, {
  useState,
  useEffect,
  FC,
  ReactNode,
  useMemo,
  useCallback,
} from 'react'
import Link from 'next/link'
import ExpandMoreIcon from '../Icons/ExpandMore'
import { AccordionStyles, getAccordionStyles, SACRED_GLYPHS } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface AccordionProps {
  /** Content displayed in the accordion header. */
  summary: ReactNode
  /** Content displayed when the accordion is expanded. */
  details?: ReactNode
  /** Controls the expanded state (for a controlled component). */
  expanded?: boolean
  /** Sets the initial expanded state (for an uncontrolled component). */
  defaultExpanded?: boolean
  /** Callback fired when the expanded state changes. */
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: AccordionStyles
  /** Nesting level for indentation (0 = no indent, 1+ = progressively indented) */
  level?: number
  /** Type of component: 'accordion' for expandable sections, 'menu' for clickable items */
  type?: 'accordion' | 'menu'
  /** Callback fired when menu item is clicked (only used when type is 'menu') */
  onClick?: (event: React.SyntheticEvent) => void
  /** URL for navigation (only used when type is 'menu') */
  href?: string
  /** Whether the menu item is currently active (only used when type is 'menu') */
  isActive?: boolean
}

// --------------------------------------------------------------------------
// HELPER HOOK for state management
// --------------------------------------------------------------------------

const useAccordionState = ({
  expanded: controlledExpanded,
  defaultExpanded = false,
  onChange,
  styles,
}: Pick<
  AccordionProps,
  'expanded' | 'defaultExpanded' | 'onChange' | 'styles'
>) => {
  const { current: isControlled } = React.useRef(
    controlledExpanded !== undefined
  )
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)

  const expanded = isControlled ? controlledExpanded : internalExpanded

  const handleToggle = useCallback(
    (event: React.SyntheticEvent) => {
      if (styles?.disabled) return
      const newExpanded = !expanded
      if (!isControlled) {
        setInternalExpanded(newExpanded)
      }
      onChange?.(event, newExpanded)
    },
    [styles?.disabled, expanded, isControlled, onChange]
  )

  useEffect(() => {
    if (isControlled) {
      setInternalExpanded(controlledExpanded!)
    }
  }, [controlledExpanded, isControlled])

  return { expanded, handleToggle }
}

// --------------------------------------------------------------------------
// SACRED THEME COMPONENTS
// --------------------------------------------------------------------------

const SacredGlyphs: FC<{
  isExpanded: boolean
  isHovered: boolean
  isDisabled: boolean
}> = ({ isExpanded, isHovered, isDisabled }) => {
  const glyphStyles = useMemo(
    () => ({
      backgroundGlyphs: {
        position: 'absolute' as const,
        top: '8px',
        right: '8px',
        color: 'rgba(255, 215, 0, 0.2)',
        fontSize: '12px',
        animation: 'sacredFloat 3s ease-in-out infinite',
        pointerEvents: 'none' as const,
      },
      glyph: {
        position: 'absolute' as const,
        color: 'rgba(255, 215, 0, 0.4)',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        opacity: 0,
      },
      glyphLeft: {
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
      },
      glyphRight: {
        right: '48px',
        top: '50%',
        transform: 'translateY(-50%)',
      },
      glyphVisible: {
        opacity: 1,
      },
      glyphExpanded: {
        opacity: 1,
        animation: 'sacredGlyphRotate 20s linear infinite',
      },
      decorativeGlyphs: {
        position: 'absolute' as const,
        bottom: '8px',
        right: '16px',
        display: 'flex',
        gap: '4px',
        opacity: 0.3,
      },
      decorativeGlyph: {
        color: '#FFD700',
        fontSize: '12px',
        animation: 'sacredGlow 3s ease-in-out infinite',
      },
    }),
    []
  )

  return (
    <>
      {/* Sacred background glyphs */}
      <div style={glyphStyles.backgroundGlyphs}>{SACRED_GLYPHS[0]}</div>

      {/* Left glyph */}
      <div
        style={{
          ...glyphStyles.glyph,
          ...glyphStyles.glyphLeft,
          ...(isHovered && !isDisabled && glyphStyles.glyphVisible),
          ...(isExpanded && !isDisabled && glyphStyles.glyphExpanded),
        }}
      >
        {SACRED_GLYPHS[3]}
      </div>

      {/* Right glyph */}
      <div
        style={{
          ...glyphStyles.glyph,
          ...glyphStyles.glyphRight,
          ...(isHovered && !isDisabled && glyphStyles.glyphVisible),
          ...(isExpanded && !isDisabled && glyphStyles.glyphExpanded),
        }}
      >
        {SACRED_GLYPHS[7]}
      </div>
    </>
  )
}

const SacredDetailsDecorations: FC = () => {
  const decorativeStyles = useMemo(
    () => ({
      decorativeGlyphs: {
        position: 'absolute' as const,
        bottom: '8px',
        right: '16px',
        display: 'flex',
        gap: '4px',
        opacity: 0.3,
      },
      decorativeGlyph: {
        color: '#FFD700',
        fontSize: '12px',
        animation: 'sacredGlow 3s ease-in-out infinite',
      },
    }),
    []
  )

  return (
    <div style={decorativeStyles.decorativeGlyphs}>
      <span
        style={{
          ...decorativeStyles.decorativeGlyph,
          animationDelay: '0s',
        }}
      >
        {SACRED_GLYPHS[20]}
      </span>
      <span
        style={{
          ...decorativeStyles.decorativeGlyph,
          animationDelay: '1s',
        }}
      >
        {SACRED_GLYPHS[21]}
      </span>
      <span
        style={{
          ...decorativeStyles.decorativeGlyph,
          animationDelay: '2s',
        }}
      >
        {SACRED_GLYPHS[22]}
      </span>
    </div>
  )
}

// --------------------------------------------------------------------------
// MAIN ACCORDION COMPONENT
// --------------------------------------------------------------------------

/**
 * A collapsible content panel that supports multiple themes and controlled/uncontrolled states.
 * Also supports menu items for navigation.
 */
const Accordion: FC<AccordionProps> = props => {
  const {
    summary,
    details,
    styles,
    level = 0,
    type = 'accordion',
    onClick,
    href,
    isActive,
    expanded: controlledExpanded,
    defaultExpanded,
    onChange,
    ...rest
  } = props

  const { expanded, handleToggle } = useAccordionState({
    expanded: controlledExpanded,
    defaultExpanded,
    onChange,
    styles,
  })
  const [isHovered, setIsHovered] = useState(false)

  const computedStyles = useMemo(() => {
    // Pass level through styles to the theme system
    const stylesWithLevel = {
      ...styles,
      level,
    }
    return getAccordionStyles(
      stylesWithLevel,
      isHovered,
      expanded,
      styles?.disabled
    )
  }, [styles, level, isHovered, expanded])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  const handleClick = useCallback(
    (event: React.SyntheticEvent) => {
      if (styles?.disabled) return

      if (type === 'menu') {
        onClick?.(event)
      } else {
        handleToggle(event)
      }
    },
    [type, onClick, handleToggle, styles?.disabled]
  )

  const isSacredTheme = styles?.theme === 'sacred'
  const isMenuType = type === 'menu'

  // Add active state styling for menu items
  const summaryStyleWithActive = useMemo(() => {
    if (isMenuType && isActive) {
      return {
        ...computedStyles.summary,
        backgroundColor: isSacredTheme
          ? 'rgba(255, 215, 0, 0.15)'
          : 'rgba(59, 130, 246, 0.1)',
        color: isSacredTheme ? '#FFD700' : '#3B82F6',
        fontWeight: 600,
      }
    }
    return computedStyles.summary
  }, [computedStyles.summary, isMenuType, isActive, isSacredTheme])

  const summaryContent = (
    <div
      style={summaryStyleWithActive}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={styles?.disabled ? -1 : 0}
      aria-expanded={isMenuType ? undefined : expanded}
      data-testid={isMenuType ? 'menu-item' : 'accordion-summary'}
      {...rest}
    >
      {!isMenuType && (
        <ExpandMoreIcon
          styles={{ theme: styles?.theme || 'sacred' }}
          style={{
            ...computedStyles.icon,
            position: 'absolute',
            left: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        />
      )}
      {isSacredTheme && (
        <div
          style={{
            flex: 1,
            paddingLeft: isMenuType ? '16px' : '30px',
            paddingRight: '24px',
            whiteSpace: 'nowrap',
            minWidth: 'fit-content',
          }}
        >
          {summary}
        </div>
      )}
      {!isSacredTheme && (
        <div
          style={{
            flex: 1,
            paddingLeft: isMenuType ? '16px' : '30px',
            whiteSpace: 'nowrap',
            minWidth: 'fit-content',
          }}
        >
          {summary}
        </div>
      )}
    </div>
  )

  return (
    <div style={computedStyles.container}>
      {isSacredTheme && !isMenuType && (
        <SacredGlyphs
          isExpanded={!!expanded}
          isHovered={isHovered}
          isDisabled={!!styles?.disabled}
        />
      )}

      {isMenuType && href ? (
        <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
          {summaryContent}
        </Link>
      ) : (
        summaryContent
      )}

      {!isMenuType && expanded && details && (
        <div style={computedStyles.details}>
          <div style={{ position: 'relative', zIndex: 1 }}>{details}</div>
          {isSacredTheme && <SacredDetailsDecorations />}
        </div>
      )}
    </div>
  )
}

Accordion.displayName = 'Accordion'
export default Accordion
