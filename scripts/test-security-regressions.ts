/** W-976: real-browser security boundary regressions. */
import { strict as assert } from 'node:assert'
import { browserFixture, fixtureImport } from './browser-fixture'

const fixture = await browserFixture(`
import React from ${fixtureImport('node_modules/react/index.js')}
import {createRoot} from ${fixtureImport('node_modules/react-dom/client.js')}
import ComplexTextEditor from ${fixtureImport('src/components/ComplexTextEditor/index.tsx')}
import DataGrid from ${fixtureImport('src/components/DataGrid/index.tsx')}
import SearchableHistory from ${fixtureImport('src/components/Field/Dropdown/SearchableHistory/index.tsx')}
import Tabs from ${fixtureImport('src/components/Tabs/index.tsx')}
import {BoardSeverityHarness} from ${fixtureImport('src/components/ProjectBoard/board/ProjectBoard.stories.tsx')}

function RichHarness() {
  const [value, setValue] = React.useState('<p>safe</p>')
  return React.createElement('section', {'data-testid':'rich-output','data-value':value},
    React.createElement(ComplexTextEditor, {editorType:'rich',label:'Rich security input',value,onChange:setValue}))
}

const query = new URLSearchParams(location.search)
const mode = query.get('mode')
let child
if (mode === 'board') {
  child = React.createElement(BoardSeverityHarness, {variant:'company',access:query.get('access') || 'read'})
} else if (mode === 'customer-board') {
  child = React.createElement(BoardSeverityHarness, {variant:'customer',access:'write'})
} else if (mode === 'grid') {
  child = React.createElement(DataGrid, {
    dataGrid:'denied-grid',
    columns:[{field:'name',headerName:'Name'}],
    rows:[{_id:'row-1',name:'classified'}],
    permissions:{access:'no-access'}
  })
} else if (mode === 'tabs') {
  child = React.createElement(Tabs, {items:[{label:'Dangerous route',trigger:'route',route:'javascript:window.__tabsXss=true'}]})
} else if (mode === 'history') {
  child = React.createElement(SearchableHistory, {
    label:'Secure history',
    storageKey:'security-test:history',
    items:[{id:'destination-1',label:'Sensitive destination',route:'/customer/secret',category:'Workspace',metadata:{token:'do-not-store'}}]
  })
} else {
  child = React.createElement(RichHarness)
}
createRoot(document.getElementById('root')).render(React.createElement(React.StrictMode, null, child))
`)

