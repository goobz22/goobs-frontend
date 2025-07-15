/**
 * @fileoverview Storybook stories for the No User form component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import NoUserAddTask from './forms/AddTask/noUser'
import { RawSeverityLevel } from './types'

// Sample data for the stories
const sampleRawSeverityLevels: RawSeverityLevel[] = [
  { _id: 's1', severityLevel: 1, description: 'Critical' },
  { _id: 's2', severityLevel: 2, description: 'High' },
  { _id: 's3', severityLevel: 3, description: 'Medium' },
  { _id: 's4', severityLevel: 4, description: 'Low' },
]

const commonArgs = {
  onAdd: (task: any) => console.log('Add task:', task),
  severityLevels: sampleRawSeverityLevels,
}

const meta: Meta<typeof NoUserAddTask> = {
  title: 'ProjectBoard/Forms/No User',
  component: NoUserAddTask,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    sacredtheme: {
      control: { type: 'boolean' },
      description: 'Enable sacred theme styling',
    },
  },
}

export default meta
type Story = StoryObj<typeof NoUserAddTask>

export const LightTheme: Story = {
  name: 'Light Theme',
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Light Theme:</strong> No user form for anonymous task
          submission.
          <br />
          <strong>Features:</strong> Simple form for users to submit tasks
          without registration.
        </div>
        <NoUserAddTask {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    sacredtheme: false,
  },
}

export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Dark Theme:</strong> No user form with dark styling for
          anonymous submissions.
          <br />
          <strong>Features:</strong> Professional dark interface for guest task
          creation.
        </div>
        <NoUserAddTask {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    sacredtheme: false,
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div
      style={{
        backgroundColor: '#1C1917',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Sacred Theme:</strong> Mystical no user form with golden
          aesthetics for anonymous submissions.
          <br />
          <strong>Features:</strong> Ethereal styling with sacred glyphs for
          divine task creation.
        </div>
        <NoUserAddTask {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    sacredtheme: true,
  },
}
