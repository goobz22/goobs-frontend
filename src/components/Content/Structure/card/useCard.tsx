'use client'
import React from 'react'
import Card, { CardProps } from './../../../../components/Card'

const useCard = (props: {
  card?: CardProps | CardProps[]
}): React.ReactElement[] | null => {
  if (!props.card) return null

  const renderCard = (
    cardProps: CardProps,
    index: number
  ): React.ReactElement => {
    return <Card key={`card-${index}`} {...cardProps} />
  }

  if (Array.isArray(props.card)) {
    return props.card.map((item, index) => renderCard(item, index))
  } else {
    return [renderCard(props.card, 0)]
  }
}

export default useCard
