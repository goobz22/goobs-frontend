'use client'

import React, { useState, useCallback } from 'react'
import { Close } from '@mui/icons-material'
import {
  Dialog,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  alpha,
  keyframes,
} from '@mui/material'
import Typography from '../../../../Typography'
import SearchableDropdown from '../../../../Field/Dropdown/Searchable'
import MultiSelect from '../../../../Field/Dropdown/MultiSelect'
import ComplexTextEditor from '../../../../ComplexTextEditor'
import CustomButton from '../../../../Button'
import TextField from '../../../../Field/Text'

import type { Task, RawTopic, RawQueue, RawSeverityLevel } from '../../../types'

// Sacred animations
const glowPulse = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
  100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.4); }
`

const floatGlyph = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-2px) rotate(180deg); opacity: 0.5; }
  100% { transform: translateY(0px) rotate(360deg); opacity: 0.3; }
`

const egyptianStyles = {
  goldColor: '#FFD700',
  darkGold: '#B8860B',
  cardBackground: alpha('#000000', 0.95),
}

const SACRED_GLYPHS = ['𓁹', '𓂀', '𓊖', '𓊹']

interface CustomerAddTaskProps {
  open: boolean
  onClose: () => void
  onAdd: (newTask: Omit<Task, '_id'>) => void
  topics: RawTopic[]
  schedulingQueues: RawQueue[]
  severityLevels: RawSeverityLevel[]
  companyId: string
  createdUserId: string
  sacredTheme?: boolean
}

