#!/usr/bin/env bun
/** W-976: static wall for audited frontend security-boundary classes. */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export interface LintFile {
  path: string
  text: string
}

export interface Finding {
  file: string
  line: number
  rule: string
  message: string
}

const lineAt = (text: string, index: number) =>
  text.slice(0, index).split('\n').length

function matches(
  file: LintFile,
  regex: RegExp,
  rule: string,
  message: string
): Finding[] {
  const findings: Finding[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(file.text))) {
    findings.push({
      file: file.path,
      line: lineAt(file.text, match.index),
      rule,
      message,
    })
  }
  return findings
}

/** Pure analyzer used by the planted-defect selftest and the real scan. */
export function inspectSecurityBoundaries(file: LintFile): Finding[] {
  const findings: Finding[] = []

  if (file.path !== 'src/utils/security.ts') {
    findings.push(
      ...matches(
        file,
        /\b(?:window\.)?location\.(?:assign|replace)\s*\(/g,
        'centralized-navigation',
        'programmatic navigation must go through navigateToSafeUrl so executable schemes are rejected'
      )
    )
  }

  if (/text\/csv/i.test(file.text) && !/\bescapeCsvCell\s*\(/.test(file.text)) {
    findings.push({
      file: file.path,
      line: lineAt(file.text, file.text.search(/text\/csv/i)),
      rule: 'csv-formula-neutralization',
      message:
        'CSV generation must route every header/value through escapeCsvCell',
    })
  }

  findings.push(
    ...matches(
      file,
      /fields\s*:\s*(?:parsed\.data|values|currentValues(?:\.current)?)(?:\s*[,}])/g,
      'diagnostic-value-redaction',
      'diagnostics may emit field names but must not emit submitted values'
    )
  )

  findings.push(
    ...matches(
      file,
      /value\s*:\s*(?:message|error|boundError|value)(?:\s*[,}])/g,
      'diagnostic-value-redaction',
      'validation diagnostics must emit a sentinel, not a value or error message'
    )
  )

  findings.push(
    ...matches(
      file,
      /onChange\s*\(\s*editorRef\.current\.innerHTML\s*\)/g,
      'rich-editor-output-sanitization',
      'sanitize rich-editor DOM before emitting it to callers'
    )
  )

  if (
    file.path === 'src/components/ProjectBoard/index.tsx' &&
    !/(?:props\.)?permissions(?:\?)?\.access\s*===\s*['"]no-access['"][\s\S]{0,100}return null/.test(
      file.text
    )
  ) {
    findings.push({
      file: file.path,
      line: 1,
      rule: 'no-access-render-gate',
      message: 'ProjectBoard must return null for no-access',
    })
  }

  if (
    file.path === 'src/components/DataGrid/index.tsx' &&
    !/(?:props\.)?permissions(?:\?)?\.access\s*===\s*['"]no-access['"][\s\S]{0,100}return null/.test(
      file.text
    )
  ) {
    findings.push({
      file: file.path,
      line: 1,
      rule: 'no-access-render-gate',
      message: 'DataGrid must return null for no-access',
    })
  }

  if (
    file.path === 'src/components/Field/Dropdown/SearchableHistory/index.tsx' &&
    /localStorage\.(?:getItem|setItem|removeItem)\(\s*['"]searchableHistory['"]/.test(
      file.text
    )
  ) {
    findings.push({
      file: file.path,
      line: lineAt(file.text, file.text.indexOf("'searchableHistory'")),
      rule: 'fixed-sensitive-storage-key',
      message:
        'SearchableHistory persistence must be caller-opt-in/namespaced and store IDs only',
    })
  }

  if (
    file.path ===
      'src/components/DataGrid/context/ColumnVisibilityContext.tsx' &&
    /localStorage\.(?:getItem|setItem|removeItem)\(\s*['"]columnVisibility['"]/.test(
      file.text
    )
  ) {
    findings.push({
      file: file.path,
      line: lineAt(file.text, file.text.indexOf("'columnVisibility'")),
      rule: 'fixed-sensitive-storage-key',
      message: 'DataGrid persistence must be caller-opt-in and namespaced',
    })
  }

  if (
    (file.path === 'src/components/ProjectBoard/types/index.tsx' ||
      file.path === 'src/components/ProjectBoard/forms/ShowTask/inline.tsx') &&
    /\bviewerRole\b/.test(file.text)
  ) {
    findings.push({
      file: file.path,
      line: lineAt(file.text, file.text.search(/\bviewerRole\b/)),
      rule: 'single-project-board-audience',
      message:
        'ProjectBoard and InlineShowTask must use variant as their single audience discriminator',
    })
  }

  if (
    /URL\.createObjectURL\s*\(/.test(file.text) &&
    !/URL\.revokeObjectURL\s*\(/.test(file.text)
  ) {
    findings.push({
      file: file.path,
      line: lineAt(file.text, file.text.search(/URL\.createObjectURL\s*\(/)),
      rule: 'object-url-lifecycle',
      message: 'every created object URL must be revoked',
    })
  }

  return findings
}

function selftest(): void {
  const bad: LintFile[] = [
    {
      path: 'src/components/Tabs/index.tsx',
      text: 'window.location.assign(tab.route)',
    },
    {
      path: 'src/components/DataGrid/Footer/index.tsx',
      text: "new Blob([csv], {type:'text/csv'})",
    },
    { path: 'src/components/Form/engine/zod.ts', text: 'fields: parsed.data,' },
    { path: 'src/components/Field/Shell/index.tsx', text: 'value: message,' },
    {
      path: 'src/components/ComplexTextEditor/RichEditor/index.tsx',
      text: 'onChange(editorRef.current.innerHTML)',
    },
    { path: 'src/components/ProjectBoard/index.tsx', text: 'return <Board />' },
    { path: 'src/components/DataGrid/index.tsx', text: 'return <Grid />' },
    {
      path: 'src/components/Field/Dropdown/SearchableHistory/index.tsx',
      text: "localStorage.setItem('searchableHistory', value)",
    },
    {
      path: 'src/components/DataGrid/context/ColumnVisibilityContext.tsx',
      text: "localStorage.setItem('columnVisibility', value)",
    },
    {
      path: 'src/components/ProjectBoard/types/index.tsx',
      text: "viewerRole?: 'staff' | 'customer'",
    },
    {
      path: 'src/components/File/index.tsx',
      text: 'URL.createObjectURL(file)',
    },
  ]
  const good: LintFile[] = [
    {
      path: 'src/components/Tabs/index.tsx',
      text: 'navigateToSafeUrl(tab.route)',
    },
    {
      path: 'src/components/DataGrid/Footer/index.tsx',
      text: "escapeCsvCell(value); new Blob([csv], {type:'text/csv'})",
    },
    {
      path: 'src/components/Form/engine/zod.ts',
      text: 'fields: redactDiagnosticFields(parsed.data),',
    },
    { path: 'src/components/Field/Shell/index.tsx', text: 'value: true,' },
    {
      path: 'src/components/ComplexTextEditor/RichEditor/index.tsx',
      text: 'onChange(sanitizeHtml(editorRef.current.innerHTML))',
    },
    {
      path: 'src/components/ProjectBoard/index.tsx',
      text: "if (permissions.access === 'no-access') return null",
    },
    {
      path: 'src/components/DataGrid/index.tsx',
      text: "if (permissions?.access === 'no-access') return null",
    },
    {
      path: 'src/components/Field/Dropdown/SearchableHistory/index.tsx',
      text: 'if (storageKey) localStorage.setItem(storageKey, JSON.stringify(ids))',
    },
    {
      path: 'src/components/DataGrid/context/ColumnVisibilityContext.tsx',
      text: 'if (storageKey) localStorage.setItem(storageKey, JSON.stringify(fields))',
    },
    {
      path: 'src/components/ProjectBoard/types/index.tsx',
      text: "variant: 'customer'",
    },
    {
      path: 'src/components/File/index.tsx',
      text: 'const url = URL.createObjectURL(file); URL.revokeObjectURL(url)',
    },
  ]
  const badFindings = bad.flatMap(inspectSecurityBoundaries)
  const goodFindings = good.flatMap(inspectSecurityBoundaries)
  if (badFindings.length !== 11 || goodFindings.length !== 0) {
    throw new Error(
      `security boundary selftest failed: bad=${badFindings.length}, good=${goodFindings.length}`
    )
  }
  console.log(
    'security boundary selftest: 11 planted defects caught; 11 clean fixtures allowed'
  )
}

if (process.argv.includes('--selftest')) selftest()

const root = resolve(import.meta.dir, '..')
const files = [...new Bun.Glob('src/**/*.{ts,tsx}').scanSync({ cwd: root })]
const findings = files.flatMap(path =>
  inspectSecurityBoundaries({
    path: path.replaceAll('\\', '/'),
    text: readFileSync(resolve(root, path), 'utf8'),
  })
)
for (const finding of findings) {
  console.error(
    `${finding.file}:${finding.line}: [${finding.rule}] ${finding.message}`
  )
}
console.log(
  `security boundaries: ${findings.length} violation(s) over ${files.length} TS/TSX file(s); ` +
    `${files.reduce((sum, path) => sum + (readFileSync(resolve(root, path), 'utf8').match(/dangerouslySetInnerHTML|location\.(?:assign|replace)|text\/csv|localStorage|sessionStorage|URL\.createObjectURL|postMessage/g)?.length ?? 0), 0)} reviewed sink site(s)`
)
process.exitCode = findings.length ? 1 : 0
