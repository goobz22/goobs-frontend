'use client'
import React from 'react'
import PhoneNumberField from '../../../Field/PhoneNumber'
import type { TextFieldProps } from '../../../Field/Text'

const usePhoneNumber = (props: {
  phoneNumberField?: TextFieldProps | TextFieldProps[]
}): React.ReactElement[] | null => {
  if (!props.phoneNumberField) return null

  const renderPhoneNumberField = (
    phoneNumberFieldItem: TextFieldProps,
    index: number
  ): React.ReactElement => {
    return (
      <PhoneNumberField
        key={`phone-number-field-${index}`}
        {...phoneNumberFieldItem}
      />
    )
  }

  if (Array.isArray(props.phoneNumberField)) {
    return props.phoneNumberField.map((item, index) =>
      renderPhoneNumberField(item, index)
    )
  } else {
    return [renderPhoneNumberField(props.phoneNumberField, 0)]
  }
}

export default usePhoneNumber
