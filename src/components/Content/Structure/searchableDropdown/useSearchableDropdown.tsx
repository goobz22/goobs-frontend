'use client'
import React from 'react'
import SearchableSimple, {
  SearchableSimpleProps,
} from '../../../Field/Dropdown/SearchableSimple'

const useSearchableDropdown = (props: {
  searchableDropdown?: SearchableSimpleProps | SearchableSimpleProps[]
}): React.ReactElement[] | null => {
  if (!props.searchableDropdown) return null

  const renderSearchableDropdown = (
    searchableDropdownItem: SearchableSimpleProps,
    index: number
  ): React.ReactElement => {
    return (
      <SearchableSimple
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
