/** W-977: real ticket controls, real promises, both viewer roles. */
import { strict as assert } from 'node:assert'
import { browserFixture, fixtureImport } from './browser-fixture'

const fixture = await browserFixture(`
import React from ${fixtureImport('node_modules/react/index.js')}
import {createRoot} from ${fixtureImport('node_modules/react-dom/client.js')}
import {SeverityHarness} from ${fixtureImport('src/components/ProjectBoard/InlineForms.stories.tsx')}
import {BoardSeverityHarness} from ${fixtureImport('src/components/ProjectBoard/board/ProjectBoard.stories.tsx')}
const query = new URLSearchParams(location.search)
createRoot(document.getElementById('root')).render(React.createElement(React.StrictMode, null,
  query.has('board')
    ? React.createElement(BoardSeverityHarness, {variant: query.get('board'), access: query.get('access') || 'write'})
    : React.createElement(SeverityHarness, {role: query.get('role') || 'staff', mode: query.get('mode') || 'success', legacy: query.has('legacy'), onReady: controls => { window.__severityHarness = controls }})))
`)
const { page } = fixture
page.setDefaultTimeout(3000)
const reason = 'Business impact has decreased after restoring service.'
const requests = async () => JSON.parse((await page.getByTestId('severity-harness').getAttribute('data-requests'))!)
const open = async (role: string, mode = 'success', legacy = false) => {
  await page.goto(`${fixture.url}?role=${role}&mode=${mode}${legacy ? '&legacy=1' : ''}`)
  await page.getByRole('button', { name: 'Change severity', exact: true }).click()
}
const choose = async (label: string) => {
  await page.getByRole('combobox', { name: /^Severity/ }).click()
  await page.getByRole('option', { name: label, exact: true }).click()
}
const save = () => page.getByRole('button', { name: 'Save severity', exact: true }).click()
const justification = () => page.getByRole('textbox', { name: /Justification/ })
const cases: [string, () => Promise<void>][] = []
for (const variant of ['administrator', 'company', 'customer']) {
  cases.push([
    `${variant} read-only board withholds severity editing`,
    async () => {
      await page.goto(`${fixture.url}?board=${variant}&access=read`)
      await page.getByRole('checkbox', { name: 'Select task: Fix login issue', exact: true }).check()
      await page.getByRole('button', { name: 'Manage', exact: true }).click()
      await page.getByRole('tablist', { name: 'Task sections', exact: true }).waitFor()
      assert.equal(await page.getByRole('button', { name: 'Change severity', exact: true }).count(), 0)
      assert.deepEqual(JSON.parse((await page.getByTestId('board-severity-harness').getAttribute('data-requests'))!), [])
    },
  ])
}
cases.push([
  'general edit never writes severity through onEdit',
  async () => {
    await page.goto(fixture.url)
    await page.getByRole('button', { name: 'Edit', exact: true }).click()
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    const edit = JSON.parse((await page.getByTestId('severity-harness').getAttribute('data-general-edit'))!)
    assert.ok(edit, 'general edit callback was called')
    assert.equal(Object.hasOwn(edit, 'severityId'), false)
  },
])
for (const role of ['staff', 'customer']) {
  cases.push([
    `${role}: raising and lowering both require a trimmed justification`,
    async () => {
      for (const [label, id] of [['Critical', 's1'], ['Low', 's4']]) {
        await open(role)
        await choose(label!)
        for (const invalid of ['', '   ', 'Too short', 'x'.repeat(2001)]) {
          await justification().fill(invalid)
          await save()
          assert.deepEqual(await requests(), [])
          assert.equal(await justification().getAttribute('aria-invalid'), 'true')
        }
        await justification().fill(`  ${reason}  `)
        await save()
        await page.getByRole('button', { name: 'Change severity', exact: true }).waitFor()
        assert.deepEqual(await requests(), [{ taskId: 'task1abc', severityId: id, reason }])
        await page.getByRole('button', { name: 'Change severity', exact: true }).click()
        assert.equal(await justification().inputValue(), '')
      }
    },
  ])
  cases.push([
    `${role}: unchanged severity is a no-op without a justification`,
    async () => {
      await open(role)
      await choose('High')
      await save()
      assert.deepEqual(await requests(), [])
      assert.equal(await page.locator('[aria-invalid="true"]').count(), 0)
    },
  ])
  cases.push([
    `${role}: pending saves block duplicates and rejected saves retain the draft`,
    async () => {
      await open(role, 'pending')
      await choose('Low')
      await justification().fill(reason)
      await page.evaluate('window.__severityHarness.refreshOptions()')
      assert.equal(await justification().inputValue(), reason)
      await page.getByRole('button', { name: 'Save severity', exact: true }).evaluate(button => {
        ;(button as HTMLButtonElement).click()
        ;(button as HTMLButtonElement).click()
      })
      assert.equal((await requests()).length, 1)
      assert.equal(await page.getByRole('button', { name: 'Saving severity…' }).isDisabled(), true)
      assert.equal(await justification().isDisabled(), true)
      await page.evaluate('window.__severityHarness.rejectSave()')
      await page.getByText('Severity update refused', { exact: true }).waitFor()
      assert.equal(await justification().inputValue(), reason)
      assert.equal(await page.getByRole('combobox', { name: /^Severity/ }).textContent(), 'Low')
      await save()
      assert.equal((await requests()).length, 2)
      await page.evaluate('window.__severityHarness.completeSave()')
      await page.getByRole('button', { name: 'Change severity', exact: true }).waitFor()
    },
  ])
}
cases.push([
  'customer compatibility callback uses the shared setter',
  async () => {
    await open('customer', 'success', true)
    await choose('Low')
    await justification().fill(reason)
    await save()
    await page.getByRole('button', { name: 'Change severity', exact: true }).waitFor()
    assert.deepEqual(await requests(), [{ taskId: 'task1abc', severityId: 's4', reason }])
  },
])
let failed = 0
try {
  for (const [name, run] of cases) {
    try { await run(); console.log(`PASS ${name}`) }
    catch (error) { failed++; console.error(`FAIL ${name}\n${error}`) }
  }
  assert.deepEqual(fixture.errors, [], 'unexpected browser exceptions')
} finally { await fixture.close() }
console.log(`${cases.length - failed}/${cases.length} severity browser regressions passed`)
process.exitCode = failed ? 1 : 0
