import { useState, useEffect } from 'react'
import { StyledComponentProps } from '../../types/styledcomponent'
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

export const useDropdown = (props: StyledComponentProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [filteredOptions, setFilteredOptions] = useState<string[]>([])
  const [isHovering, setIsHovering] = useState(false)
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

  const handleDropdownClick = (event: React.MouseEvent<HTMLElement>) => {
    if (componentvariant === 'dropdown') {
      setAnchorEl(event.currentTarget)
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  const handleDropdownClose = () => {
    if (componentvariant === 'dropdown') {
      setIsDropdownOpen(false)
      setAnchorEl(null)
    }
  }

  const handleMouseEnter = () => {
    if (componentvariant === 'dropdown') {
      setIsHovering(true)
    }
  }

  const handleMouseLeave = () => {
    if (componentvariant === 'dropdown') {
      setIsHovering(false)
    }
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    handleDropdownClose()
    if (onChange) {
      onChange({
        target: { value: option },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const handleInputFocus = (focused: boolean) => {
    if (componentvariant === 'dropdown') {
      setIsDropdownFocused(focused)
    }
  }

  if (componentvariant !== 'dropdown') {
    return {}
  }

  const renderMenu = anchorEl !== null && isDropdownOpen !== undefined && (
    <Menu
      anchorEl={anchorEl}
      open={isDropdownOpen}
      onClose={handleDropdownClose}
      PaperProps={{
        style: {
          minWidth: anchorEl?.offsetWidth,
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
    handleDropdownClose,
    isHovering,
    handleMouseEnter,
    handleMouseLeave,
    selectedOption,
    handleOptionSelect,
    isDropdownFocused,
    handleInputFocus,
  }
}
