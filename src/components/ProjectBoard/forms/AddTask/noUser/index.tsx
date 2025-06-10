'use client'

import React, { useState, useCallback, FormEvent } from 'react'
import { Box, alpha, keyframes } from '@mui/material'
import Typography from '../../../../Typography'
import TextField from '../../../../Field/Text'
import ComplexTextEditor from '../../../../ComplexTextEditor'
import SearchableDropdown from '../../../../Field/Dropdown/Searchable'
import CustomButton from '../../../../Button'

import type { RawSeverityLevel } from '../../../types'

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

interface NoUserAddTaskProps {
  onAdd: (newTask: {
    title: string
    description: string
    email: string
    severityId: string
  }) => void
  severityLevels: RawSeverityLevel[]
  sacredTheme?: boolean
}

const NoUserAddTask: React.FC<NoUserAddTaskProps> = ({
  onAdd,
  severityLevels,
  sacredTheme = false,
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
    <Box
      sx={{
        p: 3,
        position: 'relative',
        ...(sacredTheme && {
          border: `2px solid ${alpha(egyptianStyles.goldColor, 0.5)}`,
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: `0 0 30px ${alpha(egyptianStyles.goldColor, 0.3)}`,
          backgroundColor: egyptianStyles.cardBackground,
          animation: `${glowPulse} 3s ease-in-out infinite`,
        }),
      }}
    >
      {sacredTheme && (
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
            𓁹
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: alpha(egyptianStyles.goldColor, 0.3),
              fontSize: '18px',
              animation: `${floatGlyph} 4s ease-in-out infinite reverse`,
              zIndex: 1,
            }}
          >
            𓂀
          </Box>
        </>
      )}
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          ...(sacredTheme && {
            fontFamily: '"Cinzel", serif',
            letterSpacing: '0.05em',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
            color: egyptianStyles.goldColor,
          }),
        }}
      >
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
          sacredTheme={sacredTheme}
        />

        <ComplexTextEditor
          label="Task Description"
          value={taskDescription}
          onChange={setTaskDescription}
          editorType="simple"
          minRows={5}
          sacredTheme={sacredTheme}
        />

        <TextField
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          sacredTheme={sacredTheme}
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
          sacredTheme={sacredTheme}
        />

        <CustomButton
          text="Create Task"
          onClick={() => handleSubmit()}
          backgroundcolor={sacredTheme ? egyptianStyles.goldColor : '#000'}
          fontcolor={sacredTheme ? '#000' : 'white'}
          sacredTheme={sacredTheme}
        />
      </Box>
    </Box>
  )
}

export default NoUserAddTask
