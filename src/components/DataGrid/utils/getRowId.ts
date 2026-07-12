/**
 * Canonical row identity for the DataGrid: `_id` (Mongo) first, then `id`,
 * stringified; '' when neither exists. Lives in a LEAF module so Table,
 * Rows, and the selection hooks can all import it without re-creating the
 * Table <-> Rows circular import this file was extracted to break
 * (lint-circular-imports, 2026-07-12).
 *
 * @example
 * getRowId({ _id: '507f1f77bcf86cd799439011' }) // '507f1f77bcf86cd799439011'
 * getRowId({ id: 123 }) // '123'
 * getRowId({}) // ''
 */
export function getRowId(row: {
  id?: string | number
  _id?: string | number
}): string {
  return String(row.id ?? row._id ?? '')
}
