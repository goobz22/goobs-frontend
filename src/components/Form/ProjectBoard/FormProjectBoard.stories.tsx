/**
 * @fileoverview Storybook stories for FormProjectBoard — the styled shell
 * that frames a full ProjectBoard (routed through ContentSection's
 * `grids[].projectboard` slot) with a form-style header: title, description,
 * and the sacred-only top/bottom shimmer bars + gold underline. The boolean
 * `sacredtheme` prop maps to the canonical 'sacred' | 'light' `data-theme`
 * on the shell; the inner board's own palette comes from
 * `projectboard.styles.theme`, so each story keeps the two in agreement.
 * NOTE: despite living under Form/, FormProjectBoard does NOT consume the
 * zod Form context — it is a standalone wrapper, so no <Form> harness is
 * required (ProjectBoard mounts its own ProjectBoardProvider internally).
 * These stories are the FormProjectBoard regression spec — goobs has no
 * unit tests.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, fn } from 'storybook/test'
import FormProjectBoard from './index'
import type {
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
  AdministratorBoardProps,
  CompanyBoardProps,
} from '../../ProjectBoard/types'

// NOTE: the meta is declared BEFORE the sample data on purpose — the
// story-coverage lint extracts the first `title:` literal in the file as the
// meta title, and the sample columns/tasks below carry their own `title` keys.
const meta: Meta<typeof FormProjectBoard> = {
  title: 'Components/Form/ProjectBoard',
  component: FormProjectBoard,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    sacredtheme: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof FormProjectBoard>

// --------------------------------------------------------------------------
// SAMPLE DATA — a realistic support-case board
// --------------------------------------------------------------------------

const rawStatuses: RawStatus[] = [
  { _id: 'st-open', status: 'Open', description: 'Open cases' },
  {
    _id: 'st-progress',
    status: 'In Progress',
    description: 'Cases being worked',
  },
  { _id: 'st-closed', status: 'Closed', description: 'Resolved cases' },
]

const rawSubStatuses: RawSubStatus[] = [
  { _id: 'ss-new', subStatus: 'New', statusId: 'st-open' },
  { _id: 'ss-working', subStatus: 'Working', statusId: 'st-progress' },
  { _id: 'ss-done', subStatus: 'Completed', statusId: 'st-closed' },
]

const rawTopics: RawTopic[] = [
  { _id: 'tp-tech', topic: 'Technical Support' },
  { _id: 'tp-billing', topic: 'Billing' },
]

const rawQueues: RawQueue[] = [
  { _id: 'q-support', queueName: 'Support Queue' },
  { _id: 'q-billing', queueName: 'Billing Queue' },
]

const rawArticles: RawArticle[] = [
  { _id: 'kb-1', articleTitle: 'How to troubleshoot connection issues' },
  { _id: 'kb-2', articleTitle: 'Understanding billing cycles' },
]

const rawCustomers: RawCustomer[] = [
  {
    _id: 'cust-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  },
  {
    _id: 'cust-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
  },
]

const rawEmployees: RawEmployee[] = [
  { _id: 'emp-1', firstName: 'Alice', lastName: 'Nguyen' },
  { _id: 'emp-2', firstName: 'Marcus', lastName: 'Webb' },
]

const rawCompanies: RawCompany[] = [
  { _id: 'co-1', companyName: 'Tech Solutions Inc.' },
  { _id: 'co-2', companyName: 'Digital Services LLC' },
]

const rawSeverityLevels: RawSeverityLevel[] = [
  { _id: 'sev-1', severityLevel: 1, description: 'Critical' },
  { _id: 'sev-2', severityLevel: 2, description: 'High' },
  { _id: 'sev-3', severityLevel: 3, description: 'Medium' },
]

const rawServices: RawService[] = [
  { _id: 'svc-1', serviceName: 'Managed IT Support' },
]

const rawProducts: RawProduct[] = [{ _id: 'prod-1', productName: 'Firewall' }]

const rawRegions: RawRegion[] = [
  { _id: 'reg-na', regionName: 'North America' },
  { _id: 'reg-eu', regionName: 'Europe' },
]

const boardColumns = [
  { _id: 'st-open', title: 'Open', description: 'Open cases' },
  { _id: 'st-progress', title: 'In Progress', description: 'Cases in work' },
  { _id: 'st-closed', title: 'Closed', description: 'Resolved cases' },
]

const sampleTasks: Task[] = [
  {
    _id: 'task-1',
    companyId: 'co-1',
    title: 'Fix login issue',
    description: 'User cannot log in to their account',
    severityId: 'sev-1',
    statusId: 'st-open',
    substatusId: 'ss-new',
    schedulingQueueId: 'q-support',
    topicIds: ['tp-tech'],
    commentIds: [],
    employeeIds: ['emp-1'],
    articleIds: ['kb-1'],
    customerId: 'cust-1',
    createdAt: new Date('2026-06-01T09:00:00.000Z'),
    closedAt: new Date('2026-06-01T09:00:00.000Z'),
    updatedAt: new Date('2026-06-02T15:30:00.000Z'),
    createdBy: 'Alice Nguyen',
    editHistory: [],
    caseUpdates: [],
    comments: [],
    customerAssigned: 'John Doe',
    severity: 'Critical',
    schedulingQueue: 'Support Queue',
    regionId: 'reg-na',
    region: 'North America',
    status: 'Open',
    subStatus: 'New',
    topicLabels: ['Technical Support'],
    kbArticles: ['How to troubleshoot connection issues'],
    teamMember: 'Alice Nguyen',
    nextActionDate: '06/15/2026 - 9:00AM CST',
    productOrService: 'product',
    productServiceName: 'Firewall',
    productId: 'prod-1',
    serviceId: '',
  },
  {
    _id: 'task-2',
    companyId: 'co-2',
    title: 'Update billing information',
    description: 'Customer needs to update their billing address',
    severityId: 'sev-3',
    statusId: 'st-progress',
    substatusId: 'ss-working',
    schedulingQueueId: 'q-billing',
    topicIds: ['tp-billing'],
    commentIds: [],
    employeeIds: ['emp-2'],
    articleIds: ['kb-2'],
    customerId: 'cust-2',
    createdAt: new Date('2026-06-03T12:00:00.000Z'),
    closedAt: new Date('2026-06-03T12:00:00.000Z'),
    updatedAt: new Date('2026-06-04T10:00:00.000Z'),
    createdBy: 'Marcus Webb',
    editHistory: [],
    caseUpdates: [],
    comments: [],
    customerAssigned: 'Jane Smith',
    severity: 'Medium',
    schedulingQueue: 'Billing Queue',
    regionId: 'reg-eu',
    region: 'Europe',
    status: 'In Progress',
    subStatus: 'Working',
    topicLabels: ['Billing'],
    kbArticles: ['Understanding billing cycles'],
    teamMember: 'Marcus Webb',
    nextActionDate: '06/16/2026 - 2:00PM CST',
    productOrService: 'service',
    productServiceName: 'Managed IT Support',
    productId: '',
    serviceId: 'svc-1',
  },
]

/**
 * The full shared prop set, typed against the REAL props union (minus the
 * discriminant and the administrator-only company roster) so a phantom or
 * missing projectboard prop fails the stories type gate.
 */
