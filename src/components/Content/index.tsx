'use client'

import React from 'react'
import CustomGrid, { columnconfig, gridconfig } from '../../components/Grid'
import useGridTypography, {
  ExtendedTypographyProps as TypographyProps,
} from './Structure/typography/useGridTypography'
import useGridRadioGroup, {
  ExtendedRadioGroupProps,
} from './Structure/radiogroup/useRadioGroup'
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
import useTextField, {
  ExtendedTextFieldProps,
} from './Structure/textfield/useTextField'
import useDateField, {
  ExtendedDateFieldProps,
} from './Structure/datefield/useDateField'
import useDropdown, {
  ExtendedDropdownProps,
} from './Structure/dropdown/useDropdown'
import useIncrementNumberField, {
  ExtendedIncrementNumberFieldProps,
} from './Structure/incremementNumberField/useIncremementNumberField'
import useSearchbar, {
  ExtendedSearchbarProps,
} from './Structure/searchbar/useSearchbar'
import useNumberField, {
  ExtendedNumberFieldProps,
} from './Structure/numberField/useNumberField'
import usePasswordField, {
  ExtendedPasswordFieldProps,
} from './Structure/passwordField/usePasswordField'

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
    radiogroup?: ExtendedRadioGroupProps | ExtendedRadioGroupProps[]
    link?: LinkProps | LinkProps[]
    button?: ExtendedButtonProps | ExtendedButtonProps[]
    image?: ExtendedImageProps | ExtendedImageProps[]
    pricing?: ExtendedPricingProps
    stepper?: ExtendedStepperProps | ExtendedStepperProps[]
    transferlist?: ExtendedTransferListProps | ExtendedTransferListProps[]
    card?: ExtendedCardProps | ExtendedCardProps[]
    codecopy?: ExtendedCodeCopyProps | ExtendedCodeCopyProps[]
    textfield?: ExtendedTextFieldProps | ExtendedTextFieldProps[]
    datefield?: ExtendedDateFieldProps | ExtendedDateFieldProps[]
    dropdown?: ExtendedDropdownProps | ExtendedDropdownProps[]
    incrementNumberField?:
      | ExtendedIncrementNumberFieldProps
      | ExtendedIncrementNumberFieldProps[]
    searchbar?: ExtendedSearchbarProps | ExtendedSearchbarProps[]
    numberField?: ExtendedNumberFieldProps | ExtendedNumberFieldProps[]
    passwordField?: ExtendedPasswordFieldProps | ExtendedPasswordFieldProps[]
  }>
  width?: number
}

/**
 * RenderContent component handles the rendering of various content elements
 * based on the provided configuration.
 */
const RenderContent: React.FC<
  ContentSectionProps['grids'][0] & { width?: number }
> = ({ grid, width, ...props }) => {
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
  addToColumnConfigs(useTextField(props))
  addToColumnConfigs(useDateField(props))
  addToColumnConfigs(useDropdown(props))
  addToColumnConfigs(
    useIncrementNumberField({
      incrementNumberField: props.incrementNumberField,
    })
  )
  addToColumnConfigs(useSearchbar(props))
  addToColumnConfigs(useNumberField({ numberField: props.numberField }))
  addToColumnConfigs(usePasswordField({ passwordField: props.passwordField }))

  const updatedGridConfig: gridconfig = {
    ...grid.gridconfig,
    gridwidth: width ? `${width}px` : grid.gridconfig?.gridwidth,
  }

  return (
    <CustomGrid gridconfig={updatedGridConfig} columnconfig={columnConfigs} />
  )
}

/**
 * ContentSection component renders multiple grids based on the provided configuration.
 * @param grids An array of ContentSectionProps, each representing a grid to be rendered.
 * @param width Optional width for the content section, defaults to 450px if not provided.
 */
export default function ContentSection({ grids, width }: ContentSectionProps) {
  return (
    <>
      {grids.map((gridProps, index) => (
        <RenderContent key={index} {...gridProps} width={width} />
      ))}
    </>
  )
}
