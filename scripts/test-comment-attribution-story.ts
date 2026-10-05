/**
 * Execute the shipped comment-attribution CSF interaction specification in a real browser (OWNER_QUEUE 2.206, W-1276).
 *
 * INVARIANT: a comment that someone rewrote carries an inline "edited by <editor>" in its header — the editor derived from the
 * last non-original revision, or the explicit `lastEditedBy` — and a comment nobody edited carries none. This runs the story's own
 * `play` function, so the Storybook baseline and this script assert the SAME thing.
 */
import { strict as assert } from 'node:assert'
import { browserFixture, fixtureImport } from './browser-fixture'

const fixture = await browserFixture(`
import React from ${fixtureImport('node_modules/react/index.js')}
import {createRoot} from ${fixtureImport('node_modules/react-dom/client.js')}
import * as inline from ${fixtureImport('src/components/ProjectBoard/InlineForms.stories.tsx')}
const story = inline.ShowTaskCommentEditedBy
const canvasElement = document.getElementById('root')
createRoot(canvasElement).render(React.createElement(React.StrictMode, null, React.createElement(story.render)))
window.__runCommentAttributionPlay = () => story.play({canvasElement})
`)
let failed = 0
try {
  try {
    await fixture.page.goto(fixture.url)
    await fixture.page.getByRole('tab', { name: 'Comments' }).waitFor()
    await fixture.page.evaluate('window.__runCommentAttributionPlay()')
    console.log('PASS comment attribution Storybook play: inline "edited by"')
  } catch (error) {
    failed++
    console.error(`FAIL comment attribution Storybook play\n${error}`)
  }
  assert.deepEqual(fixture.errors, [], 'unexpected browser exceptions')
} finally {
  await fixture.close()
}
console.log(`${1 - failed}/1 comment attribution Storybook interaction passed`)
process.exitCode = failed ? 1 : 0
