// design-sync: make the reference storybook render with the SAME real fonts the
// design bundle ships (cfg.extraFonts), so the compare oracle judges typography
// fairly. goobs ships no fonts (the consuming app provides them); without this
// the reference falls back to system fonts while the bundle shows Inter/Cinzel/
// etc. → false mismatches. Re-run after every `storybook build` of the reference.
//
//   node .design-sync/inject-reference-fonts.mjs
//
// Idempotent: replaces the marked <style> block if already present.
import { readFileSync, writeFileSync, cpSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1')
const FONTS_SRC = join(ROOT, 'fonts')
const SB = join(ROOT, '.design-sync', 'sb-reference')
const IFRAME = join(SB, 'iframe.html')
const DEST = join(SB, 'goobs-fonts')
const MARK_OPEN = '<!-- ds-sync:reference-fonts -->'
const MARK_CLOSE = '<!-- /ds-sync:reference-fonts -->'

if (!existsSync(IFRAME)) {
  console.error(`[skip] no reference iframe.html at ${IFRAME} — build the reference first`)
  process.exit(0)
}
if (!existsSync(join(FONTS_SRC, 'goobs-fonts.css'))) {
  console.error(`[skip] no ${FONTS_SRC}/goobs-fonts.css — nothing to inject`)
  process.exit(0)
}

// copy woff2 next to where iframe.html is served (sb-reference/goobs-fonts/)
cpSync(FONTS_SRC, DEST, { recursive: true })
const n = readdirSync(DEST).filter((f) => f.endsWith('.woff2')).length

// reference CSS: same @font-face but url() pointed at ./goobs-fonts/<file>
const css = readFileSync(join(FONTS_SRC, 'goobs-fonts.css'), 'utf8').replace(/url\(\.\//g, 'url(./goobs-fonts/')
const styleBlock = `${MARK_OPEN}\n<style>\n${css}</style>\n${MARK_CLOSE}`

let html = readFileSync(IFRAME, 'utf8')
const re = new RegExp(`${MARK_OPEN}[\\s\\S]*?${MARK_CLOSE}`)
if (re.test(html)) {
  html = html.replace(re, styleBlock)
} else {
  html = html.replace(/<head>/i, `<head>\n${styleBlock}`)
}
writeFileSync(IFRAME, html)
console.log(`injected ${n} woff2 + @font-face into reference iframe.html (${DEST})`)
