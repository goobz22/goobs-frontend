'use client'

/**
 * =============================================================================
 * PANEL — full-height shell surface primitive
 * =============================================================================
 *
 * Built to absorb the hand-rolled inline-shell scaffolding across ThothOS
 * workspaces — the `containerStyle` / `headerStyle` / `contentStyle` triad
 * that every "inline manage / inline show" surface re-rolls by hand. Two
 * reference shells motivated this primitive:
 *
 *   - `InlineShowServiceInvoice` (index.tsx:164) — the full-height flex
 *     column with a dark backdrop, a bordered header bar, and a flex:1
 *     scroll region.
 *   - `InlineManageContact` (InlineManageContact.tsx:113) — the back-button +
 *     title + Save-button header layout.
 *
 * Like `Card`, `Panel` is a compound component: `Panel` is the root and each
 * region (Header / Body / Footer) is a subcomponent attached as a static
 * property. Callers compose the regions their archetype needs.
 *
 *   <Panel variant="sacred">
 *     <Panel.Header
 *       onBack={() => close()}
 *       title="Manage Contact"
 *       subtitle="Edit the wholesale buyer's details"
 *       actions={<SaveButton />}
 *     />
 *     <Panel.Body>
 *       <FieldGrid> ...fields... </FieldGrid>
 *     </Panel.Body>
 *     <Panel.Footer>
 *       <CustomButton text="Delete" variant="destructive" />
 *     </Panel.Footer>
 *   </Panel>
 *
 * The `actions` slot is intentionally a generic `ReactNode` — the consumer
 * passes their own `<SaveButton/>` / `<CustomButton/>`; Panel never imports a
 * Save button itself (keeps the dependency graph one-directional, mirrors the
 * `Card.ConfirmDelete` `renderActions` contract).
 *
 * a11y: for the `sacred`/`standard` variants the root is a `<section>` that
 * becomes a named `role="region"` landmark ONLY when it has an accessible name
 * (a composed `Panel.Header` title via `aria-labelledby`, or a consumer-supplied
 * `aria-label`/`aria-labelledby`); a nameless panel degrades to a plain
 * `<section>` rather than an unnamed landmark. The `fullscreen` variant is a
 * viewport takeover over an opaque backdrop — i.e. a modal — so it renders as
 * `role="dialog"` + `aria-modal="true"` and gets the full APG dialog focus
 * contract (focus moved in on mount, Tab trapped inside, `Escape` → `onClose`,
 * focus restored on unmount), mirroring `Dialog`.
 *
 * Panel is stateless by default (no open/collapse state), so no `component.state`
 * diagnostics are emitted from the root — there is no internal transition to
 * report.
 *
 * =============================================================================
 */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import IconButton from '../IconButton'
import { ArrowBackIcon } from '../Icons'
import Typography from '../Typography'
import cssStyles from './Panel.module.css'

// -----------------------------------------------------------------------------
// FOCUS UTILITIES — shared by the fullscreen focus-trap and the Panel.Body
// scrollable-region-focusable heuristic. The selector mirrors the library's
// canonical trap (see Dialog/index.tsx): visible, enabled, tabbable elements.
// -----------------------------------------------------------------------------

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), ' +
  'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Visible, tabbable DESCENDANTS of `container` (excludes the container itself). */
function getFocusableWithin(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(element => element.offsetParent !== null)
}

// -----------------------------------------------------------------------------
// SHARED CONTEXT — links Panel.Header's title id to Panel root's aria-labelledby
// -----------------------------------------------------------------------------

interface PanelContextValue {
  titleId: string
  subtitleId: string
  variant: PanelVariant
}

const PanelContext = React.createContext<PanelContextValue | null>(null)

function usePanelContext(): PanelContextValue {
  const ctx = React.useContext(PanelContext)
  if (!ctx) {
    throw new Error(
      'Panel subcomponents must be rendered inside <Panel>. ' +
        'Wrap them in <Panel>...</Panel> at the top level.'
    )
  }
  return ctx
}

