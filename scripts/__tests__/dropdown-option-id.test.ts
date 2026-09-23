/**
 * A dropdown option emits the same string whichever variant renders it, pinned.
 *
 * `resolveOptionId` is the single home for "which string does a picked option emit": a
 * non-empty `_id`, otherwise the option's own `value`. `FilterSection` picks its variant by
 * option count (Regular below 8, `<SearchableSimple>` at 8 and above), so if the two branches
 * resolved an option differently, a filter would change meaning when its option list grew.
 * That happened: the searchable branch hand-rolled `opt?._id ?? ''`, and every filter whose
 * options carry no `_id` went dead at 8 options, emitting `''` (no filter) for every pick.
 *
 * goobs has no DOM unit harness (see meeting-capability.test.ts), so this file pins the
 * DECISION (the truth table) and the WIRING (both FilterSection branches and the Regular
 * dropdown resolve through the home, and no hand-rolled `_id ?? ''` remains there). The
 * rendered behaviour is pinned consumer-side in ThothOS.
 *
 * Run: bun test ./scripts/__tests__/dropdown-option-id.test.ts
 */
import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { resolveOptionId } from '../../src/components/Field/Dropdown/optionId'

const root = join(import.meta.dir, '..', '..')
const read = (rel: string) => readFileSync(join(root, rel), 'utf8')

describe('resolveOptionId — the truth table', () => {
  test('an option with an _id emits the _id', () => {
    expect(resolveOptionId({ _id: 'cust-1', value: 'Jane Doe' })).toBe('cust-1')
  })
  test('an option with no _id emits its own value (the dead-filter bug emitted "")', () => {
    expect(resolveOptionId({ value: 'Paused' })).toBe('Paused')
  })
  test('an empty _id counts as absent, as the Regular dropdown always treated it', () => {
    expect(resolveOptionId({ _id: '', value: 'Unassigned' })).toBe('Unassigned')
  })
  test('a null _id counts as absent', () => {
    expect(resolveOptionId({ _id: null, value: 'Open' })).toBe('Open')
  })
  test('a numeric value is coerced to a string', () => {
    expect(resolveOptionId({ value: 3 })).toBe('3')
  })
})

describe('the wiring — every branch resolves through the home', () => {
  const filterSection = read('src/components/Filter/Section/index.tsx')
  const regular = read('src/components/Field/Dropdown/Regular/index.tsx')

  test("FilterSection's searchable branch emits resolveOptionId(opt), not a hand-rolled _id fallback", () => {
    expect(filterSection).toContain('resolveOptionId(')
    expect(filterSection).not.toMatch(/opt\?\._id\s+as\s+string\)\s*\?\?\s*''/)
    expect(filterSection).not.toMatch(/_id[^\n]{0,20}\?\?\s*''/)
  })

  test("the Regular dropdown's handleSelect resolves through the same home", () => {
    expect(regular).toContain('resolveOptionId(')
  })

  test('the planted defect is caught: the old hand-rolled line fails the wiring check', () => {
    const planted = "onChange={opt => d.onChange((opt?._id as string) ?? '')}"
    expect(planted).toMatch(/_id[^\n]{0,20}\?\?\s*''/)
  })
})
