import React from 'react'
import VLANStructure from '../../../Field/IPAM/VLAN'
import type { VLANFieldProps } from '../../../Field/IPAM/VLAN'

export interface UseVLANProps {
  vlan?: VLANFieldProps | VLANFieldProps[]
}

const useVLAN = ({ vlan }: UseVLANProps): React.ReactElement[] | null => {
  if (!vlan) return null

  const vlanArray = Array.isArray(vlan) ? vlan : [vlan]

  return vlanArray.map((props, index) => (
    <VLANStructure key={index} {...props} />
  ))
}

export default useVLAN
