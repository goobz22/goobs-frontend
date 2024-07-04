'use client'
import React from 'react'
import PricingTable from './../../../../components/PricingTable'
import { columnconfig, cellconfig } from '../../../Grid'
import { PricingProps } from './../../../../components/PricingTable'

export interface ExtendedPricingProps extends PricingProps {
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

const usePricing = (pricing?: ExtendedPricingProps): columnconfig | null => {
  if (!pricing) return null

  const renderPricing = (
    pricingItem: ExtendedPricingProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = pricingItem

    // Merge the existing columnconfig with the new props
    const mergedConfig: columnconfig = {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
      },
      component: <PricingTable key={`pricingtable-${index}`} {...restProps} />,
    }

    return mergedConfig
  }

  return renderPricing(pricing, 0)
}

export default usePricing
