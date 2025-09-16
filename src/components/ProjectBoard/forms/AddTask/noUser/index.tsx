'use client'

import React, { useState, useCallback, FormEvent } from 'react'
import Typography from '../../../../Typography'
import TextField from '../../../../Field/Text'
import ComplexTextEditor from '../../../../ComplexTextEditor'
import SearchableSimple from '../../../../Field/Dropdown/SearchableSimple'
import CustomButton from '../../../../Button'
import type { ProjectBoardStyles } from '../../../../../theme'

interface NoUserAddTaskProps {
  onAdd: (newTask: {
    fullName: string
    email: string
    phoneNumber: string
    title: string
    description: string
    category: string
  }) => void
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

const NoUserAddTask: React.FC<NoUserAddTaskProps> = ({ onAdd, styles }) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const computedStyles = getStyles(styles)
  const isSacredTheme = styles?.theme === 'sacred'

  const categoryOptions = [
    { value: 'Sales' },
    { value: 'Investing' },
    { value: 'General Questions' },
    { value: 'Service Issue' },
    { value: 'Billing' },
    { value: 'Want to Work With Us' },
  ]

  const handleSubmit = useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault()
      if (
        !fullName ||
        !email ||
        !taskTitle ||
        !taskDescription ||
        !selectedCategory
      ) {
        alert('Please fill out all required fields.')
        return
      }
      onAdd({
        fullName,
        email,
        phoneNumber,
        title: taskTitle,
        description: taskDescription,
        category: selectedCategory,
      })
    },
    [
      fullName,
      email,
      phoneNumber,
      taskTitle,
      taskDescription,
      selectedCategory,
      onAdd,
    ]
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
            label="Full Name *"
            value={fullName}
            onChange={setFullName}
            placeholder="Enter your full name"
            styles={{ theme: styles?.theme || 'light' }}
          />
        </div>
        <div style={computedStyles.fieldWrapper}>
          <TextField
            label="Email *"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            styles={{ theme: styles?.theme || 'light' }}
          />
        </div>
        <div style={computedStyles.fieldWrapper}>
          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder="Enter your phone number"
            styles={{ theme: styles?.theme || 'light' }}
          />
        </div>
        <div style={computedStyles.fieldWrapper}>
          <TextField
            label="Subject *"
            value={taskTitle}
            onChange={setTaskTitle}
            placeholder="Enter subject"
            styles={{ theme: styles?.theme || 'light' }}
          />
        </div>
        <div style={computedStyles.fieldWrapper}>
          <ComplexTextEditor
            label="Message *"
            value={taskDescription}
            onChange={setTaskDescription}
            editorType="simple"
            minRows={5}
            styles={{ theme: styles?.theme || 'light' }}
          />
        </div>
        <div style={computedStyles.severityWrapper}>
          <SearchableSimple
            label="Category *"
            options={categoryOptions}
            defaultValue={selectedCategory}
            onChange={option =>
              setSelectedCategory((option as { value: string })?.value || '')
            }
            placeholder="Select a category"
            styles={{ theme: styles?.theme || 'light' }}
          />
        </div>
        <CustomButton
          text="Submit Request"
          onClick={() => handleSubmit()}
          styles={{ theme: styles?.theme || 'light' }}
        />
      </form>
    </div>
  )
}

export default NoUserAddTask
