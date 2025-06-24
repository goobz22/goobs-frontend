import React from 'react'
import {
  Radio,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  alpha,
  keyframes,
} from '@mui/material'
import {
  Typography,
  CustomTypographyVariant,
} from './../../components/Typography'

const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`

/**
 * Interface representing a single radio option
 */
export interface RadioOption {
  label: string
  fontColor?: string
  fontVariant?: CustomTypographyVariant
}

/**
 * Interface for the props of the RadioGroup component
 */
export interface RadioGroupProps {
  label?: string
  options: RadioOption[]
  defaultValue?: string
  name: string
  labelFontVariant?: CustomTypographyVariant
  labelFontColor?: string
  labelText?: string
  sacredtheme?: boolean
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
  sacredtheme,
}) => {
  return (
    <FormControl
      sx={
        sacredtheme
          ? {
              position: 'relative',
              '&::before': {
                content: '"𓋴"',
                position: 'absolute',
                top: '-5px',
                right: '0px',
                fontSize: '16px',
                color: alpha('#FFD700', 0.3),
                animation: `rotate 20s linear infinite`,
              },
            }
          : undefined
      }
    >
      {/* Render the form label */}
      <FormLabel
        id={`${name}-label`}
        sx={{
          marginBottom: '8px',
          ...(sacredtheme && {
            color: '#FFD700',
            fontWeight: 600,
            letterSpacing: '0.5px',
            textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
          }),
        }}
      >
        <Typography
          text={labelText || label}
          fontcolor={sacredtheme ? '#FFD700' : labelFontColor}
          fontvariant={labelFontVariant}
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
            control={
              <Radio
                sx={
                  sacredtheme
                    ? {
                        color: alpha('#FFD700', 0.6),
                        '&.Mui-checked': {
                          color: '#FFD700',
                          animation: `${glowPulse} 2s ease-in-out infinite`,
                        },
                        '&:hover': {
                          backgroundColor: alpha('#FFD700', 0.1),
                        },
                      }
                    : undefined
                }
              />
            }
            label={
              <Typography
                text={option.label}
                fontcolor={
                  sacredtheme ? alpha('#FFD700', 0.9) : option.fontColor
                }
                fontvariant={option.fontVariant}
                sx={
                  sacredtheme
                    ? {
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#FFD700',
                          textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
                        },
                      }
                    : undefined
                }
              />
            }
            sx={
              sacredtheme
                ? {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(5px)',
                    },
                  }
                : undefined
            }
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  )
}

export default RadioGroup
