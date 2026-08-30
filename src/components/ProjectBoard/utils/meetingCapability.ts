/**
 * The ONE place the board decides whether a meeting affordance may be drawn.
 *
 * ─────────────────────────────── WHY IT EXISTS ───────────────────────────────
 *
 * The board's meeting controls used to be ungateable from the outside. The four
 * meeting handlers were REQUIRED props, so a host that must not offer a
 * capability had exactly two bad options: pass a stub (which draws a live
 * button that reports fake success — the affordance-honesty defect) or not
 * mount the board at all. The board's OTHER host-gated control, the notes
 * editor, was already correct precisely because `onUpdateCompanyNotes?` is
 * optional and a missing handler renders nothing.
 *
 * So this module makes the meeting controls behave like the notes editor, and
 * adds the axis the notes editor does not need: meeting capabilities are not
 * one decision. A seat may be allowed to CONFIRM a booking somebody else
 * proposed and not to SCHEDULE new ones, or to RESCHEDULE and not to CANCEL.
 * A single coarse `permissions.access` cannot express that, and a host forced
 * to choose one answer for four questions will pick the permissive one.
 *
 * ────────────────────────────── THE DECISION ─────────────────────────────────
 *
 * A capability is available iff BOTH hold:
 *
 *   1. the host passed a handler for it — absence means "this deployment does
 *      not do this", and the control is NOT RENDERED (never rendered-disabled:
 *      a disabled control still advertises a capability the product does not
 *      have, which is the thing the caller was trying to avoid);
 *   2. the per-capability permission map, IF the host passed one, grants
 *      `write` for that capability. No map at all means the handler is the
 *      whole decision, which keeps every existing caller behaving exactly as
 *      before.
 *
 * Both halves are deliberately AND-ed rather than either one winning: a host
 * that resolves permissions server-side still has to withhold nothing, and a
 * host that has no permission system still gets handler-driven hiding.
 *
 * This is a single function on purpose (C1/C7). Ten render sites across the
 * list, details, form and reschedule views ask this question; each one asking
 * it in its own way is how the four controls drifted apart in the first place.
 */

/** The four independently-grantable meeting affordances. */
export type MeetingCapability =
  | 'schedule'
  | 'confirm'
  | 'reschedule'
  | 'cancel'

/** Every capability, for exhaustive iteration by callers and tests. */
export const MEETING_CAPABILITIES: readonly MeetingCapability[] = [
  'schedule',
  'confirm',
  'reschedule',
  'cancel',
] as const

/**
 * The access grant shape the board already speaks (`ProjectBoardProps.permissions`).
 * Repeated structurally rather than imported so this module stays dependency-free
 * and therefore trivially testable.
 */
export interface MeetingAccessGrant {
  access: 'no-access' | 'read' | 'write'
}

/**
 * Per-capability grants. PARTIAL by design: an omitted capability is not
 * "denied", it is "not governed by this map", and falls through to the handler
 * check. A host that wants to deny one names it explicitly with a non-write
 * access, which keeps a typo from silently reading as a denial.
 */
export type MeetingCapabilityPermissions = Partial<
  Record<MeetingCapability, MeetingAccessGrant>
>

/**
 * May this capability's control be drawn?
 *
 * @param capability which meeting affordance is being asked about.
 * @param handler the host's callback for it — any non-function (undefined
 *   included) means the host withheld it.
 * @param permissions the optional per-capability map; `undefined`, or a map
 *   that does not name this capability, leaves the handler as the sole decider.
 */
export function canUseMeetingCapability(
  capability: MeetingCapability,
  handler: unknown,
  permissions?: MeetingCapabilityPermissions
): boolean {
  if (typeof handler !== 'function') return false
  const grant = permissions?.[capability]
  if (!grant) return true
  return grant.access === 'write'
}
