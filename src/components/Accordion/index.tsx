'use client'

import React, { useState, useCallback, type FC, type ReactNode } from 'react'
import Link from 'next/link'
import { emitDiag } from '../../utils/diag'
import cssStyles from './Accordion.module.css'

export interface AccordionProps {
  summary: ReactNode
  details?: ReactNode
  expanded?: boolean
  defaultExpanded?: boolean
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void
  styles?: {
    disabled?: boolean
    theme?: string
    level?: number
    padding?: string
    borderRadius?: string
    backgroundColor?: string
    summaryBackgroundColor?: string
    summaryColor?: string
    outline?: string | boolean
    levelIndentBase?: number
    levelIndentIncrement?: number
    borderColor?: string
    borderWidth?: string
    marginBottom?: string
  }
  level?: number
  type?: 'accordion' | 'menu'
  onClick?: (event: React.SyntheticEvent) => void
  href?: string
  isActive?: boolean
}

const useAccordionState = ({
  expanded: controlledExpanded,
  defaultExpanded = false,
  onChange,
  styles,
}: {
  expanded?: boolean
  defaultExpanded?: boolean
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void
  styles?: AccordionProps['styles']
}) => {
  // For uncontrolled mode only - controlled mode derives directly from props
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)

  // Determine if controlled - when controlled, use prop directly without syncing
  const isControlled = controlledExpanded !== undefined
  const expanded = isControlled ? controlledExpanded : internalExpanded

  const handleToggle = useCallback(
    (event: React.SyntheticEvent) => {
      if (styles?.disabled) return
      const newExpanded = !expanded
      if (!isControlled) {
        setInternalExpanded(newExpanded)
      }
      // Diagnostic bus — emit the expanded/collapsed transition so outcome
      // tests can assert the accordion toggled without scraping the DOM. Fired
      // on the toggle (the single expansion transition point; menu-type
      // accordions navigate via onClick and never reach here). No-op when no
      // bus is present.
      emitDiag({
        type: 'component.state',
        component: 'Accordion',
        state: newExpanded ? 'expanded' : 'collapsed',
      })
      onChange?.(event, newExpanded)
    },
    [styles?.disabled, expanded, isControlled, onChange]
  )

  // No useEffect needed - controlled state is derived directly from props
  // Uncontrolled state is managed internally via setInternalExpanded

  return { expanded, handleToggle }
}

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

  const stateConfig: {
    expanded?: boolean
    defaultExpanded?: boolean
    onChange?: (event: React.SyntheticEvent, expanded: boolean) => void
    styles?: typeof styles
  } = {}

  if (controlledExpanded !== undefined) {
    stateConfig.expanded = controlledExpanded
  }
  if (defaultExpanded !== undefined) {
    stateConfig.defaultExpanded = defaultExpanded
  }
  if (onChange !== undefined) {
    stateConfig.onChange = onChange
  }
  if (styles !== undefined) {
    stateConfig.styles = styles
  }

  const { expanded, handleToggle } = useAccordionState(stateConfig)

  // Only `theme === 'sacred'` ever took the sacred branch; every other value
  // (undefined / 'light' / 'dark') fell through to the light/white styling.
  // Sacred is the CSS base default; 'light' is the explicit override block.
  const theme = styles?.theme === 'sacred' ? 'sacred' : 'light'
  const isMenuType = type === 'menu'
  const disabled = styles?.disabled || false

  const handleClick = useCallback(
    (event: React.SyntheticEvent) => {
      if (disabled) return
      if (isMenuType) {
        onClick?.(event)
      } else {
        handleToggle(event)
      }
    },
    [isMenuType, onClick, handleToggle, disabled]
  )

  // Calculate indent based on level (runtime value → CSS custom property)
  const levelIndentBase = styles?.levelIndentBase ?? 20
  const levelIndentIncrement = styles?.levelIndentIncrement ?? 20
  const levelIndent = levelIndentBase + level * levelIndentIncrement

  // Handle outline prop - convert boolean to string
  const outlineValue =
    styles?.outline === true
      ? 'none'
      : styles?.outline === false
        ? undefined
        : styles?.outline

  // Caller-supplied overrides + the runtime level indent are passed as CSS
  // custom properties. Each var is set ONLY when the caller provided the
  // corresponding style, so the per-theme CSS fallback applies otherwise —
  // exactly mirroring the old `styles?.x || default` ternaries.
  const dynamicStyle: React.CSSProperties & Record<string, string> = {
    '--accordion-level-indent': `${levelIndent}px`,
  }
  if (styles?.marginBottom)
    dynamicStyle['--accordion-margin-bottom'] = styles.marginBottom
  if (styles?.borderRadius)
    dynamicStyle['--accordion-border-radius'] = styles.borderRadius
  if (styles?.backgroundColor)
    dynamicStyle['--accordion-bg'] = styles.backgroundColor
  if (styles?.borderColor)
    dynamicStyle['--accordion-border-color'] = styles.borderColor
  if (styles?.borderWidth)
    dynamicStyle['--accordion-border-width'] = styles.borderWidth
  if (styles?.padding) dynamicStyle['--accordion-padding'] = styles.padding
  if (styles?.summaryBackgroundColor)
    dynamicStyle['--accordion-summary-bg'] = styles.summaryBackgroundColor
  // summaryColor overrode BOTH the base and the active-menu summary color.
  if (styles?.summaryColor) {
    dynamicStyle['--accordion-summary-color'] = styles.summaryColor
    dynamicStyle['--accordion-summary-active-color'] = styles.summaryColor
  }
  if (outlineValue !== undefined) dynamicStyle.outline = outlineValue

  const arrowIconSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cssStyles.icon}
      data-expanded={expanded ? 'true' : undefined}
    >
      <path d="M7 10l5 5 5-5z" />
    </svg>
  )

  const summaryContent = (
    <div
      className={cssStyles.summary}
      data-menu={isMenuType ? 'true' : undefined}
      data-active={isActive ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-expanded={isMenuType ? undefined : expanded}
      {...rest}
    >
      {!isMenuType && arrowIconSvg}
      {summary}
    </div>
  )

  return (
    <div
      className={cssStyles.container}
      data-component="Accordion"
      data-state={
        isMenuType
          ? isActive
            ? 'active'
            : 'inactive'
          : expanded
            ? 'expanded'
            : 'collapsed'
      }
      data-theme={theme}
      style={dynamicStyle}
    >
      {isMenuType && href ? (
        <Link href={href} className={cssStyles.link}>
          {summaryContent}
        </Link>
      ) : (
        summaryContent
      )}

      {!isMenuType && expanded && details && (
        <div className={cssStyles.details}>{details}</div>
      )}
    </div>
  )
}

Accordion.displayName = 'Accordion'
export default Accordion
