import type { ProjectBoardStyles } from '../../../theme'

/** A minimal typed comment for any type of task. */
export type Comment = {
  _id: string
  text: string
  createdAt: Date
  createdBy: string
  editHistory: CommentEditHistory[]
}

/** A history record for comment edits. */
export type CommentEditHistory = {
  _id: string
  editedBy?: string
  editedAt?: Date
  text: string
  isOriginal: boolean
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

/** Raw typed data for "articles." */
export type RawArticle = {
  _id: string
  articleTitle: string
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
  rawCustomers: RawCustomer[]
  rawEmployees: RawEmployee[]
  rawCompanies?: RawCompany[]
  rawSeverityLevels: RawSeverityLevel[]
  onEdit: (args: { _id: string }) => void
  onDelete: (args: { _id: string }) => void
  onDuplicate: (args: { _id: string }) => void
  onEditComment: (commentId: string, newText: string, taskId: string) => void
  onAdd: (newTask: Omit<Task, '_id'>) => void
  currentUser: CurrentUser
  customerId?: string
  companyId?: string
  /** Whether to prefer the dropdown version of AddTask forms instead of using the 'provided' version. */
  preferDropdown?: boolean
  /**
   * If ShowTask calls onComment with both commentText and _id,
   * define the signature here. You can also do (text: string) => void if that's your design.
   */
  onComment: (commentText: string, _id: string) => void
  /**
   * New callback for passing the revision history of a comment.
   */
  onRevisionHistory: (
    commentId: string,
    revisionHistory: CommentEditHistory[]
  ) => void
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: ProjectBoardStyles
  /** Permissions control - determines read/write access */
  permissions?: {
    access: 'no-access' | 'read' | 'write'
  }
}