function mergeClassNames(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(' ')
}

// -----------------------------------------------------------------------------
// PANEL ROOT
// -----------------------------------------------------------------------------

export type PanelVariant = 'sacred' | 'standard' | 'fullscreen'

export interface PanelProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual archetype. `'sacred'` (default) is the dark/gold inline-shell
   * backdrop. `'standard'` is a neutral surface. `'fullscreen'` pins the
   * panel to the full viewport (fixed inset:0) for takeover surfaces and,
   * because it obscures the page beneath an opaque backdrop, is treated as a
   * modal (`role="dialog"` + `aria-modal` + focus trap).
   */
  variant?: PanelVariant
  /**
   * Dismiss handler for the `fullscreen` (modal) variant. When provided, the
   * takeover closes on `Escape` per the APG dialog pattern. Ignored by the
   * non-modal `sacred`/`standard` variants (they are inline surfaces the host
   * unmounts directly). Optional — a fullscreen panel without `onClose` still
   * traps focus and restores it on unmount, it simply has no keyboard-dismiss.
   */
  onClose?: () => void
  children: ReactNode
}

interface PanelComponent {
  (props: PanelProps & React.RefAttributes<HTMLElement>): ReactElement | null
  displayName?: string
  Header: typeof PanelHeader
  Body: typeof PanelBody
  Footer: typeof PanelFooter
}

/**
 * Full-height shell-surface compound component (root plus static `Panel.Header`,
 * `Panel.Body`, and `Panel.Footer` regions) for inline manage/show workspaces.
 * Offers sacred/standard/fullscreen variants and labels the region via the
 * header title for screen readers.
 */
