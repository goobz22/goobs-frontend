import type { Meta, StoryObj } from '@storybook/react'
import EmptyState from './index'
import CustomButton from '../Button'

const meta: Meta<typeof EmptyState> = {
  title: 'Primitives/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
  argTypes: {
    icon: { control: false },
    actions: { control: false },
  },
}

export default meta

type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {
    icon: '👥',
    title: 'No assignees yet',
    description: 'Add a teammate to start delegating work on this contract.',
  },
}

export const WithAction: Story = {
  args: {
    icon: '📄',
    title: 'No documents uploaded',
    description: 'Drop a file here or browse to attach your first document.',
    actions: <CustomButton text="Upload document" />,
  },
}

export const TitleOnly: Story = {
  args: {
    title: 'No results',
  },
}

export const Light: Story = {
  args: {
    icon: '🗂️',
    title: 'No categories yet',
    description: 'Create your first category to organize products.',
    actions: <CustomButton text="New category" />,
    styles: { theme: 'light' },
  },
}

export const Dark: Story = {
  args: {
    icon: '🔔',
    title: 'You are all caught up',
    description: 'New notifications will appear here as they arrive.',
    styles: { theme: 'dark' },
  },
}
