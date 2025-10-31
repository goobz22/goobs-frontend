'use client'

import React, { useState, useMemo, useEffect } from 'react'
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
} from '../../types'
import Dropdown, { type DropdownOption } from '../../../Field/Dropdown/Regular'
import MultiSelectChip from '../../../Field/Dropdown/MultiSelect'

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
  onRevisionHistory: (commentId: string, revisionHistory: any[]) => void
  onBack: () => void
  severityOptions: RawSeverityLevel[]
  schedulingQueueOptions: RawQueue[]
  regionOptions: RawRegion[]
  statusOptions: RawStatus[]
  subStatusOptions: RawSubStatus[]
  topicOptions: RawTopic[]
  knowledgebaseArticleOptions: RawArticle[]
  teamMemberOptions: RawEmployee[]
  rawProducts: RawProduct[]
  rawServices: RawService[]
  styles: ProjectBoardStyles
}

type TabType =
  | 'details'
  | 'comments'
  | 'caseNotes'
  | 'caseUpdates'
  | 'resolution'

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
  onRevisionHistory,
  onBack,
  severityOptions,
  schedulingQueueOptions,
  regionOptions,
  statusOptions,
  subStatusOptions,
  topicOptions,
  knowledgebaseArticleOptions,
  teamMemberOptions,
  rawProducts,
  rawServices,
  styles,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('details')
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedTitle, setEditedTitle] = useState(taskTitle)
  const [editedDescription, setEditedDescription] = useState(description)
  const [newCommentText, setNewCommentText] = useState('')
  const [newCaseNoteText, setNewCaseNoteText] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentText, setEditingCommentText] = useState('')

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
    height: '100vh',
    width: '100%',
    backgroundColor: bgColor,
    color: textColor,
    overflow: 'hidden',
  }

  const sidebarStyle: React.CSSProperties = {
    width: '280px',
    backgroundColor: sidebarBg,
    borderRight: `1px solid ${borderColor}`,
    padding: '1.5rem',
    overflowY: 'auto',
    flexShrink: 0,
  }

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }

  const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem 1.5rem 0',
    borderBottom: `1px solid ${borderColor}`,
    backgroundColor: bgColor,
  }

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '0.75rem 1.5rem',
    backgroundColor: isActive ? tabActiveBg : tabInactiveBg,
    border: `1px solid ${borderColor}`,
    borderBottom: isActive ? 'none' : `1px solid ${borderColor}`,
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    fontWeight: isActive ? 600 : 400,
    color: isActive ? textColor : secondaryTextColor,
    transition: 'all 0.2s',
    fontSize: '0.875rem',
    ...(isActive && {
      transform: 'translateY(1px)',
    }),
  })

  const contentAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
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
    textAlign: 'right',
    maxWidth: '60%',
    wordWrap: 'break-word',
  }

  const twoColumnGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: sidebarBg,
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    padding: '1.5rem',
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
  }

  const actionButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1.5rem',
  }

  const handleEditClick = () => {
    setIsEditMode(true)
  }

  const handleSaveEdit = () => {
    if (onEdit) {
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
      <div style={sectionTitleStyle}>Ticket Summary</div>

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
            onChange={(selectedIds: string[]) => setEditedTopicIds(selectedIds)}
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
                color: isSacred ? '#ff6b6b' : isDark ? '#FCA5A5' : '#DC2626',
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
    </div>
  )

  const renderDetailsTab = () => (
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

      {/* Customer Internal Notes Section - Display Only */}
      <div style={{ ...cardStyle, marginTop: '2rem' }}>
        <div style={{ ...sectionTitleStyle, marginTop: 0 }}>
          Customer Internal Notes
        </div>
        <div
          style={{
            padding: '0.75rem',
            borderRadius: '6px',
            border: `1px solid ${borderColor}`,
            backgroundColor: bgColor,
            color: secondaryTextColor,
            fontSize: '0.875rem',
            lineHeight: '1.5',
            minHeight: '100px',
          }}
        >
          No customer internal notes available.
        </div>
      </div>
    </>
  )

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

    // Filter out internal notes from comments
    const publicComments = comments.filter(
      c => !c.text.startsWith('[INTERNAL]')
    )

    return (
      <div style={cardStyle}>
        <div style={{ ...sectionTitleStyle, marginTop: 0 }}>
          Comments ({publicComments.length})
        </div>

        {/* Add Comment */}
        <div style={{ marginBottom: '1.5rem' }}>
          <textarea
            value={newCommentText}
            onChange={e => setNewCommentText(e.target.value)}
            placeholder="Add a comment..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '0.75rem',
              borderRadius: '6px',
              border: `1px solid ${borderColor}`,
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
              backgroundColor: isSacred
                ? 'rgba(255, 215, 0, 0.2)'
                : isDark
                  ? '#374151'
                  : '#3B82F6',
              color: isSacred ? '#FFD700' : '#FFFFFF',
            }}
            onClick={() => {
              if (newCommentText.trim()) {
                onComment(newCommentText, taskId)
                setNewCommentText('')
              }
            }}
          >
            Add Comment
          </button>
        </div>

        {/* Comments List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {publicComments.length === 0 ? (
            <p
              style={{
                color: secondaryTextColor,
                fontSize: '0.875rem',
                textAlign: 'center',
              }}
            >
              No comments yet. Be the first to comment!
            </p>
          ) : (
            publicComments.map(comment => (
              <div
                key={comment._id}
                style={{
                  padding: '1rem',
                  backgroundColor: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '6px',
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
                      {comment.createdBy}
                    </div>
                    <div
                      style={{ fontSize: '0.75rem', color: secondaryTextColor }}
                    >
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    {comment.editHistory && comment.editHistory.length > 1 && (
                      <button
                        onClick={() =>
                          onRevisionHistory(comment._id, comment.editHistory)
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
                        View History
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
                    {comment.text}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  const renderCaseNotesTab = () => {
    // Filter comments that are marked as internal case notes
    // These are different from customer notes - they're notes about the case/task itself
    const internalNotes = comments.filter(c => c.text.startsWith('[INTERNAL]'))

    const handleAddCaseNote = () => {
      if (newCaseNoteText.trim() && onComment) {
        // Prefix with [INTERNAL] to differentiate from public comments
        onComment(`[INTERNAL] ${newCaseNoteText.trim()}`, taskId)
        setNewCaseNoteText('')
      }
    }

    return (
      <div style={cardStyle}>
        <div style={{ ...sectionTitleStyle, marginTop: 0 }}>
          Internal Case Notes ({internalNotes.length})
        </div>

        {/* Add Case Note */}
        <div style={{ marginBottom: '1.5rem' }}>
          <textarea
            value={newCaseNoteText}
            onChange={e => setNewCaseNoteText(e.target.value)}
            placeholder="Add an internal case note (only visible to team members)..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '0.75rem',
              borderRadius: '6px',
              border: `1px solid ${borderColor}`,
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
              backgroundColor: isSacred
                ? 'rgba(255, 215, 0, 0.2)'
                : isDark
                  ? '#374151'
                  : '#3B82F6',
              color: isSacred ? '#FFD700' : '#FFFFFF',
              opacity: !newCaseNoteText.trim() ? 0.5 : 1,
              cursor: !newCaseNoteText.trim() ? 'not-allowed' : 'pointer',
            }}
            onClick={handleAddCaseNote}
            disabled={!newCaseNoteText.trim()}
          >
            Add Internal Note
          </button>
        </div>

        {/* Case Notes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {internalNotes.length === 0 ? (
            <p
              style={{
                color: secondaryTextColor,
                fontSize: '0.875rem',
                textAlign: 'center',
              }}
            >
              No internal case notes yet. These notes are only visible to your
              team.
            </p>
          ) : (
            internalNotes.map(note => (
              <div
                key={note._id}
                style={{
                  padding: '1rem',
                  backgroundColor: isSacred
                    ? 'rgba(255, 215, 0, 0.05)'
                    : isDark
                      ? '#1F2937'
                      : '#F9FAFB',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '6px',
                  borderLeft: `4px solid ${isSacred ? '#FFD700' : '#8B5CF6'}`,
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
                    <span
                      style={{
                        fontWeight: 600,
                        color: textColor,
                        fontSize: '0.875rem',
                      }}
                    >
                      {note.createdBy}
                    </span>
                    <span
                      style={{ fontSize: '0.75rem', color: secondaryTextColor }}
                    >
                      {note.createdAt instanceof Date
                        ? note.createdAt.toLocaleString()
                        : new Date(note.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: isSacred
                          ? 'rgba(139, 92, 246, 0.2)'
                          : isDark
                            ? 'rgba(139, 92, 246, 0.3)'
                            : 'rgba(139, 92, 246, 0.1)',
                        color: isSacred
                          ? '#a78bfa'
                          : isDark
                            ? '#c4b5fd'
                            : '#8B5CF6',
                        fontWeight: 600,
                      }}
                    >
                      INTERNAL
                    </span>
                    {note.editHistory && note.editHistory.length > 1 && (
                      <button
                        onClick={() =>
                          onRevisionHistory(note._id, note.editHistory)
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
                        View History
                      </button>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    color: textColor,
                    fontSize: '0.875rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {note.text.replace('[INTERNAL] ', '')}
                </div>
              </div>
            ))
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return renderDetailsTab()
      case 'comments':
        return renderCommentsTab()
      case 'caseNotes':
        return renderCaseNotesTab()
      case 'caseUpdates':
        return renderCaseUpdatesTab()
      case 'resolution':
        return (
          <div style={cardStyle}>
            <div style={sectionTitleStyle}>Resolution Information</div>
            <p style={{ color: secondaryTextColor, fontSize: '0.875rem' }}>
              Resolution details will appear here...
            </p>
          </div>
        )
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
            style={tabStyle(activeTab === 'caseNotes')}
            onClick={() => setActiveTab('caseNotes')}
          >
            Case Notes
          </div>
          <div
            style={tabStyle(activeTab === 'caseUpdates')}
            onClick={() => setActiveTab('caseUpdates')}
          >
            Case Updates
          </div>
          <div
            style={tabStyle(activeTab === 'resolution')}
            onClick={() => setActiveTab('resolution')}
          >
            Resolution Information
          </div>
        </div>

        {/* Content Area */}
        <div style={contentAreaStyle}>{renderTabContent()}</div>
      </div>
    </div>
  )
}
