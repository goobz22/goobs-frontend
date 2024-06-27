'use client'
import React from 'react'
import CustomGrid, { columnconfig, gridconfig } from '../../components/Grid'
import useGridTypography, {
  ExtendedTypographyProps as TypographyProps,
} from './Structure/typography/useGridTypography'
import useStyledComponent, {
  ExtendedStyledComponentProps,
} from '../../components/Content/Structure/styledcomponent/useStyledComponent'
import useGridRadioGroup, {
  ExtendedRadioGroupProps,
} from '../../components/Content/Structure/radiogroup/useGridRadioGroup'
import useConfirmationInput, {
  ExtendedConfirmationCodeInputsProps,
} from '../../components/Content/Structure/confirmationinput/useConfirmationInput'
import useLink, {
  ExtendedTypographyProps as LinkProps,
} from '../../components/Content/Structure/link/useLink'
import useImage, {
  ExtendedImageProps,
} from '../../components/Content/Structure/image/useImage'
import useButton, {
  ExtendedButtonProps,
} from '../../components/Content/Structure/button/useButton'

export interface ContentSectionProps {
  gridconfig?: gridconfig
  confirmationcodeinput?:
    | ExtendedConfirmationCodeInputsProps
    | ExtendedConfirmationCodeInputsProps[]
  typography?: TypographyProps | TypographyProps[]
  styledcomponent?:
    | ExtendedStyledComponentProps
    | ExtendedStyledComponentProps[]
  radiogroup?: ExtendedRadioGroupProps | ExtendedRadioGroupProps[]
  link?: LinkProps | LinkProps[]
  button?: ExtendedButtonProps | ExtendedButtonProps[]
  image?: ExtendedImageProps | ExtendedImageProps[]
}

const RenderContent: React.FC<ContentSectionProps> = ({
  gridconfig,
  ...props
}) => {
  let columnConfigs: columnconfig[] = []

  const paragraph = useGridTypography(props)
  if (paragraph) {
    if (Array.isArray(paragraph)) {
      columnConfigs = columnConfigs.concat(paragraph)
    } else {
      columnConfigs.push(paragraph)
    }
  }

  const styledComponent = useStyledComponent(props)
  if (styledComponent) {
    columnConfigs = columnConfigs.concat(styledComponent)
  }

  const radioGroup = useGridRadioGroup(props)
  if (radioGroup) {
    columnConfigs = columnConfigs.concat(radioGroup)
  }

  const confirmationInput = useConfirmationInput({
    confirmationcodeinput: props.confirmationcodeinput,
  })
  if (confirmationInput) {
    if (Array.isArray(confirmationInput)) {
      columnConfigs = columnConfigs.concat(confirmationInput)
    } else {
      columnConfigs.push(confirmationInput)
    }
  }

  const links = useLink(props)
  if (links) {
    columnConfigs = columnConfigs.concat(links)
  }

  const button = useButton(props)
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

  const image = useImage(props)
  if (image) {
    columnConfigs = columnConfigs.concat(image)
  }

  return <CustomGrid gridconfig={gridconfig} columnconfig={columnConfigs} />
}

export default function ContentSection({
  grids,
}: {
  grids: ContentSectionProps[]
}) {
  return (
    <>
      {grids.map((grid, index) => (
        <RenderContent key={index} {...grid} />
      ))}
    </>
  )
}
