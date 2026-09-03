/**
 * @fileoverview Direct stories for the ProjectBoard inline task forms:
 * InlineAddTask (forms/AddTask/inline.tsx) and InlineShowTask
 * (forms/ShowTask/inline.tsx). The board stories only reach these views
 * interactively (click "+ Add Task" / a task card); these stories render each
 * form directly so its layout, required-field validation, submit payload
 * shape, and the ShowTask detail sidebar are pinned without board
 * choreography. These stories are the InlineAddTask / InlineShowTask
 * regression spec — goobs has no unit tests.
 */
import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { InlineAddTask } from './forms/AddTask/inline'
import { InlineShowTask } from './forms/ShowTask/inline'
import type {
  CaseUpdate,
  Comment,
  RawArticle,
  RawCompany,
  RawCustomer,
  RawEmployee,
  RawProduct,
  RawQueue,
  RawRegion,
  RawService,
  RawSeverityLevel,
  RawStatus,
  RawSubStatus,
  RawTopic,
  TaskMeeting,
} from './types'

// ---------------------------------------------------------------------------
// Shared demo rosters (mirrors the post-Wave-1 board.stories.tsx data)
// ---------------------------------------------------------------------------

const sampleStatuses: RawStatus[] = [
  { _id: '1', status: 'Open', description: 'Open tasks' },
  { _id: '2', status: 'In Progress', description: 'Tasks being worked on' },
  { _id: '3', status: 'Closed', description: 'Completed tasks' },
]

const sampleSubStatuses: RawSubStatus[] = [
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
]

const sampleTopics: RawTopic[] = [
  {
    _id: 't1',
    topic: 'Technical Support',
    description: 'Technical support issues',
  },
  { _id: 't2', topic: 'Billing', description: 'Billing related issues' },
  { _id: 't3', topic: 'General Inquiry', description: 'General questions' },
]

const sampleSeverityLevels: RawSeverityLevel[] = [
  { _id: 's1', severityLevel: 1, description: 'Critical' },
  { _id: 's2', severityLevel: 2, description: 'High' },
  { _id: 's3', severityLevel: 3, description: 'Medium' },
  { _id: 's4', severityLevel: 4, description: 'Low' },
]

const sampleQueues: RawQueue[] = [
  { _id: 'q1', queueName: 'Support Queue' },
  { _id: 'q2', queueName: 'Billing Queue' },
]

const sampleArticles: RawArticle[] = [
  {
    _id: 'a1',
    articleTitle: 'How to troubleshoot connection issues',
    purpose: 'Diagnose and resolve customer connectivity problems',
    symptoms: 'Intermittent disconnects, slow page loads',
    resolution: 'Reset the local gateway and re-run the line diagnostic',
    categoryName: 'Networking',
  },
  {
    _id: 'a2',
    articleTitle: 'Understanding billing cycles',
    purpose: 'Explain invoice timing to customers',
    categoryName: 'Billing',
  },
]

const sampleCompanies: RawCompany[] = [
  { _id: 'comp1', companyName: 'Tech Solutions Inc.' },
  { _id: 'comp2', companyName: 'Digital Services LLC' },
]

const sampleCustomers: RawCustomer[] = [
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
]

const sampleEmployees: RawEmployee[] = [
  { _id: 'e1', firstName: 'Alice', lastName: 'Admin' },
  { _id: 'e2', firstName: 'Bob', lastName: 'Manager' },
]

const sampleProducts: RawProduct[] = [
  { _id: 'p1', productName: 'Analytics Suite' },
  { _id: 'p2', productName: 'Firewall Appliance' },
]

const sampleServices: RawService[] = [
  { _id: 'svc1', serviceName: 'Managed IT Support' },
  { _id: 'svc2', serviceName: 'Network Monitoring' },
]

const sampleRegions: RawRegion[] = [
  { _id: 'r1', regionName: 'North America' },
  { _id: 'r2', regionName: 'Europe' },
]

