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
  const [selectedOption, setSelectedOption] = useState('')
  const [isDropdownFocused, setIsDropdownFocused] = useState(false)
  const { componentvariant, options, value } = props

  useEffect(() => {
    if (componentvariant === 'dropdown' && options) {
      setFilteredOptions([...options])
    }
  }, [componentvariant, options])

  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value)
    }
  }, [value])

  const handleDropdownClick = useCallback(() => {
    if (componentvariant === 'dropdown') {
      setAnchorEl(inputBoxRef.current)
      setIsDropdownOpen(!isDropdownOpen)
    }
  }, [componentvariant, inputBoxRef, isDropdownOpen])

  const handleOptionSelect = useCallback((option: string) => {
    setSelectedOption(option)
    setIsDropdownOpen(false)
  }, [])

  const handleInputFocus = useCallback(
    (focused: boolean) => {
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
