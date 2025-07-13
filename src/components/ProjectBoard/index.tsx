/**
 * @fileoverview Defines the ProjectBoard component for managing project tasks with drag-and-drop functionality.
 * It supports light, dark, and sacred themes with comprehensive customization options.
 */
'use client'

import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { useAtom } from 'jotai'
import { columnsAtom } from './jotai/atom'
import { JotaiProvider } from './jotai/provider'

import Toolbar from '../Toolbar'
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
import { getProjectBoardStyles, SACRED_GLYPHS } from '../../theme'

// --------------------------------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------------------------------

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

// --------------------------------------------------------------------------
// MAIN PROJECT BOARD CONTENT COMPONENT
// --------------------------------------------------------------------------

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
  styles,
}: ProjectBoardProps) {
  const [columnState, setColumnState] = useAtom(columnsAtom)
  const mergedColumns = useMemo(
    () => mergeColumnsAndTasks(columns, tasks, boardType),
    [columns, tasks, boardType]
  )

  const isSacredTheme = styles?.theme === 'sacred'
  const isDisabled = styles?.disabled

  const computedStyles = useMemo(
    () => getProjectBoardStyles(styles, isDisabled),
    [styles, isDisabled]
  )

  useEffect(() => {
    setColumnState(mergedColumns)
  }, [mergedColumns, setColumnState])

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

  const allTasks: Task[] = useMemo(
    () => columnState.flatMap(col => col.tasks),
    [columnState]
  )

  const { handleColumnDragStart, handleColumnDragOver, handleColumnDrop } =
    useColumnDragAndDrop(columnState, setColumnState)
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const [showTaskOpen, setShowTaskOpen] = useState('-1')

  const handleAddTask = useCallback(
    (newTask: Omit<Task, '_id'>) => {
      if (columnState.length === 0) {
        onAdd(newTask)
        setAddTaskOpen(false)
        return
      }
      const newCols = [...columnState]
      const colId = newCols[0]._id
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
      onAdd(newTask)
    },
    [columnState, boardType, setColumnState, onAdd]
  )

  const currentShowTask = allTasks.find(t => t._id === showTaskOpen)
  if (showTaskOpen !== '-1' && !currentShowTask) {
    throw new Error('ShowTask is open but no task found')
  }

  const showTaskTitle = currentShowTask?.title || ''
  const showTaskDescription = currentShowTask?.description || ''
  const showTaskCreatedBy = currentShowTask?.createdBy || ''
  const showTaskCommentsFixed = useMemo(() => {
    if (!currentShowTask) return []
    return currentShowTask.comments.map(c => ({
      _id: c._id,
      text: c.text,
      createdAt: new Date(c.createdAt ?? Date.now()),
      createdBy: c.createdBy,
      editHistory: c.editHistory.map(eh => ({
        ...eh,
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
    { text: 'Create Task', onClick: () => setAddTaskOpen(true) },
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
    <div ref={containerRef} style={computedStyles.container}>
      {isSacredTheme && (
        <>
          <div style={computedStyles.glyphPositions.topLeft}>
            {SACRED_GLYPHS[0]}
          </div>
          <div style={computedStyles.glyphPositions.topRight}>
            {SACRED_GLYPHS[13]}
          </div>
          <div style={computedStyles.glyphPositions.bottomLeft}>
            {SACRED_GLYPHS[5]}
          </div>
          <div style={computedStyles.glyphPositions.bottomRight}>
            {SACRED_GLYPHS[9]}
          </div>
        </>
      )}

      <Toolbar
        buttons={buttons}
        searchbarProps={{
          label: 'Search...',
          value: searchTerm,
          onChange: handleSearchChange,
          styles: { theme: styles?.theme },
        }}
        styles={{ theme: styles?.theme }}
      />

      <div style={computedStyles.toolbarContainer}>
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
          styles={{ theme: styles?.theme }}
        />
      </div>

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
              sacredtheme={styles?.theme === 'sacred'}
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
              sacredtheme={styles?.theme === 'sacred'}
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
              sacredtheme={styles?.theme === 'sacred'}
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
              sacredtheme={styles?.theme === 'sacred'}
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
          styles={{ theme: styles?.theme }}
        />
      )}

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
          styles={{ theme: styles?.theme }}
        />
      )}
    </div>
  )
}

// --------------------------------------------------------------------------
// MAIN PROJECT BOARD WRAPPER COMPONENT
// --------------------------------------------------------------------------

function ProjectBoard(props: ProjectBoardProps) {
  return (
    <JotaiProvider>
      <ProjectBoardContent {...props} />
    </JotaiProvider>
  )
}

export default React.memo(ProjectBoard)
