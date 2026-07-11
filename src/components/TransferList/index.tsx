'use client'

import React, { useState } from 'react'
import Dropdown, { DropdownOption } from '../Field/Dropdown/Regular'
import CustomCheckbox from '../Checkbox'
import { useFieldBinding } from '../Field/Shell/useFieldBinding'
import { useOptionalFormContext } from '../Form/context'
import cssStyles from './TransferList.module.css'

function not(a: readonly string[], b: readonly string[]) {
  return a.filter(value => b.indexOf(value) === -1)
}
function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter(value => b.indexOf(value) !== -1)
}

function mergeClassNames(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(' ')
}

/** Singular/plural helper for the screen-reader status announcements. */
function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

export type TransferListVariant = 'singleSelection' | 'multipleSelection'

/**
 * The three palettes TransferList themes, matching the canonical `FieldTheme`
 * every sibling field exposes via `styles={{ theme }}`.
 */
export type TransferListTheme = 'light' | 'dark' | 'sacred'

/**
 * Heading level for the two column titles. Rendered as a real `<h1>`–`<h6>`
 * element so the control slots correctly into the consuming page's document
 * outline (WCAG 1.3.1 Info & Relationships; SSR-crawlable).
 */
export type TransferListHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface TransferListDropdownDataMap {
  [dropdownValue: string]: {
    leftItems: string[]
    rightItems: string[]
  }
}

export interface TransferListProps {
  variant?: TransferListVariant
  leftItems?: readonly string[]
  rightItems?: readonly string[]
  dropdownLabel?: string
  dropdownOptions?: DropdownOption[]
  dropdownDataMap?: TransferListDropdownDataMap
  itemLabelMap?: Record<string, string>
  onChange: (
    leftItems: string[],
    rightItems: string[],
    dropdownValue?: string
  ) => void
  leftTitle?: string
  rightTitle?: string
  /**
   * Heading level (1–6) for the two column titles ("Unassigned" / "Assigned").
   * Rendered as a real `<h1>`–`<h6>` so a consumer embedding the transfer list
   * under, say, an `<h2>` section can keep the document outline correct rather
   * than being locked to `<h3>`. Defaults to 3, preserving the prior markup.
   */
  headingLevel?: TransferListHeadingLevel
  /**
   * @deprecated Use `styles.theme` (the `'sacred' | 'light' | 'dark'` union)
   * below — it supersedes this boolean and can also express the `dark` palette
   * this cannot. Still honored: when `styles.theme` is omitted, the resolved
   * theme falls back to `sacredtheme ? 'sacred' : 'light'`.
   */
  sacredtheme?: boolean
  /**
   * Full theme selector, matching every sibling field's `styles={{ theme }}`
   * API. When provided it takes precedence over the legacy `sacredtheme`
   * boolean — which can only express sacred-vs-light — letting a consumer
   * request the `dark` palette. Omitted → falls back to `sacredtheme`.
   */
  styles?: { theme?: TransferListTheme }
  className?: string
  style?: React.CSSProperties
  /**
   * Form-engine binding key. When inside a `<Form>` with no explicit
   * `rightItems`, the assigned (right) list is read from / written to the form
   * engine as the field's `string[]` value; the caller's `onChange` is always
   * preserved. Outside a form, or with explicit `rightItems`, behavior is
   * unchanged (back-compat).
   */
  name?: string
  /** Stable test selector — emitted as `data-field-name`; defaults to `name`. */
  dataFieldName?: string
}

// TransferButton component moved outside TransferList to avoid re-creation during render
interface TransferButtonProps {
  onClick: () => void
  disabled: boolean
  'aria-label': string
  children: React.ReactNode
  name: string
}

