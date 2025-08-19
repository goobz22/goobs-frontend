'use client'

import React, { useState, useCallback, FormEvent } from 'react'
import Typography from '../../../../Typography'
import TextField from '../../../../Field/Text'
import ComplexTextEditor from '../../../../ComplexTextEditor'
import SearchableSimple from '../../../../Field/Dropdown/SearchableSimple'
import CustomButton from '../../../../Button'
import type { RawSeverityLevel } from '../../../types'
import type { ProjectBoardStyles } from '../../../../../theme'

interface NoUserAddTaskProps {
  onAdd: (newTask: {
    title: string
    description: string
    email: string
    severityId: string
  }) => void
  severityLevels: RawSeverityLevel[]
  styles?: ProjectBoardStyles
}

const getStyles = (styles?: ProjectBoardStyles) => {
  const isSacredTheme = styles?.theme === 'sacred'
  const isDarkTheme = styles?.theme === 'dark'

  return {
    container: {
      padding: '0.75rem',
      position: 'relative',
      ...(isSacredTheme && {
        border: '2px solid rgba(255, 215, 0, 0.5)',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxShadow: '0 0 1rem rgba(255, 215, 0, 0.3)',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        animation: 'no-user-add-task-glow-pulse 2s infinite alternate',
      }),
      ...(isDarkTheme && {
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        border: '2px solid rgba(75, 85, 99, 0.5)',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      }),
    } as React.CSSProperties,
    glyph: {
      position: 'absolute',
      top: '0.75rem',
      fontSize: '1.125rem',
      color: isSacredTheme
        ? 'rgba(255, 215, 0, 0.3)'
        : isDarkTheme
          ? 'rgba(156, 163, 175, 0.3)'
          : 'rgba(107, 114, 128, 0.3)',
      zIndex: 10,
      animation: isSacredTheme
        ? 'no-user-add-task-float-glyph 5s infinite alternate'
        : 'none',
    } as React.CSSProperties,
    title: {
      marginBottom: '0.75rem',
      fontSize: '1.25rem',
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
    form: {
      display: 'flex',
      flexDirection: 'column',
    } as React.CSSProperties,
    fieldWrapper: {
      marginBottom: '16px',
    } as React.CSSProperties,
    severityWrapper: {
      marginBottom: '8px',
    } as React.CSSProperties,
  }
}

const NoUserAddTask: React.FC<NoUserAddTaskProps> = ({
  onAdd,
  severityLevels,
  styles,
}) => {
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [email, setEmail] = useState('')
  const [selectedSeverityId, setSelectedSeverityId] = useState('')
  const computedStyles = getStyles(styles)
  const isSacredTheme = styles?.theme === 'sacred'

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
    <div style={computedStyles.container}>
      {isSacredTheme && (
        <>
          <div style={{ ...computedStyles.glyph, left: '0.75rem' }}>𓁹</div>
          <div
            style={{
              ...computedStyles.glyph,
              right: '0.75rem',
              animationDirection: 'reverse',
            }}
          >
            𓂀
          </div>
        </>
      )}
      <Typography
        text="Create Task"
        styles={{
          theme: styles?.theme || 'light',
          variant: styles?.theme === 'sacred' ? 'cinzelh5' : 'merrih5',
          marginBottom: '0.75rem',
          color:
            styles?.theme === 'sacred'
              ? '#FFD700'
              : styles?.theme === 'dark'
                ? '#E5E7EB'
                : '#1F2937',
        }}
      />

      <form onSubmit={handleSubmit} style={computedStyles.form}>
        <div style={computedStyles.fieldWrapper}>
          <TextField
            label="Task Title"
            value={taskTitle}
            onChange={setTaskTitle}
            placeholder="Enter Task Title"
            styles={{ theme: styles?.theme || 'light' }}
          />
        </div>
        <div style={computedStyles.fieldWrapper}>
          <ComplexTextEditor
            label="Task Description"
            value={taskDescription}
            onChange={setTaskDescription}
            editorType="simple"
            minRows={5}
            styles={{ theme: styles?.theme || 'light' }}
          />
        </div>
        <div style={computedStyles.fieldWrapper}>
          <TextField
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            styles={{ theme: styles?.theme || 'light' }}
          />
        </div>
        <div style={computedStyles.severityWrapper}>
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
            styles={{ theme: styles?.theme || 'light' }}
          />
        </div>
        <CustomButton
          text="Create Task"
          onClick={() => handleSubmit()}
          styles={{ theme: styles?.theme || 'light' }}
        />
      </form>
    </div>
  )
}

export default NoUserAddTask
