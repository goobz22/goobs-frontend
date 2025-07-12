/**
 * @fileoverview Storybook stories for the Card component and its variants.
 */
import type { Meta, StoryObj } from '@storybook/react'
import Card from './index'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'task',
        'product',
        'inventory',
        'productsummary',
        'simplepricingsummary',
        'detailedpricingsummary',
      ],
    },
    sacredtheme: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Card>

// --------------------------------------------------------------------------
// Stories for each variant
// --------------------------------------------------------------------------

export const Default: Story = {
  args: {
    variant: 'default',
    title: 'Default Card',
    body: 'This is the body of the default card.',
    breadcrumbEnabled: true,
  },
}

export const Task: Story = {
  args: {
    variant: 'task',
    title: 'A Task to be Done',
    description: 'This is the description of the task.',
  },
}

export const Product: Story = {
  args: {
    variant: 'product',
    title: 'Awesome Product',
    featuredescriptions: ['Feature A', 'Feature B'],
    createdBy: 'The Creator',
  },
}

export const Inventory: Story = {
  args: {
    variant: 'inventory',
    title: 'Inventory Item',
    image: 'https://via.placeholder.com/300x200',
    price: '$99.99',
    quantity: 10,
  },
}

export const ProductSummary: Story = {
  args: {
    variant: 'productsummary',
    title: 'Product Summary',
    body: 'A brief summary of the product.',
    annualPrice: '999',
    monthlyPrice: '99',
  },
}

export const SimplePricingSummary: Story = {
  args: {
    variant: 'simplepricingsummary',
    subtotal: '$100.00',
    totalPrice: '$120.00',
  },
}

export const DetailedPricingSummary: Story = {
  args: {
    variant: 'detailedpricingsummary',
    product: 'Detailed Product',
    vendor: 'A Reputable Vendor',
    subtotal: '$100.00',
    vat: '$20.00',
    totalPrice: '$120.00',
  },
}

// --------------------------------------------------------------------------
// Sacred Theme Stories
// --------------------------------------------------------------------------

const sacredArgs = {
  sacredtheme: true,
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const SacredDefault: Story = {
  name: 'Sacred/Default',
  args: {
    ...Default.args,
    ...sacredArgs,
  },
  parameters: sacredArgs.parameters,
}

export const SacredTask: Story = {
  name: 'Sacred/Task',
  args: {
    ...Task.args,
    ...sacredArgs,
  },
  parameters: sacredArgs.parameters,
}

export const SacredProduct: Story = {
  name: 'Sacred/Product',
  args: {
    ...Product.args,
    ...sacredArgs,
  },
  parameters: sacredArgs.parameters,
}
