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
 *     assistive tech (WCAG 4.1.3): `pendingLabel` when a save starts and, when
 *     `pending` returns to `false`, the label for the OUTCOME the caller
 *     reports via the optional `outcome` prop — `completedLabel` for
 *     `'success'` (and for `undefined`, i.e. a caller that reports no outcome,
 *     which keeps the pre-`outcome` behaviour byte-for-byte) and `failedLabel`
 *     for `'error'`. `failedLabel` defaults to `''` — a FAILED save must NOT
 *     announce "Save complete", and the failure itself is announced by the
 *     caller's own error `<Alert role="alert">`, so the default for the error
 *     edge is silence rather than a second, competing announcement. A caller
 *     with no such alert may pass `failedLabel` words of its own.
 *
 *     SaveButton still only OBSERVES state — it never infers the outcome. The
 *     caller sets `outcome` in the same state update that clears `pending`
 *     (i.e. when the save resolves or rejects); leaving it `undefined` is a
 *     valid "unknown" and changes nothing for existing consumers.
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
   * Announcement pushed to the polite live region when a save finishes
   * SUCCESSFULLY — i.e. `pending` transitions `true → false` while `outcome` is
   * `'success'` or `undefined` — so assistive tech hears the busy lifecycle
   * CLOSE, not just its start (WCAG 4.1.3). Default `'Save complete'`.
   *
   * Pass `''` to suppress the completion cue entirely. A FAILED save never
   * reaches this label: report `outcome="error"` and the region announces
   * `failedLabel` instead.
   */
  completedLabel?: string
  /**
   * How the finished save turned out, reported by the CALLER — SaveButton only
   * observes `pending` and never infers it. Set it in the same state update
   * that clears `pending`: `'success'` when the save resolves, `'error'` when
   * it rejects.
   *
   * `undefined` means "unknown" and is the default: the completion edge then
   * announces `completedLabel` exactly as it did before this prop existed, so
   * every existing consumer is unchanged.
   */
  outcome?: 'success' | 'error'
  /**
   * Announcement pushed to the polite live region when a save finishes and the
   * caller reports `outcome="error"`. Default `''` — SILENT on purpose: the
   * caller owns the failure announcement (its error `<Alert role="alert">` is
   * the announcer), so the live region must not add a second, competing cue —
   * and it must certainly not say `completedLabel` ("Save complete") beside
   * that alert. A caller that renders NO alert of its own may pass words here
   * (e.g. `'Save failed'`) to make the failure audible.
   */
  failedLabel?: string
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
  outcome,
  failedLabel = '',
  subject,
  styles,
  ...restProps
}) => {
  const isDisabled = !valid || pending

  // Live-region text tracks the FULL busy lifecycle, not just its start. We
  // announce `pendingLabel` when a save begins and, when it ends, the label
  // for the outcome the CALLER reported, so an AT user hears both edges (WCAG
  // 4.1.3) and never hears the wrong one. The completion edge is the gap the
  // audit flagged: previously the region silently cleared to '' on
  // `pending: true → false`, so the user heard "Saving…" but never that it
  // finished — and the first fix for that then announced `completedLabel` on
  // EVERY close, including a save that FAILED, so an AT user heard "Save
  // complete" beside the caller's role="alert" error. `outcome === 'error'`
  // routes the close to `failedLabel` (default '' — the caller's alert is the
  // announcer); `'success'` and `undefined` both keep `completedLabel`, so a
  // consumer that reports no outcome is unaffected. Derived from the
  // previous-render `pending` via React's adjust-state-during-render pattern
  // (previous value held in state, not a ref, and no effect — so neither the
  // react-hooks refs nor set-state-in-effect rules apply); the `announcement`
  // initializer seeds a mount that is already pending.
  const [announcement, setAnnouncement] = React.useState(
    pending ? pendingLabel : ''
  )
  const [prevPending, setPrevPending] = React.useState(pending)
  if (prevPending !== pending) {
    setPrevPending(pending)
    setAnnouncement(
      pending
        ? pendingLabel
        : outcome === 'error'
          ? failedLabel
          : completedLabel
    )
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
        // THE submit affordance. CustomButton defaults to type="button" since
        // 96486d1c (WCAG 3.2.2 — a bare Button inside a form must not fire it),
        // and that commit's comment claimed SaveButton passed its gated
        // type="submit" explicitly — it did not, so every consumer relying on
        // native form submit (the documented contract in `onSave`'s doc above)
        // went SILENT: click emitted action.invoke, the form's handleSubmit
        // never ran, no validation, no mutation, no error. Found as 25 failing
        // outcome specs in the ThothOS G4 sweep, 2026-08-19. SaveButtonProps
        // Omit<'type'> makes this un-overridable — SaveButton IS the submitter.
        type="submit"
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
          flight (so AT hears "Saving…" even though the button is disabled) and,
          once it finishes, the label for the caller-reported `outcome` —
          `completedLabel` on success/unknown, `failedLabel` (silent by
          default) on `'error'` — closing the busy lifecycle instead of
          clearing silently, and without ever claiming a failed save
          completed. */}
      <span className={cssStyles.srOnly} role="status" aria-live="polite">
        {announcement}
      </span>
    </>
  )
}

SaveButton.displayName = 'SaveButton'

export default SaveButton
