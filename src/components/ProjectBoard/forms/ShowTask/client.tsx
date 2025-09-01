'use client'

import React, { useState, useEffect } from 'react'
import Dialog from '../../../Dialog'
import CloseIcon from '../../../Icons/Close'
import EditIcon from '../../../Icons/Edit'
import DeleteIcon from '../../../Icons/Delete'
import ContentCopyIcon from '../../../Icons/ContentCopy'
import MoreVertIcon from '../../../Icons/MoreVert'

import StyledTooltip from '../../../Tooltip'
import Typography from '../../../Typography'
import CustomButton from '../../../Button'
import ComplexTextEditor from '../../../ComplexTextEditor'
import SearchableSimple from '../../../Field/Dropdown/SearchableSimple'
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
import type { ProjectBoardStyles } from '../../../../theme'

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
  onComment?: ((commentText: string, _id: string) => void) | undefined
  onEdit?: ((updatedData: {
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
  }) => void) | undefined
  onDelete?: (() => void) | undefined
  onDuplicate?: (() => void) | undefined
  onEditComment?: ((commentId: string, newText: string, taskId: string) => void) | undefined
  onRevisionHistory: (
    commentId: string,
    revisionHistory: CommentEditHistory[]
  ) => void
  styles?: ProjectBoardStyles
}

