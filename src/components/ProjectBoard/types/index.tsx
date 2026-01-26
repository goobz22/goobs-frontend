import type { ProjectBoardStyles } from '../../../theme'

// Re-export ProjectBoardStyles for convenience
export type { ProjectBoardStyles }

/** A minimal typed comment for any type of task. */
export type Comment = {
  _id: string
  text: string
  createdAt: Date
  createdBy: string
  editHistory: CommentEditHistory[]
}

/** A history record for comment edits or case updates. */
export type CommentEditHistory = {
  _id: string
  editedBy?: string
  editedAt?: Date
  text: string
  isOriginal: boolean
}

/** A case update entry for tracking all task changes and activities. */
export type CaseUpdate = {
  _id: string
  updatedBy: string
  updatedAt: Date
  updateType:
    | 'status_change'
    | 'substatus_change'
    | 'assignment'
    | 'comment'
    | 'internal_comment'
    | 'field_update'
    | 'created'
    | 'customer_notes_update'
    | 'meeting_scheduled'
    | 'meeting_cancelled'
    | 'meeting_rescheduled'
    | 'meeting_confirmed'
    | 'knowledgebase_attached'
    | 'knowledgebase_removed'
    | 'resolution_update'
    | 'topic_change'
    | 'region_change'
    | 'severity_change'
    | 'queue_change'
  description: string
  fieldChanged?: string
  oldValue?: string
  newValue?: string
}

/**
 * A generic "Task" type for your boards.
 * It can store severityId, statusId, substatusId, schedulingQueueId, topicIds, etc.
 *
 * Now extended with fields that `ShowTask` uses directly (e.g. createdBy, comments array, etc.).
 */
export type Task = {
  _id: string
  /** The parent company ID or other domain-specific reference. */
  companyId: string
  title: string
  description: string
  /** If severity is linked to a separate record, store it here. */
  severityId: string
  /** The main status. */
  statusId: string
  /** The sub-status. */
  substatusId: string
  /** The scheduling queue ID. */
  schedulingQueueId: string
  /** Topics array, each referencing a topic ID. */
  topicIds: string[]
  /** Comments array, referencing comment IDs. */
  commentIds: string[]
  /** Employee IDs assigned to the task. */
  employeeIds: string[]
  /** Knowledgebase article IDs. */
  articleIds: string[]
  /** The "customer" ID if you have one. */
  customerId: string
  /** Timestamps. */
  createdAt: Date
  closedAt: Date
  updatedAt: Date
  createdBy: string
  editHistory: CommentEditHistory[]
  /** Case updates tracking all task changes and activities */
  caseUpdates: CaseUpdate[]
  /**
   * If you want to store the actual comments (rather than just commentIds),
   * so ShowTask can display them directly.
   */
  comments: Comment[]
  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */
  customerAssigned: string
  /** Severity label text (e.g. "Critical"). */
  severity: string
  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */
  schedulingQueue: string
  /** Region ID. */
  regionId: string
  /** Region text (e.g. "North America"). */
  region: string
  /** High-level status text (e.g. "Open"). */
  status: string
  /** Sub-status text (e.g. "In Progress"). */
  subStatus: string
  /**
   * If you want to store the actual topic strings (e.g. ["Technical Support"]).
   * This can be used in addition to or instead of topicIds.
   */
  topicLabels: string[]
  /**
   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).
   * This can be used in addition to or instead of articleIds.
   */
  kbArticles: string[]
  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */
  teamMember: string
  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */
  nextActionDate: string
  /** Whether this task is for a product or service. */
  productOrService: 'product' | 'service'
  /** The name of the product or service. */
  productServiceName: string
  /** The product ID if this task is for a product. */
  productId: string
  /** The service ID if this task is for a service. */
  serviceId: string
  /** Company internal notes (staff-only, tied to company record - for admin -> company context). Only used in administrator variant. */
  companyInternalNotes?: string
  /** Customer internal notes (staff-only, tied to customer record - for company -> customer context). Only used in company variant. */
  customerInternalNotes?: string
}

/** Each "column" references an array of Task objects. */
export type ColumnData = {
  _id: string
  title: string
  description: string
  tasks: Task[]
}

/** Board types: which property we use to group tasks into columns. */
export type BoardType = 'severityLevel' | 'status' | 'subStatus' | 'topic'

/** Raw typed data for "severity levels." */
export type RawSeverityLevel = {
  _id: string
  severityLevel: number
  description?: string
}

/** Raw typed data for "statuses." */
export type RawStatus = {
  _id: string
  status: string
  description?: string
}

/** Raw typed data for "substatuses." */
export type RawSubStatus = {
  _id: string
  subStatus: string
  description?: string
  statusId: string
}

/** Raw typed data for "topics." */
export type RawTopic = {
  _id: string
  topic: string
  description?: string
}

/** Raw typed data for "queues." */
export type RawQueue = {
  _id: string
  queueName: string
}

/** Raw typed data for "regions." */
export type RawRegion = {
  _id: string
  regionName: string
}

/** Raw typed data for "articles." */
export type RawArticle = {
  _id: string
  articleTitle: string
  /** Optional fields for enhanced search and display */
  purpose?: string
  symptoms?: string
  cause?: string
  impact?: string
  resolution?: string
  workaround?: string
  categoryName?: string
  /** Linked tasks/cases that reference this article */
  linkedTasks?: { _id: string; title: string }[]
}

