import React from 'react'
import RadioGroup, {
  RadioGroupProps,
} from './../../../../components/RadioGroup'
import { columnconfig } from 'goobs-repo'

const useGridRadioGroup = (grid: {
  radiogroup?: RadioGroupProps | RadioGroupProps[]
}) => {
  if (!grid.radiogroup) return null

  const renderRadioGroup = (
    radiogroup: RadioGroupProps,
    index: number
  ): columnconfig => {
    const {
      label,
      options,
      defaultValue,
      name,
      labelFontVariant,
      labelFontColor,
      labelText,
      columnconfig,
    } = radiogroup

    return {
      ...columnconfig,
      component: (
        <RadioGroup
          key={`radiogroup-${index}`}
          label={label}
          options={options}
          defaultValue={defaultValue}
          name={name}
          labelFontVariant={labelFontVariant}
          labelFontColor={labelFontColor}
          labelText={labelText}
        />
      ),
    }
  }

  if (Array.isArray(grid.radiogroup)) {
    return grid.radiogroup.map(renderRadioGroup)
  } else {
    return [renderRadioGroup(grid.radiogroup, 0)]
  }
}

export default useGridRadioGroup
