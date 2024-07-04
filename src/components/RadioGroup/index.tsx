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

/**
 * Interface representing a single radio option
 */
export interface RadioOption {
  label: string
  fontColor?: string
  fontVariant?: keyof TypographyPropsVariantOverrides
}

/**
 * Interface for the props of the RadioGroup component
 */
export interface RadioGroupProps {
  label?: string
  options: RadioOption[]
  defaultValue?: string
  name: string
  labelFontVariant?: keyof TypographyPropsVariantOverrides
  labelFontColor?: string
  labelText?: string
}

/**
 * RadioGroup component renders a group of radio buttons with customizable options.
 * It allows selecting a single value from a list of options.
 * @param props The props for the RadioGroup component.
 * @returns The rendered RadioGroup component.
 */
const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  defaultValue,
  name,
  labelFontVariant,
  labelFontColor,
  labelText,
}) => {
  return (
    <FormControl>
      {/* Render the form label */}
      <FormLabel id={`${name}-label`} sx={{ marginBottom: '8px' }}>
        <Typography
          text={labelText || label}
          fontcolor={labelFontColor}
          fontvariant={
            labelFontVariant as keyof TypographyPropsVariantOverrides
          }
        />
      </FormLabel>
      {/* Render the radio group */}
      <MuiRadioGroup
        aria-labelledby={`${name}-label`}
        defaultValue={defaultValue}
        name={name}
      >
        {/* Render individual radio options */}
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
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
