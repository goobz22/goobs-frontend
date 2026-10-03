/** W-977: generic ticket-edit object literals cannot bypass severity justification. */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import ts from 'typescript'

const root = resolve(import.meta.dir, '..')
function inspect(source: string, file: string) {
  const ast = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const hits: string[] = []
  let sites = 0
  function visit(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      const callee = node.expression
      const name = ts.isIdentifier(callee)
        ? callee.text
        : ts.isPropertyAccessExpression(callee)
          ? callee.name.text
          : ''
      const payload = node.arguments[0]
      if (
        name === 'onEdit' &&
        payload &&
        ts.isObjectLiteralExpression(payload)
      ) {
        sites++
        for (const property of payload.properties) {
          if (!property.name) continue
          const key = ts.isComputedPropertyName(property.name)
            ? property.name.expression
            : property.name
          if (
            (ts.isIdentifier(key) || ts.isStringLiteral(key)) &&
            ['severityId', 'severity'].includes(key.text)
          ) {
            const line =
              ast.getLineAndCharacterOfPosition(property.getStart(ast)).line + 1
            hits.push(
              `${file}:${line}: severity must use onSetSeverity with a justification`
            )
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(ast)
  return { hits, sites }
}

if (process.argv.includes('--selftest')) {
  const bad = inspect(
    "onEdit({severityId: id}); props.onEdit({'severity': value}); onEdit({['severityId']: id})",
    'planted.tsx'
  )
  const good = inspect(
    'onEdit({title}); onSetSeverity({taskId, severityId, reason}); onEdit({statusId})',
    'clean.tsx'
  )
  if (bad.hits.length !== 3 || good.hits.length !== 0 || good.sites !== 2)
    throw new Error('ticket severity guard selftest failed')
  console.log(
    'ticket severity guard selftest: 3 planted defects caught; 2 clean generic edits allowed'
  )
}
let files = 0,
  sites = 0
const hits: string[] = []
for (const file of new Bun.Glob(
  'src/components/ProjectBoard/**/*.tsx'
).scanSync({ cwd: root })) {
  const result = inspect(readFileSync(resolve(root, file), 'utf8'), file)
  files++
  sites += result.sites
  hits.push(...result.hits)
}
for (const hit of hits) console.error(hit)
console.log(
  `ticket severity: ${hits.length} violations over ${files} files / ${sites} generic ticket-edit object literals`
)
process.exitCode = hits.length ? 1 : 0
