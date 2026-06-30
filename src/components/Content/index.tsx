'use client'

import React from 'react'
import type { TypographyProps } from '../Typography'
import type { RadioGroupProps } from '../RadioGroup'
import type { ConfirmationCodeInputsProps } from '../ConfirmationCodeInput'
import type { TextFieldProps } from '../Field/Text'
import type { PhoneNumberFieldProps } from '../Field/PhoneNumber'
import type { ButtonProps } from '../Button'
import type { PricingProps } from '../PricingTable'
import type { StepperProps } from '../Stepper'
import type { TransferListProps } from '../TransferList'

import type { CodeCopyProps } from '../CodeCopy'
import type { DateFieldProps } from '../Field/Date/DateField'
import type { DropdownProps } from '../Field/Dropdown/Regular'
import type { ExternalIncrementNumberFieldProps } from '../Field/Number/ExternalIncrement'
import type { SearchbarProps } from '../Field/Search'
import type { InternalIncrementNumberFieldProps } from '../Field/Number/InternalIncrement'
import type { SubnetFieldProps } from '../Field/IPAM/Subnet'
import type { PasswordFieldProps } from '../Field/Password'
import type { QRCodeProps } from '../QRCode'
import type { ComplexTextEditorProps } from '../ComplexTextEditor'
import type { SearchableSimpleProps } from '../Field/Dropdown/SearchableSimple'
import type { SearchableHistoryProps } from '../Field/Dropdown/SearchableHistory'
import type { AccordionProps } from '../Accordion'
import type { ProjectBoardProps } from '../ProjectBoard/types'
import type { MultiSelectChipProps } from '../Field/Dropdown/MultiSelect'
import type { CheckboxProps } from '../Checkbox'
import type { CIDRFieldProps } from '../Field/IPAM/CIDR'
import type { IPAddressFieldProps } from '../Field/IPAM/Address'
import type { VLANFieldProps } from '../Field/IPAM/VLAN'
import type { MACAddressFieldProps } from '../Field/IPAM/MACAddress'
import type { RoutingNumberProps } from '../Field/Number/RoutingNumber'
import type { AccountNumberProps } from '../Field/Number/AccountNumber'
import type { CVVProps } from '../Field/Number/CVV'
import type { CreditCardNumberProps } from '../Field/Number/CreditCardNumber'
import type { DateRangeProps } from '../Field/Date/DateRange'

// Import hooks
import useTypography from './Structure/typography/useTypography'
import useRadioGroup from './Structure/radiogroup/useRadioGroup'
import useConfirmationInput from './Structure/confirmationinput/useConfirmationInput'
import useLink, { type LinkProps } from './Structure/link/useLink'
import useImage, { type ImageProps } from './Structure/image/useImage'
import useButton from './Structure/button/useButton'
import usePricing from './Structure/pricing/usePricing'
import useStepper from './Structure/stepper/useStepper'
import useTransferList from './Structure/transferlist/useTransferList'

import useCodeCopy from './Structure/codecopy/useCodeCopy'
import useTextField from './Structure/textfield/useTextField'
import useDateField from './Structure/datefield/useDateField'
import useDropdown from './Structure/dropdown/useDropdown'
import useIncrementNumberField from './Structure/externalIncremementNumberField/useIncremementNumberField'
import useSearchbar from './Structure/searchbar/useSearchbar'
import useNumberField from './Structure/numberField/useNumberField'
import usePasswordField from './Structure/passwordField/usePasswordField'
import useQRCode from './Structure/qrcode/useQRCode'
import usePhoneNumber from './Structure/phoneNumber/usePhoneNumber'
import useCheckbox from './Structure/checkbox/useCheckbox'
import useComplexEditor from './Structure/complexeditor/useComplexEditor'
import useSearchableDropdown from './Structure/searchableDropdown/useSearchableDropdown'
import useSearchableHistory from './Structure/searchableHistory/useSearchableHistory'
import useAccordion from './Structure/accordion/useAccordion'
import useProjectBoard from './Structure/projectboard/useProjectBoard'
import useMultiSelect from './Structure/multiSelect/useMultiSelect'
import useSubnet from './Structure/Subnet/useSubnet'
import useSupernet from './Structure/Supernet/useSupernet'
import useCIDR from './Structure/CIDR/useCIDR'
import useAddress from './Structure/Address/useAddress'
import useVLAN from './Structure/VLAN/useVLAN'
import useUSD, { type USDFieldProps } from './Structure/USD/useUSD'
import useMacAddress from './Structure/macaddress/useMacAddress'
import useRoutingNumber from './Structure/routingnumber/useRoutingNumber'
import useAccountNumber from './Structure/accountnumber/useAccountNumber'
import useCVV from './Structure/CVV/useCVV'
import useCreditCardNumber from './Structure/CreditCardNumber/useCreditCardNumber'
import useDateRange from './Structure/DateRange/useDateRange'
import type { SupernetFieldProps } from '../Field/IPAM/Supernet'

