'use client'
import React from 'react'
import PricingTable, {
  type PricingProps,
} from './../../../../components/PricingTable'

const usePricing = (props: {
  pricing?: PricingProps
}): React.ReactElement[] | null => {
  if (!props.pricing) return null

  return [<PricingTable key="pricing-table" {...props.pricing} />]
}

export default usePricing