const sampleComments: Comment[] = [
  {
    _id: 'cm1',
    text: 'Customer confirmed the issue started after the weekend deploy.',
    createdAt: new Date('2023-12-13T15:30:00.000Z'),
    createdBy: 'Alice Admin',
    editHistory: [
      {
        _id: 'rev1',
        text: 'Customer confirmed the issue started after the weekend deploy.',
        isOriginal: true,
      },
    ],
  },
  {
    _id: 'cm2',
    text: '[INTERNAL] Suspect the SSO cert rotation — checking with ops.',
    createdAt: new Date('2023-12-13T16:10:00.000Z'),
    createdBy: 'Bob Manager',
    editHistory: [
      {
        _id: 'rev2',
        text: '[INTERNAL] Suspect the SSO cert rotation — checking with ops.',
        isOriginal: true,
      },
    ],
  },
]

const sampleCaseUpdates: CaseUpdate[] = [
  {
    _id: 'cu1',
    updatedBy: 'Alice Admin',
    updatedAt: new Date('2023-12-12T09:00:00.000Z'),
    updateType: 'created',
    description: 'Task created',
  },
  {
    _id: 'cu2',
    updatedBy: 'Bob Manager',
    updatedAt: new Date('2023-12-13T10:00:00.000Z'),
    updateType: 'status_change',
    description: 'Changed status from "Open" to "In Progress"',
    fieldChanged: 'status',
    oldValue: 'Open',
    newValue: 'In Progress',
  },
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
    taskId: 'task1',
  },
]

// ---------------------------------------------------------------------------
// Default arg sets
// ---------------------------------------------------------------------------

const addTaskArgs: ComponentProps<typeof InlineAddTask> = {
  onAdd: fn(),
  onCancel: fn(),
  topics: sampleTopics,
  severityLevels: sampleSeverityLevels,
  statuses: sampleStatuses,
  subStatuses: sampleSubStatuses,
  createdUserId: 'u1',
  companyId: 'comp1',
  customerId: 'c1',
  rawCompanies: sampleCompanies,
  rawCustomers: sampleCustomers,
  rawProducts: sampleProducts,
  rawServices: sampleServices,
  rawRegions: sampleRegions,
  knowledgebaseArticles: sampleArticles,
  styles: { theme: 'light' },
}

const showTaskProps: ComponentProps<typeof InlineShowTask> = {
  taskId: 'task1abc',
  taskTitle: 'Fix login issue',
  createdBy: 'Alice Admin',
  description: 'User cannot log in to their account since the last deploy.',
  comments: sampleComments,
  caseUpdates: sampleCaseUpdates,
  customerAssigned: 'John Doe',
  severity: 'Critical',
  schedulingQueue: 'Support Queue',
  region: 'North America',
  status: 'Open',
  subStatus: 'New',
  topics: ['Technical Support'],
  knowledgebaseArticles: ['How to troubleshoot connection issues'],
  teamMemberAssigned: 'Alice Admin',
  nextActionDate: '12/15/2023 - 9:00AM CST',
  currentUserName: 'Alice Admin',
  productOrService: 'product',
  productServiceName: 'Analytics Suite',
  productId: 'p1',
  serviceId: '',
  onEdit: fn(),
  onDelete: fn(),
  onComment: fn(),
  onEditComment: fn(),
  onBack: fn(),
  severityOptions: sampleSeverityLevels,
  schedulingQueueOptions: sampleQueues,
  regionOptions: sampleRegions,
  statusOptions: sampleStatuses,
  subStatusOptions: sampleSubStatuses,
  topicOptions: sampleTopics,
  knowledgebaseArticleOptions: sampleArticles,
  teamMemberOptions: sampleEmployees,
  rawProducts: sampleProducts,
  rawServices: sampleServices,
  employees: [
    { _id: 'e1', firstName: 'Alice', lastName: 'Admin' },
    { _id: 'e2', firstName: 'Bob', lastName: 'Manager' },
  ],
  styles: { theme: 'light' },
  meetings: sampleMeetings,
  onScheduleMeeting: fn(),
  onCancelMeeting: fn(),
  onConfirmMeeting: fn(),
  onRescheduleMeeting: fn(),
  currentDate: new Date('2023-12-14T12:00:00.000Z'),
  variant: 'employee',
  onCaseUpdate: fn(),
}