export interface ContentSectionProps {
  grids: Array<{
    boxProps?: React.HTMLAttributes<HTMLDivElement>
    confirmationcodeinput?:
      | ConfirmationCodeInputsProps
      | ConfirmationCodeInputsProps[]
    searchableDropdown?: SearchableSimpleProps | SearchableSimpleProps[]
    searchableHistory?: SearchableHistoryProps | SearchableHistoryProps[]
    projectboard?: ProjectBoardProps | ProjectBoardProps[]
    complexeditor?: ComplexTextEditorProps | ComplexTextEditorProps[]
    typography?: TypographyProps | TypographyProps[]
    accordion?: AccordionProps | AccordionProps[]
    radiogroup?: RadioGroupProps | RadioGroupProps[]
    link?: LinkProps | LinkProps[]
    button?: ButtonProps | ButtonProps[]
    image?: ImageProps | ImageProps[]
    /**
     * Optional host element for `link`/`image` items so the section stays
     * framework-agnostic (defaults to plain `<a>`/`<img>`). A Next.js consumer
     * may pass `linkComponent={NextLink}` / `imageComponent={NextImage}`.
     */
    linkComponent?: React.ElementType
    imageComponent?: React.ElementType
    pricing?: PricingProps
    stepper?: StepperProps | StepperProps[]
    transferlist?: TransferListProps | TransferListProps[]

    codecopy?: CodeCopyProps | CodeCopyProps[]
    textfield?: TextFieldProps | TextFieldProps[]
    datefield?: DateFieldProps | DateFieldProps[]
    dropdown?: DropdownProps | DropdownProps[]
    incrementNumberField?:
      | ExternalIncrementNumberFieldProps
      | ExternalIncrementNumberFieldProps[]
    searchbar?: SearchbarProps | SearchbarProps[]
    numberField?:
      | InternalIncrementNumberFieldProps
      | InternalIncrementNumberFieldProps[]
    passwordField?: PasswordFieldProps | PasswordFieldProps[]
    qrcode?: QRCodeProps | QRCodeProps[]
    phoneNumberField?: PhoneNumberFieldProps | PhoneNumberFieldProps[]
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

  // Helper to include a prop only when it is defined (to satisfy exactOptionalPropertyTypes)
  const withProp = <K extends string, V>(key: K, value: V | undefined) =>
    value === undefined
      ? ({} as Record<K, V>)
      : ({ [key]: value } as Record<K, V>)

  // Add elements for each content type, injecting sacredtheme where applicable
  addElements(
    useTypography(withProp('typography', injectsacredtheme(props.typography)))
  )
  addElements(
    useRadioGroup(withProp('radiogroup', injectsacredtheme(props.radiogroup)))
  )
  addElements(
    useConfirmationInput(
      withProp(
        'confirmationcodeinput',
        injectsacredtheme(props.confirmationcodeinput)
      )
    )
  )
  addElements(
    useLink({
      ...withProp('link', injectsacredtheme(props.link)),
      ...(props.linkComponent !== undefined
        ? { linkComponent: props.linkComponent }
        : {}),
    })
  )
  addElements(useButton(withProp('button', injectsacredtheme(props.button))))
  addElements(
    useImage({
      ...withProp('image', injectsacredtheme(props.image)),
      ...(props.imageComponent !== undefined
        ? { imageComponent: props.imageComponent }
        : {}),
    })
  )
  addElements(
    useComplexEditor(
      withProp('complexeditor', injectsacredtheme(props.complexeditor))
    )
  )
  addElements(
    usePricing(withProp('pricing', injectsacredthemeSingle(props.pricing)))
  )
  addElements(useStepper(withProp('stepper', injectsacredtheme(props.stepper))))
  addElements(
    useTransferList(
      withProp('transferlist', injectsacredtheme(props.transferlist))
    )
  )

  addElements(
    useCodeCopy(withProp('codecopy', injectsacredtheme(props.codecopy)))
  )
  addElements(
    useSearchableDropdown(
      withProp(
        'searchableDropdown',
        injectsacredtheme(props.searchableDropdown)
      )
    )
  )
  addElements(
    useSearchableHistory(
      withProp('searchableHistory', injectsacredtheme(props.searchableHistory))
    )
  )
  addElements(
    useTextField(withProp('textfield', injectsacredtheme(props.textfield)))
  )
  addElements(
    useDateField(withProp('dateField', injectsacredtheme(props.datefield)))
  )
  addElements(
    useProjectBoard(
      withProp('projectboard', injectsacredtheme(props.projectboard))
    )
  )
  addElements(
    useAccordion(withProp('accordion', injectsacredtheme(props.accordion)))
  )
  addElements(
    useMultiSelect(
      withProp('multiSelect', injectsacredtheme(props.multiSelect))
    )
  )
  addElements(
    useCheckbox(withProp('checkbox', injectsacredtheme(props.checkbox)))
  )
  addElements(
    usePhoneNumber(
      withProp('phoneNumberField', injectsacredtheme(props.phoneNumberField))
    )
  )
  addElements(
    useDropdown(withProp('dropdown', injectsacredtheme(props.dropdown)))
  )
  addElements(
    useIncrementNumberField(
      withProp(
        'incrementNumberField',
        injectsacredtheme(props.incrementNumberField)
      )
    )
  )
  addElements(
    useSearchbar(withProp('searchbar', injectsacredtheme(props.searchbar)))
  )
  addElements(
    useNumberField(
      withProp('numberField', injectsacredtheme(props.numberField))
    )
  )
  addElements(
    usePasswordField(
      withProp('passwordField', injectsacredtheme(props.passwordField))
    )
  )
  addElements(useQRCode(withProp('qrcode', injectsacredtheme(props.qrcode))))
  addElements(useSubnet(withProp('subnet', injectsacredtheme(props.subnet))))
  addElements(
    useSupernet(withProp('supernet', injectsacredtheme(props.supernet)))
  )
  addElements(useCIDR(withProp('cidr', injectsacredtheme(props.cidr))))
  addElements(useAddress(withProp('address', injectsacredtheme(props.address))))
  addElements(useVLAN(withProp('vlan', injectsacredtheme(props.vlan))))
  addElements(useUSD(withProp('usdField', injectsacredtheme(props.usdField))))
  addElements(
    useMacAddress(
      withProp('macAddressField', injectsacredtheme(props.macAddressField))
    )
  )
  addElements(
    useRoutingNumber(
      withProp('routingnumber', injectsacredtheme(props.routingnumber))
    )
  )
  addElements(
    useAccountNumber(
      withProp('accountnumber', injectsacredtheme(props.accountnumber))
    )
  )
  addElements(useCVV(withProp('cvv', injectsacredtheme(props.cvv))))
  addElements(
    useCreditCardNumber(
      withProp('creditCardNumber', injectsacredtheme(props.creditCardNumber))
    )
  )
  addElements(
    useDateRange(withProp('dateRange', injectsacredtheme(props.dateRange)))
  )

  // Merge any style provided in boxProps with the grid's style property
  const mergedStyle = { ...(boxProps?.style || {}), ...style }

  return (
    <div {...boxProps} data-component="Content" style={mergedStyle}>
      {elements.map((element, index) => (
        <div key={index}>{element}</div>
      ))}
      {/* Render custom component if provided */}
      {customComponent}
    </div>
  )
}

export default function ContentSection({
  grids,
  sacredtheme,
}: ContentSectionProps) {
  return (
    <>
      {grids.map((gridProps, index) => (
        <RenderContent
          key={index}
          {...gridProps}
          {...(sacredtheme === undefined ? {} : { sacredtheme })}
        />
      ))}
    </>
  )
}
