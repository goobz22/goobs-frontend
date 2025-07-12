import React from 'react'
import USDField, { USDFieldProps } from '../../../Field/USD'

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
      onChange={onChange}
      label={label}
      min={min}
      max={max}
      precision={precision}
      placeholder={placeholder}
      enableIncrement={enableIncrement}
      incrementStep={incrementStep}
      initialDelay={initialDelay}
      repeatInterval={repeatInterval}
      helperText={helperText}
      styles={styles}
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
