// src\components\ProjectBoard\AddTask\client.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material'

// Custom components
import CustomButton from '../../Button'
import Dropdown, { DropdownOption } from '../../Dropdown'
import TextField from '../../TextField'
import ComplexTextEditor from '../../ComplexTextEditor'
import TransferList from '../../TransferList'

// Import the new generic "Task" type and the "AddTaskVariant" from your code
// Adjust import paths as needed
import type {
  Task,
  RawStatus,
  RawSubStatus,
  RawTopic,
  RawQueue,
  RawArticle,
  RawCustomer,
  RawEmployee,
  RawSeverityLevel,
} from '../index'

/**
 * We define 3 variants for AddTask:
 *   - "customer": Shows "Customer Account" + "Assigned Employee"
 *   - "company":  Shows "Company Account" + "Assigned Administrator"
 *   - "administrator": Hides those "Account" fields entirely
 */
export type AddTaskVariant = 'customer' | 'company' | 'administrator'

export interface AddTaskProps {
  open: boolean
  onClose: () => void
  /**
   * Called when the user clicks "Submit." We pass back an Omit<Task, '_id'>,
   * letting the parent create a new ID or store it in a DB.
   */
  onSubmit: (newTask: Omit<Task, '_id'>) => void

  /** If not provided, defaults to "customer." */
  variant?: AddTaskVariant

  // Data for dropdowns, transfer list, etc.
  statuses: RawStatus[]
  subStatuses: RawSubStatus[]
  topics: RawTopic[]
  schedulingQueues: RawQueue[]
  knowledgebaseArticles: RawArticle[] // not used here, but you can if desired
  customers: RawCustomer[]
  employees: RawEmployee[]
  severityLevels: RawSeverityLevel[]
}

