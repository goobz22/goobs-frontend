'use client'

import React, { useState, useCallback, FormEvent } from 'react'
import { Box } from '@mui/material'
import Typography from '../../../../Typography'
import TextField from '../../../../Field/Text'
import ComplexTextEditor from '../../../../ComplexTextEditor'
import SearchableDropdown from '../../../../Field/Dropdown/Searchable'
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
}

const NoUserAddTask: React.FC<NoUserAddTaskProps> = ({
  onAdd,
  severityLevels,
}) => {
  // ------------------ FORM STATE ------------------
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [email, setEmail] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('')

  // ------------------ DROPDOWN OPTIONS ------------------
  // Format: { value, attribute1 } where attribute1 is the original _id.
  const severityOptions = severityLevels.map(sl => ({
    value: String(sl.severityLevel),
    attribute1: sl.description || '',
  }))

  // ------------------ SUBMIT HANDLER ------------------
  const handleSubmit = useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault()
      onAdd({
        title: taskTitle,
        description: taskDescription,
        email,
        severityId: selectedSeverity || '',
      })
    },
    [taskTitle, taskDescription, email, selectedSeverity, onAdd]
  )

  // ------------------ RENDER ------------------
  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Create Task
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
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

        <TextField
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <SearchableDropdown
          label="Severity Level"
          options={severityOptions}
          defaultValue={
            severityOptions.find(opt => opt.attribute1 === selectedSeverity)
              ?.value
          }
          onChange={option => {
            setSelectedSeverity(option?.attribute1 || '')
          }}
          placeholder="Select severity level"
        />

        <CustomButton
          text="Create Task"
          onClick={() => handleSubmit()}
          backgroundcolor="#000000"
          fontcolor="white"
        />
      </Box>
    </Box>
  )
}

export default NoUserAddTask
