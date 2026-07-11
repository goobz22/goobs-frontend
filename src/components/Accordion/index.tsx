'use client'

import React, {
  useState,
  useCallback,
  useId,
  type FC,
  type ReactNode,
} from 'react'
import { emitDiag } from '../../utils/diag'
import cssStyles from './Accordion.module.css'

export interface AccordionProps {
  summary: ReactNode
  details?: ReactNode
  expanded?: boolean
  defaultExpanded?: boolean
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void
  /** Styling options: theme plus scalar overrides wired to CSS custom properties. */
  styles?: {
    /** Disables toggling/clicking and renders the disabled treatment. */
    disabled?: boolean
    /** Theme variant: 'sacred' or 'dark' select those variants; anything else (or unset) resolves to 'light'. */
    theme?: string
    /** @deprecated No-op — the indent level comes from the top-level `level` prop; scheduled for removal. */
    level?: number
    /** Container padding. */
    padding?: string
    /** Container border radius. */
    borderRadius?: string
    /** Container background color. */
    backgroundColor?: string
    /** Summary row background color. */
    summaryBackgroundColor?: string
    /** Summary text color (also applies to the active menu-item state). */
    summaryColor?: string
    /** Container CSS outline; `true` maps to 'none', `false` leaves the CSS default, a string passes through verbatim. */
    outline?: string | boolean
    /** Base indent in px before level scaling (default 20). */
    levelIndentBase?: number
    /** Extra indent in px per `level` (default 20): indent = base + level x increment. */
    levelIndentIncrement?: number
    /** Container border color. */
    borderColor?: string
    /** Container border width. */
    borderWidth?: string
    /** Container bottom margin. */
    marginBottom?: string
  }
  level?: number
  type?: 'accordion' | 'menu'
  onClick?: (event: React.SyntheticEvent) => void
  href?: string
  /**
   * Element used to render a `type="menu"` item's link. Defaults to a plain
   * anchor (`'a'`) so the component works in any host; a Next.js consumer can
   * pass `linkComponent={NextLink}` for client-side navigation (it receives the
   * same `href`). Keeps `next/link` out of the module graph (it reads
   * `process.env.__NEXT_*` at load and throws outside Next).
   */
  linkComponent?: React.ElementType
  isActive?: boolean
  /**
   * Heading level (accordion type only) that wraps the toggle button in a real
   * `<h1>`–`<h6>`, exposing the collapsible section as a document heading for
   * screen-reader navigation and SEO (the WAI-ARIA **Accordion** pattern).
   *
   * A single `<Accordion>` is a complete, valid **Disclosure** (a labelled
   * toggle button plus the region it controls) and needs no heading, so this is
   * opt-in. When composing MULTIPLE sections into an **accordion group**, pass
   * the heading level that matches the surrounding document outline on each
   * section: a context-agnostic primitive cannot know the correct level, and a
   * hardcoded default would corrupt the outline (itself a WCAG 1.3.1 defect) and
   * silently change every consumer's DOM — which is why there is no default
   * heading. Omit to render the bare disclosure button. Ignored for
   * `type="menu"`.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
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
    linkComponent,
    isActive,
    headingLevel,
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

  // Sacred is the CSS base default; 'light' and 'dark' are explicit override
  // blocks. 'dark' now resolves to its own deep-slate theme (previously fell
  // through to light). Any other/undefined value defaults to light.
  const theme =
    styles?.theme === 'sacred'
      ? 'sacred'
      : styles?.theme === 'dark'
        ? 'dark'
        : 'light'
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

  // Stable ids wiring the disclosure trigger to its panel (button ⇄ region).
  const reactId = useId()
  const panelId = `accordion-panel-${reactId}`
  const triggerId = `accordion-trigger-${reactId}`

  // The panel renders whenever an accordion-type section HAS content — including
  // while COLLAPSED — so its markup ships in the SSR'd HTML and stays crawlable
  // / indexable for SEO. Visibility is toggled with the native `hidden`
  // attribute (below): collapsed removes it from the a11y tree and from layout
  // but LEAVES it in the DOM, unlike a conditional render that omits it entirely
  // and hides the content from crawlers. Because the panel is always present for
  // a content-bearing section, the trigger's aria-controls is never a dangling
  // IDREF and points at the panel whether the section is open or closed.
  const hasPanel = !isMenuType && Boolean(details)

  const arrowIconSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cssStyles.icon}
      data-expanded={expanded ? 'true' : undefined}
      // Decorative: the chevron only mirrors the button's aria-expanded state,
      // so it is hidden from AT and removed from the tab order.
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 10l5 5 5-5z" />
    </svg>
  )

  // The clickable header row renders as the semantically correct NATIVE element
  // so it is keyboard-operable and exposes the right role for AT:
  //   • accordion type         → <button> (disclosure: aria-expanded/-controls)
  //   • menu type + href       → <a href> (a real, crawlable link; linkComponent)
  //   • menu type without href → <button> (invokes onClick)
  // A native element gives Enter/Space (button) or Enter (link) activation, tab
  // order, and `disabled` semantics for free. (The old <div role="button"> had
  // an onClick but NO key handler, so it was unreachable by keyboard.)
  let summaryContent: ReactNode
  if (!isMenuType) {
    const triggerButton = (
      <button
        type="button"
        className={cssStyles.summary}
        data-active={isActive ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
        onClick={handleClick}
        {...rest}
        id={triggerId}
        disabled={disabled}
        aria-expanded={expanded}
        aria-controls={hasPanel ? panelId : undefined}
      >
        {arrowIconSvg}
        {summary}
      </button>
    )
    // Optional real heading wrapper (an accordion section header IS a heading).
    summaryContent = headingLevel
      ? React.createElement(
          `h${headingLevel}`,
          { className: cssStyles.heading },
          triggerButton
        )
      : triggerButton
  } else if (href) {
    summaryContent = React.createElement(
      linkComponent ?? 'a',
      {
        onClick: handleClick,
        'data-menu': 'true',
        'data-active': isActive ? 'true' : undefined,
        'data-disabled': disabled ? 'true' : undefined,
        ...rest,
        className: [cssStyles.summary, cssStyles.link]
          .filter(Boolean)
          .join(' '),
        // A disabled nav item drops its href (not focusable/navigable) and is
        // announced disabled; the active item is announced as the current page.
        href: disabled ? undefined : href,
        'aria-current': isActive ? 'page' : undefined,
        'aria-disabled': disabled ? 'true' : undefined,
      },
      summary
    )
  } else {
    summaryContent = (
      <button
        type="button"
        className={cssStyles.summary}
        data-menu="true"
        data-active={isActive ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
        onClick={handleClick}
        {...rest}
        disabled={disabled}
        aria-current={isActive ? 'page' : undefined}
      >
        {summary}
      </button>
    )
  }

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
      {summaryContent}

      {hasPanel && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className={cssStyles.details}
          // Collapsed: kept in the DOM for SSR/SEO (crawlable content) but
          // hidden from assistive tech AND from layout via the native `hidden`
          // attribute — disclosed, not deleted. Removed when expanded.
          hidden={!expanded}
        >
          {details}
        </div>
      )}
    </div>
  )
}

Accordion.displayName = 'Accordion'
export default Accordion
