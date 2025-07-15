'use client'
import React from 'react'
import ExternalIncrementNumberField, {
  ExternalIncrementNumberFieldProps,
} from '../../../Field/Number/ExternalIncrement'

const useIncrementNumberField = (props: {
  incrementNumberField?:
    | ExternalIncrementNumberFieldProps
    | ExternalIncrementNumberFieldProps[]
}) => {
  if (!props.incrementNumberField) return null

  const renderIncrementNumberField = (
    incrementNumberFieldItem: ExternalIncrementNumberFieldProps,
    index: number
  ) => (
    <ExternalIncrementNumberField key={index} {...incrementNumberFieldItem} />
  )

  if (Array.isArray(props.incrementNumberField)) {
    return props.incrementNumberField.map((item, index) =>
      renderIncrementNumberField(item, index)
    )
  }

  return [renderIncrementNumberField(props.incrementNumberField, 0)]
}

export default useIncrementNumberField
