'use client'

/**
 * =============================================================================
 * LISTITEMCARD — row primitive for ordered / editable / selectable lists
 * =============================================================================
 *
 * Absorbs the ~25 hand-rolled "editable row" variants across the ThothOS
 * wizards and manage panes (e.g. InlineManageTemplate:1705 — a reorderable,
 * removable, selectable row with a numbered order badge and a leading icon).
 *
 * Renders a semantic `<li>` so a stack of these reads as a list to assistive
 * tech. The compound family lets callers compose only the slots their row
 * needs:
 *
 *   <ul role="list">
 *     <ListItemCard
 *       selected={isActive}
 *       onSelect={() => select(step.id)}
 *       onRemove={() => remove(step.id)}
 *       onMoveUp={index > 0 ? () => move(index, -1) : undefined}
 *       onMoveDown={index < last ? () => move(index, +1) : undefined}
 *       accentColor="#22c55e"
 *     >
 *       <ListItemCard.Order>{index + 1}</ListItemCard.Order>
 *       <ListItemCard.Icon>📍</ListItemCard.Icon>
 *       <ListItemCard.Content
 *         title={step.name}
 *         subtitle={step.description}
 *       />
 *       <ListItemCard.Actions>
 *         <IconButton aria-label="Edit" onClick={onEdit}>✎</IconButton>
 *       </ListItemCard.Actions>
 *     </ListItemCard>
 *   </ul>
 *
 * COMPOSITION
 *
 *   - Reorder affordance is the existing `<Card.DragHandle>` (drag grip +
 *     keyboard ↑/↓ buttons, WAI-ARIA listbox-reorder pattern). When either
 *     `onMoveUp`/`onMoveDown` is set, the handle renders automatically at the
 *     row's leading edge — callers don't compose it by hand.
 *   - The remove control is goobs `<IconButton>` (color="error"), rendered at
 *     the trailing edge when `onRemove` is set.
 *
 * SELECTION
 *
 *   When `onSelect` is provided, the row's NON-interactive naming content
 *   (order + icon + content) is wrapped in a real `<button>` — the select
 *   target: Enter/Space activate it natively and `aria-pressed` reflects
 *   `selected`. The `<li>` KEEPS its implicit `listitem` role (no `role`
 *   override), and the reorder / remove / `Actions` controls render as SIBLINGS
 *   of that button — never nested inside it — so the button holds no focusable
 *   descendants (ARIA button-role contract) and a `<ul>` of these rows keeps
 *   valid `listitem` children. `selected` drives `data-selected` + the accent
 *   ring.
 *
 * =============================================================================
 */

