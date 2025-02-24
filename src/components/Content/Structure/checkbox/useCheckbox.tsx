'use client'
import React from 'react'
import DataGridCheckbox from './../../../../components/Checkbox'

interface CheckboxProps {
  onClick?: (event: React.MouseEvent) => void
  checked?: boolean
  indeterminate?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const useCheckbox = (props: {
  checkbox?: CheckboxProps | CheckboxProps[]
}): React.ReactElement[] | null => {
  if (!props.checkbox) return null

  const renderCheckbox = (
    checkboxProps: CheckboxProps,
    index: number
  ): React.ReactElement => {
    return <DataGridCheckbox key={`checkbox-${index}`} {...checkboxProps} />
  }

  if (Array.isArray(props.checkbox)) {
    return props.checkbox.map((item, index) => renderCheckbox(item, index))
  } else {
    return [renderCheckbox(props.checkbox, 0)]
  }
}

export default useCheckbox
