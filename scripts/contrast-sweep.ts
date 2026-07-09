/**
 * contrast-sweep — render every story in storybook-static under its authored
 * globals and report (a) axe color-contrast violations and (b) render errors.
 *
 * The canvas background matters: a light-themed story on the sacred (black)
 * canvas is illegible even when the component itself is fine, so the sweep
 * renders through Storybook's real preview pipeline (iframe.html) where
 * story-level `globals.backgrounds.value` applies, exactly as published.
 *
 * Usage:
 *   bun scripts/contrast-sweep.ts [--filter <substr>] [--out <path>] [--workers N]
 * Serves storybook-static itself on an ephemeral port; launches Playwright's
 * bundled Chromium headless (its own isolated instance; never the user's
 * Chrome session).
 */
import { chromium, type Browser, type Page } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import http from 'node:http'

// RUN UNDER NODE, NOT BUN: `node scripts/contrast-sweep.ts` (Node 22.6+ strips
// types natively). Under Bun on Windows, Chromium's --remote-debugging-pipe
// handshake never completes (launched pid, 60s timeout) — Bun's extra-stdio
// pipes don't carry it. Node is the engine Playwright is battle-tested on.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const STATIC_DIR = join(ROOT, 'storybook-static')
const AXE_SOURCE = readFileSync(join(ROOT, 'node_modules/axe-core/axe.min.js'), 'utf8')
/** Step log to stderr so progress is visible even when stdout is piped/buffered. */
const step = (msg: string) => console.error(`[sweep ${new Date().toISOString().slice(11, 19)}] ${msg}`)

const args = process.argv.slice(2)
const argOf = (flag: string) => {
  const i = args.indexOf(flag)
  return i >= 0 ? args[i + 1] : undefined
}
const FILTER = argOf('--filter')
const OUT = argOf('--out') ?? join(ROOT, '.contrast-sweep.json')
const WORKERS = Number(argOf('--workers') ?? 6)

interface StoryEntry {
  id: string
  title: string
  name: string
  type: string
}

interface Violation {
  selector: string
  fg: string
  bg: string
  ratio: number | null
  required: number | null
  text: string
}

interface StoryResult {
  id: string
  title: string
  name: string
  status: 'clean' | 'contrast' | 'render-error' | 'timeout'
  violations: Violation[]
  errors: string[]
}

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.map': 'application/json',
}

function serveStatic(): Promise<{ server: http.Server; port: number }> {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0])
    const filePath = join(STATIC_DIR, urlPath === '/' ? 'index.html' : urlPath)
    try {
      const body = readFileSync(filePath)
      const ext = filePath.slice(filePath.lastIndexOf('.'))
      res.writeHead(200, {
        'content-type': MIME[ext] ?? 'application/octet-stream',
        'cache-control': 'no-store',
      })
      res.end(body)
    } catch {
      res.writeHead(404)
      res.end('not found')
    }
  })
  return new Promise(resolvePort => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      const port = typeof address === 'object' && address ? address.port : 0
      resolvePort({ server, port })
    })
  })
}

async function launchChrome(): Promise<{ browser: Browser }> {
  // Playwright's bundled Chromium — the same engine the ThothOS Playwright
  // suite runs on this machine daily. (Driving the system chrome.exe over
  // --remote-debugging-port proved unreliable here: the CDP port never opens.)
  step('launching playwright chromium (headless)…')
  const browser = await chromium.launch({ headless: true, timeout: 60_000 })
  step(`chromium up (${browser.version()})`)
  return { browser }
}