import React, {
  forwardRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { emitDiag } from '../../utils/diag'
import { CardDragHandle } from '../Card'
import IconButton from '../IconButton'
import cssStyles from './ListItemCard.module.css'

// -----------------------------------------------------------------------------
// SHARED CONTEXT — lets the slot subcomponents read the row's theme / state
// without prop-drilling, and guards against use outside <ListItemCard>.
// -----------------------------------------------------------------------------

export type ListItemCardTheme = 'sacred' | 'light' | 'dark'

interface ListItemCardContextValue {
  theme: ListItemCardTheme
  selected: boolean
  /**
   * Stable id applied to `<ListItemCard.Content>`'s title span so a SELECTABLE
   * row's select `<button>` can name itself via `aria-labelledby` instead of
   * concatenating every descendant's text (which would pull the
   * reorder/remove/action button labels into a garbled accessible name).
   */
  titleId: string
  /** Companion id on the optional subtitle span — folded into the row name. */
  subtitleId: string
}

const ListItemCardContext =
  React.createContext<ListItemCardContextValue | null>(null)

function useListItemCardContext(): ListItemCardContextValue {
  const ctx = React.useContext(ListItemCardContext)
  if (!ctx) {
    throw new Error(
      'ListItemCard subcomponents (Order / Icon / Content / Actions) must be ' +
        'rendered inside <ListItemCard>. Wrap them in <ListItemCard>…</ListItemCard>.'
    )
  }
  return ctx
}

function mergeClassNames(...names: Array<string | undefined | false>): string {
  return names.filter(Boolean).join(' ')
}

// -----------------------------------------------------------------------------
// ROOT
// -----------------------------------------------------------------------------

export interface ListItemCardProps extends Omit<
  React.LiHTMLAttributes<HTMLLIElement>,
  'onSelect'
> {
  /** Selection state — emits `data-selected` + accent ring. */
  selected?: boolean
  /**
   * Selection handler. When set the whole row becomes a click/Enter/Space
   * target (`role="button"`). Omit for non-selectable rows.
   */
  onSelect?: () => void
  /**
   * Remove handler. When set, a trailing error-colored `<IconButton>` remove
   * control is rendered. Omit for non-removable rows.
   */
  onRemove?: () => void
  /**
   * Move-up handler — wired into the composed `<Card.DragHandle>`. When both
   * move handlers are omitted, no drag handle renders.
   */
  onMoveUp?: () => void
  /** Move-down handler — wired into the composed `<Card.DragHandle>`. */
  onMoveDown?: () => void
  /**
   * Optional accent color (left border + selected ring). The common
   * "status-bar on left edge" / "this step is green" pattern.
   */
  accentColor?: string
  /** Accessible label for the row's reorder handle (e.g. "Reorder step 3"). */
  reorderLabel?: string
  /** Accessible label for the remove button. Default `'Remove'`. */
  removeLabel?: string
  /** Theming. Default `'sacred'`. */
  styles?: { theme?: ListItemCardTheme }
  /** Slot children — `ListItemCard.Order` / `.Icon` / `.Content` / `.Actions`. */
  children: ReactNode
}

interface ListItemCardComponent {
  (
    props: ListItemCardProps & React.RefAttributes<HTMLLIElement>
  ): React.ReactElement | null
  displayName?: string
  Order: typeof ListItemCardOrder
  Icon: typeof ListItemCardIcon
  Content: typeof ListItemCardContent
  Actions: typeof ListItemCardActions
}

// React 19 ref-as-prop (mirrors CardInner / CardTitle) — keeps the family
// consistent with the rest of goobs and avoids forwardRef (deprecated in 19).
function ListItemCardInner({
  selected = false,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  accentColor,
  reorderLabel = 'Reorder item',
  removeLabel = 'Remove',
  styles,
  className,
  style,
  children,
  ref,
  ...restProps
}: ListItemCardProps &
  React.RefAttributes<HTMLLIElement>): React.ReactElement | null {
  const theme = styles?.theme ?? 'sacred'
  const selectable = onSelect !== undefined
  const hasReorder = onMoveUp !== undefined || onMoveDown !== undefined

  // Ids shared with <ListItemCard.Content> so a selectable row names itself
  // from its title/subtitle (see ListItemCardContextValue.titleId).
  const baseId = React.useId()
  const titleId = `${baseId}-title`
  const subtitleId = `${baseId}-subtitle`

  const contextValue = React.useMemo<ListItemCardContextValue>(
    () => ({ theme, selected, titleId, subtitleId }),
    [theme, selected, titleId, subtitleId]
  )

  // Internal handle to the rendered <li>, merged with the caller-supplied
  // `ref` so BOTH the consumer and the aria-labelledby reconciliation effect
  // below reach the same node without the consumer losing their ref. Mirrors
  // Card's `assignRootRef`.
  const rootElementRef = React.useRef<HTMLLIElement | null>(null)
  const assignRootRef = React.useCallback(
    (node: HTMLLIElement | null): void => {
      rootElementRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref]
  )

  // The selectable row's <button> select target. The aria-labelledby
  // reconciliation effect below points its accessible name at the Content
  // title/subtitle spans (the row's real name, not its nested-control labels).
  const selectButtonRef = React.useRef<HTMLButtonElement | null>(null)

  // Edge-triggered selection diagnostic (no-op without a host bus). Mirrors the
  // Card root's data-state beacon: report only genuine selection transitions.
  const previousSelected = React.useRef<boolean | null>(null)
  React.useEffect(() => {
    if (previousSelected.current === null) {
      previousSelected.current = selected
      return
    }
    if (previousSelected.current !== selected) {
      previousSelected.current = selected
      emitDiag({
        type: 'component.state',
        component: 'ListItemCard',
        state: selected ? 'selected' : 'default',
      })
    }
  }, [selected])

  // aria-labelledby reconciliation for the selectable row's <button>. The name
  // is already computed at RENDER time from the children (see `nameIds` below),
  // so the SSR / no-JS markup references only ids a `<ListItemCard.Content>`
  // child actually stamps — no dangling idref. This post-mount effect is a
  // robustness fallback for arbitrarily-nested Content: it re-points
  // aria-labelledby at whichever of the title/subtitle ids truly resolved in the
  // DOM, or drops it if neither did. Mirrors Card's title reconciliation.
  React.useEffect(() => {
    if (!selectable) return
    const node = selectButtonRef.current
    if (node === null) return
    const resolvedIds = [titleId, subtitleId].filter(
      id => document.getElementById(id) !== null
    )
    if (resolvedIds.length > 0) {
      node.setAttribute('aria-labelledby', resolvedIds.join(' '))
    } else {
      node.removeAttribute('aria-labelledby')
    }
  }, [selectable, titleId, subtitleId, children])

  const handleSelect = (): void => {
    onSelect?.()
  }

  const mergedStyle: CSSProperties | undefined = accentColor
    ? {
        ...(style ?? {}),
        ['--list-item-accent' as string]: accentColor,
      }
    : style

  // Partition the composed children. A SELECTABLE row wraps only its
  // non-interactive naming content (Order / Icon / Content) in the select
  // <button>; the interactive `Actions` slot renders as a SIBLING outside it so
  // the button never contains focusable descendants (ARIA button-role contract).
  const childArray = React.Children.toArray(children)
  const actionChildren = childArray.filter(
    child => React.isValidElement(child) && child.type === ListItemCardActions
  )
  const labelChildren = childArray.filter(
    child => !(React.isValidElement(child) && child.type === ListItemCardActions)
  )

  // Accessible name of the selectable row, computed at RENDER time so the SSR /
  // no-JS markup references only ids a `<ListItemCard.Content>` child will stamp
  // — no dangling idref. `title` is required on Content (always renders →
  // titleId resolves); the subtitle span only mounts when a `subtitle` is given.
  const contentChild = childArray.find(
    (child): child is React.ReactElement<ListItemCardContentProps> =>
      React.isValidElement(child) && child.type === ListItemCardContent
  )
  const nameIds =
    contentChild === undefined
      ? undefined
      : contentChild.props.subtitle !== undefined
        ? `${titleId} ${subtitleId}`
        : titleId

  return (
    <li
      ref={assignRootRef}
      className={mergeClassNames(cssStyles.root, className)}
      data-component="ListItemCard"
      data-list-item-card="true"
      data-theme={theme}
      data-state={selected ? 'selected' : 'default'}
      {...(selected && { 'data-selected': 'true' })}
      {...(selectable && { 'data-selectable': 'true' })}
      {...(accentColor !== undefined && { 'data-accent': 'true' })}
      style={mergedStyle}
      {...restProps}
    >
      <ListItemCardContext.Provider value={contextValue}>
        {hasReorder && (
          <div
            className={cssStyles.reorder}
            // Reordering must never toggle row selection.
            onClick={event => event.stopPropagation()}
            onKeyDown={event => event.stopPropagation()}
          >
            <CardDragHandle
              ariaLabel={reorderLabel}
              {...(onMoveUp !== undefined && { onMoveUp })}
              {...(onMoveDown !== undefined && { onMoveDown })}
            />
          </div>
        )}

        {selectable ? (
          <>
            {/* Native <button> select target: Enter/Space activate it natively,
                `aria-pressed` reflects `selected`, and it wraps ONLY the
                non-interactive naming content, so it holds no focusable
                descendants. The <li> keeps its implicit `listitem` role; the
                reorder / remove / Actions controls stay siblings of this button. */}
            <button
              type="button"
              ref={selectButtonRef}
              className={cssStyles.select}
              data-list-item-select="true"
              aria-pressed={selected}
              {...(nameIds !== undefined && { 'aria-labelledby': nameIds })}
              onClick={handleSelect}
            >
              {labelChildren}
            </button>
            {actionChildren}
          </>
        ) : (
          children
        )}

        {onRemove !== undefined && (
          <div
            className={cssStyles.remove}
            onClick={event => event.stopPropagation()}
            onKeyDown={event => event.stopPropagation()}
          >
            <IconButton
              size="xsmall"
              color="error"
              action="delete"
              aria-label={removeLabel}
              onClick={onRemove}
              data-list-item-remove="true"
            >
              ✕
            </IconButton>
          </div>
        )}
      </ListItemCardContext.Provider>
    </li>
  )
}

// -----------------------------------------------------------------------------
// LISTITEMCARD.ORDER — numbered circle badge
// -----------------------------------------------------------------------------

export interface ListItemCardOrderProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The order number / position label rendered inside the circle. */
  children: ReactNode
}

