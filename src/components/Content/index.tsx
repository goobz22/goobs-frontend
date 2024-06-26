'use client'

import React from 'react'
import { ContentSectionProps } from './../../types/content'
import { CustomGrid } from 'goobs-repo'
import useGridTitle from './../../components/Content/Structure/title/useGridTitle'
import useGridSubtitle from './../../components/Content/Structure/subtitle/useGridSubtitle'
import useGridParagraph from './../../components/Content/Structure/paragraph/useGridParagraph'
import useBodyTitle from './../../components/Content/Structure/bodytitle/useBodyTitle'
import useStyledComponent from './../../components/Content/Structure/styledcomponent/useStyledComponent'
import useGridRadioGroup from './../../components/Content/Structure/radiogroup/useGridRadioGroup'
import useConfirmationInput from './../../components/Content/Structure/confirmationinput/useConfirmationInput'
import useLink from './../../components/Content/Structure/link/useLink'
import useImage from './../../components/Content/Structure/image/useImage'
import useButton from './../../components/Content/Structure/button/useButton'
import useHelperFooter from './../../components/Content/Structure/helperfooter/useHelperFooter'
import { columnconfig } from 'goobs-repo'

const RenderContent = ({
  grid,
}: {
  grid: ContentSectionProps['grids'][number]
}) => {
  let columnConfigs: columnconfig[] = []

  const title = useGridTitle(grid)
  if (title) {
    if (Array.isArray(title)) {
      columnConfigs = columnConfigs.concat(title)
    } else {
      columnConfigs.push(title)
    }
  }

  const subtitle = useGridSubtitle(grid)
  if (subtitle) {
    if (Array.isArray(subtitle)) {
      columnConfigs = columnConfigs.concat(subtitle)
    } else {
      columnConfigs.push(subtitle)
    }
  }

  const paragraph = useGridParagraph(grid)
  if (paragraph) {
    if (Array.isArray(paragraph)) {
      columnConfigs = columnConfigs.concat(paragraph)
    } else {
      columnConfigs.push(paragraph)
    }
  }

  const bodytitle = useBodyTitle(grid)
  if (bodytitle) {
    if (Array.isArray(bodytitle)) {
      columnConfigs = columnConfigs.concat(bodytitle)
    } else {
      columnConfigs.push(bodytitle)
    }
  }

  const styledComponent = useStyledComponent(grid)
  if (styledComponent) {
    columnConfigs = columnConfigs.concat(styledComponent)
  }

  const radioGroup = useGridRadioGroup(grid)
  if (radioGroup) {
    columnConfigs = columnConfigs.concat(radioGroup)
  }

  const confirmationInput = useConfirmationInput(grid)
  if (confirmationInput) {
    if (Array.isArray(confirmationInput)) {
      columnConfigs = columnConfigs.concat(confirmationInput)
    } else {
      columnConfigs.push(confirmationInput)
    }
  }

  const links = useLink(grid)
  if (links) {
    columnConfigs = columnConfigs.concat(links)
  }

  const button = useButton(grid)
  if (button) {
    if (Array.isArray(button)) {
      button.forEach(btn => {
        if (btn) {
          columnConfigs.push(btn)
        }
      })
    } else {
      columnConfigs.push(button)
    }
  }

  const image = useImage(grid)
  if (image) {
    columnConfigs = columnConfigs.concat(image)
  }

  const helperFooter = useHelperFooter(grid)
  if (helperFooter) {
    if (Array.isArray(helperFooter)) {
      columnConfigs = columnConfigs.concat(helperFooter)
    } else {
      columnConfigs.push(helperFooter)
    }
  }

  return (
    <CustomGrid
      gridconfig={grid.grid.gridconfig}
      columnconfig={columnConfigs}
    />
  )
}

export default function ContentSection({ grids }: ContentSectionProps) {
  return (
    <>
      {grids.map((grid, index) => (
        <RenderContent key={index} grid={grid} />
      ))}
    </>
  )
}
