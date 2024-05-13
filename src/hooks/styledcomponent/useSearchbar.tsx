import { useState } from 'react'
import React from 'react'

interface UseSearchbarProps {
  options: readonly string[]
  defaultValue?: string
  // eslint-disable-next-line no-unused-vars
  onChange: (filteredOptions: string[], searchQuery: string) => void
}

export const useSearchbar = ({
  options,
  defaultValue = '',
  onChange,
}: UseSearchbarProps) => {
  const [inputValue, setInputValue] = useState(defaultValue)

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value
    setInputValue(searchQuery)
    const filteredOptions = options.filter(option =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    )
    onChange(filteredOptions, searchQuery)
  }

  return {
    inputValue,
    handleOnChange,
  }
}
