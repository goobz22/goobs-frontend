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
import { useTaskDragAndDrop } from './utils/useDragandDrop/tasks'
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

  // Simplified state management - only track what's necessary
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showTaskOpen, setShowTaskOpen] = useState<string>('-1')
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Drag and drop hooks
  const columnDragAndDrop = useColumnDragAndDrop(columnState, setColumnState)
  const taskDragAndDrop = useTaskDragAndDrop()

  // Task selection handler
  const handleTaskSelect = useCallback((taskId: string) => {
    setSelectedTaskId(prev => (prev === taskId ? null : taskId))
  }, [])

  // Search handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
    },
    []
  )

  // Filter columns based on search
  const filteredColumnState = useMemo(() => {
    if (!searchTerm) return columnState

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

  // Task operations
  const handleAddTask = useCallback(
    (newTask: Omit<Task, '_id'>) => {
      const taskWithId = {
        ...newTask,
        _id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }

      // Update local state
      setColumnState(prevColumns => {
        const newColumns = [...prevColumns]
        const targetColumnIndex = newColumns.findIndex(col => {
          switch (boardType) {
            case 'severityLevel':
              return col._id === newTask.severityId
            case 'status':
              return col._id === newTask.statusId
            case 'subStatus':
              return col._id === newTask.substatusId
            case 'topic':
              return newTask.topicIds.includes(col._id)
            default:
              return false
          }
        })

        if (targetColumnIndex !== -1) {
          newColumns[targetColumnIndex] = {
            ...newColumns[targetColumnIndex],
            tasks: [...newColumns[targetColumnIndex].tasks, taskWithId],
          }
        }

        return newColumns
      })

      setAddTaskOpen(false)
      onAdd(newTask)
    },
    [boardType, onAdd, setColumnState]
  )

  const handleEditComment = useCallback(
    (commentId: string, newText: string, taskId: string) => {
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
    },
    [onEditComment, setColumnState]
  )

  const handleCloseTask = useCallback(
    (taskId: string) => {
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
    },
    [setColumnState]
  )

  // Find current task for show dialog
  const currentShowTask = useMemo(() => {
    return columnState
      .flatMap(col => col.tasks)
      .find(task => task._id === showTaskOpen)
  }, [columnState, showTaskOpen])

  // Toolbar buttons
  const buttons = useMemo(
    () => [
      { text: 'Create Task', onClick: () => setAddTaskOpen(true) },
      {
        text: 'Show Task',
        onClick: () => {
          if (selectedTaskId) {
            setShowTaskOpen(selectedTaskId)
          }
        },
        disabled: !selectedTaskId,
      },
    ],
    [selectedTaskId]
  )

  return (
    <div style={computedStyles.container}>
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
          columns={filteredColumnState}
          selectedTaskId={selectedTaskId}
          onTaskSelect={handleTaskSelect}
          columnDragAndDrop={columnDragAndDrop}
          taskDragAndDrop={taskDragAndDrop}
          styles={{ theme: styles?.theme }}
        />
      </div>

      {/* Add Task Forms */}
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

      {/* Show Task Dialog */}
      {currentShowTask && (
        <ShowTask
          open={true}
          onClose={() => setShowTaskOpen('-1')}
          taskId={showTaskOpen}
          taskTitle={currentShowTask.title}
          createdBy={currentShowTask.createdBy}
          description={currentShowTask.description}
          comments={currentShowTask.comments}
          customerAssigned={currentShowTask.customerAssigned}
          severity={currentShowTask.severity}
          schedulingQueue={currentShowTask.schedulingQueue}
          status={currentShowTask.status}
          subStatus={currentShowTask.subStatus}
          topics={currentShowTask.topicLabels}
          knowledgebaseArticles={currentShowTask.kbArticles}
          teamMemberAssigned={currentShowTask.teamMember}
          nextActionDate={currentShowTask.nextActionDate}
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

export default ProjectBoard
