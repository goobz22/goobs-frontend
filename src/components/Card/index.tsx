'use client'

import React from 'react'
import { Box, BoxProps } from '@mui/material'
import { CustomStepperProps } from '../Stepper'
import InventoryCard from './variants/inventory'
import SimplePricingSummary from './variants/simplepricingsummary'
import DetailedPricingSummary from './variants/detailedpricingsummary'
import ProductCard from './variants/product'
import ProductSummaryCard from './variants/productsummary'
import DefaultCard from './variants/defaultconfig'
import TaskCard from './variants/task'
import { CustomButtonProps } from '../Button'

/**
 * We omit children, draggable, and drag event props from BoxProps,
 * to avoid type conflicts with MUI. We also omit `color`/`border`
 * so they don’t conflict with PaperProps in <TaskCard>.
 */
type CardProps = Omit<
  BoxProps,
  | 'children'
  | 'draggable'
  | 'onDragStart'
  | 'onDragOver'
  | 'onDrop'
  | 'color'
  | 'border'
> & {
  /** Title of the card */
  title?: string
  /** Whether to show an underline for the title */
  titleUnderline?: boolean
  /** Body text of the card */
  body?: string
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
  /**
   * Width of the card. Can be a string/number or MUI responsive object, e.g.:
   *   width={{
   *     xs: 250,
   *     sm: 300,
   *     md: 400
   *   }}
   */
  width?:
    | string
    | number
    | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string | number>>
  /** Height of the card */
  height?: string | number
  /** Whether to show a stepper */
  stepperEnabled?: boolean
  /** Active step in the stepper */
  stepperActiveStep?: number
  /** Steps configuration for the stepper */
  stepperSteps?: CustomStepperProps['steps']
  /** Variant of the card to render */
  variant?:
    | 'default'
    | 'inventory'
    | 'pricingsummary'
    | 'detailedpricingsummary'
    | 'product'
    | 'productsummary'
    | 'task'
  /** Props for the pricing summary variant */
  pricingSummaryProps?: {
    subtotal?: string
    total?: string
    proceedText?: string
    taxText?: string
    discountText?: string
    onProceed?: () => void
  }
  /** Props for the detailed pricing summary variant */
  detailedPricingSummaryProps?: {
    product?: string
    vendor?: string
    vendorPrice?: string
    subtotal?: string
    vat?: string
    total?: string
    proceedText?: string
    onProceed?: () => void
  }
  /** Props for the inventory variant */
  inventoryProps?: {
    license?: string
    developmentUse?: string
    productionUse?: string
    updates?: string
    support?: string
    price?: string
    quantity?: number
    onRemove?: () => void
  }
  /** Props for the product variant */
  productProps?: {
    title?: string
    description?: string
    image?: string
    price?: string
    onBuy?: () => void
    favoriteEnabled?: boolean
    linkEnabled?: boolean
    grandchildLink?: string
    numDevelopers?: number
    onAddDeveloper?: () => void
    licenses?: number
    unitPrice?: number
    total?: number
    rating?: number
    numReviews?: number
    releaseDate?: string
    category?: string
    onContact?: () => void
    createdBy?: string
    featuredescriptions?: string[]
  }
  /** Props for the product summary variant */
  productSummaryProps?: {
    annualPrice?: string
    monthlyPrice?: string
    button1Props?: CustomButtonProps
    button2Props?: CustomButtonProps
  }
  /** Props for the new "task" variant */
  taskProps?: {
    /** Title of the task */
    title?: string
    /** Description of the task */
    description?: string
    /** Whether the task is completed (checked) */
    checked?: boolean
    /** Callback when the checkbox changes */
    onCheck?: (event: React.ChangeEvent<HTMLInputElement>) => void

    /** Whether the task card is disabled */
    disabled?: boolean

    /**
     * Optional drag & drop props if you want the card itself
     * to handle drag events.
     */
    draggable?: boolean
    onDragStart?: React.DragEventHandler<HTMLDivElement>
    onDragOver?: React.DragEventHandler<HTMLDivElement>
    onDrop?: React.DragEventHandler<HTMLDivElement>
  }
  /** Inline style for the root card container */
  style?: React.CSSProperties
}

