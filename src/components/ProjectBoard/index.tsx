/**
 * @fileoverview Defines the ProjectBoard component for managing project tasks with drag-and-drop functionality.
 * It supports light, dark, and sacred themes with comprehensive customization options.
 * Now with inline view transitions (Wolken-style) instead of dialog popups.
 */
'use client'

import React, { useMemo, useEffect, useState, useCallback } from 'react'
import {
  useProjectBoard,
  ProjectBoardProvider,
} from './context/ProjectBoardContext'

import Toolbar from '../Toolbar'
import { InlineShowTask } from './forms/ShowTask/inline'
import { InlineAddTask } from './forms/AddTask/inline'
import {
  ProjectBoardProps,
  ColumnData,
  Task,
  BoardType,
  AddTaskFormType,
} from './types'

import { useColumnDragAndDrop } from './utils/useDragandDrop/columns'
import { useTaskDragAndDrop } from './utils/useDragandDrop/tasks'
import Board from './board'
import { getProjectBoardStyles } from '../../theme'
import { Breadcrumb } from './Breadcrumb'
import { AnimationWrapper } from './AnimationWrapper'

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
  rawProducts,
  rawServices,
  rawRegions,
  rawSeverityLevels,
  onEdit,
  onDelete,
  onEditComment,
  onAdd,
  onComment,
  currentUser,
  customerId,
  companyId,
  preferDropdown,
  styles,
  permissions,
  meetings,
  onScheduleMeeting,
  onCancelMeeting,
  onConfirmMeeting,
  onRescheduleMeeting,
  currentDate,
  onUpdateCompanyNotes,
  onUpdateCustomerNotes,
  onCaseUpdate,
  employees,
  administrators,
}: ProjectBoardProps) {
  const {
    columns: columnState,
    setColumns: setColumnState,
    viewState,
    setViewState,
    animationOrigin,
    setAnimationOrigin,
    activeAddTaskForm,
    setActiveAddTaskForm,
    activeTaskId,
    setActiveTaskId,
  } = useProjectBoard()

  const mergedColumns = useMemo<ColumnData[]>(
    () => mergeColumnsAndTasks(columns, tasks, boardType),
    [columns, tasks, boardType]
  )

  const isDisabled = styles?.disabled

  const computedStyles = useMemo(
    () => getProjectBoardStyles(styles, isDisabled),
    [styles, isDisabled]
  )

  useEffect(() => {
    setColumnState(mergedColumns)
  }, [mergedColumns, setColumnState])

  // Local state
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [productServiceFilter, setProductServiceFilter] =
    useState<string>('all')

  // Drag and drop hooks
  const columnDragAndDrop = useColumnDragAndDrop(columnState, setColumnState)
  const taskDragAndDrop = useTaskDragAndDrop()

  // Task selection handler - only toggles selection, doesn't open the task
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

  // Product/Service filter handler
  const handleProductServiceFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setProductServiceFilter(e.target.value)
    },
    []
  )

  // Filter columns based on search and product/service filter
  const filteredColumnState = useMemo(() => {
    let filtered = columnState

    // Apply product/service filter
    if (productServiceFilter !== 'all') {
      filtered = filtered.map(col => {
        const filteredTasks = col.tasks.filter(task => {
          // Check if task has productId or serviceId
          if (productServiceFilter === 'product') {
            return task.productId || task.productOrService === 'product'
          } else if (productServiceFilter === 'service') {
            return task.serviceId || task.productOrService === 'service'
          }
          return true
        })
        return { ...col, tasks: filteredTasks }
      })
    }

    // Apply search filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase()
      filtered = filtered.map(col => {
        const filteredTasks = col.tasks.filter(
          t =>
            t.title.toLowerCase().includes(lowerTerm) ||
            t.description.toLowerCase().includes(lowerTerm)
        )
        return { ...col, tasks: filteredTasks }
      })
    }

    return filtered
  }, [columnState, searchTerm, productServiceFilter])

  // Handle back to board navigation (defined early so other callbacks can use it)
  const handleBackToBoard = useCallback(() => {
    setViewState('board')
    setAnimationOrigin(null)
    setActiveAddTaskForm(null)
    setActiveTaskId(null)
  }, [setViewState, setAnimationOrigin, setActiveAddTaskForm, setActiveTaskId])

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
          const currentColumn = newColumns[targetColumnIndex]!
          newColumns[targetColumnIndex] = {
            _id: currentColumn._id,
            title: currentColumn.title,
            description: currentColumn.description,
            tasks: [...currentColumn.tasks, taskWithId],
          }
        }

        return newColumns
      })

      // Return to board view
      handleBackToBoard()
      onAdd(newTask)
    },
    [boardType, onAdd, setColumnState, handleBackToBoard]
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

  // Find current task for show view
  const currentShowTask = useMemo(() => {
    if (!activeTaskId) return null
    return columnState
      .flatMap(col => col.tasks)
      .find(task => task._id === activeTaskId)
  }, [columnState, activeTaskId])

  // Handle Create Task button click
  // Note: Animation origin is set to null for simplicity - the animation
  // will expand from center of viewport
  const handleCreateTaskClick = useCallback(() => {
    setAnimationOrigin(null)

    // Determine which form to show based on variant and preferDropdown
    let formType: AddTaskFormType = 'customer'
    if (variant === 'administrator') {
      formType =
        preferDropdown === true ||
        (preferDropdown !== false && rawCompanies && rawCompanies.length > 0)
          ? 'administratorCompanyDropdown'
          : 'administratorCompanyProvided'
    } else if (variant === 'company') {
      formType =
        preferDropdown === true ||
        (preferDropdown !== false && rawCustomers && rawCustomers.length > 0)
          ? 'companyCustomerDropdown'
          : 'companyCustomerProvided'
    }

    setActiveAddTaskForm(formType)
    setViewState('addTask')
  }, [
    setAnimationOrigin,
    variant,
    preferDropdown,
    rawCompanies,
    rawCustomers,
    setActiveAddTaskForm,
    setViewState,
  ])

  // Handle Show Task button click
  const handleShowTaskClick = useCallback(() => {
    if (!selectedTaskId) return

    // Verify the task exists before transitioning
    const taskExists = columnState
      .flatMap(col => col.tasks)
      .some(task => task._id === selectedTaskId)

    if (!taskExists) {
      console.warn(`Task with ID ${selectedTaskId} not found in columnState`)
      return
    }

    // Animation origin is set to null for simplicity
    setAnimationOrigin(null)
    setActiveTaskId(selectedTaskId)
    setViewState('showTask')
  }, [
    selectedTaskId,
    columnState,
    setAnimationOrigin,
    setActiveTaskId,
    setViewState,
  ])

  // Toolbar buttons - respect permissions
  const buttons = useMemo(() => {
    const btns = []
    // Only show Create Task button if user has write permissions
    if (!permissions || permissions.access === 'write') {
      btns.push({
        text: 'Create Task',
        onClick: handleCreateTaskClick,
      })
    }
    btns.push({
      text: 'Manage',
      onClick: handleShowTaskClick,
      disabled: !selectedTaskId,
    })
    return btns
  }, [selectedTaskId, permissions, handleCreateTaskClick, handleShowTaskClick])

  // Render add task form based on active form type
  const renderAddTaskForm = () => {
    if (viewState !== 'addTask' || !activeAddTaskForm) return null

    // Unified inline form for all variants
    return (
      <InlineAddTask
        onAdd={handleAddTask}
        onCancel={handleBackToBoard}
        topics={rawTopics}
        severityLevels={rawSeverityLevels}
        statuses={rawStatuses}
        subStatuses={rawSubStatuses}
        createdUserId={currentUser._id}
        companyId={companyId}
        customerId={customerId}
        rawCompanies={
          activeAddTaskForm === 'administratorCompanyDropdown'
            ? rawCompanies
            : []
        }
        rawCustomers={
          activeAddTaskForm === 'companyCustomerDropdown'
            ? (rawCustomers ?? [])
            : []
        }
        rawProducts={rawProducts ?? []}
        rawServices={rawServices}
        rawRegions={rawRegions}
        knowledgebaseArticles={rawArticles}
        styles={styles}
      />
    )
  }

  // Render show task form
  const renderShowTaskForm = () => {
    if (viewState !== 'showTask' || !currentShowTask || !activeTaskId)
      return null

    const editCallback = (updatedData: any) => {
      if (!permissions || permissions.access === 'write') {
        onEdit({ _id: activeTaskId, ...updatedData })
      }
    }

    const deleteCallback = () => {
      if (!permissions || permissions.access === 'write') {
        onDelete({ _id: activeTaskId })
        handleBackToBoard()
      }
    }

    const commentCallback = (text: string, _id: string) => {
      if (!permissions || permissions.access === 'write') {
        onComment(text, _id)
      }
    }

    const editCommentCallback = (commentId: string, newText: string) => {
      if (!permissions || permissions.access === 'write') {
        handleEditComment(commentId, newText, activeTaskId)
      }
    }

    return (
      <InlineShowTask
        taskId={activeTaskId}
        taskTitle={currentShowTask.title}
        createdBy={currentShowTask.createdBy}
        description={currentShowTask.description}
        comments={currentShowTask.comments}
        caseUpdates={currentShowTask.caseUpdates}
        customerAssigned={currentShowTask.customerAssigned}
        associatedCompanyId={currentShowTask.companyId}
        {...(currentShowTask.companyInternalNotes !== undefined && {
          companyInternalNotes: currentShowTask.companyInternalNotes,
        })}
        {...(onUpdateCompanyNotes && { onUpdateCompanyNotes })}
        associatedCustomerId={currentShowTask.customerId}
        {...(currentShowTask.customerInternalNotes !== undefined && {
          customerInternalNotes: currentShowTask.customerInternalNotes,
        })}
        severity={currentShowTask.severity}
        schedulingQueue={currentShowTask.schedulingQueue}
        status={currentShowTask.status}
        subStatus={currentShowTask.subStatus}
        topics={currentShowTask.topicLabels}
        knowledgebaseArticles={currentShowTask.kbArticles}
        teamMemberAssigned={currentShowTask.teamMember}
        nextActionDate={currentShowTask.nextActionDate}
        currentUserName={`${currentUser.firstName} ${currentUser.lastName}`}
        productOrService={currentShowTask.productOrService}
        productServiceName={currentShowTask.productServiceName}
        productId={currentShowTask.productId}
        serviceId={currentShowTask.serviceId}
        region={currentShowTask.region}
        onEdit={editCallback}
        onDelete={deleteCallback}
        onComment={commentCallback}
        onEditComment={editCommentCallback}
        {...(onUpdateCustomerNotes && { onUpdateCustomerNotes })}
        onBack={handleBackToBoard}
        severityOptions={rawSeverityLevels}
        schedulingQueueOptions={rawQueues}
        statusOptions={rawStatuses}
        subStatusOptions={rawSubStatuses}
        topicOptions={rawTopics}
        knowledgebaseArticleOptions={rawArticles}
        teamMemberOptions={rawEmployees}
        rawProducts={rawProducts ?? []}
        rawServices={rawServices}
        regionOptions={rawRegions}
        styles={styles}
        meetings={meetings.filter(m => m.taskId === activeTaskId)}
        onScheduleMeeting={onScheduleMeeting}
        onCancelMeeting={onCancelMeeting}
        onConfirmMeeting={onConfirmMeeting}
        onRescheduleMeeting={onRescheduleMeeting}
        currentDate={currentDate}
        {...(onCaseUpdate && { onCaseUpdate })}
        {...(employees && { employees })}
        {...(administrators && { administrators })}
      />
    )
  }

  return (
    <div style={computedStyles.container}>
      {/* Show breadcrumb when not on board view */}
      {viewState !== 'board' && (
        <Breadcrumb
          viewState={viewState}
          onBack={handleBackToBoard}
          {...(styles && { styles })}
        />
      )}

      {/* Board View */}
      {viewState === 'board' && (
        <>
          <Toolbar
            buttons={buttons}
            filterDropdown={{
              label: 'Type',
              options: [
                { value: 'all', _id: 'all' },
                { value: 'product', _id: 'product' },
                { value: 'service', _id: 'service' },
              ],
              value: productServiceFilter,
              onChange: handleProductServiceFilterChange,
            }}
            searchbarProps={{
              label: 'Search...',
              value: searchTerm,
              onChange: handleSearchChange,
              styles: { theme: styles?.theme || 'light' },
            }}
            styles={{ theme: styles?.theme || 'light' }}
          />

          <div style={computedStyles.toolbarContainer}>
            <Board
              columns={filteredColumnState}
              selectedTaskId={selectedTaskId}
              onTaskSelect={handleTaskSelect}
              columnDragAndDrop={columnDragAndDrop}
              taskDragAndDrop={taskDragAndDrop}
              styles={{ theme: styles?.theme || 'light' }}
            />
          </div>
        </>
      )}

      {/* Add Task Form View - Inline with Animation */}
      <AnimationWrapper
        origin={animationOrigin}
        isVisible={viewState === 'addTask'}
        {...(styles && { styles })}
      >
        {renderAddTaskForm()}
      </AnimationWrapper>

      {/* Show Task Form View - Inline with Animation */}
      <AnimationWrapper
        origin={animationOrigin}
        isVisible={viewState === 'showTask'}
        {...(styles && { styles })}
      >
        {renderShowTaskForm()}
      </AnimationWrapper>
    </div>
  )
}

// --------------------------------------------------------------------------
// MAIN PROJECT BOARD WRAPPER COMPONENT
// --------------------------------------------------------------------------

function ProjectBoard(props: ProjectBoardProps) {
  return (
    <ProjectBoardProvider>
      <ProjectBoardContent {...props} />
    </ProjectBoardProvider>
  )
}

export default ProjectBoard
