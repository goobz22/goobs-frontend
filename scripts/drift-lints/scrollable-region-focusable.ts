import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * DRIFT / A11Y CLASS: scrollable-region-focusable (WCAG 2.1.1 Level A; axe
 * `scrollable-region-focusable`).
 *
 * A CSS class that declares `overflow(-x|-y): auto | scroll` is a SCROLL
 * CONTAINER. WCAG 2.1.1 requires such a region to be operable by keyboard: a
 * keyboard-only user must be able to scroll it to read content clipped by the
 * overflow. axe flags a scroll container that is NEITHER itself focusable
 * (`tabindex >= 0`) NOR holds any focusable descendant — there is then no way to
 * put the keyboard focus anywhere that can arrow-scroll it. The library's own
 * reference fix is CodeCopy: it MEASURES real overflow client-side and only then
 * applies `tabIndex=0` + a naming-capable `role="group"` + `aria-label`
 * (CodeCopy/index.tsx ~188-203, 312-319 — Panel.Body repeats it), which keeps
 * non-scrolling instances out of the tab order.
 *
 * ── WHY A CSS RATCHET, NOT A PER-INSTANCE ts-scope A11yLint ───────────────────
 * The natural sibling `content-overflow-no-reflow` (an A11yLint) can decide
 * 1.4.10 statically because the FIX is a CSS fact readable from the companion
 * stylesheet (a descendant `img`/`pre` guard). 2.1.1 reachability is NOT a static
 * fact of one file: whether a scroll container is reachable depends on its
 * RENDERED SUBTREE (does any descendant take focus?), on CROSS-COMPONENT
 * focusability (a `<CustomCheckbox>` / `<TaskCard>` / `<TextField>` child renders
 * a focusable control the caller cannot see), and on ACTUAL runtime overflow.
 * A per-instance checker would therefore have to either (a) treat every
 * `{children}`/`.map()`/component-child container as reachable — passing on so
 * much it is toothless — or (b) claim specific elements are broken and be WRONG
 * about the compliant ones (this repo's TransferList `.list` of `<CustomCheckbox>`,
 * the `role="tabpanel"` content areas, the `<Dialog>`/`<Drawer>` `{children}`
 * surfaces). Case (b) is exactly the FALSE POSITIVE the audit forbids ("false
 * positives are poison").
 *
 * So the lower-false-positive design is a RATCHET (the established pattern for a
 * class whose instances cannot be safely mass-detected): it does NOT judge any
 * element. It FREEZES the current, hand-reviewed set of scroll-container classes
 * (the 2026-07 census below) and fails only on GROWTH — a new scroll-container
 * class, or a file gaining one. That growth is a conscious 2.1.1 review prompt,
 * never a per-element accessibility claim, so it carries ZERO false-positive
 * risk by construction. New scroll containers must either adopt the measured
 * CodeCopy pattern (or host focusable content) and then `--update` the baseline,
 * or justify the addition in the reviewed baseline commit.
 *
 * ── THE CENSUS THAT SEEDS THE BASELINE (2026-07, all 16 container-class files) ─
 * Every scroll-container class below was verified keyboard-reachable by one of:
 *   • MEASURED focus (the reference fix): CodeCopy `.pre`, Panel `.body`,
 *     AddTask `.sidebar` (this pass) — `tabIndex` gated on measured overflow.
 *   • EXPLICIT tab stop + focus ring: Table `.container`, PricingTable
 *     `.scrollRegion` (`tabIndex={0}` + `role` + a :focus-visible ring).
 *   • COMPOSITE role with focusable descendants: the Dropdown listboxes
 *     (Regular/SearchableSimple/SearchableHistory/MultiSelect `.menu`/`.content`,
 *     `role="listbox"` + `role="option"` driven by the combobox), DataGrid
 *     `.tableWrapper`/`.contentWrapper` (`role="grid"` cells), BigCalendar
 *     `.weekGrid`/`.dayGrid` (`role="grid"` roving cells).
 *   • FOCUSABLE content: TransferList `.list` (checkboxes), ShowTask `.sidebar`
 *     (collapse button), DataGrid `.cardsContainer`/`.mobileView` (card actions),
 *     ProjectBoard `.board`/`.column` (TaskCard controls), the tabpanel content
 *     areas, `.dropdownMenu`/`.manageColumnsModal` (menu/modal controls).
 *   • `{children}` / transient-overlay surfaces: Dialog `.content`, Drawer
 *     `.paper`/`.content`, ProjectBoard `.animationContent` (`tabIndex={-1}`).
 *
 * ── WHAT IS AN INSTANCE ───────────────────────────────────────────────────────
 * A CSS rule whose block declares `overflow(-x|-y): auto|scroll` AND whose
 * selector SUBJECT (the final compound after the last combinator) is a CLASS
 * (`.foo`, optionally with state pseudo-classes / attribute selectors). One
 * instance per distinct container class per file (a `.foo` + `.foo:focus-visible`
 * pair counts once). The line is the class's first overflow declaration.
 *
 * ── DELIBERATELY EXCLUDED (documented under-measures — poison avoidance) ───────
 *  • A DESCENDANT-ELEMENT scroll rule whose subject is a bare element —
 *    `.root pre`, `.markdownPreview pre`, `.wrap img` — is NOT a container class.
 *    It is the injected-content sub-shape owned by `content-overflow-no-reflow`
 *    (1.4.10) and the Markdown/rich-text renderers keyboard-enable it by
 *    injecting `tabindex="0"` into the `<pre>` HTML. Folding it in here would
 *    double-cover it and confuse the two criteria.
 *  • `overflow: hidden | visible | clip` — not scrollable, never a scroll trap.
 *  • A container class written inside a `/* … *\/` comment is documentation.
 */

/** The `overflow` family set to a scrollable value (auto | scroll), the value
 *  matched anywhere in the declaration so `overflow: hidden auto` (a scrollable
 *  y-axis) is caught, while `overflow: hidden`/`visible`/`clip` are not. */
const OVERFLOW_SCROLL = /overflow(-x|-y)?\s*:\s*[^;{}]*\b(auto|scroll)\b/i

/** Blank `/* … *\/` CSS block-comment content (string-aware, newline-preserving)
 *  so an `overflow: auto` rule quoted inside a comment is never itself a hit.
 *  Adapted from scripts/drift-lints/css-px-font-size.ts: CSS has NO `//` line
 *  comments (a `//` only appears inside `url(https://…)`), so that branch is
 *  intentionally dropped; `'`/`"`/`` ` `` string handling is kept so a `/*`
 *  inside a string cannot open a phantom comment. */
function blankComments(text: string): string {
  const out = text.split('')
  let str: string | null = null
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (str) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === str) str = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      str = c
      continue
    }
    if (c === '/' && text[i + 1] === '*') {
      let j = i
      while (j < text.length && !(text[j] === '*' && text[j + 1] === '/')) {
        if (text[j] !== '\n') out[j] = ' '
        j++
      }
      if (j < text.length) {
        out[j] = ' '
        out[j + 1] = ' '
        j += 1
      }
      i = j
      continue
    }
  }
  return out.join('')
}

