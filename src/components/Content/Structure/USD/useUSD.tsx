import React from 'react'
import { Box } from '@mui/material'
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
  readOnly = false,
  disabled = false,
  error = false,
  helperText,
  placeholder,
  sx,
  enableIncrement = false,
  incrementStep = 1,
  initialDelay = 500,
  repeatInterval = 100,
  sacredtheme = false,
  style,
  ...rest
}) => {
  return (
    <Box style={style}>
      <USDField
        initialValue={initialValue}
        onChange={onChange}
        label={label}
        min={min}
        max={max}
        precision={precision}
        readOnly={readOnly}
        disabled={disabled}
        error={error}
        helperText={helperText}
        placeholder={placeholder}
        enableIncrement={enableIncrement}
        incrementStep={incrementStep}
        initialDelay={initialDelay}
        repeatInterval={repeatInterval}
        sacredtheme={sacredtheme}
        sx={sx}
        {...rest}
      />
    </Box>
  )
}

export const useUSD = ({ usdField }: UseUSDProps): React.ReactElement[] => {
  if (!usdField) return []

  const fields = Array.isArray(usdField) ? usdField : [usdField]

  return fields.map((field, index) => <USDComponent key={index} {...field} />)
}

export default useUSD
