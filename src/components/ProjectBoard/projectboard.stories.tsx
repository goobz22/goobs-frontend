// src/components/ProjectBoard/projectboard.stories.tsx

import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import ProjectBoard from './index'
import { ProjectBoardProps, Task, CommentEditHistory } from './types'

// For standalone popups:
import NoUserAddTask from './forms/AddTask/noUser'
import ShowTask from './forms/ShowTask/client'

// New AddTask variant imports:
import AdministratorAddTaskCompanyDropdown from './forms/AddTask/administrator/companyDropdown'
import AdministratorAddTaskCompanyProvided from './forms/AddTask/administrator/companyProvided'
import CompanyAddTaskCustomerDropdown from './forms/AddTask/company/customerDropdown'
import CompanyAddTaskCustomerProvided from './forms/AddTask/company/customerProvided'
import CustomerAddTask from './forms/AddTask/customer'

const meta: Meta<typeof ProjectBoard> = {
  title: 'Components/ProjectBoard',
  component: ProjectBoard,
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof ProjectBoard>

/* ----------------------------------------------------------------------------
   1) PROJECT BOARD STORIES
---------------------------------------------------------------------------- */

/**
 * Example #1: Status-based board
 */
export const BasicStatusBoard: Story = {
  name: 'Basic Board (Status-based)',
  args: {
    variant: 'company',
    boardType: 'status',
    columns: [
      { _id: 'stat-1', title: 'Open', description: 'Open tasks or tickets' },
      { _id: 'stat-2', title: 'Closed', description: 'Closed tasks' },
    ],
    tasks: [
      {
        _id: 'task-101',
        title: 'Fix login bug',
        description: 'Users cannot log in under certain conditions.',
        severityId: 'sev-2',
        statusId: 'stat-1',
        substatusId: 'sub-1',
        topicIds: ['topic-1'],
        createdAt: new Date(),
        closedAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'System',
        comments: [],
        commentIds: [],
        customerAssigned: '',
        severity: '',
        schedulingQueueId: '',
        schedulingQueue: '',
        status: 'Open',
        subStatus: '',
        topicLabels: [],
        kbArticles: [],
        teamMember: '',
        nextActionDate: '',
        companyId: '',
        customerId: '',
        employeeIds: [],
        articleIds: [],
      },
    ],
    rawStatuses: [
      { _id: 'stat-1', status: 'Open', description: 'Open tasks' },
      { _id: 'stat-2', status: 'Closed', description: 'Closed tasks' },
    ],
    rawSubStatuses: [
      {
        _id: 'sub-1',
        subStatus: 'Pending Info',
        description: 'Waiting on info',
      },
      { _id: 'sub-2', subStatus: 'In Progress', description: 'Working' },
    ],
    rawTopics: [
      { _id: 'topic-1', topic: 'Frontend' },
      { _id: 'topic-2', topic: 'Backend' },
    ],
    rawQueues: [
      { _id: 'queue-1', queueName: 'High Priority' },
      { _id: 'queue-2', queueName: 'Standard' },
    ],
    rawArticles: [
      { _id: 'article-1', articleTitle: 'Setup Guide' },
      { _id: 'article-2', articleTitle: 'Troubleshooting FAQ' },
    ],
    rawCustomers: [
      { _id: 'cust-1', firstName: 'Alice', lastName: 'Wonder' },
      { _id: 'cust-2', firstName: 'Bob', lastName: 'Builder' },
    ],
    rawEmployees: [
      { _id: 'emp-1', firstName: 'John', lastName: 'Doe' },
      { _id: 'emp-2', firstName: 'Jane', lastName: 'Smith' },
    ],
    rawCompanies: [
      { _id: 'comp-1', companyName: 'Acme Inc.' },
      { _id: 'comp-2', companyName: 'TechCorp' },
    ],
    rawSeverityLevels: [
      { _id: 'sev-1', severityLevel: 1, description: 'Low severity' },
      { _id: 'sev-2', severityLevel: 5, description: 'High severity' },
    ],
    currentUser: {
      _id: 'user-1',
      firstName: 'Demo',
      lastName: 'User',
    },
    customerId: 'cust-1',
    companyId: 'comp-1',

    // Callbacks
    onComment: (text: string, taskId: string) =>
      console.log('[BasicStatusBoard] onComment =>', { text, taskId }),
    onEdit: (data: { _id: string }) =>
      console.log('[BasicStatusBoard] onEdit =>', data),
    onDelete: (data: { _id: string }) =>
      console.log('[BasicStatusBoard] onDelete =>', data),
    onDuplicate: (data: { _id: string }) =>
      console.log('[BasicStatusBoard] onDuplicate =>', data),
    onEditComment: (commentId: string, newText: string, taskId: string) =>
      console.log('[BasicStatusBoard] onEditComment =>', {
        commentId,
        newText,
        taskId,
      }),
    onAdd: (newTask: Omit<Task, '_id'>) =>
      console.log('[BasicStatusBoard] onAdd =>', newTask),
    onRevisionHistory: (
      commentId: string,
      revisionHistory: CommentEditHistory[]
    ) =>
      console.log('[BasicStatusBoard] onRevisionHistory =>', {
        commentId,
        revisionHistory,
      }),
  } as ProjectBoardProps,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check for columns
    expect(canvas.getByText('Open')).toBeInTheDocument()
    expect(canvas.getByText('Closed')).toBeInTheDocument()

    // Check for sample tasks
    expect(canvas.getByText('Fix login bug')).toBeInTheDocument()

    // Click task to open ShowTask
    await userEvent.click(canvas.getByText('Fix login bug'))
  },
}

