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
 *   - A polite `role="status"` live region announces the busy lifecycle to
 *     assistive tech (WCAG 4.1.3): `pendingLabel` when a save starts and
 *     `completedLabel` when `pending` returns to `false`. Success vs. failure
 *     is caller-owned (SaveButton only sees `pending`) — a caller whose save
 *     can fail announces the error itself and may override `completedLabel`.
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
   * Announcement pushed to the polite live region when a save FINISHES — i.e.
   * `pending` transitions `true → false` — so assistive tech hears the busy
   * lifecycle CLOSE, not just its start (WCAG 4.1.3). Default `'Save complete'`.
   *
   * SaveButton only observes `pending`; it cannot know success vs. failure —
   * that outcome is caller-owned. A caller whose save can FAIL should announce
   * the error itself (e.g. via its error `<Alert role="alert">`) and may pass a
   * custom `completedLabel`, or `''` to suppress the default completion cue.
   */
  completedLabel?: string
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
  completedLabel = 'Save complete',
  subject,
  styles,
  ...restProps
}) => {
  const isDisabled = !valid || pending

  // Live-region text tracks the FULL busy lifecycle, not just its start. We
  // announce `pendingLabel` when a save begins and `completedLabel` when it
  // ends, so an AT user hears both edges (WCAG 4.1.3). The completion edge is
  // the gap the audit flagged: previously the region silently cleared to ''
  // on `pending: true → false`, so the user heard "Saving…" but never that it
  // finished. Derived from the previous-render `pending` via React's
  // adjust-state-during-render pattern (previous value held in state, not a
  // ref, and no effect — so neither the react-hooks refs nor set-state-in-
  // effect rules apply); the `announcement` initializer seeds a mount that is
  // already pending.
  const [announcement, setAnnouncement] = React.useState(
    pending ? pendingLabel : ''
  )
  const [prevPending, setPrevPending] = React.useState(pending)
  if (prevPending !== pending) {
    setPrevPending(pending)
    setAnnouncement(pending ? pendingLabel : completedLabel)
  }

  // Merge caller styles on top of the disabled flag so the underlying
  // CustomButton dims correctly. `disabled` in ButtonStyles is OR-ed with the
  // native disabled attribute inside CustomButton.
  const mergedStyles: ButtonStyles = {
    ...styles,
    disabled: isDisabled,
  }

  return (
    <>
      <CustomButton
        action="save"
        variant="primary"
        text={pending ? pendingLabel : label}
        {...(pending && { icon: <PendingSpinner /> })}
        disabled={isDisabled}
        {...(pending && { 'aria-busy': true })}
        onClick={onSave}
        styles={mergedStyles}
        data-save-button="true"
        {...(pending && { 'data-save-pending': 'true' })}
        {...(subject !== undefined && { subject })}
        {...restProps}
      />
      {/* Polite live region carrying the busy-state announcement (WCAG
          4.1.3). Empty when idle; announces `pendingLabel` while a save is in
          flight (so AT hears "Saving…" even though the button is disabled) and
          `completedLabel` once it finishes, closing the busy lifecycle instead
          of clearing silently. */}
      <span className={cssStyles.srOnly} role="status" aria-live="polite">
        {announcement}
      </span>
    </>
  )
}

SaveButton.displayName = 'SaveButton'

export default SaveButton
