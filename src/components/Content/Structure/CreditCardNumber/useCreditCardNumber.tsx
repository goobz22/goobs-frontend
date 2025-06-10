import React from 'react'
import { Box } from '@mui/material'
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
  sacredTheme = false,
  isDefaultValue = false,
  enableFormatting = true,
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
      <CreditCardNumber
        onChange={onChange}
        value={value}
        errorMessage={errorMessage}
        useLuhnValidation={useLuhnValidation}
        sacredTheme={sacredTheme}
        isDefaultValue={isDefaultValue}
        enableFormatting={enableFormatting}
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
