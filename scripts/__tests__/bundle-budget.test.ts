import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve, sep } from 'node:path'
import {
  EAGER_GZIP_MAX,
  findEagerPayloads,
  readEagerChunks,
} from '../lint-bundle-budget'

describe('initial bundle payloads', () => {
  test('rejects the HTML parser even when the raw entry fits its ceiling', () => {
    const findings = findEagerPayloads(
      'entry.js',
      'const defaults={allowedSchemesAppliedToAttributes:["href","src"]}'
    )
    expect(findings.map(finding => finding.dep)).toContain('sanitize-html')
  })

  test('allows deferred sanitizer and export dependencies', () => {
    expect(
      findEagerPayloads(
        'entry.js',
        'const html=()=>import("sanitize-html");const pdf=()=>import("jspdf")'
      )
    ).toEqual([])
  })

  test('retains the existing highlighter payload check', () => {
    expect(findEagerPayloads('entry.js', 'const prefix="hljs-"')[0]?.dep).toBe(
      'highlight.js'
    )
  })

  test('rejects an eager external entity decoder', () => {
    expect(
      findEagerPayloads('entry.js', 'import {decodeHTML} from "entities"')[0]
        ?.dep
    ).toBe('entities')
  })
})

describe('initial transfer closure', () => {
  const base = resolve(import.meta.dir, '../../.runner/bundle-budget-fixtures')
  let root: string
  beforeEach(() => {
    mkdirSync(base, { recursive: true })
    root = mkdtempSync(join(base, 'case-'))
  })
  afterEach(() => {
    if (!resolve(root).startsWith(base + sep))
      throw new Error('Fixture cleanup escapes its own directory')
    rmSync(root, { recursive: true, force: true })
  })

  test('charges a large static sibling even when the entry itself is tiny', () => {
    let seed = 123456789
    const alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
    let data = ''
    for (let i = 0; i < 450_000; i += 1) {
      seed ^= seed << 13
      seed ^= seed >>> 17
      seed ^= seed << 5
      data += alphabet[(seed >>> 0) % alphabet.length] ?? ''
    }
    writeFileSync(
      join(root, 'entry.js'),
      'import "./shared.js"; export const value=1;'
    )
    writeFileSync(join(root, 'shared.js'), `/*${data}*/ export const shared=1;`)
    const chunks = readEagerChunks(root, 'entry.js')
    expect(chunks.map(chunk => chunk.file)).toEqual(['entry.js', 'shared.js'])
    expect(
      chunks.reduce((total, chunk) => total + chunk.gzip9, 0)
    ).toBeGreaterThan(EAGER_GZIP_MAX)

    writeFileSync(
      join(root, 'entry.js'),
      'export const load=()=>import("./shared.js");'
    )
    const deferred = readEagerChunks(root, 'entry.js')
    expect(deferred.map(chunk => chunk.file)).toEqual(['entry.js'])
    expect(
      deferred.reduce((total, chunk) => total + chunk.gzip9, 0)
    ).toBeLessThan(EAGER_GZIP_MAX)
  })

  test('follows re-exports and visits a cycle once', () => {
    writeFileSync(join(root, 'entry.js'), 'export * from "./shared.js";')
    writeFileSync(
      join(root, 'shared.js'),
      'import "./entry.js"; export const defaults={allowedSchemesAppliedToAttributes:[]};'
    )
    const chunks = readEagerChunks(root, 'entry.js')
    expect(chunks).toHaveLength(2)
    expect(
      chunks
        .flatMap(chunk => findEagerPayloads(chunk.file, chunk.source))
        .map(finding => finding.dep)
    ).toContain('sanitize-html')
  })

  test('fails closed on a missing static sibling', () => {
    writeFileSync(join(root, 'entry.js'), 'import "./missing.js";')
    expect(() => readEagerChunks(root, 'entry.js')).toThrow()
  })
})
