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
  sacredtheme?: boolean
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
  sacredtheme = false,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ------------------ FORM STATE ------------------
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
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
    attribute2: c._id, // Added _id as attribute2
  }))

  const severityOptions = severityLevels.map(sl => ({
    value: String(sl.severityLevel),
    attribute1: sl.description || '',
    attribute2: sl._id, // Added _id as attribute2
  }))

  const statusOptions = statuses.map(s => ({
    value: s.status,
    attribute1: s._id, // Added _id as attribute1
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
        attribute2: s._id, // Added _id as attribute2
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
              attribute2: '', // Added empty attribute2 to match structure
            },
          ]
        : []

  console.log('Filtered substatus options:', finalSubStatusOptions)

  const queueOptions = schedulingQueues.map(q => ({
    value: q.queueName,
    attribute1: q._id, // Added _id as attribute1
  }))

  // Effect to reset substatus when status changes
  React.useEffect(() => {
    // Clear the selected substatus when the status changes
    setSelectedSubStatus('')
    setSelectedSubStatusId('') // Also clear the ID when status changes
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
      customerName: selectedCustomer,
      customerId: selectedCustomerId,
      severityValue: selectedSeverity,
      severityId: selectedSeverityId,
    })

    // Validate required fields before submission
    if (!selectedCustomerId) {
      console.error('Error: Customer is required')
      alert('Please select a Customer')
      return
    }

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
      companyId: '', // Company variant: no company selection
      customerId: selectedCustomerId,
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
    selectedCustomerId,
    selectedStatus,
    selectedSubStatus,
    selectedQueue,
    selectedCustomer,
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
        sx: {
          width: isMobile ? '100%' : '700px',
          margin: isMobile ? '16px' : 'auto',
          pointerEvents: 'auto',
          ...(sacredtheme && {
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
      {sacredtheme && (
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
          color: sacredtheme
            ? egyptianStyles.goldColor
            : theme.palette.grey[500],
          zIndex: theme.zIndex.modal + 1,
          cursor: 'pointer',
          '&:hover': {
            color: sacredtheme
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
          ...(sacredtheme && {
            borderBottom: `2px solid ${alpha(egyptianStyles.goldColor, 0.3)}`,
            backgroundColor: alpha(egyptianStyles.goldColor, 0.05),
          }),
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            ...(sacredtheme && {
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
            sacredtheme={sacredtheme}
          />

          <ComplexTextEditor
            label="Task Description"
            value={taskDescription}
            onChange={setTaskDescription}
            editorType="simple"
            minRows={5}
            sacredtheme={sacredtheme}
          />

          {/* Customer Dropdown */}
          <SearchableDropdown
            label="Customer"
            options={customerOptions}
            defaultValue={
              customerOptions.find(opt => opt.attribute2 === selectedCustomerId)
                ?.value
            }
            onChange={option => {
              setSelectedCustomer(option?.value || '')
              setSelectedCustomerId(option?.attribute2 || '')
              console.log('Selected customer ID:', option?.attribute2)
            }}
            placeholder="Select a customer"
            sacredtheme={sacredtheme}
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
                sacredtheme={sacredtheme}
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
                sacredtheme={sacredtheme}
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
                sacredtheme={sacredtheme}
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
                sacredtheme={sacredtheme}
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
                  sacredtheme={sacredtheme}
                />
              </>
            )
          }, [topics, selectedTopicIds, sacredtheme])}

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
                sacredtheme={sacredtheme}
              />
            )
          }, [knowledgebaseArticles, selectedArticleIds, sacredtheme])}

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
              fontcolor={sacredtheme ? egyptianStyles.goldColor : 'black'}
              sacredtheme={sacredtheme}
            />
            <CustomButton
              text="Create Task"
              onClick={handleSubmit}
              backgroundcolor={sacredtheme ? egyptianStyles.goldColor : '#000'}
              fontcolor={sacredtheme ? '#000' : 'white'}
              sacredtheme={sacredtheme}
            />
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}

export default CompanyAddTaskCustomerDropdown
