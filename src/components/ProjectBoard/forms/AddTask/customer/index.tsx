'use client'

import React, { useState, useCallback } from 'react'
import Dialog from '../../../../Dialog'
import CloseIcon from '../../../../Icons/Close'
import Typography from '../../../../Typography'
import SearchableSimple from '../../../../Field/Dropdown/SearchableSimple'
import MultiSelect from '../../../../Field/Dropdown/MultiSelect'
import ComplexTextEditor from '../../../../ComplexTextEditor'
import CustomButton from '../../../../Button'
import TextField from '../../../../Field/Text'
import type { Task, RawTopic, RawQueue, RawSeverityLevel } from '../../../types'
import { ProjectBoardStyles } from '../../../../../theme'

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
  styles?: ProjectBoardStyles
}

const getStyles = (styles?: ProjectBoardStyles) => {
  const isSacredTheme = styles?.theme === 'sacred'
  const isDarkTheme = styles?.theme === 'dark'

  return {
    dialog: {
      width: '100%',
      '@media (min-width: 640px)': {
        width: '700px',
      },
      margin: '1rem auto',
      pointerEvents: 'auto',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      ...(isSacredTheme && {
        border: '2px solid rgba(255, 215, 0, 0.5)',
        boxShadow: '0 0 1.5rem rgba(255, 215, 0, 0.3)',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        animation: 'add-task-glow-pulse 2s infinite alternate',
      }),
      ...(isDarkTheme && {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        border: '2px solid rgba(75, 85, 99, 0.5)',
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
      color: isSacredTheme ? '#FFD700' : isDarkTheme ? '#E5E7EB' : '#6B7280',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    } as React.CSSProperties,
    closeButtonHover: {
      color: isSacredTheme ? '#FBBF24' : isDarkTheme ? '#F9FAFB' : '#1F2937',
    } as React.CSSProperties,
    header: {
      padding: '0.75rem',
      ...(isSacredTheme && {
        borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
        backgroundColor: 'rgba(255, 215, 0, 0.05)',
      }),
      ...(isDarkTheme && {
        borderBottom: '2px solid rgba(75, 85, 99, 0.3)',
        backgroundColor: 'rgba(75, 85, 99, 0.05)',
      }),
    } as React.CSSProperties,
    title: {
      marginBottom: '0.75rem',
      ...(isSacredTheme && {
        fontFamily: 'Cinzel, serif',
        letterSpacing: '0.05em',
        textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
        color: '#FFD700',
      }),
      ...(isDarkTheme && {
        color: '#E5E7EB',
      }),
    } as React.CSSProperties,
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    } as React.CSSProperties,
    row: {
      display: 'flex',
      flexDirection: 'column',
      '@media (min-width: 640px)': {
        flexDirection: 'row',
      },
      gap: '0.25rem',
    } as React.CSSProperties,
    col: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    } as React.CSSProperties,
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.5rem',
      marginTop: '0.5rem',
      flexDirection: 'column',
      '@media (min-width: 640px)': {
        flexDirection: 'row',
      },
    } as React.CSSProperties,
  }
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
  styles,
}) => {
  const [selectedSeverityId, setSelectedSeverityId] = useState('')
  const [selectedQueueId, setSelectedQueueId] = useState('')
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [isCloseHovered, setCloseHovered] = useState(false)
  const computedStyles = getStyles(styles)
  const isSacredTheme = styles?.theme === 'sacred'

  const severityOptions = severityLevels.map(sl => ({
    value: String(sl.severityLevel),
    attribute1: sl.description || '',
    attribute2: sl._id,
  }))

  const queueOptions = schedulingQueues.map(q => ({
    value: q.queueName,
    attribute1: q._id,
  }))

  const handleSubmit = useCallback(() => {
    if (!selectedSeverityId || !taskTitle || !taskDescription) {
      alert('Please fill out all required fields.')
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
      editHistory: [],
    }
    onAdd(newTaskData)
  }, [
    taskTitle,
    taskDescription,
    selectedTopicIds,
    selectedSeverityId,
    selectedQueueId,
    companyId,
    createdUserId,
    onAdd,
  ])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
    >
      <div style={computedStyles.dialog}>
        {isSacredTheme && (
          <>
            <div style={{ ...computedStyles.glyph, left: '0.75rem' }}>
              {SACRED_GLYPHS[0]}
            </div>
            <div
              style={{
                ...computedStyles.glyph,
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
            ...computedStyles.closeButton,
            ...(isCloseHovered && computedStyles.closeButtonHover),
          }}
          onMouseEnter={() => setCloseHovered(true)}
          onMouseLeave={() => setCloseHovered(false)}
        >
          <CloseIcon style={{ height: '1.5rem', width: '1.5rem' }} />
        </button>

        <div style={computedStyles.header}>
          <Typography
            variant="merrih5"
            styles={{ color: isSacredTheme ? '#FFD700' : undefined }}
          >
            Create Task
          </Typography>

          <div style={computedStyles.formContainer}>
            <TextField
              label="Task Title"
              value={taskTitle}
              onChange={setTaskTitle}
              placeholder="Enter Task Title"
              styles={{ theme: styles?.theme }}
            />
            <ComplexTextEditor
              label="Task Description"
              value={taskDescription}
              onChange={setTaskDescription}
              editorType="simple"
              minRows={5}
              styles={{ theme: styles?.theme }}
            />
            <div style={computedStyles.row}>
              <div style={computedStyles.col}>
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
                  styles={{ theme: styles?.theme }}
                />
              </div>
              <div style={computedStyles.col}>
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
                  styles={{ theme: styles?.theme }}
                />
              </div>
            </div>
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
                  styles={{ theme: styles?.theme }}
                />
              )
            }, [topics, selectedTopicIds, styles?.theme])}

            <div style={computedStyles.buttonContainer}>
              <CustomButton
                text="Cancel"
                onClick={onClose}
                styles={{ theme: styles?.theme }}
              />
              <CustomButton
                text="Create Task"
                onClick={handleSubmit}
                styles={{ theme: styles?.theme }}
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default CustomerAddTask
