'use client'

import React, { useState, useCallback } from 'react'
import { Close } from '@mui/icons-material'
import { Dialog, IconButton, Box, useMediaQuery, useTheme } from '@mui/material'
import Typography from '../../../../Typography'
import SearchableDropdown from '../../../../Field/Dropdown/Searchable'
import MultiSelect from '../../../../Field/Dropdown/MultiSelect'
import ComplexTextEditor from '../../../../ComplexTextEditor'
import CustomButton from '../../../../Button'
import TextField from '../../../../Field/Text'

import type { Task, RawTopic, RawQueue, RawSeverityLevel } from '../../../types'

interface CustomerAddTaskProps {
  open: boolean
  onClose: () => void
  onAdd: (newTask: Omit<Task, '_id'>) => void
  topics: RawTopic[]
  schedulingQueues: RawQueue[]
  severityLevels: RawSeverityLevel[]
  companyId: string
  createdUserId: string
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
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ------------------ FORM STATE ------------------
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [selectedQueue, setSelectedQueue] = useState('')
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
  }))

  const queueOptions = schedulingQueues.map(q => ({
    value: q.queueName,
  }))

  // ------------------ SUBMIT HANDLER ------------------
  const handleSubmit = useCallback(() => {
    // Find the IDs from the selected values
    const selectedQueueId =
      schedulingQueues.find(q => q.queueName === selectedQueue)?._id || ''

    console.log('Submitting task with mapped IDs:', {
      severityId: selectedSeverity,
      queueValue: selectedQueue,
      queueId: selectedQueueId,
    })

    const newTaskData: Omit<Task, '_id'> = {
      title: taskTitle,
      description: taskDescription,
      topicIds: selectedTopicIds,
      articleIds: [],
      severityId: selectedSeverity || '',
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
    selectedSeverity,
    selectedQueue,
    companyId,
    createdUserId,
    onAdd,
    schedulingQueues,
  ])

  // ------------------ RENDER ------------------
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        style: {
          width: isMobile ? '100%' : '700px',
          margin: isMobile ? '16px' : 'auto',
          pointerEvents: 'auto',
        },
      }}
    >
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
          zIndex: theme.zIndex.modal + 1,
          cursor: 'pointer',
          '&:hover': { color: theme.palette.grey[700] },
        }}
      >
        <Close />
      </IconButton>

      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Create Task
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Title and Description Fields */}
          <TextField
            label="Task Title"
            value={taskTitle}
            onChange={e => setTaskTitle(e.target.value)}
            placeholder="Enter Task Title"
          />

          <ComplexTextEditor
            label="Task Description"
            value={taskDescription}
            onChange={setTaskDescription}
            editorType="simple"
            minRows={5}
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
                    opt => opt.attribute1 === selectedSeverity
                  )?.value
                }
                onChange={option => {
                  setSelectedSeverity(option?.attribute1 || '')
                }}
                placeholder="Select severity level"
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
                  queueOptions.find(opt => opt.value === selectedQueue)?.value
                }
                onChange={option => {
                  setSelectedQueue(option?.value || '')
                }}
                placeholder="Select product queue"
              />
            </Box>
          </Box>

          {/* Topics multi-select – raw topics mapped to their _id strings */}
          <MultiSelect
            label="Topics"
            options={topics.map(t => t._id)}
            defaultSelected={selectedTopicIds}
            onChange={setSelectedTopicIds}
          />

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
              fontcolor="black"
            />
            <CustomButton
              text="Create Task"
              onClick={handleSubmit}
              backgroundcolor="#000000"
              fontcolor="white"
            />
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}

export default CustomerAddTask
