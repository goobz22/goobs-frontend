// src\components\ProjectBoard\index.tsx
'use client'

import React, { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import Toolbar from '../Toolbar'
import Column from './Column'
import AddTask from './AddTask/client'
import ManageTask from './ManageTask/client'
import ShowTask from './ShowTask/client'

// Import the custom hook for drag+drop
import { useDragAndDropColumns } from './utils/useDragandDropColumns'

/** A minimal typed comment for any type of task. */
export type Comment = {
  _id: string
  text: string
  createdAt: Date
  updatedAt: Date
}

/**
 * A generic "Task" type for your boards.
 * It can store severityId, statusId, substatusId, schedulingQueueId, topicIds, etc.
 * This way, we don't need separate interfaces for each variant.
 */
export type Task = {
  _id: string
  /** The parent company ID or other domain-specific reference. */
  companyId?: string

  title: string
  description: string

  /** If severity is linked to a separate record, store it here. */
  severityId?: string

  /** The main status. */
  statusId?: string

  /** The sub-status. */
  substatusId?: string

  /** The scheduling queue ID. */
  schedulingQueueId?: string

  /** Topics array, each referencing a topic ID. */
  topicIds?: string[]

  /** Comments array, referencing comment IDs. */
  commentIds?: string[]

  /** Employee IDs assigned to the task. */
  employeeIds?: string[]

  /** Knowledgebase article IDs. */
  articleIds?: string[]

  /** The "customer" ID if you have one. */
  customerId?: string

  /** Timestamps. */
  createdAt?: Date
  closedAt?: Date
  updatedAt?: Date
}

/** Each "column" references an array of Task objects. */
export type ColumnData = {
  _id: string
  title: string
  description: string
  tasks: Task[]
}

/** Board types: which property we use to group tasks into columns. */
export type BoardType = 'severityLevel' | 'status' | 'subStatus' | 'topic'

/** Raw typed data for "severity levels." */
export type RawSeverityLevel = {
  _id: string
  severityLevel: number
  description?: string
}

/** Raw typed data for "statuses." */
export type RawStatus = {
  _id: string
  status: string
  description?: string
}

/** Raw typed data for "substatuses." */
export type RawSubStatus = {
  _id: string
  subStatus: string
  description?: string
}

/** Raw typed data for "topics." */
export type RawTopic = {
  _id: string
  topic: string
  description?: string
}

/** Raw typed data for "queues." */
export type RawQueue = {
  _id: string
  queueName: string
}

/** Raw typed data for "articles." */
export type RawArticle = {
  _id: string
  articleTitle: string
}

/** Raw typed data for "customers." */
export type RawCustomer = {
  _id: string
  firstName?: string
  lastName?: string
}

/** Raw typed data for "employees." */
export type RawEmployee = {
  _id: string
  firstName?: string
  lastName?: string
}

/** Optional "company" type. */
export type CompanyInfo = {
  _id: string
  companyName: string
}

/** Additional props for updating a task’s fields in the store (drag-drop, etc.) */
export interface OnUpdateTaskArgs {
  companyId: string
  _id: string
  input: Record<string, unknown>
}

/** The 3 variants we support in Add/Manage: 'administrator' | 'company' | 'customer'. */
export type BoardVariant = 'administrator' | 'company' | 'customer'

/**
 * Props for ProjectBoard.
 */
export interface ProjectBoardProps {
  /**
   * Which variant we pass to AddTask & ManageTask:
   *  - "company"
   *  - "customer"
   *  - "administrator"
   */
  variant: BoardVariant

  /**
   * The "boardType" indicates which field on the task we use to group columns:
   *  - "severityLevel" => use "severityId"
   *  - "status"       => use "statusId"
   *  - "subStatus"    => use "substatusId"
   *  - "topic"        => use "topicIds"
   */
  boardType: BoardType

  company?: CompanyInfo

  columns?: {
    _id: string
    title: string
    description: string
  }[]

  tasks?: Task[]

  rawStatuses: RawStatus[]
  rawSubStatuses: RawSubStatus[]
  rawTopics: RawTopic[]
  rawQueues: RawQueue[]
  rawArticles: RawArticle[]
  rawCustomers: RawCustomer[]
  rawEmployees: RawEmployee[]
  rawSeverityLevels: RawSeverityLevel[]

  /** Optional callback to update the store when a task changes columns, etc. */
  onUpdateTask?: (args: OnUpdateTaskArgs) => void
}

/**
 * Merge columns + tasks for display.
 * If boardType = "severityLevel", we match column._id => task.severityId
 * If boardType = "status", we match column._id => task.statusId
 * If boardType = "subStatus", we match column._id => task.substatusId
 * If boardType = "topic", we match column._id => task.topicIds includes col._id
 */
function mergeColumnsAndTasks(
  columns: NonNullable<ProjectBoardProps['columns']>,
  tasks: NonNullable<ProjectBoardProps['tasks']>,
  boardType: BoardType
): ColumnData[] {
  return columns.map(col => {
    const colId = col._id

    // Based on boardType, decide if a given task belongs in this column
    const matchingTasks = tasks.filter(task => {
      switch (boardType) {
        case 'severityLevel':
          return task.severityId === colId

        case 'status':
          return task.statusId === colId

        case 'subStatus':
          return task.substatusId === colId

        case 'topic':
          return task.topicIds?.includes(colId)

        default:
          return false
      }
    })

    return { ...col, tasks: matchingTasks }
  })
}

function ProjectBoard({
  variant,
  boardType,
  company,
  columns = [],
  tasks = [],
  rawStatuses,
  rawSubStatuses,
  rawTopics,
  rawQueues,
  rawArticles,
  rawCustomers,
  rawEmployees,
  rawSeverityLevels,
  onUpdateTask,
}: ProjectBoardProps) {
  // 1) Merge columns + tasks based on boardType
  const mergedColumns = useMemo(() => {
    return mergeColumnsAndTasks(columns, tasks, boardType)
  }, [columns, tasks, boardType])

  // 2) Local columnState
  const [columnState, setColumnState] = useState<ColumnData[]>(mergedColumns)

  // 3) Single-task selection logic
  const [selectedTask, setSelectedTask] = useState<{
    colIndex: number
    taskIndex: number
  } | null>(null)

  function handleSelectTask(colIndex: number, taskIndex: number) {
    if (
      selectedTask?.colIndex === colIndex &&
      selectedTask?.taskIndex === taskIndex
    ) {
      setSelectedTask(null)
    } else {
      setSelectedTask({ colIndex, taskIndex })
    }
  }

  // Flatten tasks
  const allTasks = useMemo<Task[]>(() => {
    return columnState.flatMap(col => col.tasks)
  }, [columnState])

  // 4) useDragAndDropColumns hook
  const {
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop,
    handleTaskDragStart,
    handleTaskDragOver,
    handleTaskDrop,
  } = useDragAndDropColumns(columnState, setColumnState, company, onUpdateTask)

  // 5) Add, Manage, Show popups
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const [manageTaskOpen, setManageTaskOpen] = useState('-1')
  const [showTaskOpen, setShowTaskOpen] = useState('-1')

  function handleAddTaskSubmit(newTask: Omit<Task, '_id'>) {
    // If no columns exist, do nothing
    if (columnState.length === 0) return

    // For demonstration, add the new task to the first column
    const newCols = [...columnState]
    const colId = newCols[0]._id

    // We'll set the relevant ID based on boardType
    let typedTask: Task = {
      ...newTask,
      _id: String(Date.now()),
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
    }

    switch (boardType) {
      case 'severityLevel':
        typedTask.severityId = colId
        break
      case 'status':
        typedTask.statusId = colId
        break
      case 'subStatus':
        typedTask.substatusId = colId
        break
      case 'topic':
        typedTask.topicIds = [colId]
        break
    }

    newCols[0].tasks.push(typedTask)
    setColumnState(newCols)
    setAddTaskOpen(false)
  }

  function handleManageTaskSubmit(data: {
    taskTitle: string
    taskDescription: string
    nextActionDate: Date | null
    transferListData?: unknown
  }) {
    if (!selectedTask) {
      setManageTaskOpen('-1')
      return
    }
    const { colIndex, taskIndex } = selectedTask

    if (
      colIndex < 0 ||
      colIndex >= columnState.length ||
      taskIndex < 0 ||
      taskIndex >= columnState[colIndex].tasks.length
    ) {
      setManageTaskOpen('-1')
      return
    }

    const selectedTaskId = columnState[colIndex].tasks[taskIndex]._id
    const { taskTitle, taskDescription } = data

    // Update that selected task’s fields
    const newCols = columnState.map(col => {
      const newTasks = col.tasks.map(t =>
        t._id === selectedTaskId
          ? { ...t, title: taskTitle, description: taskDescription }
          : t
      )
      return { ...col, tasks: newTasks }
    })
    setColumnState(newCols)

    // Also call onUpdateTask if needed
    onUpdateTask?.({
      companyId: company?._id || 'missing-company-id',
      _id: selectedTaskId,
      input: {
        title: taskTitle,
        description: taskDescription,
      },
    })

    setManageTaskOpen('-1')
  }

  // Check if exactly 1 task is selected
  const exactlyOneSelected = selectedTask !== null
  let selectedTaskId = ''
  if (exactlyOneSelected) {
    const { colIndex, taskIndex } = selectedTask!
    if (
      colIndex >= 0 &&
      colIndex < columnState.length &&
      taskIndex >= 0 &&
      taskIndex < columnState[colIndex].tasks.length
    ) {
      selectedTaskId = columnState[colIndex].tasks[taskIndex]._id
    } else {
      setSelectedTask(null)
    }
  }

  // 6) Toolbar
  const buttons = [
    {
      text: 'Create Task',
      onClick: () => setAddTaskOpen(true),
    },
    {
      text: 'Manage Task',
      onClick: () => {
        if (exactlyOneSelected && selectedTaskId) {
          setManageTaskOpen(selectedTaskId)
        }
      },
      disabled: !exactlyOneSelected || !selectedTaskId,
    },
    {
      text: 'Show Task',
      onClick: () => {
        if (exactlyOneSelected && selectedTaskId) {
          setShowTaskOpen(selectedTaskId)
        }
      },
      disabled: !exactlyOneSelected || !selectedTaskId,
    },
  ]

  // For "company" variant, build an array of accounts
  const companyAccounts = company
    ? [{ _id: company._id, companyName: company.companyName }]
    : []

  // A dummy list of "administrators" from employees:
  const administrators = rawEmployees.map(emp => ({
    _id: emp._id,
    fullName: `${emp.firstName ?? ''} ${emp.lastName ?? ''}`.trim(),
  }))

  return (
    <Box sx={{ boxSizing: 'border-box', width: '100%', height: '100%' }}>
      <Toolbar buttons={buttons} />

      <Stack direction="row" spacing={3} mt={1} pl={4}>
        {columnState.map((col, idx) => (
          <Column
            key={col._id}
            index={idx}
            title={col.title}
            description={col.description}
            tasks={col.tasks}
            // Column-level DnD
            onColumnDragStart={handleColumnDragStart}
            onColumnDragOver={handleColumnDragOver}
            onColumnDrop={handleColumnDrop}
            // Task-level DnD
            onTaskDragStart={(e, colI, taskI) =>
              handleTaskDragStart(e, colI, taskI, selectedTask)
            }
            onTaskDragOver={handleTaskDragOver}
            onTaskDragDrop={handleTaskDrop}
            selectedTask={selectedTask}
            onSelectTask={handleSelectTask}
          />
        ))}
      </Stack>

      {/* AddTask */}
      <AddTask
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        variant={variant}
        onSubmit={handleAddTaskSubmit}
        statuses={rawStatuses}
        subStatuses={rawSubStatuses}
        topics={rawTopics}
        schedulingQueues={rawQueues}
        knowledgebaseArticles={rawArticles}
        customers={rawCustomers}
        employees={rawEmployees}
        severityLevels={rawSeverityLevels}
      />

      {/* ManageTask */}
      <ManageTask
        open={manageTaskOpen !== '-1'}
        onClose={() => setManageTaskOpen('-1')}
        variant={variant}
        companyAccounts={companyAccounts}
        administrators={administrators}
        employees={rawEmployees}
        statuses={rawStatuses}
        subStatuses={rawSubStatuses}
        schedulingQueues={rawQueues}
        severityLevels={rawSeverityLevels}
        topics={rawTopics}
        knowledgebaseArticles={rawArticles}
        defaultTaskTitle={
          exactlyOneSelected
            ? allTasks.find(t => t._id === selectedTaskId)?.title || ''
            : ''
        }
        defaultTaskDescription={
          exactlyOneSelected
            ? allTasks.find(t => t._id === selectedTaskId)?.description || ''
            : ''
        }
        defaultNextActionDate={null}
        onSubmit={handleManageTaskSubmit}
      />

      {/* ShowTask */}
      <ShowTask
        open={showTaskOpen !== '-1'}
        onClose={() => setShowTaskOpen('-1')}
        // Pass all raw data. "ShowTask" doesn't need a variant
        topics={rawTopics.map(t => t.topic)}
        knowledgebaseArticles={rawArticles.map(a => a.articleTitle)}
        schedulingQueues={rawQueues}
        customers={rawCustomers}
        employees={rawEmployees}
        statuses={rawStatuses}
        subStatuses={rawSubStatuses}
        severityLevels={rawSeverityLevels}
      />
    </Box>
  )
}

export default ProjectBoard
