/**
 * Shared currency formatting for the USD field family.
 *
 * Two concerns live here so the editable `<USDField>` input and the
 * read-only `<MoneyText>` display agree on exactly how a dollar value is
 * parsed and rendered:
 *
 *   - `formatCurrency(raw)` — the INPUT normalizer. Strips non-numeric
 *     characters, collapses stray decimal points, and returns the keystroke-
 *     friendly intermediate string the `<USDField>` `<input>` shows while the
 *     user types (e.g. `"12."`, `"12.5"`, `"1200"`). It deliberately does NOT
 *     add thousands separators or a `$` glyph — those would fight the caret as
 *     the user types. Extracted verbatim from `USD/index.tsx` so the field
 *     keeps its existing behaviour byte-for-byte.
 *
 *   - `formatMoney(value, options)` — the DISPLAY formatter. Turns a finished
 *     numeric value into a presentation string with a currency symbol,
 *     thousands separators, and a fixed 2-decimal fraction (e.g. `"$1,234.50"`,
 *     `"-$42.00"`). This is what `<MoneyText>` renders. Negatives are written
 *     as `-$X.XX` (sign before the symbol) to match the inline dollar spans the
 *     component is replacing.
 *
 * Both sit on the same `parseMoney` numeric core so a value typed into a
 * `<USDField>` and the same value shown in a `<MoneyText>` never disagree on
 * what number they represent.
 */

/**
 * INPUT normalizer for the editable `<USDField>` `<input>`.
 *
 * Strips everything except digits and a single decimal point, keeping the
 * partial-keystroke states a user types through (a lone `"."`, a trailing
 * `"12."`, etc.) so the controlled input doesn't fight the caret. Returns `''`
 * for empty / non-numeric input.
 */
export const formatCurrency = (value: string): string => {
  const numericValue: string = value.replace(/[^0-9.]/g, '')
  if (!numericValue) return ''
  if (numericValue === '.') return '.'
  const parts: string[] = numericValue.split('.')
  if (parts.length > 2) {
    const firstPart = parts[0] || ''
    const remainingParts = parts.slice(1).join('')
    return `${firstPart}.${remainingParts}`
  }
  if (numericValue.includes('.')) return numericValue
  const number = parseFloat(numericValue)
  if (isNaN(number)) return ''
  return number.toString()
}

/**
 * Parse a money value (number, or a string that may carry a `$`, commas,
 * spaces, or parentheses-style negatives) into a finite JS number.
 *
 * Returns `null` when the input has no parseable numeric content — callers
 * decide how to render that (MoneyText shows a placeholder dash). Accounting-
 * style `($42.00)` parentheses are read as a negative.
 */
export const parseMoney = (value: number | string): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }
  const trimmed = value.trim()
  if (trimmed === '') return null
  // Accounting parentheses denote a negative amount: "($42.00)" → -42.
  const isParenNegative = /^\(.*\)$/.test(trimmed)
  // Keep digits, a decimal point, and a leading minus; drop $, commas, spaces.
  const cleaned = trimmed.replace(/[^0-9.-]/g, '')
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null
  const parsed = parseFloat(cleaned)
  if (Number.isNaN(parsed)) return null
  const signed = isParenNegative ? -Math.abs(parsed) : parsed
  return signed
}

/** Options for the read-only display formatter. */
export interface FormatMoneyOptions {
  /** ISO 4217 currency code. Default `'USD'`. */
  currency?: string
  /** Number of fraction digits. Default `2`. */
  fractionDigits?: number
  /** Locale for grouping/separators. Default `'en-US'`. */
  locale?: string
}

/** Per-currency symbol table for the common cases. Falls back to the code. */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  CAD: '$',
  AUD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
}

/** Resolve the leading glyph for a currency code (e.g. `USD` → `$`). */
export const currencySymbol = (currency: string): string =>
  CURRENCY_SYMBOLS[currency.toUpperCase()] ?? `${currency.toUpperCase()} `

/**
 * DISPLAY formatter for read-only money rendering (`<MoneyText>`).
 *
 * Renders the magnitude with thousands separators and a fixed fraction, then
 * prefixes the currency symbol. Negatives are written as `-$X.XX` — sign first,
 * then symbol — matching the hand-written inline dollar spans this replaces.
 * Returns `null` when the value can't be parsed so callers can show a dash.
 */
export const formatMoney = (
  value: number | string,
  options: FormatMoneyOptions = {}
): string | null => {
  const { currency = 'USD', fractionDigits = 2, locale = 'en-US' } = options
  const parsed = parseMoney(value)
  if (parsed === null) return null
  const symbol = currencySymbol(currency)
  const isNegative = parsed < 0
  const magnitude = Math.abs(parsed).toLocaleString(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
  return `${isNegative ? '-' : ''}${symbol}${magnitude}`
}
