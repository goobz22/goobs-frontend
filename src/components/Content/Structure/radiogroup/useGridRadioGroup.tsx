import React from 'react'
import RadioGroup from '../../../RadioGroup'
import { columnconfig, cellconfig } from '../../../Grid'
import { RadioGroupProps as BaseRadioGroupProps } from '../../../../components/RadioGroup'

export interface ExtendedRadioGroupProps
  extends Omit<BaseRadioGroupProps, 'columnconfig'> {
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

const useGridRadioGroup = (grid: {
  radiogroup?: ExtendedRadioGroupProps | ExtendedRadioGroupProps[]
}) => {
  if (!grid.radiogroup) return null

  const renderRadioGroup = (
    radiogroup: ExtendedRadioGroupProps,
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
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = radiogroup

    return {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
      },
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
          {...restProps}
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
