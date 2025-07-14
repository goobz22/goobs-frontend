// src/components/ProjectBoard/projectboard.stories.tsx

import { Meta, StoryObj } from '@storybook/react'
import ProjectBoard from './index'
import React from 'react'
import {
  Task,
  ProjectBoardProps,
  BoardVariant,
  BoardType,
  RawStatus,
  RawSubStatus,
  RawTopic,
  RawQueue,
  RawArticle,
  RawCustomer,
  RawEmployee,
  RawCompany,
  RawSeverityLevel,
} from './types'

// Import individual form components
import AdministratorAddTaskCompanyProvided from './forms/AddTask/administrator/companyProvided'
import AdministratorAddTaskCompanyDropdown from './forms/AddTask/administrator/companyDropdown'
import CompanyAddTaskCustomerProvided from './forms/AddTask/company/customerProvided'
import CompanyAddTaskCustomerDropdown from './forms/AddTask/company/customerDropdown'
import CustomerAddTask from './forms/AddTask/customer'
import NoUserAddTask from './forms/AddTask/noUser'

// Sample raw data for all the components
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

const sampleRawCustomers: RawCustomer[] = [
  {
    _id: 'c1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  },
  {
    _id: 'c2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
  },
  {
    _id: 'c3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
  },
]

const sampleRawEmployees: RawEmployee[] = [
  { _id: 'e1', firstName: 'Alice', lastName: 'Admin' },
  { _id: 'e2', firstName: 'Bob', lastName: 'Manager' },
  { _id: 'e3', firstName: 'Charlie', lastName: 'Developer' },
]

const sampleRawCompanies: RawCompany[] = [
  { _id: 'comp1', companyName: 'Tech Solutions Inc.' },
  { _id: 'comp2', companyName: 'Digital Services LLC' },
  { _id: 'comp3', companyName: 'Innovation Corp' },
]

const sampleRawSeverityLevels: RawSeverityLevel[] = [
  { _id: 's1', severityLevel: 1, description: 'Critical' },
  { _id: 's2', severityLevel: 2, description: 'High' },
  { _id: 's3', severityLevel: 3, description: 'Medium' },
  { _id: 's4', severityLevel: 4, description: 'Low' },
]

const sampleColumns = [
  { _id: '1', title: 'Open', description: 'Open tasks' },
  {
    _id: '2',
    title: 'In Progress',
    description: 'Tasks currently being worked on',
  },
  { _id: '3', title: 'Closed', description: 'Completed tasks' },
]

const sampleTasks: Task[] = [
  {
    _id: 't1',
    title: 'Fix login issue',
    description: 'User cannot log in to their account',
    statusId: '1',
    comments: [],
    topicIds: ['t1'],
    editHistory: [],
    createdBy: 'Admin',
    severityId: 's1',
    schedulingQueueId: 'q1',
    substatusId: 'ss1',
    severity: 'Critical',
    schedulingQueue: 'Support Queue',
    status: 'Open',
    subStatus: 'New',
    topicLabels: ['Technical Support'],
    kbArticles: ['How to troubleshoot connection issues'],
    teamMember: 'Alice Admin',
    nextActionDate: '12/15/2023 - 9:00AM CST',
    companyId: 'comp1',
    customerId: 'c1',
    employeeIds: ['e1'],
    articleIds: ['a1'],
    customerAssigned: 'John Doe',
    commentIds: [],
    createdAt: new Date(),
    closedAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 't2',
    title: 'Update billing information',
    description: 'Customer needs to update their billing address',
    statusId: '2',
    comments: [],
    topicIds: ['t2'],
    editHistory: [],
    createdBy: 'Admin',
    severityId: 's3',
    schedulingQueueId: 'q2',
    substatusId: 'ss3',
    severity: 'Medium',
    schedulingQueue: 'Billing Queue',
    status: 'In Progress',
    subStatus: 'Working',
    topicLabels: ['Billing'],
    kbArticles: ['Understanding billing cycles'],
    teamMember: 'Bob Manager',
    nextActionDate: '12/16/2023 - 2:00PM CST',
    companyId: 'comp2',
    customerId: 'c2',
    employeeIds: ['e2'],
    articleIds: ['a2'],
    customerAssigned: 'Jane Smith',
    commentIds: [],
    createdAt: new Date(),
    closedAt: new Date(),
    updatedAt: new Date(),
  },
]

const commonArgs: Partial<ProjectBoardProps> = {
  columns: sampleColumns,
  tasks: sampleTasks,
  rawStatuses: sampleRawStatuses,
  rawSubStatuses: sampleRawSubStatuses,
  rawTopics: sampleRawTopics,
  rawQueues: sampleRawQueues,
  rawArticles: sampleRawArticles,
  rawCustomers: sampleRawCustomers,
  rawEmployees: sampleRawEmployees,
  rawCompanies: sampleRawCompanies,
  rawSeverityLevels: sampleRawSeverityLevels,
  currentUser: { _id: 'u1', firstName: 'Test', lastName: 'User' },
  onAdd: (task: Omit<Task, '_id'>) => console.log('Add task:', task),
  onEdit: (task: { _id: string }) => console.log('Edit task:', task),
  onDelete: (task: { _id: string }) => console.log('Delete task:', task),
  onDuplicate: (task: { _id: string }) => console.log('Duplicate task:', task),
  onComment: (text: string, taskId: string) =>
    console.log('Add comment:', text, 'to task:', taskId),
  onEditComment: (commentId: string, text: string, taskId: string) =>
    console.log('Edit comment:', commentId, text, 'to task:', taskId),
  onRevisionHistory: (commentId: string, revisionHistory: any[]) =>
    console.log('Revision history:', commentId, revisionHistory),
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
    boardType: {
      control: 'radio',
      options: ['status', 'severityLevel', 'subStatus', 'topic'],
    },
  },
}

