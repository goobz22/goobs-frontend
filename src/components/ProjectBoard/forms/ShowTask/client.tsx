'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import MoreVertIcon from '@mui/icons-material/MoreVert'

// Custom components
import Typography from '../../../Typography'
import CustomButton from '../../../Button'
import ComplexTextEditor from '../../../ComplexTextEditor'
import SearchableDropdown from '../../../Field/Dropdown/Searchable'
import MultipleSelectChip from '../../../Field/Dropdown/MultiSelect'
import DateField from '../../../Field/Date'
import TextField from '../../../Field/Text'

// Colors
import { gunpowder, woad, red, white, black } from '../../../../styles/palette'

// Import shared types from the central types file
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

// ----------------------- ShowTaskProps -----------------------
export interface ShowTaskProps {
  open: boolean
  onClose: () => void

  // The Task ID (now used by onCloseTask).
  taskId: string

  // Main Task fields
  taskTitle: string
  createdBy: string
  description: string

  // Comments array using shared Comment type
  comments: Comment[]

  // Right-side fields
  customerAssigned: string
  severity: string
  schedulingQueue: string
  status: string
  subStatus: string
  topics: string[]
  knowledgebaseArticles: string[]
  teamMemberAssigned: string
  nextActionDate: string

  // Options for dropdowns / multi-select using raw types
  customerOptions: RawCustomer[]
  severityOptions: RawSeverityLevel[]
  schedulingQueueOptions: RawQueue[]
  statusOptions: RawStatus[]
  subStatusOptions: RawSubStatus[]
  topicOptions: RawTopic[]
  knowledgebaseArticleOptions: RawArticle[]
  teamMemberOptions: RawEmployee[]

  // Which user is viewing / editing? Only that user can edit comments they authored.
  currentUserName: string

  // Callback actions
  /**
   * Now takes the taskId as a parameter so we can know which Task is being closed.
   */
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

  /**
   * New callback: Pass the full revision history of a comment (by commentId)
   * to the parent component.
   */
  onRevisionHistory: (
    commentId: string,
    revisionHistory: CommentEditHistory[]
  ) => void
}

// ----------------------- Helper Functions -----------------------

/** A helper to format a relative time (e.g. "3 hours ago") given a Date */
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

/** Given a date string, safely returns a Date object or null */
function safeParseDate(dateStr?: string): Date | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return Number.isNaN(d.getTime()) ? null : d
}

