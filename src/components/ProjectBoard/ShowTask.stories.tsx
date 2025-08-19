import type { Meta, StoryObj } from '@storybook/react'
import ShowTask from './forms/ShowTask/client'

const meta = {
  title: 'ProjectBoard/Forms/ShowTask',
  component: ShowTask,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A responsive task display dialog with comprehensive task information and editing capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the dialog is open or closed',
    },
    taskTitle: {
      control: 'text',
      description: 'The title of the task',
    },
    description: {
      control: 'text',
      description: 'The task description',
    },
    currentUserName: {
      control: 'text',
      description: 'Name of the current user',
    },
  },
} satisfies Meta<typeof ShowTask>

export default meta
type Story = StoryObj<typeof meta>

// Mock data for the stories
const mockCustomerOptions = [
  { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
  { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
  { _id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
]

const mockSeverityOptions = [
  { _id: '1', severityLevel: 1, description: 'Low' },
  { _id: '2', severityLevel: 2, description: 'Medium' },
  { _id: '3', severityLevel: 3, description: 'High' },
  { _id: '4', severityLevel: 4, description: 'Critical' },
]

const mockSchedulingQueueOptions = [
  { _id: '1', queueName: 'Development', description: 'Development tasks' },
  { _id: '2', queueName: 'Support', description: 'Support requests' },
  { _id: '3', queueName: 'Sales', description: 'Sales inquiries' },
]

const mockStatusOptions = [
  { _id: '1', status: 'Open' },
  { _id: '2', status: 'In Progress' },
  { _id: '3', status: 'Pending' },
  { _id: '4', status: 'Closed' },
]

const mockSubStatusOptions = [
  { _id: '1', subStatus: 'New', statusId: '1' },
  { _id: '2', subStatus: 'Assigned', statusId: '2' },
  { _id: '3', subStatus: 'Under Review', statusId: '2' },
  { _id: '4', subStatus: 'Waiting for Customer', statusId: '3' },
  { _id: '5', subStatus: 'Resolved', statusId: '4' },
]

const mockTopicOptions = [
  { _id: '1', topic: 'Bug Report' },
  { _id: '2', topic: 'Feature Request' },
  { _id: '3', topic: 'Documentation' },
  { _id: '4', topic: 'Training' },
]

const mockKnowledgebaseArticleOptions = [
  { _id: '1', articleTitle: 'How to Reset Password' },
  { _id: '2', articleTitle: 'API Documentation' },
  { _id: '3', articleTitle: 'Troubleshooting Guide' },
  { _id: '4', articleTitle: 'Best Practices' },
]

const mockTeamMemberOptions = [
  {
    _id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@company.com',
  },
  { _id: '2', firstName: 'Bob', lastName: 'Smith', email: 'bob@company.com' },
  {
    _id: '3',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie@company.com',
  },
]

const mockComments = [
  {
    _id: '1',
    text: 'Initial task created. Waiting for customer feedback.',
    createdBy: 'Alice Johnson',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    editHistory: [
      {
        _id: 'rev-orig-1',
        editedBy: 'Alice Johnson',
        editedAt: new Date('2024-01-15T10:00:00Z'),
        text: 'Initial task created. Waiting for customer feedback.',
        isOriginal: true,
      },
    ],
  },
  {
    _id: '2',
    text: 'Customer has provided additional details. Moving to development.',
    createdBy: 'Bob Smith',
    createdAt: new Date('2024-01-16T14:30:00Z'),
    editHistory: [
      {
        _id: 'rev-orig-2',
        editedBy: 'Bob Smith',
        editedAt: new Date('2024-01-16T14:30:00Z'),
        text: 'Customer responded. Moving forward.',
        isOriginal: true,
      },
      {
        _id: 'rev-edit-2',
        editedBy: 'Bob Smith',
        editedAt: new Date('2024-01-16T14:35:00Z'),
        text: 'Customer has provided additional details. Moving to development.',
        isOriginal: false,
      },
    ],
  },
]

const baseArgs = {
  open: true,
  taskId: 'task-1',
  taskTitle: 'Fix login authentication issue',
  createdBy: 'Alice Johnson',
  description:
    'Users are experiencing intermittent login failures when using the mobile app. This appears to be related to the token refresh mechanism.',
  comments: mockComments,
  customerAssigned: '1',
  severity: '2',
  schedulingQueue: '1',
  status: '2',
  subStatus: '2',
  topics: ['1', '2'],
  knowledgebaseArticles: ['1', '3'],
  teamMemberAssigned: '1',
  nextActionDate: '2024-01-20',
  customerOptions: mockCustomerOptions,
  severityOptions: mockSeverityOptions,
  schedulingQueueOptions: mockSchedulingQueueOptions,
  statusOptions: mockStatusOptions,
  subStatusOptions: mockSubStatusOptions,
  topicOptions: mockTopicOptions,
  knowledgebaseArticleOptions: mockKnowledgebaseArticleOptions,
  teamMemberOptions: mockTeamMemberOptions,
  currentUserName: 'Current User',
  onCloseTask: (taskId: string) => console.log('Close task:', taskId),
  onComment: (commentText: string, _id: string) =>
    console.log('Add comment:', commentText, _id),
  onEdit: (updatedData: any) => console.log('Edit task:', updatedData),
  onDelete: () => console.log('Delete task'),
  onDuplicate: () => console.log('Duplicate task'),
  onEditComment: (commentId: string, newText: string, taskId: string) =>
    console.log('Edit comment:', commentId, newText, taskId),
  onRevisionHistory: (commentId: string, revisionHistory: any[]) =>
    console.log('Revision history:', commentId, revisionHistory),
  onClose: () => console.log('Close dialog'),
}

export const Light: Story = {
  args: {
    ...baseArgs,
    styles: { theme: 'light' },
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
}

export const Dark: Story = {
  args: {
    ...baseArgs,
    styles: { theme: 'dark' },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}

export const Sacred: Story = {
  args: {
    ...baseArgs,
    styles: { theme: 'sacred' },
  },
  parameters: {
    backgrounds: {
      default: 'sacred',
    },
  },
}