export default meta
type Story = StoryObj<typeof ProjectBoard>

// Main board stories
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

// Board type variants
export const StatusBoard: Story = {
  name: 'Status Board',
  args: {
    ...commonArgs,
    variant: 'administrator',
    boardType: 'status',
    styles: {
      theme: 'light',
    },
  } as ProjectBoardProps,
}

export const SeverityBoard: Story = {
  name: 'Severity Board',
  args: {
    ...commonArgs,
    variant: 'administrator',
    boardType: 'severityLevel',
    columns: [
      { _id: 's1', title: 'Critical', description: 'Critical issues' },
      { _id: 's2', title: 'High', description: 'High priority issues' },
      { _id: 's3', title: 'Medium', description: 'Medium priority issues' },
      { _id: 's4', title: 'Low', description: 'Low priority issues' },
    ],
    styles: {
      theme: 'light',
    },
  } as ProjectBoardProps,
}

export const TopicBoard: Story = {
  name: 'Topic Board',
  args: {
    ...commonArgs,
    variant: 'administrator',
    boardType: 'topic',
    columns: [
      {
        _id: 't1',
        title: 'Technical Support',
        description: 'Technical support issues',
      },
      { _id: 't2', title: 'Billing', description: 'Billing related issues' },
      { _id: 't3', title: 'General Inquiry', description: 'General questions' },
      {
        _id: 't4',
        title: 'Feature Request',
        description: 'New feature requests',
      },
    ],
    styles: {
      theme: 'light',
    },
  } as ProjectBoardProps,
}

// Individual Form Stories
export const AdministratorFormCompanyProvided: Story = {
  name: 'Form: Administrator - Company Provided',
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#f3f4f6' }}>
      <AdministratorAddTaskCompanyProvided
        open={true}
        onClose={() => console.log('Close')}
        onAdd={task => console.log('Add task:', task)}
        statuses={sampleRawStatuses}
        subStatuses={sampleRawSubStatuses}
        topics={sampleRawTopics}
        schedulingQueues={sampleRawQueues}
        knowledgebaseArticles={sampleRawArticles}
        severityLevels={sampleRawSeverityLevels}
        companyId="comp1"
        createdUserId="u1"
        sacredtheme={false}
      />
    </div>
  ),
}

export const AdministratorFormCompanyProvidedSacred: Story = {
  name: 'Form: Administrator - Company Provided (Sacred)',
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#000' }}>
      <AdministratorAddTaskCompanyProvided
        open={true}
        onClose={() => console.log('Close')}
        onAdd={task => console.log('Add task:', task)}
        statuses={sampleRawStatuses}
        subStatuses={sampleRawSubStatuses}
        topics={sampleRawTopics}
        schedulingQueues={sampleRawQueues}
        knowledgebaseArticles={sampleRawArticles}
        severityLevels={sampleRawSeverityLevels}
        companyId="comp1"
        createdUserId="u1"
        sacredtheme={true}
      />
    </div>
  ),
}