// ----------------------- ShowTask Component -----------------------

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
}) => {
  // 1) Local comment state – these comments use our shared types.
  const [localComments, setLocalComments] = useState<Comment[]>(comments)
  // 2) For adding a new comment
  const [newComment, setNewComment] = useState('')
  // 3) Whether we are editing the left-side fields
  const [isEditing, setIsEditing] = useState(false)
  // 4) formData for the left & right fields (including description)
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
  // 5) For editing an individual comment’s text
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentText, setEditingCommentText] = useState('')
  // 6) For selecting revisions for each comment
  const [selectedRevisions, setSelectedRevisions] = useState<
    Record<string, string | null>
  >({})

  // ------------------ SETUP ORIGINAL REVISIONS ------------------
  useEffect(() => {
    setLocalComments(prev =>
      prev.map(c => {
        if (!c.editHistory || c.editHistory.length === 0) {
          // Use the comment's createdAt as the "original" time
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

  // ------------------ COMMENT ACTIONS ------------------
  /** Create a new comment in local state with the current user as author */
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

  /** Begin editing a comment’s text */
  const startEditingComment = (commentId: string, currentText: string) => {
    setEditingCommentId(commentId)
    setEditingCommentText(currentText)
  }

  /** Save the edited comment text and update the local state */
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

  /** Cancel editing a comment */
  const cancelEditingComment = () => {
    setEditingCommentId(null)
    setEditingCommentText('')
  }

  // ------------------ RIGHT-SIDE EDIT TOGGLE ------------------
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

  // ------------------ REVISION SELECT ------------------
  const handleSelectRevision = (
    commentId: string,
    revisionId: string | null
  ) => {
    setSelectedRevisions(prev => ({ ...prev, [commentId]: revisionId || null }))
    // Find the comment and pass its revision history up via the new callback
    const comment = localComments.find(c => c._id === commentId)
    if (comment && comment.editHistory) {
      onRevisionHistory(commentId, comment.editHistory)
    }
  }

  // A reusable style for each right-side row
  const rightSideRowStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    pb: 2,
    borderBottom: '1px solid black',
    mx: -2,
    px: 2,
  }

  // ------------------ Comment Menu State ------------------
  interface CommentMenuState {
    anchor: HTMLElement | null
    commentId: string | null
  }
  const [commentMenu, setCommentMenu] = useState<CommentMenuState>({
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

  // ------------------ JSX ------------------
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          border: '2px solid black',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: 'none',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Top Row: Title + createdBy + action buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '2px solid black',
          }}
        >
          {/* Left: Title & createdBy */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {isEditing ? (
              <TextField
                label="Task Title"
                value={formData.taskTitle}
                onChange={e =>
                  setFormData(prev => ({ ...prev, taskTitle: e.target.value }))
                }
                outlinecolor={black.main}
                fontcolor={black.main}
                shrunklabelposition="aboveNotch"
                sx={{ mb: 1 }}
              />
            ) : (
              <Typography
                fontvariant="merrih4"
                fontcolor="black"
                text={formData.taskTitle}
                sx={{ fontSize: '18px', fontWeight: 'bold' }}
              />
            )}
            <Typography
              fontvariant="merrih5"
              fontcolor="gray"
              text={`created by ${createdBy}`}
              sx={{ fontSize: '14px', mt: 0.5 }}
            />
          </Box>

          {/* Right: Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CustomButton
              text={isEditing ? 'Save' : 'Edit'}
              fontcolor="black"
              backgroundcolor="none"
              onClick={handleEditToggle}
            />
            <CustomButton
              text="Delete"
              fontcolor="black"
              backgroundcolor="none"
              onClick={onDelete}
            />
            <CustomButton
              text="Duplicate"
              fontcolor="black"
              backgroundcolor="none"
              onClick={onDuplicate}
            />
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Main Content: Left (Description & Comments) + Right (Additional Fields) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 0 }}>
          {/* LEFT COLUMN */}
          <Box sx={{ p: 2, pt: 0 }}>
            {/* DESCRIPTION */}
            <Box
              sx={{
                border: '1px solid black',
                mx: -2,
                px: 2,
                pt: '5px',
                pb: '10px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {isEditing ? (
                <>
                  <Typography
                    fontvariant="merrih5"
                    fontcolor="black"
                    text="Task Description"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  />
                  <ComplexTextEditor
                    value={formData.description}
                    onChange={val =>
                      setFormData(prev => ({ ...prev, description: val }))
                    }
                    label="Task Description"
                    editorType="simple"
                    minRows={3}
                  />
                </>
              ) : (
                <>
                  <Typography
                    fontvariant="merrih5"
                    fontcolor="black"
                    text="Task Description"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  />
                  <Typography
                    fontvariant="merrih6"
                    fontcolor="black"
                    text={formData.description}
                    sx={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}
                  />
                </>
              )}
            </Box>

            {/* EXISTING COMMENTS */}
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
                <Box key={comment._id} sx={{ mb: 0 }}>
                  {editingCommentId === comment._id ? (
                    <Box
                      sx={{ border: '1px solid black', mx: -2, px: 2, py: 1 }}
                    >
                      <ComplexTextEditor
                        value={editingCommentText}
                        onChange={val => setEditingCommentText(val)}
                        label="Edit Comment"
                        minRows={3}
                        editorType="simple"
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          mt: 1,
                          gap: 1,
                        }}
                      >
                        <CustomButton
                          text="Save"
                          backgroundcolor={woad.dark}
                          fontcolor={white.main}
                          onClick={() => saveEditingComment(comment._id)}
                        />
                        <CustomButton
                          text="Cancel"
                          backgroundcolor="none"
                          fontcolor="black"
                          onClick={cancelEditingComment}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        border: '1px solid black',
                        mx: -2,
                        px: 2,
                        py: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '80px',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Typography
                          fontvariant="merrih5"
                          fontcolor="black"
                          text={comment.createdBy}
                          sx={{ fontWeight: 'bold' }}
                        />
                        <IconButton
                          size="small"
                          onClick={e => openCommentMenu(e, comment._id)}
                          sx={{ mb: 1 }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>

                        <Menu
                          anchorEl={commentMenu.anchor}
                          open={Boolean(isMenuOpen)}
                          onClose={closeCommentMenu}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                        >
                          {canEdit && (
                            <MenuItem
                              onClick={() =>
                                handleEditClick(comment._id, comment.text)
                              }
                            >
                              Edit
                            </MenuItem>
                          )}
                          {hasHistory && (
                            <MenuItem
                              disableRipple
                              sx={{
                                py: 0.5,
                                cursor: 'default',
                                '&:hover': { backgroundColor: 'transparent' },
                              }}
                            >
                              <Box sx={{ width: 220 }}>
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
                                  outlinecolor={black.main}
                                  fontcolor={black.main}
                                  defaultValue={selectedRevId || undefined}
                                />
                              </Box>
                            </MenuItem>
                          )}
                        </Menu>
                      </Box>

                      <Box sx={{ mt: 'auto' }}>
                        <Typography
                          fontvariant="merriparagraph"
                          fontcolor="black"
                          text={displayedText}
                          sx={{ fontSize: '14px', mt: 0.5 }}
                        />
                        <Box sx={{ fontSize: '12px', color: 'gray', mt: 0.5 }}>
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
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              )
            })}

            {/* NEW COMMENT EDITOR */}
            <Box sx={{ mx: -2, px: 2, py: 0 }}>
              <ComplexTextEditor
                value={newComment}
                onChange={val => setNewComment(val)}
                label="Add Comment"
                minRows={3}
                editorType="simple"
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 2,
                  gap: 2,
                }}
              >
                {/* PASS THE TASK ID TO onCloseTask */}
                <CustomButton
                  text="Close Task"
                  backgroundcolor={gunpowder.main}
                  fontcolor={white.main}
                  onClick={() => onCloseTask(taskId)}
                />
                <CustomButton
                  text="Comment"
                  backgroundcolor={woad.dark}
                  fontcolor={white.main}
                  onClick={handleComment}
                />
              </Box>
            </Box>
          </Box>

          {/* RIGHT COLUMN */}
          <Box
            sx={{
              borderLeft: '2px solid black',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* Customer Assigned */}
            <Box sx={rightSideRowStyle}>
              {!isEditing && (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Customer Assigned"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
              )}
              {isEditing ? (
                <SearchableDropdown
                  label="Customer Assigned"
                  options={customerOptions.map(cust => ({
                    value:
                      cust.firstName || cust.lastName
                        ? `${cust.firstName || ''} ${cust.lastName || ''}`.trim()
                        : cust._id,
                    attribute1: cust._id,
                  }))}
                  shrunklabelposition="aboveNotch"
                  defaultValue={formData.customerAssigned}
                  onChange={newVal =>
                    setFormData(prev => ({
                      ...prev,
                      customerAssigned: newVal?.attribute1 || '',
                    }))
                  }
                  outlinecolor={black.main}
                  fontcolor={black.main}
                />
              ) : (
                formData.customerAssigned && (
                  <Chip
                    label={formData.customerAssigned}
                    variant="filled"
                    sx={{
                      backgroundColor: woad.main,
                      color: white.main,
                      mt: 1,
                    }}
                  />
                )
              )}
            </Box>

            {/* Severity */}
            <Box sx={rightSideRowStyle}>
              {!isEditing && (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Severity"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
              )}
              {isEditing ? (
                <SearchableDropdown
                  label="Severity"
                  options={severityOptions.map(s => ({
                    value: String(s.severityLevel),
                    attribute1: s._id,
                  }))}
                  shrunklabelposition="aboveNotch"
                  defaultValue={formData.severity}
                  onChange={newVal =>
                    setFormData(prev => ({
                      ...prev,
                      severity: newVal?.attribute1 || '',
                    }))
                  }
                  outlinecolor={black.main}
                  fontcolor={black.main}
                />
              ) : formData.severity ? (
                <Chip
                  label={formData.severity}
                  variant="filled"
                  sx={{ backgroundColor: red.main, color: white.main, mt: 1 }}
                />
              ) : null}
            </Box>

            {/* Scheduling Queue */}
            <Box sx={rightSideRowStyle}>
              {!isEditing && (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Scheduling Queue"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
              )}
              {isEditing ? (
                <SearchableDropdown
                  label="Scheduling Queue"
                  options={schedulingQueueOptions.map(q => ({
                    value: q.queueName,
                    attribute1: q._id,
                  }))}
                  shrunklabelposition="aboveNotch"
                  defaultValue={formData.schedulingQueue}
                  onChange={newVal =>
                    setFormData(prev => ({
                      ...prev,
                      schedulingQueue: newVal?.attribute1 || '',
                    }))
                  }
                  outlinecolor={black.main}
                  fontcolor={black.main}
                />
              ) : formData.schedulingQueue ? (
                <Chip
                  label={formData.schedulingQueue}
                  variant="filled"
                  sx={{ backgroundColor: '#C48EA6', color: white.main, mt: 1 }}
                />
              ) : null}
            </Box>

            {/* Status */}
            <Box sx={rightSideRowStyle}>
              {!isEditing && (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Status"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
              )}
              {isEditing ? (
                <SearchableDropdown
                  label="Status"
                  options={statusOptions.map(s => ({
                    value: s.status,
                    attribute1: s._id,
                  }))}
                  shrunklabelposition="aboveNotch"
                  defaultValue={formData.status}
                  onChange={newVal =>
                    setFormData(prev => ({
                      ...prev,
                      status: newVal?.attribute1 || '',
                    }))
                  }
                  outlinecolor={black.main}
                  fontcolor={black.main}
                />
              ) : formData.status ? (
                <Chip
                  label={formData.status}
                  variant="filled"
                  sx={{ backgroundColor: black.main, color: white.main, mt: 1 }}
                />
              ) : null}
            </Box>

            {/* Sub Status */}
            <Box sx={rightSideRowStyle}>
              {!isEditing && (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Sub Status"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
              )}
              {isEditing ? (
                <SearchableDropdown
                  label="Sub Status"
                  options={subStatusOptions.map(s => ({
                    value: s.subStatus,
                    attribute1: s._id,
                  }))}
                  defaultValue={formData.subStatus}
                  onChange={newVal =>
                    setFormData(prev => ({
                      ...prev,
                      subStatus: newVal?.attribute1 || '',
                    }))
                  }
                  outlinecolor={black.main}
                  fontcolor={black.main}
                  shrunklabelposition="aboveNotch"
                />
              ) : formData.subStatus ? (
                <Chip
                  label={formData.subStatus}
                  variant="filled"
                  color="info"
                  sx={{ mt: 1 }}
                />
              ) : null}
            </Box>

            {/* Topics (Multi-select) */}
            <Box sx={rightSideRowStyle}>
              {!isEditing && (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Topics"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
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
                  outlinecolor={black.main}
                  fontcolor={black.main}
                  sx={{ mt: 1 }}
                />
              ) : formData.topics.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {formData.topics.map((topic, idx) => (
                    <Chip
                      key={idx}
                      label={topic}
                      variant="filled"
                      color="success"
                    />
                  ))}
                </Box>
              ) : null}
            </Box>

            {/* Knowledgebase Articles (Multi-select) */}
            <Box sx={rightSideRowStyle}>
              {!isEditing && (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Knowledgebase Articles"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
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
                  outlinecolor={black.main}
                  fontcolor={black.main}
                  sx={{ mt: 1 }}
                />
              ) : formData.knowledgebaseArticles.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {formData.knowledgebaseArticles.map((article, idx) => (
                    <Chip
                      key={idx}
                      label={article}
                      variant="filled"
                      color="warning"
                    />
                  ))}
                </Box>
              ) : null}
            </Box>

            {/* Team Member Assigned */}
            <Box sx={rightSideRowStyle}>
              {!isEditing && (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Team Member Assigned"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
              )}
              {isEditing ? (
                <SearchableDropdown
                  label="Team Member Assigned"
                  options={teamMemberOptions.map(tm => ({
                    value:
                      tm.firstName && tm.lastName
                        ? `${tm.firstName} ${tm.lastName}`
                        : tm._id,
                    attribute1: tm._id,
                  }))}
                  defaultValue={formData.teamMemberAssigned}
                  onChange={newVal =>
                    setFormData(prev => ({
                      ...prev,
                      teamMemberAssigned: newVal?.attribute1 || '',
                    }))
                  }
                  outlinecolor={black.main}
                  fontcolor={black.main}
                  shrunklabelposition="aboveNotch"
                />
              ) : formData.teamMemberAssigned ? (
                <Chip
                  label={formData.teamMemberAssigned}
                  variant="filled"
                  sx={{ backgroundColor: woad.main, color: white.main, mt: 1 }}
                />
              ) : null}
            </Box>

            {/* Next Action Date */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {!isEditing && (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Next Action Date"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
              )}
              {isEditing ? (
                <Box sx={{ mt: 1, width: '100%' }}>
                  <DateField
                    label="Next Action Date"
                    value={safeParseDate(formData.nextActionDate)}
                    onChange={date => {
                      if (date) {
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
                  />
                </Box>
              ) : formData.nextActionDate ? (
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text={formData.nextActionDate}
                  sx={{ fontSize: '14px', mt: 1 }}
                />
              ) : null}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ShowTask
