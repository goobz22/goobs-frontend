'use client'

import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { Box, Stack } from '@mui/material'
import { useAtom } from 'jotai'
import { columnsAtom } from './jotai/atom'
import { JotaiProvider } from './jotai/provider'

import Toolbar from '../Toolbar'
// Removed old generic AddTask import
// import AddTask from './forms/AddTask/client'
import AdministratorAddTaskCompanyDropdown from './forms/AddTask/administrator/companyDropdown'
import AdministratorAddTaskCompanyProvided from './forms/AddTask/administrator/companyProvided'
import CompanyAddTaskCustomerDropdown from './forms/AddTask/company/customerDropdown'
import CompanyAddTaskCustomerProvided from './forms/AddTask/company/customerProvided'
import CustomerAddTask from './forms/AddTask/customer'

import ShowTask from './forms/ShowTask/client'
import { ProjectBoardProps, ColumnData, Task, BoardType } from './types'

import { useColumnDragAndDrop } from './utils/useDragandDrop/columns'
import { useComputeBoardResize } from './utils/useComputeBoard'
import Board from './board'

import * as palette from '../../styles/palette'

/**
 * Merge the incoming tasks into columns based on the boardType.
 */
function mergeColumnsAndTasks(
  columns: Array<{ _id: string; title: string; description: string }>,
  tasks: Task[],
  boardType: BoardType
): ColumnData[] {
  return columns.map(col => {
    const colId = col._id
    const matchingTasks = tasks.filter(task => {
      switch (boardType) {
        case 'severityLevel':
          return task.severityId === colId
        case 'status':
          return task.statusId === colId
        case 'subStatus':
          return task.substatusId === colId
        case 'topic':
          return task.topicIds.includes(colId)
        default:
          return false
      }
    })

    return {
      _id: col._id,
      title: col.title,
      description: col.description,
      tasks: matchingTasks,
    }
  })
}