async function auditStory(page: Page, base: string, story: StoryEntry): Promise<StoryResult> {
  const errors: string[] = []
  const onPageError = (err: Error) => errors.push(String(err.message ?? err).slice(0, 400))
  const onConsole = (msg: { type(): string; text(): string }) => {
    if (msg.type() === 'error') errors.push(msg.text().slice(0, 400))
  }
  page.on('pageerror', onPageError)
  page.on('console', onConsole)
  try {
    await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=story`, {
      waitUntil: 'domcontentloaded',
      timeout: 20_000,
    })
    // Wait for the story root to have rendered children or an error state.
    await page.waitForFunction(
      () => {
        const root = document.getElementById('storybook-root')
        const errorPage = document.querySelector('.sb-show-errordisplay')
        return errorPage !== null || (root !== null && root.childElementCount > 0)
      },
      undefined,
      { timeout: 15_000 },
    )
    await page.waitForTimeout(350) // fonts/transitions settle
    const showsError = await page.evaluate(
      () => document.querySelector('.sb-show-errordisplay') !== null,
    )
    if (showsError) {
      const errText = await page.evaluate(
        () => document.querySelector('#error-message')?.textContent?.slice(0, 300) ?? 'render error',
      )
      return { id: story.id, title: story.title, name: story.name, status: 'render-error', violations: [], errors: [errText, ...errors] }
    }
    await page.evaluate(AXE_SOURCE)
    const axeResult = (await page.evaluate(async () => {
      // @ts-expect-error axe injected above
      const res = await axe.run(document.getElementById('storybook-root') ?? document.body, {
        runOnly: ['color-contrast'],
        resultTypes: ['violations'],
      })
      return res.violations.flatMap(
        (v: { nodes: Array<{ target: string[]; any: Array<{ data: Record<string, unknown> }>; html: string }> }) =>
          v.nodes.map(n => {
            const data = (n.any[0]?.data ?? {}) as Record<string, unknown>
            return {
              selector: n.target.join(' '),
              fg: String(data.fgColor ?? ''),
              bg: String(data.bgColor ?? ''),
              ratio: typeof data.contrastRatio === 'number' ? data.contrastRatio : null,
              required: typeof data.expectedContrastRatio === 'string'
                ? parseFloat(String(data.expectedContrastRatio))
                : null,
              text: n.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80),
            }
          }),
      )
    })) as Violation[]
    const status = axeResult.length > 0 ? 'contrast' : errors.length > 0 ? 'render-error' : 'clean'
    return { id: story.id, title: story.title, name: story.name, status, violations: axeResult, errors }
  } catch (err) {
    return {
      id: story.id,
      title: story.title,
      name: story.name,
      status: 'timeout',
      violations: [],
      errors: [String(err).slice(0, 300), ...errors],
    }
  } finally {
    page.off('pageerror', onPageError)
    page.off('console', onConsole)
  }
}

async function main() {
  const index = JSON.parse(readFileSync(join(STATIC_DIR, 'index.json'), 'utf8'))
  let stories = (Object.values(index.entries) as StoryEntry[]).filter(e => e.type === 'story')
  if (FILTER) stories = stories.filter(s => s.id.includes(FILTER) || s.title.includes(FILTER))
  step(`sweeping ${stories.length} stories with ${WORKERS} workers…`)

  const { server, port } = await serveStatic()
  step(`static server on :${port}`)
  const base = `http://127.0.0.1:${port}`
  const { browser } = await launchChrome()
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  step('context ready, starting workers')

  const results: StoryResult[] = []
  let cursor = 0
  let done = 0
  const worker = async (workerId: number) => {
    let page = await context.newPage()
    for (;;) {
      const i = cursor++
      if (i >= stories.length) break
      const story = stories[i]
      // Hard watchdog: nothing inside auditStory may hang the worker (evaluate
      // calls like axe.run have no protocol timeout of their own).
      let r: StoryResult
      try {
        r = await Promise.race([
          auditStory(page, base, story),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('watchdog: story exceeded 45s')), 45_000),
          ),
        ])
      } catch (err) {
        r = {
          id: story.id,
          title: story.title,
          name: story.name,
          status: 'timeout',
          violations: [],
          errors: [String(err).slice(0, 200)],
        }
        // The page may be wedged mid-evaluate — replace it.
        await page.close().catch(() => {})
        page = await context.newPage()
        step(`worker ${workerId}: page recycled after watchdog on ${story.id}`)
      }
      results.push(r)
      done++
      if (done % 25 === 0 || r.status !== 'clean') {
        const tag =
          r.status === 'clean' ? `progress ${done}/${stories.length}` : `${r.status.toUpperCase()} ${r.id}`
        step(tag)
      }
    }
    await page.close().catch(() => {})
  }
  await Promise.all(Array.from({ length: WORKERS }, (_, workerId) => worker(workerId)))

  await browser.close().catch(() => {})
  server.close()

  results.sort((a, b) => a.id.localeCompare(b.id))
  const bad = results.filter(r => r.status !== 'clean')
  const summary = {
    sweptAt: null as null, // stamped by the caller if needed
    total: results.length,
    clean: results.length - bad.length,
    contrast: results.filter(r => r.status === 'contrast').length,
    renderErrors: results.filter(r => r.status === 'render-error').length,
    timeouts: results.filter(r => r.status === 'timeout').length,
    failures: bad,
  }
  writeFileSync(OUT, JSON.stringify(summary, null, 2))
  console.log(
    `\nDONE: ${summary.clean}/${summary.total} clean | contrast: ${summary.contrast} | render-errors: ${summary.renderErrors} | timeouts: ${summary.timeouts}`,
  )
  console.log(`report: ${OUT}`)
  const byComponent: Record<string, number> = {}
  for (const f of bad) byComponent[f.title] = (byComponent[f.title] ?? 0) + 1
  for (const [t, n] of Object.entries(byComponent).sort((a, b) => b[1] - a[1]))
    console.log(`  ${String(n).padStart(3)}  ${t}`)
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
