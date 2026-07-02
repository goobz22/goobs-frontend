/**
 * Shared format / parse / validate utilities for the formatted Field
 * components (PhoneNumber, CreditCardNumber, USD, Percentage,
 * AccountNumber, CVV, RoutingNumber). Each helper used to live
 * duplicated inside its respective component file; consolidating here
 * means one place to fix bugs and one source of truth for the
 * formatting rules.
 *
 * Naming convention:
 *   - `format<X>(raw)` — accept a raw string of digits, return the
 *     visually-formatted string (e.g. "5551234567" → "+1 (555) 123-4567")
 *   - `parse<X>(formatted)` — strip formatting, return the raw value
 *     (string of digits, or number for currency/percentage)
 *   - `validate<X>(raw)` — return boolean
 */

// ──────────────────────────────────────────────────────────────────
// Phone numbers — US-style "+1 (XXX) XXX-XXXX"
// ──────────────────────────────────────────────────────────────────

/**
 * Strip non-digit characters and clamp to 10 digits (US numbers
 * without the country code; the "+1" is added by the formatter).
 *
 * @param formatted - Any phone string, formatted or raw.
 * @returns Up to 10 raw digits.
 */
export function parsePhone(formatted: string): string {
  return formatted.replace(/\D/g, '').slice(0, 10)
}

/**
 * Format a raw 10-digit US phone number string into "+1 (XXX) XXX-XXXX".
 * Partial inputs format progressively — typing "555" returns
 * "+1 (555". This matches what users expect during typing.
 *
 * @param raw - Digits (or any string; non-digits are stripped).
 * @returns The progressively formatted phone string.
 */
