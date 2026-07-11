# FieldGrid — a11y audit (2026-07-11)

**Status:** CLEAN

## APG pattern

FieldGrid is a **layout primitive**, not an interactive widget — it has no APG
*widget* pattern of its own. The relevant model is the WAI-ARIA **[group](https://www.w3.org/TR/wai-aria-1.2/#group)**
role: "a set of user interface objects that is not intended to be included in a page
summary or table of contents." A group of related form controls is exactly this. FieldGrid
renders a `<div role="group">` by default so assistive tech announces the field cluster as
one related set, and forwards `aria-label` / `aria-labelledby` (via `...restProps`) so the
consumer names the group from its section heading. `role="group"` has **no required
keyboard interaction** and **no required states/properties** other than an (optional but
recommended) accessible name — the fields inside own their own focus/keyboard behavior.

When `as` names a semantic element (e.g. `as='dl'` for `DetailGrid`) the implicit
`role="group"` is deliberately dropped so the element keeps its native role.

## Issues found

**None in the FieldGrid directory.** Every checklist category was audited and either does
not apply or is already satisfied by the existing, deliberately a11y-conscious design:

| # | Checklist area | WCAG 2.2 | Location | Finding | Status |
|---|----------------|----------|----------|---------|--------|
| — | Hearing (audio/media) | 1.2.x, 1.4.2 | `src/components/FieldGrid/**` | No `Audio`/`AudioContext`/`<audio>`/`<video>`/`navigator.vibrate` anywhere (grep clean). No audio-only status. | N/A |
| — | Group role / semantics | 1.3.1, 4.1.2 | `src/components/FieldGrid/index.tsx:69,74` | Default root is `<div role="group">` — the correct semantic for a related set of form controls; role is **explicit** and preserved (not stripped by `display:grid`). | OK |
| — | Accessible name | 1.3.1, 4.1.2 | `src/components/FieldGrid/index.tsx:55,79` | `aria-label`/`aria-labelledby` are forwarded through `...restProps`; a primitive cannot self-name, so providing the mechanism (and documenting it in the JSDoc) is the correct, complete design. An **unnamed** `role="group"` is valid ARIA and is announced silently by NVDA/JAWS (limited value, not noise), so it is harmless. | OK |
| — | Semantic-element escape hatch | 1.3.1 | `src/components/FieldGrid/index.tsx:65,69` | `as` lets a consumer render `<dl>`/`<fieldset>`/`<section>` etc.; the code drops the implicit `role="group"` for non-`div` elements so a native role is never masked. | OK |
| — | Focus visible | 2.4.7, 2.4.11 | `src/components/FieldGrid/FieldGrid.module.css` | The container is non-interactive (no `onClick`, not focusable) — its children own focus. No `:focus-visible` is required on the grid itself. | N/A |
| — | Color-only state | 1.4.1 | `src/components/FieldGrid/**` | The component has no state (selected/error/disabled) — it is pure layout. | N/A |
| — | Motion | 2.3.3 | `src/components/FieldGrid/FieldGrid.module.css` | The module.css has **no** `transition`/`animation`/`@keyframes` (grep clean), so a `prefers-reduced-motion` block would be dead code. | N/A |
| — | Headings / SEO | 1.3.1, 2.4.x | `src/components/FieldGrid/index.tsx` | A layout group correctly renders **no** heading (faking an `<h*>` would be the defect). The group is instead associable with a real, crawlable heading via `aria-labelledby` — see the new story. | OK |
| — | SSR content | 1.1.1 | `src/components/FieldGrid/index.tsx:71-83` | Despite `'use client'`, children render inline with no `useEffect`/state gate, so all meaningful content is present in the SSR'd HTML (Next.js server-renders client components). | OK |

## Hearing

No sound, audio, video, `AudioContext`, or `navigator.vibrate` usage exists anywhere in the
component (grep-verified across `src/components/FieldGrid/`). No status/feedback is conveyed
by audio. **CLEAN** (WCAG 1.2.x / 1.4.2 N/A).

## Reading & screen reader

- **Group semantics (1.3.1, 4.1.2):** the default `<div role="group">` (`index.tsx:69,74`)
  gives the field cluster a programmatic grouping. The role is set explicitly and is *not*
  subject to the WebKit "`display:grid` strips implicit list/table role" class of bugs,
  because the role is authored, not inferred from the element type.
- **Accessible name (4.1.2):** `aria-label` / `aria-labelledby` are forwarded via
  `...restProps` (they are members of `HTMLAttributes<HTMLDivElement>`). A layout primitive
  cannot supply its own name — the name comes from consumer content (typically the section
  heading) — so forwarding the mechanism is the complete and correct design. An unnamed
  group is valid ARIA and announced silently by mainstream screen readers, so it introduces
  no noise and no 4.1.2 violation.
- **Semantic HTML first:** the `as` prop lets consumers render the semantically correct
  element (`<dl>`, `<fieldset>`, `<section>`, …); the code drops the implicit group role for
  non-`div` elements so a native role is never masked (`index.tsx:69`).
- **Focus / keyboard (2.1.x, 2.4.7):** the container is non-interactive; its focusable
  children own their own focus rings and keyboard behavior. Nothing to add.
- **Color-only state (1.4.1):** no state exists on the component.
- **Motion (2.3.3):** no animations/transitions in the module.css → no reduced-motion block
  needed.

**CLEAN.**

## SEO semantics

The SSR'd markup is a single `<div role="group">` (or the consumer's `as` element) wrapping
its children inline — no client-only injection of primary content. FieldGrid is not itself a
heading, landmark, list, or link, so no `headingLevel`/landmark/`<a href>` prop applies;
instead it correctly exposes `aria-labelledby` so the group can be named by a **real,
crawlable heading** the consumer renders (demonstrated by the new `A11y (named by heading)`
story, which pairs an `<h2 id>` with `aria-labelledby`). **CLEAN.**