export const AdministratorFormCompanyDropdown: Story = {
  name: 'Form: Administrator - Company Dropdown',
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#f3f4f6' }}>
      <AdministratorAddTaskCompanyDropdown
        open={true}
        onClose={() => console.log('Close')}
        onAdd={task => console.log('Add task:', task)}
        statuses={sampleRawStatuses}
        subStatuses={sampleRawSubStatuses}
        topics={sampleRawTopics}
        schedulingQueues={sampleRawQueues}
        knowledgebaseArticles={sampleRawArticles}
        severityLevels={sampleRawSeverityLevels}
        rawCompanies={sampleRawCompanies}
        createdUserId="u1"
        sacredtheme={false}
      />
    </div>
  ),
}

export const AdministratorFormCompanyDropdownSacred: Story = {
  name: 'Form: Administrator - Company Dropdown (Sacred)',
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#000' }}>
      <AdministratorAddTaskCompanyDropdown
        open={true}
        onClose={() => console.log('Close')}
        onAdd={task => console.log('Add task:', task)}
        statuses={sampleRawStatuses}
        subStatuses={sampleRawSubStatuses}
        topics={sampleRawTopics}
        schedulingQueues={sampleRawQueues}
        knowledgebaseArticles={sampleRawArticles}
        severityLevels={sampleRawSeverityLevels}
        rawCompanies={sampleRawCompanies}
        createdUserId="u1"
        sacredtheme={true}
      />
    </div>
  ),
}

export const CompanyFormCustomerProvided: Story = {
  name: 'Form: Company - Customer Provided',
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#f3f4f6' }}>
      <CompanyAddTaskCustomerProvided
        open={true}
        onClose={() => console.log('Close')}
        onAdd={task => console.log('Add task:', task)}
        statuses={sampleRawStatuses}
        subStatuses={sampleRawSubStatuses}
        topics={sampleRawTopics}
        schedulingQueues={sampleRawQueues}
        knowledgebaseArticles={sampleRawArticles}
        severityLevels={sampleRawSeverityLevels}
        customerId="c1"
        createdUserId="u1"
        sacredtheme={false}
      />
    </div>
  ),
}

export const CompanyFormCustomerProvidedSacred: Story = {
  name: 'Form: Company - Customer Provided (Sacred)',
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#000' }}>
      <CompanyAddTaskCustomerProvided
        open={true}
        onClose={() => console.log('Close')}
        onAdd={task => console.log('Add task:', task)}
        statuses={sampleRawStatuses}
        subStatuses={sampleRawSubStatuses}
        topics={sampleRawTopics}
        schedulingQueues={sampleRawQueues}
        knowledgebaseArticles={sampleRawArticles}
        severityLevels={sampleRawSeverityLevels}
        customerId="c1"
        createdUserId="u1"
        sacredtheme={true}
      />
    </div>
  ),
}

export const CompanyFormCustomerDropdown: Story = {
  name: 'Form: Company - Customer Dropdown',
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#f3f4f6' }}>
      <CompanyAddTaskCustomerDropdown
        open={true}
        onClose={() => console.log('Close')}
        onAdd={task => console.log('Add task:', task)}
        statuses={sampleRawStatuses}
        subStatuses={sampleRawSubStatuses}
        topics={sampleRawTopics}
        schedulingQueues={sampleRawQueues}
        knowledgebaseArticles={sampleRawArticles}
        severityLevels={sampleRawSeverityLevels}
        rawCustomers={sampleRawCustomers}
        createdUserId="u1"
        sacredtheme={false}
      />
    </div>
  ),
}

export const CompanyFormCustomerDropdownSacred: Story = {
  name: 'Form: Company - Customer Dropdown (Sacred)',
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#000' }}>
      <CompanyAddTaskCustomerDropdown
        open={true}
        onClose={() => console.log('Close')}
        onAdd={task => console.log('Add task:', task)}
        statuses={sampleRawStatuses}
        subStatuses={sampleRawSubStatuses}
        topics={sampleRawTopics}
        schedulingQueues={sampleRawQueues}
        knowledgebaseArticles={sampleRawArticles}
        severityLevels={sampleRawSeverityLevels}
        rawCustomers={sampleRawCustomers}
        createdUserId="u1"
        sacredtheme={true}
      />
    </div>
  ),
}

export const CustomerForm: Story = {
  name: 'Form: Customer',
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#f3f4f6' }}>
      <CustomerAddTask
        open={true}
        onClose={() => console.log('Close')}
        onAdd={task => console.log('Add task:', task)}
        topics={sampleRawTopics}
        schedulingQueues={sampleRawQueues}
        severityLevels={sampleRawSeverityLevels}
        companyId="comp1"
        createdUserId="u1"
        styles={{ theme: 'light' }}
      />
    </div>
  ),
}

