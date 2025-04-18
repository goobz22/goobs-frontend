'use client'

import React, { useState, useCallback } from 'react'
import { Close } from '@mui/icons-material'
import { Dialog, IconButton, Box, useMediaQuery, useTheme } from '@mui/material'
import Typography from '../../../../../Typography'
import SearchableDropdown from '../../../../../Field/Dropdown/Searchable'
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
  RawCompany,
} from '../../../../types'

interface AdministratorAddTaskCompanyDropdownProps {
  open: boolean
  onClose: () => void
  onAdd: (newTask: Omit<Task, '_id'>) => void
  statuses: RawStatus[]
  subStatuses: RawSubStatus[]
  topics: RawTopic[]
  schedulingQueues: RawQueue[]
  knowledgebaseArticles: RawArticle[]
  severityLevels: RawSeverityLevel[]
  rawCompanies: RawCompany[]
  createdUserId: string
}

const AdministratorAddTaskCompanyDropdown: React.FC<
  AdministratorAddTaskCompanyDropdownProps
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
  rawCompanies,
  createdUserId,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ------------------ FORM STATE ------------------
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [selectedSeverityId, setSelectedSeverityId] = useState('')
  const [selectedQueue, setSelectedQueue] = useState('')
  const [selectedQueueId, setSelectedQueueId] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedStatusId, setSelectedStatusId] = useState('')
  const [selectedSubStatus, setSelectedSubStatus] = useState('')
  const [selectedSubStatusId, setSelectedSubStatusId] = useState('')
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')

  // Debug logging for incoming props
  console.log('AdministratorAddTaskCompanyDropdown - Props received:', {
    statusesCount: statuses?.length || 0,
    subStatusesCount: subStatuses?.length || 0,
    statusesData: statuses,
    topicsData: topics,
  })

  // ------------------ DROPDOWN OPTIONS ------------------
  const companyOptions = rawCompanies.map(c => ({
    value: c.companyName,
    attribute1: c._id,
  }))

  const severityOptions = severityLevels.map(sl => ({
    value: String(sl.severityLevel),
    attribute1: sl.description || '',
    attribute2: sl._id,
  }))

  const statusOptions = statuses.map(s => ({
    value: s.status,
    attribute1: s._id,
  }))

  // Filter substatuses based on the selected status
  const filteredSubStatusOptions = subStatuses
    .filter(s => {
      // If no status is selected, hide all substatuses
      if (!selectedStatus) return false

      // Get the ID of the selected status
      const selectedStatusId = statuses.find(
        status => status.status === selectedStatus
      )?._id
      console.log('Filtering substatuses by status:', {
        selectedStatus,
        selectedStatusId,
        substatus: s.subStatus,
        substatusStatusId: s.statusId,
        isMatch: s.statusId === selectedStatusId,
      })

      // Only include substatuses with the matching statusId
      return s.statusId === selectedStatusId
    })
    .map(s => {
      const associatedStatus =
        statuses.find(status => status._id === s.statusId)?.status || ''

      return {
        value: s.subStatus,
        attribute1: associatedStatus,
        attribute2: s._id,
      }
    })

  // Add a "no substatuses" option if none are available for the selected status
  const finalSubStatusOptions =
    filteredSubStatusOptions.length > 0
      ? filteredSubStatusOptions
      : selectedStatus
        ? [
            {
              value: 'No substatuses available for this status',
              attribute1: '',
              attribute2: '',
            },
          ]
        : []

  console.log('Filtered substatus options:', finalSubStatusOptions)

  const queueOptions = schedulingQueues.map(q => ({
    value: q.queueName,
    attribute1: q._id,
  }))

  // Effect to reset substatus when status changes
  React.useEffect(() => {
    // Clear the selected substatus when the status changes
    setSelectedSubStatus('')
    setSelectedSubStatusId('')
  }, [selectedStatus])

  // ------------------ SUBMIT HANDLER ------------------
  const handleSubmit = useCallback(() => {
    console.log('Submitting task with stored IDs:', {
      statusValue: selectedStatus,
      statusId: selectedStatusId,
      subStatusValue: selectedSubStatus,
      subStatusId: selectedSubStatusId,
      queueValue: selectedQueue,
      queueId: selectedQueueId,
      companyValue: selectedCompany,
      companyId: selectedCompanyId,
      severityValue: selectedSeverity,
      severityId: selectedSeverityId,
    })

    // Validate required fields before submission
    if (!selectedSeverityId) {
      console.error('Error: Severity Level is required')
      alert('Please select a Severity Level')
      return
    }

    if (!selectedStatusId) {
      console.error('Error: Status is required')
      alert('Please select a Status')
      return
    }

    if (!selectedSubStatusId) {
      console.error('Error: Substatus is required')
      alert('Please select a Substatus')
      return
    }

    const newTaskData: Omit<Task, '_id'> = {
      title: taskTitle,
      description: taskDescription,
      topicIds: selectedTopicIds,
      articleIds: selectedArticleIds,
      severityId: selectedSeverityId,
      schedulingQueueId: selectedQueueId,
      statusId: selectedStatusId,
      substatusId: selectedSubStatusId,
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
      companyId: selectedCompanyId,
      customerId: '',
    }

    onAdd(newTaskData)
  }, [
    taskTitle,
    taskDescription,
    selectedTopicIds,
    selectedArticleIds,
    selectedSeverityId,
    selectedQueueId,
    selectedStatusId,
    selectedSubStatusId,
    selectedCompanyId,
    selectedStatus,
    selectedSubStatus,
    selectedQueue,
    selectedCompany,
    selectedSeverity,
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

          {/* Company Dropdown */}
          <SearchableDropdown
            label="Company"
            options={companyOptions}
            defaultValue={
              companyOptions.find(opt => opt.value === selectedCompany)?.value
            }
            onChange={option => {
              setSelectedCompany(option?.value || '')
              setSelectedCompanyId(option?.attribute1 || '')
            }}
            placeholder="Select a company"
          />

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
              />
              <SearchableDropdown
                label="Status"
                options={statusOptions}
                defaultValue={
                  statusOptions.find(opt => opt.attribute1 === selectedStatusId)
                    ?.value
                }
                onChange={option => {
                  const newStatus = option?.value || ''
                  console.log('Status selected:', newStatus)

                  setSelectedStatus(newStatus)
                  setSelectedStatusId(option?.attribute1 || '')
                  console.log(
                    'Selected status ID from attribute1:',
                    option?.attribute1
                  )
                }}
                placeholder="Select status"
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
              />
              <SearchableDropdown
                label="Substatus"
                options={finalSubStatusOptions}
                defaultValue={
                  finalSubStatusOptions.find(
                    opt => opt.attribute2 === selectedSubStatusId
                  )?.value
                }
                onChange={option => {
                  setSelectedSubStatus(option?.value || '')
                  setSelectedSubStatusId(option?.attribute2 || '')
                  console.log('Selected substatus ID:', option?.attribute2)
                }}
                placeholder={
                  selectedStatus
                    ? 'Select substatus'
                    : 'Please select a status first'
                }
                disabled={!selectedStatus}
              />
            </Box>
          </Box>

          {/* Create a mapping from topic name to ID for lookup when submitting */}
          {/* Also create a reverse mapping from ID to name for displaying selected values */}
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
              <>
                {/* Topics multi-select – using complex options with IDs in attribute1 */}
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
                />
              </>
            )
          }, [topics, selectedTopicIds])}

          {/* Knowledgebase Articles multi-select – using article titles with IDs in attribute1 */}
          {React.useMemo(() => {
            // Create complex options with article IDs
            const articleOptions = knowledgebaseArticles.map(a => ({
              value: a.articleTitle || `Article ${a._id}`,
              attribute1: a._id, // Store ID in attribute1
            }))

            // Translate selected IDs to titles for display
            const selectedArticleValues = selectedArticleIds.map(id => {
              const article = knowledgebaseArticles.find(a => a._id === id)
              return article
                ? article.articleTitle || `Article ${article._id}`
                : id
            })

            return (
              <MultiSelect
                label="Knowledgebase Articles"
                options={articleOptions}
                defaultSelected={selectedArticleValues}
                onChange={selectedValues => {
                  // Map the selected values to IDs using attribute1
                  const newSelectedIds = selectedValues.map(value => {
                    const matchingArticle = articleOptions.find(
                      opt => opt.value === value
                    )
                    return matchingArticle?.attribute1 || value // Fall back to value if no match
                  })

                  setSelectedArticleIds(newSelectedIds)
                }}
                complexOptions={true} // Explicitly set to use complex options
              />
            )
          }, [knowledgebaseArticles, selectedArticleIds])}

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

export default AdministratorAddTaskCompanyDropdown
