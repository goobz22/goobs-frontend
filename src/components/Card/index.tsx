'use client'

/**
 * =============================================================================
 * CARD — compositional surface primitive
 * =============================================================================
 *
 * Built to absorb the ~50 hand-rolled item-card variants across ThothOS
 * workspaces. The pattern is the shadcn / Chakra compound-component model:
 * `Card` is the root and every region (header / body / footer / etc.) is
 * a subcomponent attached as a static property of `Card`. Callers compose
 * the slots their archetype needs.
 *
 *   <Card cardType="course" cardId={course._id} interactive>
 *     <Card.Header>
 *       <Card.HeaderIcon>📚</Card.HeaderIcon>
 *       <Card.Title onClick={() => open(course._id)}>{course.title}</Card.Title>
 *       <Card.Subtitle>{course.category}</Card.Subtitle>
 *       <Card.HeaderBadges>
 *         <Chip variant="pill" label={course.status} dot />
 *       </Card.HeaderBadges>
 *       <Card.HeaderActions>
 *         <IconButton size="xsmall" onClick={onEdit}>...</IconButton>
 *       </Card.HeaderActions>
 *     </Card.Header>
 *
 *     <Card.Body>
 *       <Card.Description>{course.description}</Card.Description>
 *       <Card.Metrics>
 *         <Card.Metric icon="🎓" label="Lessons" value={course.lessonCount} />
 *         <Card.Metric icon="⏱" label="Duration" value="2h 30m" />
 *       </Card.Metrics>
 *       <Card.Progress value={enrollment.progressPct} label="Complete" />
 *     </Card.Body>
 *
 *     <Card.Footer split>
 *       <Card.FooterActions side="left">
 *         <CustomButton text="View" onClick={onView} />
 *       </Card.FooterActions>
 *       <Card.FooterActions side="right">
 *         <CustomButton text="Edit" onClick={onEdit} />
 *         <CustomButton text="Delete" variant="destructive" onClick={onDelete} />
 *       </Card.FooterActions>
 *       <Card.FooterMeta>Created Jan 5</Card.FooterMeta>
 *     </Card.Footer>
 *   </Card>
 *
 * BLOCK-LINK PATTERN (Pickering — Inclusive Components: Cards)
 *
 *   When `<Card.Title onClick>` or `<Card.Title href>` is set, the title
 *   element gets a `::after` overlay (`position: absolute; inset: 0`)
 *   that stretches the click target across the entire card. Inner
 *   interactive elements (Chip, IconButton, CustomButton) are
 *   `position: relative; z-index: 1` and stay clickable individually.
 *   Screen readers get a single, meaningful link label (the title),
 *   not the 40-word concatenation of all card contents.
 *
 * BLOCK-LINK + a11y
 *
 *   - Root is `<article role="article">` with `aria-labelledby={titleId}`.
 *   - Title is a real `<h2>`/`<h3>` (see `Card.Title.as`).
 *   - Title's link/button is the canonical click target; the overlay just
 *     extends its hit area.
 *
 * POLYMORPHIC RENDERING
 *
 *   `Card` and `Card.Title` accept `asChild` (Radix pattern). When set,
 *   the component forwards its props + className to its single child
 *   element instead of wrapping it. Use this for `<Link asChild>` from
 *   Next.js or to render the card as `<li>` inside a `<ul>` directly.
 *
 * GRID LAYOUT
 *
 *   `<Card.Grid>` renders `<ul role="list">` with each child wrapped in
 *   `<li>` — semantic list announcement for screen readers, native list-
 *   nav shortcuts. Accepts `empty={...}` to auto-render `<Card.EmptyState>`
 *   when `Children.toArray(children).length === 0`.
 *
 * DRAG HANDLE
 *
 *   `<Card.DragHandle onMoveUp onMoveDown />` exposes the drag affordance
 *   AND keyboard up/down buttons (WAI-ARIA APG listbox-reorder pattern).
 *   Absorbs the bespoke step-card reorder UI in automations workspace.
 *
 * =============================================================================
 */

