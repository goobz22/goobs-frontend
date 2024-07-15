import { useState, useEffect, useCallback } from 'react'
import { StyledComponentProps } from '..'
import { styled, Menu, MenuItem } from '@mui/material'
import React from 'react'

/**
 * Styled MenuItem component for the dropdown menu.
 */
const StyledSelectMenu = styled(MenuItem)({
  backgroundColor: 'white',
  color: 'black',
  '&:hover': { backgroundColor: '#63B3DD' },
  '&[aria-selected=true]': {
    color: 'white',
    backgroundColor: '#9CE4F8',
  },
})

/**
 * Custom hook for managing a dropdown component.
 *
 * @param {StyledComponentProps} props - The props passed to the StyledComponent.
 * @param {React.RefObject<HTMLDivElement>} inputBoxRef - Ref to the input box element.
 * @param {(option: string) => void} [onOptionSelect] - Optional callback function when an option is selected.
 * @returns {Object} An object containing state and handlers for the dropdown.
 */
export const useDropdown = (
  props: StyledComponentProps,
  inputBoxRef: React.RefObject<HTMLDivElement>,
  onOptionSelect?: (option: string) => void
) => {
  /** State to control if the dropdown is open */
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  /** State to store the anchor element for the dropdown */
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  /** State to store the filtered options */
  const [filteredOptions, setFilteredOptions] = useState<string[]>([])
  /** State to store the currently selected option */
  const [selectedOption, setSelectedOption] = useState('')
  /** State to track if the dropdown is focused */
  const [isDropdownFocused, setIsDropdownFocused] = useState(false)

  const { componentvariant, options, value, defaultOption } = props

  /**
   * Effect to set filtered options when component variant is dropdown and options are provided
   */
  useEffect(() => {
    if (componentvariant === 'dropdown' && options) {
      setFilteredOptions([...options])
    }
  }, [componentvariant, options])

  /**
   * Effect to set the selected option based on value, defaultOption, or first option
   */
  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value)
    } else if (defaultOption !== undefined) {
      setSelectedOption(defaultOption)
    } else if (options && options.length > 0) {
      setSelectedOption(options[0])
    }
  }, [value, defaultOption, options])

  /**
   * Handle click on the dropdown to open/close it
   */
  const handleDropdownClick = useCallback(() => {
    if (componentvariant === 'dropdown') {
      setAnchorEl(inputBoxRef.current)
      setIsDropdownOpen(prev => !prev)
    }
  }, [componentvariant, inputBoxRef])

  /**
   * Handle selection of an option from the dropdown
   * @param {string} option - The selected option
   */
  const handleOptionSelect = useCallback(
    (option: string) => {
      setSelectedOption(option)
      setIsDropdownOpen(false)
      if (onOptionSelect) {
        onOptionSelect(option)
      }
    },
    [onOptionSelect]
  )

  /**
   * Handle focus/blur of the dropdown input
   * @param {boolean} focused - Whether the input is focused
   */
  const handleInputFocus = useCallback(
    (focused: boolean) => {
      if (componentvariant === 'dropdown') {
        setIsDropdownFocused(focused)
      }
    },
    [componentvariant]
  )

  /**
   * Render the dropdown menu
   */
  const renderMenu = (
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
            selected={option === selectedOption}
          >
            {option}
          </StyledSelectMenu>
        ))
      ) : (
        <MenuItem disabled>No Options Found</MenuItem>
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
