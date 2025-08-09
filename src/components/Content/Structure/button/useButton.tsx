'use client'
import React from 'react'
import CustomButton, { type ButtonProps } from './../../../Button'

const useButton = (props: {
  button?: ButtonProps | ButtonProps[]
}): React.ReactElement[] | null => {
  if (!props.button) return null

  const renderButton = (
    buttonItem: ButtonProps,
    index: number
  ): React.ReactElement => {
    return <CustomButton key={`button-${index}`} {...buttonItem} />
  }

  if (Array.isArray(props.button)) {
    return props.button.map((item, index) => renderButton(item, index))
  } else {
    return [renderButton(props.button, 0)]
  }
}

export default useButton
