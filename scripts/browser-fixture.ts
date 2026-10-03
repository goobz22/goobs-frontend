/** Isolated real-browser fixtures shared by component regression scripts. */
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { isAbsolute, join, relative, resolve } from 'node:path'
import { chromium, type Browser, type BrowserContext } from 'playwright'

const root = resolve(import.meta.dir, '..')
export const fixtureImport = (path: string) =>
  JSON.stringify(resolve(root, path).replaceAll('\\', '/'))

export async function browserFixture(source: string) {
  const scratch = await mkdtemp(join(tmpdir(), 'goobs-browser-fixture-'))
  let browser: Browser | undefined
  let context: BrowserContext | undefined
  let server: ReturnType<typeof Bun.serve> | undefined
  const close = async () => {
    await context?.close()
    await browser?.close()
    server?.stop(true)
    const child = relative(resolve(tmpdir()), resolve(scratch))
    if (!child || child.startsWith('..') || isAbsolute(child))
      throw new Error('Refusing cleanup outside the fixture scratch directory')
    await rm(scratch, { recursive: true })
  }
  try {
    const entry = join(scratch, 'entry.tsx')
    await writeFile(entry, `import ${fixtureImport('src/styles/global.css')}\n${source}`)
    const build = await Bun.build({
      entrypoints: [entry], outdir: scratch, target: 'browser',
      naming: 'entry.[ext]', define: { 'process.env.NODE_ENV': '"development"' },
    })
    if (!build.success) throw new AggregateError(build.logs, 'fixture build failed')
    server = Bun.serve({
      hostname: '127.0.0.1', port: 0,
      fetch(request) {
        const path = new URL(request.url).pathname
        if (path === '/entry.js' || path === '/entry.css')
          return new Response(Bun.file(join(scratch, path.slice(1))))
        return new Response(
          '<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/entry.css"></head><body><div id="root"></div><script type="module" src="/entry.js"></script></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        )
      },
    })
    browser = process.env.GOOBS_CDP_URL
      ? await chromium.connectOverCDP(process.env.GOOBS_CDP_URL)
      : await chromium.launch({ headless: true })
    context = await browser.newContext()
    const page = await context.newPage()
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    return { page, errors, url: `http://127.0.0.1:${server.port}`, close }
  } catch (error) {
    await close()
    throw error
  }
}
