/**
 * The phone field keeps every digit the person types, pinned.
 *
 * The field shows a fixed "+1" prefix, so the value it holds is the 10-digit NATIONAL number. It used
 * to strip a leading "1" on EVERY keystroke, so typing 1, 2, 3 left "23": the digit just typed vanished,
 * silently, and only the first one. A leading 1 is a COUNTRY CODE only when it makes the number eleven
 * digits long (a paste or autofill of "+1 512-555-0100"); it is stripped then, before the ten-digit cap,
 * so the LAST digit of a pasted number is never the one that is dropped.
 *
 * `nationalPhoneDigits` is the single home for that decision; the change handler, the native-input
 * listener and the controlled-value parser all route through it.
 *
 * Run: bun test ./scripts/__tests__/phone-national-digits.test.ts
 */
import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const SOURCE = join(
  import.meta.dir,
  '..',
  '..',
  'src',
  'components',
  'Field',
  'PhoneNumber',
  'index.tsx'
)

// The function is pure and dependency-free; lift it out of the component file so the truth table runs
// without a DOM or the component's CSS-module import (goobs has no DOM unit harness).
function loadNationalPhoneDigits(): (raw: string) => string {
  const source = readFileSync(SOURCE, 'utf8')
  const match = source.match(
    /export const nationalPhoneDigits = \(raw: string\): string => \{[\s\S]*?\n\}/
  )
  if (!match) throw new Error('nationalPhoneDigits not found — this test would pass vacuously')
  const body = match[0]
    .replace('export const nationalPhoneDigits = (raw: string): string =>', '(raw) =>')
    .replace(/: string/g, '')
  return new Function(`return ${body}`)() as (raw: string) => string
}

const nationalPhoneDigits = loadNationalPhoneDigits()

describe('nationalPhoneDigits', () => {
  test('typed digits are kept as typed — a leading 1 is not eaten', () => {
    expect(nationalPhoneDigits('1')).toBe('1')
    expect(nationalPhoneDigits('12')).toBe('12')
    expect(nationalPhoneDigits('123')).toBe('123')
    expect(nationalPhoneDigits('1234567890')).toBe('1234567890')
  })

  test('a pasted / autofilled country code is stripped BEFORE the ten-digit cap', () => {
    expect(nationalPhoneDigits('+1 512-555-0100')).toBe('5125550100')
    expect(nationalPhoneDigits('1-512-555-0100')).toBe('5125550100')
    expect(nationalPhoneDigits('15125550100')).toBe('5125550100')
  })

  test('formatting characters are ignored and the result is capped at ten', () => {
    expect(nationalPhoneDigits('(512) 555-0100')).toBe('5125550100')
    expect(nationalPhoneDigits('5125550100999')).toBe('5125550100')
    expect(nationalPhoneDigits('')).toBe('')
    expect(nationalPhoneDigits('abc')).toBe('')
  })

  test('the component routes every entry point through it (no hand-rolled strip remains)', () => {
    const source = readFileSync(SOURCE, 'utf8')
    expect(source).not.toMatch(/\.replace\(\/\^1\/, ''\)/)
    expect(source.match(/nationalPhoneDigits\(/g)?.length ?? 0).toBeGreaterThanOrEqual(4)
  })
})
