// src/components/Card/card.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import Card, { CardVariant } from './index'

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

export const Default: Story = {
  args: {
    variant: 'default',
    title: 'Default Card',
    body: 'This is the body of the default card.',
    sacredtheme: false,
  },
}

export const DefaultWithImage: Story = {
  args: {
    variant: 'default',
    title: 'Default Card with Image',
    body: 'This card includes an image at the top.',
    image: 'https://via.placeholder.com/300x200',
    imagePosition: 'top',
    sacredtheme: false,
  },
}

export const DefaultWithBreadcrumbs: Story = {
  args: {
    variant: 'default',
    title: 'Default Card with Breadcrumbs',
    body: 'This card shows breadcrumb navigation.',
    breadcrumbEnabled: true,
    parentText: 'Parent',
    parentLink: '/parent',
    childText: 'Child',
    childLink: '/child',
    sacredtheme: false,
  },
}

export const DefaultWithStepper: Story = {
  args: {
    variant: 'default',
    title: 'Default Card with Stepper',
    body: 'This card includes a stepper component.',
    stepperEnabled: true,
    stepperSteps: [
      {
        stepNumber: 1,
        label: 'Step 1',
        stepLink: '#step1',
        status: 'completed',
      },
      { stepNumber: 2, label: 'Step 2', stepLink: '#step2', status: 'active' },
      {
        stepNumber: 3,
        label: 'Step 3',
        stepLink: '#step3',
        status: 'inactive',
      },
    ],
    sacredtheme: false,
  },
}

export const Task: Story = {
  args: {
    variant: 'task',
    title: 'Task Card',
    description: 'This is a task card.',
    sacredtheme: false,
  },
}

export const TaskChecked: Story = {
  args: {
    variant: 'task',
    title: 'Completed Task',
    description: 'This task has been completed.',
    checked: true,
    sacredtheme: false,
  },
}

export const TaskDisabled: Story = {
  args: {
    variant: 'task',
    title: 'Disabled Task',
    description: 'This task is disabled and cannot be checked.',
    disabled: true,
    sacredtheme: false,
  },
}

export const TaskDraggable: Story = {
  args: {
    variant: 'task',
    title: 'Draggable Task',
    description: 'This task can be dragged and dropped.',
    draggable: true,
    sacredtheme: false,
  },
}

export const Product: Story = {
  args: {
    variant: 'product',
    title: 'Product Card',
    sacredtheme: false,
  },
}

export const ProductDetailed: Story = {
  args: {
    variant: 'product',
    title: 'Advanced Analytics Dashboard',
    numDevelopers: 5,
    licenses: 10,
    unitPrice: 99.99,
    total: 499.95,
    featuredescriptions: [
      'Real-time analytics',
      'Custom dashboards',
      'API integration',
      'Team collaboration',
      'Advanced reporting',
    ],
    releaseDate: '2024-01-15',
    createdBy: 'DataViz Solutions',
    sacredtheme: false,
  },
}

export const ProductWithActions: Story = {
  args: {
    variant: 'product',
    title: 'Web Development Framework',
    numDevelopers: 3,
    licenses: 5,
    unitPrice: 149.99,
    total: 449.97,
    featuredescriptions: [
      'Modern React components',
      'TypeScript support',
      'Responsive design',
      'Dark mode support',
    ],
    releaseDate: '2024-02-01',
    createdBy: 'Frontend Studio',
    onBuy: () => console.log('Buy clicked'),
    onLivePreview: () => console.log('Live preview clicked'),
    onContact: () => console.log('Contact clicked'),
    sacredtheme: false,
  },
}

export const Inventory: Story = {
  args: {
    variant: 'inventory',
    title: 'Inventory Card',
    sacredtheme: false,
  },
}

