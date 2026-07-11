import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test'
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
}

/**
 * A11y: the current page is the last crumb (`isActive: true`) and is rendered
 * as non-navigable text carrying `aria-current="page"`; the `/` separators are
 * decorative and hidden from assistive tech via `aria-hidden`. Keyboard-focus
 * any link to see the `:focus-visible` ring.
 */
export const CurrentPageAndSeparators: Story = {
  args: {
    items: sampleItems,
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}