/** Split a selector list on TOP-LEVEL commas only — a comma inside `[attr]` or
 *  `:not(…)` does not separate selectors. */
function splitSelectorList(selector: string): string[] {
  const out: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < selector.length; i++) {
    const c = selector[i]
    if (c === '[' || c === '(') depth++
    else if (c === ']' || c === ')') depth--
    else if (c === ',' && depth === 0) {
      out.push(selector.slice(start, i))
      start = i + 1
    }
  }
  out.push(selector.slice(start))
  return out
}

/** The SUBJECT compound of a selector — the part after the last TOP-LEVEL
 *  combinator (descendant space / `>` / `~` / `+`), the element the rule
 *  actually styles. Combinators inside `[…]`/`(…)` are ignored. */
function subjectCompound(rawSelector: string): string {
  const selector = rawSelector.trim()
  let depth = 0
  let subjectStart = 0
  for (let i = 0; i < selector.length; i++) {
    const c = selector[i]
    if (c === '[' || c === '(') depth++
    else if (c === ']' || c === ')') depth--
    else if (
      depth === 0 &&
      (c === ' ' || c === '\t' || c === '\n' || c === '>' || c === '~' || c === '+')
    ) {
      subjectStart = i + 1
    }
  }
  return selector.slice(subjectStart).trim()
}

/** The subject's BASE compound with attribute selectors and pseudo-classes /
 *  pseudo-elements stripped, e.g. `.sidebar:focus-visible` → `.sidebar`,
 *  `.foo::-webkit-scrollbar` → `.foo`, `pre` → `pre`. A container-class subject
 *  starts with `.`; a bare element (`pre`, `img`) does not. */
