'use client'
import React from 'react'
import Dropdown, { type DropdownProps } from '../../../Field/Dropdown/Regular'

const useDropdown = (props: {
  dropdown?: DropdownProps | DropdownProps[]
}): React.ReactElement[] | null => {
  if (!props.dropdown) return null

  const renderDropdown = (
    dropdownItem: DropdownProps,
    index: number
  ): React.ReactElement => {
    return <Dropdown key={`dropdown-${index}`} {...dropdownItem} />
  }

  if (Array.isArray(props.dropdown)) {
    return props.dropdown.map((item, index) => renderDropdown(item, index))
  } else {
    return [renderDropdown(props.dropdown, 0)]
  }
}

export default useDropdown
