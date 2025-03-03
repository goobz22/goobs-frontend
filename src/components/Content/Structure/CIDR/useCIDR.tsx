import React from 'react'
import CIDRStructure from '../../../Field/IPAM/CIDR'
import type { CIDRFieldProps } from '../../../Field/IPAM/CIDR'

export interface UseCIDRProps {
  cidr?: CIDRFieldProps | CIDRFieldProps[]
}

const useCIDR = ({ cidr }: UseCIDRProps): React.ReactElement[] | null => {
  if (!cidr) return null

  const cidrArray = Array.isArray(cidr) ? cidr : [cidr]

  return cidrArray.map((props, index) => (
    <CIDRStructure key={index} {...props} />
  ))
}

export default useCIDR
