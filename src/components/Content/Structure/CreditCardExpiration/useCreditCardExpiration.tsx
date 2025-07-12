import React from 'react'
import CreditCardExpiration, {
  CreditCardExpirationProps,
} from '../../../Field/Date/CreditCardExpiration'

export interface UseCreditCardExpirationProps {
  creditCardExpiration?: CreditCardExpirationProps | CreditCardExpirationProps[]
}

export type { CreditCardExpirationProps }

const CreditCardExpirationComponent: React.FC<CreditCardExpirationProps> = ({
  onChange,
  value = '',
  isDefaultValue = false,
  label,
  placeholder,
  helperText,
  styles,
  ...rest
}) => {
  return (
    <CreditCardExpiration
      onChange={onChange}
      value={value}
      isDefaultValue={isDefaultValue}
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      styles={styles}
      {...rest}
    />
  )
}

export const useCreditCardExpiration = ({
  creditCardExpiration,
}: UseCreditCardExpirationProps): React.ReactElement[] => {
  if (!creditCardExpiration) return []

  const fields = Array.isArray(creditCardExpiration)
    ? creditCardExpiration
    : [creditCardExpiration]

  return fields.map((field, index) => (
    <CreditCardExpirationComponent key={index} {...field} />
  ))
}

export default useCreditCardExpiration
