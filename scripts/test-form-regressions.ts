/** Real React + DOM regressions. Set GOOBS_CDP_URL to reuse an isolated browser. */
import { strict as assert } from 'node:assert'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import { chromium } from 'playwright'

const root = resolve(import.meta.dir, '..')
const scratch = await mkdtemp(join(tmpdir(), 'goobs-form-regressions-'))
const modulePath = (path: string) =>
  JSON.stringify(resolve(root, path).replaceAll('\\', '/'))
const entry = join(scratch, 'entry.tsx')
await writeFile(
  entry,
  [
    `import React from ${modulePath('node_modules/react/index.js')}`,
    `import {createRoot} from ${modulePath('node_modules/react-dom/client.js')}`,
    `import {AuditHarness} from ${modulePath('src/components/Form/FormRegression.stories.tsx')}`,
    `import ComplexEditor from ${modulePath('src/components/ComplexTextEditor/index.tsx')}`,
    `createRoot(document.getElementById('root')).render(React.createElement(React.Fragment, null, React.createElement(AuditHarness),
    React.createElement('section', {id:'editor-audit'}, React.createElement(ComplexEditor, {editorType:'complex',initialMode:'simple',initialValue:'A & B < C',label:'Mode round trip'})),
    React.createElement('section', {id:'sanitizer-audit'}, React.createElement(ComplexEditor, {editorType:'rich',label:'HTML audit',initialValue:'<p style="text-align:center"><b>Safe</b> <a href="java&#x73;cript:window.__auditXss=true">encoded link</a></p>'}))))`,
  ].join('\n')
)
const build = await Bun.build({
  entrypoints: [entry],
  outdir: scratch,
  target: 'browser',
  naming: 'entry.[ext]',
  define: { 'process.env.NODE_ENV': '"development"' },
})
if (!build.success)
  throw new AggregateError(build.logs, 'regression fixture build failed')
