import { useState, useEffect, useCallback } from 'react'
import { StyledComponentProps } from '..'
import { styled, Menu, MenuItem } from '@mui/material'
import React from 'react'

const StyledSelectMenu = styled(MenuItem)({
  backgroundColor: 'white',
  color: 'black',
  '&:hover': { backgroundColor: '#63B3DD' },
  '&[aria-selected=true]': {
    color: 'white',
    backgroundColor: '#9CE4F8',
  },
})

export const useDropdown = (
  props: StyledComponentProps,
  inputBoxRef: React.RefObject<HTMLDivElement>
) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [filteredOptions, setFilteredOptions] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState(props.defaultValue || '')
  const [isDropdownFocused, setIsDropdownFocused] = useState(false)

  const { componentvariant, options, defaultValue, onChange, value } = props

  useEffect(() => {
    if (componentvariant === 'dropdown' && options) {
      setFilteredOptions([...options])
      if (defaultValue && options.includes(defaultValue) && !selectedOption) {
        setSelectedOption(defaultValue)
        if (onChange) {
          onChange({
            target: { value: defaultValue },
          } as React.ChangeEvent<HTMLInputElement>)
        }
      }
    }
  }, [componentvariant, options, defaultValue, onChange, selectedOption])

  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value)
    }
  }, [value])

  const handleDropdownClick = useCallback(() => {
    console.log('Dropdown clicked')
    if (componentvariant === 'dropdown') {
      setAnchorEl(inputBoxRef.current)
      setIsDropdownOpen(!isDropdownOpen)
    }
  }, [componentvariant, inputBoxRef, isDropdownOpen])

  const handleOptionSelect = useCallback(
    (option: string) => {
      console.log('Option selected:', option)
      setSelectedOption(option)
      if (onChange) {
        onChange({
          target: { value: option },
        } as React.ChangeEvent<HTMLInputElement>)
      }
      setIsDropdownOpen(false)
    },
    [onChange]
  )

  const handleInputFocus = useCallback(
    (focused: boolean) => {
      console.log('Dropdown focused:', focused)
      if (componentvariant === 'dropdown') {
        setIsDropdownFocused(focused)
      }
    },
    [componentvariant]
  )

  if (componentvariant !== 'dropdown') {
    return {}
  }

  const renderMenu = anchorEl !== null && isDropdownOpen !== undefined && (
    <Menu
      anchorEl={anchorEl}
      open={isDropdownOpen}
      onClose={() => setIsDropdownOpen(false)}
      PaperProps={{
        style: {
          minWidth: inputBoxRef.current?.offsetWidth,
        },
      }}
    >
      {filteredOptions && filteredOptions.length > 0 ? (
        filteredOptions.map((option: string) => (
          <StyledSelectMenu
            key={option}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </StyledSelectMenu>
        ))
      ) : (
        <div>No Options Found</div>
      )}
    </Menu>
  )

  return {
    renderMenu,
    isDropdownOpen,
    anchorEl,
    filteredOptions,
    handleDropdownClick,
    selectedOption,
    handleOptionSelect,
    isDropdownFocused,
    handleInputFocus,
  }
}
