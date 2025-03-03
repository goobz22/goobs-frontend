import React from 'react'
import SupernetField from '../../../../components/Field/IPAM/Subnet'
import type { InternalIncrementNumberFieldProps as SupernetFieldProps } from '../../../../components/Field/IPAM/Subnet'

interface UseSupernet {
  supernet?: SupernetFieldProps | SupernetFieldProps[]
}

const useSupernet = ({
  supernet,
}: UseSupernet): React.ReactElement[] | null => {
  if (!supernet) return null

  const supernetArray = Array.isArray(supernet) ? supernet : [supernet]

  return supernetArray.map((props, index) => (
    <SupernetField key={index} {...props} />
  ))
}

export default useSupernet
