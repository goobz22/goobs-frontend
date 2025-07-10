'use client'

import React, { useState, useEffect } from 'react'
import Dialog from '../../../Dialog'
import CloseIcon from '../../../Icons/Close'
import MoreVertIcon from '../../../Icons/MoreVert'
import Popover from '../../../Popover'
import Typography from '../../../Typography'
import CustomButton from '../../../Button'
import ComplexTextEditor from '../../../ComplexTextEditor'
import SearchableDropdown from '../../../Field/Dropdown/Searchable'
import MultipleSelectChip from '../../../Field/Dropdown/MultiSelect'
import DateField from '../../../Field/Date/DateField'
import TextField from '../../../Field/Text'
import Chip from '../../../Chip'
import type {
  Comment,
  CommentEditHistory,
  RawCustomer,
  RawSeverityLevel,
  RawQueue,
  RawStatus,
  RawSubStatus,
  RawTopic,
  RawArticle,
  RawEmployee,
} from '../../types'

const SACRED_GLYPHS = ['𓁹', '𓂀', '𓊖', '𓊹']

export interface ShowTaskProps {
  open: boolean
  onClose: () => void
  taskId: string
  taskTitle: string
  createdBy: string
  description: string
  comments: Comment[]
  customerAssigned: string
  severity: string
  schedulingQueue: string
  status: string
  subStatus: string
  topics: string[]
  knowledgebaseArticles: string[]
  teamMemberAssigned: string
  nextActionDate: string
  customerOptions: RawCustomer[]
  severityOptions: RawSeverityLevel[]
  schedulingQueueOptions: RawQueue[]
  statusOptions: RawStatus[]
  subStatusOptions: RawSubStatus[]
  topicOptions: RawTopic[]
  knowledgebaseArticleOptions: RawArticle[]
  teamMemberOptions: RawEmployee[]
  currentUserName: string
  onCloseTask: (taskId: string) => void
  onComment: (commentText: string, _id: string) => void
  onEdit: (updatedData: {
    taskTitle: string
    description: string
    customerAssigned: string
    severity: string
    schedulingQueue: string
    status: string
    subStatus: string
    topics: string[]
    knowledgebaseArticles: string[]
    teamMemberAssigned: string
    nextActionDate: string
  }) => void
  onDelete: () => void
  onDuplicate: () => void
  onEditComment: (commentId: string, newText: string, taskId: string) => void
  onRevisionHistory: (
    commentId: string,
    revisionHistory: CommentEditHistory[]
  ) => void
  sacredtheme?: boolean
}

