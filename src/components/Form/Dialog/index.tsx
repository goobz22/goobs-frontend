'use client'

import React, { useMemo } from 'react'
import { Box } from '@mui/material'
import ContentSection, { ContentSectionProps } from '../../Content'
import { TypographyProps } from '../../Typography'
import CustomButton, { CustomButtonProps } from '../../Button'
import { white } from '../../../styles/palette'

export interface CustomDialogProps {
  title?: string
  description?: string
  grids?: ContentSectionProps['grids']
  content?: React.ReactNode
  width?: number
  /** Optional array of button props for footer buttons */
  buttons?: CustomButtonProps[]
}

function CustomDialog({
  title,
  description,
  grids,
  content,
  width = 450,
  buttons,
}: CustomDialogProps) {
  const headerGrid = useMemo(
    (): ContentSectionProps['grids'][0] => ({
      typography: [
        {
          text: title,
          fontvariant: 'merrih4',
          fontcolor: 'black',
        },
        {
          text: description,
          fontvariant: 'merrih5',
          fontcolor: 'black',
        },
      ] as TypographyProps[],
    }),
    [title, description]
  )

  const renderHeader = useMemo(
    () => <ContentSection grids={[headerGrid]} />,
    [headerGrid]
  )

  const renderButtons = useMemo(() => {
    if (!buttons || buttons.length === 0) return null

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 2,
          marginTop: '15px',
        }}
      >
        {buttons.map((buttonProps, index) => (
          <CustomButton key={index} {...buttonProps} />
        ))}
      </Box>
    )
  }, [buttons])

  return (
    <Box
      sx={{
        width: `${width}px`,
        maxWidth: '100%',
        borderRadius: '16px',
        boxShadow: 3,
        margin: '0 auto',
        padding: 3,
        bgcolor: white.main,
      }}
    >
      {renderHeader}
      {content || (grids && <ContentSection grids={grids} />)}
      {renderButtons}
    </Box>
  )
}

export default CustomDialog