const meta: Meta<typeof InlineAddTask> = {
  title: 'Components/ProjectBoard/InlineForms',
  component: InlineAddTask,
  parameters: {
    layout: 'fullscreen',
  },
  args: addTaskArgs,
}

export default meta
type Story = StoryObj<typeof InlineAddTask>

// ---------------------------------------------------------------------------
// InlineAddTask
// ---------------------------------------------------------------------------

/**
 * Pins the full add-task layout on the light theme with every roster
 * populated: the "New Task" sidebar lists all six required fields (Title,
 * Description, Type, Product/Service, Severity, Status), the Details/
 * Knowledgebase tabs render, and the two-column grid shows the Company,
 * Customer, Type, Product, Severity, Status, and Region dropdowns plus the
 * Topics multi-select, with Create Task / Cancel buttons at the bottom.
 */
export const AddTaskLight: Story = {
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Pins the sacred-theme rendering of the same fully-populated add-task form:
 * the root carries data-theme="sacred" so the gold-on-dark module styles
 * apply to the sidebar, tabs, dropdown grid, and action buttons.
 */
export const AddTaskSacred: Story = {
  args: {
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

/**
 * Pins the primary create flow end to end: with no product/service rosters
 * the required set collapses to Title, Description, Severity, and Status;
 * filling the title and description, picking Severity "Critical" and Status
 * "Open" from the dropdowns, and clicking Create Task calls onAdd exactly
 * once with a payload carrying the typed title/description and the resolved
 * severity/status labels — and no validation error is shown.
 */
export const AddTaskSubmitFlow: Story = {
  args: {
    rawProducts: [],
    rawServices: [],
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(
      canvas.getByPlaceholderText('Enter task title'),
      'Investigate login failure'
    )
    await userEvent.type(
      canvas.getByPlaceholderText('Enter text...'),
      'Customer cannot sign in since the last deploy.'
    )

    await userEvent.click(canvas.getByRole('combobox', { name: /severity/i }))
    await userEvent.click(
      await canvas.findByRole('option', { name: 'Critical' })
    )

    await userEvent.click(canvas.getByRole('combobox', { name: /^status/i }))
    await userEvent.click(await canvas.findByRole('option', { name: 'Open' }))

    await userEvent.click(canvas.getByRole('button', { name: 'Create Task' }))

    await expect(args.onAdd).toHaveBeenCalledTimes(1)
    await expect(args.onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Investigate login failure',
        description: 'Customer cannot sign in since the last deploy.',
        severity: 'Critical',
        status: 'Open',
      })
    )
    await expect(
      canvas.queryByText(/Please fill in all required fields/)
    ).not.toBeInTheDocument()
  },
}

/**
 * Pins the required-field guard: submitting the untouched form shows the
 * "Please fill in all required fields" banner naming every missing field
 * (Title, Description, Severity, Status, Product/Service) and onAdd is
 * never called.
 */
export const AddTaskValidationError: Story = {
  globals: { backgrounds: { value: 'light' } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Create Task' }))

    await expect(
      canvas.getByText(
        /Please fill in all required fields \(Title, Description, Severity, Status, Product\/Service\)/
      )
    ).toBeInTheDocument()
    // The banner is exposed as a live region (role="alert") so screen readers
    // announce the missing-field summary the moment it renders (WCAG 4.1.3).
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      /Please fill in all required fields/
    )
    await expect(args.onAdd).not.toHaveBeenCalled()
  },
}

/**
 * Pins the accessible tab semantics of the add-task form: the strip is a
 * `role="tablist"` of native `role="tab"` buttons with `aria-selected`
 * reflecting the active tab, and arrow-key navigation moves the selection
 * (WAI-ARIA tabs pattern). The rendered panel is a `role="tabpanel"` labelled
 * by the active tab.
 */
