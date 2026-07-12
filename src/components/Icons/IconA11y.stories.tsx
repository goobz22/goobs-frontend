/**
 * @fileoverview Accessibility regression spec for the goobs Icon contract
 * (goobs has no unit tests — these Storybook play functions ARE the tests).
 *
 * Every icon shares one accessible-icon contract, resolved by
 * `resolveIconA11y` (src/components/Icons/iconA11y.ts) and rendered identically
 * across all ~261 icons:
 *
 *   - DECORATIVE BY DEFAULT — with no text alternative the `<svg>` is
 *     `aria-hidden="true"` + `focusable="false"`, so assistive tech skips it and
 *     it adds no noise to the label of the control that wraps it (WCAG 1.1.1).
 *   - NAMED (opt-in) — passing `aria-label` / `aria-labelledby` (or `title`)
 *     flips the icon to `role="img"`, exposes the name, and drops `aria-hidden`.
 *   - `title` renders a child `<title>` element (the valid inline-SVG naming
 *     mechanism) and also flips the icon to a named `role="img"`.
 *   - An explicit `aria-hidden` prop always wins.
 *
 * CloseIcon is the representative standard icon; ShowHideEyeIcon is the one
 * multi-branch icon (it swaps SVGs by `visible`), pinned here so its branches
 * keep the same contract.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import React from 'react'
import { expect } from 'storybook/test'
import CloseIcon from './Close'
import ShowHideEyeIcon from './ShowHideEye'

const meta: Meta = {
  title: 'Components/Icons/Accessibility',
}

export default meta
type Story = StoryObj

// A version of CloseIcon that also accepts the runtime-only `title` opt-in
// (title is not part of React's SVGProps, so it is surfaced via a widened type
// here rather than an `any` cast).
const TitledCloseIcon = CloseIcon as React.FC<
  React.ComponentProps<typeof CloseIcon> & { title?: string }
>

// Same widening for ShowHideEye so the sacred glyph `title`-opt-in path (which
// exposes `title` via `aria-label`, since a <div> has no <title> child) can be
// exercised without an `any` cast.
const TitledShowHideEyeIcon = ShowHideEyeIcon as React.FC<
  React.ComponentProps<typeof ShowHideEyeIcon> & { title?: string }
>

const svgIn = (root: HTMLElement, testid: string): SVGSVGElement => {
  const el = root
    .querySelector(`[data-testid="${testid}"]`)
    ?.querySelector('svg')
  if (!el) throw new Error(`no <svg> found in "${testid}"`)
  return el as SVGSVGElement
}

// ShowHideEye's sacred theme renders its glyph on a <div> (a hieroglyph), NOT an
// <svg>. That glyph <div> is the single element child of the `[data-theme]`
// wrapper and carries the resolved a11y attributes, so this grabs it for the
// sacred-branch assertions below.
const glyphIn = (root: HTMLElement, testid: string): HTMLElement => {
  const glyph = root
    .querySelector(`[data-testid="${testid}"] [data-theme]`)
    ?.firstElementChild
  if (!glyph) throw new Error(`no glyph <div> found in "${testid}"`)
  return glyph as HTMLElement
}

/**
 * The full contract on one screen: a bare (decorative) icon, an aria-labelled
 * icon, a titled icon, and an explicitly force-hidden-yet-labelled icon. The
 * play function is the regression assertion for every branch.
 */
export const Contract: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, padding: 24 }}>
      <span data-testid="decorative">
        <CloseIcon />
      </span>
      <span data-testid="labelled">
        <CloseIcon aria-label="Close menu" />
      </span>
      <span data-testid="titled">
        <TitledCloseIcon title="Close dialog" />
      </span>
      <span data-testid="forced-hidden">
        {/* aria-hidden explicitly wins even though a name is present */}
        <CloseIcon aria-label="Close" aria-hidden />
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // DECORATIVE DEFAULT — hidden from AT, never focusable, unnamed.
    const decorative = svgIn(canvasElement, 'decorative')
    await expect(decorative).toHaveAttribute('aria-hidden', 'true')
    await expect(decorative).toHaveAttribute('focusable', 'false')
    await expect(decorative).not.toHaveAttribute('role')
    await expect(decorative).not.toHaveAttribute('aria-label')
    await expect(decorative.querySelector('title')).toBeNull()

    // NAMED via aria-label — exposed as an image with a name, not hidden.
    const labelled = svgIn(canvasElement, 'labelled')
    await expect(labelled).toHaveAttribute('role', 'img')
    await expect(labelled).toHaveAttribute('aria-label', 'Close menu')
    await expect(labelled).toHaveAttribute('focusable', 'false')
    await expect(labelled).not.toHaveAttribute('aria-hidden')

    // NAMED via title — role img + a child <title> holding the name.
    const titled = svgIn(canvasElement, 'titled')
    await expect(titled).toHaveAttribute('role', 'img')
    await expect(titled).not.toHaveAttribute('aria-hidden')
    const titleEl = titled.querySelector('title')
    await expect(titleEl).not.toBeNull()
    await expect(titleEl).toHaveTextContent('Close dialog')

    // EXPLICIT aria-hidden wins even when a name is supplied.
    const forced = svgIn(canvasElement, 'forced-hidden')
    await expect(forced).toHaveAttribute('aria-hidden', 'true')
  },
}

