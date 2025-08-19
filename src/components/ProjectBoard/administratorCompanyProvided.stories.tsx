/**
 * @fileoverview Storybook stories for the Administrator Company Provided form component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import AdministratorAddTaskCompanyProvided from './forms/AddTask/administrator/companyProvided'
import {
  RawStatus,
  RawSubStatus,
  RawTopic,
  RawQueue,
  RawArticle,
  RawSeverityLevel,
} from './types'

// Sample data for the stories
const sampleRawStatuses: RawStatus[] = [
  { _id: '1', status: 'Open', description: 'Open tasks' },
  { _id: '2', status: 'In Progress', description: 'Tasks being worked on' },
  { _id: '3', status: 'Closed', description: 'Completed tasks' },
  { _id: '4', status: 'On Hold', description: 'Tasks on hold' },
]

const sampleRawSubStatuses: RawSubStatus[] = [
  { _id: 'ss1', subStatus: 'New', description: 'New task', statusId: '1' },
  {
    _id: 'ss2',
    subStatus: 'Assigned',
    description: 'Assigned task',
    statusId: '1',
  },
  {
    _id: 'ss3',
    subStatus: 'Working',
    description: 'Working on task',
    statusId: '2',
  },
  {
    _id: 'ss4',
    subStatus: 'Testing',
    description: 'Testing task',
    statusId: '2',
  },
  {
    _id: 'ss5',
    subStatus: 'Completed',
    description: 'Completed task',
    statusId: '3',
  },
  {
    _id: 'ss6',
    subStatus: 'Waiting',
    description: 'Waiting for response',
    statusId: '4',
  },
]

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

const sampleRawArticles: RawArticle[] = [
  { _id: 'a1', articleTitle: 'How to troubleshoot connection issues' },
  { _id: 'a2', articleTitle: 'Understanding billing cycles' },
  { _id: 'a3', articleTitle: 'Setting up user accounts' },
  { _id: 'a4', articleTitle: 'API documentation' },
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
  statuses: sampleRawStatuses,
  subStatuses: sampleRawSubStatuses,
  topics: sampleRawTopics,
  schedulingQueues: sampleRawQueues,
  knowledgebaseArticles: sampleRawArticles,
  severityLevels: sampleRawSeverityLevels,
  companyId: 'comp1',
  createdUserId: 'u1',
}

const meta: Meta<typeof AdministratorAddTaskCompanyProvided> = {
  title: 'ProjectBoard/Forms/Administrator Company Provided',
  component: AdministratorAddTaskCompanyProvided,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Whether the dialog is open',
    },
    styles: {
      control: { type: 'object' },
      description: 'Theme styling options',
    },
  },
}

export default meta
type Story = StoryObj<typeof AdministratorAddTaskCompanyProvided>

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
        <strong>Light Theme:</strong> Responsive form that adapts to screen
        size.
        <br />
        <strong>Layout:</strong> 1 dropdown per row (mobile), 2 per row
        (tablet), 3 per row (desktop).
      </div>
      <AdministratorAddTaskCompanyProvided {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    styles: { theme: 'light' },
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
        <strong>Dark Theme:</strong> Responsive form with dark styling.
        <br />
        <strong>Layout:</strong> Adapts from 1 column (mobile) to 2 columns
        (tablet) to 3 columns (desktop).
      </div>
      <AdministratorAddTaskCompanyProvided {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    styles: { theme: 'dark' },
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
        <strong>Sacred Theme:</strong> Mystical responsive form with sacred
        aesthetics.
        <br />
        <strong>Layout:</strong> Divine responsive experience that scales across
        all devices.
      </div>
      <AdministratorAddTaskCompanyProvided {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    styles: { theme: 'sacred' },
  },
}
