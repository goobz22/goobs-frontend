'use client'
import React from 'react'
import PricingTable from './../../../../components/PricingTable'
import { columnconfig, cellconfig } from '../../../Grid'
import { PricingProps } from './../../../../components/PricingTable'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

export interface ExtendedPricingProps
  extends Omit<PricingProps, 'columnconfig'> {
  columnconfig?: ExtendedColumnConfig
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

    if (
      !itemColumnConfig ||
      typeof itemColumnConfig !== 'object' ||
      typeof itemColumnConfig.row !== 'number' ||
      typeof itemColumnConfig.column !== 'number'
    ) {
      throw new Error(
        'columnconfig must be an object with row and column as numbers'
      )
    }

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