/** Raw typed data for "customers." */
export type RawCustomer = {
  _id: string
  firstName?: string
  lastName?: string
  email?: string
}

/** Raw typed data for "employees." */
export type RawEmployee = {
  _id: string
  firstName?: string
  lastName?: string
}

export type RawCompany = {
  _id: string
  companyName: string
}

export type RawProduct = {
  _id: string
  productName: string
}

export type RawService = {
  _id: string
  serviceName: string
}

/** The 3 variants we support in Add/Manage: 'administrator' | 'company' | 'customer'. */
export type BoardVariant = 'administrator' | 'company' | 'customer'

export type CurrentUser = {
  _id: string
  firstName: string
  lastName: string
}

/**
 * Props for ProjectBoard.
 * (columns[] can lack a `tasks` field initially; we will merge tasks ourselves.)
 */
export interface ProjectBoardProps {
  variant: BoardVariant
  boardType: BoardType
  columns: {
    _id: string
    title: string
    description: string
  }[]
  tasks: Task[]
  rawStatuses: RawStatus[]
  rawSubStatuses: RawSubStatus[]
  rawTopics: RawTopic[]
  rawQueues: RawQueue[]
  rawArticles: RawArticle[]
  /** Raw customers - only required for company variant (companies deal with customers) */
  rawCustomers?: RawCustomer[]
  rawEmployees: RawEmployee[]
  rawCompanies: RawCompany[]
  /** Raw products - only required for company variant (admin only has services) */
  rawProducts?: RawProduct[]
  rawServices: RawService[]
  rawRegions: RawRegion[]
  rawSeverityLevels: RawSeverityLevel[]
  onEdit: (args: { _id: string }) => void
  onDelete: (args: { _id: string }) => void
  onEditComment: (commentId: string, newText: string, taskId: string) => void
  onAdd: (newTask: Omit<Task, '_id'>) => void
  currentUser: CurrentUser
  customerId: string
  companyId: string
  /** Whether to prefer the dropdown version of AddTask forms instead of using the 'provided' version. */
  preferDropdown: boolean
  /**
   * If ShowTask calls onComment with both commentText and _id,
   * define the signature here. You can also do (text: string) => void if that's your design.
   */
  onComment: (commentText: string, _id: string) => void
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles: ProjectBoardStyles
  /** Permissions control - determines read/write access */
  permissions: {
    access: 'no-access' | 'read' | 'write'
  }
  /** Meeting scheduling props */
  meetings: TaskMeeting[]
  onScheduleMeeting: (meetingData: NewMeetingData) => Promise<void> | void
  onCancelMeeting: (meetingId: string, reason: string) => Promise<void> | void
  onConfirmMeeting: (meetingId: string) => Promise<void> | void
  onRescheduleMeeting: (
    meetingId: string,
    newStartTime: string,
    newEndTime: string
  ) => Promise<void> | void
  currentDate: Date
  /** Callback for updating company internal notes (travels with the company, not task-specific - for admin -> company context) */
  onUpdateCompanyNotes?: (
    companyId: string,
    notes: string
  ) => Promise<void> | void
  /** Callback for updating customer internal notes (travels with the customer, not task-specific - for company -> customer context) */
  onUpdateCustomerNotes?: (
    customerId: string,
    notes: string
  ) => Promise<void> | void
  /** Callback for logging case history updates (audit trail) */
  onCaseUpdate?: (
    taskId: string,
    caseUpdate: {
      updateType: CaseUpdate['updateType']
      description: string
      fieldChanged?: string
      oldValue?: string
      newValue?: string
    }
  ) => Promise<void> | void
  /** Company employees (for resolving comment authors) */
  employees?: Array<{ _id: string; firstName: string; lastName: string }>
  /** Administrator users (for resolving comment authors in admin context) */
  administrators?: Array<{ _id: string; firstName: string; lastName: string }>
}

/** View state for inline interface - tracks which view is currently displayed */
export type ViewState = 'board' | 'addTask' | 'showTask'

/**
 * Meeting type for scheduling meetings related to tasks
 */
export interface TaskMeeting {
  _id: string
  eventTypeName: string
  attendeeName: string
  attendeeEmail: string
  startTime: string
  endTime: string
  status: 'confirmed' | 'cancelled' | 'rescheduled' | 'completed' | 'pending'
  location: string
  notes?: string
  meetingType: 'video' | 'phone' | 'in-person'
  taskId: string
}

/**
 * Data for creating a new meeting
 */
export interface NewMeetingData {
  eventTypeName: string
  eventTypeId?: string
  attendeeName: string
  attendeeEmail: string
  startTime: string
  endTime: string
  status: 'confirmed' | 'cancelled' | 'rescheduled' | 'completed' | 'pending'
  location: string
  notes?: string
  meetingType: 'video' | 'phone' | 'in-person'
  taskId: string
}

/** Animation origin for expand-from-origin transitions */
export type AnimationOrigin = {
  x: number
  y: number
  width: number
  height: number
}

/** Form type for AddTask variants */
export type AddTaskFormType =
  | 'administratorCompanyDropdown'
  | 'administratorCompanyProvided'
  | 'companyCustomerDropdown'
  | 'companyCustomerProvided'
  | 'customer'
  | 'noUser'
