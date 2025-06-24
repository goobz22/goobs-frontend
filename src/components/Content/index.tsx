'use client'

import React from 'react'
import { Box, BoxProps } from '@mui/material'
import { TypographyProps } from '../Typography'
import { RadioGroupProps } from '../RadioGroup'
import { ConfirmationCodeInputsProps } from '../ConfirmationCodeInput'
import { TextFieldProps } from '../Field/Text'
import { CustomButtonProps } from '../Button'
import { ImageProps } from './Structure/image/useImage'
import { PricingProps } from '../PricingTable'
import { CustomStepperProps } from '../Stepper'
import { TransferListProps } from '../TransferList'
import { CardProps } from '../Card'
import { CodeCopyProps } from '../CodeCopy'
import { DateFieldProps } from '../Field/Date/DateField'
import { DropdownProps } from '../Field/Dropdown/Regular'
import { IncrementNumberFieldProps } from '../Field/Number/ExternalIncrement'
import { SearchbarProps } from '../Field/Search'
import { InternalIncrementNumberFieldProps } from '../Field/Number/InternalIncrement'
import { SubnetFieldProps } from '../Field/IPAM/Subnet'
import { PasswordFieldProps } from '../Field/Password'
import { QRCodeProps } from '../QRCode'
import { ComplexTextEditorProps } from '../ComplexTextEditor'
import { SearchableDropdownProps } from '../Field/Dropdown/Searchable'
import { AccordionProps } from '../Accordion'
import { ProjectBoardProps } from '../ProjectBoard/types'
import { MultiSelectChipProps } from '../Field/Dropdown/MultiSelect'
import { CheckboxProps } from '../Checkbox'
import { LinkProps } from './Structure/link/useLink'
import type { USDFieldProps } from './Structure/USD/useUSD'
import { CIDRFieldProps } from '../Field/IPAM/CIDR'
import { IPAddressFieldProps } from '../Field/IPAM/Address'
import { VLANFieldProps } from '../Field/IPAM/VLAN'
import { MACAddressFieldProps } from '../Field/IPAM/MACAddress'
import { RoutingNumberProps } from '../Field/Number/RoutingNumber'
import { AccountNumberProps } from '../Field/Number/AccountNumber'
import { CVVProps } from '../Field/Number/CVV'
import { CreditCardNumberProps } from '../Field/Number/CreditCardNumber'
import { DateRangeProps } from '../Field/Date/DateRange'
import { CreditCardExpirationProps } from '../Field/Date/CreditCardExpiration'

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
import useSubnet from './Structure/Subnet/useSubnet'
import useSupernet from './Structure/Supernet/useSupernet'
import useCIDR from './Structure/CIDR/useCIDR'
import useAddress from './Structure/Address/useAddress'
import useVLAN from './Structure/VLAN/useVLAN'
import useUSD from './Structure/USD/useUSD'
import useMacAddress from './Structure/macaddress/useMacAddress'
import useRoutingNumber from './Structure/routingnumber/useRoutingNumber'
import useAccountNumber from './Structure/accountnumber/useAccountNumber'
import useCVV from './Structure/CVV/useCVV'
import useCreditCardNumber from './Structure/CreditCardNumber/useCreditCardNumber'
import useDateRange from './Structure/DateRange/useDateRange'
import useCreditCardExpiration from './Structure/CreditCardExpiration/useCreditCardExpiration'
import type { SupernetFieldProps } from '../Field/IPAM/Supernet'

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
    numberField?:
      | InternalIncrementNumberFieldProps
      | InternalIncrementNumberFieldProps[]
    passwordField?: PasswordFieldProps | PasswordFieldProps[]
    qrcode?: QRCodeProps | QRCodeProps[]
    phoneNumberField?: TextFieldProps | TextFieldProps[]
    checkbox?: CheckboxProps | CheckboxProps[]
    multiSelect?: MultiSelectChipProps | MultiSelectChipProps[]
    subnet?: SubnetFieldProps | SubnetFieldProps[]
    supernet?: SupernetFieldProps | SupernetFieldProps[]
    cidr?: CIDRFieldProps | CIDRFieldProps[]
    address?: IPAddressFieldProps | IPAddressFieldProps[]
    vlan?: VLANFieldProps | VLANFieldProps[]
    usdField?: USDFieldProps | USDFieldProps[]
    macAddressField?: MACAddressFieldProps | MACAddressFieldProps[]
    routingnumber?: RoutingNumberProps | RoutingNumberProps[]
    accountnumber?: AccountNumberProps | AccountNumberProps[]
    cvv?: CVVProps | CVVProps[]
    creditCardNumber?: CreditCardNumberProps | CreditCardNumberProps[]
    dateRange?: DateRangeProps | DateRangeProps[]
    creditCardExpiration?:
      | CreditCardExpirationProps
      | CreditCardExpirationProps[]
    // Support for custom React components
    customComponent?: React.ReactNode
    // Added optional style property for grid customization
    style?: React.CSSProperties
  }>
  width?: number
  /** Enable Egyptian/Sacred theming for all components */
  sacredtheme?: boolean
}

const RenderContent: React.FC<
  ContentSectionProps['grids'][0] & { sacredtheme?: boolean }
