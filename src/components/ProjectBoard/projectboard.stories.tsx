// src/components/ProjectBoard/projectboard.stories.tsx

import { Meta, StoryObj } from '@storybook/react'
import ProjectBoard from './index'
import React from 'react'
import { Task, ProjectBoardProps, BoardVariant, BoardType } from './types'

const sampleColumns = [
  { _id: '1', title: 'To Do', description: 'Tasks to be done' },
  {
    _id: '2',
    title: 'In Progress',
    description: 'Tasks currently being worked on',
  },
  { _id: '3', title: 'Done', description: 'Completed tasks' },
]

const sampleTasks: Task[] = [
  {
    _id: 't1',
    title: 'Task 1',
    description: 'Description 1',
    statusId: '1',
    comments: [],
    topicIds: [],
    editHistory: [],
    createdBy: 'Admin',
    severityId: 's1',
    schedulingQueueId: 'q1',
    substatusId: 'ss1',
    severity: 'low',
    schedulingQueue: 'q1',
    status: 'open',
    subStatus: 'new',
    topicLabels: [],
    kbArticles: [],
    teamMember: 'none',
    nextActionDate: '',
    companyId: '',
    customerId: 'c1',
    employeeIds: [],
    articleIds: [],
    customerAssigned: 'c1',
    commentIds: [],
    createdAt: new Date(),
    closedAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 't2',
    title: 'Task 2',
    description: 'Description 2',
    statusId: '2',
    comments: [],
    topicIds: [],
    editHistory: [],
    createdBy: 'Admin',
    severityId: 's1',
    schedulingQueueId: 'q1',
    substatusId: 'ss1',
    severity: 'low',
    schedulingQueue: 'q1',
    status: 'open',
    subStatus: 'new',
    topicLabels: [],
    kbArticles: [],
    teamMember: 'none',
    nextActionDate: '',
    companyId: '',
    customerId: 'c1',
    employeeIds: [],
    articleIds: [],
    customerAssigned: 'c1',
    commentIds: [],
    createdAt: new Date(),
    closedAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 't3',
    title: 'Task 3',
    description: 'Description 3',
    statusId: '3',
    comments: [],
    topicIds: [],
    editHistory: [],
    createdBy: 'Admin',
    severityId: 's1',
    schedulingQueueId: 'q1',
    substatusId: 'ss1',
    severity: 'low',
    schedulingQueue: 'q1',
    status: 'open',
    subStatus: 'new',
    topicLabels: [],
    kbArticles: [],
    teamMember: 'none',
    nextActionDate: '',
    companyId: '',
    customerId: 'c1',
    employeeIds: [],
    articleIds: [],
    customerAssigned: 'c1',
    commentIds: [],
    createdAt: new Date(),
    closedAt: new Date(),
    updatedAt: new Date(),
  },
]

const commonArgs: Partial<ProjectBoardProps> = {
  columns: sampleColumns,
  tasks: sampleTasks,
  currentUser: { _id: 'u1', firstName: 'Test', lastName: 'User' },
  onAdd: (task: Omit<Task, '_id'>) => console.log('Add task:', task),
  onEdit: (task: { _id: string }) => console.log('Edit task:', task),
  onDelete: (task: { _id: string }) => console.log('Delete task:', task),
  onDuplicate: (task: { _id: string }) => console.log('Duplicate task:', task),
  onComment: (text: string, taskId: string) =>
    console.log('Add comment:', text, 'to task:', taskId),
  onEditComment: (commentId: string, text: string, taskId: string) =>
    console.log('Edit comment:', commentId, text, 'to task:', taskId),
}

const meta: Meta<typeof ProjectBoard> = {
  title: 'Components/ProjectBoard',
  component: ProjectBoard,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['administrator', 'company', 'customer'],
    },
  },
}

export default meta
type Story = StoryObj<typeof ProjectBoard>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  args: {
    ...commonArgs,
    variant: 'administrator',
    boardType: 'status',
    styles: {
      theme: 'light',
    },
  } as ProjectBoardProps,
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  args: {
    ...commonArgs,
    variant: 'administrator',
    boardType: 'status',
    styles: {
      theme: 'sacred',
    },
  } as ProjectBoardProps,
}

const InteractiveDemoRenderer = () => {
  const [isSacredTheme, setIsSacredTheme] = React.useState(false)
  const [variant, setVariant] = React.useState<BoardVariant>('administrator')
  const [boardType, setBoardType] = React.useState<BoardType>('status')

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: isSacredTheme ? 'black' : '#f3f4f6',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 100,
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={isSacredTheme}
            onChange={e => setIsSacredTheme(e.target.checked)}
          />
          <span style={{ marginLeft: '0.5rem' }}>Sacred Theme</span>
        </label>
        <select
          value={variant}
          onChange={e => setVariant(e.target.value as BoardVariant)}
        >
          <option value="administrator">Administrator</option>
          <option value="company">Company</option>
          <option value="customer">Customer</option>
        </select>
        <select
          value={boardType}
          onChange={e => setBoardType(e.target.value as BoardType)}
        >
          <option value="status">Status</option>
          <option value="severityLevel">Severity</option>
          <option value="subStatus">Sub-Status</option>
          <option value="topic">Topic</option>
        </select>
      </div>
      <ProjectBoard
        {...commonArgs}
        columns={sampleColumns}
        tasks={sampleTasks}
        currentUser={{ _id: 'u1', firstName: 'Test', lastName: 'User' }}
        styles={{
          theme: isSacredTheme ? 'sacred' : 'light',
        }}
        variant={variant}
        boardType={boardType}
        rawArticles={[]}
        rawCompanies={[]}
        rawCustomers={[]}
        rawEmployees={[]}
        rawQueues={[]}
        rawSeverityLevels={[]}
        rawStatuses={[]}
        rawSubStatuses={[]}
        rawTopics={[]}
        onRevisionHistory={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        onDuplicate={() => {}}
        onAdd={() => {}}
        onComment={() => {}}
        onEditComment={() => {}}
      />
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}