/**
 * The remaining documented branches of the accessible-icon contract that the
 * first story does not cover, pinned so a regression cannot silently break a
 * shipped naming path (WCAG 4.1.2 Name, Role, Value):
 *
 *   - NAMED via `aria-labelledby` — the third accessible-name source (alongside
 *     `aria-label` and `title`); it must flip the icon to `role="img"`, expose
 *     the reference, and drop `aria-hidden`, exactly like `aria-label`.
 *   - EXPLICIT `role` wins — a consumer-supplied `role` is preserved instead of
 *     the auto `role="img"` (the `role ?? …` branch).
 *   - FORCE-EXPOSE — `aria-hidden={false}` on an otherwise-decorative (unnamed)
 *     icon removes `aria-hidden` so it is no longer skipped by AT, without
 *     inventing a role or name.
 */
export const NamingBranches: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, padding: 24 }}>
      {/* the label target for the aria-labelledby case */}
      <span id="close-label" hidden>
        Dismiss notification
      </span>
      <span data-testid="labelledby">
        <CloseIcon aria-labelledby="close-label" />
      </span>
      <span data-testid="explicit-role">
        {/* an explicit role must survive even when a name is also supplied */}
        <CloseIcon role="button" aria-label="Close" />
      </span>
      <span data-testid="force-exposed">
        {/* decorative icon force-exposed to AT with no name */}
        <CloseIcon aria-hidden={false} />
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // NAMED via aria-labelledby — role img, reference kept, not hidden.
    const labelledby = svgIn(canvasElement, 'labelledby')
    await expect(labelledby).toHaveAttribute('role', 'img')
    await expect(labelledby).toHaveAttribute('aria-labelledby', 'close-label')
    await expect(labelledby).toHaveAttribute('focusable', 'false')
    await expect(labelledby).not.toHaveAttribute('aria-hidden')

    // EXPLICIT role wins over the auto role="img".
    const explicitRole = svgIn(canvasElement, 'explicit-role')
    await expect(explicitRole).toHaveAttribute('role', 'button')
    await expect(explicitRole).toHaveAttribute('aria-label', 'Close')
    await expect(explicitRole).not.toHaveAttribute('aria-hidden')

    // FORCE-EXPOSE — aria-hidden dropped; no name/role invented; still not focusable.
    const forced = svgIn(canvasElement, 'force-exposed')
    await expect(forced).not.toHaveAttribute('aria-hidden')
    await expect(forced).not.toHaveAttribute('role')
    await expect(forced).not.toHaveAttribute('aria-label')
    await expect(forced).toHaveAttribute('focusable', 'false')
  },
}

/**
 * The multi-branch ShowHideEyeIcon keeps the same contract in both its default
 * (decorative) and named forms. Pins the light-theme `visible=false` branch —
 * the one whose SVG markup differs most from the standard icon body.
 */
export const MultiBranchIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, padding: 24 }}>
      <span data-testid="eye-decorative">
        <ShowHideEyeIcon />
      </span>
      <span data-testid="eye-labelled">
        <ShowHideEyeIcon aria-label="Show password" />
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const decorative = svgIn(canvasElement, 'eye-decorative')
    await expect(decorative).toHaveAttribute('aria-hidden', 'true')
    await expect(decorative).toHaveAttribute('focusable', 'false')
    await expect(decorative).not.toHaveAttribute('role')

    const labelled = svgIn(canvasElement, 'eye-labelled')
    await expect(labelled).toHaveAttribute('role', 'img')
    await expect(labelled).toHaveAttribute('aria-label', 'Show password')
    await expect(labelled).not.toHaveAttribute('aria-hidden')
  },
}

