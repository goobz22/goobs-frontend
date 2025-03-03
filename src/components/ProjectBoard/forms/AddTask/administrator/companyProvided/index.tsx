'use client'

import React, { useState, useCallback } from 'react'
import { Close } from '@mui/icons-material'
import { Dialog, IconButton, Box, useMediaQuery, useTheme } from '@mui/material'
import Typography from '../../../../../Typography'
import Dropdown from '../../../../../Field/Dropdown/Regular'
import MultiSelect from '../../../../../Field/Dropdown/MultiSelect'
import ComplexTextEditor from '../../../../../ComplexTextEditor'
import CustomButton from '../../../../../Button'
import TextField from '../../../../../Field/Text'

import type {
  Task,
  RawStatus,
  RawSubStatus,
  RawTopic,
  RawQueue,
  RawArticle,
  RawSeverityLevel,
} from '../../../../types'

interface AdministratorAddTaskCompanyProvidedProps {
  open: boolean
  onClose: () => void
  onAdd: (newTask: Omit<Task, '_id'>) => void
  statuses: RawStatus[]
  subStatuses: RawSubStatus[]
  topics: RawTopic[]
  schedulingQueues: RawQueue[]
  knowledgebaseArticles: RawArticle[]
  severityLevels: RawSeverityLevel[]
  companyId: string // Company _id is provided via props
  createdUserId: string
}

const AdministratorAddTaskCompanyProvided: React.FC<
  AdministratorAddTaskCompanyProvidedProps
> = ({
  open,
  onClose,
  onAdd,
  statuses,
  subStatuses,
  topics,
  schedulingQueues,
  knowledgebaseArticles,
  severityLevels,
  companyId,
  createdUserId,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ------------------ FORM STATE ------------------
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [selectedQueue, setSelectedQueue] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedSubStatus, setSelectedSubStatus] = useState('')
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')

  // ------------------ DROPDOWN OPTIONS ------------------
  const severityOptions = severityLevels.map(sl => ({
    value: String(sl.severityLevel),
    attribute1: sl._id,
  }))
  const statusOptions = statuses.map(s => ({
    value: s.status,
    attribute1: s._id,
  }))
  const subStatusOptions = subStatuses.map(s => ({
    value: s.subStatus,
    attribute1: s._id,
  }))
  const queueOptions = schedulingQueues.map(q => ({
    value: q.queueName,
    attribute1: q._id,
  }))

  // ------------------ SUBMIT HANDLER ------------------
  const handleSubmit = useCallback(() => {
    const newTaskData: Omit<Task, '_id'> = {
      title: taskTitle,
      description: taskDescription,
      topicIds: selectedTopicIds,
      articleIds: selectedArticleIds,
      severityId: selectedSeverity || '',
      schedulingQueueId: selectedQueue || '',
      statusId: selectedStatus || '',
      substatusId: selectedSubStatus || '',
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
      companyId: '', // will be set from provided companyId
      customerId: '',
    }

    newTaskData.companyId = companyId
    newTaskData.customerId = ''
    newTaskData.employeeIds = []

    onAdd(newTaskData)
  }, [
    taskTitle,
    taskDescription,
    selectedTopicIds,
    selectedArticleIds,
    selectedSeverity,
    selectedQueue,
    selectedStatus,
    selectedSubStatus,
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
          color: theme => theme.palette.grey[500],
          zIndex: theme => theme.zIndex.modal + 1,
          cursor: 'pointer',
          '&:hover': {
            color: theme => theme.palette.grey[700],
          },
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

          {/* No Company Dropdown – companyId is provided via props */}

          {/* Top row of fields */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 1,
            }}
          >
            {/* Left Column */}
            <Box
              sx={{
                flex: isMobile ? 'auto' : 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Dropdown
                label="Severity Level"
                options={severityOptions}
                value={
                  severityOptions.find(
                    opt => opt.attribute1 === selectedSeverity
                  )?.value || ''
                }
                onChange={e => {
                  const selectedValue = e.target.value
                  const option = severityOptions.find(
                    opt => opt.value === selectedValue
                  )
                  if (option) {
                    setSelectedSeverity(option.attribute1)
                  } else {
                    setSelectedSeverity('')
                  }
                }}
              />
              <Dropdown
                label="Status"
                options={statusOptions}
                value={
                  statusOptions.find(opt => opt.attribute1 === selectedStatus)
                    ?.value || ''
                }
                onChange={e => {
                  const selectedValue = e.target.value
                  const option = statusOptions.find(
                    opt => opt.value === selectedValue
                  )
                  if (option) {
                    setSelectedStatus(option.attribute1)
                  } else {
                    setSelectedStatus('')
                  }
                }}
              />
            </Box>

            {/* Right Column */}
            <Box
              sx={{
                flex: isMobile ? 'auto' : 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Dropdown
                label="Associated Product (Queue)"
                options={queueOptions}
                value={
                  queueOptions.find(opt => opt.attribute1 === selectedQueue)
                    ?.value || ''
                }
                onChange={e => {
                  const selectedValue = e.target.value
                  const option = queueOptions.find(
                    opt => opt.value === selectedValue
                  )
                  if (option) {
                    setSelectedQueue(option.attribute1)
                  } else {
                    setSelectedQueue('')
                  }
                }}
              />
              <Dropdown
                label="Substatus"
                options={subStatusOptions}
                value={
                  subStatusOptions.find(
                    opt => opt.attribute1 === selectedSubStatus
                  )?.value || ''
                }
                onChange={e => {
                  const selectedValue = e.target.value
                  const option = subStatusOptions.find(
                    opt => opt.value === selectedValue
                  )
                  if (option) {
                    setSelectedSubStatus(option.attribute1)
                  } else {
                    setSelectedSubStatus('')
                  }
                }}
              />
            </Box>
          </Box>

          {/* Topics multi-select – using raw topic IDs */}
          <MultiSelect
            label="Topics"
            options={topics.map(t => t._id)}
            defaultSelected={selectedTopicIds}
            onChange={setSelectedTopicIds}
          />

          {/* Knowledgebase Articles multi-select – using raw article IDs */}
          <MultiSelect
            label="Knowledgebase Articles"
            options={knowledgebaseArticles.map(a => a._id)}
            defaultSelected={selectedArticleIds}
            onChange={setSelectedArticleIds}
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

export default AdministratorAddTaskCompanyProvided