const AddTask: React.FC<AddTaskProps> = ({
  open,
  onClose,
  onSubmit,
  variant = 'customer', // default
  statuses,
  subStatuses,
  topics,
  schedulingQueues,
  customers,
  employees,
  severityLevels,
}) => {
  // -------------------------------------------------------------------------
  // 1) Local state for fields
  // -------------------------------------------------------------------------
  const [selectedAccount, setSelectedAccount] = useState('') // for "customer" or "company" account
  const [selectedAdministrator, setSelectedAdministrator] = useState('') // for "company" only
  const [selectedEmployee, setSelectedEmployee] = useState('') // for "customer" only

  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [selectedQueue, setSelectedQueue] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedSubStatus, setSelectedSubStatus] = useState('')

  const [unassignedTopics, setUnassignedTopics] = useState<string[]>([])
  const [assignedTopics, setAssignedTopics] = useState<string[]>([])

  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')

  // -------------------------------------------------------------------------
  // 2) Initialize "topics" in the TransferList
  // -------------------------------------------------------------------------
  useEffect(() => {
    // If you want all topics initially unassigned:
    const allTopicValues = topics.map(t => t.topic)
    setUnassignedTopics(allTopicValues)
    setAssignedTopics([])
  }, [topics])

  // -------------------------------------------------------------------------
  // 3) Convert raw data to dropdown-friendly arrays
  // -------------------------------------------------------------------------
  const severityOptions: DropdownOption[] = severityLevels.map(sl => ({
    value: String(sl.severityLevel), // or sl._id if you prefer
  }))

  const statusOptions: DropdownOption[] = statuses.map(s => ({
    value: s.status,
  }))

  const subStatusOptions: DropdownOption[] = subStatuses.map(s => ({
    value: s.subStatus,
  }))

  const queueOptions: DropdownOption[] = schedulingQueues.map(q => ({
    value: q.queueName,
  }))

  const customerOptions: DropdownOption[] = customers.map(c => ({
    value: c._id || '',
    attribute1: [c.firstName, c.lastName].filter(Boolean).join(' '),
  }))

  const employeeOptions: DropdownOption[] = employees.map(e => ({
    value: e._id || '',
    attribute1: [e.firstName, e.lastName].filter(Boolean).join(' '),
  }))

  // If you have actual "company accounts," map them too. For now, we use placeholders:
  const companyAccountOptions: DropdownOption[] = [
    { value: 'AcmeInc' },
    { value: 'TechCorp' },
  ]

  // -------------------------------------------------------------------------
  // 4) TransferList Handler
  // -------------------------------------------------------------------------
  const handleTopicsChange = (left: string[], right: string[]) => {
    setUnassignedTopics(left)
    setAssignedTopics(right)
  }

  // -------------------------------------------------------------------------
  // 5) Handle "Submit"
  // -------------------------------------------------------------------------
  const handleSubmit = () => {
    // Build an Omit<Task, '_id'> to pass upward
    const newTaskData: Omit<Task, '_id'> = {
      // We store the final text from these fields
      title: taskTitle,
      description: taskDescription,

      // If you want to store the "account" or "employee" or "admin" IDs, do it here
      // e.g. if "selectedAccount" is a customer ID, store "customerId: selectedAccount"
      // but that depends on your real app logic.

      // We'll store "topics" as string => you might store actual IDs if you prefer
      topicIds: assignedTopics,
    }

    onSubmit(newTaskData)
  }

  // -------------------------------------------------------------------------
  // 6) Render
  // -------------------------------------------------------------------------
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Task</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            mb: 2,
          }}
        >
          {/* ============== For "customer" variant ============== */}
          {variant === 'customer' && (
            <>
              <Dropdown
                label="Customer Account"
                name="customerAccount"
                options={customerOptions}
                value={selectedAccount}
                onChange={e => setSelectedAccount(e.target.value as string)}
              />
              <Dropdown
                label="Assigned Employee"
                name="assignedEmployee"
                options={employeeOptions}
                value={selectedEmployee}
                onChange={e => setSelectedEmployee(e.target.value as string)}
              />
            </>
          )}

          {/* ============== For "company" variant ============== */}
          {variant === 'company' && (
            <>
              <Dropdown
                label="Company Account"
                name="companyAccount"
                options={companyAccountOptions}
                value={selectedAccount}
                onChange={e => setSelectedAccount(e.target.value as string)}
              />
              <Dropdown
                label="Assigned Administrator"
                name="assignedAdministrator"
                options={employeeOptions} // or a separate "administrators" array
                value={selectedAdministrator}
                onChange={e =>
                  setSelectedAdministrator(e.target.value as string)
                }
              />
            </>
          )}

          {/* ============== For "administrator" variant ============== */}
          {/* In "administrator," we do NOT show a "customer" or "company" field. */}
          {variant === 'administrator' && (
            // Placeholder. If you need any specialized fields, put them here or omit entirely.
            <></>
          )}

          {/* Now the next row: Severity, Queue, Status, Substatus (all variants can share) */}
          <Dropdown
            label="Severity Level"
            name="severityLevel"
            options={severityOptions}
            value={selectedSeverity}
            onChange={e => setSelectedSeverity(e.target.value as string)}
          />

          <Dropdown
            label="Associated Product (Queue)"
            name="associatedQueue"
            options={queueOptions}
            value={selectedQueue}
            onChange={e => setSelectedQueue(e.target.value as string)}
          />

          <Dropdown
            label="Status"
            name="status"
            options={statusOptions}
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value as string)}
          />

          <Dropdown
            label="Substatus"
            name="substatus"
            options={subStatusOptions}
            value={selectedSubStatus}
            onChange={e => setSelectedSubStatus(e.target.value as string)}
          />
        </Box>

        {/* TransferList for Topics */}
        <Box sx={{ mb: 2 }}>
          <TransferList
            leftItems={unassignedTopics}
            rightItems={assignedTopics}
            onChange={(left, right) => handleTopicsChange(left, right)}
            leftTitle="Unassigned Topics"
            rightTitle="Assigned Topics"
          />
        </Box>

        {/* The rest: Task Title, Task Description */}
        <TextField
          label="Task Title"
          value={taskTitle}
          onChange={e => setTaskTitle(e.target.value)}
        />

        <Box sx={{ mt: 2 }}>
          <ComplexTextEditor
            value={taskDescription}
            onChange={val => setTaskDescription(val)}
            label="Task Description"
            minRows={5}
            editorType="simple"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <CustomButton
          text="Cancel"
          backgroundcolor="none"
          fontcolor="black"
          onClick={onClose}
        />
        <CustomButton
          text="Submit"
          backgroundcolor="#1976d2"
          fontcolor="white"
          onClick={handleSubmit}
        />
      </DialogActions>
    </Dialog>
  )
}

export default AddTask