export const AddTaskAccessibleTabs: Story = {
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const tablist = canvas.getByRole('tablist', { name: 'Task form sections' })
    await expect(tablist).toBeInTheDocument()

    const tabs = canvas.getAllByRole('tab')
    await expect(tabs).toHaveLength(2)

    const detailsTab = canvas.getByRole('tab', { name: 'Task Details' })
    await expect(detailsTab).toHaveAttribute('aria-selected', 'true')

    // Keyboard: arrow-right from the active tab moves selection to the next.
    detailsTab.focus()
    await userEvent.keyboard('{ArrowRight}')

    const kbTab = canvas.getByRole('tab', { name: /Knowledgebase/ })
    await expect(kbTab).toHaveAttribute('aria-selected', 'true')
    await expect(detailsTab).toHaveAttribute('aria-selected', 'false')

    // The visible panel is labelled by whichever tab is active.
    await expect(canvas.getByRole('tabpanel')).toHaveAttribute(
      'aria-labelledby',
      'add-task-tab-knowledgeBase'
    )
  },
}

/**
 * Keyboard-accessible scrollable "New Task" sidebar (WCAG 2.1.1 Level A; axe
 * `scrollable-region-focusable`). The sidebar is a fixed-width `overflow-y:auto`
 * column of purely non-interactive content (the intro paragraph + the static
 * required-fields list), so when it overflows it is a scroll container a
 * keyboard-only user could not otherwise reach. The measured remediation
 * (inline.tsx) opts it into the tab order ONLY when it actually overflows:
 * `tabindex="0"` + a naming-capable `role="group"` + an `aria-label`, so the
 * clipped requirements can be arrow-scrolled and the region announces itself.
 *
 * The inline form's root is `height:100vh` by design (a full-viewport surface),
 * so this story constrains it to a short demo frame — the exact short-viewport /
 * zoom condition that makes the sidebar's content exceed its height and its
 * overflow engage — via a scoped style override on the wrapper's direct child.
 */
