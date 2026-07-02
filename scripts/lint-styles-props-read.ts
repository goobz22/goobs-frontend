#!/usr/bin/env bun
/**
 * lint-styles-props-read.ts — every key on an exported *Styles interface must
 * actually be READ by its component (or carry an explicit @deprecated notice).
 *
 * Guards against the "documented-but-inert API" class: the audit
 * (docs/audits/story-jsdoc-audit-2026-07-01.md §6-A) found ~170 typed,
 * docgen-visible styles props that did nothing at runtime — a styles surface
 * preserved verbatim from the removed JS theme layer. Wave 2 deleted or
 * implemented them; this script keeps the class extinct.
 *
 * A key counts as READ when the interface's own directory (component dir)
 * mentions it as a property access, destructuring binding, or quoted key —
 * e.g. styles?.height, { height }, ['height'], setVar('--x', styles.height).
 * Shared contracts (FormFieldStyles et al.) are consumed OUTSIDE their
 * declaring directory, so a key missing from its own dir is only flagged when
 * it is read NOWHERE under src/components — definite-dead, zero false
 * positives, at the cost of missing "read in an unrelated dir" drift.
 * A key counts as EXCUSED when its JSDoc block contains @deprecated.
 *
 * Exit 1 listing Component.styles.<key> for every inert, non-deprecated key.
 * Run from the repo root:  bun scripts/lint-styles-props-read.ts
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const HERE = path.dirname(fileURLToPath(import.meta.url)).replace(/\\/g, '/')
const ROOT = HERE.endsWith('/scripts') ? HERE.slice(0, -'/scripts'.length) : process.cwd().replace(/\\/g, '/')

function walk(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.') || entry === 'storybook-static') continue
    const full = `${dir}/${entry}`
    if (statSync(full).isDirectory()) walk(full, acc)
    else if (/\.(tsx|ts|css)$/.test(entry) && !/\.stories\.tsx$/.test(entry) && !/\.d\.ts$/.test(entry)) acc.push(full)
  }
  return acc
}

const componentFiles = walk(`${ROOT}/src/components`)
const fileText = new Map(componentFiles.map(file => [file, readFileSync(file, 'utf8')]))

interface StylesInterface {
  name: string
  file: string
  dir: string
  keys: { key: string; deprecated: boolean }[]
}

// ---- parse exported *Styles interfaces ----
const interfaces: StylesInterface[] = []
for (const file of componentFiles) {
  if (!/\.tsx?$/.test(file)) continue
  const text = fileText.get(file)!
  for (const match of text.matchAll(/export interface (\w+Styles)\s*(?:extends [^{]+)?\{/g)) {
    const name = match[1]
    // slice the interface body by brace matching
    let depth = 0
    let bodyStart = match.index! + match[0].length
    let bodyEnd = bodyStart
    for (let i = bodyStart - 1; i < text.length; i++) {
      if (text[i] === '{') depth++
      else if (text[i] === '}') {
        depth--
        if (depth === 0) { bodyEnd = i; break }
      }
    }
    const body = text.slice(bodyStart, bodyEnd)
    const keys: { key: string; deprecated: boolean }[] = []
    // member keys at depth 0 of the body (skip nested object-literal types)
    let nested = 0
    for (const line of body.split('\n')) {
      const openings = (line.match(/\{/g) || []).length
      const closings = (line.match(/\}/g) || []).length
      const keyMatch = nested === 0 ? line.match(/^\s{2}(?:readonly\s+)?['"]?([a-zA-Z_$][\w$]*)['"]?\??:/) : null
      if (keyMatch) {
        // deprecated if the preceding JSDoc (search back a few lines) says so
        const lineIndex = body.split('\n').indexOf(line)
        const preceding = body.split('\n').slice(Math.max(0, lineIndex - 6), lineIndex).join('\n')
        keys.push({ key: keyMatch[1], deprecated: /@deprecated/.test(preceding) })
      }
      nested += openings - closings
    }
    interfaces.push({ name, file, dir: path.dirname(file).replace(/\\/g, '/'), keys })
  }
}

// ---- check reads ----
const inert: string[] = []
for (const iface of interfaces) {
  // read-surface = every non-story source file in the interface's directory
  // tree (component + subcomponents + css), excluding the declaration lines.
  const dirFiles = componentFiles.filter(file => file.startsWith(iface.dir + '/') || path.dirname(file).replace(/\\/g, '/') === iface.dir)
  for (const { key, deprecated } of iface.keys) {
    if (deprecated || key === 'theme') continue
    const readPattern = new RegExp(
      `(styles\\??\\.${key}\\b|\\b${key}\\s*[,}]|\\b${key}\\s*=|\\[['"\`]${key}['"\`]\\]|--[\\w-]*${key.toLowerCase()})`,
      'i'
    )
    const readIn = (files: string[]) =>
      files.some(file => {
        let text = fileText.get(file)!
        if (file === iface.file) {
          // mask the interface declaration itself so the key line doesn't count
          const declIndex = text.indexOf(`interface ${iface.name}`)
          if (declIndex >= 0) {
            const declEnd = text.indexOf('\n}', declIndex)
            text = text.slice(0, declIndex) + text.slice(declEnd < 0 ? declIndex : declEnd)
          }
        }
        return readPattern.test(text)
      })
    const isRead = readIn(dirFiles) || readIn(componentFiles)
    if (!isRead) inert.push(`${iface.name}.${key}  (${iface.file.replace(`${ROOT}/`, '')})`)
  }
}

if (inert.length) {
  console.error(`styles-props-read: ${inert.length} styles key(s) never read by their component (delete, implement, or @deprecated):\n  ${inert.join('\n  ')}`)
  process.exit(1)
}
console.log(`styles-props-read: OK — ${interfaces.length} exported *Styles interfaces, every key read or explicitly @deprecated.`)
