'use client'
import React from 'react'
import { columnconfig, cellconfig } from '../../../Grid'
import Card, { CardProps } from './../../../../components/Card'

export interface ExtendedCardProps extends CardProps {
  columnconfig?: columnconfig
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