function PanelInner({
  variant = 'sacred',
  className,
  onClose,
  children,
  ref,
  ...restProps
}: PanelProps & React.RefAttributes<HTMLElement>): ReactElement | null {
  const titleId = useId()
  const subtitleId = useId()
  const contextValue = useMemo<PanelContextValue>(
    () => ({ titleId, subtitleId, variant }),
    [titleId, subtitleId, variant]
  )

  // The region labels itself via the header title's id — but ONLY when a
  // Panel.Header is actually composed in. A header-less Panel (Body-only)
  // must not emit a dangling `aria-labelledby` pointing at an id that never
  // renders: an invalid IDREF leaves the region with no accessible name and
  // trips AT/validators. Detect a direct Panel.Header child and gate the attr
  // so the header-less case degrades to an un-named region (or a consumer's
  // own `aria-label`/`aria-labelledby` via restProps) rather than a broken ref.
  // Capture the header element itself (not just presence) so we can also see
  // whether it carries a `subtitle` — the subtitle is the panel's DESCRIPTION
  // and is wired to the root via `aria-describedby` below.
  const headerChild = React.Children.toArray(children).find(
    child =>
      React.isValidElement(child) &&
      child.type === (PanelHeader as React.ElementType)
  ) as React.ReactElement<PanelHeaderProps> | undefined
  const hasHeader = headerChild !== undefined

  // Does the composed header carry a subtitle? The subtitle is the panel's
  // primary description; associating it via `aria-describedby` on the root
  // means AT announces it alongside the title when a named region is entered
  // or the fullscreen dialog opens (APG dialog description; WCAG 4.1.2). Gate
  // the attribute on the subtitle actually rendering (Panel.Header renders the
  // subtitle only when `subtitle !== undefined`) so the IDREF is never dangling.
  const hasSubtitle = headerChild?.props.subtitle !== undefined

  // Does the region have an accessible NAME? Either the header title, or a
  // consumer-supplied `aria-label`/`aria-labelledby` passed through restProps.
  // A `role="region"` (an explicit landmark) with no name is a nameless
  // landmark (axe best-practice `region`); when there is genuinely no name we
  // drop the explicit role and fall back to a plain `<section>`, which is NOT
  // a landmark unless it is named — so header-less panels never register an
  // unnamed landmark.
  const hasAccessibleName =
    hasHeader ||
    restProps['aria-label'] != null ||
    restProps['aria-labelledby'] != null

  // Merge the forwarded ref with a local ref so the focus-trap effect can
  // reach the root node without stealing the consumer's ref.
  const rootRef = useRef<HTMLElement | null>(null)
  const assignRootRef = useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.RefObject<HTMLElement | null>).current = node
    },
    [ref]
  )

  // Keep the latest onClose without making it an effect dependency, so the
  // focus-trap effect runs once per fullscreen-transition (not on every parent
  // re-render, which would otherwise yank focus back to the first element).
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // FULLSCREEN = MODAL. The `.fullscreen` variant is `position:fixed; inset:0`
  // over an opaque backdrop, obscuring the whole page — a modal takeover. A
  // bare `role="region"` with no focus management lets keyboard/AT users Tab
  // straight into the now-invisible content behind it (WCAG 2.4.3 Focus Order /
  // 1.3.1). Give the fullscreen variant the APG dialog contract (mirrors
  // Dialog/index.tsx): move focus in on mount, trap Tab at the boundaries,
  // `Escape` → `onClose` (when provided), restore focus to the opener on
  // unmount. The `role="dialog"` + `aria-modal="true"` set in render make the
  // obscured background inert for assistive tech. Non-fullscreen variants are
  // inline surfaces and are inert here (no trap, no focus theft).
  useEffect(() => {
    if (variant !== 'fullscreen') return undefined
    const node = rootRef.current
    if (!node) return undefined
    const previouslyFocused = document.activeElement as HTMLElement | null

    // Move focus into the takeover (first focusable, else the container).
    const firstFocusable = getFocusableWithin(node)[0]
    if (firstFocusable) firstFocusable.focus()
    else node.focus()

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current?.()
        return
      }
      if (event.key !== 'Tab') return
      const items = getFocusableWithin(node)
      if (items.length === 0) {
        event.preventDefault()
        node.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      const active = document.activeElement
      // Boundary-only cycling. Deliberately NO "active outside → recapture"
      // branch: goobs overlays (SearchableSimple, Popover, MultiSelect,
      // Tooltip) portal their content to document.body, so a dropdown opened
      // inside the panel legitimately holds focus outside the panel subtree —
      // recapturing there would orphan the open dropdown. Matches Dialog's trap.
      if (event.shiftKey && (active === first || active === node)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
      previouslyFocused?.focus?.()
    }
  }, [variant])

  // Dev-only: a fullscreen takeover renders as a modal `role="dialog"`, which
  // MUST expose an accessible name (WCAG 4.1.2). Warn at author time when one
  // opens with neither a `Panel.Header` title nor a consumer `aria-label`/
  // `aria-labelledby`, so a nameless takeover surfaces in development instead
  // of silently shipping. Compiles out in production bundles.
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    if (variant !== 'fullscreen') return
    if (!hasAccessibleName) {
      console.warn(
        'goobs Panel: the `fullscreen` variant renders as a modal ' +
          '(role="dialog", aria-modal="true") but has no accessible name. ' +
          'Compose a <Panel.Header title=…/> or pass `aria-label` / ' +
          '`aria-labelledby` so screen readers announce the takeover on open ' +
          '(WCAG 4.1.2).'
      )
    }
  }, [variant, hasAccessibleName])

  // Role resolution:
  //  • fullscreen  → "dialog" (modal takeover; paired with aria-modal below)
  //  • named       → "region" (a real named landmark — preserved from before)
  //  • unnamed     → no explicit role (plain <section>, not an unnamed landmark)
  const resolvedRole =
    variant === 'fullscreen'
      ? 'dialog'
      : hasAccessibleName
        ? 'region'
        : undefined

  return (
    <PanelContext.Provider value={contextValue}>
      <section
        ref={assignRootRef}
        className={mergeClassNames(
          cssStyles.root,
          cssStyles[variant],
          className
        )}
        role={resolvedRole}
        aria-modal={variant === 'fullscreen' ? true : undefined}
        aria-labelledby={hasHeader ? titleId : undefined}
        // Wire the header subtitle in as the panel's description (announced with
        // the title on region entry / dialog open). Placed before restProps so a
        // consumer can still override with their own `aria-describedby`.
        aria-describedby={hasSubtitle ? subtitleId : undefined}
        // Fullscreen (modal) root is a programmatic focus target for the trap's
        // initial/no-focusable-children fallback.
        tabIndex={variant === 'fullscreen' ? -1 : undefined}
        data-component="Panel"
        data-panel="true"
        data-panel-variant={variant}
        {...restProps}
      >
        {children}
      </section>
    </PanelContext.Provider>
  )
}

