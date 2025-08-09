'use client'
import React from 'react'
import TextField, { type TextFieldProps } from '../../../Field/Text'

const useTextField = (props: {
  textfield?: TextFieldProps | TextFieldProps[]
}): React.ReactElement[] | null => {
  if (!props.textfield) return null

  const renderTextField = (
    component: TextFieldProps,
    index: number
  ): React.ReactElement => {
    return <TextField key={`textfield-${index}`} {...component} />
  }

  if (Array.isArray(props.textfield)) {
    return props.textfield.map((item, index) => renderTextField(item, index))
  } else {
    return [renderTextField(props.textfield, 0)]
  }
}

export default useTextField
