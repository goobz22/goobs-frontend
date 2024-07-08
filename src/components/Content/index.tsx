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
import usePricing, {
  ExtendedPricingProps,
} from './../../components/Content/Structure/pricing/usePricing'
import useStepper, {
  ExtendedStepperProps,
} from './../../components/Content/Structure/stepper/useStepper'
import useTransferList, {
  ExtendedTransferListProps,
} from './../../components/Content/Structure/transferlist/useTransferList'
import useCard, {
  ExtendedCardProps,
} from './../../components/Content/Structure/card/useCard'
import useCodeCopy, {
  ExtendedCodeCopyProps,
} from './../../components/Content/Structure/codecopy/useCodeCopy'

/**
 * Props for the ContentSection component.
 * Includes configuration for various content elements.
 */
export interface ContentSectionProps {
  grids: Array<{
    grid: {
      gridconfig?: gridconfig
    }
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
    pricing?: ExtendedPricingProps
    stepper?: ExtendedStepperProps | ExtendedStepperProps[]
    transferlist?: ExtendedTransferListProps | ExtendedTransferListProps[]
    card?: ExtendedCardProps | ExtendedCardProps[]
    codecopy?: ExtendedCodeCopyProps | ExtendedCodeCopyProps[]
  }>
}

/**
 * RenderContent component handles the rendering of various content elements
 * based on the provided configuration.
 */
const RenderContent: React.FC<ContentSectionProps['grids'][0]> = ({
  grid,
  ...props
}) => {
  let columnConfigs: columnconfig[] = []

  // Helper function to add configurations to columnConfigs
  const addToColumnConfigs = (config: columnconfig | columnconfig[] | null) => {
    if (config) {
      if (Array.isArray(config)) {
        columnConfigs = columnConfigs.concat(config)
      } else {
        columnConfigs.push(config)
      }
    }
  }

  // Add configurations for each content type
  addToColumnConfigs(useGridTypography(props))
  addToColumnConfigs(useStyledComponent(props))
  addToColumnConfigs(useGridRadioGroup(props))
  addToColumnConfigs(
    useConfirmationInput({ confirmationcodeinput: props.confirmationcodeinput })
  )
  addToColumnConfigs(useLink(props))
  addToColumnConfigs(useButton(props))
  addToColumnConfigs(useImage(props))
  addToColumnConfigs(usePricing(props.pricing))
  addToColumnConfigs(useStepper(props))
  addToColumnConfigs(useTransferList(props))
  addToColumnConfigs(useCard(props))
  addToColumnConfigs(useCodeCopy(props))

  return (
    <CustomGrid gridconfig={grid.gridconfig} columnconfig={columnConfigs} />
  )
}

/**
 * ContentSection component renders multiple grids based on the provided configuration.
 * @param grids An array of ContentSectionProps, each representing a grid to be rendered.
 */
export default function ContentSection({ grids }: ContentSectionProps) {
  return (
    <>
      {grids.map((gridProps, index) => (
        <RenderContent key={index} {...gridProps} />
      ))}
    </>
  )
}