import React, {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  useMemo,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from 'react'
import cssStyles from './Card.module.css'

// -----------------------------------------------------------------------------
// SHARED CONTEXT — links Card.Title's id to Card root's aria-labelledby
// -----------------------------------------------------------------------------

interface CardContextValue {
  titleId: string
  theme: 'sacred' | 'light' | 'dark'
}

const CardContext = React.createContext<CardContextValue | null>(null)

function useCardContext(): CardContextValue {
  const ctx = React.useContext(CardContext)
  if (!ctx) {
    throw new Error(
      'Card subcomponents must be rendered inside <Card>. ' +
        'Wrap them in <Card>...</Card> at the top level.'
    )
  }
  return ctx
}

// -----------------------------------------------------------------------------
// asChild slot helper — Radix-style, no external dep
// -----------------------------------------------------------------------------

type AnyProps = Record<string, unknown>

function mergeClassNames(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(' ')
}

function mergeStyles(
  a: CSSProperties | undefined,
  b: CSSProperties | undefined
): CSSProperties | undefined {
  if (a === undefined && b === undefined) return undefined
  return { ...(a ?? {}), ...(b ?? {}) }
}

/**
 * Forwards props (className, style, refs, data-*, aria-*) into a single
 * child element. Identical contract to Radix's <Slot>. Use when you want
 * a component to render its child as-is with the parent's props attached.
 */
function renderAsChild(
  child: ReactNode,
  parentProps: AnyProps,
  parentClassName?: string
): ReactNode {
  if (!isValidElement(child)) return child
  const childProps = (child as ReactElement<AnyProps>).props ?? {}
  const mergedClassName = mergeClassNames(
    parentClassName,
    childProps['className'] as string | undefined
  )
  const mergedStyle = mergeStyles(
    parentProps['style'] as CSSProperties | undefined,
    childProps['style'] as CSSProperties | undefined
  )
  const next: AnyProps = { ...parentProps, ...childProps }
  if (mergedClassName) next['className'] = mergedClassName
  if (mergedStyle) next['style'] = mergedStyle
  return cloneElement(child as ReactElement<AnyProps>, next)
}

// -----------------------------------------------------------------------------
// CARD ROOT
// -----------------------------------------------------------------------------

export type CardTheme = 'sacred' | 'light' | 'dark'

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Visual density / padding scale. Default `'standard'`. */
  variant?: 'standard' | 'compact'
  /** Selection state — emits `data-card-state="selected"` + ring. */
  selected?: boolean
  /**
   * Marks the card as a click-target as a whole. Sets `cursor: pointer`
   * and `data-card-interactive`. Click handling itself happens on
   * `<Card.Title>` via its `onClick`/`href` (block-link pattern); this
   * prop only signals the visual cue.
   */
  interactive?: boolean
  /** Disabled visual state — drops opacity, blocks pointer events. */
  disabled?: boolean
  /** Drag state — emits `data-card-state="dragging"`. */
  dragging?: boolean
  /**
   * Optional border-accent color. `side: 'left'` draws a thick left
   * border in the color (the common "status-bar on left edge" pattern).
   * `side: 'full'` replaces the full border color.
   */
  borderAccent?: { color: string; side?: 'left' | 'full' }
  /** Test selector — emitted as `data-card-type` (e.g. `"statement"`). */
  cardType?: string
  /** Test selector — emitted as `data-card-id`. */
  cardId?: string
  /** Theming. Default `'sacred'`. */
  styles?: { theme?: CardTheme }
  /**
   * Polymorphic rendering — when true, forwards props to the single
   * child element instead of wrapping. Same contract as Radix's `asChild`.
   */
  asChild?: boolean
  children: ReactNode
}

interface CardComponent
  extends React.ForwardRefExoticComponent<
    CardProps & React.RefAttributes<HTMLElement>
  > {
  Header: typeof CardHeader
  HeaderIcon: typeof CardHeaderIcon
  HeaderMeta: typeof CardHeaderMeta
  Title: typeof CardTitle
  Subtitle: typeof CardSubtitle
  HeaderBadges: typeof CardHeaderBadges
  HeaderActions: typeof CardHeaderActions
  SelectionCheckbox: typeof CardSelectionCheckbox
  Body: typeof CardBody
  Description: typeof CardDescription
  Section: typeof CardSection
  Banner: typeof CardBanner
  Metrics: typeof CardMetrics
  Metric: typeof CardMetric
  BigValue: typeof CardBigValue
  Stats: typeof CardStats
  StatCell: typeof CardStatCell
  Progress: typeof CardProgress
  Footer: typeof CardFooter
  FooterActions: typeof CardFooterActions
  FooterMeta: typeof CardFooterMeta
  ConfirmDelete: typeof CardConfirmDelete
  DragHandle: typeof CardDragHandle
  Grid: typeof CardGrid
  EmptyState: typeof CardEmptyState
}

