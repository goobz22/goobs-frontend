'use client'

/**
 * =============================================================================
 * MONEYTEXT — read-only currency formatter
 * =============================================================================
 *
 * The display-only sibling of `<USDField>`. Renders a finished dollar amount
 * as a `<span>` — NO `<FieldShell>`, NO `<input>`, NO label. It exists to
 * absorb the ~79 hand-written inline dollar-formatting re-rolls scattered
 * through the workspaces (the `${'$'}{value.toFixed(2)}` / `$` + `toLocaleString`
 * spans in invoices, statements, totals, etc. — e.g. InlineShowServiceInvoice
 * :646 and the ~50 in statement views).
 *
 *   <MoneyText value={invoice.total} tone="total" mono />
 *   → <span data-money data-component="MoneyText">$1,234.50</span>
 *
 *   <MoneyText value={-42} />          → -$42.00
 *   <MoneyText value="1200.5" />       → $1,200.50
 *   <MoneyText value={120} currency="EUR" /> → €120.00
 *
 * It shares the SAME numeric parsing core as the editable `<USDField>` via the
 * `./formatCurrency` util (`formatMoney`), so a value typed into a field and
 * the same value shown here never disagree on what number they represent.
 *
 * `tone` is a light semantic hint (`'total'` / `'due'`) emitted as
 * `data-money-tone` for CSS to tint — totals read bolder, amounts-due read in
 * the warning palette. `mono` switches to a tabular monospace face so columns
 * of figures align on the decimal point.
 * =============================================================================
 */

import React from 'react'
import cssStyles from './MoneyText.module.css'
import { formatMoney } from './formatCurrency'

export type MoneyTextTone = 'total' | 'due'

export interface MoneyTextProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  /** The amount to render. Accepts a number or a numeric string. */
  value: number | string
  /** ISO 4217 currency code. Default `'USD'`. */
  currency?: string
  /**
   * Render in a tabular-monospace face so columns of figures align on the
   * decimal point. Emitted as `data-money-mono`.
   */
  mono?: boolean
  /**
   * Semantic tint. `'total'` reads bolder (the summed line), `'due'` reads in
   * the warning palette (an outstanding balance). Emitted as
   * `data-money-tone`. Omit for the neutral default.
   */
  tone?: MoneyTextTone
  /**
   * Text shown when `value` can't be parsed into a number (empty string, null-
   * ish, garbage). Default `'—'`.
   */
  emptyText?: string
}

/**
 * Read-only formatter. Reuses `formatMoney` from the shared currency util so
 * the display string and the editable `<USDField>` agree on parsing. Negatives
 * render as `-$X.XX`.
 */
const MoneyText: React.FC<MoneyTextProps> = ({
  value,
  currency = 'USD',
  mono = false,
  tone,
  emptyText = '—',
  className,
  ...restProps
}) => {
  const formatted = formatMoney(value, { currency })
  const isEmpty = formatted === null
  const display = formatted ?? emptyText
  const isNegative = !isEmpty && display.startsWith('-')

  return (
    <span
      className={[cssStyles.money, className].filter(Boolean).join(' ')}
      data-money="true"
      data-component="MoneyText"
      data-money-currency={currency}
      {...(tone !== undefined && { 'data-money-tone': tone })}
      {...(mono && { 'data-money-mono': 'true' })}
      {...(isNegative && { 'data-money-negative': 'true' })}
      {...(isEmpty && { 'data-money-empty': 'true' })}
      {...restProps}
    >
      {display}
    </span>
  )
}

MoneyText.displayName = 'MoneyText'

export default MoneyText
