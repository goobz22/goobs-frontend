import React from 'react'
import CreditCardNumber, {
  CreditCardNumberProps,
  CardType,
} from '../../../Field/Number/CreditCardNumber'

export interface UseCreditCardNumberProps {
  creditCardNumber?: CreditCardNumberProps | CreditCardNumberProps[]
}

export type { CreditCardNumberProps, CardType }

const CreditCardNumberComponent: React.FC<CreditCardNumberProps> = ({
  onChange,
  value = '',
  useLuhnValidation = true,
  isDefaultValue = false,
  enableFormatting = true,
  label,
  placeholder,
  helperText,
  styles,
  ...rest
}) => {
  return (
    <CreditCardNumber
      onChange={onChange}
      value={value}
      useLuhnValidation={useLuhnValidation}
      isDefaultValue={isDefaultValue}
      enableFormatting={enableFormatting}
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      styles={styles}
      {...rest}
    />
  )
}

export const useCreditCardNumber = ({
  creditCardNumber,
}: UseCreditCardNumberProps): React.ReactElement[] => {
  if (!creditCardNumber) return []

  const fields = Array.isArray(creditCardNumber)
    ? creditCardNumber
    : [creditCardNumber]

  return fields.map((field, index) => (
    <CreditCardNumberComponent key={index} {...field} />
  ))
}

export default useCreditCardNumber
