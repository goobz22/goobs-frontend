'use client'

import React, { useState, useCallback, FormEvent } from 'react'
import { Box } from '@mui/material'
import Typography from '../../../../Typography'
import TextField from '../../../../TextField'
import ComplexTextEditor from '../../../../ComplexTextEditor'
import Dropdown from '../../../../Dropdown'
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
    attribute1: sl._id,
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
    <Box sx={{ p: 3 }}>
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

        <Dropdown
          label="Severity Level"
          options={severityOptions}
          onChange={event => {
            const selectedValue = event.target.value
            const option = severityOptions.find(
              opt => opt.value === selectedValue
            )
            if (option) {
              setSelectedSeverity(option.attribute1)
            } else {
              setSelectedSeverity('')
            }
          }}
          value={
            severityOptions.find(opt => opt.attribute1 === selectedSeverity)
              ?.value || ''
          }
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
