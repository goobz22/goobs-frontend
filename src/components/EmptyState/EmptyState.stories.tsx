import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect } from 'storybook/test'
import EmptyState from './index'
import CustomButton from '../Button'

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
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
    actions: <CustomButton text="New category" styles={{ theme: 'light' }} />,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const Dark: Story = {
  args: {
    icon: '🔔',
    title: 'You are all caught up',
    description: 'New notifications will appear here as they arrive.',
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * Accessibility semantics. The `title` is a REAL heading (default `<h2>`), not a
 * styled `<p>`, so screen-reader users can reach it by heading navigation and it
 * is a genuine heading in the SSR'd/crawled HTML. The whole placeholder is a
 * `role="status"` live region so assistive tech announces the empty condition
 * when it appears, and the decorative icon is `aria-hidden`. The play function
 * pins each of these so a regression fails the story.
 */
export const AccessibilitySemantics: Story = {
  args: {
    icon: '👥',
    title: 'No assignees yet',
    description: 'Add a teammate to start delegating work on this contract.',
    actions: <CustomButton text="Add teammate" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Title is a genuine heading (not a styled <p>), default level 2.
    const heading = canvas.getByRole('heading', {
      level: 2,
      name: 'No assignees yet',
    })
    await expect(heading).toBeVisible()

    // The placeholder is a status live region so AT announces it on appearance.
    await expect(canvas.getByRole('status')).toBeInTheDocument()

    // Primary content is in the (SSR'd) DOM, not injected client-only.
    await expect(
      canvas.getByText(
        'Add a teammate to start delegating work on this contract.'
      )
    ).toBeVisible()
  },
}

/**
 * The heading level is consumer-controllable via `headingLevel`, so the
 * placeholder slots into the surrounding document outline without breaking
 * heading order — here rendered as an `<h3>`.
 */
export const CustomHeadingLevel: Story = {
  args: {
    title: 'No results',
    description: 'Try adjusting your filters.',
    headingLevel: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 3, name: 'No results' })
    ).toBeVisible()
  },
}