const getStyles = (sacredtheme?: boolean) => ({
  dialog: {
    borderWidth: '2px',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    ...(sacredtheme
      ? {
          borderColor: 'rgba(255, 215, 0, 0.5)',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          animation: 'show-task-glow-pulse 2s infinite alternate',
        }
      : {
          borderColor: 'black',
        }),
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    top: '0.75rem',
    color: 'rgba(255, 215, 0, 0.3)',
    fontSize: '1.125rem',
    zIndex: 10,
    animation: 'show-task-float-glyph 5s infinite alternate',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem',
    borderBottom: `2px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.3)' : 'black'}`,
    ...(sacredtheme && { backgroundColor: 'rgba(255, 215, 0, 0.05)' }),
  } as React.CSSProperties,
  headerTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    ...(sacredtheme && {
      fontFamily: 'Cinzel, serif',
      letterSpacing: '0.05em',
      textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
    }),
  } as React.CSSProperties,
  headerSubtitle: {
    fontSize: '0.875rem',
    marginTop: '0.125rem',
    ...(sacredtheme && { fontFamily: 'Crimson Text, serif' }),
  } as React.CSSProperties,
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 0,
  } as React.CSSProperties,
  mainContent: {
    gridColumn: 'span 2 / span 2',
    padding: '0.5rem',
    paddingTop: 0,
  } as React.CSSProperties,
  descriptionContainer: {
    border: `1px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.3)' : 'black'}`,
    margin: '0 -8px',
    padding: '0.5rem 8px',
    paddingBottom: '0.5rem',
    ...(sacredtheme && { backgroundColor: 'rgba(255, 215, 0, 0.02)' }),
  } as React.CSSProperties,
  sectionTitle: {
    fontWeight: 700,
    marginBottom: '0.25rem',
    ...(sacredtheme && { fontFamily: 'Cinzel, serif' }),
  } as React.CSSProperties,
  descriptionText: {
    fontSize: '0.875rem',
    whiteSpace: 'pre-wrap',
    ...(sacredtheme && { fontFamily: 'Crimson Text, serif' }),
  } as React.CSSProperties,
  comment: {
    marginBottom: '0',
  } as React.CSSProperties,
  commentEditing: {
    border: `1px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.3)' : 'black'}`,
    margin: '0 -8px',
    padding: '0.25rem 0.5rem',
    ...(sacredtheme && { backgroundColor: 'rgba(255, 215, 0, 0.02)' }),
  } as React.CSSProperties,
  commentContent: {
    border: `1px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.3)' : 'black'}`,
    margin: '0 -8px',
    padding: '0.5rem',
    ...(sacredtheme && { backgroundColor: 'rgba(255, 215, 0, 0.02)' }),
  } as React.CSSProperties,
  sidebar: {
    gridColumn: 'span 1 / span 1',
    padding: '0.5rem',
    borderLeft: `2px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.3)' : 'black'}`,
    ...(sacredtheme && { backgroundColor: 'rgba(255, 215, 0, 0.02)' }),
  } as React.CSSProperties,
  sidebarSection: {
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  sidebarLabel: {
    fontSize: '0.875rem',
    fontWeight: 700,
    ...(sacredtheme && { fontFamily: 'Cinzel, serif' }),
  } as React.CSSProperties,
  sidebarValue: {
    fontSize: '0.875rem',
    ...(sacredtheme && { fontFamily: 'Crimson Text, serif' }),
  } as React.CSSProperties,
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.25rem',
    marginTop: '0.25rem',
  } as React.CSSProperties,
})

function formatRelativeTime(date?: Date): string {
  if (!date) return ''
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 0) return 'in the future?'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

function safeParseDate(dateStr?: string): Date | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return Number.isNaN(d.getTime()) ? null : d
}

