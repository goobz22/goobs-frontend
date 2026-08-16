/**
 * @fileoverview Lazy, per-grammar highlight.js loader for CodeCopy.
 *
 * WHY THIS FILE EXISTS — a measured bundle defect, not a style preference.
 * `import hljs from 'highlight.js'` pulls the ALL-LANGUAGES entry point, whose
 * module body calls `registerLanguage` 192 times at module-evaluation time. In
 * a bundled library that call is not tree-shakeable (it is a side effect on a
 * shared singleton), so the grammars landed in the main chunk and every
 * consumer paid roughly 872 KB on every route that touched the barrel —
 * including routes with no code block anywhere, which is the common case. It
 * reached ThothOS through the root error components importing the barrel; that
 * app renders zero CodeCopy instances and still paid the full mass.
 *
 * THE SHAPE OF THE FIX. Nothing highlight.js-related is referenced from module
 * scope any more. The first render of a code block dynamically imports
 * `highlight.js/lib/core` (a few KB, no grammars) and exactly one grammar
 * module, so a page with a TypeScript snippet loads core + typescript instead
 * of 192 languages.
 *
 * CAPABILITY IS NOT REDUCED (this is the part that makes it safe). The public
 * `language` prop is still an open string and every language highlight.js
 * supports still works: a language outside the per-grammar table below falls
 * back to the full `highlight.js` entry point, dynamically imported. A missing
 * entry therefore costs BYTES on that one page, never correctness, and the
 * component never silently degrades to unhighlighted text. That asymmetry is
 * deliberate — it is what lets the table stay a curated common set rather than
 * a 192-entry mirror that would rot against upstream.
 */
import type { HLJSApi, LanguageFn } from 'highlight.js'

/** A dynamically imported highlight.js grammar module. */
type GrammarModule = { default: LanguageFn }

/** Defers the network/chunk cost of one grammar until it is actually needed. */
type GrammarLoader = () => Promise<GrammarModule>

/**
 * Per-grammar dynamic imports, one chunk each.
 *
 * The set mirrors highlight.js's own `lib/common` bundle (the languages it
 * considers worth shipping by default), because that is a maintained upstream
 * judgement rather than a guess of ours. Every entry must be a STATIC string
 * literal: a template-literal specifier (`languages/${name}`) cannot be
 * analysed by the bundler, so it would not emit chunks and would fail at
 * runtime in a consumer's build.
 */
const GRAMMAR_LOADERS: Record<string, GrammarLoader> = {
  bash: () => import('highlight.js/lib/languages/bash'),
  c: () => import('highlight.js/lib/languages/c'),
  cpp: () => import('highlight.js/lib/languages/cpp'),
  csharp: () => import('highlight.js/lib/languages/csharp'),
  css: () => import('highlight.js/lib/languages/css'),
  diff: () => import('highlight.js/lib/languages/diff'),
  go: () => import('highlight.js/lib/languages/go'),
  graphql: () => import('highlight.js/lib/languages/graphql'),
  ini: () => import('highlight.js/lib/languages/ini'),
  java: () => import('highlight.js/lib/languages/java'),
  javascript: () => import('highlight.js/lib/languages/javascript'),
  json: () => import('highlight.js/lib/languages/json'),
  kotlin: () => import('highlight.js/lib/languages/kotlin'),
  less: () => import('highlight.js/lib/languages/less'),
  lua: () => import('highlight.js/lib/languages/lua'),
  makefile: () => import('highlight.js/lib/languages/makefile'),
  markdown: () => import('highlight.js/lib/languages/markdown'),
  objectivec: () => import('highlight.js/lib/languages/objectivec'),
  perl: () => import('highlight.js/lib/languages/perl'),
  php: () => import('highlight.js/lib/languages/php'),
  'php-template': () => import('highlight.js/lib/languages/php-template'),
  plaintext: () => import('highlight.js/lib/languages/plaintext'),
  python: () => import('highlight.js/lib/languages/python'),
  'python-repl': () => import('highlight.js/lib/languages/python-repl'),
  r: () => import('highlight.js/lib/languages/r'),
  ruby: () => import('highlight.js/lib/languages/ruby'),
  rust: () => import('highlight.js/lib/languages/rust'),
  scss: () => import('highlight.js/lib/languages/scss'),
  shell: () => import('highlight.js/lib/languages/shell'),
  sql: () => import('highlight.js/lib/languages/sql'),
  swift: () => import('highlight.js/lib/languages/swift'),
  typescript: () => import('highlight.js/lib/languages/typescript'),
  vbnet: () => import('highlight.js/lib/languages/vbnet'),
  wasm: () => import('highlight.js/lib/languages/wasm'),
  xml: () => import('highlight.js/lib/languages/xml'),
  yaml: () => import('highlight.js/lib/languages/yaml'),
}

