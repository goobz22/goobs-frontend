'use client'
import React from 'react'
import CustomGrid, { columnconfig, gridconfig } from '../../components/Grid'
import useGridTitle, {
  ExtendedTypographyProps as TitleProps,
} from '../../components/Content/Structure/title/useGridTitle'
import useGridSubtitle, {
  ExtendedTypographyProps as SubtitleProps,
} from '../../components/Content/Structure/subtitle/useGridSubtitle'
import useGridParagraph, {
  ExtendedTypographyProps as ParagraphProps,
} from '../../components/Content/Structure/paragraph/useGridParagraph'
import useBodyTitle, {
  ExtendedTypographyProps as BodyTitleProps,
} from '../../components/Content/Structure/bodytitle/useBodyTitle'
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
import useHelperFooter, {
  ExtendedTypographyProps as HelperFooterProps,
} from '../../components/Content/Structure/helperfooter/useHelperFooter'

export interface ContentSectionProps {
  gridconfig?: gridconfig
  confirmationcodeinput?:
    | ExtendedConfirmationCodeInputsProps
    | ExtendedConfirmationCodeInputsProps[]
  title?: TitleProps | TitleProps[]
  subtitle?: SubtitleProps | SubtitleProps[]
  paragraph?: ParagraphProps | ParagraphProps[]
  bodytitle?: BodyTitleProps | BodyTitleProps[]
  styledcomponent?:
    | ExtendedStyledComponentProps
    | ExtendedStyledComponentProps[]
  radiogroup?: ExtendedRadioGroupProps | ExtendedRadioGroupProps[]
  link?: LinkProps | LinkProps[]
  button?: ExtendedButtonProps | ExtendedButtonProps[]
  image?: ExtendedImageProps | ExtendedImageProps[]
  helperfooter?: HelperFooterProps | HelperFooterProps[]
}

const RenderContent: React.FC<ContentSectionProps> = ({
  gridconfig,
  ...props
}) => {
  let columnConfigs: columnconfig[] = []

  const title = useGridTitle(props)
  if (title) {
    if (Array.isArray(title)) {
      columnConfigs = columnConfigs.concat(title)
    } else {
      columnConfigs.push(title)
    }
  }

  const subtitle = useGridSubtitle(props)
  if (subtitle) {
    if (Array.isArray(subtitle)) {
      columnConfigs = columnConfigs.concat(subtitle)
    } else {
      columnConfigs.push(subtitle)
    }
  }

  const paragraph = useGridParagraph(props)
  if (paragraph) {
    if (Array.isArray(paragraph)) {
      columnConfigs = columnConfigs.concat(paragraph)
    } else {
      columnConfigs.push(paragraph)
    }
  }

  const bodytitle = useBodyTitle(props)
  if (bodytitle) {
    if (Array.isArray(bodytitle)) {
      columnConfigs = columnConfigs.concat(bodytitle)
    } else {
      columnConfigs.push(bodytitle)
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

  const helperFooter = useHelperFooter(props)
  if (helperFooter) {
    if (Array.isArray(helperFooter)) {
      columnConfigs = columnConfigs.concat(helperFooter)
    } else {
      columnConfigs.push(helperFooter)
    }
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
