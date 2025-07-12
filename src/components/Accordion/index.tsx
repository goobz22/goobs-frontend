/**
 * @fileoverview Defines the Accordion component, a collapsible content panel.
 * It supports both controlled and uncontrolled states, and features light, dark, and sacred themes.
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
import ExpandMoreIcon from '../Icons/ExpandMore'
import { AccordionStyles, getAccordionStyles, SACRED_GLYPHS } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface AccordionProps {
  /** Content displayed in the accordion header. */
  summary: ReactNode
  /** Content displayed when the accordion is expanded. */
  details: ReactNode
  /** Controls the expanded state (for a controlled component). */
  expanded?: boolean
  /** Sets the initial expanded state (for an uncontrolled component). */
  defaultExpanded?: boolean
  /** Callback fired when the expanded state changes. */
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: AccordionStyles
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
 */
const Accordion: FC<AccordionProps> = props => {
  const {
    summary,
    details,
    styles,
    expanded: controlledExpanded,
    defaultExpanded,
    onChange,
    ...rest
  } = props

  const { expanded, handleToggle } = useAccordionState(props)
  const [isHovered, setIsHovered] = useState(false)

  const computedStyles = useMemo(
    () => getAccordionStyles(styles, isHovered, expanded, styles?.disabled),
    [styles, isHovered, expanded]
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  const isSacredTheme = styles?.theme === 'sacred'

  return (
    <div style={computedStyles.container}>
      {isSacredTheme && (
        <SacredGlyphs
          isExpanded={!!expanded}
          isHovered={isHovered}
          isDisabled={!!styles?.disabled}
        />
      )}

      <div
        style={computedStyles.summary}
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={styles?.disabled ? -1 : 0}
        aria-expanded={expanded}
        data-testid="accordion-summary"
        {...rest}
      >
        {isSacredTheme && (
          <div style={{ flex: 1, paddingLeft: '24px', paddingRight: '24px' }}>
            {summary}
          </div>
        )}
        {!isSacredTheme && <div style={{ flex: 1 }}>{summary}</div>}
        <ExpandMoreIcon style={computedStyles.icon} />
      </div>

      {expanded && (
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
