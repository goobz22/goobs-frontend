'use client'
import React from 'react'
import SearchableDropdown, {
  SearchableDropdownProps,
} from './../../../SearchableDropdown'

const useSearchableDropdown = (props: {
  searchableDropdown?: SearchableDropdownProps | SearchableDropdownProps[]
}): React.ReactElement[] | null => {
  if (!props.searchableDropdown) return null

  const renderSearchableDropdown = (
    searchableDropdownItem: SearchableDropdownProps,
    index: number
  ): React.ReactElement => {
    return (
      <SearchableDropdown
        key={`searchable-dropdown-${index}`}
        {...searchableDropdownItem}
      />
    )
  }

  if (Array.isArray(props.searchableDropdown)) {
    return props.searchableDropdown.map((item, index) =>
      renderSearchableDropdown(item, index)
    )
  } else {
    return [renderSearchableDropdown(props.searchableDropdown, 0)]
  }
}

export default useSearchableDropdown
