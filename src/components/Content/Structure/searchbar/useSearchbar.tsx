'use client'
import React from 'react'
import Searchbar, { SearchbarProps } from './../../../Searchbar'

const useSearchbar = (props: {
  searchbar?: SearchbarProps | SearchbarProps[]
}): React.ReactElement[] | null => {
  if (!props.searchbar) return null

  const renderSearchbar = (
    searchbarItem: SearchbarProps,
    index: number
  ): React.ReactElement => {
    return <Searchbar key={`searchbar-${index}`} {...searchbarItem} />
  }

  if (Array.isArray(props.searchbar)) {
    return props.searchbar.map((item, index) => renderSearchbar(item, index))
  } else {
    return [renderSearchbar(props.searchbar, 0)]
  }
}

export default useSearchbar
