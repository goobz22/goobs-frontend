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

const svgIn = (root: HTMLElement, testid: string): SVGSVGElement => {
  const el = root
    .querySelector(`[data-testid="${testid}"]`)
    ?.querySelector('svg')
  if (!el) throw new Error(`no <svg> found in "${testid}"`)
  return el as SVGSVGElement
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
