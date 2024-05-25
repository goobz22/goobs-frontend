import { StyledComponentProps } from '../../components/StyledComponent'
import { formatPhoneNumber } from '../../utils/phone/format'
import React from 'react'

export const usePhoneNumber = (
  props: StyledComponentProps & {
    onChange?: (
      // eslint-disable-next-line no-unused-vars
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void
  }
) => {
  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const formattedValue = formatPhoneNumber(e.target.value)
    if (props.onChange) {
      props.onChange({
        ...e,
        target: {
          ...e.target,
          value: formattedValue,
        },
      })
    }
  }

  return {
    handlePhoneNumberChange,
  }
}