const TransferButton: React.FC<TransferButtonProps> = ({
  onClick,
  disabled,
  'aria-label': ariaLabel,
  children,
  name,
}) => {
  // Canonical action verb keyed off the transfer direction (`name`), e.g.
  // `all-right` → `move-all-right`, `checked-left` → `move-selected-left`, so
  // tests target `[data-action="move-all-right"]` regardless of the glyph label.
  const action =
    'move-' + name.replace(/^all-/, 'all-').replace(/^checked-/, 'selected-')
  return (
    <button
      // Explicit type so a transfer arrow never acts as an implicit submit
      // button when the TransferList is rendered inside a `<Form>`/`<form>`
      // (the default `<button>` type is "submit" — WCAG 3.2.2 On Input).
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cssStyles.button}
      data-action={action}
      data-animation-delay={name === 'all-left' ? 'all-left' : undefined}
    >
      {/* The arrow glyph is decorative — the accessible name comes from
          aria-label above — so hide the symbol from assistive tech (WCAG
          1.1.1) to avoid it leaking into or duplicating the name. */}
      <span aria-hidden="true">{children}</span>
    </button>
  )
}

const TransferList: React.FC<TransferListProps> = ({
  variant = 'singleSelection',
  leftItems = [],
  rightItems: rightItemsProp,
  dropdownLabel,
  dropdownOptions = [],
  dropdownDataMap = {},
  itemLabelMap,
  onChange,
  leftTitle = 'Unassigned',
  rightTitle = 'Assigned',
  headingLevel = 3,
  sacredtheme = false,
  styles,
  className,
  style,
  name,
  dataFieldName,
}) => {
  // Tier-1 form binding. The assigned (right) list is the field's primary
  // string[] value. Inside a <Form> with a `name` and no explicit `rightItems`,
  // the right list comes from the form engine and transfers write back to it;
  // otherwise the caller's explicit rightItems/onChange take the unchanged
  // back-compat path. The caller's onChange has a different signature than the
  // binding's string[] onChange, so it is NOT chained inside useFieldBinding —
  // each handler writes the engine value, then calls the caller's onChange.
  const formContext = useOptionalFormContext()
  const { value: boundRight, onChange: boundOnChange } = useFieldBinding<
    string[]
  >({
    name,
    value: rightItemsProp as string[] | undefined,
  })
  const isBound = boundOnChange !== undefined

  // Resolve the effective right list: the engine value when bound, otherwise the
  // caller's rightItems (defaulting to [] as the legacy signature did).
  const rightItems: readonly string[] = isBound
    ? (boundRight ?? [])
    : (rightItemsProp ?? [])

  // Emit a transfer result to BOTH the form engine (when bound) and the caller's
  // onChange, preserving the original three-argument signature.
  const emitChange = React.useCallback(
    (nextLeft: string[], nextRight: string[], dropdownValue?: string): void => {
      if (isBound) boundOnChange?.(nextRight)
      onChange(nextLeft, nextRight, dropdownValue)
    },
    [isBound, boundOnChange, onChange]
  )

  // Per-instance id base so heading/label/error ids are unique across multiple
  // TransferLists on the same page and never leak raw item values (with spaces /
  // special chars) into an id attribute referenced by aria-labelledby.
  const reactId = React.useId()
  const leftTitleId = `${reactId}-left-title`
  const rightTitleId = `${reactId}-right-title`
  const errorId = `${reactId}-error`

  // Screen-reader status: a transfer moves items between lists without moving
  // focus, so each move is announced through a polite live region (WCAG 4.1.3
  // Status Messages).
  const [announcement, setAnnouncement] = useState<string>('')
  const announceMove = React.useCallback(
    (count: number, toTitle: string, leftLen: number, rightLen: number) => {
      setAnnouncement(
        `Moved ${pluralize(count, 'item')} to ${toTitle}. ` +
          `${leftTitle} now has ${pluralize(leftLen, 'item')}, ` +
          `${rightTitle} now has ${pluralize(rightLen, 'item')}.`
      )
    },
    [leftTitle, rightTitle]
  )

  const [selectedDropdownValue, setSelectedDropdownValueInternal] =
    useState<string>('')
  const [checked, setChecked] = useState<readonly string[]>([])

  // Custom handler that resets checked when dropdown changes
  const setSelectedDropdownValue = React.useCallback(
    (value: string) => {
      setSelectedDropdownValueInternal(value)
      if (variant === 'multipleSelection') {
        setChecked([])
      }
    },
    [variant]
  )

  // Explicit `styles.theme` wins; otherwise the legacy boolean maps to
  // sacred-or-light exactly as before (back-compat for callers that never
  // adopted the `styles={{ theme }}` API).
  const theme: TransferListTheme =
    styles?.theme ?? (sacredtheme ? 'sacred' : 'light')

  let currentLeft: readonly string[] = leftItems
  let currentRight: readonly string[] = rightItems

  if (variant === 'multipleSelection') {
    currentLeft = dropdownDataMap[selectedDropdownValue]?.leftItems ?? []
    currentRight = dropdownDataMap[selectedDropdownValue]?.rightItems ?? []
  }

  const leftChecked = intersection(checked, currentLeft)
  const rightChecked = intersection(checked, currentRight)

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]
    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }

  const handleAllRight = () => {
    const newRight = [...currentRight, ...currentLeft]
    announceMove(currentLeft.length, rightTitle, 0, newRight.length)
    emitChange(
      [],
      newRight,
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
    setChecked([])
  }

  const handleCheckedRight = () => {
    const newRight = [...currentRight, ...leftChecked]
    const newLeft = not(currentLeft, leftChecked)
    announceMove(leftChecked.length, rightTitle, newLeft.length, newRight.length)
    setChecked(not(checked, leftChecked))
    emitChange(
      newLeft,
      newRight,
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
  }

  const handleCheckedLeft = () => {
    const newLeft = [...currentLeft, ...rightChecked]
    const newRight = not(currentRight, rightChecked)
    announceMove(rightChecked.length, leftTitle, newLeft.length, newRight.length)
    setChecked(not(checked, rightChecked))
    emitChange(
      newLeft,
      newRight,
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
  }

  const handleAllLeft = () => {
    const newLeft = [...currentLeft, ...currentRight]
    announceMove(currentRight.length, leftTitle, newLeft.length, 0)
    emitChange(
      newLeft,
      [],
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
    setChecked([])
  }

  /**
   * Renders one selectable list as a real `<ul>` of `<li>`s (WCAG 1.3.1). Each
   * row is a native checkbox — the SOLE interactive control, no nested button
   * (WCAG 4.1.2) — whose checked state IS the "selected for transfer" state, so
   * selection is conveyed programmatically, never by colour alone (WCAG 1.4.1).
   * The list is named by its column heading (`labelledBy`) or, in the dropdown
   * variant that has no heading, by `ariaLabel`.
   */
  const renderList = (
    items: readonly string[],
    listKey: string,
    labelledBy: string | undefined,
    ariaLabel: string | undefined
  ) => (
    <div className={cssStyles.list}>
      <ul
        className={cssStyles.listInner}
        {...(labelledBy ? { 'aria-labelledby': labelledBy } : {})}
        {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      >
        {items.map((value, index) => {
          // Index- and instance-scoped ids: valid (no spaces/special chars from
          // the raw value), unique across the left/right lists (listKey) and
          // across component instances (reactId).
          const labelId = `${reactId}-${listKey}-item-${index}-label`
          const checkboxId = `${reactId}-${listKey}-item-${index}-cb`
          const isChecked = checked.indexOf(value) !== -1
          const displayedLabel = itemLabelMap?.[value] || value

          return (
            <li
              key={value}
              className={cssStyles.listItem}
              data-action="toggle"
              data-checked={isChecked ? 'true' : undefined}
            >
              <span className={cssStyles.checkboxContainer}>
                {/* The native checkbox is the real, focusable control: keyboard
                    users Tab to it and toggle with Space; its checked state is
                    announced natively. `aria-labelledby` names it from the
                    adjacent label so the announced name is deterministic. */}
                <CustomCheckbox
                  id={checkboxId}
                  checked={isChecked}
                  onChange={handleToggle(value)}
                  aria-labelledby={labelId}
                  styles={{ theme }}
                />
              </span>
              {/* A real `<label htmlFor>` so clicking the visible text toggles
                  the checkbox, and it carries the themed item label styling. */}
              <label
                htmlFor={checkboxId}
                id={labelId}
                className={cssStyles.label}
              >
                {displayedLabel}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )

  const HeadingTag = `h${headingLevel}` as
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'

  const renderLeftColumn = () => {
    if (variant === 'singleSelection') {
      return (
        <div className={cssStyles.column}>
          <HeadingTag id={leftTitleId} className={cssStyles.title}>
            {leftTitle}
          </HeadingTag>
          {renderList(currentLeft, 'left', leftTitleId, undefined)}
        </div>
      )
    }
    return (
      <div className={cssStyles.column}>
        <Dropdown
          label={dropdownLabel || ''}
          options={dropdownOptions}
          value={selectedDropdownValue}
          onChange={value => setSelectedDropdownValue(value)}
          styles={{ theme }}
        />
        {/* No heading in the dropdown variant, so the list is named directly. */}
        {renderList(
          currentLeft,
          'left',
          undefined,
          dropdownLabel || 'Available items'
        )}
      </div>
    )
  }

  // `data-filled` reflects a non-empty assigned (right) list — the field's value.
  const hasValue = rightItems.length > 0
  const engineError =
    formContext && name ? formContext.engine.getError(name) : undefined

  return (
    <div
      className={mergeClassNames(cssStyles.container, className)}
      data-theme={theme}
      data-component="TransferList"
      data-field-name={dataFieldName ?? name}
      data-filled={hasValue ? 'true' : undefined}
      // Group the two lists + transfer controls so a validation error can be
      // programmatically associated with the whole composite field.
      role="group"
      {...(engineError && {
        'data-error': 'true',
        'aria-invalid': true,
        'aria-describedby': errorId,
      })}
      style={style}
    >
      {theme === 'sacred' && (
        // Decorative sacred sigil — hidden from assistive tech (WCAG 1.1.1).
        <div className={cssStyles.glyph} aria-hidden="true">
          𓊨
        </div>
      )}
      <div className={cssStyles.row}>
        <div className={cssStyles.column}>{renderLeftColumn()}</div>
        <div className={cssStyles.buttonGroup}>
          <TransferButton
            onClick={handleAllRight}
            disabled={currentLeft.length === 0}
            aria-label="move all right"
            name="all-right"
          >
            ≫
          </TransferButton>
          <TransferButton
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
            name="checked-right"
          >
            &gt;
          </TransferButton>
          <TransferButton
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
            name="checked-left"
          >
            &lt;
          </TransferButton>
          <TransferButton
            onClick={handleAllLeft}
            disabled={currentRight.length === 0}
            aria-label="move all left"
            name="all-left"
          >
            ≪
          </TransferButton>
        </div>
        <div className={cssStyles.column}>
          <HeadingTag id={rightTitleId} className={cssStyles.title}>
            {rightTitle}
          </HeadingTag>
          {renderList(currentRight, 'right', rightTitleId, undefined)}
        </div>
      </div>

      {/* Validation error — visible AND announced (role="alert"), and linked to
          the group above via aria-describedby (WCAG 3.3.1 / 4.1.3). */}
      {engineError && (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
          className={cssStyles.error}
        >
          {engineError}
        </div>
      )}

      {/* Polite live region announcing each transfer to screen-reader users. */}
      <div role="status" aria-live="polite" className={cssStyles.srOnly}>
        {announcement}
      </div>
    </div>
  )
}

export default TransferList
