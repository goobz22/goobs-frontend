/** Scope: the Form engine getter and its two collection bindings. */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { strict as assert } from 'node:assert'
import ts from 'typescript'

export function findBorrowedState(source: string) {
  const file = ts.createSourceFile(
    'form.ts',
    source,
    ts.ScriptTarget.Latest,
    true
  )
  const findings: { line: number; message: string }[] = []
  const borrowed = new Set<string>()
  const add = (node: ts.Node, message: string) =>
    findings.push({
      line: file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1,
      message,
    })
  const visit = (node: ts.Node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer
    ) {
      if (
        node.name.text === 'getValue' &&
        /\bget\(values\s*,/.test(node.initializer.getText(file))
      ) {
        add(
          node,
          'getValue closes over a render snapshot; successive collection mutations lose writes'
        )
      }
      if (
        ts.isCallExpression(node.initializer) &&
        node.initializer.expression.getText(file) === 'readArray'
      ) {
        borrowed.add(node.name.text)
      }
    }
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      borrowed.has(node.expression.expression.getText(file)) &&
      ['splice', 'sort', 'reverse', 'push', 'pop', 'shift', 'unshift'].includes(
        node.expression.name.text
      )
    ) {
      add(node, 'copy a borrowed form array before mutating it')
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  return findings
}

if (import.meta.main) {
  if (process.argv.includes('--selftest')) {
    assert.equal(
      findBorrowedState(
        'const getValue = useCallback(name => get(values, name), [values])'
      ).length,
      1
    )
    assert.equal(
      findBorrowedState('const next = readArray(); next.splice(0, 1)').length,
      1
    )
    assert.equal(
      findBorrowedState(
        'const getValue = useCallback(name => get(current.current, name), []); const next = [...readArray()]; next.splice(0, 1)'
      ).length,
      0
    )
    console.log(
      'lint-form-state selftest: 2 planted defects detected; clean input passes'
    )
  } else {
    const paths = [
      'src/components/Form/engine/zod.ts',
      'src/components/Form/useFieldArray.ts',
      'src/components/Form/useFieldValues.ts',
    ]
    let count = 0
    for (const path of paths) {
      for (const finding of findBorrowedState(
        readFileSync(resolve(import.meta.dir, '..', path), 'utf8')
      )) {
        console.error(`${path}:${finding.line}: ${finding.message}`)
        count++
      }
    }
    console.log(
      `lint-form-state: ${count} findings across ${paths.length} files`
    )
    process.exitCode = count ? 1 : 0
  }
}
