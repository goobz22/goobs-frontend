'use client'
import React from 'react'
import DateField, { DateFieldProps } from './../../../DateField'

const useDateField = (props: {
  datefield?: DateFieldProps | DateFieldProps[]
}): React.ReactElement[] | null => {
  if (!props.datefield) return null

  const renderDateField = (
    dateFieldItem: DateFieldProps,
    index: number
  ): React.ReactElement => {
    return <DateField key={`datefield-${index}`} {...dateFieldItem} />
  }

  if (Array.isArray(props.datefield)) {
    return props.datefield.map((item, index) => renderDateField(item, index))
  } else {
    return [renderDateField(props.datefield, 0)]
  }
}

export default useDateField