const CustomerAddTask: React.FC<CustomerAddTaskProps> = ({
  open,
  onClose,
  onAdd,
  topics,
  schedulingQueues,
  severityLevels,
  companyId,
  createdUserId,
  sacredTheme = false,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ------------------ FORM STATE ------------------
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [selectedSeverityId, setSelectedSeverityId] = useState('')
  const [selectedQueue, setSelectedQueue] = useState('')
  const [selectedQueueId, setSelectedQueueId] = useState('')
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')

  // Debug logging for incoming props
  console.log('CustomerAddTask - Props received:', {
    topicsCount: topics?.length || 0,
    queuesCount: schedulingQueues?.length || 0,
    severityLevelsCount: severityLevels?.length || 0,
  })

  // ------------------ DROPDOWN OPTIONS ------------------
  const severityOptions = severityLevels.map(sl => ({
    value: String(sl.severityLevel),
    attribute1: sl.description || '',
    attribute2: sl._id,
  }))

  const queueOptions = schedulingQueues.map(q => ({
    value: q.queueName,
    attribute1: q._id,
  }))

  // ------------------ SUBMIT HANDLER ------------------
  const handleSubmit = useCallback(() => {
    console.log('Submitting task with stored IDs:', {
      severityValue: selectedSeverity,
      severityId: selectedSeverityId,
      queueValue: selectedQueue,
      queueId: selectedQueueId,
    })

    // Validate required fields before submission
    if (!selectedSeverityId) {
      console.error('Error: Severity Level is required')
      alert('Please select a Severity Level')
      return
    }

    if (!taskTitle) {
      console.error('Error: Task Title is required')
      alert('Please enter a Task Title')
      return
    }

    if (!taskDescription) {
      console.error('Error: Task Description is required')
      alert('Please enter a Task Description')
      return
    }

    const newTaskData: Omit<Task, '_id'> = {
      title: taskTitle,
      description: taskDescription,
      topicIds: selectedTopicIds,
      articleIds: [],
      severityId: selectedSeverityId,
      schedulingQueueId: selectedQueueId,
      statusId: '',
      substatusId: '',
      employeeIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      closedAt: new Date(),
      createdBy: createdUserId,
      comments: [],
      commentIds: [],
      customerAssigned: '',
      severity: '',
      schedulingQueue: '',
      status: '',
      subStatus: '',
      topicLabels: [],
      kbArticles: [],
      teamMember: '',
      nextActionDate: '',
      companyId,
      customerId: createdUserId,
    }
    onAdd(newTaskData)
  }, [
    taskTitle,
    taskDescription,
    selectedTopicIds,
    selectedSeverityId,
    selectedQueueId,
    selectedQueue,
    selectedSeverity,
    companyId,
    createdUserId,
    onAdd,
  ])

  // ------------------ RENDER ------------------
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : '700px',
          margin: isMobile ? '16px' : 'auto',
          pointerEvents: 'auto',
          ...(sacredTheme && {
            border: `2px solid ${alpha(egyptianStyles.goldColor, 0.5)}`,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: `0 0 30px ${alpha(egyptianStyles.goldColor, 0.3)}`,
            backgroundColor: egyptianStyles.cardBackground,
            animation: `${glowPulse} 3s ease-in-out infinite`,
          }),
        },
      }}
    >
      {sacredTheme && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              color: alpha(egyptianStyles.goldColor, 0.3),
              fontSize: '18px',
              animation: `${floatGlyph} 4s ease-in-out infinite`,
              zIndex: 1,
            }}
          >
            {SACRED_GLYPHS[0]}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              right: '48px',
              color: alpha(egyptianStyles.goldColor, 0.3),
              fontSize: '18px',
              animation: `${floatGlyph} 4s ease-in-out infinite reverse`,
              zIndex: 1,
            }}
          >
            {SACRED_GLYPHS[1]}
          </Box>
        </>
      )}
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: sacredTheme
            ? egyptianStyles.goldColor
            : theme.palette.grey[500],
          zIndex: theme.zIndex.modal + 1,
          cursor: 'pointer',
          '&:hover': {
            color: sacredTheme
              ? egyptianStyles.goldColor
              : theme.palette.grey[700],
          },
        }}
      >
        <Close />
      </IconButton>

      <Box
        sx={{
          p: 3,
          ...(sacredTheme && {
            borderBottom: `2px solid ${alpha(egyptianStyles.goldColor, 0.3)}`,
            backgroundColor: alpha(egyptianStyles.goldColor, 0.05),
          }),
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            ...(sacredTheme && {
              fontFamily: '"Cinzel", serif',
              letterSpacing: '0.05em',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
              color: egyptianStyles.goldColor,
            }),
          }}
        >
          Create Task
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Title and Description Fields */}
          <TextField
            label="Task Title"
            value={taskTitle}
            onChange={e => setTaskTitle(e.target.value)}
            placeholder="Enter Task Title"
            sacredTheme={sacredTheme}
          />

          <ComplexTextEditor
            label="Task Description"
            value={taskDescription}
            onChange={setTaskDescription}
            editorType="simple"
            minRows={5}
            sacredTheme={sacredTheme}
          />

          {/* Top row of fields */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 1,
            }}
          >
            <Box
              sx={{
                flex: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <SearchableDropdown
                label="Severity Level"
                options={severityOptions}
                defaultValue={
                  severityOptions.find(
                    opt => opt.attribute2 === selectedSeverityId
                  )?.value
                }
                onChange={option => {
                  // Store the severity level as display value and the ID properly
                  setSelectedSeverity(option?.value || '')
                  setSelectedSeverityId(option?.attribute2 || '')
                  console.log('Selected severity ID:', option?.attribute2)
                }}
                placeholder="Select severity level"
                sacredTheme={sacredTheme}
              />
            </Box>

            <Box
              sx={{
                flex: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <SearchableDropdown
                label="Associated Product (Queue)"
                options={queueOptions}
                defaultValue={
                  queueOptions.find(opt => opt.attribute1 === selectedQueueId)
                    ?.value
                }
                onChange={option => {
                  setSelectedQueue(option?.value || '')
                  setSelectedQueueId(option?.attribute1 || '')
                  console.log('Selected queue ID:', option?.attribute1)
                }}
                placeholder="Select product queue"
                sacredTheme={sacredTheme}
              />
            </Box>
          </Box>

          {/* Topics multi-select – using complex options with IDs in attribute1 */}
          {React.useMemo(() => {
            console.log('Topics being mapped for dropdown:', topics)

            // Create complex options for topics with _id as attribute1
            const topicOptions = topics.map(t => ({
              value: t.topic || `Topic ${t._id}`,
              attribute1: t._id, // Store ID in attribute1
            }))

            console.log('Topic options created:', topicOptions)

            // Translate selected IDs to names for display
            const selectedTopicValues = selectedTopicIds.map(id => {
              const topic = topics.find(t => t._id === id)
              return topic ? topic.topic || `Topic ${topic._id}` : id
            })

            return (
              <MultiSelect
                label="Topics"
                options={topicOptions}
                defaultSelected={selectedTopicValues}
                onChange={selectedValues => {
                  console.log('Selected topic values:', selectedValues)

                  // Find the selected topics and get their IDs
                  const newSelectedIds = selectedValues.map(value => {
                    const matchingTopic = topicOptions.find(
                      opt => opt.value === value
                    )
                    return matchingTopic?.attribute1 || value // Fall back to value if no match
                  })

                  console.log('Mapped to topic IDs:', newSelectedIds)
                  setSelectedTopicIds(newSelectedIds)
                }}
                complexOptions={true} // Explicitly set to use complex options
                sacredTheme={sacredTheme}
              />
            )
          }, [topics, selectedTopicIds, sacredTheme])}

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 2,
              flexDirection: isMobile ? 'column' : 'row',
            }}
          >
            <CustomButton
              text="Cancel"
              onClick={onClose}
              backgroundcolor="none"
              fontcolor={sacredTheme ? egyptianStyles.goldColor : 'black'}
              sacredTheme={sacredTheme}
            />
            <CustomButton
              text="Create Task"
              onClick={handleSubmit}
              backgroundcolor={sacredTheme ? egyptianStyles.goldColor : '#000'}
              fontcolor={sacredTheme ? '#000' : 'white'}
              sacredTheme={sacredTheme}
            />
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}

export default CustomerAddTask
