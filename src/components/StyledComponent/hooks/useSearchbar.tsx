import { useState, useCallback } from 'react'
import React from 'react'

interface UseSearchbarProps {
  options: readonly string[]
  defaultValue?: string
}

/**
 * useSearchbar hook provides functionality for handling searchbar input and filtering options.
 * It maintains the input value state and filters options based on the search query.
 * @param props The props for the useSearchbar hook.
 * @returns An object containing the inputValue state, filteredOptions, and the handleOnChange function.
 */
export const useSearchbar = ({
  options,
  defaultValue = '',
}: UseSearchbarProps) => {
  const [inputValue, setInputValue] = useState(defaultValue)
  const [filteredOptions, setFilteredOptions] = useState(options)

  /**
   * handleOnChange function is called when the searchbar input value changes.
   * It updates the inputValue state and filters the options based on the search query.
   * @param event The change event triggered by the searchbar input.
   */
  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchQuery = event.target.value
      setInputValue(searchQuery)
      const newFilteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredOptions(newFilteredOptions)
    },
    [options]
  )

  return {
    inputValue,
    filteredOptions,
    handleOnChange,
  }
}
