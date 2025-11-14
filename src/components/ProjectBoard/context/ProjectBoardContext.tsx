'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import type {
  ColumnData,
  ViewState,
  AnimationOrigin,
  AddTaskFormType,
} from '../types'

interface ProjectBoardContextValue {
  columns: ColumnData[]
  setColumns: (
    columns: ColumnData[] | ((prev: ColumnData[]) => ColumnData[])
  ) => void
  viewState: ViewState
  setViewState: (state: ViewState) => void
  animationOrigin: AnimationOrigin | null
  setAnimationOrigin: (origin: AnimationOrigin | null) => void
  activeAddTaskForm: AddTaskFormType | null
  setActiveAddTaskForm: (form: AddTaskFormType | null) => void
  activeTaskId: string | null
  setActiveTaskId: (id: string | null) => void
}

const ProjectBoardContext = createContext<ProjectBoardContextValue | undefined>(
  undefined
)

interface ProjectBoardProviderProps {
  children: ReactNode
}

export function ProjectBoardProvider({ children }: ProjectBoardProviderProps) {
  const [columns, setColumns] = useState<ColumnData[]>([])
  const [viewState, setViewState] = useState<ViewState>('board')
  const [animationOrigin, setAnimationOrigin] =
    useState<AnimationOrigin | null>(null)
  const [activeAddTaskForm, setActiveAddTaskForm] =
    useState<AddTaskFormType | null>(null)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  const value: ProjectBoardContextValue = {
    columns,
    setColumns,
    viewState,
    setViewState,
    animationOrigin,
    setAnimationOrigin,
    activeAddTaskForm,
    setActiveAddTaskForm,
    activeTaskId,
    setActiveTaskId,
  }

  return (
    <ProjectBoardContext.Provider value={value}>
      {children}
    </ProjectBoardContext.Provider>
  )
}

export function useProjectBoard() {
  const context = useContext(ProjectBoardContext)
  if (context === undefined) {
    throw new Error(
      'useProjectBoard must be used within a ProjectBoardProvider'
    )
  }
  return context
}
