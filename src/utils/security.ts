/** Shared, dependency-free browser security primitives. */

const CONTROL_CHARACTER = /[\u0000-\u001F\u007F]/
const SPREADSHEET_FORMULA = /^(?:[\u0000-\u0020\u00A0\uFEFF]*[=+\-@]|[\t\r\n])/

/**
 * Accept an HTTP(S) or relative navigation destination and reject everything
 * executable or browser-local. The original string is returned so callers do
 * not unexpectedly canonicalize application routes.
 *
 * @param value Candidate destination supplied by a component caller.
 * @returns The accepted destination unchanged, or null when it is unsafe.
 */
export function safeNavigationUrl(value: string): string | null {
  if (!value || value.trim() === '' || CONTROL_CHARACTER.test(value))
    return null
  try {
    const parsed = new URL(value, 'https://goobs.invalid/')
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    return value
  } catch {
    return null
  }
}

/**
 * Navigate only when `safeNavigationUrl` accepts the destination.
 *
 * @param value Candidate destination supplied by a component caller.
 * @returns Whether navigation was accepted and initiated.
 */
export function navigateToSafeUrl(value: string): boolean {
  const safe = safeNavigationUrl(value)
  if (!safe || typeof window === 'undefined') return false
  window.location.assign(safe)
  return true
}

/**
 * Quote one RFC-4180-style CSV cell and neutralize spreadsheet formulas.
 * Quoting alone does not stop spreadsheet applications from evaluating cells.
 *
 * @param value Untrusted grid header or cell text.
 * @returns A quoted, formula-neutralized CSV cell.
 */
export function escapeCsvCell(value: string): string {
  const neutralized = SPREADSHEET_FORMULA.test(value) ? `'${value}` : value
  return `"${neutralized.replaceAll('"', '""')}"`
}

/**
 * Keep form field names for test diagnostics without copying their values.
 *
 * @param fields Form values whose keys identify fields and whose values are private.
 * @returns A key-preserving map containing boolean sentinels only.
 */
export function redactDiagnosticFields(
  fields: Record<string, unknown>
): Record<string, true> {
  return Object.fromEntries(Object.keys(fields).map(field => [field, true]))
}
