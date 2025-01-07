'use client'
import React from 'react'
import ProjectBoard, { ProjectBoardProps } from '../../../ProjectBoard'
import { columnconfig, cellconfig } from '../../../Grid'

/**
 * This mirrors the pattern of your Extended*Props from useTextField, etc.
 * ExtendedProjectBoardProps extends your ProjectBoardProps but also includes:
 * - optional columnconfig for row/col positioning
 * - optional cellconfig for styling
 *
 * If you’d like to pass more custom props, add them here.
 */
type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

export interface ExtendedProjectBoardProps extends ProjectBoardProps {
  columnconfig?: ExtendedColumnConfig
  cellconfig?: cellconfig
}

const useProjectBoard = (grid: {
  /**
   * We can accept a single ExtendedProjectBoardProps or an array of them.
   * This matches how your existing hooks handle single vs array items.
   */
  projectboard?: ExtendedProjectBoardProps | ExtendedProjectBoardProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.projectboard) return null

  // This helper function converts a single ExtendedProjectBoardProps
  // into a columnconfig object for your <CustomGrid> layout system.
  const renderProjectBoard = (
    item: ExtendedProjectBoardProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      // In your existing `ProjectBoardProps`, you have `columns` plus any other props.
      columns,
      ...restProps
    } = item

    // Ensure columnconfig is valid
    if (
      !itemColumnConfig ||
      typeof itemColumnConfig.row !== 'number' ||
      typeof itemColumnConfig.column !== 'number'
    ) {
      throw new Error(
        'columnconfig must be an object with numeric row and column'
      )
    }

    // Build the final columnconfig
    const mergedConfig: columnconfig = {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
      },
      component: (
        <ProjectBoard
          key={`projectboard-${index}`}
          columns={columns}
          {...restProps}
        />
      ),
    }

    return mergedConfig
  }

  if (Array.isArray(grid.projectboard)) {
    // If it's an array, map each item to a columnconfig
    return grid.projectboard.map(renderProjectBoard)
  } else {
    // If it's a single item, just render one
    return renderProjectBoard(grid.projectboard, 0)
  }
}

export default useProjectBoard
