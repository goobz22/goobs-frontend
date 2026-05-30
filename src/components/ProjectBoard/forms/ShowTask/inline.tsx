'use client'

import React, { useState, useMemo, useEffect } from 'react'
import type {
  ProjectBoardStyles,
  Comment,
  CaseUpdate,
  RawSeverityLevel,
  RawQueue,
  RawRegion,
  RawStatus,
  RawSubStatus,
  RawTopic,
  RawArticle,
  RawEmployee,
  RawProduct,
  RawService,
  TaskMeeting,
  NewMeetingData,
} from '../../types'
import Dropdown, { type DropdownOption } from '../../../Field/Dropdown/Regular'
import MultiSelectChip from '../../../Field/Dropdown/MultiSelect'
import SearchBar from '../../../Field/Search'
import DateField from '../../../Field/Date/DateField'
import TimeField from '../../../Field/Time/TimeField'
import cssStyles from './ShowTask.module.css'

/**
 * Local class-composition helper. This repo has no clsx/classnames — compose
 * conditional classes with a filter+join exactly like Card/Button do.
 */
const cx = (...names: Array<string | false | null | undefined>): string =>
  names.filter(Boolean).join(' ')

interface InlineShowTaskProps {
  taskId: string
  taskTitle: string
  createdBy: string
  description: string
  comments: Comment[]
  caseUpdates: CaseUpdate[]
  customerAssigned: string
  severity: string
  schedulingQueue: string
  region: string
  status: string
  subStatus: string
  topics: string[]
  knowledgebaseArticles: string[]
  teamMemberAssigned: string
  nextActionDate: string
  currentUserName: string
  productOrService: 'product' | 'service'
  productServiceName: string
  productId: string
  serviceId: string
  onEdit: (updatedData: any) => void
  onDelete: () => void
  onComment: (text: string, taskId: string) => void
  onEditComment: (commentId: string, newText: string) => void
  onBack: () => void
  // Company notes (for administration -> company context)
  associatedCompanyId?: string
  associatedCompanyName?: string
  companyInternalNotes?: string
  onUpdateCompanyNotes?: (
    companyId: string,
    notes: string
  ) => Promise<void> | void
  // Customer notes (for company -> customer context)
  associatedCustomerId?: string
  associatedCustomerName?: string
  customerInternalNotes?: string
  onUpdateCustomerNotes?: (
    customerId: string,
    notes: string
  ) => Promise<void> | void
  severityOptions: RawSeverityLevel[]
  schedulingQueueOptions: RawQueue[]
  regionOptions: RawRegion[]
  statusOptions: RawStatus[]
  subStatusOptions: RawSubStatus[]
  topicOptions: RawTopic[]
  knowledgebaseArticleOptions: RawArticle[]
  teamMemberOptions: RawEmployee[]
  /** Raw products - only required for company variant (admin only has services) */
  rawProducts?: RawProduct[]
  rawServices: RawService[]
  /** Company employees (for resolving comment authors in company context) */
  employees?: Array<{ _id: string; firstName: string; lastName: string }>
  /** Administrator users (for resolving comment authors in admin context) */
  administrators?: Array<{ _id: string; firstName: string; lastName: string }>
  styles: ProjectBoardStyles
  // Meeting scheduling props
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
  /** Whether this is being viewed by an employee (can accept/decline bookings) or a customer */
  variant?: 'employee' | 'customer'
  // Case history audit logging callback
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
}

type TabType =
  | 'details'
  | 'comments'
  | 'caseUpdates'
  | 'resolution'
  | 'scheduling'
  | 'knowledgeBase'

