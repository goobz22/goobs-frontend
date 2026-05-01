/**
 * Shared utilities for Field components, relocated from the deleted
 * `src/theme/formField.ts`. These are pure functions (no styling, no
 * state) — the styling helpers from the old file became CSS rules in
 * `FieldShell.module.css`.
 */

/**
 * Standard ARIA props for marking an input/button as required.
 * Spread into the element so both the native `required` attribute and
 * `aria-required` are set:
 *
 *   <input {...getRequiredProps(required)} />
 *
 * Native `required` triggers HTML5 form validation; `aria-required`
 * announces the requirement to assistive technologies even when the
 * native validation is suppressed (e.g. `noValidate` on the form).
 */
export const getRequiredProps = (
  required?: boolean
): { required: boolean; 'aria-required': boolean } => ({
  required: !!required,
  'aria-required': !!required,
})

/**
 * Synchronous required-field validator. Returns the canonical error
 * string when the field is required and empty (after trim), or
 * undefined when valid. Components compose this with their own
 * format-specific validators (e.g. MAC address syntax check).
 */
export const validateRequired = (
  value: string,
  required?: boolean
): string | undefined => {
  if (required && (!value || value.trim() === '')) {
    return 'This field is required'
  }
  return undefined
}
