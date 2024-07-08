'use client'
import React from 'react'
import { columnconfig, cellconfig } from '../../../Grid'
import Card, { CardProps } from './../../../../components/Card'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

export interface ExtendedCardProps extends Omit<CardProps, 'columnconfig'> {
  columnconfig?: ExtendedColumnConfig
  cellconfig?: cellconfig
}

const useCard = (grid: {
  card?: ExtendedCardProps | ExtendedCardProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.card) return null

  const renderCard = (
    cardProps: ExtendedCardProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = cardProps

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
      component: <Card key={`card-${index}`} {...restProps} />,
    }

    return mergedConfig
  }

  if (Array.isArray(grid.card)) {
    return grid.card.map(renderCard)
  } else {
    return renderCard(grid.card, 0)
  }
}

export default useCard