/**
 * Example #2: Severity-based board
 */
export const SeverityBoard: Story = {
  name: 'Severity Board',
  args: {
    variant: 'administrator',
    boardType: 'severityLevel',
    columns: [
      { _id: 'sev-1', title: 'Low', description: 'Low severity tasks' },
      { _id: 'sev-2', title: 'High', description: 'High severity tasks' },
    ],
    tasks: [
      {
        _id: 'task-102',
        title: 'Server outage',
        description: 'Critical server down',
        severityId: 'sev-2',
        statusId: 'stat-1',
        substatusId: 'sub-1',
        topicIds: ['topic-2'],
        createdAt: new Date(),
        closedAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'System',
        comments: [],
        commentIds: [],
        customerAssigned: '',
        severity: 'High',
        schedulingQueueId: '',
        schedulingQueue: '',
        status: '',
        subStatus: '',
        topicLabels: [],
        kbArticles: [],
        teamMember: '',
        nextActionDate: '',
        companyId: '',
        customerId: '',
        employeeIds: [],
        articleIds: [],
      },
    ],
    rawStatuses: [
      { _id: 'stat-1', status: 'Open', description: 'Open tasks' },
      { _id: 'stat-2', status: 'Closed', description: 'Closed tasks' },
    ],
    rawSubStatuses: [
      {
        _id: 'sub-1',
        subStatus: 'Pending Info',
        description: 'Waiting on info',
      },
      { _id: 'sub-2', subStatus: 'In Progress', description: 'Working' },
    ],
    rawTopics: [
      { _id: 'topic-1', topic: 'Frontend' },
      { _id: 'topic-2', topic: 'Backend' },
    ],
    rawQueues: [
      { _id: 'queue-1', queueName: 'High Priority' },
      { _id: 'queue-2', queueName: 'Standard' },
    ],
    rawArticles: [
      { _id: 'article-1', articleTitle: 'Setup Guide' },
      { _id: 'article-2', articleTitle: 'Troubleshooting FAQ' },
    ],
    rawCustomers: [
      { _id: 'cust-1', firstName: 'Alice', lastName: 'Wonder' },
      { _id: 'cust-2', firstName: 'Bob', lastName: 'Builder' },
    ],
    rawEmployees: [
      { _id: 'emp-1', firstName: 'John', lastName: 'Doe' },
      { _id: 'emp-2', firstName: 'Jane', lastName: 'Smith' },
    ],
    rawCompanies: [
      { _id: 'comp-1', companyName: 'Acme Inc.' },
      { _id: 'comp-2', companyName: 'TechCorp' },
    ],
    rawSeverityLevels: [
      { _id: 'sev-1', severityLevel: 1, description: 'Low severity' },
      { _id: 'sev-2', severityLevel: 5, description: 'High severity' },
    ],
    currentUser: {
      _id: 'user-1',
      firstName: 'Demo',
      lastName: 'User',
    },
    customerId: 'cust-1',
    companyId: 'comp-1',

    // Callbacks
    onComment: (text: string, taskId: string) =>
      console.log('[SeverityBoard] onComment =>', { text, taskId }),
    onEdit: (data: { _id: string }) =>
      console.log('[SeverityBoard] onEdit =>', data),
    onDelete: (data: { _id: string }) =>
      console.log('[SeverityBoard] onDelete =>', data),
    onDuplicate: (data: { _id: string }) =>
      console.log('[SeverityBoard] onDuplicate =>', data),
    onEditComment: (commentId: string, newText: string, taskId: string) =>
      console.log('[SeverityBoard] onEditComment =>', {
        commentId,
        newText,
        taskId,
      }),
    onAdd: (newTask: Omit<Task, '_id'>) =>
      console.log('[SeverityBoard] onAdd =>', newTask),
    onRevisionHistory: (
      commentId: string,
      revisionHistory: CommentEditHistory[]
    ) =>
      console.log('[SeverityBoard] onRevisionHistory =>', {
        commentId,
        revisionHistory,
      }),
  } as ProjectBoardProps,

  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('Low')).toBeInTheDocument()
    expect(canvas.getByText('High')).toBeInTheDocument()
  },
}

