import React from 'react'
import RadioGroup from '../../../RadioGroup'
import { RadioGroupProps as BaseRadioGroupProps } from '../../../../components/RadioGroup'

const useRadioGroup = (props: {
  radiogroup?: BaseRadioGroupProps | BaseRadioGroupProps[]
}): React.ReactElement[] | null => {
  if (!props.radiogroup) return null

  const renderRadioGroup = (
    radiogroup: BaseRadioGroupProps,
    index: number
  ): React.ReactElement => {
    return <RadioGroup key={`radiogroup-${index}`} {...radiogroup} />
  }

  if (Array.isArray(props.radiogroup)) {
    return props.radiogroup.map((item, index) => renderRadioGroup(item, index))
  } else {
    return [renderRadioGroup(props.radiogroup, 0)]
  }
}

export default useRadioGroup
