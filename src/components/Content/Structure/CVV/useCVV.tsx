import React from 'react'
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
  sacredtheme = false,
  isDefaultValue = false,
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
      <CVV
        onChange={onChange}
        value={value}
        minLength={minLength}
        maxLength={maxLength}
        errorMessage={errorMessage}
        sacredtheme={sacredtheme}
        isDefaultValue={isDefaultValue}
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

export const useCVV = ({ cvv }: UseCVVProps): React.ReactElement[] => {
  if (!cvv) return []

  const fields = Array.isArray(cvv) ? cvv : [cvv]

  return fields.map((field, index) => <CVVComponent key={index} {...field} />)
}

export default useCVV