/**
 * Example #3: SubStatus-based board
 */
export const SubStatusBoard: Story = {
  name: 'SubStatus Board',
  args: {
    variant: 'customer',
    boardType: 'subStatus',
    columns: [
      { _id: 'sub-1', title: 'Pending Info', description: 'Waiting for info' },
      {
        _id: 'sub-2',
        title: 'In Progress',
        description: 'Actively in progress',
      },
    ],
    tasks: [
      {
        _id: 'task-103',
        title: 'Update documentation',
        description: 'Documentation needs review',
        severityId: 'sev-1',
        statusId: 'stat-1',
        substatusId: 'sub-1',
        topicIds: ['topic-1'],
        createdAt: new Date(),
        closedAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'System',
        comments: [],
        commentIds: [],
        customerAssigned: '',
        severity: '',
        schedulingQueueId: '',
        schedulingQueue: '',
        status: '',
        subStatus: 'Pending Info',
        topicLabels: [],
        kbArticles: [],
        teamMember: '',
        nextActionDate: '',
        companyId: '',
        customerId: '',
        employeeIds: [],
        articleIds: [],
      },
    ],
    rawStatuses: [
      { _id: 'stat-1', status: 'Open', description: 'Open tasks' },
      { _id: 'stat-2', status: 'Closed', description: 'Closed tasks' },
    ],
    rawSubStatuses: [
      {
        _id: 'sub-1',
        subStatus: 'Pending Info',
        description: 'Waiting on info',
      },
      { _id: 'sub-2', subStatus: 'In Progress', description: 'Working' },
    ],
    rawTopics: [
      { _id: 'topic-1', topic: 'Frontend' },
      { _id: 'topic-2', topic: 'Backend' },
    ],
    rawQueues: [
      { _id: 'queue-1', queueName: 'High Priority' },
      { _id: 'queue-2', queueName: 'Standard' },
    ],
    rawArticles: [
      { _id: 'article-1', articleTitle: 'Setup Guide' },
      { _id: 'article-2', articleTitle: 'Troubleshooting FAQ' },
    ],
    rawCustomers: [
      { _id: 'cust-1', firstName: 'Alice', lastName: 'Wonder' },
      { _id: 'cust-2', firstName: 'Bob', lastName: 'Builder' },
    ],
    rawEmployees: [
      { _id: 'emp-1', firstName: 'John', lastName: 'Doe' },
      { _id: 'emp-2', firstName: 'Jane', lastName: 'Smith' },
    ],
    rawCompanies: [
      { _id: 'comp-1', companyName: 'Acme Inc.' },
      { _id: 'comp-2', companyName: 'TechCorp' },
    ],
    rawSeverityLevels: [
      { _id: 'sev-1', severityLevel: 1, description: 'Low severity' },
      { _id: 'sev-2', severityLevel: 5, description: 'High severity' },
    ],
    currentUser: {
      _id: 'user-1',
      firstName: 'Demo',
      lastName: 'User',
    },
    customerId: 'cust-1',
    companyId: 'comp-1',

    // Callbacks
    onComment: (text: string, taskId: string) =>
      console.log('[SubStatusBoard] onComment =>', { text, taskId }),
    onEdit: (data: { _id: string }) =>
      console.log('[SubStatusBoard] onEdit =>', data),
    onDelete: (data: { _id: string }) =>
      console.log('[SubStatusBoard] onDelete =>', data),
    onDuplicate: (data: { _id: string }) =>
      console.log('[SubStatusBoard] onDuplicate =>', data),
    onEditComment: (commentId: string, newText: string, taskId: string) =>
      console.log('[SubStatusBoard] onEditComment =>', {
        commentId,
        newText,
        taskId,
      }),
    onAdd: (newTask: Omit<Task, '_id'>) =>
      console.log('[SubStatusBoard] onAdd =>', newTask),
    onRevisionHistory: (
      commentId: string,
      revisionHistory: CommentEditHistory[]
    ) =>
      console.log('[SubStatusBoard] onRevisionHistory =>', {
        commentId,
        revisionHistory,
      }),
  } as ProjectBoardProps,
}