const { page } = fixture
page.setDefaultTimeout(5000)
const cases: [string, () => Promise<void>][] = [
  [
    'ProjectBoard no-access renders no board content',
    async () => {
      await page.goto(`${fixture.url}?mode=board&access=no-access`)
      assert.equal(
        await page.locator('[data-component="ProjectBoard"]').count(),
        0
      )
      assert.equal(
        await page.getByText('Fix login issue', { exact: true }).count(),
        0
      )
    },
  ],
  [
    'DataGrid no-access renders no grid content',
    async () => {
      await page.goto(`${fixture.url}?mode=grid`)
      assert.equal(await page.locator('[data-component="DataGrid"]').count(), 0)
      assert.equal(
        await page.getByText('classified', { exact: true }).count(),
        0
      )
    },
  ],
  [
    'ProjectBoard read access exposes no mutation affordances',
    async () => {
      await page.goto(`${fixture.url}?mode=board&access=read`)
      await page
        .getByRole('checkbox', {
          name: 'Select task: Fix login issue',
          exact: true,
        })
        .check()
      await page.getByRole('button', { name: 'Manage', exact: true }).click()
      await page
        .getByRole('tablist', { name: 'Task sections', exact: true })
        .waitFor()
      assert.equal(
        await page.getByRole('button', { name: 'Edit', exact: true }).count(),
        0
      )
      assert.equal(
        await page.getByRole('button', { name: 'Delete', exact: true }).count(),
        0
      )
      assert.equal(
        await page
          .getByRole('button', { name: 'Change severity', exact: true })
          .count(),
        0
      )
      assert.equal(await page.locator('[data-action="edit"]').count(), 0)
      await page.getByRole('tab', { name: /Comments/ }).click()
      assert.equal(
        await page
          .getByRole('textbox', { name: 'Add a comment for the customer' })
          .count(),
        0
      )
      assert.equal(
        await page
          .getByRole('button', { name: 'Send to Customer', exact: true })
          .count(),
        0
      )
      await page.getByRole('tab', { name: /Scheduling/ }).click()
      assert.equal(
        await page.getByRole('button', { name: /Schedule Meeting/ }).count(),
        0
      )
    },
  ],
  [
    'ProjectBoard customer variant is a fail-closed customer experience',
    async () => {
      await page.goto(`${fixture.url}?mode=customer-board`)
      await page
        .getByRole('checkbox', {
          name: 'Select task: Fix login issue',
          exact: true,
        })
        .check()
      await page.getByRole('button', { name: 'Manage', exact: true }).click()
      await page
        .getByRole('tablist', { name: 'Task sections', exact: true })
        .waitFor()
      assert.equal(
        await page
          .getByRole('tab', { name: 'Resolution', exact: true })
          .count(),
        0
      )
      assert.equal(
        await page
          .getByRole('tab', { name: 'Case History', exact: true })
          .count(),
        0
      )
      assert.equal(
        await page
          .getByText('Internal Company Notes', { exact: false })
          .count(),
        0
      )
      assert.equal(
        await page
          .getByText('Internal Customer Notes', { exact: false })
          .count(),
        0
      )

      await page.getByRole('button', { name: 'Edit', exact: true }).click()
      assert.equal(await page.getByLabel('Topics', { exact: true }).count(), 0)
      assert.equal(
        await page.getByLabel('KB Articles', { exact: true }).count(),
        0
      )

      await page.getByRole('tab', { name: /Comments/ }).click()
      assert.equal(
        await page.getByRole('button', { name: /Internal Comments/ }).count(),
        0
      )

      await page.getByRole('tab', { name: /Knowledgebase/ }).click()
      await page
        .getByRole('button', {
          name: /View article: How to troubleshoot connection issues/,
        })
        .first()
        .click()
      assert.equal(
        await page
          .getByRole('button', { name: /Link to Case|Unlink from Case/ })
          .count(),
        0
      )
    },
  ],
  [
    'rich editor sanitizes DOM before emitting caller state',
    async () => {
      await page.goto(fixture.url)
      const editor = page.getByRole('textbox', { name: 'Rich security input' })
      await editor.waitFor()
      await editor.evaluate(element => {
        element.innerHTML =
          '<img src="x" onerror="window.__richXss=true"><b>kept</b><script>window.__richScript=true</script>'
        element.dispatchEvent(
          new InputEvent('input', { bubbles: true, inputType: 'insertText' })
        )
      })
      const output =
        (await page.getByTestId('rich-output').getAttribute('data-value')) ?? ''
      assert.equal(output.includes('onerror'), false)
      assert.equal(output.includes('<script'), false)
      assert.equal(output.includes('<b>kept</b>'), true)
    },
  ],
  [
    'Tabs rejects executable route URLs',
    async () => {
      await page.goto(`${fixture.url}?mode=tabs`)
      const route = page.getByRole('tab', {
        name: 'Dangerous route',
        exact: true,
      })
      assert.equal(await route.getAttribute('href'), null)
      await route.click()
      assert.notEqual(await page.evaluate('window.__tabsXss === true'), true)
    },
  ],
  [
    'SearchableHistory persistence stores IDs only',
    async () => {
      await page.goto(`${fixture.url}?mode=history`)
      await page.getByRole('combobox', { name: 'Secure history' }).click()
      await page.getByRole('option', { name: /Sensitive destination/ }).click()
      const stored = await page.evaluate(
        "localStorage.getItem('security-test:history')"
      )
      assert.equal(stored, '["destination-1"]')
      assert.equal(stored?.includes('secret'), false)
      assert.equal(stored?.includes('token'), false)
    },
  ],
]

let failed = 0
try {
  for (const [name, run] of cases) {
    try {
      await run()
      console.log(`PASS ${name}`)
    } catch (error) {
      failed++
      console.error(`FAIL ${name}\n${error}`)
    }
  }
  assert.deepEqual(fixture.errors, [], 'unexpected browser exceptions')
} finally {
  await fixture.close()
}
console.log(
  `${cases.length - failed}/${cases.length} security browser regressions passed`
)
process.exitCode = failed ? 1 : 0
