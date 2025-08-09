import React from 'react'
import USDField, { type USDFieldProps } from '../../../Field/USD'

export interface UseUSDProps {
  usdField?: USDFieldProps | USDFieldProps[]
}

export type { USDFieldProps }

const USDComponent: React.FC<USDFieldProps> = ({
  initialValue = '',
  onChange,
  label = 'Amount',
  min,
  max,
  precision = 2,
  placeholder,
  enableIncrement = false,
  incrementStep = 1,
  initialDelay = 500,
  repeatInterval = 100,
  helperText,
  styles,
  ...rest
}) => {
  return (
    <USDField
      initialValue={initialValue}
      {...(onChange ? { onChange } : {})}
      label={label}
      {...(min !== undefined ? { min } : {})}
      {...(max !== undefined ? { max } : {})}
      {...(precision !== undefined ? { precision } : {})}
      {...(placeholder !== undefined ? { placeholder } : {})}
      enableIncrement={enableIncrement}
      incrementStep={incrementStep}
      initialDelay={initialDelay}
      repeatInterval={repeatInterval}
      {...(helperText !== undefined ? { helperText } : {})}
      {...(styles !== undefined ? { styles } : {})}
      {...rest}
    />
  )
}

export const useUSD = ({ usdField }: UseUSDProps): React.ReactElement[] => {
  if (!usdField) return []

  const fields = Array.isArray(usdField) ? usdField : [usdField]

  return fields.map((field, index) => <USDComponent key={index} {...field} />)
}

export default useUSD
