/** Execute the actual CSF contrast regressions in an isolated real browser. */
import { strict as assert } from 'node:assert'
import { browserFixture, fixtureImport } from './browser-fixture'
const fixture = await browserFixture(`
import React from ${fixtureImport('node_modules/react/index.js')}
import {createRoot} from ${fixtureImport('node_modules/react-dom/client.js')}
import {CountContrastMatrix} from ${fixtureImport('src/components/Tabs/Tabs.stories.tsx')}
import {MobileTapHintContrast} from ${fixtureImport('src/components/DataGrid/DataGrid.stories.tsx')}
const story=[CountContrastMatrix,MobileTapHintContrast][Number(new URLSearchParams(location.search).get('story')||0)]
const canvasElement=document.getElementById('root')
createRoot(canvasElement).render(React.createElement(story.render))
window.__runContrastPlay=()=>story.play({canvasElement})
`)
const cases=[{name:'12 tab counts: 3 themes x 2 appearances x 2 states',selector:'[data-tab-count]',count:12},
  {name:'3 mobile hint themes and selected-state hiding',selector:'[data-card="true"]',count:3}]
let failed=0
fixture.page.on('console', message => {
  if(message.type()==='info')console.log(message.text())
})
try {
  await fixture.page.setViewportSize({width:390,height:844})
  for(const [index,item] of cases.entries()) {
    try {
      await fixture.page.goto(`${fixture.url}?story=${index}`)
      await fixture.page.locator(item.selector).nth(item.count-1).waitFor()
      await fixture.page.evaluate('window.__runContrastPlay()')
      console.log(`PASS ${item.name}`)
    }catch(error){failed++;console.error(`FAIL ${item.name}\n${error}`)}
  }
  assert.deepEqual(fixture.errors,[],'unexpected browser exceptions')
}finally{await fixture.close()}
console.log(`${cases.length-failed}/${cases.length} contrast stories passed; declared denominator 12 badges and 3 mobile hints`)
process.exitCode=failed?1:0
