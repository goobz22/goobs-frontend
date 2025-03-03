'use client'
import React from 'react'
import NumberField, {
  InternalIncrementNumberFieldProps,
} from '../../../Field/Number/InternalIncrement'

const useNumberField = (props: {
  numberField?:
    | InternalIncrementNumberFieldProps
    | InternalIncrementNumberFieldProps[]
}): React.ReactElement[] | null => {
  if (!props.numberField) return null

  const renderNumberField = (
    numberFieldItem: InternalIncrementNumberFieldProps,
    index: number
  ): React.ReactElement => {
    return <NumberField key={`number-field-${index}`} {...numberFieldItem} />
  }

  if (Array.isArray(props.numberField)) {
    return props.numberField.map((item, index) =>
      renderNumberField(item, index)
    )
  } else {
    return [renderNumberField(props.numberField, 0)]
  }
}

export default useNumberField
