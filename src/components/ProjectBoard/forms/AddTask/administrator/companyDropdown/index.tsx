'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Dialog from '../../../../../Dialog'
import CloseIcon from '../../../../../Icons/Close'
import Typography from '../../../../../Typography'
import SearchableSimple, {
  DropdownOption,
} from '../../../../../Field/Dropdown/SearchableSimple'
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

const SACRED_GLYPHS = ['𓁹', '𓂀', '𓊖', '𓊹']

// Hook to detect screen size for responsive form layout
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  )

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 640) {
        setScreenSize('mobile')
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    // Check on mount
    checkScreenSize()

    // Add event listener
    window.addEventListener('resize', checkScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return screenSize
}

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
  sacredtheme?: boolean
}

const getStyles = (
  sacredtheme?: boolean,
  screenSize?: 'mobile' | 'tablet' | 'desktop'
) => ({
  dialog: {
    width: '100%',
    '@media (min-width: 640px)': { width: '700px' },
    margin: '1rem auto',
    pointerEvents: 'auto',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    ...(sacredtheme && {
      border: '2px solid rgba(255, 215, 0, 0.5)',
      boxShadow: '0 0 1.5rem rgba(255, 215, 0, 0.3)',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      animation: 'add-task-glow-pulse 2s infinite alternate',
    }),
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    top: '0.75rem',
    fontSize: '1.125rem',
    color: 'rgba(255, 215, 0, 0.3)',
    zIndex: 10,
    animation: 'add-task-float-glyph 5s infinite alternate',
  } as React.CSSProperties,
  closeButton: {
    position: 'absolute',
    right: '0.5rem',
    top: '0.5rem',
    zIndex: 20,
    padding: '0.25rem',
    borderRadius: '9999px',
    color: sacredtheme ? '#FFD700' : '#6B7280',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,
  closeButtonHover: {
    color: sacredtheme ? '#FBBF24' : '#1F2937',
  } as React.CSSProperties,
  header: {
    padding: '0.75rem',
    ...(sacredtheme && {
      borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
      backgroundColor: 'rgba(255, 215, 0, 0.05)',
    }),
  } as React.CSSProperties,
  title: {
    marginBottom: '0.75rem',
    ...(sacredtheme && {
      fontFamily: 'Cinzel, serif',
      letterSpacing: '0.05em',
      textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
      color: '#FFD700',
    }),
  } as React.CSSProperties,
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  } as React.CSSProperties,
  // Full width items span all columns
  fullWidth: {
    width: '100%',
  } as React.CSSProperties,
  // Dropdown row container - responsive grid
  dropdownRow: {
    display: 'grid',
    gridTemplateColumns:
      screenSize === 'mobile'
        ? '1fr'
        : screenSize === 'tablet'
          ? 'repeat(2, 1fr)'
          : 'repeat(3, 1fr)', // desktop gets 3 columns
    gap: '1rem',
    width: '100%',
    alignItems: 'start', // Ensure fields align properly
  } as React.CSSProperties,
  // Individual field wrapper for responsive layout
  fieldWrapper: {
    width: '100%',
  } as React.CSSProperties,
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1.5rem',
    flexDirection: screenSize === 'mobile' ? 'column' : 'row',
  } as React.CSSProperties,
})

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
  sacredtheme = false,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [selectedSeverityId, setSelectedSeverityId] = useState('')
  const [selectedQueueId, setSelectedQueueId] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedStatusId, setSelectedStatusId] = useState('')
  const [selectedSubStatusId, setSelectedSubStatusId] = useState('')
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [isCloseHovered, setCloseHovered] = useState(false)
  const screenSize = useScreenSize()
  const styles = getStyles(sacredtheme, screenSize)

  const companyOptions = rawCompanies.map(c => ({
    value: c.companyName,
    attribute1: c._id,
  }))
  const severityOptions: DropdownOption[] = severityLevels.map(sl => ({
    value: String(sl.severityLevel),
    attribute1: sl.description || '',
    attribute2: sl._id,
  }))
  const statusOptions: DropdownOption[] = statuses.map(s => ({
    value: s.status,
    attribute1: s._id,
  }))
  const filteredSubStatusOptions = subStatuses
    .filter(s => {
      if (!selectedStatus) return false
      const selectedStatusId = statuses.find(
        status => status.status === selectedStatus
      )?._id
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
  const finalSubStatusOptions: DropdownOption[] =
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
  const queueOptions: DropdownOption[] = schedulingQueues.map(q => ({
    value: q.queueName,
    attribute1: q._id,
  }))

  React.useEffect(() => {
    setSelectedSubStatusId('')
  }, [selectedStatus])

  const handleSubmit = useCallback(() => {
    if (!selectedSeverityId || !selectedStatusId || !selectedSubStatusId) {
      alert('Please fill out all required fields.')
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
      editHistory: [],
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
    createdUserId,
    onAdd,
  ])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
    >
      <div style={styles.dialog}>
        {sacredtheme && (
          <>
            <div style={{ ...styles.glyph, left: '0.75rem' }}>
              {SACRED_GLYPHS[0]}
            </div>
            <div
              style={{
                ...styles.glyph,
                right: '3rem',
                animationDirection: 'reverse',
              }}
            >
              {SACRED_GLYPHS[1]}
            </div>
          </>
        )}
        <button
          onClick={onClose}
          style={{
            ...styles.closeButton,
            ...(isCloseHovered && styles.closeButtonHover),
          }}
          onMouseEnter={() => setCloseHovered(true)}
          onMouseLeave={() => setCloseHovered(false)}
        >
          <CloseIcon style={{ height: '1.5rem', width: '1.5rem' }} />
        </button>

        <div style={styles.header}>
          <Typography
            variant="merrih5"
            styles={{ color: sacredtheme ? '#FFD700' : undefined }}
          >
            Create Task
          </Typography>

          <div style={styles.formContainer}>
            <TextField
              label="Task Title"
              value={taskTitle}
              onChange={setTaskTitle}
              placeholder="Enter Task Title"
              styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
            />
            <ComplexTextEditor
              label="Task Description"
              value={taskDescription}
              onChange={setTaskDescription}
              editorType="simple"
              minRows={5}
              styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
            />
            <SearchableSimple
              label="Company"
              options={companyOptions}
              defaultValue={
                companyOptions.find(opt => opt.attribute1 === selectedCompanyId)
                  ?.value
              }
              onChange={option =>
                setSelectedCompanyId(option?.attribute1 || '')
              }
              placeholder="Select a company"
              styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
            />

            {/* Single responsive grid for all dropdown fields */}
            <div style={styles.dropdownRow}>
              <div style={styles.fieldWrapper}>
                <SearchableSimple
                  label="Severity Level"
                  options={severityOptions}
                  defaultValue={
                    severityOptions.find(
                      opt => opt.attribute2 === selectedSeverityId
                    )?.value
                  }
                  onChange={option =>
                    setSelectedSeverityId(option?.attribute2 || '')
                  }
                  placeholder="Select severity level"
                  styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
                />
              </div>
              <div style={styles.fieldWrapper}>
                <SearchableSimple
                  label="Associated Product (Queue)"
                  options={queueOptions}
                  defaultValue={
                    queueOptions.find(opt => opt.attribute1 === selectedQueueId)
                      ?.value
                  }
                  onChange={option =>
                    setSelectedQueueId(option?.attribute1 || '')
                  }
                  placeholder="Select product queue"
                  styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
                />
              </div>
              <div style={styles.fieldWrapper}>
                <SearchableSimple
                  label="Status"
                  options={statusOptions}
                  defaultValue={
                    statusOptions.find(
                      opt => opt.attribute1 === selectedStatusId
                    )?.value
                  }
                  onChange={option => {
                    const newStatus = option?.value || ''
                    setSelectedStatus(newStatus)
                    setSelectedStatusId(option?.attribute1 || '')
                  }}
                  placeholder="Select status"
                  styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
                />
              </div>
              <div style={styles.fieldWrapper}>
                <SearchableSimple
                  label="Substatus"
                  options={finalSubStatusOptions}
                  defaultValue={
                    finalSubStatusOptions.find(
                      opt => opt.attribute2 === selectedSubStatusId
                    )?.value
                  }
                  onChange={option =>
                    setSelectedSubStatusId(option?.attribute2 || '')
                  }
                  placeholder={
                    selectedStatus
                      ? 'Select substatus'
                      : 'Please select a status first'
                  }
                  styles={{
                    theme: sacredtheme ? 'sacred' : 'light',
                    disabled: !selectedStatus,
                  }}
                />
              </div>
              <div style={styles.fieldWrapper}>
                {React.useMemo(() => {
                  const topicOptions = topics.map(t => ({
                    value: t.topic || `Topic ${t._id}`,
                    attribute1: t._id,
                  }))
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
                        const newSelectedIds = selectedValues.map(value => {
                          const matchingTopic = topicOptions.find(
                            opt => opt.value === value
                          )
                          return matchingTopic?.attribute1 || value
                        })
                        setSelectedTopicIds(newSelectedIds)
                      }}
                      styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
                    />
                  )
                }, [topics, selectedTopicIds, sacredtheme])}
              </div>
              <div style={styles.fieldWrapper}>
                {React.useMemo(() => {
                  const articleOptions = knowledgebaseArticles.map(a => ({
                    value: a.articleTitle || `Article ${a._id}`,
                    attribute1: a._id,
                  }))
                  const selectedArticleValues = selectedArticleIds.map(id => {
                    const article = knowledgebaseArticles.find(
                      a => a._id === id
                    )
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
                        const newSelectedIds = selectedValues.map(value => {
                          const matchingArticle = articleOptions.find(
                            opt => opt.value === value
                          )
                          return matchingArticle?.attribute1 || value
                        })
                        setSelectedArticleIds(newSelectedIds)
                      }}
                      styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
                    />
                  )
                }, [knowledgebaseArticles, selectedArticleIds, sacredtheme])}
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <CustomButton
                text="Cancel"
                onClick={onClose}
                styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
              />
              <CustomButton
                text="Create Task"
                onClick={handleSubmit}
                styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default AdministratorAddTaskCompanyDropdown
