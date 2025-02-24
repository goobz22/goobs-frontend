'use client'
import React from 'react'
import ProjectBoard from '../../../ProjectBoard/'
import { ProjectBoardProps } from '../../../ProjectBoard/types'

const useProjectBoard = (props: {
  projectboard?: ProjectBoardProps | ProjectBoardProps[]
}): React.ReactElement[] | null => {
  if (!props.projectboard) return null

  const renderProjectBoard = (
    item: ProjectBoardProps,
    index: number
  ): React.ReactElement => {
    const { columns, ...restProps } = item

    return (
      <ProjectBoard
        key={`projectboard-${index}`}
        columns={columns}
        {...restProps}
      />
    )
  }

  if (Array.isArray(props.projectboard)) {
    return props.projectboard.map((item, index) =>
      renderProjectBoard(item, index)
    )
  } else {
    return [renderProjectBoard(props.projectboard, 0)]
  }
}

export default useProjectBoard
