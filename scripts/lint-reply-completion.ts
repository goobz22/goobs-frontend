/** ProjectBoard reply writes must return/await completion, not discard it before clearing drafts.
 * Runtime outcome/state proof: scripts/test-reply-drafts.ts (real detail + Board).
 * Scope intentionally excludes stories (their callbacks are controlled transports).
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { strict as assert } from 'node:assert'
import ts from 'typescript'

export function discardedReplyWrites(source: string) {
  const file = ts.createSourceFile(
    'reply.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const lines: number[] = []
  function visit(node: ts.Node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      ['onComment', 'onEditComment', 'handleEditComment'].includes(
        node.expression.text
      )
    ) {
      let parent: ts.Node = node.parent
      while (ts.isParenthesizedExpression(parent)) parent = parent.parent
      if (ts.isExpressionStatement(parent) || ts.isVoidExpression(parent))
        lines.push(
          file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1
        )
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  return lines
}

if (import.meta.main) {
  if (process.argv.includes('--selftest')) {
    assert.deepEqual(
      discardedReplyWrites('function save(){onComment(text,id); clear()}'),
      [1]
    )
    assert.deepEqual(
      discardedReplyWrites('function save(){void onEditComment(id,text)}'),
      [1]
    )
    assert.deepEqual(
      discardedReplyWrites('function wrap(){handleEditComment(id,text,task)}'),
      [1]
    )
    assert.deepEqual(
      discardedReplyWrites(
        'async function save(){await onComment(text,id); clear()}'
      ),
      []
    )
    assert.deepEqual(
      discardedReplyWrites('function wrap(){return onEditComment(id,text)}'),
      []
    )
    assert.deepEqual(
      discardedReplyWrites('const wrap=()=>handleEditComment(id,text,task)'),
      []
    )
    console.log(
      'reply-completion: 3 planted defects caught; 3 clean controls pass'
    )
  } else {
    const root = resolve(import.meta.dir, '..')
    const paths = [
      ...new Bun.Glob('src/components/ProjectBoard/**/*.{ts,tsx}').scanSync({
        cwd: root,
      }),
    ].filter(path => !/\.stories\./.test(path))
    assert.ok(
      paths.length >= 10,
      'ProjectBoard source universe unexpectedly small'
    )
    let findings = 0
    for (const path of paths)
      for (const line of discardedReplyWrites(
        readFileSync(resolve(root, path), 'utf8')
      )) {
        console.error(`${path}:${line}: reply write completion discarded`)
        findings++
      }
    console.log(
      `reply-completion: ${findings} findings over ${paths.length} source files`
    )
    process.exitCode = findings ? 1 : 0
  }
}
