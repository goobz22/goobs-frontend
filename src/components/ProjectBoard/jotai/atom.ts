'use client'

import { atom } from 'jotai'
import type {
  ColumnData,
  ViewState,
  AnimationOrigin,
  AddTaskFormType,
} from '../types'

/**
 * A global store of all columns (including the tasks in each column).
 */
export const columnsAtom = atom<ColumnData[]>([])

/**
 * Tracks which view is currently displayed: 'board', 'addTask', or 'showTask'.
 */
export const viewStateAtom = atom<ViewState>('board')

/**
 * Stores the coordinates of the element that triggered a view transition,
 * used for expand-from-origin animation. Null when no animation needed.
 */
export const animationOriginAtom = atom<AnimationOrigin | null>(null)

/**
 * Stores which AddTask form variant should be displayed when viewState is 'addTask'.
 */
export const activeAddTaskFormAtom = atom<AddTaskFormType | null>(null)

/**
 * Stores the task ID when showing/editing a specific task.
 */
export const activeTaskIdAtom = atom<string | null>(null)
