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
  const [selectedSeverityId, setSelectedSeverityId] = useState('')

  // ------------------ DROPDOWN OPTIONS ------------------
  // Format: { value, attribute1, attribute2 } where attribute1 is the description and attribute2 is the ID.
  const severityOptions = severityLevels.map(sl => ({
    value: String(sl.severityLevel),
    attribute1: sl.description || '',
    attribute2: sl._id, // Added _id as attribute2
  }))

  // ------------------ SUBMIT HANDLER ------------------
  const handleSubmit = useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault()

      // Validate required fields before submission
      if (!taskTitle) {
        console.error('Error: Task Title is required')
        alert('Please enter a Task Title')
        return
      }

      if (!taskDescription) {
        console.error('Error: Task Description is required')
        alert('Please enter a Task Description')
        return
      }

      if (!email) {
        console.error('Error: Email is required')
        alert('Please enter your Email')
        return
      }

      if (!selectedSeverityId) {
        console.error('Error: Severity Level is required')
        alert('Please select a Severity Level')
        return
      }

      console.log('Submitting task with:', {
        title: taskTitle,
        description: taskDescription,
        email,
        severityValue: selectedSeverity,
        severityId: selectedSeverityId,
      })

      onAdd({
        title: taskTitle,
        description: taskDescription,
        email,
        severityId: selectedSeverityId || '',
      })
    },
    [
      taskTitle,
      taskDescription,
      email,
      selectedSeverityId,
      selectedSeverity,
      onAdd,
    ]
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
            severityOptions.find(opt => opt.attribute2 === selectedSeverityId)
              ?.value
          }
          onChange={option => {
            // Store the severity level as display value and the ID properly
            setSelectedSeverity(option?.value || '')
            setSelectedSeverityId(option?.attribute2 || '')
            console.log('Selected severity ID:', option?.attribute2)
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