export const AddTaskSidebarScrollable: Story = {
  args: {
    // No product/service rosters keeps the layout simple; the sidebar content
    // (paragraph + required-fields list) still exceeds the short demo frame.
    rawProducts: [],
    rawServices: [],
  },
  globals: { backgrounds: { value: 'light' } },
  render: args => (
    <div data-addtask-scroll-demo style={{ height: '180px', overflow: 'hidden' }}>
      {/* Override the inline form root's `height:100vh` down to this 180px frame
          so the sidebar's content overflows and its overflow:auto engages. Scoped
          to the wrapper's direct child (the form root) so nothing else moves. */}
      <style>{`[data-addtask-scroll-demo] > div { height: 100% !important; }`}</style>
      <InlineAddTask {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Resolving a form control proves the client component mounted; the overflow
    // measurement (ResizeObserver) runs in the same lifecycle, so the sidebar's
    // scrollable decision settles by the time the assertions below retry.
    await canvas.findByRole('button', { name: 'Create Task' })

    // The measured sidebar becomes a keyboard-focusable, named scroll region.
    await waitFor(() => {
      const sidebar = canvasElement.querySelector<HTMLElement>(
        '[aria-label="New task requirements"]'
      )
      expect(sidebar).not.toBeNull()
      expect(sidebar).toHaveAttribute('tabindex', '0')
      expect(sidebar).toHaveAttribute('role', 'group')
    })

    // It actually accepts focus (proves the tab stop takes effect at runtime).
    const sidebar = canvasElement.querySelector<HTMLElement>(
      '[aria-label="New task requirements"]'
    )
    sidebar?.focus()
    await expect(sidebar).toHaveFocus()
  },
}

// ---------------------------------------------------------------------------
// InlineShowTask
// ---------------------------------------------------------------------------

/**
 * Pins the read-mode detail view on the light theme: the Ticket Summary
 * sidebar shows the truncated ticket #, Product "Analytics Suite", Queue,
 * Region, Status "Open", Substatus "New", Severity "Critical", Assigned To,
 * Topics, KB Articles, and Next Action rows with Edit/Delete and Back to
 * Board buttons; the Details tab renders the Requestor/Customer card and the
 * Title/Description card, and the tab strip shows Details / Comments /
 * Scheduling / Knowledgebase (1) / Resolution / Case History with the
 * linked-article count on the Knowledgebase tab.
 */
export const ShowTaskLight: Story = {
  render: () => <InlineShowTask {...showTaskProps} />,
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Pins the sacred-theme rendering of the same populated detail view: the
 * root carries data-theme="sacred" (InlineShowTask's default theme family)
 * so the gold accent styles apply to the sidebar summary rows, tab strip,
 * and detail cards.
 */
export const ShowTaskSacred: Story = {
  render: () => (
    <InlineShowTask {...showTaskProps} styles={{ theme: 'sacred' }} />
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

/**
 * Pins the accessible tab semantics of the manage-task view: the strip is a
 * `role="tablist"` of six native `role="tab"` buttons with `aria-selected`,
 * arrow-key navigation moves the selection, and switching to the Comments tab
 * surfaces an add-comment textbox that carries a real accessible name (its
 * placeholder was NOT a label — WCAG 1.3.1 / 4.1.2).
 */
export const ShowTaskAccessibleTabs: Story = {
  render: () => <InlineShowTask {...showTaskProps} />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const tablist = canvas.getByRole('tablist', { name: 'Task sections' })
    await expect(tablist).toBeInTheDocument()

    const tabs = canvas.getAllByRole('tab')
    await expect(tabs).toHaveLength(6)

    const detailsTab = canvas.getByRole('tab', { name: 'Details' })
    await expect(detailsTab).toHaveAttribute('aria-selected', 'true')

    // Keyboard: arrow-right moves selection to Comments.
    detailsTab.focus()
    await userEvent.keyboard('{ArrowRight}')

    const commentsTab = canvas.getByRole('tab', { name: 'Comments' })
    await expect(commentsTab).toHaveAttribute('aria-selected', 'true')

    // The add-comment textarea is reachable by its accessible name.
    await expect(
      canvas.getByRole('textbox', {
        name: /Add a comment for the customer/i,
      })
    ).toBeInTheDocument()
  },
}

/**
 * Pins the accessible meeting-scheduling form: opening the Scheduling tab and
 * launching "Schedule Meeting" reveals text fields whose `<label>`s are
 * programmatically associated (reachable via their accessible name) and whose
 * required fields carry `aria-required` — the asterisks alone did not convey
 * required-ness (WCAG 1.3.1 / 3.3.2 / 4.1.2).
 */
export const ShowTaskMeetingFormLabels: Story = {
  render: () => (
    <InlineShowTask
      {...showTaskProps}
      taskId="task-no-meetings"
      meetings={[]}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Go to the Scheduling tab.
    await userEvent.click(canvas.getByRole('tab', { name: 'Scheduling' }))

    // Empty state → open the meeting form.
    await userEvent.click(
      canvas.getByRole('button', { name: 'Schedule Meeting' })
    )

    // Labels are associated, so the fields are found by their accessible name.
    const titleField = canvas.getByRole('textbox', { name: /Meeting Title/ })
    await expect(titleField).toBeInTheDocument()
    await expect(titleField).toHaveAttribute('aria-required', 'true')

    await expect(
      canvas.getByRole('textbox', { name: /Attendee Name/ })
    ).toHaveAttribute('aria-required', 'true')
    await expect(
      canvas.getByRole('textbox', { name: /Attendee Email/ })
    ).toHaveAttribute('aria-required', 'true')

    // The meeting-type radios form a named radiogroup.
    await expect(
      canvas.getByRole('radiogroup', { name: /Meeting Type/ })
    ).toBeInTheDocument()
  },
}

// ---------------------------------------------------------------------------
// InlineAddTask — SECURITY (XSS)
// ---------------------------------------------------------------------------

/**
 * Knowledgebase article field values render as HTML (bold/images/code) by
 * design, but each value is SANITIZED at the dangerouslySetInnerHTML seam
 * (`sanitizeHtml`): a hostile `<img src=x onerror=…>` / `<script>` in a field
 * value loses its script vector while legitimate formatting survives. Opening
 * the article in the Knowledgebase tab and inspecting the rendered field proves
 * no `<script>` element and no `on*` handler reach the DOM — removing the
 * sanitizer re-introduces the XSS and fails this story.
 */
export const AddTaskSanitizesArticleFields: Story = {
  name: 'AddTask/Security — KB fields sanitized',
  args: {
    knowledgebaseArticles: [
      {
        _id: 'xss-fixture',
        articleTitle: 'Security fixture article',
        categoryName: 'Security',
        fieldValues: {
          resolution:
            'Safe <b>KBKEEPBOLD</b> then <img src=x onerror="window.__kbXss = true"> and <script>window.__kbXss2 = true</script> done',
        },
      },
    ],
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Open the Knowledgebase tab, then the article's detail view.
    await userEvent.click(canvas.getByRole('tab', { name: /Knowledgebase/ }))
    await userEvent.click(
      canvas.getByRole('button', {
        name: /View article: Security fixture article/,
      })
    )
    // The dSIH'd field value is sanitized: formatting kept, script vectors gone.
    const bold = canvas.getByText('KBKEEPBOLD')
    await expect(bold.tagName).toBe('B')
    const field = bold.parentElement as HTMLElement
    await expect(field.querySelector('script')).toBeNull()
    await expect(field.innerHTML).not.toMatch(/onerror/i)
    field.querySelectorAll('*').forEach(el => {
      for (const attr of Array.from(el.attributes)) {
        expect(attr.name.startsWith('on')).toBe(false)
      }
    })
  },
}

/**
 * THE CUSTOMER'S OWN TICKET VIEW (`viewerRole="customer"`).
 *
 * The same detail view a staff member sees, minus the company's side of the
 * ticket. Pins, in one story, every affordance the customer role removes:
 *
 *   · NO Delete button — `onDelete` is withheld, and a withheld handler renders
 *     no control rather than a disabled or no-op one (the contract
 *     `onUpdateCustomerNotes?` and the four meeting handlers already follow).
 *   · NO "Internal Customer Notes" section — those are the company's private
 *     record ABOUT the customer, so they are not rendered on the customer's own
 *     view at all. The customer's channel is the Comments tab.
 *   · Status / Substatus / Severity / Queue / Region / Assigned To render as
 *     read-only VALUES even in edit mode, because the company owns them.
 *   · Edit, comments and Back to Board all remain — the customer's own side of
 *     the ticket stays fully editable, which is the whole point of the role.
 *
 * The server enforces the identical split on its own authority (the ticket
 * mutations refuse a customer these fields); this story pins the RENDERING half,
 * so a regression that quietly puts a Delete button back in front of a customer
 * fails the baseline.
 */
export const ShowTaskCustomerView: Story = {
  render: () => {
    // `onDelete` is OMITTED, not passed as undefined: with
    // exactOptionalPropertyTypes an explicit `undefined` is not the same as an
    // absent key, and "absent" is the contract a withheld handler means.
    const customerProps = { ...showTaskProps }
    delete customerProps.onDelete
    return <InlineShowTask {...customerProps} viewerRole="customer" />
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The three staff-only controls are ABSENT, not merely disabled.
    await expect(
      canvas.queryByRole('button', { name: /^Delete$/ })
    ).toBeNull()
    await expect(canvas.queryByText(/Internal Customer Notes/)).toBeNull()
    // The customer's own affordances survive.
    await expect(
      canvas.getByRole('button', { name: /^Edit$/ })
    ).toBeInTheDocument()
    // Entering edit mode must NOT surface the company-owned editors.
    await userEvent.click(canvas.getByRole('button', { name: /^Edit$/ }))
    await expect(canvas.queryByLabelText(/Assigned To/)).toBeNull()
    await expect(canvas.queryByLabelText(/^Status$/)).toBeNull()
    await expect(canvas.queryByLabelText(/^Severity$/)).toBeNull()
    await expect(canvas.queryByLabelText(/^Queue$/)).toBeNull()
  },
}
