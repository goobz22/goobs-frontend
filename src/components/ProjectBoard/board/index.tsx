'use client'

import React from 'react'
import DesktopBoard from './desktop'
import MobileBoard from './mobile'
import TabletBoard from './tablet'

import type { ColumnData } from '../types'

export interface BoardProps {
  columns: ColumnData[]
  overflowColumns?: ColumnData[]
  selectedOverflowColumnId?: string
  onChangeSelectedOverflowColumn?: (colId: string) => void
  selectedTask: { colIndex: number; taskIndex: number } | null
  onSelectTask: (colIndex: number, taskIndex: number) => void
  onColumnDragStart: (e: React.DragEvent, columnIndex: number) => void
  onColumnDragOver: (e: React.DragEvent, columnIndex: number) => void
  onColumnDrop: (e: React.DragEvent, columnIndex: number) => void
  sacredtheme?: boolean
}

export default function Board(props: BoardProps) {
  const handleSelectTask = (colIndex: number, taskIndex: number) => {
    props.onSelectTask(colIndex, taskIndex)
  }

  const modifiedProps = {
    ...props,
    onSelectTask: handleSelectTask,
  }

  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .desktop-board { display: none; }
      .mobile-board { display: block; }
      .tablet-board { display: none; }

      @media (min-width: 768px) {
        .desktop-board { display: none; }
        .mobile-board { display: none; }
        .tablet-board { display: block; }
      }

      @media (min-width: 1280px) {
        .desktop-board { display: block; }
        .mobile-board { display: none; }
        .tablet-board { display: none; }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <>
      <div className="desktop-board">
        <DesktopBoard {...modifiedProps} />
      </div>
      <div className="mobile-board">
        <MobileBoard {...modifiedProps} />
      </div>
      <div className="tablet-board">
        <TabletBoard {...modifiedProps} />
      </div>
    </>
  )
}