export const CustomerFormSacred: Story = {
  name: 'Form: Customer (Sacred)',
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#000' }}>
      <CustomerAddTask
        open={true}
        onClose={() => console.log('Close')}
        onAdd={task => console.log('Add task:', task)}
        topics={sampleRawTopics}
        schedulingQueues={sampleRawQueues}
        severityLevels={sampleRawSeverityLevels}
        companyId="comp1"
        createdUserId="u1"
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

export const NoUserForm: Story = {
  name: 'Form: No User',
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#f3f4f6' }}>
      <NoUserAddTask
        onAdd={task => console.log('Add task:', task)}
        severityLevels={sampleRawSeverityLevels}
        sacredtheme={false}
      />
    </div>
  ),
}

export const NoUserFormSacred: Story = {
  name: 'Form: No User (Sacred)',
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#000' }}>
      <NoUserAddTask
        onAdd={task => console.log('Add task:', task)}
        severityLevels={sampleRawSeverityLevels}
        sacredtheme={true}
      />
    </div>
  ),
}

const InteractiveDemoRenderer = () => {
  const [isSacredTheme, setIsSacredTheme] = React.useState(false)
  const [variant, setVariant] = React.useState<BoardVariant>('administrator')
  const [boardType, setBoardType] = React.useState<BoardType>('status')

  const getColumnsForBoardType = (type: BoardType) => {
    switch (type) {
      case 'severityLevel':
        return [
          { _id: 's1', title: 'Critical', description: 'Critical issues' },
          { _id: 's2', title: 'High', description: 'High priority issues' },
          { _id: 's3', title: 'Medium', description: 'Medium priority issues' },
          { _id: 's4', title: 'Low', description: 'Low priority issues' },
        ]
      case 'topic':
        return [
          {
            _id: 't1',
            title: 'Technical Support',
            description: 'Technical support issues',
          },
          {
            _id: 't2',
            title: 'Billing',
            description: 'Billing related issues',
          },
          {
            _id: 't3',
            title: 'General Inquiry',
            description: 'General questions',
          },
          {
            _id: 't4',
            title: 'Feature Request',
            description: 'New feature requests',
          },
        ]
      case 'subStatus':
        return [
          { _id: 'ss1', title: 'New', description: 'New tasks' },
          { _id: 'ss2', title: 'Assigned', description: 'Assigned tasks' },
          { _id: 'ss3', title: 'Working', description: 'Working on tasks' },
          { _id: 'ss4', title: 'Testing', description: 'Testing tasks' },
        ]
      default:
        return sampleColumns
    }
  }

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
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
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
        columns={getColumnsForBoardType(boardType)}
        tasks={sampleTasks}
        rawStatuses={sampleRawStatuses}
        rawSubStatuses={sampleRawSubStatuses}
        rawTopics={sampleRawTopics}
        rawQueues={sampleRawQueues}
        rawArticles={sampleRawArticles}
        rawCustomers={sampleRawCustomers}
        rawEmployees={sampleRawEmployees}
        rawCompanies={sampleRawCompanies}
        rawSeverityLevels={sampleRawSeverityLevels}
        currentUser={{ _id: 'u1', firstName: 'Test', lastName: 'User' }}
        onAdd={(task: Omit<Task, '_id'>) => console.log('Add task:', task)}
        onEdit={(task: { _id: string }) => console.log('Edit task:', task)}
        onDelete={(task: { _id: string }) => console.log('Delete task:', task)}
        onDuplicate={(task: { _id: string }) =>
          console.log('Duplicate task:', task)
        }
        onComment={(text: string, taskId: string) =>
          console.log('Add comment:', text, 'to task:', taskId)
        }
        onEditComment={(commentId: string, text: string, taskId: string) =>
          console.log('Edit comment:', commentId, text, 'to task:', taskId)
        }
        onRevisionHistory={(commentId: string, revisionHistory: any[]) =>
          console.log('Revision history:', commentId, revisionHistory)
        }
        styles={{
          theme: isSacredTheme ? 'sacred' : 'light',
        }}
        variant={variant}
        boardType={boardType}
        customerId={variant === 'customer' ? 'c1' : undefined}
        companyId={variant !== 'customer' ? 'comp1' : undefined}
      />
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}
