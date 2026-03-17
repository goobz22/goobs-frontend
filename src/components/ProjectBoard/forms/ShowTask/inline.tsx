'use client'

import React, { useState, useMemo, useEffect, ChangeEvent } from 'react'
import type { ProjectBoardStyles } from '../../../../theme'
import type {
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

  // Base colors
  const bgColor = isSacred
    ? 'rgba(0, 0, 0, 0.95)'
    : isDark
      ? '#1F2937'
      : '#FFFFFF'

  const borderColor = isSacred
    ? 'rgba(255, 215, 0, 0.3)'
    : isDark
      ? '#374151'
      : '#E5E7EB'

  const textColor = isSacred ? '#FFD700' : isDark ? '#F9FAFB' : '#1F2937'
  const secondaryTextColor = isSacred
    ? 'rgba(255, 215, 0, 0.7)'
    : isDark
      ? '#D1D5DB'
      : '#6B7280'

  const sidebarBg = isSacred
    ? 'rgba(0, 0, 0, 0.8)'
    : isDark
      ? '#111827'
      : '#F9FAFB'

  const tabActiveBg = isSacred
    ? 'rgba(255, 215, 0, 0.2)'
    : isDark
      ? '#374151'
      : '#FFFFFF'

  const tabInactiveBg = isSacred
    ? 'rgba(255, 215, 0, 0.05)'
    : isDark
      ? '#1F2937'
      : '#F3F4F6'

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    height: isMobile ? 'auto' : '100vh',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: bgColor,
    color: textColor,
    overflow: isMobile ? 'visible' : 'hidden',
    paddingRight: isMobile ? '0.5rem' : undefined,
    boxSizing: 'border-box',
  }

  const sidebarStyle: React.CSSProperties = {
    width: isMobile ? '100%' : isSidebarCollapsed ? '48px' : '280px',
    backgroundColor: sidebarBg,
    borderRight: isMobile ? 'none' : `1px solid ${borderColor}`,
    borderBottom: isMobile ? `1px solid ${borderColor}` : 'none',
    padding: isMobile
      ? '1rem 1.5rem 1rem 1rem'
      : isSidebarCollapsed
        ? '0.5rem'
        : '1.5rem',
    overflowY: isMobile ? 'visible' : 'auto',
    overflowX: 'hidden',
    flexShrink: 0,
    transition: 'width 0.3s ease, padding 0.3s ease',
    position: 'relative',
    boxSizing: 'border-box',
  }

  const collapseButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0.75rem',
    right: isSidebarCollapsed ? '50%' : '0.75rem',
    transform: isSidebarCollapsed ? 'translateX(50%)' : 'none',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: `1px solid ${borderColor}`,
    backgroundColor: isSacred
      ? 'rgba(255, 215, 0, 0.1)'
      : isDark
        ? '#374151'
        : '#F3F4F6',
    color: textColor,
    cursor: 'pointer',
    display: isMobile ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    zIndex: 10,
  }

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: isMobile ? 'visible' : 'hidden',
  }

  const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: isMobile ? '0.4rem' : '0.5rem',
    padding: isMobile ? '0.75rem 1rem 0' : '1rem 1.5rem 0',
    borderBottom: `1px solid ${borderColor}`,
    backgroundColor: bgColor,
    flexWrap: isMobile ? 'wrap' : 'nowrap',
  }

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: isMobile ? '0.5rem 0.85rem' : '0.75rem 1.5rem',
    backgroundColor: isActive ? tabActiveBg : tabInactiveBg,
    border: `1px solid ${borderColor}`,
    borderBottom: isActive ? 'none' : `1px solid ${borderColor}`,
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    fontWeight: isActive ? 600 : 400,
    color: isActive ? textColor : secondaryTextColor,
    transition: 'all 0.2s',
    fontSize: isMobile ? '0.75rem' : '0.875rem',
    ...(isActive && {
      transform: 'translateY(1px)',
    }),
  })

  const contentAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: isMobile ? 'visible' : 'auto',
    padding: isMobile ? '1rem' : '1.5rem',
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: secondaryTextColor,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '1rem',
    ...(isSacred && {
      color: 'rgba(255, 215, 0, 0.6)',
      fontFamily: 'Cinzel, serif',
    }),
  }

  const fieldRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: isMobile ? '0.35rem' : '0',
    padding: '0.75rem 0',
    paddingRight: isMobile ? '0.5rem' : undefined,
    borderBottom: `1px solid ${borderColor}`,
  }

  const fieldLabelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: secondaryTextColor,
    fontWeight: 500,
  }

  const fieldValueStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: textColor,
    fontWeight: 500,
    textAlign: isMobile ? 'left' : 'right',
    maxWidth: isMobile ? '100%' : '60%',
    width: isMobile ? '100%' : 'auto',
    wordWrap: 'break-word',
  }

  const twoColumnGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? '1rem' : '2rem',
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: sidebarBg,
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    padding: isMobile ? '1rem' : '1.5rem',
  }

  const buttonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: `1px solid ${borderColor}`,
    backgroundColor: 'transparent',
    color: textColor,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: 500,
    width: isMobile ? '100%' : 'auto',
    maxWidth: isMobile ? 'calc(100% - 0.5rem)' : undefined,
    boxSizing: 'border-box',
  }

  const actionButtonsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '0.5rem',
    marginTop: '1.5rem',
    paddingRight: isMobile ? '0.5rem' : undefined,
  }

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
    <div style={sidebarStyle}>
      {/* Collapse/Expand Button */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        style={collapseButtonStyle}
        title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isSidebarCollapsed ? '»' : '«'}
      </button>

      {/* Collapsed State - Show icon only */}
      {isSidebarCollapsed ? (
        <div
          style={{
            marginTop: '48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            title="Ticket Summary"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isSacred
                ? 'rgba(255, 215, 0, 0.1)'
                : isDark
                  ? '#374151'
                  : '#E5E7EB',
              borderRadius: '6px',
              fontSize: '1rem',
            }}
          >
            📋
          </div>
        </div>
      ) : (
        <>
          <div style={{ ...sectionTitleStyle, marginTop: '2rem' }}>
            Ticket Summary
          </div>

          <div style={fieldRowStyle}>
            <div style={fieldLabelStyle}>Ticket #</div>
            <div style={fieldValueStyle}>{taskId.substring(0, 8)}</div>
          </div>

          {/* Product or Service - Dynamically determined */}
          <div style={fieldRowStyle}>
            <div style={fieldLabelStyle}>{productServiceInfo.label}</div>
            <div style={fieldValueStyle}>{productServiceInfo.name}</div>
          </div>

          {/* Queue - Editable in edit mode */}
          {isEditMode ? (
            <div style={{ marginBottom: '1rem' }}>
              <Dropdown
                label="Queue"
                options={queueDropdownOptions}
                value={editedQueueId}
                onChange={e => setEditedQueueId(e.target.value)}
                styles={{ theme: styles?.theme || 'light' }}
              />
            </div>
          ) : (
            <div style={fieldRowStyle}>
              <div style={fieldLabelStyle}>Queue</div>
              <div style={fieldValueStyle}>{schedulingQueue}</div>
            </div>
          )}

          {/* Region - Editable in edit mode */}
          {isEditMode ? (
            <div style={{ marginBottom: '1rem' }}>
              <Dropdown
                label="Region"
                options={regionDropdownOptions}
                value={editedRegionId}
                onChange={e => setEditedRegionId(e.target.value)}
                styles={{ theme: styles?.theme || 'light' }}
              />
            </div>
          ) : (
            <div style={fieldRowStyle}>
              <div style={fieldLabelStyle}>Region</div>
              <div style={fieldValueStyle}>{region || 'Not set'}</div>
            </div>
          )}

          {/* Status - Editable in edit mode */}
          {isEditMode ? (
            <div style={{ marginBottom: '1rem' }}>
              <Dropdown
                label="Status"
                options={statusDropdownOptions}
                value={editedStatusId}
                onChange={e => {
                  setEditedStatusId(e.target.value)
                  setEditedSubStatusId('') // Reset substatus when status changes
                }}
                styles={{ theme: styles?.theme || 'light' }}
              />
            </div>
          ) : (
            <div style={fieldRowStyle}>
              <div style={fieldLabelStyle}>Status</div>
              <div style={fieldValueStyle}>{status}</div>
            </div>
          )}

          {/* Substatus - Editable in edit mode */}
          {isEditMode
            ? filteredSubStatusOptions.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <Dropdown
                    label="Substatus"
                    options={subStatusDropdownOptions}
                    value={editedSubStatusId}
                    onChange={e => setEditedSubStatusId(e.target.value)}
                    styles={{
                      theme: styles?.theme || 'light',
                      disabled: !editedStatusId,
                    }}
                  />
                </div>
              )
            : subStatus && (
                <div style={fieldRowStyle}>
                  <div style={fieldLabelStyle}>Substatus</div>
                  <div style={fieldValueStyle}>{subStatus}</div>
                </div>
              )}

          {/* Severity - Editable in edit mode */}
          {isEditMode ? (
            <div style={{ marginBottom: '1rem' }}>
              <Dropdown
                label="Severity"
                options={severityDropdownOptions}
                value={editedSeverityId}
                onChange={e => setEditedSeverityId(e.target.value)}
                styles={{ theme: styles?.theme || 'light' }}
              />
            </div>
          ) : (
            <div style={fieldRowStyle}>
              <div style={fieldLabelStyle}>Severity</div>
              <div style={fieldValueStyle}>{severity}</div>
            </div>
          )}

          {/* Assigned To - Editable in edit mode */}
          {isEditMode ? (
            <div style={{ marginBottom: '1rem' }}>
              <Dropdown
                label="Assigned To"
                options={teamMemberDropdownOptions}
                value={
                  teamMemberOptions.find(
                    m => `${m.firstName} ${m.lastName}` === editedTeamMember
                  )?._id || ''
                }
                onChange={e => {
                  const member = teamMemberOptions.find(
                    m => m._id === e.target.value
                  )
                  setEditedTeamMember(
                    member ? `${member.firstName} ${member.lastName}` : ''
                  )
                }}
                styles={{ theme: styles?.theme || 'light' }}
              />
            </div>
          ) : (
            teamMemberAssigned && (
              <div style={fieldRowStyle}>
                <div style={fieldLabelStyle}>Assigned To</div>
                <div style={fieldValueStyle}>{teamMemberAssigned}</div>
              </div>
            )
          )}

          {/* Topics - Editable in edit mode */}
          {isEditMode ? (
            <div style={{ marginBottom: '1rem' }}>
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
              <div style={fieldRowStyle}>
                <div style={fieldLabelStyle}>Topics</div>
                <div style={fieldValueStyle}>{topics.join(', ')}</div>
              </div>
            )
          )}

          {/* KB Articles - Editable in edit mode */}
          {isEditMode ? (
            <div style={{ marginBottom: '1rem' }}>
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
              <div style={fieldRowStyle}>
                <div style={fieldLabelStyle}>KB Articles</div>
                <div style={fieldValueStyle}>
                  {knowledgebaseArticles.join(', ')}
                </div>
              </div>
            )
          )}

          {nextActionDate && (
            <div style={fieldRowStyle}>
              <div style={fieldLabelStyle}>Next Action</div>
              <div style={fieldValueStyle}>{nextActionDate}</div>
            </div>
          )}

          <div style={actionButtonsStyle}>
            {isEditMode ? (
              <>
                <button
                  style={{
                    ...buttonStyle,
                    flex: 1,
                    backgroundColor: isSacred
                      ? 'rgba(34, 197, 94, 0.2)'
                      : isDark
                        ? '#065f46'
                        : '#10b981',
                    color: isSacred ? '#4ade80' : '#FFFFFF',
                  }}
                  onClick={handleSaveEdit}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = isSacred
                      ? 'rgba(34, 197, 94, 0.3)'
                      : isDark
                        ? '#047857'
                        : '#059669'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = isSacred
                      ? 'rgba(34, 197, 94, 0.2)'
                      : isDark
                        ? '#065f46'
                        : '#10b981'
                  }}
                >
                  Save
                </button>
                <button
                  style={{
                    ...buttonStyle,
                    flex: 1,
                    backgroundColor: 'transparent',
                    color: textColor,
                  }}
                  onClick={handleCancelEdit}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = isSacred
                      ? 'rgba(255, 215, 0, 0.1)'
                      : isDark
                        ? '#374151'
                        : '#F3F4F6'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  style={{
                    ...buttonStyle,
                    flex: 1,
                    backgroundColor: isSacred
                      ? 'rgba(255, 215, 0, 0.1)'
                      : isDark
                        ? '#374151'
                        : '#F3F4F6',
                  }}
                  onClick={handleEditClick}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = isSacred
                      ? 'rgba(255, 215, 0, 0.2)'
                      : isDark
                        ? '#4B5563'
                        : '#E5E7EB'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = isSacred
                      ? 'rgba(255, 215, 0, 0.1)'
                      : isDark
                        ? '#374151'
                        : '#F3F4F6'
                  }}
                >
                  Edit
                </button>
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: isSacred
                      ? 'rgba(220, 38, 38, 0.1)'
                      : isDark
                        ? '#7F1D1D'
                        : '#FEF2F2',
                    color: isSacred
                      ? '#ff6b6b'
                      : isDark
                        ? '#FCA5A5'
                        : '#DC2626',
                  }}
                  onClick={onDelete}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = isSacred
                      ? 'rgba(220, 38, 38, 0.2)'
                      : isDark
                        ? '#991B1B'
                        : '#FEE2E2'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = isSacred
                      ? 'rgba(220, 38, 38, 0.1)'
                      : isDark
                        ? '#7F1D1D'
                        : '#FEF2F2'
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>

          <div style={{ ...actionButtonsStyle, marginTop: '1rem' }}>
            <button
              style={{
                ...buttonStyle,
                width: '100%',
                backgroundColor: 'transparent',
                color: textColor,
              }}
              onClick={onBack}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = isSacred
                  ? 'rgba(255, 215, 0, 0.1)'
                  : isDark
                    ? '#374151'
                    : '#F3F4F6'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
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
        <div style={twoColumnGridStyle}>
          {/* Left Column - User Info */}
          <div style={cardStyle}>
            <div style={{ ...sectionTitleStyle, marginTop: 0 }}>User</div>

            <div style={fieldRowStyle}>
              <div style={fieldLabelStyle}>Requestor</div>
              <div style={fieldValueStyle}>{createdBy}</div>
            </div>

            <div style={fieldRowStyle}>
              <div style={fieldLabelStyle}>Customer</div>
              <div style={fieldValueStyle}>{customerAssigned}</div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div style={cardStyle}>
            <div style={{ ...sectionTitleStyle, marginTop: 0 }}>Details</div>

            <div style={fieldRowStyle}>
              <div style={fieldLabelStyle}>Title</div>
              <div style={fieldValueStyle}>{taskTitle}</div>
            </div>

            <div style={fieldRowStyle}>
              <div style={fieldLabelStyle}>Description</div>
              <div style={fieldValueStyle}>{description}</div>
            </div>

            {topics.length > 0 && (
              <div style={fieldRowStyle}>
                <div style={fieldLabelStyle}>Topics</div>
                <div style={fieldValueStyle}>{topics.join(', ')}</div>
              </div>
            )}

            {knowledgebaseArticles.length > 0 && (
              <div style={fieldRowStyle}>
                <div style={fieldLabelStyle}>KB Articles</div>
                <div style={fieldValueStyle}>
                  {knowledgebaseArticles.join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Internal Company Notes Section - Shown when associatedCompanyId is provided */}
        {associatedCompanyId && (
          <div style={{ ...cardStyle, marginTop: '2rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{ ...sectionTitleStyle, marginTop: 0, marginBottom: 0 }}
              >
                Internal Company Notes
                {associatedCompanyName && (
                  <span style={{ fontWeight: 400, marginLeft: '0.5rem' }}>
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
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: `1px solid ${isSacred ? 'rgba(255, 215, 0, 0.3)' : borderColor}`,
                    backgroundColor: isSacred
                      ? 'rgba(255, 215, 0, 0.1)'
                      : isDark
                        ? '#374151'
                        : '#F3F4F6',
                    color: isSacred ? '#FFD700' : textColor,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  {companyInternalNotes ? 'Edit Note' : '+ Add Note'}
                </button>
              )}
            </div>

            <p
              style={{
                fontSize: '0.8rem',
                color: secondaryTextColor,
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: isSacred
                  ? 'rgba(255, 152, 0, 0.05)'
                  : isDark
                    ? '#111827'
                    : '#FEF3C7',
                borderRadius: '6px',
                borderLeft: `3px solid ${isSacred ? '#FF9800' : '#F59E0B'}`,
              }}
            >
              These notes are attached to the company record and will appear on
              all tasks for this company. For task-specific internal comments,
              use the Comments tab.
            </p>

            {/* Edit Company Notes Form */}
            {isEditingCompanyNotes ? (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: isSacred
                    ? 'rgba(255, 152, 0, 0.05)'
                    : isDark
                      ? '#1F2937'
                      : '#F9FAFB',
                  borderRadius: '8px',
                  border: `1px solid ${isSacred ? 'rgba(255, 152, 0, 0.2)' : borderColor}`,
                }}
              >
                <textarea
                  value={editedCompanyNotes}
                  onChange={e => setEditedCompanyNotes(e.target.value)}
                  placeholder="Add internal notes about this company..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: `1px solid ${isSacred ? 'rgba(255, 152, 0, 0.3)' : borderColor}`,
                    backgroundColor: bgColor,
                    color: textColor,
                    fontSize: '0.875rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                  }}
                >
                  <button
                    onClick={handleSaveCompanyNotes}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: isSacred
                        ? 'rgba(255, 152, 0, 0.2)'
                        : isDark
                          ? '#78350f'
                          : '#F59E0B',
                      color: isSacred ? '#FF9800' : '#FFFFFF',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingCompanyNotes(false)
                      setEditedCompanyNotes(companyInternalNotes || '')
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: `1px solid ${borderColor}`,
                      backgroundColor: 'transparent',
                      color: textColor,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : companyInternalNotes ? (
              /* Display Company Notes - from company record */
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: isSacred
                    ? 'rgba(255, 193, 7, 0.1)'
                    : isDark
                      ? '#1F2937'
                      : '#FEF9C3',
                  borderRadius: '8px',
                  border: `1px solid ${isSacred ? 'rgba(255, 193, 7, 0.3)' : '#FCD34D'}`,
                  borderLeft: `4px solid ${isSacred ? '#FFC107' : '#F59E0B'}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: isSacred ? '#FFD700' : '#92400E',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  <span>🏢</span>
                  <span>Company Notes</span>
                </div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: textColor,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {companyInternalNotes}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: '6px',
                  border: `1px dashed ${borderColor}`,
                  backgroundColor: isSacred
                    ? 'rgba(0, 0, 0, 0.2)'
                    : isDark
                      ? '#111827'
                      : '#F9FAFB',
                  color: secondaryTextColor,
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}
              >
                No internal company notes yet. Click &quot;+ Add Note&quot; to
                add one.
              </div>
            )}
          </div>
        )}

        {/* Internal Customer Notes Section - Shown when associatedCustomerId is provided */}
        {associatedCustomerId && (
          <div style={{ ...cardStyle, marginTop: '2rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{ ...sectionTitleStyle, marginTop: 0, marginBottom: 0 }}
              >
                Internal Customer Notes
                {associatedCustomerName && (
                  <span style={{ fontWeight: 400, marginLeft: '0.5rem' }}>
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
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: `1px solid ${isSacred ? 'rgba(255, 215, 0, 0.3)' : borderColor}`,
                    backgroundColor: isSacred
                      ? 'rgba(255, 215, 0, 0.1)'
                      : isDark
                        ? '#374151'
                        : '#F3F4F6',
                    color: isSacred ? '#FFD700' : textColor,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  {customerInternalNotes ? 'Edit Note' : '+ Add Note'}
                </button>
              )}
            </div>

            <p
              style={{
                fontSize: '0.8rem',
                color: secondaryTextColor,
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: isSacred
                  ? 'rgba(255, 152, 0, 0.05)'
                  : isDark
                    ? '#111827'
                    : '#FEF3C7',
                borderRadius: '6px',
                borderLeft: `3px solid ${isSacred ? '#FF9800' : '#F59E0B'}`,
              }}
            >
              These notes are attached to the customer record and will appear on
              all tasks for this customer. For task-specific internal comments,
              use the Comments tab.
            </p>

            {/* Edit Customer Notes Form */}
            {isEditingCustomerNotes ? (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: isSacred
                    ? 'rgba(255, 152, 0, 0.05)'
                    : isDark
                      ? '#1F2937'
                      : '#F9FAFB',
                  borderRadius: '8px',
                  border: `1px solid ${isSacred ? 'rgba(255, 152, 0, 0.2)' : borderColor}`,
                }}
              >
                <textarea
                  value={editedCustomerNotes}
                  onChange={e => setEditedCustomerNotes(e.target.value)}
                  placeholder="Add internal notes about this customer..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: `1px solid ${isSacred ? 'rgba(255, 152, 0, 0.3)' : borderColor}`,
                    backgroundColor: bgColor,
                    color: textColor,
                    fontSize: '0.875rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                ></textarea>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                  }}
                >
                  <button
                    onClick={handleSaveCustomerNotes}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: isSacred
                        ? 'rgba(255, 152, 0, 0.2)'
                        : isDark
                          ? '#78350f'
                          : '#F59E0B',
                      color: isSacred ? '#FF9800' : '#FFFFFF',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingCustomerNotes(false)
                      setEditedCustomerNotes(customerInternalNotes || '')
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: `1px solid ${borderColor}`,
                      backgroundColor: 'transparent',
                      color: textColor,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : customerInternalNotes ? (
              /* Display Customer Notes - from customer record */
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: isSacred
                    ? 'rgba(255, 193, 7, 0.1)'
                    : isDark
                      ? '#1F2937'
                      : '#FEF9C3',
                  borderRadius: '8px',
                  border: `1px solid ${isSacred ? 'rgba(255, 193, 7, 0.3)' : '#FCD34D'}`,
                  borderLeft: `4px solid ${isSacred ? '#FFC107' : '#F59E0B'}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: isSacred ? '#FFD700' : '#92400E',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  <span>📋</span>
                  <span>Customer Notes</span>
                </div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: textColor,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {customerInternalNotes}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: '6px',
                  border: `1px dashed ${borderColor}`,
                  backgroundColor: isSacred
                    ? 'rgba(0, 0, 0, 0.2)'
                    : isDark
                      ? '#111827'
                      : '#F9FAFB',
                  color: secondaryTextColor,
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}
              >
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

    // Section toggle button style
    const sectionButtonStyle = (isActive: boolean): React.CSSProperties => ({
      flex: 1,
      padding: '0.75rem 1rem',
      backgroundColor: isActive
        ? isSacred
          ? 'rgba(255, 215, 0, 0.2)'
          : isDark
            ? '#374151'
            : '#3B82F6'
        : isSacred
          ? 'rgba(255, 215, 0, 0.05)'
          : isDark
            ? '#1F2937'
            : '#F3F4F6',
      border: `1px solid ${
        isActive
          ? isSacred
            ? 'rgba(255, 215, 0, 0.5)'
            : '#3B82F6'
          : borderColor
      }`,
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: isActive ? 600 : 400,
      fontSize: '0.875rem',
      color: isActive ? (isSacred ? '#FFD700' : '#FFFFFF') : secondaryTextColor,
      transition: 'all 0.2s',
    })

    return (
      <div style={cardStyle}>
        {/* Section Toggle */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <button
            style={sectionButtonStyle(commentSection === 'external')}
            onClick={() => setCommentSection('external')}
          >
            External Comments ({publicComments.length})
          </button>
          <button
            style={sectionButtonStyle(commentSection === 'internal')}
            onClick={() => setCommentSection('internal')}
          >
            Internal Comments ({internalNotes.length})
          </button>
        </div>

        {/* Section Description */}
        <p
          style={{
            fontSize: '0.8rem',
            color: secondaryTextColor,
            marginBottom: '1rem',
            padding: '0.75rem',
            backgroundColor: isSacred
              ? 'rgba(255, 215, 0, 0.05)'
              : isDark
                ? '#111827'
                : '#F9FAFB',
            borderRadius: '6px',
            borderLeft: `3px solid ${
              commentSection === 'external'
                ? isSacred
                  ? '#FFD700'
                  : '#3B82F6'
                : isSacred
                  ? '#FF9800'
                  : '#F59E0B'
            }`,
          }}
        >
          {commentSection === 'external'
            ? 'External comments are visible to the customer and can be used for customer communication.'
            : 'Internal notes are only visible to employees and are used for internal case discussions.'}
        </p>

        {/* Add Comment */}
        <div style={{ marginBottom: '1.5rem' }}>
          <textarea
            value={newCommentText}
            onChange={e => setNewCommentText(e.target.value)}
            placeholder={
              commentSection === 'external'
                ? 'Add a comment for the customer...'
                : 'Add an internal note (only visible to employees)...'
            }
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '0.75rem',
              borderRadius: '6px',
              border: `1px solid ${
                commentSection === 'internal'
                  ? isSacred
                    ? 'rgba(255, 152, 0, 0.3)'
                    : '#F59E0B'
                  : borderColor
              }`,
              backgroundColor: bgColor,
              color: textColor,
              fontSize: '0.875rem',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
          <button
            style={{
              ...buttonStyle,
              marginTop: '0.5rem',
              backgroundColor:
                commentSection === 'internal'
                  ? isSacred
                    ? 'rgba(255, 152, 0, 0.2)'
                    : isDark
                      ? '#78350f'
                      : '#F59E0B'
                  : isSacred
                    ? 'rgba(255, 215, 0, 0.2)'
                    : isDark
                      ? '#374151'
                      : '#3B82F6',
              color:
                commentSection === 'internal'
                  ? isSacred
                    ? '#FF9800'
                    : '#FFFFFF'
                  : isSacred
                    ? '#FFD700'
                    : '#FFFFFF',
            }}
            onClick={handleAddComment}
          >
            {commentSection === 'external'
              ? 'Send to Customer'
              : 'Add Internal Note'}
          </button>
        </div>

        {/* Comments List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentComments.length === 0 ? (
            <p
              style={{
                color: secondaryTextColor,
                fontSize: '0.875rem',
                textAlign: 'center',
              }}
            >
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

              return (
                <div
                  key={comment._id}
                  style={{
                    padding: '1rem',
                    backgroundColor: bgColor,
                    border: `1px solid ${
                      commentSection === 'internal'
                        ? isSacred
                          ? 'rgba(255, 152, 0, 0.2)'
                          : 'rgba(245, 158, 11, 0.3)'
                        : borderColor
                    }`,
                    borderRadius: '6px',
                    borderLeft:
                      commentSection === 'internal'
                        ? `3px solid ${isSacred ? '#FF9800' : '#F59E0B'}`
                        : undefined,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: textColor,
                        }}
                      >
                        {resolveAuthorName(comment.createdBy)}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: secondaryTextColor,
                        }}
                      >
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                      {commentSection === 'internal' && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isSacred
                              ? 'rgba(255, 152, 0, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                            color: isSacred ? '#FF9800' : '#F59E0B',
                            fontWeight: 600,
                          }}
                        >
                          INTERNAL
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                      }}
                    >
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
                            style={{
                              fontSize: '0.7rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: 'transparent',
                              color: secondaryTextColor,
                              border: 'none',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
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
                            style={{
                              fontSize: '0.75rem',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'transparent',
                              color: isSacred
                                ? '#FFD700'
                                : isDark
                                  ? '#60A5FA'
                                  : '#3B82F6',
                              border: `1px solid ${isSacred ? 'rgba(255, 215, 0, 0.3)' : isDark ? '#60A5FA' : '#3B82F6'}`,
                              cursor: 'pointer',
                            }}
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
                        style={{
                          width: '100%',
                          minHeight: '60px',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: `1px solid ${borderColor}`,
                          backgroundColor: bgColor,
                          color: textColor,
                          fontSize: '0.875rem',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          marginBottom: '0.5rem',
                        }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleSaveCommentEdit(comment._id)}
                          style={{
                            ...buttonStyle,
                            fontSize: '0.75rem',
                            padding: '4px 12px',
                            backgroundColor: isSacred
                              ? 'rgba(34, 197, 94, 0.2)'
                              : isDark
                                ? '#065f46'
                                : '#10b981',
                            color: isSacred ? '#4ade80' : '#FFFFFF',
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelCommentEdit}
                          style={{
                            ...buttonStyle,
                            fontSize: '0.75rem',
                            padding: '4px 12px',
                            backgroundColor: 'transparent',
                            color: textColor,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        color: textColor,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {displayText}
                    </div>
                  )}
                  {/* Inline revision history display */}
                  {viewingRevisionHistoryId === comment._id &&
                    comment.editHistory &&
                    comment.editHistory.length > 1 && (
                      <div
                        style={{
                          marginTop: '0.75rem',
                          padding: '0.75rem',
                          backgroundColor: isSacred
                            ? 'rgba(255, 215, 0, 0.05)'
                            : isDark
                              ? 'rgba(0, 0, 0, 0.3)'
                              : 'rgba(0, 0, 0, 0.03)',
                          borderRadius: '6px',
                          border: `1px solid ${borderColor}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: secondaryTextColor,
                            marginBottom: '0.5rem',
                          }}
                        >
                          Edit History ({comment.editHistory.length} revisions)
                        </div>
                        {comment.editHistory
                          .slice()
                          .reverse()
                          .map((revision, idx) => (
                            <div
                              key={revision._id}
                              style={{
                                padding: '0.5rem',
                                marginBottom:
                                  idx < comment.editHistory.length - 1
                                    ? '0.5rem'
                                    : 0,
                                backgroundColor: revision.isOriginal
                                  ? isSacred
                                    ? 'rgba(255, 215, 0, 0.1)'
                                    : 'rgba(59, 130, 246, 0.1)'
                                  : 'transparent',
                                borderRadius: '4px',
                                borderLeft: `3px solid ${
                                  revision.isOriginal
                                    ? isSacred
                                      ? '#FFD700'
                                      : '#3B82F6'
                                    : borderColor
                                }`,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '0.7rem',
                                  color: secondaryTextColor,
                                  marginBottom: '0.25rem',
                                }}
                              >
                                {revision.isOriginal
                                  ? 'Original'
                                  : `Edited by ${revision.editedBy || 'Unknown'}`}
                                {revision.editedAt && (
                                  <span style={{ marginLeft: '0.5rem' }}>
                                    {new Date(
                                      revision.editedAt
                                    ).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.8rem',
                                  color: textColor,
                                  whiteSpace: 'pre-wrap',
                                }}
                              >
                                {revision.text}
                              </div>
                            </div>
                          ))}
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
      <div style={cardStyle}>
        <div style={{ ...sectionTitleStyle, marginTop: 0 }}>
          Case Updates ({caseUpdates.length})
        </div>

        {/* Activity Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {caseUpdates.length === 0 ? (
            <p
              style={{
                color: secondaryTextColor,
                fontSize: '0.875rem',
                textAlign: 'center',
                marginTop: '1rem',
              }}
            >
              No case updates yet. All task changes will appear here.
            </p>
          ) : (
            caseUpdates.map(update => (
              <div
                key={update._id}
                style={{
                  padding: '1rem',
                  backgroundColor: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '6px',
                  borderLeft: `4px solid ${updateTypeColors[update.updateType] || borderColor}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {update.updatedBy}
                  </div>
                  <div
                    style={{ fontSize: '0.75rem', color: secondaryTextColor }}
                  >
                    {new Date(update.updatedAt).toLocaleString()}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    color: textColor,
                  }}
                >
                  {update.description}
                </div>
                {update.fieldChanged && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: secondaryTextColor,
                      marginTop: '0.5rem',
                    }}
                  >
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

  // Scheduling tab input styles
  const meetingInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    fontSize: '0.875rem',
    backgroundColor: bgColor,
    color: textColor,
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const meetingLabelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: isSacred ? 'rgba(255, 215, 0, 0.8)' : secondaryTextColor,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }

  const meetingRadioLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '8px',
    border: `1px solid ${borderColor}`,
    backgroundColor: bgColor,
    color: textColor,
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
  }

  const renderSchedulingTab = () => {
    // Render meeting form view
    if (schedulingView === 'form') {
      return (
        <div style={cardStyle}>
          <div
            style={{
              ...sectionTitleStyle,
              marginTop: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Schedule New Meeting</span>
            <button
              onClick={() => {
                resetMeetingForm()
                setSchedulingView('list')
              }}
              style={{
                ...buttonStyle,
                padding: '6px 12px',
                fontSize: '0.75rem',
              }}
            >
              Cancel
            </button>
          </div>

          {meetingError && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.5)',
                borderRadius: '8px',
                color: '#f44336',
                marginBottom: '16px',
                fontSize: '0.875rem',
              }}
            >
              {meetingError}
            </div>
          )}

          {/* Meeting Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={meetingLabelStyle}>Meeting Title *</label>
            <input
              type="text"
              value={meetingTitle}
              onChange={e => setMeetingTitle(e.target.value)}
              placeholder="e.g., Project Discussion, Sprint Planning"
              style={meetingInputStyle}
            />
          </div>

          {/* Meeting Type */}
          <div style={{ marginBottom: '20px' }}>
            <label style={meetingLabelStyle}>Meeting Type *</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {(['video', 'phone', 'in-person'] as const).map(type => (
                <label
                  key={type}
                  style={{
                    ...meetingRadioLabelStyle,
                    backgroundColor:
                      meetingType === type
                        ? isSacred
                          ? 'rgba(255, 215, 0, 0.2)'
                          : isDark
                            ? '#374151'
                            : '#E5E7EB'
                        : bgColor,
                    borderColor:
                      meetingType === type
                        ? isSacred
                          ? '#FFD700'
                          : isDark
                            ? '#60A5FA'
                            : '#3B82F6'
                        : borderColor,
                  }}
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
            <div style={{ marginBottom: '20px' }}>
              <label style={meetingLabelStyle}>Location *</label>
              <input
                type="text"
                value={meetingLocation}
                onChange={e => setMeetingLocation(e.target.value)}
                placeholder="e.g., Conference Room A"
                style={meetingInputStyle}
              />
            </div>
          )}

          {/* Attendee Info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <div>
              <label style={meetingLabelStyle}>Attendee Name *</label>
              <input
                type="text"
                value={meetingAttendeeName}
                onChange={e => setMeetingAttendeeName(e.target.value)}
                placeholder="Full name"
                style={meetingInputStyle}
              />
            </div>
            <div>
              <label style={meetingLabelStyle}>Attendee Email *</label>
              <input
                type="email"
                value={meetingAttendeeEmail}
                onChange={e => setMeetingAttendeeEmail(e.target.value)}
                placeholder="email@example.com"
                style={meetingInputStyle}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
              marginBottom: '20px',
            }}
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
              onChange={e => setMeetingDuration(e.target.value)}
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
          <div style={{ marginBottom: '20px' }}>
            <label style={meetingLabelStyle}>Notes</label>
            <textarea
              value={meetingNotes}
              onChange={e => setMeetingNotes(e.target.value)}
              placeholder="Any additional information..."
              rows={3}
              style={{
                ...meetingInputStyle,
                resize: 'vertical',
                minHeight: '80px',
              }}
            />
          </div>

          {/* Submit Button */}
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}
          >
            <button
              onClick={() => {
                resetMeetingForm()
                setSchedulingView('list')
              }}
              disabled={isSubmittingMeeting}
              style={{
                ...buttonStyle,
                opacity: isSubmittingMeeting ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleScheduleMeeting}
              disabled={isSubmittingMeeting || !onScheduleMeeting}
              style={{
                ...buttonStyle,
                backgroundColor: isSacred
                  ? '#FFD700'
                  : isDark
                    ? '#3B82F6'
                    : '#3B82F6',
                color: isSacred ? '#000000' : '#FFFFFF',
                opacity: isSubmittingMeeting || !onScheduleMeeting ? 0.5 : 1,
              }}
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
        <div style={cardStyle}>
          <div
            style={{
              ...sectionTitleStyle,
              marginTop: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Meeting Details</span>
            <button
              onClick={() => {
                setSelectedMeeting(null)
                setSchedulingView('list')
              }}
              style={{
                ...buttonStyle,
                padding: '6px 12px',
                fontSize: '0.75rem',
              }}
            >
              Back to List
            </button>
          </div>

          {/* Status Badge */}
          <div style={{ marginBottom: '24px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: statusColors.bg,
                color: statusColors.color,
                border: `1px solid ${statusColors.color}`,
              }}
            >
              {selectedMeeting.status.charAt(0).toUpperCase() +
                selectedMeeting.status.slice(1)}
            </span>
          </div>

          {/* Meeting Title */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: textColor,
                marginBottom: '8px',
              }}
            >
              {selectedMeeting.eventTypeName}
            </div>
          </div>

          {/* Meeting Info Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '24px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: secondaryTextColor,
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                }}
              >
                Date
              </div>
              <div style={{ color: textColor }}>
                {startTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: secondaryTextColor,
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                }}
              >
                Time
              </div>
              <div style={{ color: textColor }}>
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
              <div
                style={{
                  fontSize: '0.75rem',
                  color: secondaryTextColor,
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                }}
              >
                Attendee
              </div>
              <div style={{ color: textColor }}>
                {selectedMeeting.attendeeName}
              </div>
              <div style={{ fontSize: '0.85rem', color: secondaryTextColor }}>
                {selectedMeeting.attendeeEmail}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: secondaryTextColor,
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                }}
              >
                Location
              </div>
              <div style={{ color: textColor }}>
                {selectedMeeting.location || 'Not specified'}
              </div>
            </div>
          </div>

          {/* Notes */}
          {selectedMeeting.notes && (
            <div
              style={{
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: sidebarBg,
                borderRadius: '8px',
                border: `1px solid ${borderColor}`,
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  color: secondaryTextColor,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                Notes
              </div>
              <div style={{ color: textColor, whiteSpace: 'pre-wrap' }}>
                {selectedMeeting.notes}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {isPending && (
              <button
                onClick={() => handleConfirmMeetingAction(selectedMeeting._id)}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#4CAF50',
                  color: '#FFFFFF',
                }}
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
                style={{
                  ...buttonStyle,
                  backgroundColor: isSacred ? '#FFD700' : '#FF9800',
                  color: isSacred ? '#000000' : '#FFFFFF',
                }}
              >
                Reschedule
              </button>
            )}
            {isActive && isUpcoming && (
              <button
                onClick={() => handleCancelMeetingAction(selectedMeeting._id)}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#F44336',
                  color: '#FFFFFF',
                }}
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
        <div style={cardStyle}>
          <div
            style={{
              ...sectionTitleStyle,
              marginTop: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
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
              style={{
                ...buttonStyle,
                padding: '6px 12px',
                fontSize: '0.75rem',
              }}
            >
              Cancel
            </button>
          </div>

          {meetingError && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.5)',
                borderRadius: '8px',
                color: '#f44336',
                marginBottom: '16px',
                fontSize: '0.875rem',
              }}
            >
              {meetingError}
            </div>
          )}

          {/* Current Meeting Info */}
          <div
            style={{
              padding: '16px',
              backgroundColor: sidebarBg,
              borderRadius: '8px',
              border: `1px solid ${borderColor}`,
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                color: secondaryTextColor,
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Current Schedule
            </div>
            <div
              style={{ fontWeight: 600, color: textColor, marginBottom: '4px' }}
            >
              {selectedMeeting.eventTypeName}
            </div>
            <div style={{ color: secondaryTextColor, fontSize: '0.875rem' }}>
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
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                ...meetingLabelStyle,
                marginBottom: '16px',
                fontSize: '0.85rem',
              }}
            >
              Select New Date & Time
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '16px',
              }}
            >
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
                onChange={e => setRescheduleDuration(e.target.value)}
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
            <div
              style={{
                padding: '16px',
                backgroundColor: isSacred
                  ? 'rgba(255, 215, 0, 0.1)'
                  : isDark
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'rgba(59, 130, 246, 0.05)',
                borderRadius: '8px',
                border: `1px solid ${isSacred ? 'rgba(255, 215, 0, 0.3)' : isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  color: secondaryTextColor,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                New Schedule Preview
              </div>
              <div
                style={{
                  fontWeight: 600,
                  color: isSacred ? '#FFD700' : isDark ? '#60A5FA' : '#3B82F6',
                }}
              >
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
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}
          >
            <button
              onClick={() => {
                setRescheduleDate(null)
                setRescheduleTime(null)
                setRescheduleDuration('30')
                setMeetingError(null)
                setSchedulingView('details')
              }}
              disabled={isSubmittingMeeting}
              style={{
                ...buttonStyle,
                opacity: isSubmittingMeeting ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleRescheduleMeetingAction}
              disabled={
                isSubmittingMeeting || !rescheduleDate || !rescheduleTime
              }
              style={{
                ...buttonStyle,
                backgroundColor: isSacred ? '#FFD700' : '#FF9800',
                color: isSacred ? '#000000' : '#FFFFFF',
                opacity:
                  isSubmittingMeeting || !rescheduleDate || !rescheduleTime
                    ? 0.5
                    : 1,
              }}
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
      <div style={cardStyle}>
        <div
          style={{
            ...sectionTitleStyle,
            marginTop: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Meetings ({taskMeetings.length})</span>
        </div>

        {/* Booking Requests section — shown at top for employee variant when there are pending meetings */}
        {variant === 'employee' && bookingRequests.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontSize: '0.68rem',
                fontFamily: isSacred ? '"Cinzel", serif' : 'inherit',
                letterSpacing: '0.07em',
                textTransform: 'uppercase' as const,
                color: isSacred ? '#FFD700' : isDark ? '#60A5FA' : '#3B82F6',
                marginBottom: '10px',
                paddingBottom: '6px',
                borderBottom: `1px solid ${isSacred ? 'rgba(255,215,0,0.2)' : borderColor}`,
              }}
            >
              Booking Requests ({bookingRequests.length})
            </div>
            {bookingRequests.map(meeting => (
              <div
                key={meeting._id}
                style={{
                  padding: '14px 16px',
                  backgroundColor: isSacred
                    ? 'rgba(255,215,0,0.06)'
                    : isDark
                      ? 'rgba(96,165,250,0.06)'
                      : 'rgba(59,130,246,0.04)',
                  border: `1px solid ${isSacred ? 'rgba(255,215,0,0.35)' : isDark ? 'rgba(96,165,250,0.3)' : 'rgba(59,130,246,0.25)'}`,
                  borderLeft: `3px solid ${isSacred ? '#FFD700' : isDark ? '#60A5FA' : '#3B82F6'}`,
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: textColor,
                        fontSize: '0.9rem',
                        marginBottom: '4px',
                      }}
                    >
                      {meeting.eventTypeName}
                    </div>
                    <div
                      style={{ fontSize: '0.8rem', color: secondaryTextColor }}
                    >
                      {meeting.attendeeName}
                      {meeting.attendeeEmail && (
                        <span style={{ marginLeft: '6px', opacity: 0.75 }}>
                          · {meeting.attendeeEmail}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: secondaryTextColor,
                        marginTop: '3px',
                      }}
                    >
                      {formatMeetingTime(meeting.startTime, meeting.endTime)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                      flexShrink: 0,
                      alignSelf: 'center',
                    }}
                  >
                    {/* Accept */}
                    <button
                      onClick={() => handleConfirmMeetingAction(meeting._id)}
                      style={{
                        ...buttonStyle,
                        padding: '6px 12px',
                        fontSize: '0.72rem',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                      }}
                    >
                      Accept
                    </button>
                    {/* Propose new time */}
                    <button
                      onClick={() => {
                        setSelectedMeeting(meeting)
                        setSchedulingView('reschedule')
                      }}
                      style={{
                        ...buttonStyle,
                        padding: '6px 12px',
                        fontSize: '0.72rem',
                        backgroundColor: isSacred ? 'rgba(255,152,0,0.2)' : 'rgba(255,152,0,0.15)',
                        color: '#FF9800',
                        border: '1px solid rgba(255,152,0,0.4)',
                      }}
                    >
                      New Time
                    </button>
                    {/* Decline */}
                    <button
                      onClick={() => handleCancelMeetingAction(meeting._id)}
                      style={{
                        ...buttonStyle,
                        padding: '6px 12px',
                        fontSize: '0.72rem',
                        backgroundColor: 'rgba(244,67,54,0.15)',
                        color: '#F44336',
                        border: '1px solid rgba(244,67,54,0.35)',
                      }}
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
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p
              style={{
                color: secondaryTextColor,
                fontSize: '0.875rem',
                marginBottom: '16px',
              }}
            >
              No meetings scheduled for this task yet.
            </p>
            <button
              onClick={() => {
                setMeetingTitle(`Meeting: ${taskTitle}`)
                setSchedulingView('form')
              }}
              style={{
                ...buttonStyle,
                backgroundColor: isSacred
                  ? 'rgba(255, 215, 0, 0.2)'
                  : isDark
                    ? '#374151'
                    : '#E5E7EB',
                color: textColor,
              }}
            >
              Schedule Meeting
            </button>
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {scheduledMeetings.map(meeting => {
              const statusColors = getMeetingStatusColor(meeting.status)
              return (
                <div
                  key={meeting._id}
                  onClick={() => {
                    setSelectedMeeting(meeting)
                    setSchedulingView('details')
                  }}
                  style={{
                    padding: '16px',
                    backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = isSacred
                      ? '#FFD700'
                      : isDark
                        ? '#60A5FA'
                        : '#3B82F6'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = borderColor
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: textColor }}>
                      {meeting.eventTypeName}
                    </div>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: statusColors.bg,
                        color: statusColors.color,
                      }}
                    >
                      {meeting.status.charAt(0).toUpperCase() +
                        meeting.status.slice(1)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '0.85rem',
                      color: secondaryTextColor,
                    }}
                  >
                    <span>
                      {formatMeetingTime(meeting.startTime, meeting.endTime)}
                    </span>
                    <span>·</span>
                    <span>{meeting.attendeeName}</span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: secondaryTextColor,
                      marginTop: '8px',
                    }}
                  >
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
        <div style={cardStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            <button
              onClick={() => setSelectedArticleForView(null)}
              style={{
                background: 'none',
                border: `1px solid ${borderColor}`,
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                color: textColor,
                fontSize: '0.875rem',
              }}
            >
              ← Back to Articles
            </button>
            <button
              onClick={handleToggleLinkCase}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isLinkedToCase
                  ? isSacred
                    ? 'rgba(239, 68, 68, 0.2)'
                    : isDark
                      ? '#7F1D1D'
                      : '#FEE2E2'
                  : isSacred
                    ? 'rgba(34, 197, 94, 0.2)'
                    : isDark
                      ? '#065f46'
                      : '#D1FAE5',
                color: isLinkedToCase
                  ? isSacred
                    ? '#ff6b6b'
                    : isDark
                      ? '#FCA5A5'
                      : '#DC2626'
                  : isSacred
                    ? '#4ade80'
                    : isDark
                      ? '#6EE7B7'
                      : '#059669',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {isLinkedToCase ? '✕ Unlink from Case' : '✓ Link to Case'}
            </button>
          </div>

          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: textColor,
              marginBottom: '1rem',
              ...(isSacred && {
                fontFamily: 'Cinzel, serif',
                color: '#FFD700',
              }),
            }}
          >
            {selectedArticleForView.articleTitle}
          </h2>

          {selectedArticleForView.categoryName && (
            <div
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                backgroundColor: isSacred
                  ? 'rgba(255, 215, 0, 0.15)'
                  : isDark
                    ? '#374151'
                    : '#E5E7EB',
                borderRadius: '20px',
                fontSize: '0.75rem',
                color: isSacred ? '#FFD700' : textColor,
                marginBottom: '1.5rem',
              }}
            >
              {selectedArticleForView.categoryName}
            </div>
          )}

          {selectedArticleForView.purpose && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={sectionTitleStyle}>Purpose</div>
              <p
                style={{
                  color: secondaryTextColor,
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                }}
              >
                {selectedArticleForView.purpose}
              </p>
            </div>
          )}

          {selectedArticleForView.symptoms && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={sectionTitleStyle}>Symptoms</div>
              <p
                style={{
                  color: secondaryTextColor,
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                }}
              >
                {selectedArticleForView.symptoms}
              </p>
            </div>
          )}

          {selectedArticleForView.cause && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={sectionTitleStyle}>Cause</div>
              <p
                style={{
                  color: secondaryTextColor,
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                }}
              >
                {selectedArticleForView.cause}
              </p>
            </div>
          )}

          {selectedArticleForView.resolution && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={sectionTitleStyle}>Resolution</div>
              <p
                style={{
                  color: secondaryTextColor,
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                }}
              >
                {selectedArticleForView.resolution}
              </p>
            </div>
          )}

          {selectedArticleForView.workaround && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={sectionTitleStyle}>Workaround</div>
              <p
                style={{
                  color: secondaryTextColor,
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                }}
              >
                {selectedArticleForView.workaround}
              </p>
            </div>
          )}

          {/* Other Linked Cases Section - Placeholder */}
          {selectedArticleForView.linkedTasks &&
            selectedArticleForView.linkedTasks.length > 0 && (
              <div
                style={{
                  marginTop: '2rem',
                  padding: '1rem',
                  backgroundColor: isSacred
                    ? 'rgba(139, 92, 246, 0.1)'
                    : isDark
                      ? 'rgba(139, 92, 246, 0.1)'
                      : '#F3E8FF',
                  borderRadius: '8px',
                  border: `1px solid ${isSacred ? 'rgba(139, 92, 246, 0.3)' : '#C4B5FD'}`,
                }}
              >
                <div style={sectionTitleStyle}>
                  Other Cases Using This Article (
                  {selectedArticleForView.linkedTasks.length})
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                  }}
                >
                  {selectedArticleForView.linkedTasks.map(
                    (linkedTask: { _id: string; title: string }) => (
                      <span
                        key={linkedTask._id}
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: isSacred
                            ? 'rgba(139, 92, 246, 0.15)'
                            : isDark
                              ? '#4C1D95'
                              : '#DDD6FE',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          color: isSacred
                            ? '#a78bfa'
                            : isDark
                              ? '#C4B5FD'
                              : '#6D28D9',
                        }}
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
          <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
            <div style={sectionTitleStyle}>
              Linked Articles ({linkedArticles.length})
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              {linkedArticles.map(article => (
                <div
                  key={article._id}
                  onClick={() => setSelectedArticleForView(article)}
                  style={{
                    padding: '1rem',
                    backgroundColor: isSacred
                      ? 'rgba(255, 215, 0, 0.1)'
                      : isDark
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(59, 130, 246, 0.05)',
                    border: `2px solid ${isSacred ? '#FFD700' : '#3B82F6'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: textColor,
                        margin: 0,
                      }}
                    >
                      {article.articleTitle}
                    </h3>
                    <span
                      style={{
                        color: isSacred ? '#FFD700' : '#3B82F6',
                        fontSize: '1rem',
                      }}
                    >
                      ✓
                    </span>
                  </div>
                  {article.categoryName && (
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: isSacred
                          ? 'rgba(255, 215, 0, 0.7)'
                          : isDark
                            ? '#60A5FA'
                            : '#3B82F6',
                        marginTop: '0.5rem',
                      }}
                    >
                      {article.categoryName}
                    </div>
                  )}
                  {article.purpose && (
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: secondaryTextColor,
                        margin: '0.5rem 0 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {article.purpose}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Browse Section */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>Search Knowledge Base</div>
          <p
            style={{
              fontSize: '0.875rem',
              color: secondaryTextColor,
              marginBottom: '1rem',
            }}
          >
            Find relevant articles for this ticket.
          </p>

          {/* Search Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <SearchBar
              label="Search Articles"
              placeholder="Search by title, symptoms, resolution..."
              value={kbSearchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setKbSearchTerm(e.target.value)
              }
              styles={{
                theme: styles?.theme || 'light',
              }}
            />
          </div>

          {/* Results */}
          <div style={sectionTitleStyle}>
            {kbSearchTerm
              ? `Search Results (${filteredKbArticles.length})`
              : `All Articles (${knowledgebaseArticleOptions.length})`}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            {filteredKbArticles.length === 0 ? (
              <p
                style={{
                  color: secondaryTextColor,
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  gridColumn: '1 / -1',
                  padding: '2rem',
                }}
              >
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
                    style={{
                      padding: '1rem',
                      backgroundColor: isLinked
                        ? isSacred
                          ? 'rgba(255, 215, 0, 0.1)'
                          : isDark
                            ? 'rgba(59, 130, 246, 0.1)'
                            : 'rgba(59, 130, 246, 0.05)'
                        : isSacred
                          ? 'rgba(0, 0, 0, 0.3)'
                          : isDark
                            ? '#111827'
                            : '#F9FAFB',
                      border: `1px solid ${
                        isLinked
                          ? isSacred
                            ? '#FFD700'
                            : '#3B82F6'
                          : borderColor
                      }`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: textColor,
                          margin: 0,
                          flex: 1,
                        }}
                      >
                        {article.articleTitle}
                      </h3>
                      {isLinked && (
                        <span
                          style={{
                            color: isSacred ? '#FFD700' : '#3B82F6',
                            fontSize: '1rem',
                            marginLeft: '0.5rem',
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    {article.categoryName && (
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: isSacred
                            ? 'rgba(255, 215, 0, 0.7)'
                            : isDark
                              ? '#60A5FA'
                              : '#3B82F6',
                          marginTop: '0.5rem',
                        }}
                      >
                        {article.categoryName}
                      </div>
                    )}
                    {article.purpose && (
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: secondaryTextColor,
                          margin: '0.5rem 0 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
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
          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{ ...sectionTitleStyle, marginTop: 0, marginBottom: 0 }}
              >
                Resolution Information
              </div>
              {!isEditingResolution && (
                <button
                  onClick={() => setIsEditingResolution(true)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: `1px solid ${isSacred ? 'rgba(255, 215, 0, 0.3)' : borderColor}`,
                    backgroundColor: isSacred
                      ? 'rgba(255, 215, 0, 0.1)'
                      : isDark
                        ? '#374151'
                        : '#F3F4F6',
                    color: isSacred ? '#FFD700' : textColor,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  {resolutionWriteup ? 'Edit Resolution' : '+ Add Resolution'}
                </button>
              )}
            </div>

            {isEditingResolution ? (
              <>
                {/* Reason for case being opened */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <Dropdown
                    label="Reason for Case Being Opened"
                    value={resolutionReason}
                    onChange={e => setResolutionReason(e.target.value)}
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
                <div style={{ marginBottom: '1.5rem' }}>
                  <Dropdown
                    label="Anything We Can Do to Prevent This?"
                    value={resolutionPrevention}
                    onChange={e => setResolutionPrevention(e.target.value)}
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
                <div style={{ marginBottom: '1.5rem' }}>
                  <Dropdown
                    label="Is This a Recurring Issue With This Customer?"
                    value={resolutionRecurring}
                    onChange={e => setResolutionRecurring(e.target.value)}
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
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: isSacred ? '#FFD700' : secondaryTextColor,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    Resolution Writeup
                  </label>
                  <textarea
                    value={resolutionWriteup}
                    onChange={e => setResolutionWriteup(e.target.value)}
                    placeholder="Describe how this case was resolved, what steps were taken, and any follow-up actions needed..."
                    style={{
                      width: '100%',
                      minHeight: '150px',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: `1px solid ${isSacred ? 'rgba(255, 215, 0, 0.3)' : borderColor}`,
                      backgroundColor: bgColor,
                      color: textColor,
                      fontSize: '0.875rem',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Save/Cancel Buttons */}
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    onClick={() => setIsEditingResolution(false)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: `1px solid ${borderColor}`,
                      backgroundColor: 'transparent',
                      color: textColor,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
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
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: isSacred
                        ? 'rgba(255, 215, 0, 0.2)'
                        : isDark
                          ? '#059669'
                          : '#10B981',
                      color: isSacred ? '#FFD700' : '#FFFFFF',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Save Resolution
                  </button>
                </div>
              </>
            ) : resolutionWriteup || resolutionReason ? (
              /* Display saved resolution */
              <>
                {resolutionReason && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: secondaryTextColor,
                        marginBottom: '0.25rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Reason for Case
                    </div>
                    <div style={{ color: textColor }}>{resolutionReason}</div>
                  </div>
                )}

                {resolutionPrevention && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: secondaryTextColor,
                        marginBottom: '0.25rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Prevention
                    </div>
                    <div style={{ color: textColor }}>
                      {resolutionPrevention}
                    </div>
                  </div>
                )}

                {resolutionRecurring && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: secondaryTextColor,
                        marginBottom: '0.25rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Recurring Issue
                    </div>
                    <div style={{ color: textColor }}>
                      {resolutionRecurring}
                    </div>
                  </div>
                )}

                {resolutionWriteup && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: secondaryTextColor,
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Resolution Details
                    </div>
                    <div
                      style={{
                        padding: '1rem',
                        backgroundColor: isSacred
                          ? 'rgba(255, 215, 0, 0.05)'
                          : isDark
                            ? '#1F2937'
                            : '#F9FAFB',
                        borderRadius: '8px',
                        border: `1px solid ${isSacred ? 'rgba(255, 215, 0, 0.2)' : borderColor}`,
                        color: textColor,
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {resolutionWriteup}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div
                style={{
                  padding: '2rem',
                  borderRadius: '8px',
                  border: `1px dashed ${borderColor}`,
                  backgroundColor: isSacred
                    ? 'rgba(0, 0, 0, 0.2)'
                    : isDark
                      ? '#111827'
                      : '#F9FAFB',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  📋
                </div>
                <div
                  style={{
                    color: secondaryTextColor,
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  No resolution information yet
                </div>
                <div
                  style={{
                    color: secondaryTextColor,
                    fontSize: '0.75rem',
                  }}
                >
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
    <div style={containerStyle}>
      {renderSidebar()}

      <div style={mainContentStyle}>
        {/* Tabs */}
        <div style={tabsContainerStyle}>
          <div
            style={tabStyle(activeTab === 'details')}
            onClick={() => setActiveTab('details')}
          >
            Details
          </div>
          <div
            style={tabStyle(activeTab === 'comments')}
            onClick={() => setActiveTab('comments')}
          >
            Comments
          </div>
          <div
            style={tabStyle(activeTab === 'scheduling')}
            onClick={() => setActiveTab('scheduling')}
          >
            Scheduling
          </div>
          <div
            style={tabStyle(activeTab === 'knowledgeBase')}
            onClick={() => setActiveTab('knowledgeBase')}
          >
            Knowledgebase{' '}
            {knowledgebaseArticles.length > 0 &&
              `(${knowledgebaseArticles.length})`}
          </div>
          <div
            style={tabStyle(activeTab === 'resolution')}
            onClick={() => setActiveTab('resolution')}
          >
            Resolution
          </div>
          <div
            style={tabStyle(activeTab === 'caseUpdates')}
            onClick={() => setActiveTab('caseUpdates')}
          >
            Case History
          </div>
        </div>

        {/* Content Area */}
        <div style={contentAreaStyle}>{renderTabContent()}</div>
      </div>
    </div>
  )
}