function baseCompound(subject: string): string {
  return subject
    .replace(/\[[^\]]*\]/g, '')
    .replace(/::?[\w-]+(\([^)]*\))?/g, '')
    .trim()
}

const lint: DriftLint = {
  name: 'scrollable-region-focusable',
  scope: 'css',
  description:
    'A CSS class declares overflow(-x/-y): auto|scroll — a scroll container. WCAG 2.1.1 (axe scrollable-region-focusable) requires such a region to be keyboard-reachable: focusable itself, or holding focusable content. Reachability is a property of the rendered subtree + cross-component focusability + real overflow — statically undecidable per instance without false positives — so this ratchet freezes the hand-reviewed set of scroll-container classes and fails on growth, forcing a conscious 2.1.1 review of every new scroll region.',
  canon:
    'A NEW scroll-container class (overflow(-x/-y): auto|scroll on a `.class`) must be keyboard-reachable per WCAG 2.1.1. The library reference is the MEASURED pattern (CodeCopy `<pre>` / Panel.Body): measure overflow client-side and apply `tabIndex=0` + a naming-capable `role="group"` + `aria-label` ONLY when it actually scrolls, so non-scrolling instances stay out of the tab order. Alternatively host a composite-widget role whose focusable descendants make it reachable (listbox/grid/menu), or ensure it genuinely contains focusable content.\n' +
    'This is a RATCHET, not a per-instance judge: 2.1.1 reachability depends on the rendered subtree + cross-component focusability + actual overflow, so a static per-element claim would false-positive on compliant containers (TransferList `.list` of `<CustomCheckbox>`, `role="tabpanel"` content, `{children}` dialog/drawer surfaces) — the poison the audit forbids. The baseline freezes today`s reviewed set (2026-07 census in the module doc); growth means a new scroll region — adopt the measured pattern (or focusable content), then `--update` the baseline in the reviewed commit. Descendant-element scroll rules (`.root pre`) are the 1.4.10 shape owned by content-overflow-no-reflow and are excluded.',
  measure(files: DriftFile[]): DriftInstance[] {
    const instances: DriftInstance[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      const seenPerFile = new Set<string>()
      const ruleRe = /([^{}]+)\{([^{}]*)\}/g
      let m: RegExpExecArray | null
      while ((m = ruleRe.exec(text))) {
        const [, selectorText, block] = m
        if (!OVERFLOW_SCROLL.test(block)) continue
        for (const segment of splitSelectorList(selectorText)) {
          const base = baseCompound(subjectCompound(segment))
          // Container-class subject only — a bare-element subject (`pre`, `img`)
          // is the excluded descendant-content 1.4.10 shape.
          if (!base.startsWith('.')) continue
          if (seenPerFile.has(base)) continue
          seenPerFile.add(base)
          instances.push({
            file: path,
            line: text.slice(0, m.index).split('\n').length,
            token: `${base} { overflow: auto|scroll } scroll container`,
          })
        }
      }
    }
    return instances
  },
  selftest: {
    bad: [
      // A plain container class with a vertical scroll overflow.
      '.panel {\n  overflow-y: auto;\n}',
      // The shorthand scroll value.
      '.viewport {\n  overflow: scroll;\n}',
      // Two-value shorthand whose y-axis scrolls.
      '.split {\n  overflow: hidden auto;\n}',
      // A state-variant rule (no overflow) plus the base overflow rule — must
      // count the CLASS once, proving state rules do not double-count.
      '.list:focus-visible {\n  outline: none;\n}\n.list {\n  overflow: auto;\n}',
    ],
    good: [
      // Descendant-ELEMENT scroll (subject `pre`) — the 1.4.10 injected-content
      // shape owned by content-overflow-no-reflow, NOT a container class.
      '.root pre {\n  max-width: 100%;\n  overflow-x: auto;\n}',
      // Descendant-element image scroll — still an element subject, excluded.
      '.card > img {\n  overflow: auto;\n}',
      // overflow: hidden is not scrollable.
      '.box {\n  overflow: hidden;\n}',
      // overflow: visible / clip are not scrollable.
      '.free {\n  overflow: visible;\n}',
      // A class with no overflow at all.
      '.card {\n  padding: 8px;\n}',
      // A container-class overflow rule quoted inside a comment is documentation.
      '/* .legacy { overflow: auto; } */\n.now {\n  color: red;\n}',
    ],
  },
}

export default lint