/**
 * Example #4: Topic-based board
 */
export const TopicBoard: Story = {
  name: 'Topic Board',
  args: {
    variant: 'company',
    boardType: 'topic',
    columns: [
      { _id: 'topic-1', title: 'Frontend', description: 'UI tasks' },
      { _id: 'topic-2', title: 'Backend', description: 'Server tasks' },
    ],
    tasks: [
      {
        _id: 'task-104',
        title: 'Implement new feature',
        description: 'Add user dashboard',
        severityId: 'sev-1',
        statusId: 'stat-1',
        substatusId: 'sub-2',
        topicIds: ['topic-1'],
        createdAt: new Date(),
        closedAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'System',
        comments: [],
        commentIds: [],
        customerAssigned: '',
        severity: '',
        schedulingQueueId: '',
        schedulingQueue: '',
        status: '',
        subStatus: '',
        topicLabels: ['Frontend'],
        kbArticles: [],
        teamMember: '',
        nextActionDate: '',
        companyId: '',
        customerId: '',
        employeeIds: [],
        articleIds: [],
      },
    ],
    rawStatuses: [
      { _id: 'stat-1', status: 'Open', description: 'Open tasks' },
      { _id: 'stat-2', status: 'Closed', description: 'Closed tasks' },
    ],
    rawSubStatuses: [
      {
        _id: 'sub-1',
        subStatus: 'Pending Info',
        description: 'Waiting on info',
      },
      { _id: 'sub-2', subStatus: 'In Progress', description: 'Working' },
    ],
    rawTopics: [
      { _id: 'topic-1', topic: 'Frontend' },
      { _id: 'topic-2', topic: 'Backend' },
    ],
    rawQueues: [
      { _id: 'queue-1', queueName: 'High Priority' },
      { _id: 'queue-2', queueName: 'Standard' },
    ],
    rawArticles: [
      { _id: 'article-1', articleTitle: 'Setup Guide' },
      { _id: 'article-2', articleTitle: 'Troubleshooting FAQ' },
    ],
    rawCustomers: [
      { _id: 'cust-1', firstName: 'Alice', lastName: 'Wonder' },
      { _id: 'cust-2', firstName: 'Bob', lastName: 'Builder' },
    ],
    rawEmployees: [
      { _id: 'emp-1', firstName: 'John', lastName: 'Doe' },
      { _id: 'emp-2', firstName: 'Jane', lastName: 'Smith' },
    ],
    rawCompanies: [
      { _id: 'comp-1', companyName: 'Acme Inc.' },
      { _id: 'comp-2', companyName: 'TechCorp' },
    ],
    rawSeverityLevels: [
      { _id: 'sev-1', severityLevel: 1, description: 'Low severity' },
      { _id: 'sev-2', severityLevel: 5, description: 'High severity' },
    ],
    currentUser: {
      _id: 'user-1',
      firstName: 'Demo',
      lastName: 'User',
    },
    customerId: 'cust-1',
    companyId: 'comp-1',

    // Callbacks
    onComment: (text: string, taskId: string) =>
      console.log('[TopicBoard] onComment =>', { text, taskId }),
    onEdit: (data: { _id: string }) =>
      console.log('[TopicBoard] onEdit =>', data),
    onDelete: (data: { _id: string }) =>
      console.log('[TopicBoard] onDelete =>', data),
    onDuplicate: (data: { _id: string }) =>
      console.log('[TopicBoard] onDuplicate =>', data),
    onEditComment: (commentId: string, newText: string, taskId: string) =>
      console.log('[TopicBoard] onEditComment =>', {
        commentId,
        newText,
        taskId,
      }),
    onAdd: (newTask: Omit<Task, '_id'>) =>
      console.log('[TopicBoard] onAdd =>', newTask),
    onRevisionHistory: (
      commentId: string,
      revisionHistory: CommentEditHistory[]
    ) =>
      console.log('[TopicBoard] onRevisionHistory =>', {
        commentId,
        revisionHistory,
      }),
  } as ProjectBoardProps,
}

