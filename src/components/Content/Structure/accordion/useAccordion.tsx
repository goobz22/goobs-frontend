'use client'
import React from 'react'
import Accordion, { type AccordionProps } from '../../../Accordion'

const useAccordion = (props: {
  accordion?: AccordionProps | AccordionProps[]
}): React.ReactElement[] | null => {
  if (!props.accordion) return null

  const renderAccordion = (
    accordionItem: AccordionProps,
    index: number
  ): React.ReactElement => {
    return <Accordion key={`accordion-${index}`} {...accordionItem} />
  }

  if (Array.isArray(props.accordion)) {
    return props.accordion.map((item, index) => renderAccordion(item, index))
  } else {
    return [renderAccordion(props.accordion, 0)]
  }
}

export default useAccordion
