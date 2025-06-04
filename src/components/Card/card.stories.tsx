// src/components/Card/card.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import Card from './index'
import { CardProps } from './index'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof Card>

// A reusable placeholder image
const sampleImage = 'https://via.placeholder.com/300x200.png?text=Sample+Image'

/**
 * 1) Default Card - Basic
 */
export const DefaultBasic: Story = {
  name: 'Default (Basic)',
  args: {
    variant: 'default',
    title: 'Basic Default Card',
    body: 'This is a basic default card with only title and body.',
  } as CardProps,
  // No user actions => remove 'async'
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Title should be visible
    expect(canvas.getByText('Basic Default Card')).toBeInTheDocument()
    // Body should be visible
    expect(
      canvas.getByText('This is a basic default card with only title and body.')
    ).toBeInTheDocument()
  },
}

/**
 * 2) Default with an image (top)
 */
export const DefaultWithImageTop: Story = {
  name: 'Default (Image on Top)',
  args: {
    variant: 'default',
    title: 'Card with Top Image',
    body: 'This card has an image at the top position.',
    image: sampleImage,
    imagePosition: 'top',
  } as CardProps,
  // No user actions => remove 'async'
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Title should be visible
    expect(canvas.getByText('Card with Top Image')).toBeInTheDocument()
  },
}

/**
 * 3) Default with an image (left) + favorite + breadcrumb
 */
export const DefaultWithImageLeftFavBreadcrumb: Story = {
  name: 'Default (Image Left + Favorite + Breadcrumb)',
  args: {
    variant: 'default',
    title: 'Card with Image Left',
    body: 'Image is on the left, plus favorite icon and breadcrumb links.',
    image: sampleImage,
    imagePosition: 'left',
    favoriteEnabled: true,
    breadcrumbEnabled: true,
    linkEnabled: true,
    parentText: 'Dashboard',
    parentLink: '/dashboard',
    childText: 'Section',
    childLink: '/dashboard/section',
    grandchildLink: '/dashboard/section/item',
  } as CardProps,
  // No user actions => remove 'async'
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Title and body
    expect(canvas.getByText('Card with Image Left')).toBeInTheDocument()
    // We see "Dashboard" breadcrumb
    expect(canvas.getByText('Dashboard')).toBeInTheDocument()
    // Check favorite icon presence if needed
  },
}

/**
 * 4) Default with Stepper
 *    We must provide stepNumber, label, stepLink, status for each step
 */
export const DefaultWithStepper: Story = {
  name: 'Default (with Stepper)',
  args: {
    variant: 'default',
    title: 'Card with Stepper',
    body: 'A stepper is displayed below the body.',
    stepperEnabled: true,
    stepperActiveStep: 1,
    stepperSteps: [
      {
        stepNumber: 1,
        label: 'Step One',
        stepLink: '#step1',
        status: 'completed',
      },
      {
        stepNumber: 2,
        label: 'Step Two',
        stepLink: '#step2',
        status: 'active',
      },
      {
        stepNumber: 3,
        label: 'Step Three',
        stepLink: '#step3',
        status: 'inactive',
      },
    ],
  } as CardProps,
  // No user actions => remove 'async'
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Title
    expect(canvas.getByText('Card with Stepper')).toBeInTheDocument()
    // Step One label
    expect(canvas.getByText('Step One')).toBeInTheDocument()
  },
}

/**
 * 5) Inventory variant
 */
export const InventoryVariant: Story = {
  args: {
    variant: 'inventory',
    title: 'Inventory Card Title',
    image: sampleImage,
    license: 'Single-Use',
    developmentUse: 'Yes',
    productionUse: 'Yes',
    updates: '3 months',
    support: 'Email only',
    price: '$100.00',
    quantity: 2,
    width: '600px',
    height: '240px',
  } as CardProps,
  // No user actions => remove 'async'
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Check for license text
    expect(canvas.getByText(/License: Single-Use/i)).toBeInTheDocument()
    // Price & quantity
    expect(canvas.getByText(/2 x \$100.00/)).toBeInTheDocument()
  },
}

/**
 * 6) Pricing Summary variant (SimplePricingSummary)
 *    We DO use userEvent, so keep 'async' and use 'await'.
 */