const server = Bun.serve({
  hostname: '127.0.0.1',
  port: 0,
  fetch(request) {
    const path = new URL(request.url).pathname
    if (path === '/entry.js' || path === '/entry.css')
      return new Response(Bun.file(join(scratch, path.slice(1))))
    return new Response(
      '<!doctype html><html><head><link rel="stylesheet" href="/entry.css"></head><body><div id="root"></div><script type="module" src="/entry.js"></script></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    )
  },
})
const browser = process.env.GOOBS_CDP_URL
  ? await chromium.connectOverCDP(process.env.GOOBS_CDP_URL)
  : await chromium.launch({ headless: true })
const context = await browser.newContext()
const page = await context.newPage()
const pageErrors: string[] = []
page.on('pageerror', error => pageErrors.push(error.message))
let failures = 0
const cases: [string, () => Promise<void>][] = [
  [
    'HTML URL entities are decoded before sanitizing in the browser',
    async () => {
      const rich = page.locator('#sanitizer-audit [contenteditable]')
      const link = rich.getByText('encoded link')
      assert.equal(await link.getAttribute('href'), null)
      await link.evaluate(element => (element as HTMLAnchorElement).click())
      assert.equal(await page.evaluate('window.__auditXss === true'), false)
      assert.equal(await rich.locator('b').innerText(), 'Safe')
      assert.equal(
        await rich
          .locator('p')
          .evaluate(element => (element as HTMLElement).style.textAlign),
        'center'
      )
    },
  ],
  [
    'switching editor modes preserves the entered text',
    async () => {
      const editor = page.locator('#editor-audit')
      await editor
        .getByRole('button', { name: 'Rich Text', exact: true })
        .click()
      assert.equal(
        await editor.locator('[contenteditable]').innerText(),
        'A & B < C'
      )
      await editor.getByRole('button', { name: 'Simple', exact: true }).click()
      assert.equal(await editor.getByRole('textbox').inputValue(), 'A & B < C')
    },
  ],
  [
    'Zod transforms, coercion and defaults reach onSubmit',
    async () => {
      await page.getByRole('button', { name: 'Submit parsed values' }).click()
      await page.waitForFunction(
        () =>
          document.querySelector('[data-testid="submitted"]')?.textContent !==
          'null'
      )
      assert.deepEqual(
        JSON.parse(await page.getByTestId('submitted').innerText()),
        { name: 'Alice', quantity: 12, category: 'general' }
      )
    },
  ],
  [
    'untouched nested object and array errors appear on submit',
    async () => {
      await page.getByRole('button', { name: 'Validate nested fields' }).click()
      assert.equal(
        await page.getByText('Street required', { exact: true }).count(),
        1
      )
      assert.equal(
        await page.getByText('Task required', { exact: true }).count(),
        1
      )
      assert.equal(
        await page
          .getByRole('textbox', { name: 'Street' })
          .getAttribute('aria-invalid'),
        'true'
      )
    },
  ],
  [
    'two collection writes in one event retain both writes',
    async () => {
      await page.getByRole('button', { name: 'Batch updates' }).click()
      assert.deepEqual(
        JSON.parse(await page.getByTestId('collection').innerText()),
        {
          tasks: [
            { label: 'A' },
            { label: 'B' },
            { label: 'C' },
            { label: 'D' },
          ],
          fields: { first: 'one', second: 'two' },
        }
      )
    },
  ],
  [
    'reordering preserves caller data and prior state snapshots',
    async () => {
      await page.getByRole('button', { name: 'Move first item' }).click()
      const original = { tasks: [{ label: 'A' }, { label: 'B' }], fields: {} }
      assert.deepEqual(
        JSON.parse(await page.getByTestId('original').innerText()),
        original
      )
      assert.deepEqual(
        JSON.parse(await page.getByTestId('snapshot').innerText()),
        original
      )
      assert.deepEqual(
        JSON.parse(await page.getByTestId('collection').innerText()),
        { ...original, tasks: [{ label: 'B' }, { label: 'A' }] }
      )
    },
  ],
  [
    'a pending save is single-flight and unlocks on completion',
    async () => {
      const save = page.getByRole('button', { name: 'Start save' })
      await save.evaluate(element => {
        ;(element as HTMLButtonElement).click()
        ;(element as HTMLButtonElement).click()
      })
      await page.waitForFunction(
        () =>
          document.querySelector('[data-testid="pending"]')?.textContent ===
          'true'
      )
      assert.equal(await page.getByTestId('calls').innerText(), '1')
      await save.click()
      assert.equal(await page.getByTestId('calls').innerText(), '1')
      await page.getByRole('button', { name: 'Complete save' }).click()
      await page.waitForFunction(
        () =>
          document.querySelector('[data-testid="pending"]')?.textContent ===
          'false'
      )
      await save.click()
      assert.equal(await page.getByTestId('calls').innerText(), '2')
      await page.getByRole('button', { name: 'Complete save' }).click()
    },
  ],
]
try {
  for (const [name, run] of cases) {
    await page.goto(`http://127.0.0.1:${server.port}`)
    await page.getByRole('button', { name: 'Submit parsed values' }).waitFor()
    try {
      await run()
      console.log(`PASS ${name}`)
    } catch (error) {
      failures++
      console.error(`FAIL ${name}\n${error}`)
    }
  }
  if (pageErrors.length) {
    failures++
    console.error('Browser errors:', pageErrors)
  }
} finally {
  await context.close()
  await browser.close()
  server.stop(true)
  // Only this invocation's mkdtemp output is removed, after the browser closes.
  assert.equal(
    resolve(scratch).startsWith(
      resolve(tmpdir()) + (process.platform === 'win32' ? '\\' : '/')
    ),
    true
  )
  await rm(scratch, { recursive: true })
}
console.log(
  `${cases.length - failures}/${cases.length} form browser regressions passed`
)
process.exitCode = failures ? 1 : 0
