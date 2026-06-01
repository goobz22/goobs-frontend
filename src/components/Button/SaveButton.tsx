'use client'

/**
 * =============================================================================
 * SAVEBUTTON — the canonical "Save" affordance
 * =============================================================================
 *
 * A THIN wrapper over the existing `<CustomButton>` (the default export of
 * `./index`). It does NOT fork Button — it composes it, forwarding a fixed
 * `action="save"` + `variant="primary"` and deriving `disabled` from the
 * validity / pending state every save button in the app shares:
 *
 *     <SaveButton valid={form.isValid} pending={form.isSubmitting} onSave={save} />
 *
 * Behaviour:
 *   - `disabled = !valid || pending` — the button is only clickable when the
 *     form is valid AND not already saving. This absorbs the ~61 hand-rolled
 *     "green-when-valid / grey-when-not" save buttons (e.g. InlineCreateVLAN
 *     :171) into one primitive so the green↔grey gating is consistent.
 *   - While `pending`, the label swaps to a spinner + `'Saving…'` and the
 *     button is disabled so a double-submit can't fire.
 *   - Reuses CustomButton's `data-action="save"` selector and its
 *     `action.invoke` diagnostic emit (fired from CustomButton's own click
 *     handler) — SaveButton adds no diag of its own.
 *
 * The `<CustomButton>` underneath still renders `data-component="Button"`,
 * `data-action="save"`, `data-variant="primary"`, and (when `subject` is set)
 * `data-subject="<subject>"`, so existing `[data-action="save"]` test selectors
 * keep working unchanged.
 * =============================================================================
 */

import React from 'react'
import CustomButton, { type ButtonProps, type ButtonStyles } from './index'
import cssStyles from './SaveButton.module.css'

export interface SaveButtonProps extends Omit<
  ButtonProps,
  'text' | 'action' | 'variant' | 'icon' | 'disabled' | 'type'
> {
  /**
   * Whether the form is valid. The button is only enabled when `valid` is
   * `true` (and not `pending`). This is the green↔grey gate every save button
   * shares.
   */
  valid: boolean
  /**
   * Whether a save is in flight. While `true` the label becomes a spinner +
   * `'Saving…'` and the button is disabled to block double-submits.
   */
  pending: boolean
  /**
   * Click handler. Aliased to the button's `onClick` so callsites read as
   * `onSave`. Optional — some forms submit via the surrounding `<form>` and
   * just need the gated `type="submit"` button.
   */
  onSave?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** Idle label. Default `'Save'`. */
  label?: string
  /** Label shown while `pending`. Default `'Saving…'`. */
  pendingLabel?: string
  /**
   * Singular entity noun the save targets (e.g. `"contract"`). Forwarded to
   * CustomButton as `subject` → emitted as `data-subject` and carried on the
   * `action.invoke` diag.
   */
  subject?: string
}

/** A self-contained CSS spinner shown in the button's icon slot while pending. */
const PendingSpinner: React.FC = () => (
  <span
    className={cssStyles.spinner}
    aria-hidden="true"
    data-save-spinner="true"
  />
)

const SaveButton: React.FC<SaveButtonProps> = ({
  valid,
  pending,
  onSave,
  label = 'Save',
  pendingLabel = 'Saving…',
  subject,
  styles,
  ...restProps
}) => {
  const isDisabled = !valid || pending

  // Merge caller styles on top of the disabled flag so the underlying
  // CustomButton dims correctly. `disabled` in ButtonStyles is OR-ed with the
  // native disabled attribute inside CustomButton.
  const mergedStyles: ButtonStyles = {
    ...styles,
    disabled: isDisabled,
  }

  return (
    <CustomButton
      action="save"
      variant="primary"
      text={pending ? pendingLabel : label}
      {...(pending && { icon: <PendingSpinner /> })}
      disabled={isDisabled}
      onClick={onSave}
      styles={mergedStyles}
      data-save-button="true"
      {...(pending && { 'data-save-pending': 'true' })}
      {...(subject !== undefined && { subject })}
      {...restProps}
    />
  )
}

SaveButton.displayName = 'SaveButton'

export default SaveButton