export const InventoryDetailed: Story = {
  args: {
    variant: 'inventory',
    title: 'Premium Analytics Suite',
    image: 'https://via.placeholder.com/300x200',
    license: 'Commercial License',
    developmentUse: 'Unlimited development environments',
    productionUse: 'Up to 5 production deployments',
    updates: 'Free updates for 1 year',
    support: '24/7 priority support',
    price: '$299.99',
    quantity: 3,
    sacredtheme: false,
  },
}

export const InventoryWithActions: Story = {
  args: {
    variant: 'inventory',
    title: 'UI Component Library',
    image: 'https://via.placeholder.com/300x200',
    license: 'Extended License',
    developmentUse: 'Unlimited team members',
    productionUse: 'Unlimited production use',
    updates: 'Lifetime updates',
    support: 'Community + Email support',
    price: '$149.99',
    quantity: 1,
    onRemove: () => console.log('Remove clicked'),
    sacredtheme: false,
  },
}

export const ProductSummary: Story = {
  args: {
    variant: 'productsummary',
    title: 'Product Summary',
    sacredtheme: false,
  },
}

export const ProductSummaryDetailed: Story = {
  args: {
    variant: 'productsummary',
    title: 'Premium Analytics Dashboard',
    body: 'A comprehensive analytics solution for modern businesses with real-time insights and advanced reporting capabilities.',
    annualPrice: '$999.99',
    monthlyPrice: '$99.99',
    sacredtheme: false,
  },
}

export const ProductSummaryWithButtons: Story = {
  args: {
    variant: 'productsummary',
    title: 'Enterprise Cloud Solution',
    body: 'Scale your business with our enterprise-grade cloud infrastructure and support.',
    annualPrice: '$2,499.99',
    monthlyPrice: '$249.99',
    button1Props: {
      text: 'Start Free Trial',
      backgroundcolor: '#3B82F6',
      fontcolor: '#FFFFFF',
      onClick: () => console.log('Start trial clicked'),
    },
    button2Props: {
      text: 'Contact Sales',
      backgroundcolor: '#6B7280',
      fontcolor: '#FFFFFF',
      onClick: () => console.log('Contact sales clicked'),
    },
    sacredtheme: false,
  },
}

export const SimplePricingSummary: Story = {
  args: {
    variant: 'simplepricingsummary',
    sacredtheme: false,
  },
}

export const SimplePricingSummaryDetailed: Story = {
  args: {
    variant: 'simplepricingsummary',
    subtotal: '$149.99',
    totalPrice: '$164.99',
    proceedText: 'Complete Purchase',
    taxText: 'Tax and fees included',
    discountText: 'Save 10% on annual billing',
    sacredtheme: false,
  },
}

export const SimplePricingSummaryWithActions: Story = {
  args: {
    variant: 'simplepricingsummary',
    subtotal: '$299.99',
    totalPrice: '$329.99',
    proceedText: 'Proceed to Checkout',
    taxText: 'Tax calculated at checkout',
    discountText: 'Applied: SAVE20 (-20%)',
    onProceed: () => console.log('Proceed to checkout clicked'),
    sacredtheme: false,
  },
}

export const DetailedPricingSummary: Story = {
  args: {
    variant: 'detailedpricingsummary',
    sacredtheme: false,
  },
}

export const DetailedPricingSummaryComplete: Story = {
  args: {
    variant: 'detailedpricingsummary',
    product: 'Premium Analytics Dashboard',
    vendor: 'DataViz Solutions Inc.',
    vendorPrice: '$199.99',
    subtotal: '$199.99',
    vat: '$40.00',
    totalPrice: '$239.99',
    proceedText: 'Complete Order',
    sacredtheme: false,
  },
}

export const DetailedPricingSummaryWithActions: Story = {
  args: {
    variant: 'detailedpricingsummary',
    product: 'Enterprise Cloud Platform',
    vendor: 'CloudTech Solutions',
    vendorPrice: '$999.99',
    subtotal: '$999.99',
    vat: '$199.99',
    totalPrice: '$1,199.98',
    proceedText: 'Finalize Purchase',
    width: '400px',
    height: '500px',
    onProceed: () => console.log('Finalize purchase clicked'),
    sacredtheme: false,
  },
}

