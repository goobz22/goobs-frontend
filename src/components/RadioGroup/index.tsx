import React from 'react'
import {
  Radio,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material'
import { Typography } from './../../components/Typography'
import { TypographyPropsVariantOverrides } from '@mui/material'

export interface RadioOption {
  value: string
  label: string
  fontColor?: string
  fontVariant?: keyof TypographyPropsVariantOverrides
}

export interface RadioGroupProps {
  label?: string
  options: RadioOption[]
  defaultValue?: string
  name: string
  labelFontVariant?: keyof TypographyPropsVariantOverrides
  labelFontColor?: string
  labelText?: string
  onChange?: (value: string) => void
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  defaultValue,
  name,
  labelFontVariant,
  labelFontColor,
  labelText,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedValue = event.target.value
    if (onChange) {
      onChange(selectedValue)
    }
  }

  return (
    <FormControl>
      <FormLabel id={`${name}-label`} sx={{ marginBottom: '8px' }}>
        <Typography
          text={labelText || label}
          fontcolor={labelFontColor}
          fontvariant={
            labelFontVariant as keyof TypographyPropsVariantOverrides
          }
        />
      </FormLabel>
      <MuiRadioGroup
        aria-labelledby={`${name}-label`}
        defaultValue={defaultValue}
        name={name}
        onChange={handleChange}
      >
        {options.map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={
              <Typography
                text={option.label}
                fontcolor={option.fontColor}
                fontvariant={
                  option.fontVariant as keyof TypographyPropsVariantOverrides
                }
              />
            }
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  )
}

export default RadioGroup
