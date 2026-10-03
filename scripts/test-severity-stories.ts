/** Execute the shipped severity CSF interaction specifications in a real browser. */
import { strict as assert } from 'node:assert'
import { browserFixture, fixtureImport } from './browser-fixture'

const fixture = await browserFixture(`
import React from ${fixtureImport('node_modules/react/index.js')}
import {createRoot} from ${fixtureImport('node_modules/react-dom/client.js')}
import * as inline from ${fixtureImport('src/components/ProjectBoard/InlineForms.stories.tsx')}
import * as board from ${fixtureImport('src/components/ProjectBoard/board/ProjectBoard.stories.tsx')}
const stories = [inline.StaffSeverityJustification, inline.CustomerSeverityJustification,
  board.CompanySeverityJustification, board.AdministratorSeverityJustification,
  board.CustomerSeverityJustification, board.ReadOnlySeverity]
const story = stories[Number(new URLSearchParams(location.search).get('story') || 0)]
const canvasElement = document.getElementById('root')
createRoot(canvasElement).render(React.createElement(React.StrictMode, null, React.createElement(story.render)))
window.__runSeverityPlay = () => story.play({canvasElement})
`)
const names = [
  'staff',
  'customer',
  'company board',
  'administrator board',
  'customer board',
  'read-only board',
]
let failed = 0
try {
  for (const [index, name] of names.entries()) {
    try {
      await fixture.page.goto(`${fixture.url}?story=${index}`)
      await fixture.page
        .getByTestId(index < 2 ? 'severity-harness' : 'board-severity-harness')
        .waitFor()
      await fixture.page.evaluate('window.__runSeverityPlay()')
      console.log(`PASS severity Storybook play: ${name}`)
    } catch (error) {
      failed++
      console.error(`FAIL severity Storybook play: ${name}\n${error}`)
    }
  }
  assert.deepEqual(fixture.errors, [], 'unexpected browser exceptions')
} finally {
  await fixture.close()
}
console.log(
  `${names.length - failed}/${names.length} severity Storybook interactions passed`
)
process.exitCode = failed ? 1 : 0
