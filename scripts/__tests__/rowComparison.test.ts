import { expect, test } from 'bun:test'
import { areRowsEqual } from '../../src/components/DataGrid/utils/rowComparison'

test('a newly loaded order or customer label refreshes an existing row', () => {
  const pending = [{ id: 'return-1', status: 'pending', orderLabel: 'Unknown order', customerLabel: 'Unknown customer' }]
  const loaded = [{ id: 'return-1', status: 'pending', orderLabel: 'ORD-42', customerLabel: 'Ada' }]

  expect(areRowsEqual(pending, loaded)).toBe(false)
})

test('nested cell data and added fields also refresh rows', () => {
  const original = [{ id: '1', details: { count: 1 } }]
  expect(areRowsEqual(original, [{ id: '1', details: { count: 2 } }])).toBe(false)
  expect(areRowsEqual(original, [{ id: '1', details: { count: 1 }, label: 'New' }])).toBe(false)
})

test('equal rows and reordered rows retain expected identity semantics', () => {
  const rows = [{ id: '1', details: { count: 1 } }, { id: '2', label: 'B' }]
  expect(areRowsEqual(rows, rows)).toBe(true)
  expect(areRowsEqual(rows, [{ id: '1', details: { count: 1 } }, { id: '2', label: 'B' }])).toBe(true)
  expect(areRowsEqual(rows, [rows[1]!, rows[0]!])).toBe(false)
})
