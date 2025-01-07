// src\components\ProjectBoard\ShowTask\client.tsx
'use client'

import React, { useState } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Chip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

// Import your custom components
import Typography from '../../Typography'
import TextField from '../../TextField'
import CustomButton from '../../Button'

// Example comment type. You can adapt it to your real data.
export interface ShowTaskComment {
  _id: string
  authorName: string
  text: string
}

/**
 * Props for ShowTask.  It expects simple string arrays for `topics` and
 * `knowledgebaseArticles`. We also define some optional props (tasks, statuses, etc.)
 * if you want them for future expansions, but we won't render them here.
 */
export interface ShowTaskProps {
  open: boolean
  onClose: () => void

  /** If you want to pass the entire tasks array, statuses, etc., add them as optional. */
  tasks?: unknown
  statuses?: unknown
  subStatuses?: unknown
  schedulingQueues?: unknown
  customers?: unknown
  employees?: unknown
  severityLevels?: unknown

  /**
   * The main task info to display:
   * - taskTitle
   * - createdBy (e.g., "John Doe")
   * - description
   * - comments
   */
  taskTitle?: string
  createdBy?: string
  description?: string
  comments?: ShowTaskComment[]

  /** Right-side fields to show as chips (or simple text). */
  customerAssigned?: string
  severity?: string
  schedulingQueue?: string
  status?: string
  subStatus?: string

  /** We expect plain string[] for topics & knowledgebaseArticles. */
  topics?: string[]
  knowledgebaseArticles?: string[]

  /** Another field for the right side. */
  teamMemberAssigned?: string
  nextActionDate?: string // e.g. "09/15/2023 - 8:30AM CST"

  /** Called when user clicks "Close Task" or "Comment," if needed. */
  onCloseTask?: () => void
  onComment?: (commentText: string) => void

  /** If you want to handle "Edit," "Delete," or "Duplicate" click events. */
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
}

const ShowTask: React.FC<ShowTaskProps> = ({
  open,
  onClose,

  taskTitle = 'Untitled Task',
  createdBy = 'Unknown User',
  description = '',
  comments = [],

  customerAssigned,
  severity,
  schedulingQueue,
  status,
  subStatus,
  topics = [],
  knowledgebaseArticles = [],
  teamMemberAssigned,
  nextActionDate,

  onCloseTask,
  onComment,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  // Track the new comment text
  const [newComment, setNewComment] = useState('')

  // Handler for posting a comment
  const handleComment = () => {
    if (onComment && newComment.trim() !== '') {
      onComment(newComment.trim())
      setNewComment('')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {/* Title row, with an "X" and action buttons in the top-right */}
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Task Title */}
          <Typography
            fontvariant="merriparagraph"
            fontcolor="black"
            text={taskTitle}
            sx={{ fontSize: '18px', fontWeight: 'bold' }}
          />
          {/* Subtitle: "created by [name]" */}
          <Typography
            fontvariant="merriparagraph"
            fontcolor="gray"
            text={`created by ${createdBy}`}
            sx={{ fontSize: '14px' }}
          />
        </Box>

        {/* Right-side top actions: Edit / Delete / Duplicate + an "X" to close */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            {/* If you have actual callbacks, show them; else hide */}
            {onEdit && (
              <CustomButton
                text="Edit"
                fontcolor="black"
                backgroundcolor="none"
                onClick={onEdit}
              />
            )}
            {onDelete && (
              <CustomButton
                text="Delete"
                fontcolor="black"
                backgroundcolor="none"
                onClick={onDelete}
              />
            )}
            {onDuplicate && (
              <CustomButton
                text="Duplicate"
                fontcolor="black"
                backgroundcolor="none"
                onClick={onDuplicate}
              />
            )}
          </Box>

          <IconButton onClick={onClose} sx={{ alignSelf: 'flex-start' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 2 }}>
          {/* Left side: description, comments, comment box */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Task Description */}
            <Box
              sx={{
                border: '1px solid #ccc',
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              <Typography
                fontvariant="merriparagraph"
                fontcolor="black"
                text={description}
                sx={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}
              />
            </Box>

            {/* Existing Comments */}
            {comments.map(comment => (
              <Box
                key={comment._id}
                sx={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text={`${comment.authorName}`}
                  sx={{ fontWeight: 'bold' }}
                />
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text={comment.text}
                  sx={{ fontSize: '14px', mt: 0.5 }}
                />
              </Box>
            ))}

            {/* New Comment Box */}
            <Box
              sx={{
                border: '1px solid #ccc',
                padding: '8px',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <TextField
                label="Comment"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                multiline
                minRows={3}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                {/* "Close Task" and "Comment" buttons */}
                {onCloseTask && (
                  <CustomButton
                    text="Close Task"
                    backgroundcolor="#5e3d8a"
                    fontcolor="white"
                    onClick={onCloseTask}
                  />
                )}
                <CustomButton
                  text="Comment"
                  backgroundcolor="#4B0082"
                  fontcolor="white"
                  onClick={handleComment}
                />
              </Box>
            </Box>
          </Box>

          {/* Right side: labeled fields with chips */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {customerAssigned && (
              <Box>
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Customer Assigned"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
                <Chip
                  label={customerAssigned}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}

            {severity && (
              <Box>
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Severity"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
                <Chip
                  label={severity}
                  color="error" // e.g. "Critical" => red
                  variant="outlined"
                />
              </Box>
            )}

            {schedulingQueue && (
              <Box>
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Scheduling Queue"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
                <Chip
                  label={schedulingQueue}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}

            {status && (
              <Box>
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Status"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
                <Chip label={status} color="success" variant="outlined" />
              </Box>
            )}

            {subStatus && (
              <Box>
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Sub Status"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
                <Chip label={subStatus} color="info" variant="outlined" />
              </Box>
            )}

            {topics.length > 0 && (
              <Box>
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Topics"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {topics.map((topic, idx) => (
                    <Chip
                      key={idx}
                      label={topic}
                      color="success"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {knowledgebaseArticles.length > 0 && (
              <Box>
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Knowledgebase Articles"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {knowledgebaseArticles.map((article, idx) => (
                    <Chip
                      key={idx}
                      label={article}
                      color="warning"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {teamMemberAssigned && (
              <Box>
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Team Member Assigned"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
                <Chip
                  label={teamMemberAssigned}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}

            {nextActionDate && (
              <Box>
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text="Next Action Date"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
                <Typography
                  fontvariant="merriparagraph"
                  fontcolor="black"
                  text={nextActionDate}
                  sx={{ fontSize: '14px' }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ShowTask
