# Form — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** Form is not a single WAI-ARIA composite widget — it is the
[general Forms guidance](https://www.w3.org/WAI/tutorials/forms/) surface: a native `<form>`
grouping labelled controls, each control carrying its own name/role/value and error semantics.
The three field-level pillars the checklist asks for (programmatic label association,
`aria-invalid` + `aria-describedby` error linkage, `aria-required`) are owned by **`<FieldShell>`**
(`src/components/Field/Shell/`), which every goobs field renders through — it wires
`aria-required` / `aria-disabled` / `aria-invalid` / `aria-describedby` and a per-field
`role="alert" aria-live="polite"` error region (verified `Field/Shell/index.tsx:343-413`,
`utils.ts:11-23`). FieldShell is outside this component's directory, so its correctness is
**deferred** (see Deferred) — this audit covers the `<Form>` orchestration layer and the two
titled shell wrappers that live under `Form/`.

The **one gap the Form layer itself owned** was WCAG 4.1.3 (Status Messages): a submit blocked
by validation surfaces the per-field errors *without moving focus*, and there was **no
form-level summary** telling a screen-reader user the submit failed. That is now announced by an
assertive live region (issue 1).

Component files audited (DOM-producing): `src/components/Form/index.tsx` (the `<form>` root +
engine wiring), `src/components/Form/AutoFields.tsx` (schema-driven field scaffolding),
`src/components/Form/DataGrid/index.tsx` + `FormDataGrid.module.css` (titled DataGrid shell),
`src/components/Form/ProjectBoard/index.tsx` + `FormProjectBoard.module.css` (titled ProjectBoard
shell). The remaining files (`context.ts`, `engine/zod.ts`, `schema.ts`, `useFormField.ts`,
`useFieldArray.ts`, `useFieldValues.ts`) are JSX-free hooks/logic with no rendered DOM — nothing
to audit for markup/ARIA.

## Issues found

### 1. Blocked submit not announced to assistive tech (no form-level status) — SERIOUS — FIXED
- **WCAG:** 4.1.3 Status Messages (AA); supports 3.3.1 Error Identification (A)
- **Pattern:** `status-not-announced`
- **Where:** `src/components/Form/index.tsx` — the `<form onSubmit={engine.handleSubmit}>`
  (pre-fix) delegated straight to the engine. `engine.handleSubmit` marks every field touched and
  re-validates, so the per-field FieldShell errors appear, but **focus is never moved and no
  aggregate status is emitted**. FieldShell's per-field error regions are `aria-live="polite"`;
  when many flip to error at once on submit they queue politely and a user pressing "Submit" gets
  no immediate, deterministic signal that the submit was rejected. There was no form-level
  `role="status"`/`alert`/`aria-live` region anywhere in the Form.
- **Fix:** added a visually-hidden `role="alert"` (implicitly assertive) live region as the last
  child of the `<form>` (`index.tsx:174-181`) and a thin `handleFormSubmit` wrapper
  (`index.tsx:135-158`) that re-parses the current values with the same schema (`schema.safeParse`
  — the identical verdict the engine reaches), counts the distinct invalid field paths, and pushes
  a concise summary (`"2 fields need attention. Review the highlighted fields below."`) into the
  region before delegating to `engine.handleSubmit(event)`. A valid submit clears the message. The
  engine, its 9-method seam, and every existing `data-*`/`role`/`aria` attribute are untouched —
  this is purely additive and complements (does not replace) FieldShell's per-field announcements.
- **Markup change (noted per audit rules):** one new visually-hidden `<div role="alert"
  data-form-status="">` added inside the `<form>`; a new `Form.module.css` holds its
  `.visuallyHidden` class. No existing element/attribute changed.

### 2. FormDataGrid title rendered as a styled `<div>`, not a real heading — SERIOUS — FIXED
- **WCAG:** 1.3.1 Info and Relationships (A); 2.4.6 Headings and Labels (AA); SEO-semantic
  (goobs SSRs inside Next.js, so this markup is the crawled HTML)
- **Pattern:** `nonsemantic-heading`
- **Where:** `src/components/Form/DataGrid/index.tsx` (pre-fix) —
  `<div className={cssStyles.title}>{title}</div>`, styled as a heading (serif, 700-weight, up to
  2rem) but emitted as a `<div>`. The component's own header calls it *"Main heading displayed
  above the DataGrid."* Screen-reader users could not reach it by heading navigation and the
  crawled HTML had no heading for the grid's title. The `description` `<div>` beneath it is
  supporting prose with no paragraph semantics.
- **Fix:** added an **additive** `headingLevel?: 1 | 2 | 3 | 4 | 5 | 6` prop (default `2`,
  `index.tsx:102`) and render the title as a genuine heading via
  `const HeadingTag = \`h${headingLevel}\` as ElementType` (`index.tsx:181`) →
  `<HeadingTag className={cssStyles.title}>` (`index.tsx:201`); the description becomes a real
  `<p>` (`index.tsx:204`). This mirrors the repo convention (EmptyState's `headingLevel?: 1..6`;
  Card's `HeadingTag … as ElementType`). CSS reset `margin: 0` added to `.title`/`.description`
  (`FormDataGrid.module.css`) so the heading/paragraph elements are visually identical to the old
  divs.
- **Markup change:** `title` `<div>` → `<h2>` (or `<h{headingLevel}>`); `description` `<div>` →
  `<p>`. No `data-*`/`role`/`aria`/className changed.

### 3. FormProjectBoard title rendered as a styled `<div>`, not a real heading — SERIOUS — FIXED
- **WCAG:** 1.3.1 (A); 2.4.6 (AA); SEO-semantic
- **Pattern:** `nonsemantic-heading`
- **Where:** `src/components/Form/ProjectBoard/index.tsx` (pre-fix) —
  `<div className={cssStyles.title}>{title}</div>` + a `<div>` description, same shape as issue 2.
- **Fix:** same treatment — additive `headingLevel?: 1 | 2 | 3 | 4 | 5 | 6` (default `2`,
  `index.tsx:19`), `HeadingTag` render (`index.tsx:40,52`), description → `<p>` (`index.tsx:55`),
  and `margin` resets in `FormProjectBoard.module.css` (`.title` → `margin: 0 0 2px`, `.description`
  → `margin: 0`) so visual parity holds.
- **Markup change:** `title` `<div>` → `<h2>` (or `<h{headingLevel}>`); `description` `<div>` →
  `<p>`. No `data-*`/`role`/`aria`/className changed.

### 4. Sacred FormDataGrid animations ignore `prefers-reduced-motion` — MODERATE — FIXED
- **WCAG:** 2.2.2 Pause, Stop, Hide (A — auto-starting motion lasting >5s in parallel with
  content); 2.3.3 Animation from Interactions (AAA)
- **Pattern:** `missing-reduced-motion`
- **Where:** `src/components/Form/DataGrid/FormDataGrid.module.css` —
  `.container[data-theme='sacred']` runs `formDatagridGlowPulse 2s infinite alternate` and
  `.shimmer::after` runs `formDatagridDataFlow 3s infinite`. Both auto-start, run forever, and sit
  in parallel with the grid, with no reduced-motion escape.
- **Fix:** added `@media (prefers-reduced-motion: reduce)` disabling both animations
  (`animation: none`) at the end of `FormDataGrid.module.css`. The static gold border/glow and the
  shimmer bar remain, so no information is lost — only the perpetual motion stops.
- **Note:** `FormProjectBoard.module.css` defines a `formProjectBoardFloat` keyframe but **never
  applies it** (no `animation:` rule references it — grep-confirmed), so there is no active motion
  there and no reduced-motion guard was needed.

## Hearing

No `<audio>`/`<video>`, `new Audio`, `AudioContext`, `.play()`, or `navigator.vibrate` anywhere in
`src/components/Form/` (grepped — `NO_AUDIO_MEDIA_FOUND`). No information is conveyed by sound.
Submit status (issue 1), field errors (FieldShell), and the FormDataGrid `alert` slot are all
visual + programmatic. WCAG 1.2.x / 1.4.2 do not apply. No change needed.

## Reading & screen reader

- **Form-level status (FIXED, issue 1):** blocked submits now announce a field-count summary via
  `role="alert"`; valid submits clear it.
- **Field-level semantics (correct, via FieldShell — deferred ownership):** every goobs field the
  Form binds renders through FieldShell, which associates the label, sets `aria-required` on
  required fields, sets `aria-invalid` + `aria-describedby` → a `role="alert"` error region on
  error, and deliberately *omits* `aria-required="false"`/`aria-disabled="false"` (keeps the AT
  tree quiet and preserves the machine-test contract that FieldShell removes `aria-disabled` when a
  field enables). Required is conveyed programmatically, not asterisk-only.
- **`<form>` accessible name (FIXED, review issue R3):** the root exposes `role="form"` +
  `aria-label` **only when it has an accessible name** (`subject`, else `id`); with neither, it now
  renders a plain, non-landmark `<form>` instead of a nameless `role="form"` landmark
  (`index.tsx:169-185`). Named forms (every story + every migrated ThothOS form passes `subject`)
  are byte-for-byte unchanged, so the machine-test selector contract is preserved for named forms.
- **AutoFields names (correct):** each auto-emitted field gets a `label` (humanised from the schema
  key) and the boolean case renders `<Checkbox aria-label={label}>{label}</Checkbox>`
  (`AutoFields.tsx:181-192`) — an accessible name is always present (the visible text and the
  aria-label are identical, so no 2.5.3 Label-in-Name divergence). No `missing-accessible-name`
  defect.
- **Decorative elements hidden (FIXED, hardening):** the purely-decorative shimmer/underline
  `<div>`s in both shells now carry `aria-hidden="true"`
  (`DataGrid/index.tsx:207`, `ProjectBoard/index.tsx:46,47,59`) — they hold no text, so this is
  belt-and-suspenders against `icon-missing-aria-hidden`-class noise.
- **Headings reachable (FIXED, issues 2–3):** both shell titles are now real headings at a
  consumer-controllable level.
- **No colour-only state (1.4.1):** field error/required/disabled are all conveyed by text +
  programmatic attributes (FieldShell), never colour alone. No `color-only-state` defect at the
  Form layer.
- **Keyboard:** Form adds no custom key handling — Tab/Shift+Tab through native controls, Enter/Space
  on the native submit button, and each field's own key model apply. There is no roving-tabindex,
  arrow-nav, or focus-trap surface here (no overlay/dialog is owned by Form), so
  `missing-keyboard-arrow-nav` / `missing-dialog-focus-trap` do not apply. `:focus-visible` rings
  live on the individual fields/buttons (FieldShell + Button), not on the non-focusable `<form>`.
- **Primary content is SSR'd:** the form markup, both shell headers, and all fields render
  server-side; only the diagnostics beacons and the submit-status string are client-side (the
  status string is an AT convenience, not primary content). No client-only injection of primary
  content.

## SEO semantics

- **Headings (FIXED, issues 2–3):** both `FormDataGrid` and `FormProjectBoard` titles are now
  genuine `<h1>`–`<h6>` with the level controllable via the additive `headingLevel` prop, so the
  crawled HTML carries real headings at a caller-chosen outline position; descriptions are real
  `<p>`.
- **Landmarks:** the root is a native `<form>` — a named `form` landmark when `subject`/`id` is
  present (`role="form"` + `aria-label`), and a plain non-landmark `<form>` when it has no name (no
  nameless landmark; review issue R3). The two shells are titled `<div>` wrappers framing a DataGrid
  / ProjectBoard that own their own table/board semantics — no additional
  `<nav>`/`<header>`/`<aside>` applies.
- **Links:** the Form and its shells render no links (no onClick-div-as-link) — no
  `clickable-noninteractive-element` defect. Any links come from consumer children.
- **Lists/tables:** the DataGrid/ProjectBoard tabular content is owned by those components
  (separate audits); the Form wrappers add only the heading + description.

## Fixes applied

1. **`index.tsx` + new `Form.module.css`** — added a visually-hidden `role="alert"` submit-status
   live region and a `handleFormSubmit` wrapper that announces `"N field(s) need attention…"` on a
   validation-blocked submit and clears on success (WCAG 4.1.3). Purely additive; engine untouched.
2. **`DataGrid/index.tsx` + `FormDataGrid.module.css`** — additive `headingLevel` prop; title →
   real `<h{level}>`, description → `<p>`; `margin: 0` resets for visual parity.
3. **`ProjectBoard/index.tsx` + `FormProjectBoard.module.css`** — same heading/paragraph upgrade +
   margin resets.
4. **`FormDataGrid.module.css`** — `@media (prefers-reduced-motion: reduce)` stilling the sacred
   glow-pulse and shimmer data-flow (WCAG 2.2.2/2.3.3).
5. **Both shells** — `aria-hidden="true"` on the decorative shimmer/underline divs.

All API changes are additive — no prop renamed/removed/retyped, no existing `data-*`/`role`/`aria`
attribute removed. The machine-test selector contract (`data-component="Form"`, `data-form`,
`data-subject`, `role="form"`; `data-theme` on the shells) is preserved. Per-file gate
`bun lint:file` passes for all six edited `.tsx` files; the CSS uses only `var(--goobs-*)` tokens +
standard properties (no token leak). Repo-wide `typecheck`/`build`/`lint:css` are left to the batch
gate agent per the ownership rules.

## Stories updated

- **`Form.stories.tsx` → `SubmitStatusAnnouncement` (new)** — submits the pristine (empty) contact
  form and `waitFor`s the `role="alert"` region to contain `/fields need attention/i`, locking
  issue 1 (a regression that drops the live region or reverts to bare `engine.handleSubmit` fails).
- **`DataGrid/FormDataGrid.stories.tsx`** — `Sacred` play extended to assert
  `getByRole('heading', { level: 2, name: 'Employee Directory' })`; new **`CustomHeadingLevel`**
  story renders `headingLevel={3}` and asserts the `<h3>`, proving the level is genuinely
  consumer-controllable (locks issue 2).
- **`ProjectBoard/FormProjectBoard.stories.tsx`** — `Sacred` play extended to assert
  `getByRole('heading', { level: 2, name: 'Support Cases' })`; `SeverityGrouping` given
  `headingLevel={3}` + a play asserting the `<h3>` (locks issue 3).
- Reduced motion (issue 4) is a CSS media-query behaviour not assertable in a Storybook play
  function; the existing sacred DataGrid stories render the animated container so the Chromatic
  baseline still covers the visual, and the guard is a defensive CSS addition.

## Review fixes (2026-07-11 adversarial pass)

A follow-up adversarial review of the fixes above found three residual issues. All are fixed at
root cause; each is pinned by a story that fails before the fix.

### R1. Flagship regression test matched THREE `role="alert"` elements, not one — SERIOUS — FIXED
- **Where:** `Form.stories.tsx` `SubmitStatusAnnouncement.play` used `canvas.getByRole('alert')`.
  On the empty-submit path it exercises, the engine marks both required fields (`fullName` + `email`)
  touched, so FieldShell renders `role="alert"` for EACH (`Field/Shell/index.tsx:412`) **plus** the
  new form-level `role="alert"` region — three elements. Testing Library `getByRole('alert')` throws
  "Found multiple elements"; wrapped in `waitFor` it retries to timeout and the play FAILS. The sole
  regression test locking the flagship WCAG 4.1.3 fix was therefore not actually asserting (violates
  the fail-first regression contract).
- **Fix:** the play now scopes to the specific form-level node
  `canvasElement.querySelector('[data-form-status]')` and asserts its text, so it targets the Form's
  own live region regardless of how many field-level alerts co-exist. No product code changed for R1
  — it was a test-correctness defect.

### R2. Repeated blocked submit with an unchanged field count did not re-announce — MINOR — FIXED
- **WCAG:** 4.1.3 Status Messages (AA)
- **Where:** `index.tsx` `handleFormSubmit` re-set the SAME summary string (e.g. "2 fields need
  attention…") on a second still-invalid submit. An assertive live region only fires on a DOM text
  mutation; React commits no change when the value is identical, so the region stayed silent and a
  screen-reader user who submitted the same invalid form twice heard the summary only once. (Note: a
  plain `setSubmitStatus(''); setSubmitStatus(message)` does NOT fix this — React batches the two
  updates in one handler and commits only the final value.)
- **Fix:** `flushSync(() => setSubmitStatus('')); setSubmitStatus(message)` (`index.tsx:161-162`) —
  the `flushSync` synchronously commits the empty string to the DOM first, then the message is set,
  guaranteeing a real text mutation (message → '' → message) on every blocked submit, so each one
  produces a fresh announcement. Text stays clean (no token pollution). `react-dom`'s `flushSync` is
  a standard React 19 API; `react-dom` is already a dependency — no new dependency added.
- **Markup change:** none. Behavioural-only (the same visually-hidden `role="alert"` region).

### R3. Nameless `role="form"` landmark when neither `subject` nor `id` is set — MINOR — FIXED
- **Where:** `index.tsx` rendered `role="form" aria-label={subject ?? id}` unconditionally. With
  neither prop, `aria-label` is `undefined`, leaving an explicit `role="form"` with no accessible
  name — a nameless landmark, which ARIA discourages (landmark noise with nothing to announce).
- **Fix:** `role="form"` + `aria-label` are now emitted **only when an accessible name exists**
  (`const accessibleName = subject ?? id`; conditional attribute spread, `index.tsx:169-185`).
  Unnamed forms render a plain, non-landmark `<form>`; named forms are unchanged.
- **Markup change (noted per audit rules):** for a Form rendered with NEITHER `subject` nor `id`,
  the root `<form>` no longer carries `role="form"` (and carries no `aria-label`). This is a
  conditional removal in the previously-broken un-named case only; every named Form (all stories,
  all migrated ThothOS forms) is byte-for-byte identical. `role="form"` is not part of the documented
  machine-test selector contract (which keys on `data-component`/`data-field-name`/`data-action`/
  `data-state` + the dropdown combobox pattern), so no Playwright selector is affected.

### Stories added/changed for the review fixes
- **`SubmitStatusAnnouncement` (rewritten play)** — scopes to `[data-form-status]` (fixes R1) AND
  re-submits under a `MutationObserver` on the region, asserting the second identical-count submit
  still mutates the live region (locks R2 — the observer records zero mutations without the
  `flushSync` clear-then-set, failing the play before the fix).
- **`FormLandmarkNaming` (new)** — renders one named (`subject="contact"`) and one unnamed Form and
  asserts the named one exposes `role="form"` + `aria-label="contact"` while the unnamed one has
  neither (locks R3 — the unnamed assertion fails against the old always-on `role="form"`).

## Deferred

- **Field-level error/required/label semantics live in `<FieldShell>`
  (`src/components/Field/Shell/index.tsx`, `utils.ts`, `FieldShell.module.css`)** — outside this
  component's directory. Audited read-only and found **already correct**: `aria-required` /
  `aria-invalid` / `aria-describedby` / per-field `role="alert" aria-live="polite"` and
  `:focus-visible` treatment are all wired (`index.tsx:343-413`). No change required; ownership
  belongs to the Field/Shell audit. No fix needed there — noting only that the Form layer *depends*
  on it for the field half of the forms checklist.
- **Focus-first-invalid-field on blocked submit** — a further enhancement (move keyboard focus to
  the first `[aria-invalid]` field on a failed submit) would strengthen 3.3.1/2.4.3 beyond the
  announcement added here. It was **not** implemented because doing it robustly requires the Form to
  query rendered field DOM by name/order, which couples the orchestrator to FieldShell's internal
  markup and risks conflicting with concurrent Field-layer work. Recommended as a follow-up once the
  Field/Shell audit settles: in `Form/index.tsx`'s `handleFormSubmit`, after
  `engine.handleSubmit`, focus `formEl.querySelector('[aria-invalid="true"]')`. Suggested change is
  self-contained to `Form/index.tsx` (this directory) but deferred to avoid racing peers on the
  shared FieldShell contract.