// -----------------------------------------------------------------------------
// PANEL.HEADER — back button + title/subtitle + right-side actions slot
// -----------------------------------------------------------------------------

export interface PanelHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  /**
   * When set, a built-in BACK button (IconButton + ArrowBack icon) is
   * rendered at the leading edge and invokes this handler on click.
   */
  onBack?: () => void
  /** Accessible label for the back button. Default `'Back'`. */
  backLabel?: string
  /** Panel title — rendered as the `aria-labelledby` target of the root. */
  title: ReactNode
  /**
   * Heading level for the title, rendered as a real `<h1>`–`<h6>` element so
   * the title is a true document heading (screen-reader heading navigation +
   * SEO outline), not merely styled text. Defaults to `2` — a Panel title is
   * a sub-section of the host page's `<h1>`. The heading element carries the
   * `id` the Panel root references via `aria-labelledby`.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Optional secondary line under the title. */
  subtitle?: ReactNode
  /**
   * Right-aligned actions slot. Consumers pass their own `<SaveButton/>` /
   * `<CustomButton/>` here — Panel keeps this a generic node and never
   * imports a save button itself.
   */
  actions?: ReactNode
}

const PanelHeader = forwardRef<HTMLDivElement, PanelHeaderProps>(
  function PanelHeader(
    {
      onBack,
      backLabel = 'Back',
      title,
      headingLevel = 2,
      subtitle,
      actions,
      className,
      ...restProps
    },
    ref
  ) {
    const { titleId, subtitleId, variant } = usePanelContext()
    // Fullscreen keeps the sacred dark chrome (`.fullscreen` in Panel.module.css
    // inherits the sacred palette from `.root`), so only the `standard` variant
    // gets light-theme text/icons — light text on the dark takeover fails WCAG
    // contrast (#1f2937 on near-black is 1.43:1; sacred gold is 14.97:1).
    const headerTheme = variant === 'standard' ? 'light' : 'sacred'
    // Render the title as a REAL heading element (not a styled span) so screen
    // readers expose it for heading navigation and the SSR outline is correct.
    const HeadingTag = `h${headingLevel}` as
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
    return (
      <div
        ref={ref}
        className={mergeClassNames(cssStyles.header, className)}
        data-panel-header="true"
        {...restProps}
      >
        {onBack !== undefined && (
          <IconButton
            size="small"
            aria-label={backLabel}
            onClick={onBack}
            data-panel-back="true"
            data-action="cancel"
            styles={{ theme: headerTheme }}
          >
            {/* Decorative glyph — the button's aria-label supplies the name. */}
            <ArrowBackIcon aria-hidden="true" styles={{ theme: headerTheme }} />
          </IconButton>
        )}
        <div className={cssStyles.headerTitleBlock} data-panel-title="true">
          <HeadingTag id={titleId} className={cssStyles.headerHeading}>
            {typeof title === 'string' ? (
              <Typography
                text={title}
                variant="cinzelh5"
                styles={{ theme: headerTheme }}
              />
            ) : (
              <Typography variant="cinzelh5" styles={{ theme: headerTheme }}>
                {title}
              </Typography>
            )}
          </HeadingTag>
          {subtitle !== undefined && (
            <span
              id={subtitleId}
              className={cssStyles.headerSubtitle}
              data-panel-subtitle="true"
            >
              {subtitle}
            </span>
          )}
        </div>
        {actions !== undefined && (
          <div
            className={cssStyles.headerActions}
            data-panel-header-actions="true"
          >
            {actions}
          </div>
        )}
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// PANEL.BODY — the flex:1 scroll region (absorbs contentStyle)
// -----------------------------------------------------------------------------

export interface PanelBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const PanelBody = forwardRef<HTMLDivElement, PanelBodyProps>(function PanelBody(
  { className, children, ...restProps },
  ref
) {
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const assignBodyRef = useCallback(
    (node: HTMLDivElement | null) => {
      bodyRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref)
        (ref as React.RefObject<HTMLDivElement | null>).current = node
    },
    [ref]
  )

  // CONDITIONAL scrollable-region-focusable remediation. The body is a flex:1
  // `overflow:auto` scroll region. A keyboard-only user can only scroll it with
  // arrow/Page keys when it is focusable — but making it a tab stop is correct
  // ONLY when it genuinely traps scroll: it must actually OVERFLOW *and* hold no
  // focusable descendants of its own. A form-filled body already has tabbable
  // fields, so a focusable container would be a redundant extra tab stop before
  // them; a non-overflowing body scrolls nothing, so a tab stop there is pure
  // focus-order noise (WCAG 2.4.3). So measure at runtime and only opt in when
  // the body is truly an unfocusable scroll trap (axe-core `scrollable-region-
  // focusable`). Re-measures on resize and content mutation so a body that
  // gains/loses overflow or interactive children stays correct.
  const [needsFocus, setNeedsFocus] = useState(false)
  useEffect(() => {
    const node = bodyRef.current
    if (!node) return undefined
    const measure = () => {
      const overflows = node.scrollHeight > node.clientHeight
      const hasFocusableChild = getFocusableWithin(node).length > 0
      setNeedsFocus(overflows && !hasFocusableChild)
    }
    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(node)
    const mutationObserver = new MutationObserver(measure)
    mutationObserver.observe(node, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'tabindex', 'hidden'],
    })
    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return (
    <div
      ref={assignBodyRef}
      className={mergeClassNames(cssStyles.body, className)}
      // Only a tab stop when it is genuinely an unfocusable scroll trap
      // (measured above). `undefined` omits the attribute entirely; placed
      // before restProps so a consumer can still force a value (e.g. -1 / 0).
      tabIndex={needsFocus ? 0 : undefined}
      data-panel-body="true"
      {...restProps}
    >
      {children}
    </div>
  )
})

// -----------------------------------------------------------------------------
// PANEL.FOOTER — sticky action bar
// -----------------------------------------------------------------------------

export interface PanelFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * When true, the first child group is left-aligned and the remaining
   * group is pushed to the right (margin-left:auto on the second child).
   */
  split?: boolean
  children: ReactNode
}

const PanelFooter = forwardRef<HTMLDivElement, PanelFooterProps>(
  function PanelFooter(
    { split = false, className, children, ...restProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={mergeClassNames(
          cssStyles.footer,
          split ? cssStyles.split : '',
          className
        )}
        data-panel-footer="true"
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

// -----------------------------------------------------------------------------
// COMPOUND-COMPONENT ASSEMBLY
// -----------------------------------------------------------------------------

const Panel = PanelInner as unknown as PanelComponent
Panel.Header = PanelHeader
Panel.Body = PanelBody
Panel.Footer = PanelFooter

Panel.displayName = 'Panel'
PanelHeader.displayName = 'Panel.Header'
PanelBody.displayName = 'Panel.Body'
PanelFooter.displayName = 'Panel.Footer'

export { PanelHeader, PanelBody, PanelFooter }

export default Panel
