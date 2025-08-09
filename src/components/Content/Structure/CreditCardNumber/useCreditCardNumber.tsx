import React from 'react'
import CreditCardNumber, {
  type CreditCardNumberProps,
  type CardType,
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
      onChange={onChange ?? (() => {})}
      value={value}
      useLuhnValidation={useLuhnValidation}
      isDefaultValue={isDefaultValue}
      enableFormatting={enableFormatting}
      {...(label !== undefined ? { label } : {})}
      {...(placeholder !== undefined ? { placeholder } : {})}
      {...(helperText !== undefined ? { helperText } : {})}
      {...(styles !== undefined ? { styles } : {})}
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
