'use client'

import React, { useState, useCallback } from 'react'
import Dialog from '../../../../Dialog'
import CloseIcon from '../../../../Icons/Close'
import Typography from '../../../../Typography'
import SearchableDropdown from '../../../../Field/Dropdown/Searchable'
import MultiSelect from '../../../../Field/Dropdown/MultiSelect'
import ComplexTextEditor from '../../../../ComplexTextEditor'
import CustomButton from '../../../../Button'
import TextField from '../../../../Field/Text'
import type { Task, RawTopic, RawQueue, RawSeverityLevel } from '../../../types'

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
  sacredtheme?: boolean
}

const getStyles = (sacredtheme?: boolean) => ({
  dialog: {
    width: '100%',
    '@media (min-width: 640px)': {
      width: '700px',
    },
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
})

const CustomerAddTask: React.FC<CustomerAddTaskProps> = ({
  open,
  onClose,
  onAdd,
  topics,
  schedulingQueues,
  severityLevels,
  companyId,
  createdUserId,
  sacredtheme = false,
}) => {
  const [selectedSeverityId, setSelectedSeverityId] = useState('')
  const [selectedQueueId, setSelectedQueueId] = useState('')
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [isCloseHovered, setCloseHovered] = useState(false)
  const styles = getStyles(sacredtheme)

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
      fullWidth
      maxWidth={false}
      className={sacredtheme ? 'sacred-dialog' : ''}
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
          <Typography fontvariant="merrih5" style={styles.title}>
            Create Task
          </Typography>

          <div style={styles.formContainer}>
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
            <div style={styles.row}>
              <div style={styles.col}>
                <SearchableDropdown
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
                  sacredtheme={sacredtheme}
                />
              </div>
              <div style={styles.col}>
                <SearchableDropdown
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
                  sacredtheme={sacredtheme}
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
                  complexOptions={true}
                  sacredtheme={sacredtheme}
                />
              )
            }, [topics, selectedTopicIds, sacredtheme])}

            <div style={styles.buttonContainer}>
              <CustomButton
                text="Cancel"
                onClick={onClose}
                backgroundcolor="none"
                fontcolor={sacredtheme ? '#FFD700' : 'black'}
                sacredtheme={sacredtheme}
              />
              <CustomButton
                text="Create Task"
                onClick={handleSubmit}
                backgroundcolor={sacredtheme ? '#FFD700' : '#000'}
                fontcolor={sacredtheme ? '#000' : 'white'}
                sacredtheme={sacredtheme}
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default CustomerAddTask
