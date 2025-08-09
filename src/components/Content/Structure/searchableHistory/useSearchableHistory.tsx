'use client'
import React from 'react'
import SearchableHistory, {
  type SearchableHistoryProps,
} from '../../../Field/Dropdown/SearchableHistory'

const useSearchableHistory = (props: {
  searchableHistory?: SearchableHistoryProps | SearchableHistoryProps[]
}): React.ReactElement[] | null => {
  if (!props.searchableHistory) return null

  const renderSearchableHistory = (
    searchableHistoryItem: SearchableHistoryProps,
    index: number
  ): React.ReactElement => {
    return (
      <SearchableHistory
        key={`searchable-history-${index}`}
        {...searchableHistoryItem}
      />
    )
  }

  if (Array.isArray(props.searchableHistory)) {
    return props.searchableHistory.map((item, index) =>
      renderSearchableHistory(item, index)
    )
  } else {
    return [renderSearchableHistory(props.searchableHistory, 0)]
  }
}

export default useSearchableHistory