> = ({ boxProps, style, customComponent, sacredtheme, ...props }) => {
  const elements: React.ReactElement[] = []

  // Helper function to inject sacredtheme into component props
  const injectsacredtheme = <T extends object>(
    componentProps: T | T[] | undefined
  ): T | T[] | undefined => {
    if (!componentProps || !sacredtheme) return componentProps

    if (Array.isArray(componentProps)) {
      return componentProps.map(prop => ({ ...prop, sacredtheme }))
    }

    return { ...componentProps, sacredtheme }
  }

  // Special handling for single-object props
  const injectsacredthemeSingle = <T extends object>(
    componentProps: T | undefined
  ): T | undefined => {
    if (!componentProps || !sacredtheme) return componentProps
    return { ...componentProps, sacredtheme }
  }

  // Helper function to add elements
  const addElements = (newElements: React.ReactElement[] | null) => {
    if (newElements) {
      elements.push(...newElements)
    }
  }

  // Add elements for each content type, injecting sacredtheme where applicable
  addElements(
    useTypography({ typography: injectsacredtheme(props.typography) })
  )
  addElements(
    useRadioGroup({ radiogroup: injectsacredtheme(props.radiogroup) })
  )
  addElements(
    useConfirmationInput({
      confirmationcodeinput: injectsacredtheme(props.confirmationcodeinput),
    })
  )
  addElements(useLink({ link: injectsacredtheme(props.link) }))
  addElements(useButton({ button: injectsacredtheme(props.button) }))
  addElements(useImage({ image: injectsacredtheme(props.image) }))
  addElements(
    useComplexEditor({ complexeditor: injectsacredtheme(props.complexeditor) })
  )
  addElements(usePricing({ pricing: injectsacredthemeSingle(props.pricing) }))
  addElements(useStepper({ stepper: injectsacredtheme(props.stepper) }))
  addElements(
    useTransferList({ transferlist: injectsacredtheme(props.transferlist) })
  )
  addElements(useCard({ card: injectsacredtheme(props.card) }))
  addElements(useCodeCopy({ codecopy: injectsacredtheme(props.codecopy) }))
  addElements(
    useSearchableDropdown({
      searchableDropdown: injectsacredtheme(props.searchableDropdown),
    })
  )
  addElements(useTextField({ textfield: injectsacredtheme(props.textfield) }))
  addElements(useDateField({ dateField: injectsacredtheme(props.datefield) }))
  addElements(
    useProjectBoard({ projectboard: injectsacredtheme(props.projectboard) })
  )
  addElements(useAccordion({ accordion: injectsacredtheme(props.accordion) }))
  addElements(
    useMultiSelect({ multiSelect: injectsacredtheme(props.multiSelect) })
  )
  addElements(useCheckbox({ checkbox: injectsacredtheme(props.checkbox) }))
  addElements(
    usePhoneNumber({
      phoneNumberField: injectsacredtheme(props.phoneNumberField),
    })
  )
  addElements(useDropdown({ dropdown: injectsacredtheme(props.dropdown) }))
  addElements(
    useIncrementNumberField({
      incrementNumberField: injectsacredtheme(props.incrementNumberField),
    })
  )
  addElements(useSearchbar({ searchbar: injectsacredtheme(props.searchbar) }))
  addElements(
    useNumberField({ numberField: injectsacredtheme(props.numberField) })
  )
  addElements(
    usePasswordField({ passwordField: injectsacredtheme(props.passwordField) })
  )
  addElements(useQRCode({ qrcode: injectsacredtheme(props.qrcode) }))
  addElements(useSubnet({ subnet: injectsacredtheme(props.subnet) }))
  addElements(useSupernet({ supernet: injectsacredtheme(props.supernet) }))
  addElements(useCIDR({ cidr: injectsacredtheme(props.cidr) }))
  addElements(useAddress({ address: injectsacredtheme(props.address) }))
  addElements(useVLAN({ vlan: injectsacredtheme(props.vlan) }))
  addElements(useUSD({ usdField: injectsacredtheme(props.usdField) }))
  addElements(
    useMacAddress({ macAddressField: injectsacredtheme(props.macAddressField) })
  )
  addElements(
    useRoutingNumber({ routingnumber: injectsacredtheme(props.routingnumber) })
  )
  addElements(
    useAccountNumber({ accountnumber: injectsacredtheme(props.accountnumber) })
  )
  addElements(useCVV({ cvv: injectsacredtheme(props.cvv) }))
  addElements(
    useCreditCardNumber({
      creditCardNumber: injectsacredtheme(props.creditCardNumber),
    })
  )
  addElements(useDateRange({ dateRange: injectsacredtheme(props.dateRange) }))
  addElements(
    useCreditCardExpiration({
      creditCardExpiration: injectsacredtheme(props.creditCardExpiration),
    })
  )

  // Merge any style provided in boxProps with the grid's style property
  const mergedStyle = { ...(boxProps?.style || {}), ...style }

  return (
    <Box {...boxProps} style={mergedStyle}>
      {elements.map((element, index) => (
        <Box key={index}>{element}</Box>
      ))}
      {/* Render custom component if provided */}
      {customComponent}
    </Box>
  )
}

export default function ContentSection({
  grids,
  sacredtheme,
}: ContentSectionProps) {
  return (
    <>
      {grids.map((gridProps, index) => (
        <RenderContent key={index} {...gridProps} sacredtheme={sacredtheme} />
      ))}
    </>
  )
}