export const InlineShowTask: React.FC<InlineShowTaskProps> = ({
  taskId,
  taskTitle,
  createdBy,
  description,
  comments,
  caseUpdates,
  customerAssigned,
  severity,
  schedulingQueue,
  region,
  status,
  subStatus,
  topics,
  knowledgebaseArticles,
  teamMemberAssigned,
  nextActionDate,
  currentUserName,
  productOrService,
  productServiceName,
  productId,
  serviceId,
  onEdit,
  onDelete,
  onComment,
  onEditComment,
  onBack,
  // Company notes props
  associatedCompanyId,
  associatedCompanyName,
  companyInternalNotes,
  onUpdateCompanyNotes,
  // Customer notes props
  associatedCustomerId,
  associatedCustomerName,
  customerInternalNotes,
  onUpdateCustomerNotes,
  severityOptions,
  schedulingQueueOptions,
  regionOptions,
  statusOptions,
  subStatusOptions,
  topicOptions,
  knowledgebaseArticleOptions,
  teamMemberOptions,
  rawProducts = [],
  rawServices,
  employees,
  administrators,
  styles,
  // Meeting scheduling props
  meetings,
  onScheduleMeeting,
  onCancelMeeting,
  onConfirmMeeting,
  onRescheduleMeeting,
  currentDate,
  // Case history audit logging
  onCaseUpdate,
  variant = 'employee',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('details')
  const [isEditMode, setIsEditMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [editedTitle, setEditedTitle] = useState(taskTitle)
  const [editedDescription, setEditedDescription] = useState(description)
  const [newCommentText, setNewCommentText] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentText, setEditingCommentText] = useState('')
  // Internal state for viewing revision history (handled locally, no prop needed)
  const [viewingRevisionHistoryId, setViewingRevisionHistoryId] = useState<
    string | null
  >(null)

  // Meeting scheduling state
  const [schedulingView, setSchedulingView] = useState<
    'list' | 'form' | 'details' | 'reschedule'
  >('list')
  const [selectedMeeting, setSelectedMeeting] = useState<TaskMeeting | null>(
    null
  )
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingAttendeeName, setMeetingAttendeeName] = useState('')
  const [meetingAttendeeEmail, setMeetingAttendeeEmail] = useState('')
  const [meetingDate, setMeetingDate] = useState<Date | null>(null)
  const [meetingTime, setMeetingTime] = useState<Date | null>(null)
  const [meetingDuration, setMeetingDuration] = useState('30')
  const [meetingType, setMeetingType] = useState<
    'video' | 'phone' | 'in-person'
  >('video')
  const [meetingLocation, setMeetingLocation] = useState('')
  const [meetingNotes, setMeetingNotes] = useState('')
  const [meetingError, setMeetingError] = useState<string | null>(null)
  const [isSubmittingMeeting, setIsSubmittingMeeting] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState<Date | null>(null)
  const [rescheduleTime, setRescheduleTime] = useState<Date | null>(null)
  const [rescheduleDuration, setRescheduleDuration] = useState('30')

  // Helper function to resolve author name from ID
  // Checks administrators first, then employees, falls back to the original value
  const resolveAuthorName = (createdBy: string): string => {
    // If it looks like an ID (24 char hex string), try to resolve it
    if (/^[a-f0-9]{24}$/i.test(createdBy)) {
      // Check administrators first
      const admin = administrators?.find(a => a._id === createdBy)
      if (admin) {
        return `${admin.firstName} ${admin.lastName}`.trim()
      }
      // Then check employees
      const employee = employees?.find(e => e._id === createdBy)
      if (employee) {
        return `${employee.firstName} ${employee.lastName}`.trim()
      }
    }
    // Return as-is if not an ID or not found
    return createdBy
  }

  // Edit mode state for editable fields
  const [editedSeverityId, setEditedSeverityId] = useState(
    severityOptions.find(s => s.description === severity)?._id || ''
  )
  const [editedStatusId, setEditedStatusId] = useState(
    statusOptions.find(s => s.status === status)?._id || ''
  )
  const [editedSubStatusId, setEditedSubStatusId] = useState(
    subStatusOptions.find(s => s.subStatus === subStatus)?._id || ''
  )
  const [editedQueueId, setEditedQueueId] = useState(
    schedulingQueueOptions.find(q => q.queueName === schedulingQueue)?._id || ''
  )
  const [editedRegionId, setEditedRegionId] = useState(
    regionOptions.find(r => r.regionName === region)?._id || ''
  )
  const [editedTeamMember, setEditedTeamMember] = useState(teamMemberAssigned)
  const [editedNextActionDate, setEditedNextActionDate] =
    useState(nextActionDate)

  // State for topics and articles (need to convert labels to IDs)
  const [editedTopicIds, setEditedTopicIds] = useState<string[]>(
    topicOptions.filter(t => topics.includes(t.topic)).map(t => t._id)
  )
  const [editedArticleIds, setEditedArticleIds] = useState<string[]>(
    knowledgebaseArticleOptions
      .filter(a => knowledgebaseArticles.includes(a.articleTitle))
      .map(a => a._id)
  )

  // Knowledge Base tab state
  const [kbSearchTerm, setKbSearchTerm] = useState('')
  const [selectedArticleForView, setSelectedArticleForView] =
    useState<RawArticle | null>(null)

  // Comments tab section state
  const [commentSection, setCommentSection] = useState<'external' | 'internal'>(
    'external'
  )

  // Company notes editing state (for administration -> company context)
  const [isEditingCompanyNotes, setIsEditingCompanyNotes] = useState(false)
  const [editedCompanyNotes, setEditedCompanyNotes] = useState(
    companyInternalNotes || ''
  )

  // Customer notes editing state (for company -> customer context)
  const [isEditingCustomerNotes, setIsEditingCustomerNotes] = useState(false)
  const [editedCustomerNotes, setEditedCustomerNotes] = useState(
    customerInternalNotes || ''
  )

  // Resolution tab state
  const [isEditingResolution, setIsEditingResolution] = useState(false)
  const [resolutionReason, setResolutionReason] = useState('')
  const [resolutionPrevention, setResolutionPrevention] = useState('')
  const [resolutionRecurring, setResolutionRecurring] = useState('')
  const [resolutionWriteup, setResolutionWriteup] = useState('')

  // Sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(max-width: 960px)')
    const handleChange = () => setIsMobile(mediaQuery.matches)

    handleChange()
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  useEffect(() => {
    if (isMobile && isSidebarCollapsed) {
      setIsSidebarCollapsed(false)
    }
  }, [isMobile, isSidebarCollapsed])

  // Helper function to log case updates for audit trail
  const logCaseUpdate = (
    updateType: CaseUpdate['updateType'],
    description: string,
    fieldChanged?: string,
    oldValue?: string,
    newValue?: string
  ) => {
    if (onCaseUpdate) {
      // Build the case update object, only including defined optional properties
      const caseUpdateData: {
        updateType: CaseUpdate['updateType']
        description: string
        fieldChanged?: string
        oldValue?: string
        newValue?: string
      } = {
        updateType,
        description,
      }
      if (fieldChanged !== undefined) {
        caseUpdateData.fieldChanged = fieldChanged
      }
      if (oldValue !== undefined) {
        caseUpdateData.oldValue = oldValue
      }
      if (newValue !== undefined) {
        caseUpdateData.newValue = newValue
      }
      void onCaseUpdate(taskId, caseUpdateData)
    }
  }

  // Keep edited values in sync with current props
  useEffect(() => {
    const severityId =
      severityOptions.find(s => s.description === severity)?._id || ''
    setEditedSeverityId(severityId)
  }, [severity, severityOptions])

  useEffect(() => {
    const statusId = statusOptions.find(s => s.status === status)?._id || ''
    setEditedStatusId(statusId)
  }, [status, statusOptions])

  useEffect(() => {
    const subStatusId =
      subStatusOptions.find(s => s.subStatus === subStatus)?._id || ''
    setEditedSubStatusId(subStatusId)
  }, [subStatus, subStatusOptions])

  useEffect(() => {
    const queueId =
      schedulingQueueOptions.find(q => q.queueName === schedulingQueue)?._id ||
      ''
    setEditedQueueId(queueId)
  }, [schedulingQueue, schedulingQueueOptions])

  useEffect(() => {
    const regionId = regionOptions.find(r => r.regionName === region)?._id || ''
    setEditedRegionId(regionId)
  }, [region, regionOptions])

  useEffect(() => {
    setEditedTeamMember(teamMemberAssigned)
  }, [teamMemberAssigned])

  const isSacred = styles?.theme === 'sacred'
  const isDark = styles?.theme === 'dark'
  // Theme value for the [data-theme] attribute on the styled root (sacred is
  // the hardcoded default class; light / dark are attribute overrides).
  const theme = styles?.theme || 'sacred'
  // Booleans surfaced as data-* attribute strings.
  const mobileAttr = isMobile ? 'true' : undefined

  // Determine product/service info dynamically based on IDs
  const productServiceInfo = useMemo(() => {
    if (productId) {
      const product = rawProducts.find(p => p._id === productId)
      return {
        type: 'product' as const,
        label: 'Product',
        name: product?.productName || productServiceName || 'Unknown Product',
      }
    } else if (serviceId) {
      const service = rawServices.find(s => s._id === serviceId)
      return {
        type: 'service' as const,
        label: 'Service',
        name: service?.serviceName || productServiceName || 'Unknown Service',
      }
    }
    // Fallback to productOrService if IDs are not provided
    return {
      type: productOrService,
      label: productOrService === 'product' ? 'Product' : 'Service',
      name: productServiceName || 'Not set',
    }
  }, [
    productId,
    serviceId,
    productOrService,
    productServiceName,
    rawProducts,
    rawServices,
  ])

  // Dropdown options for edit mode
  const severityDropdownOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...severityOptions.map(level => ({
        value: level.description || `Level ${level.severityLevel}`,
        _id: level._id,
      })),
    ],
    [severityOptions]
  )

  const queueDropdownOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...schedulingQueueOptions.map(queue => ({
        value: queue.queueName,
        _id: queue._id,
      })),
    ],
    [schedulingQueueOptions]
  )

  const regionDropdownOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...regionOptions.map(region => ({
        value: region.regionName,
        _id: region._id,
      })),
    ],
    [regionOptions]
  )

  const statusDropdownOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...statusOptions.map(status => ({
        value: status.status,
        _id: status._id,
      })),
    ],
    [statusOptions]
  )

  const filteredSubStatusOptions = useMemo(() => {
    if (!editedStatusId) return []
    return subStatusOptions.filter(sub => sub.statusId === editedStatusId)
  }, [subStatusOptions, editedStatusId])

  const subStatusDropdownOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...filteredSubStatusOptions.map(subStatus => ({
        value: subStatus.subStatus,
        _id: subStatus._id,
      })),
    ],
    [filteredSubStatusOptions]
  )

  const teamMemberDropdownOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...teamMemberOptions.map(member => ({
        value: `${member.firstName} ${member.lastName}`,
        _id: member._id,
      })),
    ],
    [teamMemberOptions]
  )

  const handleEditClick = () => {
    setIsEditMode(true)
  }

  const handleSaveEdit = () => {
    if (onEdit) {
      // Log case updates for each changed field
      const currentSeverityId =
        severityOptions.find(s => s.description === severity)?._id || ''
      const currentStatusId =
        statusOptions.find(s => s.status === status)?._id || ''
      const currentSubStatusId =
        subStatusOptions.find(s => s.subStatus === subStatus)?._id || ''
      const currentQueueId =
        schedulingQueueOptions.find(q => q.queueName === schedulingQueue)
          ?._id || ''
      const currentRegionId =
        regionOptions.find(r => r.regionName === region)?._id || ''
      const currentTopicIds = topicOptions
        .filter(t => topics.includes(t.topic))
        .map(t => t._id)

      // Log severity change
      if (editedSeverityId !== currentSeverityId) {
        const newSeverity =
          severityOptions.find(s => s._id === editedSeverityId)?.description ||
          'Unknown'
        logCaseUpdate(
          'severity_change',
          `Changed severity from "${severity}" to "${newSeverity}"`,
          'severity',
          severity,
          newSeverity
        )
      }

      // Log status change
      if (editedStatusId !== currentStatusId) {
        const newStatus =
          statusOptions.find(s => s._id === editedStatusId)?.status || 'Unknown'
        logCaseUpdate(
          'status_change',
          `Changed status from "${status}" to "${newStatus}"`,
          'status',
          status,
          newStatus
        )
      }

      // Log substatus change
      if (editedSubStatusId !== currentSubStatusId) {
        const newSubStatus =
          subStatusOptions.find(s => s._id === editedSubStatusId)?.subStatus ||
          'Unknown'
        logCaseUpdate(
          'substatus_change',
          `Changed sub-status from "${subStatus}" to "${newSubStatus}"`,
          'subStatus',
          subStatus,
          newSubStatus
        )
      }

      // Log queue change
      if (editedQueueId !== currentQueueId) {
        const newQueue =
          schedulingQueueOptions.find(q => q._id === editedQueueId)
            ?.queueName || 'Unknown'
        logCaseUpdate(
          'queue_change',
          `Changed scheduling queue from "${schedulingQueue}" to "${newQueue}"`,
          'schedulingQueue',
          schedulingQueue,
          newQueue
        )
      }

      // Log region change
      if (editedRegionId !== currentRegionId) {
        const newRegion =
          regionOptions.find(r => r._id === editedRegionId)?.regionName ||
          'Unknown'
        logCaseUpdate(
          'region_change',
          `Changed region from "${region}" to "${newRegion}"`,
          'region',
          region,
          newRegion
        )
      }

      // Log team member assignment change
      if (editedTeamMember !== teamMemberAssigned) {
        logCaseUpdate(
          'assignment',
          `Changed assignment from "${teamMemberAssigned || 'Unassigned'}" to "${editedTeamMember || 'Unassigned'}"`,
          'teamMember',
          teamMemberAssigned || 'Unassigned',
          editedTeamMember || 'Unassigned'
        )
      }

      // Log topic changes
      const topicsChanged =
        editedTopicIds.length !== currentTopicIds.length ||
        !editedTopicIds.every(id => currentTopicIds.includes(id))
      if (topicsChanged) {
        const oldTopics = topics.join(', ') || 'None'
        const newTopics =
          topicOptions
            .filter(t => editedTopicIds.includes(t._id))
            .map(t => t.topic)
            .join(', ') || 'None'
        logCaseUpdate(
          'topic_change',
          `Changed topics from "${oldTopics}" to "${newTopics}"`,
          'topics',
          oldTopics,
          newTopics
        )
      }

      onEdit({
        title: editedTitle,
        description: editedDescription,
        severityId: editedSeverityId,
        statusId: editedStatusId,
        substatusId: editedSubStatusId,
        schedulingQueueId: editedQueueId,
        regionId: editedRegionId,
        teamMember: editedTeamMember,
        nextActionDate: editedNextActionDate,
        topicIds: editedTopicIds,
        articleIds: editedArticleIds,
      })
    }
    setIsEditMode(false)
  }

  const handleCancelEdit = () => {
    // Reset all edited values to original
    setEditedTitle(taskTitle)
    setEditedDescription(description)
    setEditedSeverityId(
      severityOptions.find(s => s.description === severity)?._id || ''
    )
    setEditedStatusId(statusOptions.find(s => s.status === status)?._id || '')
    setEditedSubStatusId(
      subStatusOptions.find(s => s.subStatus === subStatus)?._id || ''
    )
    setEditedQueueId(
      schedulingQueueOptions.find(q => q.queueName === schedulingQueue)?._id ||
        ''
    )
    setEditedTopicIds(
      topicOptions.filter(t => topics.includes(t.topic)).map(t => t._id)
    )
    setEditedArticleIds(
      knowledgebaseArticleOptions
        .filter(a => knowledgebaseArticles.includes(a.articleTitle))
        .map(a => a._id)
    )
    setEditedRegionId(
      regionOptions.find(r => r.regionName === region)?._id || ''
    )
    setEditedTeamMember(teamMemberAssigned)
    setEditedNextActionDate(nextActionDate)
    setIsEditMode(false)
  }

  const renderSidebar = () => (
    <div
      className={cssStyles.sidebar}
      data-collapsed={isSidebarCollapsed ? 'true' : undefined}
      data-mobile={mobileAttr}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={cssStyles.collapseButton}
        title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isSidebarCollapsed ? '»' : '«'}
      </button>

      {/* Collapsed State - Show icon only */}
      {isSidebarCollapsed ? (
        <div className={cssStyles.collapsedIcons}>
          <div title="Ticket Summary" className={cssStyles.collapsedIcon}>
            📋
          </div>
        </div>
      ) : (
        <>
          <div
            className={cx(cssStyles.sectionTitle, cssStyles.sectionTitleSidebar)}
          >
            Ticket Summary
          </div>

          <div className={cssStyles.fieldRow}>
            <div className={cssStyles.fieldLabel}>Ticket #</div>
            <div className={cssStyles.fieldValue}>{taskId.substring(0, 8)}</div>
          </div>

          {/* Product or Service - Dynamically determined */}
          <div className={cssStyles.fieldRow}>
            <div className={cssStyles.fieldLabel}>
              {productServiceInfo.label}
            </div>
            <div className={cssStyles.fieldValue}>{productServiceInfo.name}</div>
          </div>

          {/* Queue - Editable in edit mode */}
          {isEditMode ? (
            <div className={cssStyles.editFieldWrap}>
              <Dropdown
                label="Queue"
                options={queueDropdownOptions}
                value={editedQueueId}
                onChange={value => setEditedQueueId(value)}
                styles={{ theme: styles?.theme || 'light' }}
              />
            </div>
          ) : (
            <div className={cssStyles.fieldRow}>
              <div className={cssStyles.fieldLabel}>Queue</div>
              <div className={cssStyles.fieldValue}>{schedulingQueue}</div>
            </div>
          )}

          {/* Region - Editable in edit mode */}
          {isEditMode ? (
            <div className={cssStyles.editFieldWrap}>
              <Dropdown
                label="Region"
                options={regionDropdownOptions}
                value={editedRegionId}
                onChange={value => setEditedRegionId(value)}
                styles={{ theme: styles?.theme || 'light' }}
              />
            </div>
          ) : (
            <div className={cssStyles.fieldRow}>
              <div className={cssStyles.fieldLabel}>Region</div>
              <div className={cssStyles.fieldValue}>{region || 'Not set'}</div>
            </div>
          )}

          {/* Status - Editable in edit mode */}
          {isEditMode ? (
            <div className={cssStyles.editFieldWrap}>
              <Dropdown
                label="Status"
                options={statusDropdownOptions}
                value={editedStatusId}
                onChange={value => {
                  setEditedStatusId(value)
                  setEditedSubStatusId('') // Reset substatus when status changes
                }}
                styles={{ theme: styles?.theme || 'light' }}
              />
            </div>
          ) : (
            <div className={cssStyles.fieldRow}>
              <div className={cssStyles.fieldLabel}>Status</div>
              <div className={cssStyles.fieldValue}>{status}</div>
            </div>
          )}

          {/* Substatus - Editable in edit mode */}
          {isEditMode
            ? filteredSubStatusOptions.length > 0 && (
                <div className={cssStyles.editFieldWrap}>
                  <Dropdown
                    label="Substatus"
                    options={subStatusDropdownOptions}
                    value={editedSubStatusId}
                    onChange={value => setEditedSubStatusId(value)}
                    styles={{
                      theme: styles?.theme || 'light',
                      disabled: !editedStatusId,
                    }}
                  />
                </div>
              )
            : subStatus && (
                <div className={cssStyles.fieldRow}>
                  <div className={cssStyles.fieldLabel}>Substatus</div>
                  <div className={cssStyles.fieldValue}>{subStatus}</div>
                </div>
              )}

          {/* Severity - Editable in edit mode */}
          {isEditMode ? (
            <div className={cssStyles.editFieldWrap}>
              <Dropdown
                label="Severity"
                options={severityDropdownOptions}
                value={editedSeverityId}
                onChange={value => setEditedSeverityId(value)}
                styles={{ theme: styles?.theme || 'light' }}
              />
            </div>
          ) : (
            <div className={cssStyles.fieldRow}>
              <div className={cssStyles.fieldLabel}>Severity</div>
              <div className={cssStyles.fieldValue}>{severity}</div>
            </div>
          )}

          {/* Assigned To - Editable in edit mode */}
          {isEditMode ? (
            <div className={cssStyles.editFieldWrap}>
              <Dropdown
                label="Assigned To"
                options={teamMemberDropdownOptions}
                value={
                  teamMemberOptions.find(
                    m => `${m.firstName} ${m.lastName}` === editedTeamMember
                  )?._id || ''
                }
                onChange={value => {
                  const member = teamMemberOptions.find(m => m._id === value)
                  setEditedTeamMember(
                    member ? `${member.firstName} ${member.lastName}` : ''
                  )
                }}
                styles={{ theme: styles?.theme || 'light' }}
              />
            </div>
          ) : (
            teamMemberAssigned && (
              <div className={cssStyles.fieldRow}>
                <div className={cssStyles.fieldLabel}>Assigned To</div>
                <div className={cssStyles.fieldValue}>{teamMemberAssigned}</div>
              </div>
            )
          )}

          {/* Topics - Editable in edit mode */}
          {isEditMode ? (
            <div className={cssStyles.editFieldWrap}>
              <MultiSelectChip
                label="Topics"
                defaultSelected={editedTopicIds}
                onChange={(selectedIds: string[]) =>
                  setEditedTopicIds(selectedIds)
                }
                options={topicOptions.map(t => ({
                  value: t.topic,
                  _id: t._id,
                }))}
                styles={{ theme: styles?.theme || 'light' }}
              />
            </div>
          ) : (
            topics.length > 0 && (
              <div className={cssStyles.fieldRow}>
                <div className={cssStyles.fieldLabel}>Topics</div>
                <div className={cssStyles.fieldValue}>{topics.join(', ')}</div>
              </div>
            )
          )}

          {/* KB Articles - Editable in edit mode */}
          {isEditMode ? (
            <div className={cssStyles.editFieldWrap}>
              <MultiSelectChip
                label="KB Articles"
                defaultSelected={editedArticleIds}
                onChange={(selectedIds: string[]) =>
                  setEditedArticleIds(selectedIds)
                }
                options={knowledgebaseArticleOptions.map(a => ({
                  value: a.articleTitle,
                  _id: a._id,
                }))}
                styles={{ theme: styles?.theme || 'light' }}
              />
            </div>
          ) : (
            knowledgebaseArticles.length > 0 && (
              <div className={cssStyles.fieldRow}>
                <div className={cssStyles.fieldLabel}>KB Articles</div>
                <div className={cssStyles.fieldValue}>
                  {knowledgebaseArticles.join(', ')}
                </div>
              </div>
            )
          )}

          {nextActionDate && (
            <div className={cssStyles.fieldRow}>
              <div className={cssStyles.fieldLabel}>Next Action</div>
              <div className={cssStyles.fieldValue}>{nextActionDate}</div>
            </div>
          )}

          <div className={cssStyles.actionButtons} data-mobile={mobileAttr}>
            {isEditMode ? (
              <>
                <button
                  className={cx(
                    cssStyles.button,
                    cssStyles.flexButton,
                    cssStyles.saveButton
                  )}
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
                <button
                  className={cx(
                    cssStyles.button,
                    cssStyles.flexButton,
                    cssStyles.ghostButton
                  )}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className={cx(
                    cssStyles.button,
                    cssStyles.flexButton,
                    cssStyles.editButton
                  )}
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                <button
                  className={cx(cssStyles.button, cssStyles.deleteButton)}
                  onClick={onDelete}
                >
                  Delete
                </button>
              </>
            )}
          </div>

          <div
            className={cx(
              cssStyles.actionButtons,
              cssStyles.actionButtonsSpacedTop
            )}
            data-mobile={mobileAttr}
          >
            <button
              className={cx(
                cssStyles.button,
                cssStyles.fullWidthButton,
                cssStyles.ghostButton
              )}
              onClick={onBack}
            >
              Back to Board
            </button>
          </div>
        </>
      )}
    </div>
  )

  const renderDetailsTab = () => {
    // Handler for saving company notes (updates company record, NOT task comments)
    const handleSaveCompanyNotes = () => {
      if (onUpdateCompanyNotes && associatedCompanyId) {
        onUpdateCompanyNotes(associatedCompanyId, editedCompanyNotes)

        // Log case update for company notes
        logCaseUpdate(
          'customer_notes_update',
          `Updated company internal notes`,
          'companyInternalNotes',
          companyInternalNotes || '(empty)',
          editedCompanyNotes.substring(0, 100) +
            (editedCompanyNotes.length > 100 ? '...' : '')
        )

        setIsEditingCompanyNotes(false)
      }
    }

    // Handler for saving customer notes (updates customer record, NOT task comments)
    const handleSaveCustomerNotes = () => {
      if (onUpdateCustomerNotes && associatedCustomerId) {
        onUpdateCustomerNotes(associatedCustomerId, editedCustomerNotes)

        // Log case update for customer notes
        logCaseUpdate(
          'customer_notes_update',
          `Updated customer internal notes`,
          'customerInternalNotes',
          customerInternalNotes || '(empty)',
          editedCustomerNotes.substring(0, 100) +
            (editedCustomerNotes.length > 100 ? '...' : '')
        )

        setIsEditingCustomerNotes(false)
      }
    }

    return (
      <>
        <div className={cssStyles.twoColumnGrid}>
          {/* Left Column - User Info */}
          <div className={cssStyles.card}>
            <div
              className={cx(cssStyles.sectionTitle, cssStyles.sectionTitleTopReset)}
            >
              User
            </div>

            <div className={cssStyles.fieldRow}>
              <div className={cssStyles.fieldLabel}>Requestor</div>
              <div className={cssStyles.fieldValue}>{createdBy}</div>
            </div>

            <div className={cssStyles.fieldRow}>
              <div className={cssStyles.fieldLabel}>Customer</div>
              <div className={cssStyles.fieldValue}>{customerAssigned}</div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className={cssStyles.card}>
            <div
              className={cx(cssStyles.sectionTitle, cssStyles.sectionTitleTopReset)}
            >
              Details
            </div>

            <div className={cssStyles.fieldRow}>
              <div className={cssStyles.fieldLabel}>Title</div>
              <div className={cssStyles.fieldValue}>{taskTitle}</div>
            </div>

            <div className={cssStyles.fieldRow}>
              <div className={cssStyles.fieldLabel}>Description</div>
              <div className={cssStyles.fieldValue}>{description}</div>
            </div>

            {topics.length > 0 && (
              <div className={cssStyles.fieldRow}>
                <div className={cssStyles.fieldLabel}>Topics</div>
                <div className={cssStyles.fieldValue}>{topics.join(', ')}</div>
              </div>
            )}

            {knowledgebaseArticles.length > 0 && (
              <div className={cssStyles.fieldRow}>
                <div className={cssStyles.fieldLabel}>KB Articles</div>
                <div className={cssStyles.fieldValue}>
                  {knowledgebaseArticles.join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Internal Company Notes Section - Shown when associatedCompanyId is provided */}
        {associatedCompanyId && (
          <div className={cx(cssStyles.card, cssStyles.cardSpacedTop)}>
            <div className={cssStyles.notesHeaderRow}>
              <div
                className={cx(cssStyles.sectionTitle, cssStyles.notesHeaderTitle)}
              >
                Internal Company Notes
                {associatedCompanyName && (
                  <span className={cssStyles.notesHeaderSuffix}>
                    ({associatedCompanyName})
                  </span>
                )}
              </div>
              {!isEditingCompanyNotes && (
                <button
                  onClick={() => {
                    setEditedCompanyNotes(companyInternalNotes || '')
                    setIsEditingCompanyNotes(true)
                  }}
                  className={cssStyles.notesEditButton}
                >
                  {companyInternalNotes ? 'Edit Note' : '+ Add Note'}
                </button>
              )}
            </div>

            <p className={cssStyles.notesHelpText}>
              These notes are attached to the company record and will appear on
              all tasks for this company. For task-specific internal comments,
              use the Comments tab.
            </p>

            {/* Edit Company Notes Form */}
            {isEditingCompanyNotes ? (
              <div className={cssStyles.notesEditForm}>
                <textarea
                  value={editedCompanyNotes}
                  onChange={e => setEditedCompanyNotes(e.target.value)}
                  placeholder="Add internal notes about this company..."
                  className={cssStyles.notesTextarea}
                />
                <div className={cssStyles.notesFormActions}>
                  <button
                    onClick={handleSaveCompanyNotes}
                    className={cssStyles.notesSaveButton}
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingCompanyNotes(false)
                      setEditedCompanyNotes(companyInternalNotes || '')
                    }}
                    className={cssStyles.smallCancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : companyInternalNotes ? (
              /* Display Company Notes - from company record */
              <div className={cssStyles.notesDisplay}>
                <div className={cssStyles.notesDisplayHeader}>
                  <span>🏢</span>
                  <span>Company Notes</span>
                </div>
                <div className={cssStyles.notesDisplayBody}>
                  {companyInternalNotes}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className={cssStyles.emptyPlaceholder}>
                No internal company notes yet. Click &quot;+ Add Note&quot; to
                add one.
              </div>
            )}
          </div>
        )}

        {/* Internal Customer Notes Section - Shown when associatedCustomerId is provided */}
        {associatedCustomerId && (
          <div className={cx(cssStyles.card, cssStyles.cardSpacedTop)}>
            <div className={cssStyles.notesHeaderRow}>
              <div
                className={cx(cssStyles.sectionTitle, cssStyles.notesHeaderTitle)}
              >
                Internal Customer Notes
                {associatedCustomerName && (
                  <span className={cssStyles.notesHeaderSuffix}>
                    ({associatedCustomerName})
                  </span>
                )}
              </div>
              {!isEditingCustomerNotes && (
                <button
                  onClick={() => {
                    setEditedCustomerNotes(customerInternalNotes || '')
                    setIsEditingCustomerNotes(true)
                  }}
                  className={cssStyles.notesEditButton}
                >
                  {customerInternalNotes ? 'Edit Note' : '+ Add Note'}
                </button>
              )}
            </div>

            <p className={cssStyles.notesHelpText}>
              These notes are attached to the customer record and will appear on
              all tasks for this customer. For task-specific internal comments,
              use the Comments tab.
            </p>

            {/* Edit Customer Notes Form */}
            {isEditingCustomerNotes ? (
              <div className={cssStyles.notesEditForm}>
                <textarea
                  value={editedCustomerNotes}
                  onChange={e => setEditedCustomerNotes(e.target.value)}
                  placeholder="Add internal notes about this customer..."
                  className={cssStyles.notesTextarea}
                ></textarea>
                <div className={cssStyles.notesFormActions}>
                  <button
                    onClick={handleSaveCustomerNotes}
                    className={cssStyles.notesSaveButton}
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingCustomerNotes(false)
                      setEditedCustomerNotes(customerInternalNotes || '')
                    }}
                    className={cssStyles.smallCancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : customerInternalNotes ? (
              /* Display Customer Notes - from customer record */
              <div className={cssStyles.notesDisplay}>
                <div className={cssStyles.notesDisplayHeader}>
                  <span>📋</span>
                  <span>Customer Notes</span>
                </div>
                <div className={cssStyles.notesDisplayBody}>
                  {customerInternalNotes}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className={cssStyles.emptyPlaceholder}>
                No internal customer notes yet. Click &quot;+ Add Note&quot; to
                add one.
              </div>
            )}
          </div>
        )}
      </>
    )
  }

  const renderCommentsTab = () => {
    const handleEditCommentClick = (comment: Comment) => {
      setEditingCommentId(comment._id)
      setEditingCommentText(comment.text)
    }

    const handleSaveCommentEdit = (commentId: string) => {
      if (editingCommentText.trim() && onEditComment) {
        onEditComment(commentId, editingCommentText.trim())
        setEditingCommentId(null)
        setEditingCommentText('')
      }
    }

    const handleCancelCommentEdit = () => {
      setEditingCommentId(null)
      setEditingCommentText('')
    }

    // Filter comments based on section
    const publicComments = comments.filter(
      c => !c.text.startsWith('[INTERNAL]')
    )
    const internalNotes = comments.filter(c => c.text.startsWith('[INTERNAL]'))
    const currentComments =
      commentSection === 'external' ? publicComments : internalNotes

    const handleAddComment = () => {
      if (newCommentText.trim()) {
        if (commentSection === 'internal') {
          // Prefix with [INTERNAL] for internal notes
          onComment(`[INTERNAL] ${newCommentText.trim()}`, taskId)
          logCaseUpdate(
            'internal_comment',
            `Added internal comment`,
            'internalComment',
            undefined,
            newCommentText.trim().substring(0, 100) +
              (newCommentText.trim().length > 100 ? '...' : '')
          )
        } else {
          onComment(newCommentText.trim(), taskId)
          logCaseUpdate(
            'comment',
            `Added external comment`,
            'comment',
            undefined,
            newCommentText.trim().substring(0, 100) +
              (newCommentText.trim().length > 100 ? '...' : '')
          )
        }
        setNewCommentText('')
      }
    }

    // Runtime accent color for the section description left border + add button.
    const isInternal = commentSection === 'internal'
    // External accent: sacred gold else blue. Internal accent: sacred / amber.
    const sectionAccent = isInternal
      ? isSacred
        ? '#FF9800'
        : '#F59E0B'
      : isSacred
        ? '#FFD700'
        : '#3B82F6'

    // Add-comment textarea border (internal gets amber accent).
    const commentInputBorderVars = isInternal
      ? ({
          ['--st-input-border']: isSacred
            ? 'rgba(255, 152, 0, 0.3)'
            : '#F59E0B',
        } as React.CSSProperties)
      : undefined

    // Submit button colors (internal amber, external blue/gold).
    const submitVars = (
      isInternal
        ? {
            ['--st-submit-bg']: isSacred
              ? 'rgba(255, 152, 0, 0.2)'
              : isDark
                ? '#78350f'
                : '#F59E0B',
            ['--st-submit-color']: isSacred ? '#FF9800' : '#FFFFFF',
          }
        : {
            ['--st-submit-bg']: isSacred
              ? 'rgba(255, 215, 0, 0.2)'
              : isDark
                ? '#374151'
                : '#3B82F6',
            ['--st-submit-color']: isSacred ? '#FFD700' : '#FFFFFF',
          }
    ) as React.CSSProperties

    return (
      <div className={cssStyles.card}>
        {/* Section Toggle */}
        <div className={cssStyles.commentToggleRow}>
          <button
            className={cssStyles.sectionToggle}
            data-active={commentSection === 'external' ? 'true' : undefined}
            onClick={() => setCommentSection('external')}
          >
            External Comments ({publicComments.length})
          </button>
          <button
            className={cssStyles.sectionToggle}
            data-active={commentSection === 'internal' ? 'true' : undefined}
            onClick={() => setCommentSection('internal')}
          >
            Internal Comments ({internalNotes.length})
          </button>
        </div>

        {/* Section Description */}
        <p
          className={cssStyles.sectionDescription}
          style={{ ['--st-accent']: sectionAccent } as React.CSSProperties}
        >
          {commentSection === 'external'
            ? 'External comments are visible to the customer and can be used for customer communication.'
            : 'Internal notes are only visible to employees and are used for internal case discussions.'}
        </p>

        {/* Add Comment */}
        <div className={cssStyles.commentInputWrap}>
          <textarea
            value={newCommentText}
            onChange={e => setNewCommentText(e.target.value)}
            placeholder={
              commentSection === 'external'
                ? 'Add a comment for the customer...'
                : 'Add an internal note (only visible to employees)...'
            }
            className={cssStyles.commentTextarea}
            style={commentInputBorderVars}
          />
          <button
            className={cx(cssStyles.button, cssStyles.commentSubmitButton)}
            style={submitVars}
            onClick={handleAddComment}
          >
            {commentSection === 'external'
              ? 'Send to Customer'
              : 'Add Internal Note'}
          </button>
        </div>

        {/* Comments List */}
        <div className={cssStyles.commentsList}>
          {currentComments.length === 0 ? (
            <p className={cssStyles.centeredMuted}>
              {commentSection === 'external'
                ? 'No external comments yet. Be the first to communicate with the customer!'
                : 'No internal notes yet. Add notes for your team!'}
            </p>
          ) : (
            currentComments.map(comment => {
              // For internal notes, strip the [INTERNAL] prefix for display
              const displayText =
                commentSection === 'internal'
                  ? comment.text.replace(/^\[INTERNAL\]\s*/, '')
                  : comment.text

              // Runtime border + left accent for the comment card.
              const commentCardVars = (
                commentSection === 'internal'
                  ? {
                      ['--st-comment-border']: isSacred
                        ? 'rgba(255, 152, 0, 0.2)'
                        : 'rgba(245, 158, 11, 0.3)',
                      ['--st-comment-accent']: isSacred ? '#FF9800' : '#F59E0B',
                    }
                  : {}
              ) as React.CSSProperties

              return (
                <div
                  key={comment._id}
                  className={cssStyles.commentCard}
                  data-internal={
                    commentSection === 'internal' ? 'true' : undefined
                  }
                  style={commentCardVars}
                >
                  <div className={cssStyles.commentCardHeader}>
                    <div className={cssStyles.commentAuthorRow}>
                      <div className={cssStyles.commentAuthorName}>
                        {resolveAuthorName(comment.createdBy)}
                      </div>
                      <div className={cssStyles.commentTimestamp}>
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                      {commentSection === 'internal' && (
                        <span className={cssStyles.internalBadge}>
                          INTERNAL
                        </span>
                      )}
                    </div>
                    <div className={cssStyles.commentActions}>
                      {comment.editHistory &&
                        comment.editHistory.length > 1 && (
                          <button
                            onClick={() =>
                              setViewingRevisionHistoryId(
                                viewingRevisionHistoryId === comment._id
                                  ? null
                                  : comment._id
                              )
                            }
                            className={cssStyles.historyToggleButton}
                          >
                            {viewingRevisionHistoryId === comment._id
                              ? 'Hide History'
                              : 'View History'}
                          </button>
                        )}
                      {comment.createdBy === currentUserName &&
                        editingCommentId !== comment._id && (
                          <button
                            onClick={() => handleEditCommentClick(comment)}
                            className={cssStyles.commentEditButton}
                          >
                            Edit
                          </button>
                        )}
                    </div>
                  </div>
                  {editingCommentId === comment._id ? (
                    <div>
                      <textarea
                        value={editingCommentText}
                        onChange={e => setEditingCommentText(e.target.value)}
                        className={cssStyles.commentEditTextarea}
                      />
                      <div className={cssStyles.inlineButtonRow}>
                        <button
                          onClick={() => handleSaveCommentEdit(comment._id)}
                          className={cx(
                            cssStyles.button,
                            cssStyles.tinyButton,
                            cssStyles.saveButton
                          )}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelCommentEdit}
                          className={cx(
                            cssStyles.button,
                            cssStyles.tinyButton,
                            cssStyles.ghostButton
                          )}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={cssStyles.commentBody}>{displayText}</div>
                  )}
                  {/* Inline revision history display */}
                  {viewingRevisionHistoryId === comment._id &&
                    comment.editHistory &&
                    comment.editHistory.length > 1 && (
                      <div className={cssStyles.revisionHistory}>
                        <div className={cssStyles.revisionHistoryTitle}>
                          Edit History ({comment.editHistory.length} revisions)
                        </div>
                        {comment.editHistory
                          .slice()
                          .reverse()
                          .map((revision, idx) => {
                            // Runtime bg + left accent: original revisions are
                            // highlighted, others are transparent/border.
                            const revisionVars = {
                              ['--st-revision-bg']: revision.isOriginal
                                ? isSacred
                                  ? 'rgba(255, 215, 0, 0.1)'
                                  : 'rgba(59, 130, 246, 0.1)'
                                : 'transparent',
                              ['--st-revision-accent']: revision.isOriginal
                                ? isSacred
                                  ? '#FFD700'
                                  : '#3B82F6'
                                : undefined,
                            } as React.CSSProperties
                            return (
                              <div
                                key={revision._id}
                                className={cssStyles.revisionItem}
                                style={{
                                  ...revisionVars,
                                  marginBottom:
                                    idx < comment.editHistory.length - 1
                                      ? '0.5rem'
                                      : 0,
                                }}
                              >
                                <div className={cssStyles.revisionMeta}>
                                  {revision.isOriginal
                                    ? 'Original'
                                    : `Edited by ${revision.editedBy || 'Unknown'}`}
                                  {revision.editedAt && (
                                    <span className={cssStyles.revisionMetaTime}>
                                      {new Date(
                                        revision.editedAt
                                      ).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <div className={cssStyles.revisionText}>
                                  {revision.text}
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    )}
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  const renderCaseUpdatesTab = () => {
    const updateTypeColors: Record<string, string> = {
      created: isSacred ? '#4ade80' : isDark ? '#10B981' : '#10B981',
      status_change: isSacred ? '#60a5fa' : isDark ? '#3B82F6' : '#3B82F6',
      assignment: isSacred ? '#a78bfa' : isDark ? '#8B5CF6' : '#8B5CF6',
      comment: isSacred ? '#FFD700' : isDark ? '#F59E0B' : '#F59E0B',
      field_update: isSacred ? '#fb923c' : isDark ? '#F97316' : '#F97316',
    }

    return (
      <div className={cssStyles.card}>
        <div
          className={cx(cssStyles.sectionTitle, cssStyles.sectionTitleTopReset)}
        >
          Case Updates ({caseUpdates.length})
        </div>

        {/* Activity Timeline */}
        <div className={cssStyles.commentsList}>
          {caseUpdates.length === 0 ? (
            <p
              className={cx(
                cssStyles.centeredMuted,
                cssStyles.centeredMutedSpacedTop
              )}
            >
              No case updates yet. All task changes will appear here.
            </p>
          ) : (
            caseUpdates.map(update => (
              <div
                key={update._id}
                className={cssStyles.caseUpdateCard}
                style={
                  {
                    ['--st-update-accent']:
                      updateTypeColors[update.updateType] || undefined,
                  } as React.CSSProperties
                }
              >
                <div className={cssStyles.caseUpdateHeader}>
                  <div className={cssStyles.caseUpdateAuthor}>
                    {update.updatedBy}
                  </div>
                  <div className={cssStyles.caseUpdateTimestamp}>
                    {new Date(update.updatedAt).toLocaleString()}
                  </div>
                </div>
                <div className={cssStyles.caseUpdateBody}>
                  {update.description}
                </div>
                {update.fieldChanged && (
                  <div className={cssStyles.caseUpdateField}>
                    {update.fieldChanged}: {update.oldValue} → {update.newValue}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // Filter meetings for this task
  const taskMeetings = meetings.filter(m => m.taskId === taskId)

  // Meeting form reset helper
  const resetMeetingForm = () => {
    setMeetingTitle(`Meeting: ${taskTitle}`)
    setMeetingAttendeeName('')
    setMeetingAttendeeEmail('')
    setMeetingDate(null)
    setMeetingTime(null)
    setMeetingDuration('30')
    setMeetingType('video')
    setMeetingLocation('')
    setMeetingNotes('')
    setMeetingError(null)
  }

  // Meeting form submission handler
  const handleScheduleMeeting = async () => {
    if (!onScheduleMeeting) return

    // Validation
    if (!meetingTitle.trim()) {
      setMeetingError('Please enter a meeting title')
      return
    }
    if (!meetingAttendeeName.trim()) {
      setMeetingError('Please enter attendee name')
      return
    }
    if (!meetingAttendeeEmail.trim()) {
      setMeetingError('Please enter attendee email')
      return
    }
    if (!meetingDate || !meetingTime) {
      setMeetingError('Please select a date and time')
      return
    }

    setIsSubmittingMeeting(true)
    setMeetingError(null)

    try {
      // Combine date and time into a single DateTime
      const startDateTime = new Date(meetingDate)
      startDateTime.setHours(
        meetingTime.getHours(),
        meetingTime.getMinutes(),
        0,
        0
      )
      const endDateTime = new Date(
        startDateTime.getTime() + parseInt(meetingDuration) * 60000
      )

      await onScheduleMeeting({
        eventTypeName: meetingTitle,
        attendeeName: meetingAttendeeName,
        attendeeEmail: meetingAttendeeEmail,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        status: 'pending',
        location:
          meetingType === 'video'
            ? 'Video Call'
            : meetingType === 'phone'
              ? 'Phone Call'
              : meetingLocation,
        notes: meetingNotes,
        meetingType,
        taskId,
      })

      // Log case update for meeting scheduled
      logCaseUpdate(
        'meeting_scheduled',
        `Scheduled ${meetingType} meeting with ${meetingAttendeeName} for ${startDateTime.toLocaleString()}`,
        'meeting',
        undefined,
        `${meetingTitle} - ${startDateTime.toLocaleString()}`
      )

      resetMeetingForm()
      setSchedulingView('list')
    } catch (err) {
      setMeetingError(
        err instanceof Error ? err.message : 'Failed to schedule meeting'
      )
    } finally {
      setIsSubmittingMeeting(false)
    }
  }

  // Meeting cancel handler
  const handleCancelMeetingAction = async (meetingId: string) => {
    if (!onCancelMeeting) return
    const meeting = meetings.find(m => m._id === meetingId)
    await onCancelMeeting(meetingId, cancelReason)

    // Log case update for meeting cancelled
    logCaseUpdate(
      'meeting_cancelled',
      `Cancelled meeting: ${meeting?.eventTypeName || 'Unknown'}`,
      'meeting',
      meeting?.eventTypeName,
      `Cancelled - Reason: ${cancelReason || 'No reason provided'}`
    )

    setCancelReason('')
    setSelectedMeeting(null)
    setSchedulingView('list')
  }

  // Meeting confirm handler
  const handleConfirmMeetingAction = async (meetingId: string) => {
    if (!onConfirmMeeting) return
    const meeting = meetings.find(m => m._id === meetingId)
    await onConfirmMeeting(meetingId)

    // Log case update for meeting confirmed
    logCaseUpdate(
      'meeting_confirmed',
      `Confirmed meeting: ${meeting?.eventTypeName || 'Unknown'}`,
      'meeting',
      undefined,
      `Confirmed - ${new Date(meeting?.startTime || '').toLocaleString()}`
    )

    setSelectedMeeting(null)
    setSchedulingView('list')
  }

  // Meeting reschedule handler
  const handleRescheduleMeetingAction = async () => {
    if (!onRescheduleMeeting || !selectedMeeting) return

    if (!rescheduleDate || !rescheduleTime) {
      setMeetingError('Please select a new date and time')
      return
    }

    setIsSubmittingMeeting(true)
    setMeetingError(null)

    try {
      const originalStart = new Date(selectedMeeting.startTime)
      // Combine date and time into a single DateTime
      const newStartDateTime = new Date(rescheduleDate)
      newStartDateTime.setHours(
        rescheduleTime.getHours(),
        rescheduleTime.getMinutes(),
        0,
        0
      )
      const newEndDateTime = new Date(
        newStartDateTime.getTime() + parseInt(rescheduleDuration) * 60000
      )

      await onRescheduleMeeting(
        selectedMeeting._id,
        newStartDateTime.toISOString(),
        newEndDateTime.toISOString()
      )

      // Log case update for meeting rescheduled
      logCaseUpdate(
        'meeting_rescheduled',
        `Rescheduled meeting: ${selectedMeeting.eventTypeName}`,
        'meeting',
        originalStart.toLocaleString(),
        newStartDateTime.toLocaleString()
      )

      setRescheduleDate(null)
      setRescheduleTime(null)
      setRescheduleDuration('30')
      setSelectedMeeting(null)
      setSchedulingView('list')
    } catch (err) {
      setMeetingError(
        err instanceof Error ? err.message : 'Failed to reschedule meeting'
      )
    } finally {
      setIsSubmittingMeeting(false)
    }
  }

  // Initialize reschedule form with current meeting values
  const initializeRescheduleForm = (meeting: TaskMeeting) => {
    const start = new Date(meeting.startTime)
    const end = new Date(meeting.endTime)
    const durationMins = Math.round((end.getTime() - start.getTime()) / 60000)

    // Set date (just the date part)
    const dateOnly = new Date(start)
    dateOnly.setHours(0, 0, 0, 0)
    setRescheduleDate(dateOnly)

    // Set time
    const timeOnly = new Date()
    timeOnly.setHours(start.getHours(), start.getMinutes(), 0, 0)
    setRescheduleTime(timeOnly)

    setRescheduleDuration(String(durationMins))
    setMeetingError(null)
  }

  // Format meeting time for display
  const formatMeetingTime = (start: string, end: string): string => {
    const startTime = new Date(start)
    const endTime = new Date(end)
    return `${startTime.toLocaleDateString()} · ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  // Get relative time from now
  const getRelativeTime = (dateString: string): string => {
    const now = currentDate
    const date = new Date(dateString)
    const diffMs = date.getTime() - now.getTime()
    if (diffMs < 0) return 'Past'
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    if (diffDays === 0) {
      if (diffHours === 0) return 'Less than an hour'
      return `${diffHours} hours`
    } else if (diffDays === 1) {
      return 'Tomorrow'
    }
    return `${diffDays} days`
  }

  // Get status color for meeting
  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bg: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50' }
      case 'pending':
        return { bg: 'rgba(33, 150, 243, 0.2)', color: '#2196F3' }
      case 'cancelled':
        return { bg: 'rgba(244, 67, 54, 0.2)', color: '#F44336' }
      case 'rescheduled':
        return { bg: 'rgba(255, 152, 0, 0.2)', color: '#FF9800' }
      case 'completed':
        return { bg: 'rgba(158, 158, 158, 0.2)', color: '#9E9E9E' }
      default:
        return { bg: 'rgba(158, 158, 158, 0.2)', color: '#9E9E9E' }
    }
  }

  // Helper: build the runtime status-color CSS variables for a meeting badge.
  const statusColorVars = (statusColors: {
    bg: string
    color: string
  }): React.CSSProperties =>
    ({
      ['--st-status-bg']: statusColors.bg,
      ['--st-status-color']: statusColors.color,
    }) as React.CSSProperties

  const renderSchedulingTab = () => {
    // Render meeting form view
    if (schedulingView === 'form') {
      return (
        <div className={cssStyles.card}>
          <div
            className={cx(cssStyles.sectionTitle, cssStyles.cardSectionTitleFlex)}
          >
            <span>Schedule New Meeting</span>
            <button
              onClick={() => {
                resetMeetingForm()
                setSchedulingView('list')
              }}
              className={cx(cssStyles.button, cssStyles.tinyButtonPad)}
            >
              Cancel
            </button>
          </div>

          {meetingError && (
            <div className={cssStyles.errorBanner}>{meetingError}</div>
          )}

          {/* Meeting Title */}
          <div className={cssStyles.fieldBlock}>
            <label className={cssStyles.meetingLabel}>Meeting Title *</label>
            <input
              type="text"
              value={meetingTitle}
              onChange={e => setMeetingTitle(e.target.value)}
              placeholder="e.g., Project Discussion, Sprint Planning"
              className={cssStyles.meetingInput}
            />
          </div>

          {/* Meeting Type */}
          <div className={cssStyles.fieldBlock}>
            <label className={cssStyles.meetingLabel}>Meeting Type *</label>
            <div className={cssStyles.radioGroup}>
              {(['video', 'phone', 'in-person'] as const).map(type => (
                <label
                  key={type}
                  className={cssStyles.meetingRadioLabel}
                  data-selected={meetingType === type ? 'true' : undefined}
                >
                  <input
                    type="radio"
                    name="meetingType"
                    value={type}
                    checked={meetingType === type}
                    onChange={() => setMeetingType(type)}
                    style={{ accentColor: isSacred ? '#FFD700' : '#3B82F6' }}
                  />
                  {type === 'video'
                    ? 'Video Call'
                    : type === 'phone'
                      ? 'Phone Call'
                      : 'In-Person'}
                </label>
              ))}
            </div>
          </div>

          {/* Location (for in-person) */}
          {meetingType === 'in-person' && (
            <div className={cssStyles.fieldBlock}>
              <label className={cssStyles.meetingLabel}>Location *</label>
              <input
                type="text"
                value={meetingLocation}
                onChange={e => setMeetingLocation(e.target.value)}
                placeholder="e.g., Conference Room A"
                className={cssStyles.meetingInput}
              />
            </div>
          )}

          {/* Attendee Info */}
          <div className={cssStyles.twoColForm}>
            <div>
              <label className={cssStyles.meetingLabel}>Attendee Name *</label>
              <input
                type="text"
                value={meetingAttendeeName}
                onChange={e => setMeetingAttendeeName(e.target.value)}
                placeholder="Full name"
                className={cssStyles.meetingInput}
              />
            </div>
            <div>
              <label className={cssStyles.meetingLabel}>Attendee Email *</label>
              <input
                type="email"
                value={meetingAttendeeEmail}
                onChange={e => setMeetingAttendeeEmail(e.target.value)}
                placeholder="email@example.com"
                className={cssStyles.meetingInput}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div
            className={cx(
              cssStyles.threeColForm,
              cssStyles.threeColFormSpaced
            )}
          >
            <DateField
              label="Date *"
              value={meetingDate}
              onChange={date => setMeetingDate(date)}
              styles={{ theme: 'sacred', marginBottom: '0' }}
            />
            <TimeField
              label="Start Time *"
              value={meetingTime}
              onChange={time => setMeetingTime(time)}
              styles={{ theme: 'sacred' }}
            />
            <Dropdown
              label="Duration"
              value={meetingDuration}
              onChange={value => setMeetingDuration(value)}
              options={[
                { value: '15', _id: '15' },
                { value: '30', _id: '30' },
                { value: '45', _id: '45' },
                { value: '60', _id: '60' },
                { value: '90', _id: '90' },
                { value: '120', _id: '120' },
              ]}
              styles={{ theme: 'sacred', marginBottom: '0' }}
            />
          </div>

          {/* Notes */}
          <div className={cssStyles.fieldBlock}>
            <label className={cssStyles.meetingLabel}>Notes</label>
            <textarea
              value={meetingNotes}
              onChange={e => setMeetingNotes(e.target.value)}
              placeholder="Any additional information..."
              rows={3}
              className={cx(cssStyles.meetingInput, cssStyles.meetingTextarea)}
            />
          </div>

          {/* Submit Button */}
          <div className={cssStyles.formActionsRight}>
            <button
              onClick={() => {
                resetMeetingForm()
                setSchedulingView('list')
              }}
              disabled={isSubmittingMeeting}
              className={cx(
                cssStyles.button,
                isSubmittingMeeting && cssStyles.buttonDisabled
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleScheduleMeeting}
              disabled={isSubmittingMeeting || !onScheduleMeeting}
              className={cx(
                cssStyles.button,
                cssStyles.primaryButton,
                (isSubmittingMeeting || !onScheduleMeeting) &&
                  cssStyles.buttonDisabled
              )}
            >
              {isSubmittingMeeting ? 'Scheduling...' : 'Schedule Meeting'}
            </button>
          </div>
        </div>
      )
    }

    // Render meeting details view
    if (schedulingView === 'details' && selectedMeeting) {
      const statusColors = getMeetingStatusColor(selectedMeeting.status)
      const startTime = new Date(selectedMeeting.startTime)
      const endTime = new Date(selectedMeeting.endTime)
      const isUpcoming = startTime > currentDate
      const isPending = selectedMeeting.status === 'pending'
      const isActive =
        selectedMeeting.status !== 'cancelled' &&
        selectedMeeting.status !== 'completed'

      return (
        <div className={cssStyles.card}>
          <div
            className={cx(cssStyles.sectionTitle, cssStyles.cardSectionTitleFlex)}
          >
            <span>Meeting Details</span>
            <button
              onClick={() => {
                setSelectedMeeting(null)
                setSchedulingView('list')
              }}
              className={cx(cssStyles.button, cssStyles.tinyButtonPad)}
            >
              Back to List
            </button>
          </div>

          {/* Status Badge */}
          <div className={cssStyles.statusBadgeWrap}>
            <span
              className={cssStyles.statusBadge}
              style={statusColorVars(statusColors)}
            >
              {selectedMeeting.status.charAt(0).toUpperCase() +
                selectedMeeting.status.slice(1)}
            </span>
          </div>

          {/* Meeting Title */}
          <div className={cssStyles.meetingTitleWrap}>
            <div className={cssStyles.meetingTitleLarge}>
              {selectedMeeting.eventTypeName}
            </div>
          </div>

          {/* Meeting Info Grid */}
          <div className={cssStyles.meetingInfoGrid}>
            <div>
              <div className={cssStyles.meetingInfoLabel}>Date</div>
              <div className={cssStyles.meetingInfoValue}>
                {startTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            <div>
              <div className={cssStyles.meetingInfoLabel}>Time</div>
              <div className={cssStyles.meetingInfoValue}>
                {startTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                -{' '}
                {endTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <div>
              <div className={cssStyles.meetingInfoLabel}>Attendee</div>
              <div className={cssStyles.meetingInfoValue}>
                {selectedMeeting.attendeeName}
              </div>
              <div className={cssStyles.meetingInfoSub}>
                {selectedMeeting.attendeeEmail}
              </div>
            </div>
            <div>
              <div className={cssStyles.meetingInfoLabel}>Location</div>
              <div className={cssStyles.meetingInfoValue}>
                {selectedMeeting.location || 'Not specified'}
              </div>
            </div>
          </div>

          {/* Notes */}
          {selectedMeeting.notes && (
            <div className={cssStyles.meetingNotesBox}>
              <div className={cssStyles.meetingInfoLabel}>Notes</div>
              <div className={cssStyles.meetingNotesBody}>
                {selectedMeeting.notes}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={cssStyles.detailActions}>
            {isPending && (
              <button
                onClick={() => handleConfirmMeetingAction(selectedMeeting._id)}
                className={cx(cssStyles.button, cssStyles.confirmButton)}
              >
                Confirm Meeting
              </button>
            )}
            {isActive && isUpcoming && (
              <button
                onClick={() => {
                  initializeRescheduleForm(selectedMeeting)
                  setSchedulingView('reschedule')
                }}
                className={cx(cssStyles.button, cssStyles.amberButton)}
              >
                Reschedule
              </button>
            )}
            {isActive && isUpcoming && (
              <button
                onClick={() => handleCancelMeetingAction(selectedMeeting._id)}
                className={cx(cssStyles.button, cssStyles.dangerButton)}
              >
                Cancel Meeting
              </button>
            )}
          </div>
        </div>
      )
    }

    // Render reschedule view
    if (schedulingView === 'reschedule' && selectedMeeting) {
      const originalStart = new Date(selectedMeeting.startTime)

      return (
        <div className={cssStyles.card}>
          <div
            className={cx(cssStyles.sectionTitle, cssStyles.cardSectionTitleFlex)}
          >
            <span>Reschedule Meeting</span>
            <button
              onClick={() => {
                setRescheduleDate(null)
                setRescheduleTime(null)
                setRescheduleDuration('30')
                setMeetingError(null)
                setSchedulingView('details')
              }}
              className={cx(cssStyles.button, cssStyles.tinyButtonPad)}
            >
              Cancel
            </button>
          </div>

          {meetingError && (
            <div className={cssStyles.errorBanner}>{meetingError}</div>
          )}

          {/* Current Meeting Info */}
          <div className={cssStyles.currentScheduleBox}>
            <div className={cssStyles.meetingInfoLabel}>Current Schedule</div>
            <div className={cssStyles.currentScheduleTitle}>
              {selectedMeeting.eventTypeName}
            </div>
            <div className={cssStyles.currentScheduleSub}>
              {originalStart.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {' at '}
              {originalStart.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>

          {/* New Date & Time */}
          <div className={cssStyles.rescheduleSection}>
            <div
              className={cx(cssStyles.meetingLabel, cssStyles.meetingLabelBlock)}
            >
              Select New Date & Time
            </div>
            <div className={cssStyles.threeColForm}>
              <DateField
                label="New Date *"
                value={rescheduleDate}
                onChange={date => setRescheduleDate(date)}
                styles={{ theme: 'sacred', marginBottom: '0' }}
              />
              <TimeField
                label="New Time *"
                value={rescheduleTime}
                onChange={time => setRescheduleTime(time)}
                styles={{ theme: 'sacred' }}
              />
              <Dropdown
                label="Duration"
                value={rescheduleDuration}
                onChange={value => setRescheduleDuration(value)}
                options={[
                  { value: '15', _id: '15' },
                  { value: '30', _id: '30' },
                  { value: '45', _id: '45' },
                  { value: '60', _id: '60' },
                  { value: '90', _id: '90' },
                  { value: '120', _id: '120' },
                ]}
                styles={{ theme: 'sacred', marginBottom: '0' }}
              />
            </div>
          </div>

          {/* Preview New Time */}
          {rescheduleDate && rescheduleTime && (
            <div className={cssStyles.previewBox}>
              <div className={cssStyles.previewLabel}>New Schedule Preview</div>
              <div className={cssStyles.previewValue}>
                {(() => {
                  const previewDateTime = new Date(rescheduleDate)
                  previewDateTime.setHours(
                    rescheduleTime.getHours(),
                    rescheduleTime.getMinutes(),
                    0,
                    0
                  )
                  const endTime = new Date(
                    previewDateTime.getTime() +
                      parseInt(rescheduleDuration) * 60000
                  )
                  return (
                    <>
                      {previewDateTime.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {' at '}
                      {previewDateTime.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' - '}
                      {endTime.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className={cssStyles.formActionsRight}>
            <button
              onClick={() => {
                setRescheduleDate(null)
                setRescheduleTime(null)
                setRescheduleDuration('30')
                setMeetingError(null)
                setSchedulingView('details')
              }}
              disabled={isSubmittingMeeting}
              className={cx(
                cssStyles.button,
                isSubmittingMeeting && cssStyles.buttonDisabled
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleRescheduleMeetingAction}
              disabled={
                isSubmittingMeeting || !rescheduleDate || !rescheduleTime
              }
              className={cx(
                cssStyles.button,
                cssStyles.amberButton,
                (isSubmittingMeeting || !rescheduleDate || !rescheduleTime) &&
                  cssStyles.buttonDisabled
              )}
            >
              {isSubmittingMeeting ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </div>
        </div>
      )
    }

    // Render meeting list view (default)
    const bookingRequests = taskMeetings.filter(
      m => m.status === 'pending' && new Date(m.startTime) > currentDate
    )
    const scheduledMeetings = taskMeetings.filter(
      m => m.status !== 'pending' || new Date(m.startTime) <= currentDate
    )

    return (
      <div className={cssStyles.card}>
        <div
          className={cx(cssStyles.sectionTitle, cssStyles.cardSectionTitleFlex)}
        >
          <span>Meetings ({taskMeetings.length})</span>
        </div>

        {/* Booking Requests section — shown at top for employee variant when there are pending meetings */}
        {variant === 'employee' && bookingRequests.length > 0 && (
          <div className={cssStyles.bookingSection}>
            <div className={cssStyles.bookingSectionTitle}>
              Booking Requests ({bookingRequests.length})
            </div>
            {bookingRequests.map(meeting => (
              <div key={meeting._id} className={cssStyles.bookingCard}>
                <div className={cssStyles.bookingCardRow}>
                  <div className={cssStyles.bookingCardMain}>
                    <div className={cssStyles.bookingCardTitle}>
                      {meeting.eventTypeName}
                    </div>
                    <div className={cssStyles.bookingCardAttendee}>
                      {meeting.attendeeName}
                      {meeting.attendeeEmail && (
                        <span className={cssStyles.bookingCardAttendeeEmail}>
                          · {meeting.attendeeEmail}
                        </span>
                      )}
                    </div>
                    <div className={cssStyles.bookingCardTime}>
                      {formatMeetingTime(meeting.startTime, meeting.endTime)}
                    </div>
                  </div>
                  <div className={cssStyles.bookingCardActions}>
                    {/* Accept */}
                    <button
                      onClick={() => handleConfirmMeetingAction(meeting._id)}
                      className={cx(
                        cssStyles.button,
                        cssStyles.bookingActionButton,
                        cssStyles.acceptButton
                      )}
                    >
                      Accept
                    </button>
                    {/* Propose new time */}
                    <button
                      onClick={() => {
                        setSelectedMeeting(meeting)
                        setSchedulingView('reschedule')
                      }}
                      className={cx(
                        cssStyles.button,
                        cssStyles.bookingActionButton,
                        cssStyles.proposeButton
                      )}
                    >
                      New Time
                    </button>
                    {/* Decline */}
                    <button
                      onClick={() => handleCancelMeetingAction(meeting._id)}
                      className={cx(
                        cssStyles.button,
                        cssStyles.bookingActionButton,
                        cssStyles.declineButton
                      )}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {taskMeetings.length === 0 ? (
          <div className={cssStyles.emptyMeetings}>
            <p className={cssStyles.emptyMeetingsText}>
              No meetings scheduled for this task yet.
            </p>
            <button
              onClick={() => {
                setMeetingTitle(`Meeting: ${taskTitle}`)
                setSchedulingView('form')
              }}
              className={cx(cssStyles.button, cssStyles.scheduleMeetingButton)}
            >
              Schedule Meeting
            </button>
          </div>
        ) : (
          <div className={cssStyles.meetingListColumn}>
            {scheduledMeetings.map(meeting => {
              const statusColors = getMeetingStatusColor(meeting.status)
              return (
                <div
                  key={meeting._id}
                  onClick={() => {
                    setSelectedMeeting(meeting)
                    setSchedulingView('details')
                  }}
                  className={cssStyles.meetingListCard}
                >
                  <div className={cssStyles.meetingListHeader}>
                    <div className={cssStyles.meetingListTitle}>
                      {meeting.eventTypeName}
                    </div>
                    <span
                      className={cssStyles.statusPill}
                      style={statusColorVars(statusColors)}
                    >
                      {meeting.status.charAt(0).toUpperCase() +
                        meeting.status.slice(1)}
                    </span>
                  </div>
                  <div className={cssStyles.meetingListMeta}>
                    <span>
                      {formatMeetingTime(meeting.startTime, meeting.endTime)}
                    </span>
                    <span>·</span>
                    <span>{meeting.attendeeName}</span>
                  </div>
                  <div className={cssStyles.meetingListRelative}>
                    {getRelativeTime(meeting.startTime)} from now
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Filter articles based on search term for Knowledge Base tab
  const filteredKbArticles = useMemo(() => {
    if (!kbSearchTerm) return knowledgebaseArticleOptions
    const term = kbSearchTerm.toLowerCase()
    return knowledgebaseArticleOptions.filter(article => {
      const titleMatch = article.articleTitle?.toLowerCase().includes(term)
      const purposeMatch = article.purpose?.toLowerCase().includes(term)
      const symptomsMatch = article.symptoms?.toLowerCase().includes(term)
      const resolutionMatch = article.resolution?.toLowerCase().includes(term)
      return titleMatch || purposeMatch || symptomsMatch || resolutionMatch
    })
  }, [knowledgebaseArticleOptions, kbSearchTerm])

  // Get linked articles (articles that are linked to this task)
  const linkedArticles = useMemo(() => {
    return knowledgebaseArticleOptions.filter(a =>
      knowledgebaseArticles.includes(a.articleTitle)
    )
  }, [knowledgebaseArticleOptions, knowledgebaseArticles])

  const renderKnowledgeBaseTab = () => {
    // If viewing a specific article
    if (selectedArticleForView) {
      const isLinkedToCase = knowledgebaseArticles.includes(
        selectedArticleForView.articleTitle
      )

      const handleToggleLinkCase = () => {
        if (isLinkedToCase) {
          // Unlink - remove from editedArticleIds
          const newArticleIds = editedArticleIds.filter(
            id => id !== selectedArticleForView._id
          )
          setEditedArticleIds(newArticleIds)
          // Log case update for article removed
          logCaseUpdate(
            'knowledgebase_removed',
            `Removed knowledge base article: ${selectedArticleForView.articleTitle}`,
            'knowledgebaseArticles',
            selectedArticleForView.articleTitle,
            undefined
          )
          // Also save immediately
          if (onEdit) {
            onEdit({
              title: taskTitle,
              description: description,
              severityId: editedSeverityId,
              statusId: editedStatusId,
              substatusId: editedSubStatusId,
              schedulingQueueId: editedQueueId,
              regionId: editedRegionId,
              teamMember: editedTeamMember,
              nextActionDate: editedNextActionDate,
              topicIds: editedTopicIds,
              articleIds: newArticleIds,
            })
          }
        } else {
          // Link - add to editedArticleIds
          const newArticleIds = [
            ...editedArticleIds,
            selectedArticleForView._id,
          ]
          setEditedArticleIds(newArticleIds)
          // Log case update for article attached
          logCaseUpdate(
            'knowledgebase_attached',
            `Attached knowledge base article: ${selectedArticleForView.articleTitle}`,
            'knowledgebaseArticles',
            undefined,
            selectedArticleForView.articleTitle
          )
          // Also save immediately
          if (onEdit) {
            onEdit({
              title: taskTitle,
              description: description,
              severityId: editedSeverityId,
              statusId: editedStatusId,
              substatusId: editedSubStatusId,
              schedulingQueueId: editedQueueId,
              regionId: editedRegionId,
              teamMember: editedTeamMember,
              nextActionDate: editedNextActionDate,
              topicIds: editedTopicIds,
              articleIds: newArticleIds,
            })
          }
        }
      }

      return (
        <div className={cssStyles.card}>
          <div className={cssStyles.kbArticleHeader}>
            <button
              onClick={() => setSelectedArticleForView(null)}
              className={cssStyles.kbBackButton}
            >
              ← Back to Articles
            </button>
            <button
              onClick={handleToggleLinkCase}
              className={cssStyles.kbLinkButton}
              data-linked={isLinkedToCase ? 'true' : undefined}
            >
              {isLinkedToCase ? '✕ Unlink from Case' : '✓ Link to Case'}
            </button>
          </div>

          <h2 className={cssStyles.kbArticleTitle}>
            {selectedArticleForView.articleTitle}
          </h2>

          {selectedArticleForView.categoryName && (
            <div className={cssStyles.kbCategoryChip}>
              {selectedArticleForView.categoryName}
            </div>
          )}

          {selectedArticleForView.purpose && (
            <div className={cssStyles.kbSection}>
              <div className={cssStyles.sectionTitle}>Purpose</div>
              <p className={cssStyles.kbSectionText}>
                {selectedArticleForView.purpose}
              </p>
            </div>
          )}

          {selectedArticleForView.symptoms && (
            <div className={cssStyles.kbSection}>
              <div className={cssStyles.sectionTitle}>Symptoms</div>
              <p className={cssStyles.kbSectionText}>
                {selectedArticleForView.symptoms}
              </p>
            </div>
          )}

          {selectedArticleForView.cause && (
            <div className={cssStyles.kbSection}>
              <div className={cssStyles.sectionTitle}>Cause</div>
              <p className={cssStyles.kbSectionText}>
                {selectedArticleForView.cause}
              </p>
            </div>
          )}

          {selectedArticleForView.resolution && (
            <div className={cssStyles.kbSection}>
              <div className={cssStyles.sectionTitle}>Resolution</div>
              <p className={cssStyles.kbSectionText}>
                {selectedArticleForView.resolution}
              </p>
            </div>
          )}

          {selectedArticleForView.workaround && (
            <div className={cssStyles.kbSection}>
              <div className={cssStyles.sectionTitle}>Workaround</div>
              <p className={cssStyles.kbSectionText}>
                {selectedArticleForView.workaround}
              </p>
            </div>
          )}

          {/* Other Linked Cases Section - Placeholder */}
          {selectedArticleForView.linkedTasks &&
            selectedArticleForView.linkedTasks.length > 0 && (
              <div className={cssStyles.kbLinkedCases}>
                <div className={cssStyles.sectionTitle}>
                  Other Cases Using This Article (
                  {selectedArticleForView.linkedTasks.length})
                </div>
                <div className={cssStyles.kbLinkedTagRow}>
                  {selectedArticleForView.linkedTasks.map(
                    (linkedTask: { _id: string; title: string }) => (
                      <span
                        key={linkedTask._id}
                        className={cssStyles.kbLinkedTag}
                      >
                        {linkedTask.title}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      )
    }

    return (
      <div>
        {/* Linked Articles Section */}
        {linkedArticles.length > 0 && (
          <div className={cx(cssStyles.card, cssStyles.cardSpacedBottom)}>
            <div className={cssStyles.sectionTitle}>
              Linked Articles ({linkedArticles.length})
            </div>
            <div className={cssStyles.kbGrid}>
              {linkedArticles.map(article => (
                <div
                  key={article._id}
                  onClick={() => setSelectedArticleForView(article)}
                  className={cssStyles.kbLinkedArticleCard}
                >
                  <div className={cssStyles.kbCardHeader}>
                    <h3 className={cssStyles.kbCardTitle}>
                      {article.articleTitle}
                    </h3>
                    <span className={cssStyles.kbCardCheck}>✓</span>
                  </div>
                  {article.categoryName && (
                    <div className={cssStyles.kbCardCategory}>
                      {article.categoryName}
                    </div>
                  )}
                  {article.purpose && (
                    <p className={cssStyles.kbCardPurpose}>{article.purpose}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Browse Section */}
        <div className={cssStyles.card}>
          <div className={cssStyles.sectionTitle}>Search Knowledge Base</div>
          <p className={cssStyles.kbSearchHelp}>
            Find relevant articles for this ticket.
          </p>

          {/* Search Bar */}
          <div className={cssStyles.kbSearchWrap}>
            <SearchBar
              label="Search Articles"
              placeholder="Search by title, symptoms, resolution..."
              value={kbSearchTerm}
              onChange={value => setKbSearchTerm(value)}
              styles={{
                theme: styles?.theme || 'light',
              }}
            />
          </div>

          {/* Results */}
          <div className={cssStyles.sectionTitle}>
            {kbSearchTerm
              ? `Search Results (${filteredKbArticles.length})`
              : `All Articles (${knowledgebaseArticleOptions.length})`}
          </div>
          <div className={cssStyles.kbGrid}>
            {filteredKbArticles.length === 0 ? (
              <p className={cssStyles.kbEmptyResults}>
                {kbSearchTerm
                  ? 'No articles match your search.'
                  : 'No knowledge base articles available.'}
              </p>
            ) : (
              filteredKbArticles.map(article => {
                const isLinked = knowledgebaseArticles.includes(
                  article.articleTitle
                )
                return (
                  <div
                    key={article._id}
                    onClick={() => setSelectedArticleForView(article)}
                    className={cssStyles.kbArticleCard}
                    data-linked={isLinked ? 'true' : undefined}
                  >
                    <div className={cssStyles.kbCardHeader}>
                      <h3
                        className={cx(
                          cssStyles.kbCardTitle,
                          cssStyles.kbCardTitleFlex
                        )}
                      >
                        {article.articleTitle}
                      </h3>
                      {isLinked && (
                        <span
                          className={cx(
                            cssStyles.kbCardCheck,
                            cssStyles.kbCardCheckSpaced
                          )}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    {article.categoryName && (
                      <div className={cssStyles.kbCardCategory}>
                        {article.categoryName}
                      </div>
                    )}
                    {article.purpose && (
                      <p className={cssStyles.kbCardPurpose}>
                        {article.purpose}
                      </p>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return renderDetailsTab()
      case 'comments':
        return renderCommentsTab()
      case 'caseUpdates':
        return renderCaseUpdatesTab()
      case 'scheduling':
        return renderSchedulingTab()
      case 'resolution':
        return (
          <div className={cssStyles.card}>
            <div className={cssStyles.resolutionHeaderRow}>
              <div
                className={cx(cssStyles.sectionTitle, cssStyles.notesHeaderTitle)}
              >
                Resolution Information
              </div>
              {!isEditingResolution && (
                <button
                  onClick={() => setIsEditingResolution(true)}
                  className={cssStyles.notesEditButton}
                >
                  {resolutionWriteup ? 'Edit Resolution' : '+ Add Resolution'}
                </button>
              )}
            </div>

            {isEditingResolution ? (
              <>
                {/* Reason for case being opened */}
                <div className={cssStyles.kbSection}>
                  <Dropdown
                    label="Reason for Case Being Opened"
                    value={resolutionReason}
                    onChange={value => setResolutionReason(value)}
                    options={[
                      { value: 'Technical Issue', _id: 'technical' },
                      { value: 'Billing Question', _id: 'billing' },
                      { value: 'Feature Request', _id: 'feature' },
                      { value: 'Account Access', _id: 'access' },
                      { value: 'Training/How-To', _id: 'training' },
                      { value: 'Bug Report', _id: 'bug' },
                      { value: 'Configuration Change', _id: 'config' },
                      { value: 'Integration Issue', _id: 'integration' },
                      { value: 'Performance Problem', _id: 'performance' },
                      { value: 'Security Concern', _id: 'security' },
                      { value: 'Other', _id: 'other' },
                    ]}
                    styles={{ theme: 'sacred' }}
                  />
                </div>

                {/* Anything we can do to prevent this */}
                <div className={cssStyles.kbSection}>
                  <Dropdown
                    label="Anything We Can Do to Prevent This?"
                    value={resolutionPrevention}
                    onChange={value => setResolutionPrevention(value)}
                    options={[
                      { value: 'Better Documentation', _id: 'docs' },
                      { value: 'Improved Training', _id: 'training' },
                      { value: 'Product Enhancement', _id: 'product' },
                      { value: 'Process Improvement', _id: 'process' },
                      { value: 'Communication Update', _id: 'communication' },
                      { value: 'Automation Opportunity', _id: 'automation' },
                      { value: 'UI/UX Improvement', _id: 'uiux' },
                      { value: 'Not Preventable', _id: 'not-preventable' },
                      { value: 'Already Addressed', _id: 'addressed' },
                      { value: 'Under Investigation', _id: 'investigating' },
                    ]}
                    styles={{ theme: 'sacred' }}
                  />
                </div>

                {/* Is this a recurring issue with this customer */}
                <div className={cssStyles.kbSection}>
                  <Dropdown
                    label="Is This a Recurring Issue With This Customer?"
                    value={resolutionRecurring}
                    onChange={value => setResolutionRecurring(value)}
                    options={[
                      { value: 'No - First Time', _id: 'first-time' },
                      { value: 'Yes - Second Occurrence', _id: 'second' },
                      { value: 'Yes - Recurring (3+ times)', _id: 'recurring' },
                      { value: 'Yes - Chronic Issue', _id: 'chronic' },
                      { value: 'Related to Previous Case', _id: 'related' },
                      { value: 'Unknown', _id: 'unknown' },
                    ]}
                    styles={{ theme: 'sacred' }}
                  />
                </div>

                {/* Resolution Writeup */}
                <div className={cssStyles.kbSection}>
                  <label className={cssStyles.resolutionLabel}>
                    Resolution Writeup
                  </label>
                  <textarea
                    value={resolutionWriteup}
                    onChange={e => setResolutionWriteup(e.target.value)}
                    placeholder="Describe how this case was resolved, what steps were taken, and any follow-up actions needed..."
                    className={cssStyles.resolutionTextarea}
                  />
                </div>

                {/* Save/Cancel Buttons */}
                <div className={cssStyles.formActionsRight}>
                  <button
                    onClick={() => setIsEditingResolution(false)}
                    className={cssStyles.smallCancelButton}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Save resolution data - this would call onEdit with resolution fields
                      onEdit({
                        resolutionReason,
                        resolutionPrevention,
                        resolutionRecurring,
                        resolutionWriteup,
                      })

                      // Log case update for resolution
                      logCaseUpdate(
                        'resolution_update',
                        `Updated resolution: ${resolutionReason || 'No reason specified'}`,
                        'resolution',
                        undefined,
                        `Reason: ${resolutionReason}, Prevention: ${resolutionPrevention}, Recurring: ${resolutionRecurring}`
                      )

                      setIsEditingResolution(false)
                    }}
                    className={cssStyles.resolutionSaveButton}
                  >
                    Save Resolution
                  </button>
                </div>
              </>
            ) : resolutionWriteup || resolutionReason ? (
              /* Display saved resolution */
              <>
                {resolutionReason && (
                  <div className={cssStyles.resolutionFieldBlock}>
                    <div className={cssStyles.resolutionFieldLabel}>
                      Reason for Case
                    </div>
                    <div className={cssStyles.resolutionFieldValue}>
                      {resolutionReason}
                    </div>
                  </div>
                )}

                {resolutionPrevention && (
                  <div className={cssStyles.resolutionFieldBlock}>
                    <div className={cssStyles.resolutionFieldLabel}>
                      Prevention
                    </div>
                    <div className={cssStyles.resolutionFieldValue}>
                      {resolutionPrevention}
                    </div>
                  </div>
                )}

                {resolutionRecurring && (
                  <div className={cssStyles.resolutionFieldBlock}>
                    <div className={cssStyles.resolutionFieldLabel}>
                      Recurring Issue
                    </div>
                    <div className={cssStyles.resolutionFieldValue}>
                      {resolutionRecurring}
                    </div>
                  </div>
                )}

                {resolutionWriteup && (
                  <div className={cssStyles.resolutionFieldBlock}>
                    <div
                      className={cx(
                        cssStyles.resolutionFieldLabel,
                        cssStyles.resolutionDetailsLabel
                      )}
                    >
                      Resolution Details
                    </div>
                    <div className={cssStyles.resolutionDetailsBox}>
                      {resolutionWriteup}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className={cssStyles.resolutionEmpty}>
                <div className={cssStyles.resolutionEmptyIcon}>📋</div>
                <div className={cssStyles.resolutionEmptyTitle}>
                  No resolution information yet
                </div>
                <div className={cssStyles.resolutionEmptySub}>
                  Click &quot;+ Add Resolution&quot; to document how this case
                  was resolved
                </div>
              </div>
            )}
          </div>
        )
      case 'knowledgeBase':
        return renderKnowledgeBaseTab()
      default:
        return null
    }
  }

  return (
    <div className={cssStyles.root} data-theme={theme} data-mobile={mobileAttr}>
      {renderSidebar()}

      <div className={cssStyles.mainContent}>
        {/* Tabs */}
        <div className={cssStyles.tabsContainer} data-mobile={mobileAttr}>
          <div
            className={cssStyles.tab}
            data-active={activeTab === 'details' ? 'true' : undefined}
            data-mobile={mobileAttr}
            onClick={() => setActiveTab('details')}
          >
            Details
          </div>
          <div
            className={cssStyles.tab}
            data-active={activeTab === 'comments' ? 'true' : undefined}
            data-mobile={mobileAttr}
            onClick={() => setActiveTab('comments')}
          >
            Comments
          </div>
          <div
            className={cssStyles.tab}
            data-active={activeTab === 'scheduling' ? 'true' : undefined}
            data-mobile={mobileAttr}
            onClick={() => setActiveTab('scheduling')}
          >
            Scheduling
          </div>
          <div
            className={cssStyles.tab}
            data-active={activeTab === 'knowledgeBase' ? 'true' : undefined}
            data-mobile={mobileAttr}
            onClick={() => setActiveTab('knowledgeBase')}
          >
            Knowledgebase{' '}
            {knowledgebaseArticles.length > 0 &&
              `(${knowledgebaseArticles.length})`}
          </div>
          <div
            className={cssStyles.tab}
            data-active={activeTab === 'resolution' ? 'true' : undefined}
            data-mobile={mobileAttr}
            onClick={() => setActiveTab('resolution')}
          >
            Resolution
          </div>
          <div
            className={cssStyles.tab}
            data-active={activeTab === 'caseUpdates' ? 'true' : undefined}
            data-mobile={mobileAttr}
            onClick={() => setActiveTab('caseUpdates')}
          >
            Case History
          </div>
        </div>

        {/* Content Area */}
        <div className={cssStyles.contentArea} data-mobile={mobileAttr}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}