/* ----------------------------------------------------------------------------
   2) ADDTASK POPUP STORIES
---------------------------------------------------------------------------- */

// Common props for AddTask stories
const addTaskCommonProps = {
  open: true,
  onClose: () => console.log('onClose called'),
  onAdd: (newTask: Omit<Task, '_id'>) =>
    console.log('onAdd called with:', newTask),
  statuses: [
    { _id: 'stat-1', status: 'Open', description: 'Open tasks' },
    { _id: 'stat-2', status: 'Closed', description: 'Closed tasks' },
  ],
  subStatuses: [
    { _id: 'sub-1', subStatus: 'Pending Info', description: 'Waiting' },
    { _id: 'sub-2', subStatus: 'In Progress', description: 'Working' },
  ],
  topics: [
    { _id: 'topic-1', topic: 'Frontend' },
    { _id: 'topic-2', topic: 'Backend' },
  ],
  schedulingQueues: [
    { _id: 'queue-1', queueName: 'High Priority' },
    { _id: 'queue-2', queueName: 'Standard' },
  ],
  knowledgebaseArticles: [
    { _id: 'article-1', articleTitle: 'Setup Guide' },
    { _id: 'article-2', articleTitle: 'Troubleshooting FAQ' },
  ],
  severityLevels: [
    { _id: 'sev-1', severityLevel: 1, description: 'Low severity' },
    { _id: 'sev-2', severityLevel: 5, description: 'High severity' },
  ],
  createdUserId: 'user-1',
}

const adminCompanyDropdownProps = {
  ...addTaskCommonProps,
  rawCompanies: [
    { _id: 'comp-1', companyName: 'Acme Inc.' },
    { _id: 'comp-2', companyName: 'TechCorp' },
  ],
}

const adminCompanyProvidedProps = {
  ...addTaskCommonProps,
  companyId: 'comp-1',
}

const companyCustomerDropdownProps = {
  ...addTaskCommonProps,
  rawCustomers: [
    { _id: 'cust-1', firstName: 'Alice', lastName: 'Wonder' },
    { _id: 'cust-2', firstName: 'Bob', lastName: 'Builder' },
  ],
}

const companyCustomerProvidedProps = {
  ...addTaskCommonProps,
  customerId: 'cust-1',
}

// Updated customerAddTaskProps to include companyId instead of customerId
const customerAddTaskProps = {
  open: true,
  onClose: () => console.log('onClose called'),
  onAdd: (newTask: Omit<Task, '_id'>) =>
    console.log('onAdd called with:', newTask),
  topics: [
    { _id: 'topic-1', topic: 'Frontend' },
    { _id: 'topic-2', topic: 'Backend' },
  ],
  schedulingQueues: [
    { _id: 'queue-1', queueName: 'High Priority' },
    { _id: 'queue-2', queueName: 'Standard' },
  ],
  severityLevels: [
    { _id: 'sev-1', severityLevel: 1, description: 'Low severity' },
    { _id: 'sev-2', severityLevel: 5, description: 'High severity' },
  ],
  companyId: 'comp-1',
  createdUserId: 'user-1',
}

