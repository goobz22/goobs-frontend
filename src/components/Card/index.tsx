// src/components/Card/variants/defaultconfig/index.tsx

import React from 'react'
import { CustomButtonProps } from '../Button'
import { CustomStepperProps } from '../Stepper'

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

  // Common props across variants
  /** Title of the card */
  title?: string
  /** Body text of the card */
  body?: string
  /** Height of the card */
  height?: string | number
  /** Width of the card */
  width?: string | number
  /** Enable Egyptian/Sacred theming */
  sacredTheme?: boolean

  // Default card specific props
  /** Whether to show an underline for the title */
  titleUnderline?: boolean
  /** URL or path of the image to display */
  image?: string
  /** Position of the image in the card */
  imagePosition?: 'top' | 'left'
  /** Text for the parent breadcrumb */
  parentText?: string
  /** Link for the parent breadcrumb */
  parentLink?: string
  /** Text for the child breadcrumb */
  childText?: string
  /** Link for the child breadcrumb */
  childLink?: string
  /** Link for the grandchild breadcrumb */
  grandchildLink?: string
  /** Whether to enable the favorite feature */
  favoriteEnabled?: boolean
  /** Whether to show breadcrumbs */
  breadcrumbEnabled?: boolean
  /** Whether to enable links */
  linkEnabled?: boolean
  /** Whether to show a stepper */
  stepperEnabled?: boolean
  /** Active step in the stepper */
  stepperActiveStep?: number
  /** Steps configuration for the stepper */
  stepperSteps?: CustomStepperProps['steps']

  // Task card specific props
  /** Description for task card */
  description?: string
  /** Whether the card is currently checked/selected */
  checked?: boolean
  /** Disables the checkbox (prevents selection) */
  disabled?: boolean
  /** Called when the user toggles the checkbox */
  onCheck?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Whether the task card is draggable */
  draggable?: boolean
  /** Called when drag starts */
  onDragStart?: (event: React.DragEvent) => void
  /** Called when dragging over */
  onDragOver?: (event: React.DragEvent) => void
  /** Called when dropping */
  onDrop?: (event: React.DragEvent) => void

  // Product card specific props
  /** Initial number of developers */
  numDevelopers?: number
  /** Callback function when adding a developer */
  onAddDeveloper?: () => void
  /** Callback function when removing a developer */
  onRemoveDeveloper?: () => void
  /** Number of licenses */
  licenses?: number
  /** Unit price of the product */
  unitPrice?: number
  /** Total price (calculated) */
  total?: number
  /** Callback function for buy action */
  onBuy?: () => void
  /** Callback function for live preview action */
  onLivePreview?: () => void
  /** Array of feature descriptions */
  featuredescriptions?: string[]
  /** Release date of the product */
  releaseDate?: string
  /** Callback function for contact action */
  onContact?: () => void
  /** Creator of the product */
  createdBy?: string

  // Inventory card specific props
  /** License information for the item */
  license?: string
  /** Development use information */
  developmentUse?: string
  /** Production use information */
  productionUse?: string
  /** Update information for the item */
  updates?: string
  /** Support information for the item */
  support?: string
  /** Price of the item */
  price?: string
  /** Quantity of the item */
  quantity?: number
  /** Callback for remove action */
  onRemove?: () => void

  // Product summary card specific props
  /** Annual price of the product */
  annualPrice?: string
  /** Monthly price of the product */
  monthlyPrice?: string
  /** Props for the first button */
  button1Props?: CustomButtonProps
  /** Props for the second button */
  button2Props?: CustomButtonProps

  // Simple pricing summary specific props
  /** Subtotal amount */
  subtotal?: string
  /** Total amount for pricing summaries */
  totalPrice?: string
  /** Text for the proceed button */
  proceedText?: string
  /** Text explaining tax information */
  taxText?: string
  /** Text explaining discount information */
  discountText?: string
  /** Callback function for the proceed button */
  onProceed?: () => void

  // Detailed pricing summary specific props
  /** Description of the product */
  product?: string
  /** Name of the vendor */
  vendor?: string
  /** Price from the vendor */
  vendorPrice?: string
  /** VAT amount */
  vat?: string
}

/**
 * Main Card component that renders different card variants based on the variant prop
 */
const Card: React.FC<CardProps> = ({ variant = 'default', ...props }) => {
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
          height={
            typeof props.height === 'number'
              ? `${props.height}px`
              : props.height
          }
          sacredTheme={props.sacredTheme}
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
          sacredTheme={props.sacredTheme}
          height={
            typeof props.height === 'number'
              ? `${props.height}px`
              : props.height
          }
        />
      )

    case 'inventory':
      return (
        <InventoryCard
          title={props.title}
          image={props.image}
          height={
            typeof props.height === 'number'
              ? `${props.height}px`
              : props.height
          }
          license={props.license}
          developmentUse={props.developmentUse}
          productionUse={props.productionUse}
          updates={props.updates}
          support={props.support}
          price={props.price}
          quantity={props.quantity}
          sacredTheme={props.sacredTheme}
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
          height={
            typeof props.height === 'number'
              ? `${props.height}px`
              : props.height
          }
          sacredTheme={props.sacredTheme}
        />
      )

    case 'simplepricingsummary':
      return (
        <SimplePricingSummary
          height={
            typeof props.height === 'number'
              ? `${props.height}px`
              : props.height
          }
          subtotal={props.subtotal}
          total={props.totalPrice}
          proceedText={props.proceedText}
          taxText={props.taxText}
          discountText={props.discountText}
          onProceed={props.onProceed}
          sacredTheme={props.sacredTheme}
        />
      )

    case 'detailedpricingsummary':
      return (
        <DetailedPricingSummary
          width={
            typeof props.width === 'number' ? `${props.width}px` : props.width
          }
          height={
            typeof props.height === 'number'
              ? `${props.height}px`
              : props.height
          }
          product={props.product}
          vendor={props.vendor}
          vendorPrice={props.vendorPrice}
          subtotal={props.subtotal}
          vat={props.vat}
          total={props.totalPrice}
          proceedText={props.proceedText}
          onProceed={props.onProceed}
          sacredTheme={props.sacredTheme}
        />
      )

    case 'default':
    default:
      return (
        <DefaultCardVariant
          title={props.title}
          titleUnderline={props.titleUnderline}
          body={props.body}
          image={props.image}
          imagePosition={props.imagePosition}
          parentText={props.parentText}
          parentLink={props.parentLink}
          childText={props.childText}
          childLink={props.childLink}
          grandchildLink={props.grandchildLink}
          favoriteEnabled={props.favoriteEnabled}
          breadcrumbEnabled={props.breadcrumbEnabled}
          linkEnabled={props.linkEnabled}
          width={props.width}
          height={props.height}
          stepperEnabled={props.stepperEnabled}
          stepperActiveStep={props.stepperActiveStep}
          stepperSteps={props.stepperSteps}
        />
      )
  }
}

export default Card
