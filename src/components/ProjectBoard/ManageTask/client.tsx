// src\components\ProjectBoard\ManageTask\client.tsx
'use client'

import React, { useMemo, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material'

import Dropdown from '../../Dropdown'
import TextField from '../../TextField'
import DateField from '../../DateField'
import TransferList, { TransferListDropdownDataMap } from '../../TransferList'
import CustomButton from '../../Button'

// Example raw data types (replace with your real data):
import type {
  RawSeverityLevel,
  RawStatus,
  RawSubStatus,
  RawTopic,
  RawQueue,
  RawArticle,
  RawEmployee,
} from '../index'

// If you have real company or admin types, adapt them:
interface CompanyAccount {
  _id: string
  companyName: string
}
interface Administrator {
  _id: string
  fullName: string
}

/**
 * Our 3 variants:
 *  - "company"
 *  - "customer"
 *  - "administrator"
 */
export type ManageTaskVariant = 'company' | 'customer' | 'administrator'

export interface ManageTaskProps {
  open: boolean
  onClose: () => void
  variant: ManageTaskVariant

  // For "company" variant
  companyAccounts?: CompanyAccount[]
  administrators?: Administrator[]

  // For "customer" variant => assignedEmployee
  employees?: RawEmployee[]

  // Common data
  statuses: RawStatus[]
  subStatuses: RawSubStatus[]
  schedulingQueues: RawQueue[]
  severityLevels: RawSeverityLevel[]

  // Topics & Articles for the TransferList in "company" or "administrator"
  topics?: RawTopic[]
  knowledgebaseArticles?: RawArticle[]

  // Pre-filled fields
  defaultTaskTitle?: string
  defaultTaskDescription?: string
  defaultNextActionDate?: Date | null

  /** Called on "Save." We pass back form fields + TransferList data. */
  onSubmit?: (data: {
    taskTitle: string
    taskDescription: string
    nextActionDate: Date | null
    transferListData?: TransferListDropdownDataMap
  }) => void
}

const ManageTask: React.FC<ManageTaskProps> = ({
  open,
  onClose,
  variant,

  companyAccounts = [],
  administrators = [],
  employees = [],

  statuses,
  subStatuses,
  schedulingQueues,
  severityLevels,

  topics = [],
  knowledgebaseArticles = [],

  defaultTaskTitle = '',
  defaultTaskDescription = '',
  defaultNextActionDate = null,

  onSubmit,
}) => {
  // -------------------------------------------------------------------------
  // Local state for each dropdown input
  // -------------------------------------------------------------------------
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedAdministrator, setSelectedAdministrator] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [selectedQueue, setSelectedQueue] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedSubStatus, setSelectedSubStatus] = useState('')

  // Basic text fields:
  const [taskTitle, setTaskTitle] = useState(defaultTaskTitle)
  const [taskDescription, setTaskDescription] = useState(defaultTaskDescription)
  const [nextActionDate, setNextActionDate] = useState<Date | null>(
    defaultNextActionDate
  )

  // -------------------------------------------------------------------------
  // TransferList only if variant="company" or "administrator"
  // -------------------------------------------------------------------------
  const articleTitles = useMemo(
    () => knowledgebaseArticles.map(a => a.articleTitle || `Article#${a._id}`),
    [knowledgebaseArticles]
  )
  const topicTitles = useMemo(
    () => topics.map(t => t.topic || `Topic#${t._id}`),
    [topics]
  )

  // We'll create a data map with "knowledgebase" & "topics" categories
  const [transferListDataMap, setTransferListDataMap] =
    useState<TransferListDropdownDataMap>({
      knowledgebase: {
        leftItems: articleTitles,
        rightItems: [],
      },
      topics: {
        leftItems: topicTitles,
        rightItems: [],
      },
    })

  // The dropdown options for switching categories in the TransferList
  const multiSelectOptions = useMemo(
    () => [{ value: 'knowledgebase' }, { value: 'topics' }],
    []
  )

  const handleTransferListChange = (
    newLeft: string[],
    newRight: string[],
    dropdownValue?: string
  ) => {
    if (!dropdownValue) return
    setTransferListDataMap(prev => ({
      ...prev,
      [dropdownValue]: {
        leftItems: newLeft,
        rightItems: newRight,
      },
    }))
  }

  // -------------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------------
  const handleSave = () => {
    const formData = {
      taskTitle,
      taskDescription,
      nextActionDate,
      // Only pass transferList data for "company" or "administrator"
      transferListData:
        variant === 'company' || variant === 'administrator'
          ? transferListDataMap
          : undefined,
    }
    onSubmit?.(formData)
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Manage Task</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            mb: 2,
          }}
        >
          {/* ============ "COMPANY" VARIANT ============ */}
          {variant === 'company' && (
            <>
              <Dropdown
                label="Company Account"
                name="companyAccount"
                options={companyAccounts.map(acc => ({
                  value: acc.companyName,
                }))}
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value as string)}
              />

              <Dropdown
                label="Severity Level"
                name="severityLevel"
                options={severityLevels.map(s => ({
                  value: String(s.severityLevel),
                }))}
                value={selectedSeverity}
                onChange={e => setSelectedSeverity(e.target.value as string)}
              />

              <Dropdown
                label="Associated Product (Queue)"
                name="associatedQueue"
                options={schedulingQueues.map(q => ({ value: q.queueName }))}
                value={selectedQueue}
                onChange={e => setSelectedQueue(e.target.value as string)}
              />

              <Dropdown
                label="Assigned Administrator"
                name="assignedAdministrator"
                options={administrators.map(a => ({ value: a.fullName }))}
                value={selectedAdministrator}
                onChange={e =>
                  setSelectedAdministrator(e.target.value as string)
                }
              />

              <Dropdown
                label="Status"
                name="status"
                options={statuses.map(s => ({ value: s.status }))}
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value as string)}
              />

              <Dropdown
                label="Substatus"
                name="substatus"
                options={subStatuses.map(s => ({ value: s.subStatus }))}
                value={selectedSubStatus}
                onChange={e => setSelectedSubStatus(e.target.value as string)}
              />
            </>
          )}

          {/* ============ "CUSTOMER" VARIANT ============ */}
          {variant === 'customer' && (
            <>
              <Dropdown
                label="Customer Account"
                name="customerAccount"
                // If you have real customers array, you can adapt; for now show "SampleAccount"
                options={[{ value: 'SampleCustomerAccount' }]}
                value={selectedCustomer}
                onChange={e => setSelectedCustomer(e.target.value as string)}
              />

              <Dropdown
                label="Severity Level"
                name="severityLevel"
                options={severityLevels.map(s => ({
                  value: String(s.severityLevel),
                }))}
                value={selectedSeverity}
                onChange={e => setSelectedSeverity(e.target.value as string)}
              />

              <Dropdown
                label="Associated Product (Queue)"
                name="associatedQueue"
                options={schedulingQueues.map(q => ({ value: q.queueName }))}
                value={selectedQueue}
                onChange={e => setSelectedQueue(e.target.value as string)}
              />

              <Dropdown
                label="Assigned Employee"
                name="assignedEmployee"
                options={employees.map(emp => ({
                  value: (emp.firstName || '') + ' ' + (emp.lastName || ''),
                }))}
                value={selectedEmployee}
                onChange={e => setSelectedEmployee(e.target.value as string)}
              />

              <Dropdown
                label="Status"
                name="status"
                options={statuses.map(s => ({ value: s.status }))}
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value as string)}
              />

              <Dropdown
                label="Substatus"
                name="substatus"
                options={subStatuses.map(s => ({ value: s.subStatus }))}
                value={selectedSubStatus}
                onChange={e => setSelectedSubStatus(e.target.value as string)}
              />
            </>
          )}

          {/* ============ "ADMINISTRATOR" VARIANT ============ */}
          {variant === 'administrator' && (
            <>
              <Dropdown
                label="Severity Level"
                name="severityLevel"
                options={severityLevels.map(s => ({
                  value: String(s.severityLevel),
                }))}
                value={selectedSeverity}
                onChange={e => setSelectedSeverity(e.target.value as string)}
              />

              <Dropdown
                label="Associated Product (Queue)"
                name="associatedQueue"
                options={schedulingQueues.map(q => ({ value: q.queueName }))}
                value={selectedQueue}
                onChange={e => setSelectedQueue(e.target.value as string)}
              />

              <Dropdown
                label="Status"
                name="status"
                options={statuses.map(s => ({ value: s.status }))}
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value as string)}
              />

              <Dropdown
                label="Substatus"
                name="substatus"
                options={subStatuses.map(s => ({ value: s.subStatus }))}
                value={selectedSubStatus}
                onChange={e => setSelectedSubStatus(e.target.value as string)}
              />
            </>
          )}
        </Box>

        {/* Only "company" and "administrator" get multi-selection TransferList */}
        {(variant === 'company' || variant === 'administrator') && (
          <Box sx={{ mb: 2 }}>
            <TransferList
              variant="multipleSelection"
              dropdownLabel="Topics or Articles"
              dropdownOptions={multiSelectOptions}
              dropdownDataMap={transferListDataMap}
              leftTitle="Unassigned"
              rightTitle="Assigned"
              onChange={handleTransferListChange}
            />
          </Box>
        )}

        {/* Task Title / Description */}
        <TextField
          label="Task Title"
          value={taskTitle}
          onChange={e => setTaskTitle(e.target.value)}
        />
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Task Description"
            value={taskDescription}
            multiline
            minRows={5}
            onChange={e => setTaskDescription(e.target.value)}
          />
        </Box>

        {/* Next Action Date */}
        <Box sx={{ mt: 2, width: '50%' }}>
          <DateField
            label="Next Action Date"
            value={nextActionDate}
            onChange={date => setNextActionDate(date)}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ gap: 1 }}>
        <CustomButton
          text="Cancel"
          backgroundcolor="none"
          fontcolor="black"
          onClick={onClose}
        />
        <CustomButton
          text="Save"
          backgroundcolor="#1976d2"
          fontcolor="white"
          onClick={handleSave}
        />
      </DialogActions>
    </Dialog>
  )
}

export default ManageTask
