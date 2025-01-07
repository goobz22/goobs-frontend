// src\components\FormProjectBoard\index.tsx
'use client'

import React from 'react'
import { Box } from '@mui/material'
import ContentSection from '../../Content'
import type { ProjectBoardProps } from '../../ProjectBoard'

/**
 * Props for FormProjectBoard.
 * It's similar to FormDataGrid but for a project board.
 */
export interface FormProjectBoardProps {
  /** Title text displayed above the project board. */
  title: string

  /** Description text displayed under the title but above the project board. */
  description: string

  /** The data for the ProjectBoard (columns, tasks, etc.). */
  projectboard: ProjectBoardProps
}

/**
 * FormProjectBoard replicates the idea of FormDataGrid:
 * - Logs the props
 * - Displays title/description
 * - Renders the ProjectBoard through ContentSection (which uses useProjectBoard).
 */
function FormProjectBoard({
  title,
  description,
  projectboard,
}: FormProjectBoardProps) {
  // Logging, similar to FormDataGrid
  console.log('FormProjectBoard props:', {
    title,
    description,
    projectboard,
  })

  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        overflow: 'hidden',
        '& *': {
          overflow: 'hidden !important',
        },
      }}
    >
      {/* Header area */}
      <Box
        sx={{
          marginTop: 1,
          marginBottom: 1,
          width: '100%',
        }}
      >
        <Box
          sx={{
            marginBottom: 0.5,
            width: '100%',
            textAlign: 'left',
            fontFamily: 'Merriweather',
            marginLeft: 2,
            fontSize: '1.5rem',
            fontWeight: 400,
            color: 'black',
          }}
        >
          {title}
        </Box>
        <Box
          sx={{
            width: '100%',
            textAlign: 'left',
            fontFamily: 'Merriweather',
            fontSize: '1.25rem',
            marginLeft: 2,
            fontWeight: 400,
            color: 'black',
          }}
        >
          {description}
        </Box>
      </Box>

      {/* Use ContentSection to render the "projectboard" (via useProjectBoard). */}
      <ContentSection
        grids={[
          {
            grid: {
              // If you want a specific width or other config, put it here
              gridconfig: { gridwidth: '100%' },
            },
            projectboard: {
              /**
               * We must pass ALL the props that the final ProjectBoard expects:
               * - columns
               * - tasks
               * - rawStatuses, rawSubStatuses, etc.
               * - variant
               * - boardType
               * - onUpdateTask
               * - and optionally "company" if used
               */
              variant: projectboard.variant, // <-- IMPORTANT
              boardType: projectboard.boardType, // <-- IMPORTANT

              company: projectboard.company,

              columns: projectboard.columns,
              tasks: projectboard.tasks,

              rawStatuses: projectboard.rawStatuses,
              rawSubStatuses: projectboard.rawSubStatuses,
              rawTopics: projectboard.rawTopics,
              rawQueues: projectboard.rawQueues,
              rawArticles: projectboard.rawArticles,
              rawCustomers: projectboard.rawCustomers,
              rawEmployees: projectboard.rawEmployees,
              rawSeverityLevels: projectboard.rawSeverityLevels,

              onUpdateTask: projectboard.onUpdateTask, // <-- If you want ProjectBoard to update tasks

              // If you want to position it in a certain row/column in your custom grid:
              columnconfig: {
                row: 1,
                column: 1,
                columnwidth: '100%',
              },
            },
          },
        ]}
      />
    </Box>
  )
}

export default FormProjectBoard