const ShowTask: React.FC<ShowTaskProps> = ({
  open,
  onClose,
  taskId,
  taskTitle,
  createdBy,
  description,
  comments,
  customerAssigned,
  severity,
  schedulingQueue,
  status,
  subStatus,
  topics,
  knowledgebaseArticles,
  teamMemberAssigned,
  nextActionDate,
  customerOptions,
  severityOptions,
  schedulingQueueOptions,
  statusOptions,
  subStatusOptions,
  topicOptions,
  knowledgebaseArticleOptions,
  teamMemberOptions,
  currentUserName,
  onCloseTask,
  onComment,
  onEdit,
  onDelete,
  onDuplicate,
  onEditComment,
  onRevisionHistory,
  sacredtheme = false,
}) => {
  const [localComments, setLocalComments] = useState<Comment[]>(comments)
  const [newComment, setNewComment] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    taskTitle,
    description,
    customerAssigned,
    severity,
    schedulingQueue,
    status,
    subStatus,
    topics,
    knowledgebaseArticles,
    teamMemberAssigned,
    nextActionDate,
  })
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentText, setEditingCommentText] = useState('')
  const [selectedRevisions, setSelectedRevisions] = useState<
    Record<string, string | null>
  >({})
  const styles = getStyles(sacredtheme)

  useEffect(() => {
    setLocalComments(prev =>
      prev.map(c => {
        if (!c.editHistory || c.editHistory.length === 0) {
          const originalTime = c.createdAt || new Date()
          const originalRev: CommentEditHistory = {
            _id: `rev-orig-${c._id}`,
            editedBy: c.createdBy,
            editedAt: originalTime,
            text: c.text,
            isOriginal: true,
          }
          return { ...c, editHistory: [originalRev] }
        }
        return c
      })
    )
  }, [])

  const handleComment = () => {
    const trimmed = newComment.trim()
    if (!trimmed) return

    const now = new Date()
    const newLocalComment: Comment = {
      _id: `temp-${Date.now()}`,
      createdBy: currentUserName || 'UnknownUser',
      text: trimmed,
      createdAt: now,
      editHistory: [
        {
          _id: `rev-orig-temp-${Date.now()}`,
          editedBy: currentUserName || 'UnknownUser',
          editedAt: now,
          text: trimmed,
          isOriginal: true,
        },
      ],
    }

    setLocalComments([...localComments, newLocalComment])
    onComment(trimmed, taskId)
    setNewComment('')
  }

  const startEditingComment = (commentId: string, currentText: string) => {
    setEditingCommentId(commentId)
    setEditingCommentText(currentText)
  }

  const saveEditingComment = (commentId: string) => {
    const now = new Date()
    onEditComment(commentId, editingCommentText, taskId)
    setLocalComments(prev =>
      prev.map(c => {
        if (c._id !== commentId) return c
        const newRevision: CommentEditHistory = {
          _id: `rev-${Date.now()}`,
          editedBy: currentUserName || 'UnknownUser',
          editedAt: now,
          text: editingCommentText,
          isOriginal: false,
        }
        return {
          ...c,
          text: editingCommentText,
          editHistory: [...(c.editHistory || []), newRevision],
        }
      })
    )
    setEditingCommentId(null)
    setEditingCommentText('')
    setSelectedRevisions(prev => ({ ...prev, [commentId]: null }))
  }

  const cancelEditingComment = () => {
    setEditingCommentId(null)
    setEditingCommentText('')
  }

  const handleEditToggle = () => {
    if (isEditing) {
      onEdit({
        taskTitle: formData.taskTitle,
        description: formData.description,
        customerAssigned: formData.customerAssigned,
        severity: formData.severity,
        schedulingQueue: formData.schedulingQueue,
        status: formData.status,
        subStatus: formData.subStatus,
        topics: formData.topics,
        knowledgebaseArticles: formData.knowledgebaseArticles,
        teamMemberAssigned: formData.teamMemberAssigned,
        nextActionDate: formData.nextActionDate,
      })
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  const handleSelectRevision = (
    commentId: string,
    revisionId: string | null
  ) => {
    setSelectedRevisions(prev => ({ ...prev, [commentId]: revisionId || null }))
    const comment = localComments.find(c => c._id === commentId)
    if (comment && comment.editHistory) {
      onRevisionHistory(commentId, comment.editHistory)
    }
  }

  const [commentMenu, setCommentMenu] = useState<{
    anchor: HTMLElement | null
    commentId: string | null
  }>({
    anchor: null,
    commentId: null,
  })

  const openCommentMenu = (
    event: React.MouseEvent<HTMLElement>,
    commentId: string
  ) => {
    setCommentMenu({ anchor: event.currentTarget, commentId })
  }
  const closeCommentMenu = () => {
    setCommentMenu({ anchor: null, commentId: null })
  }
  const handleEditClick = (commentId: string, text: string) => {
    closeCommentMenu()
    startEditingComment(commentId, text)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      className={sacredtheme ? 'sacred-dialog' : ''}
    >
      <div style={styles.dialog}>
        {sacredtheme && (
          <>
            <div style={{ ...styles.glyph, top: '0.75rem', left: '0.75rem' }}>
              {SACRED_GLYPHS[0]}
            </div>
            <div
              style={{
                ...styles.glyph,
                top: '0.75rem',
                right: '3rem',
                animationDirection: 'reverse',
              }}
            >
              {SACRED_GLYPHS[1]}
            </div>
          </>
        )}

        <div style={styles.header}>
          <div>
            {isEditing ? (
              <TextField
                label="Task Title"
                value={formData.taskTitle}
                onChange={e =>
                  setFormData(prev => ({ ...prev, taskTitle: e.target.value }))
                }
                shrunklabelposition="aboveNotch"
                className="mb-1"
                sacredtheme={sacredtheme}
              />
            ) : (
              <Typography
                fontvariant="merrih4"
                fontcolor={sacredtheme ? '#FFD700' : 'black'}
                text={formData.taskTitle}
                style={styles.headerTitle}
              />
            )}
            <Typography
              fontvariant="merrih5"
              fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.7)' : 'gray'}
              text={`created by ${createdBy}`}
              style={styles.headerSubtitle}
            />
          </div>

          <div style={styles.headerActions}>
            <CustomButton
              text={isEditing ? 'Save' : 'Edit'}
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              backgroundcolor="none"
              onClick={handleEditToggle}
              sacredtheme={sacredtheme}
            />
            <CustomButton
              text="Delete"
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              backgroundcolor="none"
              onClick={onDelete}
              sacredtheme={sacredtheme}
            />
            <CustomButton
              text="Duplicate"
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              backgroundcolor="none"
              onClick={onDuplicate}
              sacredtheme={sacredtheme}
            />
            <button
              onClick={onClose}
              style={{
                ...styles.headerActions,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '9999px',
                color: sacredtheme ? '#FFD700' : 'black',
              }}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.mainContent}>
            <div style={styles.descriptionContainer}>
              {isEditing ? (
                <>
                  <Typography
                    fontvariant="merrih5"
                    fontcolor={sacredtheme ? '#FFD700' : 'black'}
                    text="Task Description"
                    style={styles.sectionTitle}
                  />
                  <ComplexTextEditor
                    value={formData.description}
                    onChange={val =>
                      setFormData(prev => ({ ...prev, description: val }))
                    }
                    label="Task Description"
                    editorType="simple"
                    minRows={3}
                    sacredtheme={sacredtheme}
                  />
                </>
              ) : (
                <>
                  <Typography
                    fontvariant="merrih5"
                    fontcolor={sacredtheme ? '#FFD700' : 'black'}
                    text="Task Description"
                    style={styles.sectionTitle}
                  />
                  <Typography
                    fontvariant="merrih6"
                    fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.9)' : 'black'}
                    text={formData.description}
                    style={styles.descriptionText}
                  />
                </>
              )}
            </div>

            {localComments.map(comment => {
              const selectedRevId = selectedRevisions[comment._id] || null

              let displayedText = comment.text
              let displayedTime: Date = comment.createdAt
              let displayedAuthor = comment.createdBy

              if (selectedRevId && comment.editHistory) {
                const foundRev = comment.editHistory.find(
                  r => r._id === selectedRevId
                )
                if (foundRev) {
                  displayedText = foundRev.text
                  displayedTime = foundRev.editedAt ?? comment.createdAt
                  displayedAuthor = foundRev.editedBy ?? comment.createdBy
                }
              }

              const createdTime = formatRelativeTime(comment.createdAt)
              const updatedTime = formatRelativeTime(displayedTime)
              const hasHistory =
                comment.editHistory && comment.editHistory.length > 0
              const canEdit =
                currentUserName && comment.createdBy === currentUserName
              const isMenuOpen =
                commentMenu.anchor && commentMenu.commentId === comment._id

              return (
                <div key={comment._id} style={styles.comment}>
                  {editingCommentId === comment._id ? (
                    <div style={styles.commentEditing}>
                      <ComplexTextEditor
                        value={editingCommentText}
                        onChange={val => setEditingCommentText(val)}
                        label="Edit Comment"
                        minRows={3}
                        editorType="simple"
                        sacredtheme={sacredtheme}
                      />
                      <div className="flex justify-end mt-1 gap-1">
                        <CustomButton
                          text="Save"
                          backgroundcolor={
                            sacredtheme ? '#FFD700' : 'woad.dark'
                          }
                          fontcolor={sacredtheme ? 'black' : 'white'}
                          onClick={() => saveEditingComment(comment._id)}
                          sacredtheme={sacredtheme}
                        />
                        <CustomButton
                          text="Cancel"
                          backgroundcolor="none"
                          fontcolor={sacredtheme ? '#FFD700' : 'black'}
                          onClick={cancelEditingComment}
                          sacredtheme={sacredtheme}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={styles.commentContent}>
                      <div className="flex justify-between items-start">
                        <Typography
                          fontvariant="merrih5"
                          fontcolor={sacredtheme ? '#FFD700' : 'black'}
                          text={comment.createdBy}
                        />
                        <button
                          onClick={e => openCommentMenu(e, comment._id)}
                          style={{
                            ...styles.headerActions,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '9999px',
                            color: sacredtheme ? '#FFD700' : 'black',
                          }}
                        >
                          <MoreVertIcon />
                        </button>

                        <Popover
                          open={Boolean(isMenuOpen)}
                          onClose={closeCommentMenu}
                          anchorEl={commentMenu.anchor}
                          className={
                            sacredtheme
                              ? 'bg-black/95 border-yellow-400/30'
                              : ''
                          }
                        >
                          {canEdit && (
                            <div
                              onClick={() =>
                                handleEditClick(comment._id, comment.text)
                              }
                              style={{
                                ...styles.headerActions,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.5rem 1rem',
                                color: sacredtheme ? '#FFD700' : 'gray',
                              }}
                            >
                              Edit
                            </div>
                          )}
                          {hasHistory && (
                            <div style={{ width: '14rem' }}>
                              <SearchableDropdown
                                label="Revision History"
                                shrunklabelposition="aboveNotch"
                                placeholder="Select revision..."
                                options={
                                  comment.editHistory.map(rev => {
                                    const revTime = formatRelativeTime(
                                      rev.editedAt ?? comment.createdAt
                                    )
                                    const prefix = rev.isOriginal
                                      ? 'Original'
                                      : 'Edited'
                                    const editedBy =
                                      rev.editedBy ?? comment.createdBy
                                    return {
                                      value: `${prefix} ${revTime} by ${editedBy}`,
                                      attribute1: rev._id,
                                    }
                                  }) || []
                                }
                                onChange={opt =>
                                  handleSelectRevision(
                                    comment._id,
                                    opt?.attribute1 || null
                                  )
                                }
                                defaultValue={selectedRevId || undefined}
                                sacredtheme={sacredtheme}
                              />
                            </div>
                          )}
                        </Popover>
                      </div>

                      <div className="mt-auto">
                        <Typography
                          fontvariant="merriparagraph"
                          fontcolor={
                            sacredtheme ? 'rgba(255, 215, 0, 0.9)' : 'black'
                          }
                          text={displayedText}
                        />
                        <div
                          className={
                            sacredtheme ? 'text-yellow-400/60' : 'text-gray-500'
                          }
                        >
                          {comment.createdAt && (
                            <span>
                              Created {createdTime} by {comment.createdBy}
                            </span>
                          )}
                          {displayedTime && displayedAuthor && (
                            <span>
                              {' '}
                              | Edited {updatedTime} by {displayedAuthor}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            <div style={{ margin: '0 -8px 0 0', padding: '0.5rem 8px 0.5rem' }}>
              <ComplexTextEditor
                value={newComment}
                onChange={val => setNewComment(val)}
                label="Add Comment"
                minRows={3}
                editorType="simple"
                sacredtheme={sacredtheme}
              />
              <div className="flex justify-end mt-2 gap-2">
                <CustomButton
                  text="Close Task"
                  backgroundcolor={
                    sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'gunpowder.main'
                  }
                  fontcolor={sacredtheme ? 'black' : 'white'}
                  onClick={() => onCloseTask(taskId)}
                  sacredtheme={sacredtheme}
                />
                <CustomButton
                  text="Comment"
                  backgroundcolor={sacredtheme ? '#FFD700' : 'woad.dark'}
                  fontcolor={sacredtheme ? 'black' : 'white'}
                  onClick={handleComment}
                  sacredtheme={sacredtheme}
                />
              </div>
            </div>
          </div>

          <div style={styles.sidebar}>
            {[
              {
                label: 'Customer Assigned',
                value: formData.customerAssigned,
                options: customerOptions.map(cust => ({
                  value:
                    cust.firstName || cust.lastName
                      ? `${cust.firstName || ''} ${cust.lastName || ''}`.trim()
                      : cust._id,
                  attribute1: cust._id,
                })),
                field: 'customerAssigned',
              },
              {
                label: 'Severity',
                value: formData.severity,
                options: severityOptions.map(s => ({
                  value: String(s.severityLevel),
                  attribute1: s._id,
                })),
                field: 'severity',
              },
              {
                label: 'Scheduling Queue',
                value: formData.schedulingQueue,
                options: schedulingQueueOptions.map(q => ({
                  value: q.queueName,
                  attribute1: q._id,
                })),
                field: 'schedulingQueue',
              },
              {
                label: 'Status',
                value: formData.status,
                options: statusOptions.map(s => ({
                  value: s.status,
                  attribute1: s._id,
                })),
                field: 'status',
              },
              {
                label: 'Sub Status',
                value: formData.subStatus,
                options: subStatusOptions.map(s => ({
                  value: s.subStatus,
                  attribute1: s._id,
                })),
                field: 'subStatus',
              },
              {
                label: 'Team Member Assigned',
                value: formData.teamMemberAssigned,
                options: teamMemberOptions.map(tm => ({
                  value:
                    tm.firstName && tm.lastName
                      ? `${tm.firstName} ${tm.lastName}`
                      : tm._id,
                  attribute1: tm._id,
                })),
                field: 'teamMemberAssigned',
              },
            ].map(({ label, value, options, field }) => (
              <div key={label} style={styles.sidebarSection}>
                {!isEditing && (
                  <Typography
                    fontvariant="merriparagraph"
                    fontcolor={sacredtheme ? '#FFD700' : 'black'}
                    text={label}
                    style={styles.sidebarLabel}
                  />
                )}
                {isEditing ? (
                  <SearchableDropdown
                    label={label}
                    options={options}
                    shrunklabelposition="aboveNotch"
                    defaultValue={value}
                    onChange={newVal =>
                      setFormData(prev => ({
                        ...prev,
                        [field]: newVal?.attribute1 || '',
                      }))
                    }
                    sacredtheme={sacredtheme}
                  />
                ) : value ? (
                  <Chip label={value} sacredtheme={sacredtheme} />
                ) : null}
              </div>
            ))}

            <div style={styles.sidebarSection}>
              {!isEditing && (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor={sacredtheme ? '#FFD700' : 'black'}
                  text="Topics"
                  style={styles.sidebarLabel}
                />
              )}
              {isEditing ? (
                <MultipleSelectChip
                  label="Topics"
                  options={topicOptions.map(t => t.topic)}
                  defaultSelected={formData.topics}
                  onChange={values =>
                    setFormData(prev => ({ ...prev, topics: values }))
                  }
                  outlinecolor={sacredtheme ? '#FFD700' : 'black'}
                  fontcolor={sacredtheme ? '#FFD700' : 'black'}
                  className="mt-1"
                  sacredtheme={sacredtheme}
                />
              ) : formData.topics.length > 0 ? (
                <div style={styles.chipContainer}>
                  {formData.topics.map((topic, idx) => (
                    <Chip key={idx} label={topic} sacredtheme={sacredtheme} />
                  ))}
                </div>
              ) : null}
            </div>

            <div style={styles.sidebarSection}>
              {!isEditing && (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor={sacredtheme ? '#FFD700' : 'black'}
                  text="Knowledgebase Articles"
                  style={styles.sidebarLabel}
                />
              )}
              {isEditing ? (
                <MultipleSelectChip
                  label="Knowledgebase Articles"
                  options={knowledgebaseArticleOptions.map(a => a.articleTitle)}
                  defaultSelected={formData.knowledgebaseArticles}
                  onChange={values =>
                    setFormData(prev => ({
                      ...prev,
                      knowledgebaseArticles: values,
                    }))
                  }
                  outlinecolor={sacredtheme ? '#FFD700' : 'black'}
                  fontcolor={sacredtheme ? '#FFD700' : 'black'}
                  className="mt-1"
                  sacredtheme={sacredtheme}
                />
              ) : formData.knowledgebaseArticles.length > 0 ? (
                <div style={styles.chipContainer}>
                  {formData.knowledgebaseArticles.map((article, idx) => (
                    <Chip key={idx} label={article} sacredtheme={sacredtheme} />
                  ))}
                </div>
              ) : null}
            </div>

            <div style={styles.sidebarSection}>
              {!isEditing && (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor={sacredtheme ? '#FFD700' : 'black'}
                  text="Next Action Date"
                  style={styles.sidebarLabel}
                />
              )}
              {isEditing ? (
                <div className="mt-1 w-full">
                  <DateField
                    label="Next Action Date"
                    value={safeParseDate(formData.nextActionDate)}
                    onChange={date => {
                      if (date && 'start' in date) {
                        return
                      }
                      if (date instanceof Date) {
                        const mm = String(date.getMonth() + 1).padStart(2, '0')
                        const dd = String(date.getDate()).padStart(2, '0')
                        const yyyy = date.getFullYear()
                        setFormData(prev => ({
                          ...prev,
                          nextActionDate: `${mm}/${dd}/${yyyy}`,
                        }))
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          nextActionDate: '',
                        }))
                      }
                    }}
                    sacredtheme={sacredtheme}
                  />
                </div>
              ) : formData.nextActionDate ? (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.9)' : 'black'}
                  text={formData.nextActionDate}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ShowTask