const CardInner = forwardRef<HTMLElement, CardProps>(function CardInner(
  {
    variant = 'standard',
    selected = false,
    interactive = false,
    disabled = false,
    dragging = false,
    borderAccent,
    cardType,
    cardId,
    styles,
    asChild = false,
    className,
    style,
    children,
    ...restProps
  },
  ref
) {
  const theme = styles?.theme ?? 'sacred'
  const titleId = useId()
  const contextValue = useMemo<CardContextValue>(
    () => ({ titleId, theme }),
    [titleId, theme]
  )

  const resolvedState = dragging
    ? 'dragging'
    : disabled
      ? 'disabled'
      : selected
        ? 'selected'
        : 'default'

  const rootClassName = mergeClassNames(
    cssStyles.root,
    cssStyles[variant],
    theme === 'sacred' ? cssStyles.sacred : '',
    theme === 'dark' ? cssStyles.dark : '',
    className
  )

  const mergedStyle: CSSProperties | undefined = borderAccent
    ? {
        ...(style ?? {}),
        ['--card-accent-override' as string]: borderAccent.color,
      }
    : style

  const sharedProps: AnyProps = {
    className: rootClassName,
    style: mergedStyle,
    role: 'article',
    'aria-labelledby': titleId,
    'data-card': 'true',
    'data-card-state': resolvedState,
    ...(cardType !== undefined && { 'data-card-type': cardType }),
    ...(cardId !== undefined && { 'data-card-id': cardId }),
    ...(interactive && { 'data-card-interactive': 'true' }),
    ...(disabled && { 'data-card-disabled': 'true' }),
    ...(selected && { 'data-card-selected': 'true' }),
    ...(borderAccent?.side && {
      'data-card-accent-side': borderAccent.side,
    }),
    ref,
    ...restProps,
  }

  const content = (
    <CardContext.Provider value={contextValue}>{children}</CardContext.Provider>
  )

  if (asChild) {
    return renderAsChild(children, sharedProps, rootClassName) as ReactElement
  }

  return React.createElement('article', sharedProps, content)
}) as unknown as CardComponent

