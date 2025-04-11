'use client'
import React from 'react'
import MACAddressField, {
  MACAddressFieldProps,
} from '../../../Field/IPAM/MACAddress'

const useMacAddress = (props: {
  macAddressField?: MACAddressFieldProps | MACAddressFieldProps[]
}): React.ReactElement[] | null => {
  if (!props.macAddressField) return null

  const renderMacAddressField = (
    macAddressFieldItem: MACAddressFieldProps,
    index: number
  ): React.ReactElement => {
    return (
      <MACAddressField
        key={`mac-address-field-${index}`}
        {...macAddressFieldItem}
      />
    )
  }

  if (Array.isArray(props.macAddressField)) {
    return props.macAddressField.map((item, index) =>
      renderMacAddressField(item, index)
    )
  } else {
    return [renderMacAddressField(props.macAddressField, 0)]
  }
}

export default useMacAddress