/**
 * Alias -> canonical grammar name.
 *
 * highlight.js registers a grammar's own aliases for us, but only AFTER that
 * grammar is loaded — and here the alias is what decides which module to load,
 * so the mapping has to exist before any loading happens. Callers pass whatever
 * their content author wrote (`ts`, `sh`, `yml`, `html`), and an unmapped alias
 * is not an error: it simply routes to the full-bundle fallback, where
 * highlight.js resolves it internally.
 */
const GRAMMAR_ALIASES: Record<string, string> = {
  'c++': 'cpp',
  'c#': 'csharp',
  'obj-c': 'objectivec',
  'objective-c': 'objectivec',
  atom: 'xml',
  cc: 'cpp',
  cjs: 'javascript',
  console: 'shell',
  cs: 'csharp',
  cts: 'typescript',
  golang: 'go',
  gql: 'graphql',
  h: 'c',
  hpp: 'cpp',
  htm: 'xml',
  html: 'xml',
  ipython: 'python',
  jsx: 'javascript',
  js: 'javascript',
  jsonc: 'json',
  kt: 'kotlin',
  make: 'makefile',
  md: 'markdown',
  mjs: 'javascript',
  mkd: 'markdown',
  mts: 'typescript',
  objc: 'objectivec',
  patch: 'diff',
  pl: 'perl',
  py: 'python',
  rb: 'ruby',
  rs: 'rust',
  sh: 'bash',
  svg: 'xml',
  text: 'plaintext',
  toml: 'ini',
  ts: 'typescript',
  tsx: 'typescript',
  txt: 'plaintext',
  vb: 'vbnet',
  xhtml: 'xml',
  yml: 'yaml',
  zsh: 'bash',
}

/**
 * Memoised module-level promises. These hold PROMISES rather than resolved
 * values so that concurrent code blocks mounting in the same tick share one
 * chunk request instead of racing to issue several.
 */
let fullBundlePromise: Promise<HLJSApi> | null = null
let corePromise: Promise<HLJSApi> | null = null
const grammarRegistrations = new Map<string, Promise<void>>()

/**
 * Resolves a caller-supplied language string to a known grammar loader.
 *
 * Exported for the story-level pins: they assert the alias table actually
 * routes (`ts` -> `typescript`) without needing to load a chunk in jsdom.
 *
 * @param language Language string as passed to the CodeCopy `language` prop.
 * @returns The canonical grammar name and its loader, or null when the
 *   language is unknown here and belongs on the full-bundle fallback path.
 */
export function resolveGrammar(
  language: string
): { name: string; load: GrammarLoader } | null {
  const key = language.trim().toLowerCase()
  if (key === '') return null
  const canonical = GRAMMAR_ALIASES[key] ?? key
  const load = GRAMMAR_LOADERS[canonical]
  return load ? { name: canonical, load } : null
}

/**
 * Loads a highlight.js instance able to highlight `language`.
 *
 * Callers must treat the returned instance as shared: it is memoised across
 * every CodeCopy on the page, so a second block asking for a language already
 * registered resolves without touching the network.
 *
 * @param language Language string as passed to the CodeCopy `language` prop.
 * @returns A highlight.js API with the requested grammar registered.
 */
export async function loadHighlighter(language: string): Promise<HLJSApi> {
  // Once the full bundle has been paid for, it can highlight everything —
  // asking the core instance to load one more grammar would be strictly more
  // bytes for strictly less capability.
  if (fullBundlePromise) return fullBundlePromise

  const grammar = resolveGrammar(language)
  if (!grammar) {
    fullBundlePromise = import('highlight.js').then(module => module.default)
    return fullBundlePromise
  }

  corePromise ??= import('highlight.js/lib/core').then(module => module.default)
  const hljs = await corePromise

  let registration = grammarRegistrations.get(grammar.name)
  if (!registration) {
    registration = grammar.load().then(module => {
      hljs.registerLanguage(grammar.name, module.default)
    })
    grammarRegistrations.set(grammar.name, registration)
  }
  await registration

  return hljs
}
