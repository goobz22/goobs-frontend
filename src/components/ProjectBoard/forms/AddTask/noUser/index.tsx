'use client'

import React, { useState, useCallback, FormEvent } from 'react'
import Typography from '../../../../Typography'
import TextField from '../../../../Field/Text'
import ComplexTextEditor from '../../../../ComplexTextEditor'
import SearchableSimple from '../../../../Field/Dropdown/SearchableSimple'
import CustomButton from '../../../../Button'
import type { RawSeverityLevel } from '../../../types'

interface NoUserAddTaskProps {
  onAdd: (newTask: {
    title: string
    description: string
    email: string
    severityId: string
  }) => void
  severityLevels: RawSeverityLevel[]
  sacredtheme?: boolean
}

const getStyles = (sacredtheme?: boolean) => ({
  container: {
    padding: '0.75rem',
    position: 'relative',
    ...(sacredtheme && {
      border: '2px solid rgba(255, 215, 0, 0.5)',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 0 1rem rgba(255, 215, 0, 0.3)',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      animation: 'no-user-add-task-glow-pulse 2s infinite alternate',
    }),
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    top: '0.75rem',
    fontSize: '1.125rem',
    color: 'rgba(255, 215, 0, 0.3)',
    zIndex: 10,
    animation: 'no-user-add-task-float-glyph 5s infinite alternate',
  } as React.CSSProperties,
  title: {
    marginBottom: '0.75rem',
    fontSize: '1.25rem',
    ...(sacredtheme && {
      fontFamily: 'Cinzel, serif',
      letterSpacing: '0.05em',
      textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
      color: '#FFD700',
    }),
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  } as React.CSSProperties,
})

const NoUserAddTask: React.FC<NoUserAddTaskProps> = ({
  onAdd,
  severityLevels,
  sacredtheme = false,
}) => {
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [email, setEmail] = useState('')
  const [selectedSeverityId, setSelectedSeverityId] = useState('')
  const styles = getStyles(sacredtheme)

  const severityOptions = severityLevels.map((sl: RawSeverityLevel) => ({
    value: String(sl.severityLevel),
    attribute1: sl.description || '',
    attribute2: sl._id,
  }))

  const handleSubmit = useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault()
      if (!taskTitle || !taskDescription || !email || !selectedSeverityId) {
        alert('Please fill out all fields.')
        return
      }
      onAdd({
        title: taskTitle,
        description: taskDescription,
        email,
        severityId: selectedSeverityId,
      })
    },
    [taskTitle, taskDescription, email, selectedSeverityId, onAdd]
  )

  return (
    <div style={styles.container}>
      {sacredtheme && (
        <>
          <div style={{ ...styles.glyph, left: '0.75rem' }}>𓁹</div>
          <div
            style={{
              ...styles.glyph,
              right: '0.75rem',
              animationDirection: 'reverse',
            }}
          >
            𓂀
          </div>
        </>
      )}
      <Typography {...(sacredtheme ? { styles: { color: '#FFD700' } } : {})}>
        Create Task
      </Typography>

      <form onSubmit={handleSubmit} style={styles.form}>
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
        <TextField
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="Enter your email"
          styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
        />
        <SearchableSimple
          label="Severity Level"
          options={severityOptions}
          defaultValue={
            severityOptions.find(opt => opt.attribute2 === selectedSeverityId)
              ?.value || ''
          }
          onChange={option =>
            setSelectedSeverityId(
              (option as { attribute2: string })?.attribute2 || ''
            )
          }
          placeholder="Select severity level"
          styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
        />
        <CustomButton
          text="Create Task"
          onClick={() => handleSubmit()}
          styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
        />
      </form>
    </div>
  )
}

export default NoUserAddTask