// -----------------------------------------------------------------------------
// CARD.HEADER
// -----------------------------------------------------------------------------

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ className, children, ...restProps }, ref) {
    useCardContext()
    return (
      <div
        ref={ref}
        className={mergeClassNames(cssStyles.header, className)}
        data-card-header="true"
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.HEADERICON — leading emoji / SVG glyph
// -----------------------------------------------------------------------------

export interface CardHeaderIconProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

const CardHeaderIcon = forwardRef<HTMLSpanElement, CardHeaderIconProps>(
  function CardHeaderIcon({ className, children, ...restProps }, ref) {
    return (
      <span
        ref={ref}
        className={mergeClassNames(cssStyles.headerIcon, className)}
        aria-hidden="true"
        {...restProps}
      >
        {children}
      </span>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.TITLE — owns the block-link click target
// -----------------------------------------------------------------------------

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface CardTitleProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'onClick'> {
  children: ReactNode
  /** Heading level. Default `'h3'`. */
  as?: HeadingLevel
  /** When set, the title text becomes an `<a>` and the link's `::after`
   *  overlay extends the click target across the whole card. */
  href?: string
  /** When set, the title text becomes a `<button>` and the button's
   *  `::after` overlay extends the click target across the whole card.
   *  Mutually exclusive with `href` (href wins). */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** Optional aria-label for the link/button (defaults to text content). */
  ariaLabel?: string
  /** Polymorphic — forwards props to the single child instead of wrapping. */
  asChild?: boolean
}

const CardTitle = forwardRef<HTMLElement, CardTitleProps>(function CardTitle(
  {
    as = 'h3',
    href,
    onClick,
    ariaLabel,
    asChild = false,
    className,
    children,
    ...restProps
  },
  ref
) {
  const { titleId } = useCardContext()

  const headingClassName = mergeClassNames(cssStyles.title, className)

  // If the title is a block-link or block-button, the heading wraps the
  // link/button, which carries the ::after overlay.
  let body: ReactNode = children
  if (href !== undefined) {
    body = (
      <a
        href={href}
        className={cssStyles.blockLink}
        {...(ariaLabel !== undefined && { 'aria-label': ariaLabel })}
      >
        {children}
      </a>
    )
  } else if (onClick !== undefined) {
    body = (
      <button
        type="button"
        onClick={onClick}
        className={cssStyles.blockLink}
        {...(ariaLabel !== undefined && { 'aria-label': ariaLabel })}
      >
        {children}
      </button>
    )
  }

  const sharedProps: AnyProps = {
    id: titleId,
    className: headingClassName,
    'data-card-title': 'true',
    ref,
    ...restProps,
  }

  if (asChild) {
    return renderAsChild(children, sharedProps, headingClassName) as ReactElement
  }

  return React.createElement(as as ElementType, sharedProps, body)
})

// -----------------------------------------------------------------------------
// CARD.SUBTITLE
// -----------------------------------------------------------------------------

export interface CardSubtitleProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

const CardSubtitle = forwardRef<HTMLSpanElement, CardSubtitleProps>(
  function CardSubtitle({ className, children, ...restProps }, ref) {
    return (
      <span
        ref={ref}
        className={mergeClassNames(cssStyles.subtitle, className)}
        data-card-subtitle="true"
        {...restProps}
      >
        {children}
      </span>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.HEADERBADGES — right-aligned status / type chips
// -----------------------------------------------------------------------------

export interface CardHeaderBadgesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const CardHeaderBadges = forwardRef<HTMLDivElement, CardHeaderBadgesProps>(
  function CardHeaderBadges({ className, children, ...restProps }, ref) {
    return (
      <div
        ref={ref}
        className={mergeClassNames(cssStyles.headerBadges, className)}
        data-card-header-badges="true"
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.HEADERACTIONS — trailing icon-button row
// -----------------------------------------------------------------------------

export interface CardHeaderActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const CardHeaderActions = forwardRef<HTMLDivElement, CardHeaderActionsProps>(
  function CardHeaderActions({ className, children, ...restProps }, ref) {
    return (
      <div
        ref={ref}
        className={mergeClassNames(cssStyles.headerActions, className)}
        data-card-header-actions="true"
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.SELECTIONCHECKBOX — top-right selection state
// -----------------------------------------------------------------------------

export interface CardSelectionCheckboxProps {
  checked: boolean
  /**
   * Selection-change handler. Receives both the new boolean state AND
   * the native ChangeEvent so callers wrapping the card in an outer
   * click handler can `event.stopPropagation()` to keep clicks scoped
   * to the checkbox.
   */
  onChange: (
    next: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  /** Accessible label (e.g. "Select this contract"). */
  ariaLabel: string
  disabled?: boolean
}

const CardSelectionCheckbox = forwardRef<
  HTMLInputElement,
  CardSelectionCheckboxProps
>(function CardSelectionCheckbox(
  { checked, onChange, ariaLabel, disabled = false },
  ref
) {
  return (
    <label
      className={cssStyles.selectionCheckbox}
      data-card-selection="true"
      onClick={(event) => event.stopPropagation()}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked, event)}
        aria-label={ariaLabel}
      />
    </label>
  )
})

// -----------------------------------------------------------------------------
// CARD.BODY
// -----------------------------------------------------------------------------

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(function CardBody(
  { className, children, ...restProps },
  ref
) {
  return (
    <div
      ref={ref}
      className={mergeClassNames(cssStyles.body, className)}
      data-card-body="true"
      {...restProps}
    >
      {children}
    </div>
  )
})

// -----------------------------------------------------------------------------
// CARD.DESCRIPTION
// -----------------------------------------------------------------------------

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, children, ...restProps }, ref) {
    return (
      <p
        ref={ref}
        className={mergeClassNames(cssStyles.description, className)}
        data-card-description="true"
        {...restProps}
      >
        {children}
      </p>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.METRICS / CARD.METRIC — small badge row
// -----------------------------------------------------------------------------

export interface CardMetricsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const CardMetrics = forwardRef<HTMLDivElement, CardMetricsProps>(
  function CardMetrics({ className, children, ...restProps }, ref) {
    return (
      <div
        ref={ref}
        className={mergeClassNames(cssStyles.metrics, className)}
        data-card-metrics="true"
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

export interface CardMetricProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Optional icon glyph or SVG node. */
  icon?: ReactNode
  /** Small uppercase-ish label rendered before the value. */
  label?: ReactNode
  /** Primary numeric / text value. */
  value: ReactNode
  /** Accent color (left border + value text). */
  color?: string
  /** Render the value in a monospace font (for IP / CIDR / MAC / OID
   *  values that callsites previously wrapped in `<code>` literals). */
  mono?: boolean
}

const CardMetric = forwardRef<HTMLSpanElement, CardMetricProps>(
  function CardMetric(
    { icon, label, value, color, mono, className, style, ...rest },
    ref
  ) {
    const colorStyle: CSSProperties | undefined = color
      ? {
          ...(style ?? {}),
          borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
        }
      : style
    return (
      <span
        ref={ref}
        className={mergeClassNames(cssStyles.metric, className)}
        {...(colorStyle !== undefined && { style: colorStyle })}
        data-card-metric="true"
        {...rest}
      >
        {icon !== undefined && (
          <span className={cssStyles.metricIcon} aria-hidden="true">
            {icon}
          </span>
        )}
        {label !== undefined && (
          <span className={cssStyles.metricLabel}>{label}</span>
        )}
        <span
          className={mergeClassNames(
            cssStyles.metricValue,
            mono ? cssStyles.monoValue : ''
          )}
          {...(color !== undefined && { style: { color } })}
        >
          {value}
        </span>
      </span>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.STATS — k/v grid (replaces hand-rolled financial grids)
// -----------------------------------------------------------------------------

export interface CardStatsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (default 2). */
  columns?: number
  children: ReactNode
}

const CardStats = forwardRef<HTMLDivElement, CardStatsProps>(function CardStats(
  { columns = 2, className, style, children, ...restProps },
  ref
) {
  const mergedStyle: CSSProperties = {
    ...(style ?? {}),
    ['--card-stats-cols' as string]: String(columns),
  }
  return (
    <div
      ref={ref}
      className={mergeClassNames(cssStyles.stats, className)}
      style={mergedStyle}
      data-card-stats="true"
      {...restProps}
    >
      {children}
    </div>
  )
})

export interface CardStatCellProps {
  label: ReactNode
  value: ReactNode
  /** Optional accent for the value (e.g. red for overdue, green for paid). */
  valueColor?: string
  /** Render the value in a monospace font (CIDR, IP, MAC, OID, etc.). */
  mono?: boolean
  /** Optional secondary line under the value (e.g. "3 items"). */
  caption?: ReactNode
}

const CardStatCell = forwardRef<HTMLDivElement, CardStatCellProps>(
  function CardStatCell({ label, value, valueColor, mono, caption }, ref) {
    return (
      <div ref={ref} className={cssStyles.statCell} data-card-stat-cell="true">
        <span className={cssStyles.statLabel}>{label}</span>
        <span
          className={mergeClassNames(
            cssStyles.statValue,
            mono ? cssStyles.monoValue : ''
          )}
          {...(valueColor !== undefined && { style: { color: valueColor } })}
        >
          {value}
        </span>
        {caption !== undefined && (
          <span className={cssStyles.statLabel}>{caption}</span>
        )}
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.PROGRESS — progress bar (learning, skill cards)
// -----------------------------------------------------------------------------

export interface CardProgressProps {
  /** Progress fraction, 0-1. */
  value: number
  /** Optional label rendered above the bar. */
  label?: ReactNode
  /** Optional override for the fill color. Defaults to theme accent. */
  color?: string
  /** Override displayed percentage (default `${Math.round(value * 100)}%`). */
  displayValue?: string
}

const CardProgress = forwardRef<HTMLDivElement, CardProgressProps>(
  function CardProgress({ value, label, color, displayValue }, ref) {
    const pct = Math.max(0, Math.min(1, value))
    const display = displayValue ?? `${Math.round(pct * 100)}%`
    const fillStyle: CSSProperties = {
      width: `${pct * 100}%`,
      ...(color !== undefined && {
        ['--card-progress-color' as string]: color,
      }),
    }
    return (
      <div ref={ref} className={cssStyles.progress} data-card-progress="true">
        {(label !== undefined || displayValue !== undefined) && (
          <div className={cssStyles.progressMeta}>
            {label !== undefined && <span>{label}</span>}
            <span>{display}</span>
          </div>
        )}
        <div
          className={cssStyles.progressTrack}
          role="progressbar"
          aria-valuenow={Math.round(pct * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={cssStyles.progressFill} style={fillStyle} />
        </div>
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.FOOTER
// -----------------------------------------------------------------------------

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true, left and right action groups are separated by margin-right:auto
   *  so the first child is left-aligned and the second is right-aligned. */
  split?: boolean
  children: ReactNode
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ split = false, className, children, ...restProps }, ref) {
    return (
      <div
        ref={ref}
        className={mergeClassNames(
          cssStyles.footer,
          split ? cssStyles.split : '',
          className
        )}
        data-card-footer="true"
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.FOOTERACTIONS — wraps a group of action buttons in the footer
// -----------------------------------------------------------------------------

export interface CardFooterActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right'
  children: ReactNode
}

const CardFooterActions = forwardRef<HTMLDivElement, CardFooterActionsProps>(
  function CardFooterActions({ side, className, children, ...restProps }, ref) {
    return (
      <div
        ref={ref}
        className={mergeClassNames(cssStyles.footerActions, className)}
        {...(side !== undefined && { 'data-card-footer-side': side })}
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.FOOTERMETA — small grey "Created: ..." footer line
// -----------------------------------------------------------------------------

export interface CardFooterMetaProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

const CardFooterMeta = forwardRef<HTMLSpanElement, CardFooterMetaProps>(
  function CardFooterMeta({ className, children, ...restProps }, ref) {
    return (
      <span
        ref={ref}
        className={mergeClassNames(cssStyles.footerMeta, className)}
        data-card-footer-meta="true"
        {...restProps}
      >
        {children}
      </span>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.SECTION — titled sub-region inside Card.Body
// -----------------------------------------------------------------------------

export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional uppercase eyebrow label (e.g. "Network Hierarchy"). */
  label?: ReactNode
  /** Use the muted (grey) palette instead of the accent-tinted background. */
  muted?: boolean
  children: ReactNode
}

const CardSection = forwardRef<HTMLDivElement, CardSectionProps>(
  function CardSection({ label, muted = false, className, children, ...restProps }, ref) {
    return (
      <div
        ref={ref}
        className={mergeClassNames(
          cssStyles.section,
          muted ? cssStyles.muted : '',
          className
        )}
        data-card-section="true"
        {...restProps}
      >
        {label !== undefined && (
          <span className={cssStyles.sectionLabel}>{label}</span>
        )}
        {children}
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.BANNER — tinted inline note for warnings / info / pending-review
// -----------------------------------------------------------------------------

export type CardBannerTone =
  | 'info'
  | 'success'
  | 'warn'
  | 'danger'
  | 'neutral'

export interface CardBannerProps {
  /** Severity palette — drives background, border, text color. */
  tone?: CardBannerTone
  /** Optional leading icon / emoji. */
  icon?: ReactNode
  /** Optional bold title rendered above the message. */
  title?: ReactNode
  /** Message body (always rendered when children/message provided). */
  message?: ReactNode
  /** Custom children rendered after title+message. Lets callers embed
   *  links / buttons inline within the banner. */
  children?: ReactNode
}

const CardBanner = forwardRef<HTMLDivElement, CardBannerProps>(
  function CardBanner(
    { tone = 'info', icon, title, message, children },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cssStyles.banner}
        data-card-banner="true"
        data-banner-tone={tone}
        role={tone === 'danger' || tone === 'warn' ? 'alert' : 'status'}
      >
        {icon !== undefined && (
          <span className={cssStyles.bannerIcon} aria-hidden="true">
            {icon}
          </span>
        )}
        <div className={cssStyles.bannerContent}>
          {title !== undefined && (
            <span className={cssStyles.bannerTitle}>{title}</span>
          )}
          {message !== undefined && (
            <span className={cssStyles.bannerMessage}>{message}</span>
          )}
          {children}
        </div>
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.HEADERMETA — right-aligned text (timestamps, counts) in the header
// -----------------------------------------------------------------------------

export interface CardHeaderMetaProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

const CardHeaderMeta = forwardRef<HTMLSpanElement, CardHeaderMetaProps>(
  function CardHeaderMeta({ className, children, ...restProps }, ref) {
    return (
      <span
        ref={ref}
        className={mergeClassNames(cssStyles.headerMeta, className)}
        data-card-header-meta="true"
        {...restProps}
      >
        {children}
      </span>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.BIGVALUE — single large stat tile (between Metric chip and Stats grid)
// -----------------------------------------------------------------------------

export type CardBigValueTone =
  | 'success'
  | 'warn'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'gold'

export interface CardBigValueProps {
  /** Small uppercase label rendered above the value. */
  label: ReactNode
  /** Primary numeric / short text (rendered 1.4–1.6rem, 700 weight). */
  value: ReactNode
  /** Optional secondary line under the value (e.g. "12% vs last month"). */
  caption?: ReactNode
  /** Optional accent color rendered as a small dot next to the label. */
  swatch?: string
  /** Tone driving the value's color. Defaults to theme accent. */
  tone?: CardBigValueTone
}

const CardBigValue = forwardRef<HTMLDivElement, CardBigValueProps>(
  function CardBigValue({ label, value, caption, swatch, tone }, ref) {
    return (
      <div ref={ref} className={cssStyles.bigValue} data-card-big-value="true">
        <span className={cssStyles.bigValueLabel}>
          {swatch !== undefined && (
            <span
              aria-hidden="true"
              className={cssStyles.bigValueSwatch}
              style={{ backgroundColor: swatch }}
            />
          )}
          {label}
        </span>
        <span
          className={cssStyles.bigValueNumber}
          {...(tone !== undefined && { 'data-tone': tone })}
        >
          {value}
        </span>
        {caption !== undefined && (
          <span className={cssStyles.bigValueCaption}>{caption}</span>
        )}
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.CONFIRMDELETE — inline confirmation pane shown beneath the card
// header / body when the user clicks Delete. Absorbs the per-CategoryCard
// hand-rolled confirmation block (~15 callsites had near-identical JSX).
// -----------------------------------------------------------------------------

export interface CardConfirmDeleteProps {
  /** Pre-formatted confirmation question (e.g. `Delete "Acme Inc"?`). */
  message: ReactNode
  /** Confirm handler — usually calls the parent `onDelete(id)`. */
  onConfirm: () => void
  /** Cancel handler — usually flips `showConfirm` back to false. */
  onCancel: () => void
  /** Label for the confirm button. Default `'Yes, Delete'`. */
  confirmLabel?: string
  /** Label for the cancel button. Default `'Cancel'`. */
  cancelLabel?: string
  /**
   * Optional renderer for the action buttons. When supplied, receives
   * `{ onConfirm, onCancel }` and is responsible for the two buttons —
   * lets callers swap in their own goobs `<CustomButton>` styling
   * without the Card primitive having to import CustomButton itself
   * (avoids a Card→Button dependency cycle).
   *
   * When omitted, renders plain `<button>` elements styled by the CSS
   * module. Most callsites should pass `renderActions` so the buttons
   * match the rest of the workspace's button design.
   */
  renderActions?: (slot: {
    onConfirm: () => void
    onCancel: () => void
    confirmLabel: string
    cancelLabel: string
  }) => ReactNode
}

const CardConfirmDelete = forwardRef<HTMLDivElement, CardConfirmDeleteProps>(
  function CardConfirmDelete(
    {
      message,
      onConfirm,
      onCancel,
      confirmLabel = 'Yes, Delete',
      cancelLabel = 'Cancel',
      renderActions,
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cssStyles.confirmDelete}
        data-card-confirm="delete"
        role="alertdialog"
        aria-live="assertive"
      >
        <p className={cssStyles.confirmDeleteMessage}>{message}</p>
        <div className={cssStyles.confirmDeleteActions}>
          {renderActions
            ? renderActions({ onConfirm, onCancel, confirmLabel, cancelLabel })
            : (
              <>
                <button
                  type="button"
                  onClick={onConfirm}
                  data-action="confirm"
                  data-card-confirm-yes="true"
                >
                  {confirmLabel}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  data-action="cancel"
                  data-card-confirm-no="true"
                >
                  {cancelLabel}
                </button>
              </>
            )}
        </div>
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.DRAGHANDLE — drag affordance + keyboard up/down reorder buttons
// -----------------------------------------------------------------------------

export interface CardDragHandleProps {
  /** Accessible label for the handle (e.g. "Reorder step 3"). */
  ariaLabel: string
  /** Move-up handler. When omitted, the up button is disabled. */
  onMoveUp?: () => void
  /** Move-down handler. When omitted, the down button is disabled. */
  onMoveDown?: () => void
  /** Visual grip glyph. Default `'⋮⋮'`. */
  grip?: ReactNode
}

const CardDragHandle = forwardRef<HTMLDivElement, CardDragHandleProps>(
  function CardDragHandle({ ariaLabel, onMoveUp, onMoveDown, grip = '⋮⋮' }, ref) {
    return (
      <div
        ref={ref}
        className={cssStyles.dragHandle}
        data-card-drag-handle="true"
        role="group"
        aria-label={ariaLabel}
      >
        <span
          className={cssStyles.dragHandleGrip}
          aria-hidden="true"
          data-card-drag-grip="true"
        >
          {grip}
        </span>
        <button
          type="button"
          className={cssStyles.dragHandleGrip}
          onClick={onMoveUp}
          disabled={onMoveUp === undefined}
          aria-label="Move up"
          data-card-drag-up="true"
        >
          ↑
        </button>
        <button
          type="button"
          className={cssStyles.dragHandleGrip}
          onClick={onMoveDown}
          disabled={onMoveDown === undefined}
          aria-label="Move down"
          data-card-drag-down="true"
        >
          ↓
        </button>
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// CARD.GRID — list-semantics layout container
// -----------------------------------------------------------------------------

export interface CardGridProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  /** Minimum column width passed to `repeat(auto-fill, minmax(...))`. */
  minWidth?: string
  /** CSS gap between cards. */
  gap?: string
  /** Auto-rendered when `children` is empty. */
  empty?: ReactNode
  children: ReactNode
}

const CardGrid = forwardRef<HTMLUListElement, CardGridProps>(function CardGrid(
  { minWidth = '280px', gap = '12px', empty, className, style, children, ...restProps },
  ref
) {
  // React.Children.toArray already strips null/undefined/false; we just
  // need an empty-check below to drive the empty-state slot.
  const items = React.Children.toArray(children)

  const mergedStyle: CSSProperties = {
    ...(style ?? {}),
    ['--card-grid-min' as string]: minWidth,
    ['--card-grid-gap' as string]: gap,
  }

  if (items.length === 0 && empty !== undefined) {
    return (
      <ul
        ref={ref}
        className={mergeClassNames(cssStyles.grid, className)}
        style={mergedStyle}
        role="list"
        data-card-grid="true"
        data-card-grid-empty="true"
        {...restProps}
      >
        {empty}
      </ul>
    )
  }

  return (
    <ul
      ref={ref}
      className={mergeClassNames(cssStyles.grid, className)}
      style={mergedStyle}
      role="list"
      data-card-grid="true"
      {...restProps}
    >
      {items.map((child, index) => {
        // Each top-level child of <Card.Grid> is wrapped in <li> so the
        // grid stays a list semantically without the caller having to
        // remember. The key is preserved if the child carries one.
        const childKey =
          (isValidElement(child) && child.key) || `card-grid-item-${index}`
        return (
          <li key={childKey} className={cssStyles.gridItem}>
            {child}
          </li>
        )
      })}
    </ul>
  )
})

// -----------------------------------------------------------------------------
// CARD.EMPTYSTATE — typical empty UI; passed to <Card.Grid empty={...} />
// -----------------------------------------------------------------------------

export interface CardEmptyStateProps {
  /** Optional leading icon / glyph. */
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** One or more `<CustomButton>` action(s). */
  actions?: ReactNode
  styles?: { theme?: CardTheme }
}

const CardEmptyState = forwardRef<HTMLDivElement, CardEmptyStateProps>(
  function CardEmptyState({ icon, title, description, actions, styles }, ref) {
    const theme = styles?.theme ?? 'sacred'
    return (
      <div
        ref={ref}
        className={mergeClassNames(
          cssStyles.emptyState,
          theme === 'sacred' ? cssStyles.sacred : ''
        )}
        role="status"
        data-card-empty-state="true"
      >
        {icon !== undefined && (
          <div className={cssStyles.emptyStateIcon} aria-hidden="true">
            {icon}
          </div>
        )}
        <p className={cssStyles.emptyStateTitle}>{title}</p>
        {description !== undefined && (
          <p className={cssStyles.emptyStateDescription}>{description}</p>
        )}
        {actions !== undefined && (
          <div className={cssStyles.emptyStateActions}>{actions}</div>
        )}
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// COMPOUND-COMPONENT ASSEMBLY
// -----------------------------------------------------------------------------

const Card = CardInner
Card.Header = CardHeader
Card.HeaderIcon = CardHeaderIcon
Card.HeaderMeta = CardHeaderMeta
Card.Title = CardTitle
Card.Subtitle = CardSubtitle
Card.HeaderBadges = CardHeaderBadges
Card.HeaderActions = CardHeaderActions
Card.SelectionCheckbox = CardSelectionCheckbox
Card.Body = CardBody
Card.Description = CardDescription
Card.Section = CardSection
Card.Banner = CardBanner
Card.Metrics = CardMetrics
Card.Metric = CardMetric
Card.BigValue = CardBigValue
Card.Stats = CardStats
Card.StatCell = CardStatCell
Card.Progress = CardProgress
Card.Footer = CardFooter
Card.FooterActions = CardFooterActions
Card.FooterMeta = CardFooterMeta
Card.ConfirmDelete = CardConfirmDelete
Card.DragHandle = CardDragHandle
Card.Grid = CardGrid
Card.EmptyState = CardEmptyState

// Display names for React DevTools clarity
CardHeader.displayName = 'Card.Header'
CardHeaderIcon.displayName = 'Card.HeaderIcon'
CardHeaderMeta.displayName = 'Card.HeaderMeta'
CardSection.displayName = 'Card.Section'
CardBanner.displayName = 'Card.Banner'
CardBigValue.displayName = 'Card.BigValue'
CardTitle.displayName = 'Card.Title'
CardSubtitle.displayName = 'Card.Subtitle'
CardHeaderBadges.displayName = 'Card.HeaderBadges'
CardHeaderActions.displayName = 'Card.HeaderActions'
CardSelectionCheckbox.displayName = 'Card.SelectionCheckbox'
CardBody.displayName = 'Card.Body'
CardDescription.displayName = 'Card.Description'
CardMetrics.displayName = 'Card.Metrics'
CardMetric.displayName = 'Card.Metric'
CardStats.displayName = 'Card.Stats'
CardStatCell.displayName = 'Card.StatCell'
CardProgress.displayName = 'Card.Progress'
CardFooter.displayName = 'Card.Footer'
CardFooterActions.displayName = 'Card.FooterActions'
CardFooterMeta.displayName = 'Card.FooterMeta'
CardConfirmDelete.displayName = 'Card.ConfirmDelete'
CardDragHandle.displayName = 'Card.DragHandle'
CardGrid.displayName = 'Card.Grid'
CardEmptyState.displayName = 'Card.EmptyState'

export {
  CardHeader,
  CardHeaderIcon,
  CardHeaderMeta,
  CardTitle,
  CardSubtitle,
  CardHeaderBadges,
  CardHeaderActions,
  CardSelectionCheckbox,
  CardBody,
  CardDescription,
  CardSection,
  CardBanner,
  CardMetrics,
  CardMetric,
  CardBigValue,
  CardStats,
  CardStatCell,
  CardProgress,
  CardFooter,
  CardFooterActions,
  CardFooterMeta,
  CardConfirmDelete,
  CardDragHandle,
  CardGrid,
  CardEmptyState,
}

export default Card
