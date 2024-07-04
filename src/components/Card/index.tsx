import React from 'react'
import { BoxProps } from '@mui/material'
import { CustomStepperProps } from '../Stepper'
import InventoryCard from './variants/inventory'
import SimplePricingSummary from './variants/simplepricingsummary'
import DetailedPricingSummary from './variants/detailedpricingsummary'
import ProductCard from './variants/product'
import ProductSummaryCard from './variants/productsummary'
import DefaultCard from './variants/defaultconfig'
import { columnconfig } from '../Grid'
import { CustomButtonProps } from '../Button'

/**
 * Props for the Card component.
 * Extends BoxProps from Material-UI and includes additional custom properties.
 */
export interface CardProps extends BoxProps {
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
  /** Width of the card */
  width?: string
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
  /** Configuration for grid columns */
  columnconfig?: columnconfig
}

/**
 * Card component that renders different card variants based on the provided props.
 * It supports various card types including default, inventory, pricing summary, product, and more.
 */
const Card: React.FC<CardProps> = ({
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
  ...rest
}) => {
  // Render the default card variant
  if (variant === 'default') {
    return (
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
        width={width}
        height={height}
        stepperEnabled={stepperEnabled}
        stepperActiveStep={stepperActiveStep}
        stepperSteps={stepperSteps}
        {...rest}
      />
    )
  }

  // Render the inventory card variant
  if (variant === 'inventory') {
    return (
      <InventoryCard
        title={title}
        image={image}
        width={width}
        height={height}
        {...inventoryProps}
        {...rest}
      />
    )
  }

  // Render the simple pricing summary card variant
  if (variant === 'pricingsummary') {
    return (
      <SimplePricingSummary
        width={width}
        height={height}
        {...pricingSummaryProps}
        {...rest}
      />
    )
  }

  // Render the detailed pricing summary card variant
  if (variant === 'detailedpricingsummary') {
    return (
      <DetailedPricingSummary
        width={width}
        height={height}
        {...detailedPricingSummaryProps}
        {...rest}
      />
    )
  }

  // Render the product card variant
  if (variant === 'product') {
    return (
      <ProductCard width={width} height={height} {...productProps} {...rest} />
    )
  }

  // Render the product summary card variant
  if (variant === 'productsummary') {
    return (
      <ProductSummaryCard
        title={title}
        body={body}
        annualPrice={productSummaryProps?.annualPrice}
        monthlyPrice={productSummaryProps?.monthlyPrice}
        width={width}
        height={height}
        button1Props={productSummaryProps?.button1Props}
        button2Props={productSummaryProps?.button2Props}
        {...rest}
      />
    )
  }

  // Return null if no matching variant is found
  return null
}

export default Card
