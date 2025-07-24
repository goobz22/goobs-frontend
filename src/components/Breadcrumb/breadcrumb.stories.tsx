import type { Meta, StoryObj } from '@storybook/react'
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
  tags: ['autodocs'],
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
}

export const Dark: Story = {
  args: {
    items: sampleItems,
    styles: { theme: 'dark' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const Sacred: Story = {
  args: {
    items: sampleItems,
    styles: { theme: 'sacred' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const WithCustomSeparator: Story = {
  args: {
    items: sampleItems,
    separator: <ChevronRightIcon />,
    styles: { theme: 'sacred' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
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
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
