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

/**
 * useDropdown hook provides functionality for rendering a dropdown menu and handling option selection.
 * @param props The props for the dropdown component.
 * @param inputBoxRef A reference to the input box element.
 * @returns An object containing the necessary state and handlers for the dropdown.
 */
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

  /**
   * useEffect hook to update the filtered options and handle default value selection.
   */
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

  /**
   * useEffect hook to update the selected option when the value prop changes.
   */
  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value)
    }
  }, [value])

  /**
   * handleDropdownClick function toggles the dropdown menu when the input box is clicked.
   */
  const handleDropdownClick = useCallback(() => {
    if (componentvariant === 'dropdown') {
      setAnchorEl(inputBoxRef.current)
      setIsDropdownOpen(!isDropdownOpen)
    }
  }, [componentvariant, inputBoxRef, isDropdownOpen])

  /**
   * handleOptionSelect function is called when an option is selected from the dropdown menu.
   * It updates the selected option and calls the onChange callback.
   * @param option The selected option.
   */
  const handleOptionSelect = useCallback(
    (option: string) => {
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

  /**
   * handleInputFocus function updates the isDropdownFocused state when the input box is focused or blurred.
   * @param focused A boolean indicating whether the input box is focused.
   */
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

  /**
   * renderMenu variable renders the dropdown menu when the anchor element is available and the dropdown is open.
   */
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
