import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn, userEvent, within, expect } from 'storybook/test'
import Breadcrumb from './index'
import { ChevronRightIcon } from '../Icons'

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A breadcrumb navigation component with theme support.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const sampleItems = [
  { label: 'Home', href: '/' },
  { label: 'Category', href: '/category' },
  { label: 'Subcategory', href: '/subcategory' },
  { label: 'Current Page', isActive: true },
]

export const Light: Story = {
  args: {
    items: sampleItems,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const Dark: Story = {
  args: {
    items: sampleItems,
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const Sacred: Story = {
  args: {
    items: sampleItems,
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const WithCustomSeparator: Story = {
  args: {
    items: sampleItems,
    separator: <ChevronRightIcon styles={{ theme: 'sacred' }} />,
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const MaxItems: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Level 1', href: '/level1' },
      { label: 'Level 2', href: '/level2' },
      { label: 'Level 3', href: '/level3' },
      { label: 'Level 4', href: '/level4' },
      { label: 'Current Page', isActive: true },
    ],
    maxItems: 4,
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * A11y: crumbs given an `onClick` but no `href` render as native `<button>`
 * elements — they carry an accessible name from their text, take focus, and
 * activate with Enter/Space for free. The final `isActive` crumb is the current
 * page and is exposed with `aria-current="page"`.
 *
 * The play function moves keyboard focus onto the first button crumb (driving
 * the `:focus-visible` ring the Chromatic snapshot captures) and activates it
 * with the keyboard, pinning that `onClick` fires from Enter (WCAG 2.1.1).
 */
export const InteractiveCallback: Story = {
  args: {
    items: [
      { label: 'Home', onClick: fn() },
      { label: 'Category', onClick: fn() },
      { label: 'Current Page', isActive: true },
    ],
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const home = canvas.getByRole('button', { name: 'Home' })
    // Keyboard focus lands on the first button crumb → drives :focus-visible.
    await userEvent.tab()
    await expect(home).toHaveFocus()
    // Native <button> ⇒ Enter activates it and fires onClick without any
    // custom key handler (the deprecated onKeyPress span is gone).
    await userEvent.keyboard('{Enter}')
    await expect(args.items[0]?.onClick).toHaveBeenCalled()
  },
}

/**
 * A11y: the current page is the last crumb (`isActive: true`) and is rendered
 * as non-navigable text carrying `aria-current="page"`; the `/` separators are
 * decorative and hidden from assistive tech via `aria-hidden`.
 *
 * The play function tabs keyboard focus onto the first link crumb so the
 * `:focus-visible` ring (WCAG 2.4.7) is an actually-rendered state the Chromatic
 * snapshot captures — not just a manual note — and asserts the current-page /
 * decorative-separator semantics.
 */
export const CurrentPageAndSeparators: Story = {
  args: {
    items: sampleItems,
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const home = canvas.getByRole('link', { name: 'Home' })
    // Keyboard focus (via Tab) lands on the first link → drives :focus-visible,
    // which Chromatic captures as the visible focus ring.
    await userEvent.tab()
    await expect(home).toHaveFocus()
    // The current page is programmatically identified, non-navigable text.
    const current = canvas.getByText('Current Page').closest('[aria-current]')
    await expect(current).not.toBeNull()
    await expect(current).toHaveAttribute('aria-current', 'page')
    await expect(current?.tagName).toBe('SPAN')
    // Decorative separators are hidden from assistive tech.
    await expect(
      canvasElement.querySelectorAll('[aria-hidden="true"]').length
    ).toBeGreaterThan(0)
  },
}

/**
 * A11y regression (2026-07-11 review): when the current page (`isActive`) ALSO
 * carries an `onClick`, the consumer has opted the current crumb into being an
 * interactive control — so it renders as a native `<button aria-current="page">`
 * that is keyboard-focusable and Enter/Space-operable, matching its mouse
 * operability (WCAG 2.1.1). A prior span+onClick was mouse-clickable but not
 * keyboard-operable. (Without an `onClick` the current page stays non-interactive
 * text — see CurrentPageAndSeparators.)
 */
export const ActiveCrumbWithOnClick: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Current Page', isActive: true, onClick: fn() },
    ],
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    // The active+onClick crumb is a real button carrying aria-current="page".
    const current = canvas.getByRole('button', { name: 'Current Page' })
    await expect(current).toHaveAttribute('aria-current', 'page')
    // Keyboard-operable: Tab past the Home link onto the current-page button
    // (drives :focus-visible), then activate it with Enter AND Space — both
    // must fire onClick (was a mouse-only <span> before the fix).
    await userEvent.tab()
    await userEvent.tab()
    await expect(current).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(args.items[1]?.onClick).toHaveBeenCalledTimes(1)
    await userEvent.keyboard(' ')
    await expect(args.items[1]?.onClick).toHaveBeenCalledTimes(2)
  },
}
