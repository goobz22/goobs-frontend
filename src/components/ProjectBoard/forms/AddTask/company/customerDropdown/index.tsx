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
  RawCustomer,
} from '../../../../types'

interface CompanyAddTaskCustomerDropdownProps {
  open: boolean
  onClose: () => void
  onAdd: (newTask: Omit<Task, '_id'>) => void
  statuses: RawStatus[]
  subStatuses: RawSubStatus[]
  topics: RawTopic[]
  schedulingQueues: RawQueue[]
  knowledgebaseArticles: RawArticle[]
  severityLevels: RawSeverityLevel[]
  rawCustomers: RawCustomer[] // Customers passed as options
  createdUserId: string
}

const CompanyAddTaskCustomerDropdown: React.FC<
  CompanyAddTaskCustomerDropdownProps
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
  rawCustomers,
  createdUserId,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ------------------ FORM STATE ------------------
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [selectedQueue, setSelectedQueue] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedSubStatus, setSelectedSubStatus] = useState('')
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')

  // Debug logging for incoming props
  console.log('CompanyAddTaskCustomerDropdown - Props received:', {
    statusesCount: statuses?.length || 0,
    subStatusesCount: subStatuses?.length || 0,
    statusesData: statuses,
    topicsData: topics,
  })

  // ------------------ DROPDOWN OPTIONS ------------------
  // For Customer, display full name if available; otherwise use empty string
  const customerOptions = rawCustomers.map(c => ({
    value:
      c.firstName || c.lastName
        ? `${c.firstName || ''} ${c.lastName || ''}`.trim()
        : '',
    attribute1: c.email || '', // Now using email as attribute1
  }))

  const severityOptions = severityLevels.map(sl => ({
    value: String(sl.severityLevel),
    attribute1: sl.description || '',
  }))

  const statusOptions = statuses.map(s => ({
    value: s.status,
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
        attribute1: associatedStatus, // Use the status name as attribute1
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
            },
          ]
        : []

  console.log('Filtered substatus options:', finalSubStatusOptions)

  const queueOptions = schedulingQueues.map(q => ({
    value: q.queueName,
  }))

  // Effect to reset substatus when status changes
  React.useEffect(() => {
    // Clear the selected substatus when the status changes
    setSelectedSubStatus('')
  }, [selectedStatus])

  // ------------------ SUBMIT HANDLER ------------------
  const handleSubmit = useCallback(() => {
    // Find the IDs from the selected values
    const selectedStatusId =
      statuses.find(s => s.status === selectedStatus)?._id || ''
    const selectedSubStatusId =
      subStatuses.find(s => s.subStatus === selectedSubStatus)?._id || ''
    const selectedQueueId =
      schedulingQueues.find(q => q.queueName === selectedQueue)?._id || ''
    const selectedCustomerId =
      rawCustomers.find(c => c.email === selectedCustomer)?._id || ''

    console.log('Submitting task with mapped IDs:', {
      statusValue: selectedStatus,
      statusId: selectedStatusId,
      subStatusValue: selectedSubStatus,
      subStatusId: selectedSubStatusId,
      queueValue: selectedQueue,
      queueId: selectedQueueId,
      customerEmail: selectedCustomer,
      customerId: selectedCustomerId,
    })

    const newTaskData: Omit<Task, '_id'> = {
      title: taskTitle,
      description: taskDescription,
      topicIds: selectedTopicIds,
      articleIds: selectedArticleIds,
      severityId: selectedSeverity || '',
      schedulingQueueId: selectedQueueId, // Use ID from mapping
      statusId: selectedStatusId, // Use ID from mapping
      substatusId: selectedSubStatusId, // Use ID from mapping
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
      companyId: '', // Company variant: no company selection
      customerId: selectedCustomerId, // Use ID from mapping
    }

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
    selectedCustomer,
    createdUserId,
    onAdd,
    statuses,
    subStatuses,
    schedulingQueues,
    rawCustomers,
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

          {/* Customer Dropdown */}
          <SearchableDropdown
            label="Customer"
            options={customerOptions}
            defaultValue={
              customerOptions.find(opt => opt.attribute1 === selectedCustomer)
                ?.value
            }
            onChange={option => {
              setSelectedCustomer(option?.attribute1 || '')
            }}
            placeholder="Select a customer"
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
                    opt => opt.attribute1 === selectedSeverity
                  )?.value
                }
                onChange={option => {
                  setSelectedSeverity(option?.attribute1 || '')
                }}
                placeholder="Select severity level"
              />
              <SearchableDropdown
                label="Status"
                options={statusOptions}
                defaultValue={
                  statusOptions.find(opt => opt.value === selectedStatus)?.value
                }
                onChange={option => {
                  const newStatus = option?.value || ''
                  console.log('Status selected:', newStatus)

                  // Find the status ID for the selected status
                  const statusObj = statuses.find(s => s.status === newStatus)
                  console.log('Selected status object:', statusObj)

                  setSelectedStatus(newStatus)
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
                  queueOptions.find(opt => opt.value === selectedQueue)?.value
                }
                onChange={option => {
                  setSelectedQueue(option?.value || '')
                }}
                placeholder="Select product queue"
              />
              <SearchableDropdown
                label="Substatus"
                options={finalSubStatusOptions}
                defaultValue={
                  finalSubStatusOptions.find(
                    opt => opt.value === selectedSubStatus
                  )?.value
                }
                onChange={option => {
                  setSelectedSubStatus(option?.value || '')
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

            // Create mappings for topic names to IDs and back
            const topicNameToId: Record<string, string> = {}
            const topicIdToName: Record<string, string> = {}

            topics.forEach(t => {
              const displayName = t.topic || `Topic ${t._id}`
              topicNameToId[displayName] = t._id
              topicIdToName[t._id] = displayName
            })

            console.log('Topic mappings created:', {
              topicNameToId,
              topicIdToName,
            })

            // Create user-friendly display options for topics
            const topicOptions = topics.map(t => t.topic || `Topic ${t._id}`)

            // Translate selected IDs to names for display
            const selectedTopicNames = selectedTopicIds.map(
              id => topicIdToName[id] || id
            )

            return (
              <>
                {/* Topics multi-select – using topic names with ID mapping */}
                <MultiSelect
                  label="Topics"
                  options={topicOptions}
                  defaultSelected={selectedTopicNames}
                  onChange={selectedNames => {
                    console.log('Selected topic names:', selectedNames)

                    // Map the selected names back to IDs
                    const newSelectedIds = selectedNames.map(
                      name => topicNameToId[name] || name // Fallback to name if mapping not found
                    )
                    console.log('Mapped to topic IDs:', newSelectedIds)

                    setSelectedTopicIds(newSelectedIds)
                  }}
                />
              </>
            )
          }, [topics, selectedTopicIds])}

          {/* Knowledgebase Articles multi-select – using article titles now instead of IDs */}
          {React.useMemo(() => {
            // Create mappings for article titles to IDs and back
            const articleTitleToId: Record<string, string> = {}
            const articleIdToTitle: Record<string, string> = {}

            knowledgebaseArticles.forEach(a => {
              const title = a.articleTitle || `Article ${a._id}`
              articleTitleToId[title] = a._id
              articleIdToTitle[a._id] = title
            })

            // Create user-friendly display options for articles
            const articleOptions = knowledgebaseArticles.map(
              a => a.articleTitle || `Article ${a._id}`
            )

            // Translate selected IDs to titles for display
            const selectedArticleTitles = selectedArticleIds.map(
              id => articleIdToTitle[id] || id
            )

            return (
              <MultiSelect
                label="Knowledgebase Articles"
                options={articleOptions}
                defaultSelected={selectedArticleTitles}
                onChange={selectedTitles => {
                  // Map the selected titles back to IDs
                  const newSelectedIds = selectedTitles.map(
                    title => articleTitleToId[title] || title // Fallback to title if mapping not found
                  )

                  setSelectedArticleIds(newSelectedIds)
                }}
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

export default CompanyAddTaskCustomerDropdown
