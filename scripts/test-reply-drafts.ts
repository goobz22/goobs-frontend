/** Actual React/browser draft controls. Transport is controlled; no app server or database. */
import { strict as assert } from 'node:assert'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright'

const root = resolve(import.meta.dir, '..')
const scratch = await mkdtemp(join(tmpdir(), 'goobs-reply-drafts-'))
const modulePath = (path: string) =>
  JSON.stringify(resolve(root, path).replaceAll('\\', '/'))
const entry = join(scratch, 'entry.tsx')
await writeFile(
  entry,
  [
    `import React from ${modulePath('node_modules/react/index.js')}`,
    `import {createRoot} from ${modulePath('node_modules/react-dom/client.js')}`,
    `import {ReplyDraftHarness} from ${modulePath('src/components/ProjectBoard/ReplyDraftRegression.stories.tsx')}`,
    `createRoot(document.getElementById('root')).render(React.createElement(ReplyDraftHarness,{board:location.search.includes('board')}))`,
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
  throw new AggregateError(build.logs, 'Reply regression build failed')
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
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
const page = await context.newPage()
page.setDefaultTimeout(5000)
const calls = async () =>
  JSON.parse(await page.getByTestId('write-calls').innerText())
const composer = () => page.locator('textarea').first()
const send = () =>
  page.getByRole('button', { name: 'Send Comment', exact: true })
const editor = () =>
  page.getByRole('textbox', { name: 'Edit comment', exact: true })
const openEdit = () => page.locator('button[data-action="edit"]').last().click()
let pass = 0,
  fail = 0
const outcomes: {
  surface: string
  name: string
  pass: boolean
  error?: string
}[] = []
const cases: [string, () => Promise<void>][] = [
  [
    'pending and rejected new reply is retained and retry succeeds',
    async () => {
      await composer().fill('Exact retry draft')
      await send().click()
      assert.equal(await composer().inputValue(), 'Exact retry draft')
      await page.getByRole('button', { name: 'Reject write' }).click()
      assert.equal(await composer().inputValue(), 'Exact retry draft')
      assert.equal(await page.getByRole('alert').innerText(), 'Save rejected')
      await send().click()
      await page.getByRole('button', { name: 'Resolve write' }).click()
      await page.getByText('Exact retry draft', { exact: true }).waitFor()
      assert.equal(await composer().inputValue(), '')
      assert.deepEqual(await calls(), [
        ['Exact retry draft', 'ticket-1'],
        ['Exact retry draft', 'ticket-1'],
      ])
      assert.equal(
        await page.getByText('Exact retry draft', { exact: true }).count(),
        1
      )
    },
  ],
  [
    'pending own edit retains text after rejection and leaves saved original intact',
    async () => {
      await openEdit()
      await editor().fill('Unsaved edit')
      await page.getByRole('button', { name: 'Save', exact: true }).click()
      assert.equal(await editor().inputValue(), 'Unsaved edit')
      await page.getByRole('button', { name: 'Reject write' }).click()
      assert.equal(await editor().inputValue(), 'Unsaved edit')
      await page.getByRole('button', { name: 'Cancel', exact: true }).click()
      assert.equal(
        await page.getByText('Saved original reply', { exact: true }).count(),
        1
      )
      assert.deepEqual(await calls(), [['comment-1', 'Unsaved edit']])
    },
  ],
  [
    'AbortError preserves new reply',
    async () => {
      await composer().fill('Interrupted reply')
      await send().click()
      await page.getByRole('button', { name: 'Abort write' }).click()
      assert.equal(await composer().inputValue(), 'Interrupted reply')
      assert.deepEqual(await calls(), [['Interrupted reply', 'ticket-1']])
    },
  ],
  [
    'resolved save clears submitted text and persists one comment',
    async () => {
      await composer().fill('Successful reply')
      await send().click()
      await page.getByRole('button', { name: 'Resolve write' }).click()
      await page.getByText('Successful reply', { exact: true }).waitFor()
      assert.equal(await composer().inputValue(), '')
      assert.equal(
        await page.getByText('Successful reply', { exact: true }).count(),
        1
      )
      assert.deepEqual(await calls(), [['Successful reply', 'ticket-1']])
    },
  ],
  [
    'old success cannot erase a newer draft',
    async () => {
      await composer().fill('First reply')
      await send().click()
      await composer().fill('Newer draft')
      await page.getByRole('button', { name: 'Resolve write' }).click()
      assert.equal(await composer().inputValue(), 'Newer draft')
      assert.deepEqual(await calls(), [['First reply', 'ticket-1']])
    },
  ],
  [
    'same-turn duplicate click writes once',
    async () => {
      await composer().fill('One write')
      await send().evaluate(button => {
        ;(button as HTMLButtonElement).click()
        ;(button as HTMLButtonElement).click()
      })
      assert.deepEqual(await calls(), [['One write', 'ticket-1']])
      await page.getByRole('button', { name: 'Resolve write' }).click()
    },
  ],
  [
    'synchronous writer still clears and saves once',
    async () => {
      await page.getByRole('button', { name: 'Use synchronous writer' }).click()
      await composer().fill('Sync reply')
      await send().click()
      // Board receives refreshed comments through its column synchronization effect.
      await page.getByText('Sync reply', { exact: true }).waitFor()
      assert.equal(await composer().inputValue(), '')
      assert.deepEqual(await calls(), [['Sync reply', 'ticket-1']])
      assert.equal(
        await page.getByText('Sync reply', { exact: true }).count(),
        1
      )
    },
  ],
  [
    'Cancel intentionally discards an unsent edit',
    async () => {
      await openEdit()
      await editor().fill('Abandoned')
      await page.getByRole('button', { name: 'Cancel', exact: true }).click()
      assert.deepEqual(await calls(), [])
      await openEdit()
      assert.equal(await editor().inputValue(), 'Saved original reply')
    },
  ],
  [
    'successful edit closes and displays saved text',
    async () => {
      await openEdit()
      await editor().fill('Saved edit')
      await page.getByRole('button', { name: 'Save', exact: true }).click()
      await page.getByRole('button', { name: 'Resolve write' }).click()
      await page.getByText('Saved edit', { exact: true }).waitFor()
      assert.equal(await editor().count(), 0)
      assert.deepEqual(await calls(), [['comment-1', 'Saved edit']])
    },
  ],
  [
    'aborted own edit retains draft and retries successfully',
    async () => {
      await openEdit()
      await editor().fill('Interrupted edit')
      await page.getByRole('button', { name: 'Save', exact: true }).click()
      await page.getByRole('button', { name: 'Abort write' }).click()
      assert.equal(await editor().inputValue(), 'Interrupted edit')
      await page.getByRole('button', { name: 'Save', exact: true }).click()
      await page.getByRole('button', { name: 'Resolve write' }).click()
      await page.getByText('Interrupted edit', { exact: true }).waitFor()
      assert.equal(await editor().count(), 0)
      assert.deepEqual(await calls(), [
        ['comment-1', 'Interrupted edit'],
        ['comment-1', 'Interrupted edit'],
      ])
    },
  ],
  [
    'old edit success cannot discard a newer edit',
    async () => {
      await openEdit()
      await editor().fill('Submitted edit')
      await page.getByRole('button', { name: 'Save', exact: true }).click()
      await editor().fill('Newer unsaved edit')
      await page.getByRole('button', { name: 'Resolve write' }).click()
      assert.equal(await editor().inputValue(), 'Newer unsaved edit')
      assert.deepEqual(await calls(), [['comment-1', 'Submitted edit']])
    },
  ],
  [
    'cancel and reopen protects new edit from old success',
    async () => {
      await openEdit()
      await editor().fill('Submitted edit')
      await page.getByRole('button', { name: 'Save', exact: true }).click()
      await page.getByRole('button', { name: 'Cancel', exact: true }).click()
      await openEdit()
      await editor().fill('Reopened draft')
      await page.getByRole('button', { name: 'Resolve write' }).click()
      assert.equal(await editor().inputValue(), 'Reopened draft')
      assert.deepEqual(await calls(), [['comment-1', 'Submitted edit']])
    },
  ],
  [
    'same-turn duplicate edit click writes once',
    async () => {
      await openEdit()
      await editor().fill('One edit')
      await page
        .getByRole('button', { name: 'Save', exact: true })
        .evaluate(button => {
          ;(button as HTMLButtonElement).click()
          ;(button as HTMLButtonElement).click()
        })
      assert.deepEqual(await calls(), [['comment-1', 'One edit']])
      await page.getByRole('button', { name: 'Resolve write' }).click()
    },
  ],
]
try {
  for (const surface of ['detail', 'board'])
    for (const [name, run] of cases) {
      try {
        await page.goto(server.url.href + '?' + surface)
        if (surface === 'board') {
          await page
            .getByRole('checkbox', {
              name: 'Select task: Reply regression ticket',
            })
            .check()
          await page
            .getByRole('button', { name: 'Manage', exact: true })
            .click()
        }
        await page.getByRole('tab', { name: 'Comments', exact: true }).click()
        await run()
        pass++
        outcomes.push({ surface, name, pass: true })
        console.log('PASS ' + surface + ': ' + name)
      } catch (error) {
        fail++
        outcomes.push({ surface, name, pass: false, error: String(error) })
        console.error('FAIL ' + surface + ': ' + name + '\n' + error)
      }
    }
} finally {
  await context.close()
  await browser.close()
  server.stop(true)
}
console.log(
  JSON.stringify({ pass, fail, cases: outcomes.length, scratch, outcomes })
)
process.exitCode = fail ? 1 : 0
