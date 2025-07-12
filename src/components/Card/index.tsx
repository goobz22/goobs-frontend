// src/components/Card/index.tsx

import React from 'react'

// Import all card variants
import DefaultCardVariant from './variants/defaultconfig'
import TaskCard from './variants/task'
import ProductCard from './variants/product'
import InventoryCard from './variants/inventory'
import ProductSummaryCard from './variants/productsummary'
import SimplePricingSummary from './variants/simplepricingsummary'
import DetailedPricingSummary from './variants/detailedpricingsummary'

// Card variant types
export type CardVariant =
  | 'default'
  | 'task'
  | 'product'
  | 'inventory'
  | 'productsummary'
  | 'simplepricingsummary'
  | 'detailedpricingsummary'

/**
 * Combined props interface for all card variants
 */
export interface CardProps {
  /** Card variant to render */
  variant?: CardVariant
  [key: string]: any // Allow any other props
}

/**
 * Main Card component that renders different card variants based on the variant prop
 */
const Card: React.FC<CardProps> = ({ variant = 'default', ...props }) => {
  console.log(`Rendering Card with variant: ${variant}`, props)

  // Render the appropriate card variant based on the variant prop
  switch (variant) {
    case 'task':
      return (
        <TaskCard
          title={props.title}
          description={props.description}
          checked={props.checked}
          disabled={props.disabled}
          onCheck={props.onCheck}
          height={props.height}
          styles={{
            theme: props.sacredtheme ? 'sacred' : props.theme,
            outline: props.outline,
            ...props.styles,
          }}
          draggable={props.draggable}
          onDragStart={props.onDragStart}
          onDragOver={props.onDragOver}
          onDrop={props.onDrop}
        />
      )

    case 'product':
      return (
        <ProductCard
          title={props.title}
          numDevelopers={props.numDevelopers}
          onAddDeveloper={props.onAddDeveloper}
          onRemoveDeveloper={props.onRemoveDeveloper}
          licenses={props.licenses}
          unitPrice={props.unitPrice}
          total={props.total}
          onBuy={props.onBuy}
          onLivePreview={props.onLivePreview}
          featuredescriptions={props.featuredescriptions}
          releaseDate={props.releaseDate}
          onContact={props.onContact}
          createdBy={props.createdBy}
          styles={{
            theme: props.sacredtheme ? 'sacred' : props.theme,
            ...props.styles,
          }}
        />
      )

    case 'inventory':
      return (
        <InventoryCard
          title={props.title}
          image={props.image}
          license={props.license}
          developmentUse={props.developmentUse}
          productionUse={props.productionUse}
          updates={props.updates}
          support={props.support}
          price={props.price}
          quantity={props.quantity}
          styles={{
            theme: props.sacredtheme ? 'sacred' : props.theme,
            ...props.styles,
          }}
          onRemove={props.onRemove}
        />
      )

    case 'productsummary':
      return (
        <ProductSummaryCard
          title={props.title}
          body={props.body}
          annualPrice={props.annualPrice}
          monthlyPrice={props.monthlyPrice}
          button1Props={props.button1Props}
          button2Props={props.button2Props}
          styles={{
            theme: props.sacredtheme ? 'sacred' : props.theme,
            ...props.styles,
          }}
        />
      )

    case 'simplepricingsummary':
      return (
        <SimplePricingSummary
          subtotal={props.subtotal}
          total={props.totalPrice}
          proceedText={props.proceedText}
          taxText={props.taxText}
          discountText={props.discountText}
          onProceed={props.onProceed}
          styles={{
            theme: props.sacredtheme ? 'sacred' : props.theme,
            ...props.styles,
          }}
        />
      )

    case 'detailedpricingsummary':
      return (
        <DetailedPricingSummary
          product={props.product}
          vendor={props.vendor}
          vendorPrice={props.vendorPrice}
          subtotal={props.subtotal}
          vat={props.vat}
          total={props.totalPrice}
          proceedText={props.proceedText}
          onProceed={props.onProceed}
          styles={{
            theme: props.sacredtheme ? 'sacred' : props.theme,
            ...props.styles,
          }}
        />
      )

    case 'default':
    default:
      // DefaultCard uses sacredtheme directly instead of through styles
      return <DefaultCardVariant {...props} sacredtheme={props.sacredtheme} />
  }
}

export default Card