const ListItemCardOrder = forwardRef<HTMLSpanElement, ListItemCardOrderProps>(
  function ListItemCardOrder({ className, children, ...restProps }, ref) {
    useListItemCardContext()
    return (
      <span
        ref={ref}
        className={mergeClassNames(cssStyles.order, className)}
        data-list-item-order="true"
        aria-hidden="true"
        {...restProps}
      >
        {children}
      </span>
    )
  }
)

// -----------------------------------------------------------------------------
// LISTITEMCARD.ICON — leading glyph / SVG
// -----------------------------------------------------------------------------

export interface ListItemCardIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

const ListItemCardIcon = forwardRef<HTMLSpanElement, ListItemCardIconProps>(
  function ListItemCardIcon({ className, children, ...restProps }, ref) {
    useListItemCardContext()
    return (
      <span
        ref={ref}
        className={mergeClassNames(cssStyles.icon, className)}
        data-list-item-icon="true"
        aria-hidden="true"
        {...restProps}
      >
        {children}
      </span>
    )
  }
)

// -----------------------------------------------------------------------------
// LISTITEMCARD.CONTENT — title + optional subtitle, takes remaining width
// -----------------------------------------------------------------------------

export interface ListItemCardContentProps {
  title: ReactNode
  subtitle?: ReactNode
  /** Optional extra body rendered under the subtitle (chips, meta, etc.). */
  children?: ReactNode
}

