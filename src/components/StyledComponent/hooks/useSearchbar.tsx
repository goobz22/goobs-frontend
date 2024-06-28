import { useState } from 'react'
import React from 'react'

interface UseSearchbarProps {
  options: readonly string[]
  defaultValue?: string
  onChange: (filteredOptions: string[], searchQuery: string) => void
}

/**
 * useSearchbar hook provides functionality for handling searchbar input and filtering options.
 * It maintains the input value state and calls the onChange callback with the filtered options and search query.
 * @param props The props for the useSearchbar hook.
 * @returns An object containing the inputValue state and the handleOnChange function.
 */
export const useSearchbar = ({
  options,
  defaultValue = '',
  onChange,
}: UseSearchbarProps) => {
  const [inputValue, setInputValue] = useState(defaultValue)

  /**
   * handleOnChange function is called when the searchbar input value changes.
   * It updates the inputValue state and filters the options based on the search query.
   * It calls the onChange callback with the filtered options and the search query.
   * @param event The change event triggered by the searchbar input.
   */
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
