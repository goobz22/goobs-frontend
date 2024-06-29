'use client'

import { useState, useCallback, useEffect } from 'react'
import { StyledComponentProps } from '../index'

/**
 * useSplitButton hook handles the state and logic for a split button component.
 * @param props The props for the split button component.
 * @returns An object containing the value and handlers for the split button.
 */
export const useSplitButton = (props: StyledComponentProps) => {
  const [value, setValue] = useState('0')

  /**
   * Update the value state when the value prop changes.
   */
  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value)
    }
  }, [props.value])

  /**
   * Increment the value by 1.
   */
  const handleIncrement = useCallback(() => {
    setValue(prev => {
      const num = parseInt(prev)
      if (isNaN(num)) {
        return '0'
      }
      const newValue = num + 1
      return newValue > 0 ? newValue.toString() : '0'
    })
  }, [])

  /**
   * Decrement the value by 1.
   */
  const handleDecrement = useCallback(() => {
    setValue(prev => {
      const num = parseInt(prev)
      if (isNaN(num)) {
        return '0'
      }
      const newValue = num - 1
      return newValue >= 0 ? newValue.toString() : '0'
    })
  }, [])

  /**
   * Update the value when the input value changes.
   * @param newValue The new value from the input.
   */
  const handleChange = useCallback((newValue: string) => {
    const numValue = newValue.replace(/[^0-9]/g, '')
    setValue(numValue === '' ? '0' : numValue)
  }, [])

  return {
    value,
    handleIncrement,
    handleDecrement,
    handleChange,
  }
}
