import React from 'react'
import { Box } from '@mui/material'
import CVV, { CVVProps } from '../../../Field/Number/CVV'

export interface UseCVVProps {
  cvv?: CVVProps | CVVProps[]
}

export type { CVVProps }

const CVVComponent: React.FC<CVVProps> = ({
  onChange,
  value = '',
  minLength = 3,
  maxLength = 4,
  errorMessage = 'Invalid CVV format',
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
      <CVV
        onChange={onChange}
        value={value}
        minLength={minLength}
        maxLength={maxLength}
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

export const useCVV = ({ cvv }: UseCVVProps): React.ReactElement[] => {
  if (!cvv) return []

  const fields = Array.isArray(cvv) ? cvv : [cvv]

  return fields.map((field, index) => <CVVComponent key={index} {...field} />)
}

export default useCVV
