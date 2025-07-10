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
  sacredtheme = false,
  isDefaultValue = false,
  label,
  placeholder,
  disabled = false,
  error = false,
  style,
  ...rest
}) => {
  return (
    <div style={style}>
      <CreditCardExpiration
        onChange={onChange}
        value={value}
        sacredtheme={sacredtheme}
        isDefaultValue={isDefaultValue}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        {...rest}
      />
    </div>
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
