'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import InternalIncrementNumberField, {
  InternalIncrementNumberFieldProps,
} from '../../Number/InternalIncrement'

// VLAN ID constraints
const MIN_VLAN_ID = 1
const MAX_VLAN_ID = 4094

export interface VLANFieldProps
  extends Omit<InternalIncrementNumberFieldProps, 'onChange'> {
  initialValue?: string
  /**
   * A standard ChangeEvent<HTMLInputElement> so parent can do
   * e.g. (event) => getVLANValue(event.target.value) ...
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  /** Array of reserved VLAN IDs that can't be used */
  reservedVLANs?: number[]
}

/**
 * A specialized field for VLAN ID entry
 * - Validates VLAN ID ranges (1-4094)
 * - Provides increment/decrement buttons
 * - Supports reserved VLAN ID validation
 * - Prevents entry of non-numeric characters
 */
const VLANField: React.FC<VLANFieldProps> = ({
  initialValue = '',
  onChange,
  label = 'VLAN ID',
  reservedVLANs = [],
  ...rest
}) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )
  const [isValid, setIsValid] = useState(true)
  const [currentValue, setCurrentValue] = useState(initialValue)

  // Use ref to track the latest value without triggering renders
  const valueRef = useRef(initialValue)
  // Use ref to track pending events to pass up
  const pendingEventRef = useRef<React.ChangeEvent<HTMLInputElement> | null>(
    null
  )

  // Separate validation logic from state updates
  // This only returns validation results without setting state
  const getValidationResult = useCallback(
    (vlanStr: string): { isValid: boolean; message?: string } => {
      if (!vlanStr) {
        return { isValid: true }
      }

      const vlanId = parseInt(vlanStr, 10)

      if (isNaN(vlanId)) {
        return { isValid: false, message: 'VLAN ID must be a number' }
      }

      if (vlanId < MIN_VLAN_ID) {
        return {
          isValid: false,
          message: `VLAN ID must be at least ${MIN_VLAN_ID}`,
        }
      }

      if (vlanId > MAX_VLAN_ID) {
        return {
          isValid: false,
          message: `VLAN ID cannot exceed ${MAX_VLAN_ID}`,
        }
      }

      if (reservedVLANs.includes(vlanId)) {
        return {
          isValid: false,
          message: `VLAN ID ${vlanId} is reserved and cannot be used`,
        }
      }

      return { isValid: true }
    },
    [reservedVLANs]
  )

  // Use effect to update state based on validation
  // This ensures state updates don't happen during render
  useEffect(() => {
    const result = getValidationResult(currentValue)
    setIsValid(result.isValid)
    setErrorMessage(result.message)
  }, [currentValue, getValidationResult])

  // Initialize with initial value
  useEffect(() => {
    if (initialValue) {
      setCurrentValue(initialValue)
      valueRef.current = initialValue
    }
  }, [initialValue])

  // Handle deferred value updates
  useEffect(() => {
    // Only update if the ref value is different from current state
    if (valueRef.current !== currentValue) {
      setCurrentValue(valueRef.current)
    }

    // Handle any pending onChange events
    if (pendingEventRef.current && onChange) {
      onChange(pendingEventRef.current)
      pendingEventRef.current = null
    }
  }, [currentValue, onChange])

  // Handle changes from the InternalIncrementNumberField
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | number) => {
      // If we got a numeric value directly (from the increment/decrement buttons)
      if (typeof event === 'number') {
        const numValue = event

        // Skip reservedVLANs when incrementing/decrementing
        if (reservedVLANs.includes(numValue)) {
          // Find the next available non-reserved value
          let nextValue = numValue
          const maxIterations = MAX_VLAN_ID - MIN_VLAN_ID
          let iterations = 0

          while (
            reservedVLANs.includes(nextValue) &&
            iterations < maxIterations
          ) {
            nextValue = nextValue >= MAX_VLAN_ID ? MIN_VLAN_ID : nextValue + 1
            iterations++
          }

          // Update ref instead of state directly
          const validValue = nextValue.toString()
          valueRef.current = validValue

          // Create synthetic event for parent
          const syntheticEvent = {
            target: { value: validValue },
          } as React.ChangeEvent<HTMLInputElement>

          // Store the event to be processed in useEffect
          pendingEventRef.current = syntheticEvent
          return
        }

        // Handle normal numeric value
        const stringValue = numValue.toString()
        valueRef.current = stringValue

        // Create synthetic event for parent
        const syntheticEvent = {
          target: { value: stringValue },
        } as React.ChangeEvent<HTMLInputElement>

        // Store the event to be processed in useEffect
        pendingEventRef.current = syntheticEvent
        return
      }

      // Handle regular text input
      const stringValue = event.target.value
      valueRef.current = stringValue

      // Store the original event to be processed in useEffect
      pendingEventRef.current = event

      // Force an update to trigger the useEffect
      setCurrentValue(prev => (prev === stringValue ? prev + ' ' : stringValue))
    },
    [reservedVLANs]
  )

  return (
    <InternalIncrementNumberField
      initialValue={currentValue}
      onChange={handleChange}
      label={label}
      min={MIN_VLAN_ID}
      max={MAX_VLAN_ID}
      error={!isValid}
      helperText={errorMessage}
      placeholder={`${MIN_VLAN_ID}-${MAX_VLAN_ID}`}
      {...rest}
    />
  )
}

export default VLANField
