import { expect, test } from 'bun:test'
import { applyResizedWidths } from './useColumnResize'
import type { ColumnDef } from '../types'

test('a resized width stays on the live column, including its current renderCell', () => {
  const frozen = () => 'first list'
  const live = () => 'current list'
  const columns: ColumnDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: live,
    },
  ]
  const merged = applyResizedWidths(columns, { actions: 180 })
  expect(merged[0]?.renderCell).toBe(live)
  expect(merged[0]?.renderCell).not.toBe(frozen)
  expect(merged[0]?.width).toBe(180)
  expect(merged[0]?.computedWidth).toBe(180)
  expect(merged[0]?.renderCell?.({ row: { id: '1' }, value: null })).toBe('current list')
})

test('a column the user has not resized keeps the prop object', () => {
  const column: ColumnDef = { field: 'title', headerName: 'Title', renderCell: () => 'title' }
  const merged = applyResizedWidths([column], {})
  expect(merged[0]).toBe(column)
})
