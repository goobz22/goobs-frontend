import React from 'react'
import AddressStructure from '../../../Field/IPAM/Address'
import type { IPAddressFieldProps } from '../../../Field/IPAM/Address'

export interface UseAddressProps {
  address?: IPAddressFieldProps | IPAddressFieldProps[]
}

const useAddress = ({
  address,
}: UseAddressProps): React.ReactElement[] | null => {
  if (!address) return null

  const addressArray = Array.isArray(address) ? address : [address]

  return addressArray.map((props, index) => (
    <AddressStructure key={index} {...props} />
  ))
}

export default useAddress
