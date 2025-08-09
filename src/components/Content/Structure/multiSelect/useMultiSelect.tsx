'use client'
import React from 'react'
import MultipleSelectChip, {
  type MultiSelectChipProps,
} from '../../../Field/Dropdown/MultiSelect'

const useMultiSelect = (props: {
  multiSelect?: MultiSelectChipProps | MultiSelectChipProps[]
}): React.ReactElement[] | null => {
  if (!props.multiSelect) return null

  const renderMultiSelect = (
    item: MultiSelectChipProps,
    index: number
  ): React.ReactElement => {
    return <MultipleSelectChip key={`multiselect-${index}`} {...item} />
  }

  if (Array.isArray(props.multiSelect)) {
    return props.multiSelect.map((item, index) =>
      renderMultiSelect(item, index)
    )
  } else {
    return [renderMultiSelect(props.multiSelect, 0)]
  }
}

export default useMultiSelect