function ProjectBoardContent({
  variant,
  boardType,
  columns,
  tasks,
  rawStatuses,
  rawSubStatuses,
  rawTopics,
  rawQueues,
  rawArticles,
  rawCustomers,
  rawEmployees,
  rawCompanies,
  rawSeverityLevels,
  onEdit,
  onDelete,
  onDuplicate,
  onEditComment,
  onAdd,
  onComment,
  onRevisionHistory,
  currentUser,
  customerId,
  companyId,
  preferDropdown,
}: ProjectBoardProps) {
  // 1) Atom state for columns + tasks
  const [columnState, setColumnState] = useAtom(columnsAtom)

  // Merge the tasks into columns
  const mergedColumns = useMemo(
    () => mergeColumnsAndTasks(columns, tasks, boardType),
    [columns, tasks, boardType]
  )

  // Initialize the columns in our Jotai store
  useEffect(() => {
    setColumnState(mergedColumns)
  }, [mergedColumns, setColumnState])

  // 2) Single-task selection state
  const [selectedTask, setSelectedTask] = useState<{
    colIndex: number
    taskIndex: number
  } | null>(null)

  function handleSelectTask(colIndex: number, taskIndex: number) {
    if (
      selectedTask &&
      selectedTask.colIndex === colIndex &&
      selectedTask.taskIndex === taskIndex
    ) {
      setSelectedTask(null)
    } else {
      setSelectedTask({ colIndex, taskIndex })
    }
  }

  // Flatten tasks to find the one to display in ShowTask
  const allTasks: Task[] = useMemo(
    () => columnState.flatMap(col => col.tasks),
    [columnState]
  )

  // 3) COLUMN DRAG & DROP
  const { handleColumnDragStart, handleColumnDragOver, handleColumnDrop } =
    useColumnDragAndDrop(columnState, setColumnState)

  // 4) Local modals: handle "Add Task" and "Show Task" states internally
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  /** We store the "currently showing Task" as an ID in local state. '-1' means none open. */
  const [showTaskOpen, setShowTaskOpen] = useState('-1')

  // 5) AddTask "onAdd" handler
  const handleAddTask = useCallback(
    (newTask: Omit<Task, '_id'>) => {
      // 5.a) Update local columns in Jotai
      if (columnState.length === 0) {
        onAdd(newTask)
        setAddTaskOpen(false)
        return
      }

      const newCols = [...columnState]
      const colId = newCols[0]._id

      // Build a full Task object by spreading newTask and overriding board-specific fields.
      const typedTask: Task = {
        _id: String(Date.now()),
        ...newTask,
        severityId: boardType === 'severityLevel' ? colId : newTask.severityId,
        schedulingQueueId:
          boardType === 'status' ? colId : newTask.schedulingQueueId,
        statusId: boardType === 'status' ? colId : newTask.statusId,
        substatusId: boardType === 'subStatus' ? colId : newTask.substatusId,
        topicIds: boardType === 'topic' ? [colId] : newTask.topicIds,
      }

      newCols[0].tasks.push(typedTask)
      setColumnState(newCols)
      setAddTaskOpen(false)

      // 5.b) Also call the parent's onAdd, passing the same newTask data
      onAdd(newTask)
    },
    [columnState, boardType, setColumnState, onAdd]
  )

  // 6) If ShowTask is open, gather fields
  const currentShowTask = allTasks.find(t => t._id === showTaskOpen)
  if (showTaskOpen !== '-1' && !currentShowTask) {
    throw new Error('ShowTask is open but no task found')
  }

  // Build fields for ShowTask
  const showTaskTitle = currentShowTask?.title || ''
  const showTaskDescription = currentShowTask?.description || ''
  const showTaskCreatedBy = currentShowTask?.createdBy || ''
  const showTaskCommentsFixed = useMemo(() => {
    if (!currentShowTask) return []
    return currentShowTask.comments.map(c => ({
      _id: c._id,
      text: c.text,
      // Ensure createdAt is a valid Date (fallback to current time if missing)
      createdAt: new Date(c.createdAt ?? Date.now()),
      // Use createdBy from the shared type
      createdBy: c.createdBy,
      editHistory: c.editHistory.map(eh => ({
        ...eh,
        // Only convert if a valid value exists, otherwise omit editedAt
        ...(eh.editedAt ? { editedAt: new Date(eh.editedAt) } : {}),
      })),
    }))
  }, [currentShowTask])

  const showTaskCustomerAssigned = currentShowTask?.customerAssigned || ''
  const showTaskSeverity = currentShowTask?.severity || ''
  const showTaskSchedulingQueue = currentShowTask?.schedulingQueue || ''
  const showTaskStatus = currentShowTask?.status || ''
  const showTaskSubStatus = currentShowTask?.subStatus || ''
  const showTaskTopics = currentShowTask?.topicLabels || []
  const showTaskKBArticles = currentShowTask?.kbArticles || []
  const showTaskTeamMemberAssigned = currentShowTask?.teamMember || ''
  const showTaskNextActionDate = currentShowTask?.nextActionDate || ''

  // 8) SEARCH + FILTER
  const [searchTerm, setSearchTerm] = useState('')
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value)
  }
  const filteredColumnState = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase()
    return columnState.map(col => {
      const filteredTasks = col.tasks.filter(
        t =>
          t.title.toLowerCase().includes(lowerTerm) ||
          t.description.toLowerCase().includes(lowerTerm)
      )
      return { ...col, tasks: filteredTasks }
    })
  }, [columnState, searchTerm])

  // 9) "Fit / Overflow" columns
  const {
    containerRef,
    fittedColumns,
    overflowColumns,
    selectedOverflowColumnId,
    setSelectedOverflowColumnId,
  } = useComputeBoardResize({
    columns: filteredColumnState,
    columnWidth: 300,
    showOverflowDropdown: true,
  })

  // 10) Handling comment edits locally + calling parent's onEditComment
  function handleEditComment(
    commentId: string,
    newText: string,
    taskId: string
  ) {
    setColumnState(oldCols =>
      oldCols.map(col => {
        const updatedTasks = col.tasks.map(task => {
          if (task._id !== taskId) return task
          const updatedComments = task.comments.map(c => {
            if (c._id === commentId) {
              return { ...c, text: newText }
            }
            return c
          })
          return { ...task, comments: updatedComments }
        })
        return { ...col, tasks: updatedTasks }
      })
    )
    onEditComment(commentId, newText, taskId)
  }

  // 11) Determine selected task ID
  const exactlyOneSelected = selectedTask !== null
  let selectedTaskId = ''
  if (selectedTask) {
    const { colIndex, taskIndex } = selectedTask
    if (
      colIndex >= 0 &&
      colIndex < columnState.length &&
      taskIndex >= 0 &&
      taskIndex < columnState[colIndex].tasks.length
    ) {
      selectedTaskId = columnState[colIndex].tasks[taskIndex]._id
    }
  }

  // 12) Internal "Close Task" logic
  function handleCloseTask(taskId: string) {
    setColumnState(oldCols =>
      oldCols.map(col => {
        const updatedTasks = col.tasks.map(task => {
          if (task._id === taskId) {
            return { ...task, closedAt: new Date() }
          }
          return task
        })
        return { ...col, tasks: updatedTasks }
      })
    )
    setShowTaskOpen('-1')
  }

  const buttons = [
    {
      text: 'Create Task',
      onClick: () => setAddTaskOpen(true),
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

  return (
    <Box
      ref={containerRef}
      sx={{ boxSizing: 'border-box', width: '100%', height: '100%' }}
    >
      <Toolbar
        buttons={buttons}
        searchbarProps={{
          label: 'Search...',
          value: searchTerm,
          onChange: handleSearchChange,
          backgroundcolor: palette.semiTransparentWhite.main,
          shrunkfontcolor: palette.white.main,
          unshrunkfontcolor: palette.white.main,
          shrunklabelposition: 'onNotch',
        }}
      />

      <Stack direction="row" spacing={3} mt={1} pl={4}>
        <Board
          columns={fittedColumns}
          overflowColumns={overflowColumns}
          selectedOverflowColumnId={selectedOverflowColumnId}
          onChangeSelectedOverflowColumn={setSelectedOverflowColumnId}
          selectedTask={selectedTask}
          onSelectTask={handleSelectTask}
          onColumnDragStart={handleColumnDragStart}
          onColumnDragOver={handleColumnDragOver}
          onColumnDrop={handleColumnDrop}
        />
      </Stack>

      {/* Conditionally render AddTask based on the variant and preferDropdown prop */}
      {variant === 'administrator' && (
        <>
          {preferDropdown === true ||
          (preferDropdown !== false &&
            rawCompanies &&
            rawCompanies.length > 0) ? (
            <AdministratorAddTaskCompanyDropdown
              open={addTaskOpen}
              onClose={() => setAddTaskOpen(false)}
              onAdd={handleAddTask}
              statuses={rawStatuses}
              subStatuses={rawSubStatuses}
              topics={rawTopics}
              schedulingQueues={rawQueues}
              knowledgebaseArticles={rawArticles}
              severityLevels={rawSeverityLevels}
              createdUserId={currentUser._id}
              rawCompanies={rawCompanies || []}
            />
          ) : (
            <AdministratorAddTaskCompanyProvided
              open={addTaskOpen}
              onClose={() => setAddTaskOpen(false)}
              onAdd={handleAddTask}
              statuses={rawStatuses}
              subStatuses={rawSubStatuses}
              topics={rawTopics}
              schedulingQueues={rawQueues}
              knowledgebaseArticles={rawArticles}
              severityLevels={rawSeverityLevels}
              createdUserId={currentUser._id}
              companyId={companyId || ''}
            />
          )}
        </>
      )}
      {variant === 'company' && (
        <>
          {preferDropdown === true ||
          (preferDropdown !== false &&
            rawCustomers &&
            rawCustomers.length > 0) ? (
            <CompanyAddTaskCustomerDropdown
              open={addTaskOpen}
              onClose={() => setAddTaskOpen(false)}
              onAdd={handleAddTask}
              statuses={rawStatuses}
              subStatuses={rawSubStatuses}
              topics={rawTopics}
              schedulingQueues={rawQueues}
              knowledgebaseArticles={rawArticles}
              severityLevels={rawSeverityLevels}
              createdUserId={currentUser._id}
              rawCustomers={rawCustomers || []}
            />
          ) : (
            <CompanyAddTaskCustomerProvided
              open={addTaskOpen}
              onClose={() => setAddTaskOpen(false)}
              onAdd={handleAddTask}
              statuses={rawStatuses}
              subStatuses={rawSubStatuses}
              topics={rawTopics}
              schedulingQueues={rawQueues}
              knowledgebaseArticles={rawArticles}
              severityLevels={rawSeverityLevels}
              createdUserId={currentUser._id}
              customerId={customerId || ''}
            />
          )}
        </>
      )}
      {variant === 'customer' && (
        <CustomerAddTask
          open={addTaskOpen}
          onClose={() => setAddTaskOpen(false)}
          onAdd={handleAddTask}
          topics={rawTopics}
          schedulingQueues={rawQueues}
          severityLevels={rawSeverityLevels}
          createdUserId={currentUser._id}
          companyId={companyId || ''}
        />
      )}

      {/* ShowTask modal */}
      {currentShowTask && (
        <ShowTask
          open={true}
          onClose={() => setShowTaskOpen('-1')}
          taskId={showTaskOpen}
          taskTitle={showTaskTitle}
          createdBy={showTaskCreatedBy}
          description={showTaskDescription}
          comments={showTaskCommentsFixed}
          customerAssigned={showTaskCustomerAssigned}
          severity={showTaskSeverity}
          schedulingQueue={showTaskSchedulingQueue}
          status={showTaskStatus}
          subStatus={showTaskSubStatus}
          topics={showTaskTopics}
          knowledgebaseArticles={showTaskKBArticles}
          teamMemberAssigned={showTaskTeamMemberAssigned}
          nextActionDate={showTaskNextActionDate}
          currentUserName={`${currentUser.firstName} ${currentUser.lastName}`}
          onEdit={updatedData => {
            // Merge updated data with the current task ID and pass to the parent's onEdit callback
            onEdit({ _id: showTaskOpen, ...updatedData })
          }}
          onDelete={() => onDelete({ _id: showTaskOpen })}
          onDuplicate={() => onDuplicate({ _id: showTaskOpen })}
          onComment={text => onComment(text, showTaskOpen)}
          onEditComment={(commentId, newText) =>
            handleEditComment(commentId, newText, showTaskOpen)
          }
          onCloseTask={handleCloseTask}
          onRevisionHistory={onRevisionHistory}
          customerOptions={rawCustomers}
          severityOptions={rawSeverityLevels}
          schedulingQueueOptions={rawQueues}
          statusOptions={rawStatuses}
          subStatusOptions={rawSubStatuses}
          topicOptions={rawTopics}
          knowledgebaseArticleOptions={rawArticles}
          teamMemberOptions={rawEmployees}
        />
      )}
    </Box>
  )
}

// Wrap the component with our custom JotaiProvider to avoid the "multiple instances" error
function ProjectBoard(props: ProjectBoardProps) {
  return (
    <JotaiProvider>
      <ProjectBoardContent {...props} />
    </JotaiProvider>
  )
}

export default React.memo(ProjectBoard)
