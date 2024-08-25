import React, { useState } from 'react'
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material'
import { styled } from '@mui/material/styles'

export interface DropdownProps {
  label: string
  options: string[]
  defaultOption?: string
  onChange?: () => void
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  shrunkfontcolor?: string
}

const StyledFormControl = styled(FormControl)<{
  backgroundcolor?: string
  outlinecolor?: string
}>(({ theme, backgroundcolor, outlinecolor }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    backgroundColor: backgroundcolor || theme.palette.background.paper,
    '& fieldset': {
      borderColor: outlinecolor || theme.palette.primary.main,
    },
    '&:hover fieldset': {
      borderColor: outlinecolor || theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: outlinecolor || theme.palette.primary.main,
    },
  },
}))

const StyledInputLabel = styled(InputLabel)<{ shrunkfontcolor?: string }>(
  ({ theme, shrunkfontcolor }) => ({
    '&.Mui-focused': {
      color: shrunkfontcolor || theme.palette.primary.main,
    },
  })
)

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  defaultOption,
  onChange,
  backgroundcolor,
  outlinecolor,
  fontcolor,
  shrunkfontcolor,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultOption || '')

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string
    setSelectedValue(newValue)
    onChange?.()
  }

  return (
    <StyledFormControl
      backgroundcolor={backgroundcolor}
      outlinecolor={outlinecolor}
    >
      <StyledInputLabel shrunkfontcolor={shrunkfontcolor}>
        {label}
      </StyledInputLabel>
      <Select
        value={selectedValue}
        onChange={handleChange}
        label={label}
        sx={{ color: fontcolor }}
      >
        {options.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  )
}

export default Dropdown
