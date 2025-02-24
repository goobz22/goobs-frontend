'use client'
import React from 'react'
import PasswordField, { PasswordFieldProps } from './../../../PasswordField'

const usePasswordField = (props: {
  passwordField?: PasswordFieldProps | PasswordFieldProps[]
}): React.ReactElement[] | null => {
  if (!props.passwordField) return null

  const renderPasswordField = (
    passwordFieldItem: PasswordFieldProps,
    index: number
  ): React.ReactElement => {
    return (
      <PasswordField key={`password-field-${index}`} {...passwordFieldItem} />
    )
  }

  if (Array.isArray(props.passwordField)) {
    return props.passwordField.map((item, index) =>
      renderPasswordField(item, index)
    )
  } else {
    return [renderPasswordField(props.passwordField, 0)]
  }
}

export default usePasswordField
