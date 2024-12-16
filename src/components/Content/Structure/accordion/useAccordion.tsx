'use client'
import React from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CustomAccordionProps,
  CustomAccordionSummaryProps,
  CustomAccordionDetailsProps,
} from '../../../Accordion'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedAccordionProps extends CustomAccordionProps {
  columnconfig?: Partial<columnconfig>
  cellconfig?: cellconfig
  summaryProps?: CustomAccordionSummaryProps
  detailsProps?: CustomAccordionDetailsProps
  summaryContent?: React.ReactNode
  detailsContent?: React.ReactNode
}

const useAccordion = (grid: {
  accordion?: ExtendedAccordionProps | ExtendedAccordionProps[]
}) => {
  if (!grid.accordion) return null

  const renderAccordion = (
    accordionItem: ExtendedAccordionProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      summaryProps,
      detailsProps,
      summaryContent,
      detailsContent,
      ...restProps
    } = accordionItem

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

    const mergedConfig: columnconfig = {
      ...(itemColumnConfig as columnconfig),
      cellconfig: {
        ...cellconfig,
      },
      component: (
        <Accordion key={`accordion-${index}`} {...restProps}>
          <AccordionSummary {...summaryProps}>
            {summaryContent}
          </AccordionSummary>
          <AccordionDetails {...detailsProps}>
            {detailsContent}
          </AccordionDetails>
        </Accordion>
      ),
    }

    return mergedConfig
  }

  if (Array.isArray(grid.accordion)) {
    return grid.accordion.map(renderAccordion)
  } else {
    return [renderAccordion(grid.accordion, 0)]
  }
}

export default useAccordion
