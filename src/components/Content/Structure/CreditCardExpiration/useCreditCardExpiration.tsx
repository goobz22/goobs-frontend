import React from 'react'
import { Box } from '@mui/material'
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
  errorMessage = 'Invalid expiration date',
  sacredTheme = false,
  isDefaultValue = false,
  label,
  placeholder,
  disabled = false,
  error = false,
  helperText,
  sx,
  style,
  ...rest
}) => {
  return (
    <Box style={style}>
      <CreditCardExpiration
        onChange={onChange}
        value={value}
        errorMessage={errorMessage}
        sacredTheme={sacredTheme}
        isDefaultValue={isDefaultValue}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        helperText={helperText}
        sx={sx}
        {...rest}
      />
    </Box>
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
