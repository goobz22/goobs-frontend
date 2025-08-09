import React from 'react'
import CVV, { type CVVProps } from '../../../Field/Number/CVV'

export interface UseCVVProps {
  cvv?: CVVProps | CVVProps[]
}

export type { CVVProps }

const CVVComponent: React.FC<CVVProps> = ({
  onChange,
  value = '',
  minLength = 3,
  maxLength = 4,
  isDefaultValue = false,
  label,
  placeholder,
  helperText,
  styles,
  ...rest
}) => {
  return (
    <CVV
      onChange={onChange ?? (() => {})}
      value={value}
      minLength={minLength}
      maxLength={maxLength}
      isDefaultValue={isDefaultValue}
      {...(label !== undefined ? { label } : {})}
      {...(placeholder !== undefined ? { placeholder } : {})}
      {...(helperText !== undefined ? { helperText } : {})}
      {...(styles !== undefined ? { styles } : {})}
      {...rest}
    />
  )
}

export const useCVV = ({ cvv }: UseCVVProps): React.ReactElement[] => {
  if (!cvv) return []

  const fields = Array.isArray(cvv) ? cvv : [cvv]

  return fields.map((field, index) => <CVVComponent key={index} {...field} />)
}

export default useCVV
