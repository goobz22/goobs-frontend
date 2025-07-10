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
  errorMessage = 'Invalid credit card number',
  useLuhnValidation = true,
  sacredtheme = false,
  isDefaultValue = false,
  enableFormatting = true,
  label,
  placeholder,
  disabled = false,
  error = false,
  helperText,
  style,
  ...rest
}) => {
  return (
    <div style={style}>
      <CreditCardNumber
        onChange={onChange}
        value={value}
        errorMessage={errorMessage}
        useLuhnValidation={useLuhnValidation}
        sacredtheme={sacredtheme}
        isDefaultValue={isDefaultValue}
        enableFormatting={enableFormatting}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        helperText={helperText}
        {...rest}
      />
    </div>
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
