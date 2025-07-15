/**
 * @fileoverview Storybook stories for the Customer form component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import CustomerAddTask from './forms/AddTask/customer'
import { RawTopic, RawQueue, RawSeverityLevel } from './types'

// Sample data for the stories
const sampleRawTopics: RawTopic[] = [
  {
    _id: 't1',
    topic: 'Technical Support',
    description: 'Technical support issues',
  },
  { _id: 't2', topic: 'Billing', description: 'Billing related issues' },
  { _id: 't3', topic: 'General Inquiry', description: 'General questions' },
  { _id: 't4', topic: 'Feature Request', description: 'New feature requests' },
]

const sampleRawQueues: RawQueue[] = [
  { _id: 'q1', queueName: 'Support Queue' },
  { _id: 'q2', queueName: 'Billing Queue' },
  { _id: 'q3', queueName: 'Technical Queue' },
  { _id: 'q4', queueName: 'Management Queue' },
]

const sampleRawSeverityLevels: RawSeverityLevel[] = [
  { _id: 's1', severityLevel: 1, description: 'Critical' },
  { _id: 's2', severityLevel: 2, description: 'High' },
  { _id: 's3', severityLevel: 3, description: 'Medium' },
  { _id: 's4', severityLevel: 4, description: 'Low' },
]

const commonArgs = {
  open: true,
  onClose: () => console.log('Close'),
  onAdd: (task: any) => console.log('Add task:', task),
  topics: sampleRawTopics,
  schedulingQueues: sampleRawQueues,
  severityLevels: sampleRawSeverityLevels,
  companyId: 'comp1',
  createdUserId: 'u1',
}

const meta: Meta<typeof CustomerAddTask> = {
  title: 'ProjectBoard/Forms/Customer',
  component: CustomerAddTask,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Whether the dialog is open',
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}

export default meta
type Story = StoryObj<typeof CustomerAddTask>

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
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}>
        <strong>Light Theme:</strong> Customer form for adding tasks with
        simplified interface.
        <br />
        <strong>Features:</strong> Clean interface focused on customer needs
        with essential fields.
      </div>
      <CustomerAddTask {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'light',
    },
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
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}>
        <strong>Dark Theme:</strong> Customer form with dark styling for
        comfortable use.
        <br />
        <strong>Features:</strong> Professional dark interface optimized for
        customer experience.
      </div>
      <CustomerAddTask {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'dark',
    },
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
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}>
        <strong>Sacred Theme:</strong> Mystical customer form with golden
        aesthetics.
        <br />
        <strong>Features:</strong> Ethereal styling designed for transcendent
        customer experience.
      </div>
      <CustomerAddTask {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'sacred',
    },
  },
}
