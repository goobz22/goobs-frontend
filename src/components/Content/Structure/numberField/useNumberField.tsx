'use client'
import React from 'react'
import NumberField, { NumberFieldProps } from './../../../NumberField'

const useNumberField = (props: {
  numberField?: NumberFieldProps | NumberFieldProps[]
}): React.ReactElement[] | null => {
  if (!props.numberField) return null

  const renderNumberField = (
    numberFieldItem: NumberFieldProps,
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
