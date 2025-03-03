'use client'
import React from 'react'
import IncrementNumberField, {
  IncrementNumberFieldProps,
} from '../../../Field/Number/ExternalIncrement'

const useIncrementNumberField = (props: {
  incrementNumberField?: IncrementNumberFieldProps | IncrementNumberFieldProps[]
}): React.ReactElement[] | null => {
  if (!props.incrementNumberField) return null

  const renderIncrementNumberField = (
    incrementNumberFieldItem: IncrementNumberFieldProps,
    index: number
  ): React.ReactElement => {
    return (
      <IncrementNumberField
        key={`increment-number-field-${index}`}
        {...incrementNumberFieldItem}
      />
    )
  }

  if (Array.isArray(props.incrementNumberField)) {
    return props.incrementNumberField.map((item, index) =>
      renderIncrementNumberField(item, index)
    )
  } else {
    return [renderIncrementNumberField(props.incrementNumberField, 0)]
  }
}

export default useIncrementNumberField