export function formatPhone(raw: string): string {
  const digits = parsePhone(raw)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `+1 (${digits}`
  if (digits.length <= 6) return `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

// ──────────────────────────────────────────────────────────────────
// Currency (USD) — "$X,XXX.XX"
// ──────────────────────────────────────────────────────────────────

/**
 * Format a numeric value as "$X,XXX.XX". Uses Intl.NumberFormat for
 * locale-correct grouping separators.
 *
 * @param value - The numeric amount (NaN returns '').
 * @param precision - Fraction digits (default 2).
 * @returns The formatted USD string.
 */
export function formatCurrency(value: number, precision = 2): string {
  if (Number.isNaN(value)) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value)
}

/**
 * Parse a formatted currency string back to a number. Strips `$`,
 * commas, and any other non-numeric characters except the decimal
 * point and leading minus sign. Returns NaN for unparsable input.
 *
 * @param formatted - The formatted currency string.
 * @returns The numeric value, or NaN.
 */
export function parseCurrency(formatted: string): number {
  const cleaned = formatted.replace(/[^\d.-]/g, '')
  const value = parseFloat(cleaned)
  return Number.isFinite(value) ? value : NaN
}

// ──────────────────────────────────────────────────────────────────
// Percentage — "XX.X%"
// ──────────────────────────────────────────────────────────────────

/**
 * Format a numeric value as "XX.XX%" (NaN returns '').
 *
 * @param value - The numeric percentage.
 * @param precision - Fraction digits (default 2).
 * @returns The formatted percentage string.
 */
export function formatPercentage(value: number, precision = 2): string {
  if (Number.isNaN(value)) return ''
  return `${value.toFixed(precision)}%`
}

/**
 * Parse a formatted percentage string back to a number.
 *
 * @param formatted - The formatted percentage string.
 * @returns The numeric value, or NaN.
 */
export function parsePercentage(formatted: string): number {
  const cleaned = formatted.replace(/[^\d.-]/g, '')
  const value = parseFloat(cleaned)
  return Number.isFinite(value) ? value : NaN
}

// ──────────────────────────────────────────────────────────────────
// Credit card — "XXXX XXXX XXXX XXXX" with type detection
// ──────────────────────────────────────────────────────────────────

export type CardType =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'diners'
  | 'jcb'
  | 'unionpay'
  | 'unknown'

/**
 * Detect the card type from the leading digits of a card number.
 * Order matters — `unionpay` is checked before `discover` because
 * their BIN ranges overlap.
 *
 * @param raw - The card number (formatted or raw).
 * @returns The detected card network, or 'unknown'.
 */
export function detectCardType(raw: string): CardType {
  const digits = raw.replace(/\D/g, '')
  if (/^4/.test(digits)) return 'visa'
  if (/^5[1-5]|^2(2[2-9]|[3-6]|7[0-1]|720)/.test(digits)) return 'mastercard'
  if (/^3[47]/.test(digits)) return 'amex'
  if (/^62/.test(digits)) return 'unionpay'
  if (/^6(011|5|4[4-9])/.test(digits)) return 'discover'
  if (/^3(0[0-5]|[689])/.test(digits)) return 'diners'
  if (/^35/.test(digits)) return 'jcb'
  return 'unknown'
}

/**
 * Format a raw card number into spaced groups based on card type.
 * Amex uses 4-6-5; everyone else uses 4-4-4-4.
 *
 * @param raw - The card number digits (non-digits stripped).
 * @returns The space-grouped card number.
 */
export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  const type = detectCardType(digits)
  if (type === 'amex') {
    const max = digits.slice(0, 15)
    if (max.length <= 4) return max
    if (max.length <= 10) return `${max.slice(0, 4)} ${max.slice(4)}`
    return `${max.slice(0, 4)} ${max.slice(4, 10)} ${max.slice(10)}`
  }
  const max = digits.slice(0, 19)
  return max.replace(/(.{4})/g, '$1 ').trim()
}

/**
 * Strip formatting from a card number string.
 *
 * @param formatted - The formatted card number.
 * @returns The raw digits.
 */
export function parseCardNumber(formatted: string): string {
  return formatted.replace(/\D/g, '')
}

// ──────────────────────────────────────────────────────────────────
// Luhn checksum — used by credit card and routing number validators
// ──────────────────────────────────────────────────────────────────

/**
 * Luhn (mod-10) checksum. Returns true when the digit string passes,
 * false otherwise. Empty/short strings return false.
 *
 * @param raw - The digit string to check (non-digits stripped).
 * @returns Whether the checksum passes.
 */
export function luhnValidate(raw: string): boolean {
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 2) return false
  let sum = 0
  let alternate = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits.charAt(i), 10)
    if (alternate) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alternate = !alternate
  }
  return sum % 10 === 0
}

// ──────────────────────────────────────────────────────────────────
// US bank routing number — 9 digits + ABA checksum (different from Luhn)
// ──────────────────────────────────────────────────────────────────

/**
 * Validate a US ABA routing number using the standard
 * `3·d0 + 7·d1 + 1·d2 + 3·d3 + 7·d4 + 1·d5 + 3·d6 + 7·d7 + 1·d8 ≡ 0 (mod 10)`
 * checksum. Empty/short inputs return false.
 *
 * @param raw - The routing-number string (non-digits stripped).
 * @returns Whether the ABA checksum passes.
 */
export function validateRoutingNumber(raw: string): boolean {
  const digits = raw.replace(/\D/g, '')
  if (digits.length !== 9) return false
  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1]
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i), 10) * (weights[i] ?? 0)
  }
  return sum % 10 === 0
}

// ──────────────────────────────────────────────────────────────────
// Generic helpers
// ──────────────────────────────────────────────────────────────────

/**
 * Strip non-digit characters from a string. Used by every numeric
 * formatter as the parsing primitive.
 *
 * @param value - Any string.
 * @returns The digits only.
 */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Mask a string showing only the last `tail` characters. Used by
 * AccountNumber + CreditCardNumber + CVV when displaying a saved value.
 *
 * @param value - The string to mask.
 * @param tail - How many trailing characters stay visible (default 4).
 * @param mask - The mask character (default '•').
 * @returns The masked string.
 */
export function maskTail(value: string, tail = 4, mask = '•'): string {
  if (value.length <= tail) return value
  return mask.repeat(value.length - tail) + value.slice(-tail)
}
