/**
 * @fileoverview Storybook stories for the ProjectBoard component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, userEvent, within } from 'storybook/test'
import ProjectBoard from '../index'
import { ProjectBoardProvider } from '../context/ProjectBoardContext'
import {
  Task,
  RawStatus,
  RawSubStatus,
  RawTopic,
  RawQueue,
  RawArticle,
  RawCustomer,
  RawEmployee,
  RawCompany,
  RawSeverityLevel,
  RawService,
  RawRegion,
  RawProduct,
  TaskMeeting,
  NewMeetingData,
  AdministratorBoardProps,
  CompanyBoardProps,
  CustomerBoardProps,
} from '../types'

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

const sampleRawServices: RawService[] = [
  { _id: 'svc1', serviceName: 'Managed IT Support' },
  { _id: 'svc2', serviceName: 'Network Monitoring' },
  { _id: 'svc3', serviceName: 'Cloud Backup' },
]

const sampleRawProducts: RawProduct[] = [
  { _id: 'p1', productName: 'Product A' },
  { _id: 'p2', productName: 'Analytics Suite' },
  { _id: 'p3', productName: 'Firewall Appliance' },
]

const sampleRawRegions: RawRegion[] = [
  { _id: 'r1', regionName: 'North America' },
  { _id: 'r2', regionName: 'Europe' },
  { _id: 'r3', regionName: 'Asia Pacific' },
]

const sampleMeetings: TaskMeeting[] = [
  {
    _id: 'm1',
    eventTypeName: 'Troubleshooting Call',
    attendeeName: 'John Doe',
    attendeeEmail: 'john.doe@example.com',
    startTime: '2023-12-15T15:00:00.000Z',
    endTime: '2023-12-15T15:30:00.000Z',
    status: 'confirmed',
    location: 'Zoom',
    notes: 'Walk through the login failure together',
    meetingType: 'video',
    taskId: 't1',
  },
  {
    _id: 'm2',
    eventTypeName: 'Billing Review',
    attendeeName: 'Jane Smith',
    attendeeEmail: 'jane.smith@example.com',
    startTime: '2023-12-18T17:00:00.000Z',
    endTime: '2023-12-18T17:30:00.000Z',
    status: 'pending',
    location: 'Phone',
    meetingType: 'phone',
    taskId: 't2',
  },
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
    caseUpdates: [],
    regionId: 'r1',
    region: 'North America',
    productOrService: 'product',
    productServiceName: 'Product A',
    productId: 'p1',
    serviceId: '',
    customerInternalNotes: '',
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
    caseUpdates: [],
    regionId: 'r2',
    region: 'Europe',
    productOrService: 'service',
    productServiceName: 'Service B',
    productId: '',
    serviceId: 's1',
    customerInternalNotes: '',
  },
]

// The full shared prop set, typed against the REAL props union (minus the discriminant and
// the administrator-only company roster) so a phantom or missing prop fails typecheck here.
const commonArgs: Omit<AdministratorBoardProps, 'variant' | 'rawCompanies'> = {
  columns: sampleColumns,
  tasks: sampleTasks,
  rawStatuses: sampleRawStatuses,
  rawSubStatuses: sampleRawSubStatuses,
  rawTopics: sampleRawTopics,
  rawQueues: sampleRawQueues,
  rawArticles: sampleRawArticles,
  rawCustomers: sampleRawCustomers,
  rawEmployees: sampleRawEmployees,
  rawSeverityLevels: sampleRawSeverityLevels,
  rawServices: sampleRawServices,
  rawProducts: sampleRawProducts,
  rawRegions: sampleRawRegions,
  currentUser: { _id: 'u1', firstName: 'Test', lastName: 'User' },
  customerId: 'c1',
  companyId: 'comp1',
  preferDropdown: true,
  permissions: { access: 'write' },
  meetings: sampleMeetings,
  currentDate: new Date('2023-12-14T12:00:00.000Z'),
  onAdd: (task: Omit<Task, '_id'>) => console.log('Add task:', task),
  onEdit: (task: { _id: string }) => console.log('Edit task:', task),
  onDelete: (task: { _id: string }) => console.log('Delete task:', task),
  onComment: (text: string, taskId: string) =>
    console.log('Add comment:', text, 'to task:', taskId),
  onEditComment: (commentId: string, text: string, taskId: string) =>
    console.log('Edit comment:', commentId, text, 'to task:', taskId),
  onScheduleMeeting: (meetingData: NewMeetingData) =>
    console.log('Schedule meeting:', meetingData),
  onCancelMeeting: (meetingId: string, reason: string) =>
    console.log('Cancel meeting:', meetingId, 'reason:', reason),
  onConfirmMeeting: (meetingId: string) =>
    console.log('Confirm meeting:', meetingId),
  onRescheduleMeeting: (
    meetingId: string,
    newStartTime: string,
    newEndTime: string
  ) => console.log('Reschedule meeting:', meetingId, newStartTime, newEndTime),
  boardType: 'status',
  styles: { theme: 'light' },
}

// Per-variant arg sets, each typed as its exact union member — rawCompanies exists ONLY on the
// administrator variant, so the company/customer stories can no longer smuggle it in.
const administratorArgs: AdministratorBoardProps = {
  ...commonArgs,
  variant: 'administrator',
  rawCompanies: sampleRawCompanies,
}

const companyArgs: CompanyBoardProps = {
  ...commonArgs,
  variant: 'company',
}

const customerArgs: CustomerBoardProps = {
  ...commonArgs,
  variant: 'customer',
}

const meta: Meta<typeof ProjectBoard> = {
  title: 'Components/ProjectBoard/Board',
  component: ProjectBoard,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['administrator', 'company', 'customer'],
    },
    boardType: {
      control: { type: 'select' },
      options: ['status', 'severityLevel', 'subStatus', 'topic'],
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}

export default meta
type Story = StoryObj<typeof ProjectBoard>

export const LightTheme: Story = {
  render: args => (
    <ProjectBoardProvider>
      <div
        style={{
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
          padding: '2rem',
          margin: 0,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Light Theme:</strong> Clean and professional project board
          with light backgrounds and intuitive task management.
          <br />
          <strong>Features:</strong> Optimized for bright environments,
          drag-and-drop functionality, and comprehensive task tracking.
        </div>
        <ProjectBoard {...args} />
      </div>
    </ProjectBoardProvider>
  ),
  args: {
    ...administratorArgs,
    styles: {
      theme: 'light',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  render: args => (
    <ProjectBoardProvider>
      <div
        style={{
          backgroundColor: '#0f172a',
          minHeight: '100vh',
          padding: '2rem',
          margin: 0,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Dark Theme:</strong> Developer-friendly dark mode with high
          contrast and reduced eye strain for extended use.
          <br />
          <strong>Features:</strong> Perfect for low-light environments, modern
          styling, and smooth task management interactions.
        </div>
        <ProjectBoard {...args} />
      </div>
    </ProjectBoardProvider>
  ),
  args: {
    ...administratorArgs,
    styles: {
      theme: 'dark',
    },
  },
}

export const SacredTheme: Story = {
  render: args => (
    <ProjectBoardProvider>
      <div
        style={{
          backgroundColor: '#1C1917',
          minHeight: '100vh',
          padding: '2rem',
          margin: 0,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Sacred Theme:</strong> Mystical and spiritual project board
          with sacred color palettes and ethereal task management.
          <br />
          <strong>Features:</strong> Designed for contemplative workflows,
          sacred aesthetics, and transcendent project organization.
        </div>
        <ProjectBoard {...args} />
      </div>
    </ProjectBoardProvider>
  ),
  args: {
    ...administratorArgs,
    styles: {
      theme: 'sacred',
    },
  },
}

export const SeverityBoard: Story = {
  render: args => (
    <ProjectBoardProvider>
      <div
        style={{
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
          padding: '2rem',
          margin: 0,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Severity Board:</strong> Organize tasks by severity level with
          critical, high, medium, and low priority columns.
          <br />
          <strong>Features:</strong> Priority-based task management with visual
          severity indicators.
        </div>
        <ProjectBoard {...args} />
      </div>
    </ProjectBoardProvider>
  ),
  args: {
    ...administratorArgs,
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
  },
  globals: { backgrounds: { value: 'light' } },
}

export const TopicBoard: Story = {
  render: args => (
    <ProjectBoardProvider>
      <div
        style={{
          backgroundColor: '#0f172a',
          minHeight: '100vh',
          padding: '2rem',
          margin: 0,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Topic Board:</strong> Categorize tasks by topic with dedicated
          columns for different types of work.
          <br />
          <strong>Features:</strong> Topic-based organization for better
          workflow management and team specialization.
        </div>
        <ProjectBoard {...args} />
      </div>
    </ProjectBoardProvider>
  ),
  args: {
    ...administratorArgs,
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
      theme: 'dark',
    },
  },
}

export const CompanyVariant: Story = {
  render: args => (
    <ProjectBoardProvider>
      <div
        style={{
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
          padding: '2rem',
          margin: 0,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Company Variant:</strong> Project board configured for company
          users with appropriate permissions and functionality.
          <br />
          <strong>Features:</strong> Company-specific task management with
          customer assignment capabilities.
        </div>
        <ProjectBoard {...args} />
      </div>
    </ProjectBoardProvider>
  ),
  args: {
    ...companyArgs,
    styles: {
      theme: 'light',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Pins the board-level accessibility contract: each task-selection checkbox
 * carries an accessible name ("Select task: …" — the bare checkbox had none),
 * each column's tasks render as a named `role="list"`, and opening "Create
 * Task" reveals the Breadcrumb `<nav>` landmark so keyboard/AT users can find
 * their way back (WCAG 4.1.2 / 1.3.1 / 2.4.1).
 */