export const SacredTheme: Story = {
  args: {
    ...Default.args,
    sacredtheme: true,
  },
}

export const SacredThemeTask: Story = {
  args: {
    variant: 'task',
    title: 'Sacred Task',
    description: 'A mystical task awaits completion.',
    sacredtheme: true,
  },
}

export const SacredThemeProduct: Story = {
  args: {
    variant: 'product',
    title: 'Ancient Wisdom Dashboard',
    numDevelopers: 7,
    licenses: 13,
    unitPrice: 777.77,
    total: 5444.39,
    featuredescriptions: [
      'Mystical analytics',
      'Sacred geometries',
      'Hieroglyphic interface',
      'Cosmic insights',
      'Divine reporting',
    ],
    releaseDate: '2024-03-21',
    createdBy: 'Temple of Data',
    sacredtheme: true,
  },
}

export const SacredThemeInventory: Story = {
  args: {
    variant: 'inventory',
    title: 'Sacred Artifact Collection',
    image: 'https://via.placeholder.com/300x200',
    license: 'Divine License',
    developmentUse: 'Temple environments only',
    productionUse: 'Sacred ceremonies',
    updates: 'Eternal updates',
    support: 'Divine guidance',
    price: '999 Gold Coins',
    quantity: 1,
    sacredtheme: true,
  },
}

export const SacredThemeProductSummary: Story = {
  args: {
    variant: 'productsummary',
    title: 'Sacred Knowledge Portal',
    body: 'Unlock the mysteries of ancient wisdom with our divine analytics platform.',
    annualPrice: '7,777 Gold Coins',
    monthlyPrice: '777 Gold Coins',
    button1Props: {
      text: 'Begin Journey',
      sacredtheme: true,
    },
    button2Props: {
      text: 'Seek Wisdom',
      sacredtheme: true,
    },
    sacredtheme: true,
  },
}

export const SacredThemeSimplePricing: Story = {
  args: {
    variant: 'simplepricingsummary',
    subtotal: '777 Gold Coins',
    totalPrice: '888 Gold Coins',
    proceedText: 'Complete Sacred Transaction',
    taxText: 'Divine taxes included',
    discountText: 'Blessed with 10% divine discount',
    sacredtheme: true,
  },
}

export const SacredThemeDetailedPricing: Story = {
  args: {
    variant: 'detailedpricingsummary',
    product: 'Sacred Analytics Codex',
    vendor: 'Temple of Ancient Wisdom',
    vendorPrice: '1,234 Gold Coins',
    subtotal: '1,234 Gold Coins',
    vat: '247 Gold Coins',
    totalPrice: '1,481 Gold Coins',
    proceedText: 'Seal Sacred Pact',
    sacredtheme: true,
  },
}

const InteractiveDemoComponent: React.FC = () => {
  const [variant, setVariant] = React.useState<CardVariant>('default')
  const [sacred, setSacred] = React.useState(false)

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 100,
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
        }}
      >
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Controls</h3>
        <select
          value={variant}
          onChange={e => setVariant(e.target.value as CardVariant)}
          style={{ marginBottom: '0.5rem' }}
        >
          <option value="default">Default</option>
          <option value="task">Task</option>
          <option value="product">Product</option>
          <option value="inventory">Inventory</option>
          <option value="productsummary">Product Summary</option>
          <option value="simplepricingsummary">Simple Pricing Summary</option>
          <option value="detailedpricingsummary">
            Detailed Pricing Summary
          </option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={sacred}
            onChange={e => setSacred(e.target.checked)}
          />
          <span style={{ marginLeft: '0.5rem' }}>Sacred Theme</span>
        </label>
      </div>
      <Card
        variant={variant}
        sacredtheme={sacred}
        title={`${variant} card`}
        body="This is the body of the card."
      />
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoComponent />,
}