const ListItemCardContent = forwardRef<
  HTMLDivElement,
  ListItemCardContentProps
>(function ListItemCardContent({ title, subtitle, children }, ref) {
  // `id`s let a selectable row name itself via aria-labelledby (see the root's
  // reconciliation effect) — the title/subtitle text is the row's real name,
  // not the concatenation of its nested control labels.
  const { titleId, subtitleId } = useListItemCardContext()
  return (
    <div ref={ref} className={cssStyles.content} data-list-item-content="true">
      <span
        id={titleId}
        className={cssStyles.title}
        data-list-item-title="true"
      >
        {title}
      </span>
      {subtitle !== undefined && (
        <span
          id={subtitleId}
          className={cssStyles.subtitle}
          data-list-item-subtitle="true"
        >
          {subtitle}
        </span>
      )}
      {children}
    </div>
  )
})

// -----------------------------------------------------------------------------
// LISTITEMCARD.ACTIONS — trailing custom action slot (before the remove button)
// -----------------------------------------------------------------------------

export interface ListItemCardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const ListItemCardActions = forwardRef<
  HTMLDivElement,
  ListItemCardActionsProps
>(function ListItemCardActions({ className, children, ...restProps }, ref) {
  useListItemCardContext()
  return (
    <div
      ref={ref}
      className={mergeClassNames(cssStyles.actions, className)}
      data-list-item-actions="true"
      // Action buttons must not bubble a click up to row selection.
      onClick={event => event.stopPropagation()}
      onKeyDown={event => event.stopPropagation()}
      {...restProps}
    >
      {children}
    </div>
  )
})

// -----------------------------------------------------------------------------
// COMPOUND ASSEMBLY
// -----------------------------------------------------------------------------

const ListItemCard = ListItemCardInner as unknown as ListItemCardComponent
ListItemCard.Order = ListItemCardOrder
ListItemCard.Icon = ListItemCardIcon
ListItemCard.Content = ListItemCardContent
ListItemCard.Actions = ListItemCardActions

ListItemCard.displayName = 'ListItemCard'
ListItemCardOrder.displayName = 'ListItemCard.Order'
ListItemCardIcon.displayName = 'ListItemCard.Icon'
ListItemCardContent.displayName = 'ListItemCard.Content'
ListItemCardActions.displayName = 'ListItemCard.Actions'

export {
  ListItemCardOrder,
  ListItemCardIcon,
  ListItemCardContent,
  ListItemCardActions,
}

export default ListItemCard
