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
   * panel to the full viewport (fixed inset:0) for takeover surfaces.
   */
  variant?: PanelVariant
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
  children,
  ref,
  ...restProps
}: PanelProps & React.RefAttributes<HTMLElement>): ReactElement | null {
  const titleId = useId()
  const contextValue = useMemo<PanelContextValue>(
    () => ({ titleId, variant }),
    [titleId, variant]
  )

  // The region labels itself via the header title's id — but ONLY when a
  // Panel.Header is actually composed in. A header-less Panel (Body-only)
  // must not emit a dangling `aria-labelledby` pointing at an id that never
  // renders: an invalid IDREF leaves the region with no accessible name and
  // trips AT/validators. Detect a direct Panel.Header child and gate the attr
  // so the header-less case degrades to an un-named region (or a consumer's
  // own `aria-label`/`aria-labelledby` via restProps) rather than a broken ref.
  const hasHeader = React.Children.toArray(children).some(
    child =>
      React.isValidElement(child) &&
      child.type === (PanelHeader as React.ElementType)
  )

  return (
    <PanelContext.Provider value={contextValue}>
      <section
        ref={ref}
        className={mergeClassNames(
          cssStyles.root,
          cssStyles[variant],
          className
        )}
        role="region"
        aria-labelledby={hasHeader ? titleId : undefined}
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
    const { titleId, variant } = usePanelContext()
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
  return (
    <div
      ref={ref}
      className={mergeClassNames(cssStyles.body, className)}
      // The body is a flex:1 `overflow:auto` scroll region. When its content
      // overflows but holds no focusable children (e.g. a read-only "show"
      // surface), keyboard-only users cannot scroll it — WCAG 2.1.1. Making
      // it focusable lets arrow/Page keys scroll it. Placed before restProps
      // so a consumer can override `tabIndex` (e.g. -1) when the body already
      // contains its own focusable content.
      tabIndex={0}
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
