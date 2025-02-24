'use client'

import React from 'react'
import { Box, BoxProps } from '@mui/material'
import { TypographyProps } from '../Typography'
import { RadioGroupProps } from '../RadioGroup'
import { ConfirmationCodeInputsProps } from '../ConfirmationCodeInput'
import { TextFieldProps } from '../TextField'
import { CustomButtonProps } from '../Button'
import { ImageProps } from './Structure/image/useImage'
import { PricingProps } from '../PricingTable'
import { CustomStepperProps } from '../Stepper'
import { TransferListProps } from '../TransferList'
import { CardProps } from '../Card'
import { CodeCopyProps } from '../CodeCopy'
import { DateFieldProps } from '../DateField'
import { DropdownProps } from '../Dropdown'
import { IncrementNumberFieldProps } from '../IncrementNumberField'
import { SearchbarProps } from '../Searchbar'
import { NumberFieldProps } from '../NumberField'
import { PasswordFieldProps } from '../PasswordField'
import { QRCodeProps } from '../QRCode'
import { ComplexTextEditorProps } from '../ComplexTextEditor'
import { SearchableDropdownProps } from '../SearchableDropdown'
import { AccordionProps } from '../Accordion'
import { ProjectBoardProps } from '../ProjectBoard/types'
import { MultiSelectChipProps } from '../MultiSelect'
import { CheckboxProps } from '../Checkbox'
import { LinkProps } from './Structure/link/useLink'

// Import hooks
import useTypography from './Structure/typography/useTypography'
import useRadioGroup from './Structure/radiogroup/useRadioGroup'
import useConfirmationInput from './Structure/confirmationinput/useConfirmationInput'
import useLink from './Structure/link/useLink'
import useImage from './Structure/image/useImage'
import useButton from './Structure/button/useButton'
import usePricing from './Structure/pricing/usePricing'
import useStepper from './Structure/stepper/useStepper'
import useTransferList from './Structure/transferlist/useTransferList'
import useCard from './Structure/card/useCard'
import useCodeCopy from './Structure/codecopy/useCodeCopy'
import useTextField from './Structure/textfield/useTextField'
import useDateField from './Structure/datefield/useDateField'
import useDropdown from './Structure/dropdown/useDropdown'
import useIncrementNumberField from './Structure/incremementNumberField/useIncremementNumberField'
import useSearchbar from './Structure/searchbar/useSearchbar'
import useNumberField from './Structure/numberField/useNumberField'
import usePasswordField from './Structure/passwordField/usePasswordField'
import useQRCode from './Structure/qrcode/useQRCode'
import usePhoneNumber from './Structure/phoneNumber/usePhoneNumber'
import useCheckbox from './Structure/checkbox/useCheckbox'
import useComplexEditor from './Structure/complexeditor/useComplexEditor'
import useSearchableDropdown from './Structure/searchableDropdown/useSearchableDropdown'
import useAccordion from './Structure/accordion/useAccordion'
import useProjectBoard from './Structure/projectboard/useProjectBoard'
import useMultiSelect from './Structure/multiSelect/useMultiSelect'

export interface ContentSectionProps {
  grids: Array<{
    boxProps?: BoxProps
    confirmationcodeinput?:
      | ConfirmationCodeInputsProps
      | ConfirmationCodeInputsProps[]
    searchableDropdown?: SearchableDropdownProps | SearchableDropdownProps[]
    projectboard?: ProjectBoardProps | ProjectBoardProps[]
    complexeditor?: ComplexTextEditorProps | ComplexTextEditorProps[]
    typography?: TypographyProps | TypographyProps[]
    accordion?: AccordionProps | AccordionProps[]
    radiogroup?: RadioGroupProps | RadioGroupProps[]
    link?: LinkProps | LinkProps[]
    button?: CustomButtonProps | CustomButtonProps[]
    image?: ImageProps | ImageProps[]
    pricing?: PricingProps
    stepper?: CustomStepperProps | CustomStepperProps[]
    transferlist?: TransferListProps | TransferListProps[]
    card?: CardProps | CardProps[]
    codecopy?: CodeCopyProps | CodeCopyProps[]
    textfield?: TextFieldProps | TextFieldProps[]
    datefield?: DateFieldProps | DateFieldProps[]
    dropdown?: DropdownProps | DropdownProps[]
    incrementNumberField?:
      | IncrementNumberFieldProps
      | IncrementNumberFieldProps[]
    searchbar?: SearchbarProps | SearchbarProps[]
    numberField?: NumberFieldProps | NumberFieldProps[]
    passwordField?: PasswordFieldProps | PasswordFieldProps[]
    qrcode?: QRCodeProps | QRCodeProps[]
    phoneNumberField?: TextFieldProps | TextFieldProps[]
    checkbox?: CheckboxProps | CheckboxProps[]
    multiSelect?: MultiSelectChipProps | MultiSelectChipProps[]
    // Added optional style property for grid customization
    style?: React.CSSProperties
  }>
  width?: number
}

const RenderContent: React.FC<ContentSectionProps['grids'][0]> = ({
  boxProps,
  style,
  ...props
}) => {
  const elements: React.ReactElement[] = []

  // Helper function to add elements
  const addElements = (newElements: React.ReactElement[] | null) => {
    if (newElements) {
      elements.push(...newElements)
    }
  }

  // Add elements for each content type
  addElements(useTypography({ typography: props.typography }))
  addElements(useRadioGroup({ radiogroup: props.radiogroup }))
  addElements(
    useConfirmationInput({ confirmationcodeinput: props.confirmationcodeinput })
  )
  addElements(useLink({ link: props.link }))
  addElements(useButton({ button: props.button }))
  addElements(useImage({ image: props.image }))
  addElements(useComplexEditor({ complexeditor: props.complexeditor }))
  addElements(usePricing({ pricing: props.pricing }))
  addElements(useStepper({ stepper: props.stepper }))
  addElements(useTransferList({ transferlist: props.transferlist }))
  addElements(useCard({ card: props.card }))
  addElements(useCodeCopy({ codecopy: props.codecopy }))
  addElements(
    useSearchableDropdown({ searchableDropdown: props.searchableDropdown })
  )
  addElements(useTextField({ textfield: props.textfield }))
  addElements(useDateField({ datefield: props.datefield }))
  addElements(useProjectBoard({ projectboard: props.projectboard }))
  addElements(useAccordion({ accordion: props.accordion }))
  addElements(useMultiSelect({ multiSelect: props.multiSelect }))
  addElements(useCheckbox({ checkbox: props.checkbox }))
  addElements(usePhoneNumber({ phoneNumberField: props.phoneNumberField }))
  addElements(useDropdown({ dropdown: props.dropdown }))
  addElements(
    useIncrementNumberField({
      incrementNumberField: props.incrementNumberField,
    })
  )
  addElements(useSearchbar({ searchbar: props.searchbar }))
  addElements(useNumberField({ numberField: props.numberField }))
  addElements(usePasswordField({ passwordField: props.passwordField }))
  addElements(useQRCode({ qrcode: props.qrcode }))

  // Merge any style provided in boxProps with the grid's style property
  const mergedStyle = { ...(boxProps?.style || {}), ...style }

  return (
    <Box {...boxProps} style={mergedStyle}>
      {elements.map((element, index) => (
        <Box key={index}>{element}</Box>
      ))}
    </Box>
  )
}

export default function ContentSection({ grids }: ContentSectionProps) {
  return (
    <>
      {grids.map((gridProps, index) => (
        <RenderContent key={index} {...gridProps} />
      ))}
    </>
  )
}
