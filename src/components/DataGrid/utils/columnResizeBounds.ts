import type { ColumnDef } from '../types'

/**
 * Column-resize BOUNDS — the ONE home for "how wide may this column be".
 *
 * WHY THIS FILE EXISTS (and why the numbers are not inlined at the two call
 * sites that need them): the resize handle is an APG **window splitter**
 * (`role="separator"` + `tabIndex` + Arrow keys), and a focusable separator is a
 * RANGE widget — it must publish `aria-valuenow` with an `aria-valuemin` /
 * `aria-valuemax` range that AT can turn into a position announcement.
 *
 * A published range that the resize code does not actually enforce would be an
 * instrument lying about the product: the handle would tell a screen-reader user
 * "you are at 200 of 100" (ARIA's implicit max is 100) or "max is 1200" while
 * the mouse path happily drags to 4000. So the bounds are resolved ONCE, here,
 * and BOTH the clamp (`clampColumnWidth`, used by the pointer and keyboard
 * resize paths in `useColumnResize`) and the exposed ARIA values
 * (`ColumnHeaderRow`) read them from this function. Fork these numbers into a
 * call site and the ARIA silently stops describing the behaviour.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 */

/** Narrowest a column may be dragged/nudged. Matches the historical mouse-path floor. */
export const MIN_COLUMN_WIDTH = 50

/**
 * Widest a column may be dragged/nudged when the column does not declare its
 * own `maxWidth`. Chosen well above every measured header width (the auto-sizer
 * produces header-text + 60px) so it never fights normal layout, while still
 * giving the separator a real, announceable upper bound.
 */
export const DEFAULT_MAX_COLUMN_WIDTH = 1200

/** Width assumed for a column that declares neither `width` nor `computedWidth`. */
export const DEFAULT_COLUMN_WIDTH = 200

/**
 * The column's current pixel width — the same precedence the resize paths and
 * the `--dg-col-width` custom property use (`computedWidth` wins once the user
 * has resized, else the declared `width`, else the default).
 */
export function getColumnWidth(col: Pick<ColumnDef, 'computedWidth' | 'width'>) {
  return col.computedWidth || col.width || DEFAULT_COLUMN_WIDTH
}

/**
 * The resize range for a column, as BOTH enforced and announced.
 *
 * `max` is `Math.max(configuredMax, currentWidth)` on purpose: a consumer may
 * hand in a column already wider than the configured maximum, and clamping such
 * a column DOWN on the first arrow-key press would be a silent layout change no
 * one asked for. Widening the range to include where the column already sits
 * keeps `aria-valuenow` inside `[min, max]` at every instant without the
 * exposed range ever differing from the enforced one — the column simply cannot
 * grow further, which is exactly what the announced max says.
 */
export function resolveColumnResizeBounds(
  col: Pick<ColumnDef, 'computedWidth' | 'width' | 'minWidth' | 'maxWidth'>
): { min: number; max: number } {
  const min = Math.max(1, col.minWidth ?? MIN_COLUMN_WIDTH)
  const configuredMax = col.maxWidth ?? DEFAULT_MAX_COLUMN_WIDTH
  const max = Math.max(configuredMax, getColumnWidth(col), min)
  return { min, max }
}

/** Clamp a proposed width into the column's resolved bounds. */
export function clampColumnWidth(
  col: Pick<ColumnDef, 'computedWidth' | 'width' | 'minWidth' | 'maxWidth'>,
  width: number
): number {
  const { min, max } = resolveColumnResizeBounds(col)
  return Math.min(Math.max(width, min), max)
}