const getShowTaskStyles = (styles?: ProjectBoardStyles) => {
  const theme = styles?.theme || 'light'
  const isSacredTheme = theme === 'sacred'
  const isDarkTheme = theme === 'dark'

  // Get base theme colors
  const colors = {
    primary: isSacredTheme ? '#FFD700' : isDarkTheme ? '#E5E7EB' : '#1F2937',
    secondary: isSacredTheme ? '#FBBF24' : isDarkTheme ? '#9CA3AF' : '#6B7280',
    border: isSacredTheme
      ? 'rgba(255, 215, 0, 0.3)'
      : isDarkTheme
        ? 'rgba(75, 85, 99, 0.5)'
        : 'rgba(226, 232, 240, 0.8)',
    background: isSacredTheme
      ? 'rgba(0, 0, 0, 0.95)'
      : isDarkTheme
        ? 'rgba(31, 41, 55, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
    cardBackground: isSacredTheme
      ? 'rgba(255, 215, 0, 0.02)'
      : isDarkTheme
        ? 'rgba(75, 85, 99, 0.05)'
        : 'rgba(248, 250, 252, 0.5)',
    textPrimary: isSacredTheme
      ? '#FFD700'
      : isDarkTheme
        ? '#E5E7EB'
        : '#1F2937',
    textSecondary: isSacredTheme
      ? '#FBBF24'
      : isDarkTheme
        ? '#9CA3AF'
        : '#6B7280',
  }

  const fonts = {
    primary: isSacredTheme ? 'Cinzel, serif' : 'Inter, sans-serif',
    secondary: isSacredTheme ? 'Crimson Text, serif' : 'Inter, sans-serif',
  }

  return {
    dialog: {
      borderWidth: '2px',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      borderColor: colors.border,
      backgroundColor: colors.background,
      color: colors.textPrimary,
      ...(isSacredTheme && {
        animation: 'show-task-glow-pulse 2s infinite alternate',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
      }),
      ...(isDarkTheme && {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      }),
    } as React.CSSProperties,
    glyph: {
      position: 'absolute',
      top: '0.75rem',
      color: isSacredTheme
        ? 'rgba(255, 215, 0, 0.3)'
        : isDarkTheme
          ? 'rgba(156, 163, 175, 0.3)'
          : 'rgba(107, 114, 128, 0.3)',
      fontSize: '1.125rem',
      zIndex: 10,
      animation: isSacredTheme
        ? 'show-task-float-glyph 5s infinite alternate'
        : 'none',
    } as React.CSSProperties,
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem',
      borderBottom: `2px solid ${colors.border}`,
      backgroundColor: colors.cardBackground,
    } as React.CSSProperties,
    headerTitle: {
      fontSize: '1.125rem',
      fontWeight: 700,
      fontFamily: fonts.primary,
      color: colors.textPrimary,
      ...(isSacredTheme && {
        letterSpacing: '0.05em',
        textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
      }),
    } as React.CSSProperties,
    headerSubtitle: {
      fontSize: '0.875rem',
      marginTop: '0.125rem',
      fontFamily: fonts.secondary,
      color: colors.textSecondary,
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
      border: `1px solid ${colors.border}`,
      margin: '0 -8px',
      padding: '0 8px',
      backgroundColor: colors.cardBackground,
    } as React.CSSProperties,
    sectionTitle: {
      fontWeight: 700,
      marginBottom: '0.25rem',
      fontFamily: fonts.primary,
      color: colors.textPrimary,
    } as React.CSSProperties,
    descriptionText: {
      fontSize: '0.875rem',
      whiteSpace: 'pre-wrap',
      fontFamily: fonts.secondary,
      color: colors.textSecondary,
    } as React.CSSProperties,
    comment: {
      marginBottom: '0',
    } as React.CSSProperties,
    commentEditing: {
      border: `1px solid ${colors.border}`,
      margin: '0 -8px',
      padding: '0.25rem 0.5rem',
      backgroundColor: colors.cardBackground,
    } as React.CSSProperties,
    commentContent: {
      border: `1px solid ${colors.border}`,
      margin: '0 -8px',
      padding: '0.5rem',
      backgroundColor: colors.cardBackground,
    } as React.CSSProperties,
    sidebar: {
      gridColumn: 'span 1 / span 1',
      padding: '0.5rem',
      borderLeft: `2px solid ${colors.border}`,
      backgroundColor: colors.cardBackground,
    } as React.CSSProperties,
    sidebarSection: {
      marginBottom: '0.5rem',
    } as React.CSSProperties,
    sidebarLabel: {
      fontSize: '0.875rem',
      fontWeight: 700,
      fontFamily: fonts.primary,
      color: colors.textPrimary,
    } as React.CSSProperties,
    sidebarValue: {
      fontSize: '0.875rem',
      fontFamily: fonts.secondary,
      color: colors.textSecondary,
    } as React.CSSProperties,
    chipContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.25rem',
      marginTop: '0.25rem',
    } as React.CSSProperties,
    moreVertIcon: {
      position: 'absolute',
      top: '19px',
      right: '8px',
      cursor: 'pointer',
      color: isSacredTheme
        ? 'rgba(255, 215, 0, 0.7)'
        : isDarkTheme
          ? '#9CA3AF'
          : '#6B7280',
      zIndex: 1,
      transition: 'all 0.2s ease',
      '&:hover': {
        color: isSacredTheme ? '#FFD700' : isDarkTheme ? '#E5E7EB' : '#374151',
        transform: 'scale(1.1)',
      },
    } as React.CSSProperties,
    customMenu: {
      position: 'absolute',
      top: '100%',
      right: '0',
      backgroundColor: colors.background,
      border: `1px solid ${colors.border}`,
      borderRadius: '0.375rem',
      boxShadow: isDarkTheme
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 1000,
      minWidth: '200px',
      ...(isSacredTheme && {
        boxShadow:
          '0 0 15px rgba(255, 215, 0, 0.3), 0 10px 15px -3px rgba(0, 0, 0, 0.3)',
      }),
    } as React.CSSProperties,
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      border: 'none',
      width: '100%',
      textAlign: 'left',
      fontSize: '0.875rem',
      fontFamily: fonts.secondary,
      color: colors.textPrimary,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: isSacredTheme
          ? 'rgba(255, 215, 0, 0.1)'
          : isDarkTheme
            ? 'rgba(75, 85, 99, 0.5)'
            : 'rgba(248, 250, 252, 0.8)',
      },
      '&:first-child': {
        borderTopLeftRadius: '0.375rem',
        borderTopRightRadius: '0.375rem',
      },
      '&:last-child': {
        borderBottomLeftRadius: '0.375rem',
        borderBottomRightRadius: '0.375rem',
      },
    } as React.CSSProperties,
    menuDropdown: {
      marginTop: '0.5rem',
      padding: '0.5rem',
      borderTop: `1px solid ${colors.border}`,
    } as React.CSSProperties,
  }
}

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
  styles,
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
  const computedStyles = getShowTaskStyles(styles)
  const isSacredTheme = styles?.theme === 'sacred'

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
    onComment?.(trimmed, taskId)
    setNewComment('')
  }

  const startEditingComment = (commentId: string, currentText: string) => {
    setEditingCommentId(commentId)
    setEditingCommentText(currentText)
  }

  const saveEditingComment = (commentId: string) => {
    const now = new Date()
    onEditComment?.(commentId, editingCommentText, taskId)
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
      onEdit?.({
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
    commentId: string | null
  }>({
    commentId: null,
  })

  const openCommentMenu = (
    event: React.MouseEvent<HTMLElement>,
    commentId: string
  ) => {
    event.stopPropagation()
    setCommentMenu({ commentId })
  }
  const closeCommentMenu = () => {
    setCommentMenu({ commentId: null })
  }
  const handleEditClick = (commentId: string, text: string) => {
    closeCommentMenu()
    startEditingComment(commentId, text)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      styles={{ theme: styles?.theme || 'light' }}
    >
      <div style={computedStyles.dialog}>
        {isSacredTheme && (
          <>
            <div
              style={{
                ...computedStyles.glyph,
                top: '0.75rem',
                left: '0.75rem',
              }}
            >
              {SACRED_GLYPHS[0]}
            </div>
            <div
              style={{
                ...computedStyles.glyph,
                top: '0.75rem',
                right: '3rem',
                animationDirection: 'reverse',
              }}
            >
              {SACRED_GLYPHS[1]}
            </div>
          </>
        )}

        <div style={computedStyles.header}>
          <div>
            {isEditing ? (
              <TextField
                label="Task Title"
                value={formData.taskTitle}
                onChange={value =>
                  setFormData(prev => ({ ...prev, taskTitle: value }))
                }
                className="mb-1"
                styles={{ theme: styles?.theme || 'light' }}
              />
            ) : (
              <>
                <Typography
                  styles={{
                    theme: styles?.theme || 'light',
                    variant: 'cinzelh4',
                  }}
                >
                  {formData.taskTitle}
                </Typography>
                <Typography
                  text={`created by ${createdBy}`}
                  styles={{
                    theme: styles?.theme || 'light',
                    variant: 'cinzelh5',
                  }}
                />
              </>
            )}
          </div>

          <div style={computedStyles.headerActions}>
            {onEdit && (
              <StyledTooltip
                title={isEditing ? 'Save' : 'Edit'}
                tooltipplacement="bottom"
                styles={{ theme: styles?.theme || 'light' }}
              >
                <CustomButton
                  {...(isEditing
                    ? { text: 'Save' }
                    : {
                        icon: (
                          <EditIcon
                            styles={{ theme: styles?.theme || 'light' }}
                          />
                        ),
                      })}
                  onClick={handleEditToggle}
                  styles={{ theme: styles?.theme || 'light' }}
                />
              </StyledTooltip>
            )}
            {onDelete && (
              <StyledTooltip
                title="Delete"
                tooltipplacement="bottom"
                styles={{ theme: styles?.theme || 'light' }}
              >
                <CustomButton
                  icon={
                    <DeleteIcon styles={{ theme: styles?.theme || 'light' }} />
                  }
                  onClick={onDelete}
                  styles={{ theme: styles?.theme || 'light' }}
                />
              </StyledTooltip>
            )}
            {onDuplicate && (
              <StyledTooltip
                title="Duplicate"
                tooltipplacement="bottom"
                styles={{ theme: styles?.theme || 'light' }}
              >
                <CustomButton
                  icon={
                    <ContentCopyIcon
                      styles={{ theme: styles?.theme || 'light' }}
                    />
                  }
                  onClick={onDuplicate}
                  styles={{ theme: styles?.theme || 'light' }}
                />
              </StyledTooltip>
            )}
            <CustomButton
              icon={<CloseIcon styles={{ theme: styles?.theme || 'light' }} />}
              onClick={onClose}
              styles={{
                theme: styles?.theme || 'light',
                outline: true,
              }}
            />
          </div>
        </div>

        <div style={computedStyles.grid}>
          <div style={computedStyles.mainContent}>
            <div style={computedStyles.descriptionContainer}>
              {isEditing ? (
                <ComplexTextEditor
                  value={formData.description}
                  onChange={val =>
                    setFormData(prev => ({ ...prev, description: val }))
                  }
                  label="Task Description"
                  editorType="simple"
                  minRows={3}
                  styles={{ theme: styles?.theme || 'light' }}
                />
              ) : (
                <>
                  <Typography
                    text="Task Description"
                    styles={{
                      theme: styles?.theme || 'light',
                      variant: 'cinzelh5',
                      margin: '5px 0',
                    }}
                  />
                  <Typography
                    text={formData.description}
                    styles={{
                      theme: styles?.theme || 'light',
                      variant: 'cinzelh6',
                      margin: '0 0 5px 0',
                    }}
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
              const isMenuOpen = commentMenu.commentId === comment._id

              return (
                <div key={comment._id} style={computedStyles.comment}>
                  {editingCommentId === comment._id ? (
                    <div style={computedStyles.commentEditing}>
                      <ComplexTextEditor
                        value={editingCommentText}
                        onChange={val => setEditingCommentText(val)}
                        label="Edit Comment"
                        minRows={3}
                        editorType="simple"
                        styles={{ theme: styles?.theme || 'light' }}
                      />
                      <div className="flex justify-end mt-1 gap-1">
                        <CustomButton
                          text="Save"
                          onClick={() => saveEditingComment(comment._id)}
                          styles={{ theme: styles?.theme || 'light' }}
                        />
                        <CustomButton
                          text="Cancel"
                          onClick={cancelEditingComment}
                          styles={{
                            theme: styles?.theme || 'light',
                            outline: true,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        ...computedStyles.commentContent,
                        position: 'relative',
                        padding: '0',
                        paddingLeft: '10px',
                      }}
                    >
                      <div style={{ paddingTop: '2px', position: 'relative' }}>
                        <div style={{ position: 'relative' }}>
                          <div
                            onClick={e => openCommentMenu(e, comment._id)}
                            style={computedStyles.moreVertIcon}
                          >
                            <MoreVertIcon
                              styles={{ theme: styles?.theme || 'light' }}
                            />
                          </div>

                          {isMenuOpen && (
                            <>
                              <div
                                style={{
                                  position: 'fixed',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  zIndex: 999,
                                }}
                                onClick={closeCommentMenu}
                              />
                              <div style={computedStyles.customMenu}>
                                {canEdit && (
                                  <button
                                    onClick={() =>
                                      handleEditClick(comment._id, comment.text)
                                    }
                                    style={{
                                      ...computedStyles.menuItem,
                                      backgroundColor: 'transparent',
                                    }}
                                    onMouseEnter={e => {
                                      e.currentTarget.style.backgroundColor =
                                        isSacredTheme
                                          ? 'rgba(255, 215, 0, 0.1)'
                                          : styles?.theme === 'dark'
                                            ? 'rgba(75, 85, 99, 0.5)'
                                            : 'rgba(248, 250, 252, 0.8)'
                                    }}
                                    onMouseLeave={e => {
                                      e.currentTarget.style.backgroundColor =
                                        'transparent'
                                    }}
                                  >
                                    <EditIcon
                                      styles={{
                                        theme: styles?.theme || 'light',
                                      }}
                                    />
                                    Edit
                                  </button>
                                )}
                                {hasHistory && (
                                  <div style={computedStyles.menuDropdown}>
                                    <SearchableSimple
                                      label="Revision History"
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
                                      defaultValue={selectedRevId || ''}
                                      styles={{
                                        theme: styles?.theme || 'light',
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>

                        <Typography
                          text={displayedText}
                          styles={{
                            theme: styles?.theme || 'light',
                            variant: 'cinzelparagraph',
                            margin: '0',
                            padding: '0',
                            marginRight: '30px',
                          }}
                        />
                      </div>
                      <div
                        style={{
                          ...computedStyles.descriptionText,
                          margin: '0',
                          padding: '0',
                          paddingBottom: '5px',
                        }}
                      >
                        {comment.createdAt && (
                          <div style={{ marginBottom: '2px' }}>
                            Created {createdTime} by {comment.createdBy}
                          </div>
                        )}
                        {displayedTime && displayedAuthor && (
                          <div style={{ paddingBottom: '3px' }}>
                            Edited {updatedTime}
                          </div>
                        )}
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
                styles={{ theme: styles?.theme || 'light' }}
              />
              <div className="flex justify-end mt-2 gap-2">
                <CustomButton
                  text="Close Task"
                  onClick={() => onCloseTask(taskId)}
                  styles={{ theme: styles?.theme || 'light' }}
                />
                <CustomButton
                  text="Comment"
                  onClick={handleComment}
                  styles={{ theme: styles?.theme || 'light' }}
                />
              </div>
            </div>
          </div>

          <div style={computedStyles.sidebar}>
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
              <div key={label} style={computedStyles.sidebarSection}>
                {!isEditing && (
                  <Typography
                    text={label}
                    styles={{
                      theme: styles?.theme || 'light',
                      variant: 'cinzelparagraph',
                    }}
                  />
                )}
                {isEditing ? (
                  <SearchableSimple
                    label={label}
                    options={options}
                    defaultValue={value}
                    onChange={newVal =>
                      setFormData(prev => ({
                        ...prev,
                        [field]: newVal?.attribute1 || '',
                      }))
                    }
                    styles={{
                      theme: styles?.theme || 'light',
                    }}
                  />
                ) : value ? (
                  <Chip
                    label={value}
                    styles={{
                      theme: styles?.theme || 'light',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      width: 'fit-content',
                    }}
                  />
                ) : null}
              </div>
            ))}

            <div style={computedStyles.sidebarSection}>
              {!isEditing && (
                <Typography
                  text="Topics"
                  styles={{
                    theme: styles?.theme || 'light',
                    variant: 'cinzelparagraph',
                  }}
                />
              )}
              {isEditing ? (
                <MultipleSelectChip
                  label="Topics"
                  options={topicOptions.map(t => ({ value: t.topic }))}
                  defaultSelected={formData.topics}
                  onChange={values =>
                    setFormData(prev => ({ ...prev, topics: values }))
                  }
                  styles={{ theme: styles?.theme || 'light' }}
                />
              ) : formData.topics.length > 0 ? (
                <div style={computedStyles.chipContainer}>
                  {formData.topics.map((topic, idx) => (
                    <Chip
                      key={idx}
                      label={topic}
                      styles={{
                        theme: styles?.theme || 'light',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        width: 'fit-content',
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div style={computedStyles.sidebarSection}>
              {!isEditing && (
                <Typography
                  text="Knowledgebase Articles"
                  styles={{
                    theme: styles?.theme || 'light',
                    variant: 'cinzelparagraph',
                  }}
                />
              )}
              {isEditing ? (
                <MultipleSelectChip
                  label="Knowledgebase Articles"
                  options={knowledgebaseArticleOptions.map(a => ({
                    value: a.articleTitle,
                  }))}
                  defaultSelected={formData.knowledgebaseArticles}
                  onChange={values =>
                    setFormData(prev => ({
                      ...prev,
                      knowledgebaseArticles: values,
                    }))
                  }
                  styles={{ theme: styles?.theme || 'light' }}
                />
              ) : formData.knowledgebaseArticles.length > 0 ? (
                <div style={computedStyles.chipContainer}>
                  {formData.knowledgebaseArticles.map((article, idx) => (
                    <Chip
                      key={idx}
                      label={article}
                      styles={{
                        theme: styles?.theme || 'light',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        width: 'fit-content',
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div style={computedStyles.sidebarSection}>
              {!isEditing && (
                <Typography
                  text="Next Action Date"
                  styles={{
                    theme: styles?.theme || 'light',
                    variant: 'cinzelparagraph',
                  }}
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
                    styles={{ theme: styles?.theme || 'light' }}
                  />
                </div>
              ) : formData.nextActionDate ? (
                <Typography
                  text={formData.nextActionDate}
                  styles={{
                    theme: styles?.theme || 'light',
                    variant: 'cinzelparagraph',
                  }}
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
