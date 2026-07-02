/**
 * Dependency-free diagnostic emit seam.
 *
 * goobs renders the UI surfaces whose behaviour the host app's test suite
 * wants to assert against — toasts/alerts, modal dialogs, and (soon) form
 * validation. Those surfaces live here, not in the host, which is exactly
 * why the host's diagnostic emitters were never firing: the host bus had no
 * way to observe a toast that goobs rendered.
 *
 * This seam closes that gap WITHOUT coupling goobs to the host. goobs never
 * imports the host's bus module; it only writes to a well-known global
 * (`window.__diag`) when one is present. The contract is the host bus's
 * `push(event)` shape (ThothOS `src/diagnostics/bus.ts`): the bus stamps
 * `ts`, so callers omit it. When no bus exists — production builds, or any
 * host that doesn't run a diagnostics layer — every call is a silent no-op.
 *
 * Keep this list a strict subset of the host bus's DiagEvent union. Adding a
 * variant here that the host doesn't understand is harmless (the bus stores
 * whatever it's handed), but tests can only assert on shapes both sides agree
 * on, so the two definitions are intended to stay in lockstep.
 */

export type GoobsDiagEvent =
  | {
      type: 'toast.shown'
      level: 'success' | 'error' | 'info' | 'warn'
      message: string
    }
  | { type: 'dialog.opened'; id: string }
  | {
      type: 'dialog.closed'
      id: string
      action: 'confirm' | 'cancel' | 'dismiss'
    }
  | {
      type: 'form.submit.attempt'
      formId: string
      fields: Record<string, unknown>
    }
  | {
      type: 'form.validation.failed'
      formId: string
      field: string
      rule: string
      value: unknown
    }
  | { type: 'form.validation.passed'; formId: string }
  | { type: 'action.invoke'; action: string; subject?: string }
  | { type: 'nav.change'; component: string; to: string }
  | {
      type: 'component.state'
      component: string
      subject?: string
      state: string
    }

/** Minimal shape of the host bus we depend on. Intentionally structural. */
interface DiagSink {
  push?: (event: GoobsDiagEvent) => void
}

/**
 * Emit a diagnostic event to the host bus if one is present. Never throws —
 * diagnostics must not be able to break a render or an effect.
 *
 * @param event - The diagnostic event to push onto the host bus.
 */
export function emitDiag(event: GoobsDiagEvent): void {
  if (typeof window === 'undefined') return
  try {
    const sink = (window as unknown as { __diag?: DiagSink }).__diag
    sink?.push?.(event)
  } catch {
    // Swallow — a diagnostics failure must never surface to the user.
  }
}