function Card({
  title,
  titleUnderline = true,
  body,
  image,
  imagePosition = 'top',
  parentText = 'Parent',
  parentLink = '/',
  childText = 'Child',
  childLink = '/',
  grandchildLink = '/',
  favoriteEnabled = false,
  breadcrumbEnabled = false,
  linkEnabled = false,
  width = '100%',
  height,
  stepperEnabled = false,
  stepperActiveStep = -1,
  stepperSteps = [],
  variant = 'default',
  pricingSummaryProps,
  detailedPricingSummaryProps,
  inventoryProps,
  productProps,
  productSummaryProps,
  taskProps,
  style,
  ...rest
}: CardProps): React.ReactNode | null {
  // --------------------------
  // 1. "DEFAULT" VARIANT
  // --------------------------
  if (variant === 'default') {
    return (
      <Box style={style} sx={{ width, height }} {...rest}>
        <DefaultCard
          title={title}
          titleUnderline={titleUnderline}
          body={body}
          image={image}
          imagePosition={imagePosition}
          parentText={parentText}
          parentLink={parentLink}
          childText={childText}
          childLink={childLink}
          grandchildLink={grandchildLink}
          favoriteEnabled={favoriteEnabled}
          breadcrumbEnabled={breadcrumbEnabled}
          linkEnabled={linkEnabled}
          height={height}
          stepperEnabled={stepperEnabled}
          stepperActiveStep={stepperActiveStep}
          stepperSteps={stepperSteps}
        />
      </Box>
    )
  }

  // --------------------------
  // 2. "INVENTORY" VARIANT
  // --------------------------
  if (variant === 'inventory') {
    return (
      <Box style={style} sx={{ width, height }} {...rest}>
        <InventoryCard
          title={title}
          image={image}
          height={height}
          {...inventoryProps}
        />
      </Box>
    )
  }

  // --------------------------
  // 3. "PRICINGSUMMARY" VARIANT
  // --------------------------
  if (variant === 'pricingsummary') {
    return (
      <Box style={style} sx={{ width, height }} {...rest}>
        <SimplePricingSummary height={height} {...pricingSummaryProps} />
      </Box>
    )
  }

  // --------------------------
  // 4. "DETAILEDPRICINGSUMMARY" VARIANT
  // --------------------------
  if (variant === 'detailedpricingsummary') {
    return (
      <Box style={style} sx={{ width, height }} {...rest}>
        <DetailedPricingSummary
          height={height}
          {...detailedPricingSummaryProps}
        />
      </Box>
    )
  }

  // --------------------------
  // 5. "PRODUCT" VARIANT
  // --------------------------
  if (variant === 'product') {
    return (
      <Box style={style} sx={{ width, height }} {...rest}>
        <ProductCard height={height} {...productProps} />
      </Box>
    )
  }

  // --------------------------
  // 6. "PRODUCTSUMMARY" VARIANT
  // --------------------------
  if (variant === 'productsummary') {
    return (
      <Box style={style} sx={{ width, height }} {...rest}>
        <ProductSummaryCard
          title={title}
          body={body}
          annualPrice={productSummaryProps?.annualPrice}
          monthlyPrice={productSummaryProps?.monthlyPrice}
          height={height}
          button1Props={productSummaryProps?.button1Props}
          button2Props={productSummaryProps?.button2Props}
        />
      </Box>
    )
  }

  // --------------------------
  // 7. "TASK" VARIANT
  // --------------------------
  if (variant === 'task') {
    // We handle drag & drop on this outer Box, plus the width/height here
    return (
      <Box
        style={style}
        draggable={taskProps?.draggable}
        onDragStart={taskProps?.onDragStart}
        onDragOver={taskProps?.onDragOver}
        onDrop={taskProps?.onDrop}
        sx={{ width, height }}
        {...rest}
      >
        <TaskCard
          title={taskProps?.title}
          description={taskProps?.description}
          checked={taskProps?.checked}
          onCheck={taskProps?.onCheck}
          disabled={taskProps?.disabled}
        />
      </Box>
    )
  }

  // --------------------------
  // FALLBACK: NO MATCH
  // --------------------------
  return null
}

Card.displayName = 'Card'

export default Card
export type { CardProps }