## Fixes applied

No code fix was required in `index.tsx` or `FieldGrid.module.css` — the component is
a11y-clean as authored.

## Stories updated

`src/components/FieldGrid/FieldGrid.stories.tsx` (stories are this repo's only regression
tests) — added one story (additive; existing stories untouched):

- **`A11y (named by heading)`** (`LabelledByHeading`) — renders a real, crawlable `<h2 id>`
  and names the `role="group"` from it via `aria-labelledby` (forwarded through rest props).
  The `play` test asserts `getByRole('group', { name: 'Billing' })` resolves the accessible
  name **from the external heading**, plus `data-component="FieldGrid"`. This guards the
  `...restProps` aria-* forwarding contract and the accessible-by-default naming path (the
  primary real-world usage), and exercises the SSR heading + group-association relationship
  (WCAG 1.3.1 / 4.1.2). The existing `InteractionTest` continues to guard the `aria-label`
  naming path + the `data-field-grid` selector.

## Gates

- `bun lint:file src/components/FieldGrid/FieldGrid.stories.tsx` → exit 0.
- Repo-wide typecheck/lint/build intentionally NOT run (owned by the batch gate agent). The
  new story uses only valid `HTMLAttributes` (`aria-labelledby`) and standard testing-library
  assertions already imported in the file.

## Deferred

1. **`DetailField`/`DetailGrid` — `display:grid` on the `<dl>` may drop definition-list
   semantics in WebKit/Safari.** `DetailGrid` (`src/components/DetailField/index.tsx:205-217`)
   renders `<FieldGrid as="dl">`, so FieldGrid's `.grid` class
   (`src/components/FieldGrid/FieldGrid.module.css:12`, `display: grid`) is applied **directly
   to the `<dl>`**. There is a known class of WebKit bugs where changing a list/`dl`/`table`
   element's computed `display` to `grid`/`flex` drops the implicit list / definition-list
   role (and thus the `<dt>`/`<dd>` term↔description relationship) from the accessibility tree.
   **This is UNVERIFIED here** (no Safari on this box) and is flagged for the `DetailField`
   owner to confirm. FieldGrid cannot fix it without breaking the required `<dl> > (<dt>,<dd>)`
   parent-child structure (the grid items must be direct children of the `<dl>`, so no inner
   wrapper is possible from FieldGrid's side). **Suggested fix (in `DetailField`'s directory):**
   after verifying in Safari, either (a) apply the grid layout to an inner element and keep the
   `<dl>` as a non-grid semantic wrapper, or (b) re-assert the definition-list relationship
   (e.g. author explicit roles) on the `<dl>`/`<dt>`/`<dd>`. Owner: DetailField.
   - **File:** `src/components/DetailField/index.tsx`
   - **Line:** 207 (`as="dl"`) in combination with `src/components/FieldGrid/FieldGrid.module.css:17` (`display: grid`)