export const BoardAccessibility: Story = {
  render: args => (
    <ProjectBoardProvider>
      <div
        style={{
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
          padding: '2rem',
          margin: 0,
          boxSizing: 'border-box',
        }}
      >
        <ProjectBoard {...args} />
      </div>
    </ProjectBoardProvider>
  ),
  args: {
    ...administratorArgs,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Every task checkbox is named by the task it selects.
    const checkboxes = canvas.getAllByRole('checkbox', {
      name: /Select task:/,
    })
    await expect(checkboxes.length).toBeGreaterThan(0)

    // Each populated column exposes its tasks as a named list.
    const lists = canvas.getAllByRole('list', { name: /tasks/ })
    await expect(lists.length).toBeGreaterThan(0)

    // Opening the Create Task view surfaces the Breadcrumb navigation landmark.
    await userEvent.click(canvas.getByRole('button', { name: 'Create Task' }))
    await expect(
      await canvas.findByRole('navigation', { name: 'Breadcrumb' })
    ).toBeInTheDocument()
  },
}

export const CustomerVariant: Story = {
  render: args => (
    <ProjectBoardProvider>
      <div
        style={{
          backgroundColor: '#1C1917',
          minHeight: '100vh',
          padding: '2rem',
          margin: 0,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Customer Variant:</strong> Simplified project board for
          customer users with focus on their own tasks.
          <br />
          <strong>Features:</strong> Customer-focused view with sacred theme
          aesthetics and simplified functionality.
        </div>
        <ProjectBoard {...args} />
      </div>
    </ProjectBoardProvider>
  ),
  args: {
    ...customerArgs,
    styles: {
      theme: 'sacred',
    },
  },
}