/**
 * ShowHideEyeIcon's **sacred** theme (`styles={{ theme: 'sacred' }}`) does not
 * render an `<svg>` at all — it renders the accessible-icon contract on a
 * hieroglyph `<div>` (`𓂀`, and `𓂀` + slash when hidden) through a hand-wired
 * code path that is DISTINCT from every other icon's shared `{...svgA11y}`
 * spread: a `<div>` cannot carry the SVG-only `focusable` attribute (nor does it
 * need one — a `<div>` is not a tab stop), and it exposes the `title` opt-in via
 * `aria-label` because a `<div>` has no child `<title>` naming mechanism.
 *
 * Because this wiring can regress independently of the `<svg>` resolver spread —
 * and goobs' only regression tests are these play functions — both glyph
 * branches (visible `𓂀` and hidden `𓂀`+slash) are pinned here in their
 * decorative-default, `aria-label`, and `title` forms (WCAG 1.1.1 / 4.1.2).
 */
export const SacredGlyphBranches: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, padding: 24 }}>
      {/* hidden glyph (visible=false, the default) — 𓂀 + slash */}
      <span data-testid="sacred-hidden-decorative">
        <ShowHideEyeIcon styles={{ theme: 'sacred' }} />
      </span>
      <span data-testid="sacred-hidden-labelled">
        <ShowHideEyeIcon
          styles={{ theme: 'sacred' }}
          aria-label="Show password"
        />
      </span>
      {/* visible glyph (visible=true) — 𓂀 */}
      <span data-testid="sacred-visible-decorative">
        <ShowHideEyeIcon styles={{ theme: 'sacred' }} visible />
      </span>
      <span data-testid="sacred-visible-labelled">
        <ShowHideEyeIcon
          styles={{ theme: 'sacred' }}
          visible
          aria-label="Hide password"
        />
      </span>
      {/* title opt-in on the glyph div (exposed via aria-label on this path) */}
      <span data-testid="sacred-titled">
        <TitledShowHideEyeIcon
          styles={{ theme: 'sacred' }}
          title="Reveal password"
        />
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // DECORATIVE DEFAULT (hidden glyph) — aria-hidden on the glyph div, no
    // role/name; the glyph is silent to AT, exactly like the <svg> default.
    const hiddenDecorative = glyphIn(canvasElement, 'sacred-hidden-decorative')
    await expect(hiddenDecorative).toHaveAttribute('aria-hidden', 'true')
    await expect(hiddenDecorative).not.toHaveAttribute('role')
    await expect(hiddenDecorative).not.toHaveAttribute('aria-label')

    // NAMED via aria-label (hidden glyph) — role img + name, aria-hidden dropped.
    const hiddenLabelled = glyphIn(canvasElement, 'sacred-hidden-labelled')
    await expect(hiddenLabelled).toHaveAttribute('role', 'img')
    await expect(hiddenLabelled).toHaveAttribute('aria-label', 'Show password')
    await expect(hiddenLabelled).not.toHaveAttribute('aria-hidden')

    // DECORATIVE DEFAULT (visible glyph) — same contract on the other branch.
    const visibleDecorative = glyphIn(
      canvasElement,
      'sacred-visible-decorative'
    )
    await expect(visibleDecorative).toHaveAttribute('aria-hidden', 'true')
    await expect(visibleDecorative).not.toHaveAttribute('role')
    await expect(visibleDecorative).not.toHaveAttribute('aria-label')

    // NAMED via aria-label (visible glyph) — role img + name, not hidden.
    const visibleLabelled = glyphIn(canvasElement, 'sacred-visible-labelled')
    await expect(visibleLabelled).toHaveAttribute('role', 'img')
    await expect(visibleLabelled).toHaveAttribute('aria-label', 'Hide password')
    await expect(visibleLabelled).not.toHaveAttribute('aria-hidden')

    // NAMED via title — the sacred path routes `title` through `aria-label`
    // (`aria-label ?? title`), flips to role img, and is not hidden.
    const titled = glyphIn(canvasElement, 'sacred-titled')
    await expect(titled).toHaveAttribute('role', 'img')
    await expect(titled).toHaveAttribute('aria-label', 'Reveal password')
    await expect(titled).not.toHaveAttribute('aria-hidden')
  },
}
