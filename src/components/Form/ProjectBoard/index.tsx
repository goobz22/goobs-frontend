'use client'

import React from 'react'
import { Box } from '@mui/material'
import ContentSection from '../../Content'
// Import the ProjectBoardProps type from your types folder:
import { ProjectBoardProps } from '../../ProjectBoard/types'

/**
 * Props for FormProjectBoard:
 * - A simple container that shows a title, description,
 *   and then renders a ProjectBoard via ContentSection.
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
            projectboard: projectboard, // Pass the whole projectboard prop directly
          },
        ]}
      />
    </Box>
  )
}

export default FormProjectBoard
