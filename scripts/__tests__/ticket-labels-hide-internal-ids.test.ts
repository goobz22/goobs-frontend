/**
 * PQ-07/39 — Ticket # must not be a slice of the internal id, a blank customer
 * must not be an empty cell, and a dropdown must not echo an unmatched id.
 *
 * Run: bun test ./scripts/__tests__/ticket-labels-hide-internal-ids.test.ts
 */
import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'

const showTask = readFileSync(
  'src/components/ProjectBoard/forms/ShowTask/inline.tsx',
  'utf8'
)
const dropdown = readFileSync(
  'src/components/Field/Dropdown/Regular/index.tsx',
  'utf8'
)

test('Ticket # is not the first eight characters of the internal id', () => {
  expect(showTask).not.toContain('taskId.substring(0, 8)')
  expect(showTask).toContain('No number')
})

test('a blank customer reads No customer', () => {
  expect(showTask).toContain("customerAssigned.trim() || 'No customer'")
})

test('an unmatched dropdown value is Select..., never the raw id', () => {
  expect(dropdown).not.toContain('selectedOption?.value || value')
  expect(dropdown).toContain("named || 'Select...'")
})
