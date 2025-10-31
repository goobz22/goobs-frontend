import React from 'react'
import SubnetField, {
  type SubnetFieldProps,
} from '../../../../components/Field/IPAM/Subnet'

interface UseSubnetProps {
  subnet?: SubnetFieldProps | SubnetFieldProps[]
}

const useSubnet = ({ subnet }: UseSubnetProps): React.ReactElement[] | null => {
  if (!subnet) return null

  const subnetArray = Array.isArray(subnet) ? subnet : [subnet]

  return subnetArray.map((props, index) => (
    <SubnetField key={index} {...props} />
  ))
}

export default useSubnet
