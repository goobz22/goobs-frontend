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

/**
 * RenderContent component renders the content of a section based on the provided props.
 * It uses various custom hooks to generate column configurations for different content types.
 * @param props The props for the RenderContent component.
 * @returns The rendered content section.
 */
const RenderContent: React.FC<ContentSectionProps> = ({
  gridconfig,
  ...props
}) => {
  let columnConfigs: columnconfig[] = []

  /**
   * Generate column configurations for typography content.
   */
  const paragraph = useGridTypography(props)
  if (paragraph) {
    if (Array.isArray(paragraph)) {
      columnConfigs = columnConfigs.concat(paragraph)
    } else {
      columnConfigs.push(paragraph)
    }
  }

  /**
   * Generate column configurations for styled component content.
   */
  const styledComponent = useStyledComponent(props)
  if (styledComponent) {
    columnConfigs = columnConfigs.concat(styledComponent)
  }

  /**
   * Generate column configurations for radio group content.
   */
  const radioGroup = useGridRadioGroup(props)
  if (radioGroup) {
    columnConfigs = columnConfigs.concat(radioGroup)
  }

  /**
   * Generate column configurations for confirmation input content.
   */
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

  /**
   * Generate column configurations for link content.
   */
  const links = useLink(props)
  if (links) {
    columnConfigs = columnConfigs.concat(links)
  }

  /**
   * Generate column configurations for button content.
   */
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

  /**
   * Generate column configurations for image content.
   */
  const image = useImage(props)
  if (image) {
    columnConfigs = columnConfigs.concat(image)
  }

  return <CustomGrid gridconfig={gridconfig} columnconfig={columnConfigs} />
}

/**
 * ContentSection component renders a list of content sections based on the provided grids prop.
 * @param props The props for the ContentSection component.
 * @returns The rendered content sections.
 */
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
