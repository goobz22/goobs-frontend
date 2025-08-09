'use client'
import React from 'react'
import PhoneNumberField, {
  type PhoneNumberFieldProps,
} from '../../../Field/PhoneNumber'

const usePhoneNumber = (props: {
  phoneNumberField?: PhoneNumberFieldProps | PhoneNumberFieldProps[]
}): React.ReactElement[] | null => {
  if (!props.phoneNumberField) return null

  const renderPhoneNumberField = (
    phoneNumberFieldItem: PhoneNumberFieldProps,
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
