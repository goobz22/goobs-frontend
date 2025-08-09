import React from 'react'
import SupernetField, {
  type SupernetFieldProps,
} from '../../../../components/Field/IPAM/Supernet'

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