export const SimplePricingSummaryVariant: Story = {
  args: {
    variant: 'simplepricingsummary',
    subtotal: 'USD 200.00',
    totalPrice: 'USD 250.00',
    proceedText: 'Proceed',
    taxText: 'Tax might apply.',
    discountText: 'Coupons can be applied next step.',
    onProceed: () => {
      alert('Proceed clicked!')
    },
    width: '400px',
    height: 'auto',
  } as CardProps,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Subtotal check
    expect(canvas.getByText('USD 200.00')).toBeInTheDocument()
    // Total check
    expect(canvas.getByText('USD 250.00')).toBeInTheDocument()

    // Click "Proceed"
    const proceedButton = canvas.getByRole('button', { name: 'Proceed' })
    await userEvent.click(proceedButton)
  },
}

/**
 * 7) Detailed Pricing Summary variant
 *    We use userEvent, so keep 'async' and 'await'.
 */
export const DetailedPricingSummaryVariant: Story = {
  args: {
    variant: 'detailedpricingsummary',
    product: 'Sample Product × 2',
    vendor: 'Example Vendor LLC',
    vendorPrice: '$180.00',
    subtotal: '$180.00',
    vat: '$0.00',
    totalPrice: '$180.00',
    proceedText: 'Confirm Purchase',
    onProceed: () => {
      alert('Confirm Purchase clicked!')
    },
    width: '400px',
    height: 'auto',
  } as CardProps,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Product check
    expect(canvas.getByText('Sample Product × 2')).toBeInTheDocument()
    // Vendor check
    expect(canvas.getByText('Example Vendor LLC')).toBeInTheDocument()

    // Try button
    const confirmBtn = canvas.getByRole('button', {
      name: /confirm purchase/i,
    })
    await userEvent.click(confirmBtn)
  },
}

/**
 * 8) Product variant
 *    We use userEvent, so keep 'async' and 'await'.
 */
export const ProductVariant: Story = {
  args: {
    variant: 'product',
    title: 'Awesome Product',
    featuredescriptions: [
      'Feature #1: Speed',
      'Feature #2: Reliability',
      'Feature #3: Scalability',
    ],
    releaseDate: '2023-01-01',
    createdBy: 'MyCompany',
    onBuy: () => alert('Buy now clicked'),
    onLivePreview: () => alert('Live preview clicked'),
    onContact: () => alert('Contact clicked'),
    width: '500px',
    height: 'auto',
  } as CardProps,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Confirm features
    expect(canvas.getByText('✓ Feature #1: Speed')).toBeInTheDocument()
    // Try Buy Now
    const buyBtn = canvas.getByRole('button', { name: 'Buy now' })
    await userEvent.click(buyBtn)
  },
}

/**
 * 9) Product Summary variant
 *    We use userEvent to toggle monthly/annual, so keep 'async' and 'await'.
 */
export const ProductSummaryVariant: Story = {
  args: {
    variant: 'productsummary',
    title: 'Amazing SaaS Product',
    body: 'Choose between monthly or annual billing.',
    annualPrice: '99.99',
    monthlyPrice: '9.99',
    button1Props: {
      text: 'Get Started',
      backgroundcolor: 'black',
      fontcolor: 'white',
      onClick: () => alert('Get Started clicked!'),
    },
    button2Props: {
      text: 'More Info',
      backgroundcolor: '#0066cc',
      fontcolor: 'white',
      onClick: () => alert('More Info clicked!'),
    },
    width: '450px',
    height: 'auto',
  } as CardProps,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Check for monthly vs annual text
    expect(canvas.getByText('Amazing SaaS Product')).toBeInTheDocument()

    // The toggle Switch is displayed with role='checkbox'
    const toggleSwitch = canvas.getByRole('checkbox')
    // Initially "annual" is selected => Switch is checked
    expect(toggleSwitch).toBeChecked()

    // Switch to monthly
    await userEvent.click(toggleSwitch)
    // Now it should be unchecked
    expect(toggleSwitch).not.toBeChecked()
  },
}

/**
 * 10) Task variant
 *     No user events => remove 'async'
 */
export const TaskVariant: Story = {
  args: {
    variant: 'task',
    title: 'My Task',
    description: 'Complete the documentation.',
    checked: false,
    onCheck: (e: React.ChangeEvent<HTMLInputElement>) => {
      alert(`Checkbox changed! Now: ${e.target.checked}`)
    },
    width: '400px',
    height: 'auto',
  } as CardProps,
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Check for text
    expect(canvas.getByText('My Task')).toBeInTheDocument()
    expect(canvas.getByText('Complete the documentation.')).toBeInTheDocument()

    // If your TaskCard has a checkbox we want to test, we could do:
    // const checkbox = canvas.getByRole('checkbox')
    // userEvent.click(checkbox) // No async needed if we don't await
    // expect(checkbox).toBeChecked()
  },
}