export const AddTaskPopup_Administrator_CompanyDropdown: StoryObj<
  typeof AdministratorAddTaskCompanyDropdown
> = {
  name: 'AddTask Popup - Administrator Variant (Company Dropdown)',
  render: () => (
    <AdministratorAddTaskCompanyDropdown {...adminCompanyDropdownProps} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const createBtn = canvas.getByRole('button', { name: /Create Task/i })
    expect(createBtn).toBeInTheDocument()

    const titleField = canvas.getByLabelText(/Task Title/i)
    await userEvent.type(titleField, 'Admin Company Dropdown Task')
    expect(titleField).toHaveValue('Admin Company Dropdown Task')
  },
}

export const AddTaskPopup_Administrator_CompanyProvided: StoryObj<
  typeof AdministratorAddTaskCompanyProvided
> = {
  name: 'AddTask Popup - Administrator Variant (Company Provided)',
  render: () => (
    <AdministratorAddTaskCompanyProvided {...adminCompanyProvidedProps} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const createBtn = canvas.getByRole('button', { name: /Create Task/i })
    expect(createBtn).toBeInTheDocument()

    const titleField = canvas.getByLabelText(/Task Title/i)
    await userEvent.type(titleField, 'Admin Company Provided Task')
    expect(titleField).toHaveValue('Admin Company Provided Task')
  },
}

export const AddTaskPopup_Company_CustomerDropdown: StoryObj<
  typeof CompanyAddTaskCustomerDropdown
> = {
  name: 'AddTask Popup - Company Variant (Customer Dropdown)',
  render: () => (
    <CompanyAddTaskCustomerDropdown {...companyCustomerDropdownProps} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const createBtn = canvas.getByRole('button', { name: /Create Task/i })
    expect(createBtn).toBeInTheDocument()

    const titleField = canvas.getByLabelText(/Task Title/i)
    await userEvent.type(titleField, 'Company Customer Dropdown Task')
    expect(titleField).toHaveValue('Company Customer Dropdown Task')
  },
}

export const AddTaskPopup_Company_CustomerProvided: StoryObj<
  typeof CompanyAddTaskCustomerProvided
> = {
  name: 'AddTask Popup - Company Variant (Customer Provided)',
  render: () => (
    <CompanyAddTaskCustomerProvided {...companyCustomerProvidedProps} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const createBtn = canvas.getByRole('button', { name: /Create Task/i })
    expect(createBtn).toBeInTheDocument()

    const titleField = canvas.getByLabelText(/Task Title/i)
    await userEvent.type(titleField, 'Company Customer Provided Task')
    expect(titleField).toHaveValue('Company Customer Provided Task')
  },
}

export const AddTaskPopup_Customer: StoryObj<typeof CustomerAddTask> = {
  name: 'AddTask Popup - Customer Variant',
  render: () => <CustomerAddTask {...customerAddTaskProps} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const createBtn = canvas.getByRole('button', { name: /Create Task/i })
    expect(createBtn).toBeInTheDocument()

    const titleField = canvas.getByLabelText(/Task Title/i)
    await userEvent.type(titleField, 'Customer Task')
    expect(titleField).toHaveValue('Customer Task')
  },
}

