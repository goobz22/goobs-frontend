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

export type TransferListVariant = 'singleSelection' | 'multipleSelection'

/**
 * The three palettes TransferList themes, matching the canonical `FieldTheme`
 * every sibling field exposes via `styles={{ theme }}`.
 */
export type TransferListTheme = 'light' | 'dark' | 'sacred'

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
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cssStyles.button}
      data-action={action}
      data-animation-delay={name === 'all-left' ? 'all-left' : undefined}
    >
      {children}
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

  // Per-instance id base so label ids are unique across multiple TransferLists
  // on the same page and never leak raw item values (with spaces / special
  // chars) into an id attribute referenced by aria-labelledby.
  const reactId = React.useId()

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
    setChecked(not(checked, rightChecked))
    emitChange(
      newLeft,
      newRight,
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
  }

  const handleAllLeft = () => {
    const newLeft = [...currentLeft, ...currentRight]
    emitChange(
      newLeft,
      [],
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
    setChecked([])
  }

  const renderList = (items: readonly string[], listKey: string) => (
    <div className={cssStyles.list}>
      <div className={cssStyles.listInner}>
        {items.map((value, index) => {
          // Index- and instance-scoped id: valid (no spaces/special chars from
          // the raw value), unique across the left/right lists (listKey) and
          // across component instances (reactId). aria-labelledby below points
          // at the matching <span id={labelId}>, preserving the association.
          const labelId = `${reactId}-${listKey}-item-${index}-label`
          const isChecked = checked.indexOf(value) !== -1
          const displayedLabel = itemLabelMap?.[value] || value

          return (
            <button
              key={value}
              onClick={handleToggle(value)}
              className={cssStyles.listItem}
              data-action="toggle"
              data-checked={isChecked ? 'true' : undefined}
            >
              <div className={cssStyles.checkboxContainer}>
                <CustomCheckbox
                  checked={isChecked}
                  onChange={() => {}}
                  aria-labelledby={labelId}
                  styles={{ theme }}
                />
              </div>
              <span id={labelId} className={cssStyles.label}>
                {displayedLabel}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )

  const renderLeftColumn = () => {
    if (variant === 'singleSelection') {
      return (
        <div className={cssStyles.column}>
          <h3 className={cssStyles.title}>{leftTitle}</h3>
          {renderList(currentLeft, 'left')}
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
        {renderList(currentLeft, 'left')}
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
      {...(engineError && { 'data-error': 'true' })}
      style={style}
    >
      {theme === 'sacred' && <div className={cssStyles.glyph}>𓊨</div>}
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
        <h3 className={cssStyles.title}>{rightTitle}</h3>
        {renderList(currentRight, 'right')}
      </div>
    </div>
  )
}

export default TransferList