const commonBoardProps: Omit<
  AdministratorBoardProps,
  'variant' | 'rawCompanies'
> = {
  boardType: 'status',
  columns: boardColumns,
  tasks: sampleTasks,
  rawStatuses,
  rawSubStatuses,
  rawTopics,
  rawQueues,
  rawArticles,
  rawCustomers,
  rawEmployees,
  rawSeverityLevels,
  rawServices,
  rawProducts,
  rawRegions,
  currentUser: { _id: 'emp-1', firstName: 'Alice', lastName: 'Nguyen' },
  customerId: 'cust-1',
  companyId: 'co-1',
  preferDropdown: true,
  permissions: { access: 'write' },
  meetings: [],
  currentDate: new Date('2026-06-14T12:00:00.000Z'),
  onAdd: fn(),
  onEdit: fn(),
  onDelete: fn(),
  onComment: fn(),
  onEditComment: fn(),
  onScheduleMeeting: fn(),
  onCancelMeeting: fn(),
  onConfirmMeeting: fn(),
  onRescheduleMeeting: fn(),
  styles: { theme: 'sacred' },
}

const administratorBoard: AdministratorBoardProps = {
  ...commonBoardProps,
  variant: 'administrator',
  rawCompanies,
}

const companyBoardLight: CompanyBoardProps = {
  ...commonBoardProps,
  variant: 'company',
  styles: { theme: 'light' },
}

/**
 * Sacred default: `data-theme="sacred"` shell with the gold serif title,
 * description, top/bottom shimmer bars and the gold underline, framing an
 * administrator-variant status board whose two seeded cases land in the
 * Open and In Progress columns.
 */
export const Sacred: Story = {
  globals: { backgrounds: { value: 'sacred' } },
  args: {
    title: 'Support Cases',
    description: 'Track and resolve every open customer case',
    sacredtheme: true,
    projectboard: administratorBoard,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Support Cases')).toBeVisible()
    await expect(
      canvas.getByText('Track and resolve every open customer case')
    ).toBeVisible()
    // The inner board renders the seeded task cards below the header.
    await expect(await canvas.findByText('Fix login issue')).toBeVisible()
    await expect(canvas.getByText('Update billing information')).toBeVisible()
  },
}

/**
 * Light theme (`sacredtheme={false}`): `data-theme="light"` shell — dark
 * heading text, NO shimmer bars and NO underline — framing a company-variant
 * board themed light to match.
 */
export const Light: Story = {
  globals: { backgrounds: { value: 'light' } },
  args: {
    title: 'Support Cases',
    description: 'Track and resolve every open customer case',
    sacredtheme: false,
    projectboard: companyBoardLight,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Support Cases')).toBeVisible()
    await expect(await canvas.findByText('Fix login issue')).toBeVisible()
  },
}

/**
 * Severity board grouping: the same shell framing a board grouped by
 * `severityLevel` — the Critical column holds the login case and the Medium
 * column holds the billing case, pinning that the wrapper passes boardType
 * and columns straight through to the board.
 */
export const SeverityGrouping: Story = {
  globals: { backgrounds: { value: 'sacred' } },
  args: {
    title: 'Cases by Severity',
    description: 'Triage cases from most to least critical',
    sacredtheme: true,
    projectboard: {
      ...administratorBoard,
      boardType: 'severityLevel',
      columns: [
        { _id: 'sev-1', title: 'Critical', description: 'Critical issues' },
        { _id: 'sev-2', title: 'High', description: 'High priority issues' },
        { _id: 'sev-3', title: 'Medium', description: 'Medium priority' },
      ],
    },
  },
}