export const AddTaskPopup_NoUser: StoryObj<typeof NoUserAddTask> = {
  name: 'AddTask - NoUser Variant',
  render: () => (
    <NoUserAddTask
      onAdd={newTask =>
        console.log('NoUser AddTask onAdd called with:', newTask)
      }
      severityLevels={[
        { _id: 'sev-1', severityLevel: 1, description: 'Low severity' },
        { _id: 'sev-2', severityLevel: 5, description: 'High severity' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const titleField = canvas.getByLabelText(/Task Title/i)
    expect(titleField).toBeInTheDocument()
    await userEvent.type(titleField, 'NoUser Task')
    expect(titleField).toHaveValue('NoUser Task')

    const emailField = canvas.getByLabelText(/Email/i)
    expect(emailField).toBeInTheDocument()
    await userEvent.type(emailField, 'test@example.com')
    expect(emailField).toHaveValue('test@example.com')

    const severityDropdown = canvas.getByLabelText(/Severity Level/i)
    expect(severityDropdown).toBeInTheDocument()

    const createButton = canvas.getByRole('button', { name: /Create Task/i })
    expect(createButton).toBeInTheDocument()
  },
}

/* ----------------------------------------------------------------------------
   3) SHOWTASK POPUP STORY
---------------------------------------------------------------------------- */

export const ShowTaskPopup: StoryObj<typeof ShowTask> = {
  name: 'ShowTask Popup (Standalone)',
  render: () => (
    <ShowTask
      open={true}
      onClose={() => console.log('onClose called')}
      taskId="task-101"
      taskTitle="Example Task"
      createdBy="John Doe"
      description="This is an example task description"
      comments={[
        {
          _id: 'comment-1',
          text: 'Initial comment',
          createdAt: new Date(),
          createdBy: 'John Doe',
          editHistory: [
            {
              _id: 'rev-1',
              editedBy: 'John Doe',
              editedAt: new Date('2024-03-19T10:00:00Z'),
              text: 'Initial comment',
              isOriginal: true,
            },
            {
              _id: 'rev-2',
              editedBy: 'Jane Smith',
              editedAt: new Date('2024-03-19T11:00:00Z'),
              text: 'Updated comment with more info',
              isOriginal: false,
            },
          ],
        },
      ]}
      customerAssigned="Alice Wonder"
      severity="High"
      schedulingQueue="High Priority"
      status="Open"
      subStatus="In Progress"
      topics={['Frontend', 'UI']}
      knowledgebaseArticles={['Setup Guide']}
      teamMemberAssigned="Jane Smith"
      nextActionDate="2024-03-20"
      currentUserName="Demo User"
      onCloseTask={() => console.log('onCloseTask called')}
      onComment={text => console.log('onComment called with:', text)}
      onEdit={() => console.log('onEdit called')}
      onDelete={() => console.log('onDelete called')}
      onDuplicate={() => console.log('onDuplicate called')}
      onEditComment={(commentId, newText) =>
        console.log('onEditComment called with:', { commentId, newText })
      }
      onRevisionHistory={(commentId, revisionHistory: CommentEditHistory[]) =>
        console.log('onRevisionHistory called with:', {
          commentId,
          revisionHistory,
        })
      }
      customerOptions={[
        { _id: 'cust-1', firstName: 'Alice', lastName: 'Wonder' },
        { _id: 'cust-2', firstName: 'Bob', lastName: 'Builder' },
      ]}
      severityOptions={[
        { _id: 'sev-1', severityLevel: 1, description: 'Low severity' },
        { _id: 'sev-2', severityLevel: 5, description: 'High severity' },
      ]}
      schedulingQueueOptions={[
        { _id: 'queue-1', queueName: 'High Priority' },
        { _id: 'queue-2', queueName: 'Standard' },
      ]}
      statusOptions={[
        { _id: 'stat-1', status: 'Open', description: 'Open tasks' },
        { _id: 'stat-2', status: 'Closed', description: 'Closed tasks' },
      ]}
      subStatusOptions={[
        { _id: 'sub-1', subStatus: 'Pending Info', description: 'Waiting' },
        { _id: 'sub-2', subStatus: 'In Progress', description: 'Working' },
      ]}
      topicOptions={[
        { _id: 'topic-1', topic: 'Frontend' },
        { _id: 'topic-2', topic: 'Backend' },
      ]}
      knowledgebaseArticleOptions={[
        { _id: 'article-1', articleTitle: 'Setup Guide' },
        { _id: 'article-2', articleTitle: 'Troubleshooting FAQ' },
      ]}
      teamMemberOptions={[
        { _id: 'emp-1', firstName: 'John', lastName: 'Doe' },
        { _id: 'emp-2', firstName: 'Jane', lastName: 'Smith' },
      ]}
    />
  ),
}
