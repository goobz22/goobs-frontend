// src/components/PricingTable/pricingtable.stories.tsx

import { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import PricingTable, { PricingProps } from './index'

/**
 * Local default configuration for the PricingTable component.
 * Only data properties (titles, pricing, features, and button capabilities) are defined.
 */
const defaultConfig: PricingProps = {
  tabletitle: {
    text: 'Features',
  },
  packagecolumns: {
    packagenames: ['ThothOS', 'ThothOS Pro', 'ThothOS Enterprise'],
  },
  monthlyprice: {
    prices: [
      'Monthly Pricing - $10',
      'Monthly Pricing - $20',
      'Monthly Pricing - $30',
    ],
  },
  annualprice: {
    annualprices: [
      'Annual Pricing - $100',
      'Annual Pricing - $200',
      'Annual Pricing - $300',
    ],
  },
  features: [
    {
      title: 'Frontend Components',
      infopopuptext: 'How do I choose the right plan?',
      subfeatures: [
        {
          title: 'Pricing Table',
          infopopuptext: 'Pricing table subfeature info',
        },
        {
          title: 'Feature Grid',
          infopopuptext: 'Feature grid subfeature info',
        },
      ],
      tiedtopackage: {
        tiedtopackages: ['true', 'true', 'true'],
      },
    },
    {
      title: 'Backend Capabilities',
      infopopuptext: 'What is the difference between the plans?',
      subfeatures: [
        {
          title: 'API Integration',
          infopopuptext: 'API integration subfeature info',
        },
        {
          title: 'Database Support',
          infopopuptext: 'Database support subfeature info',
        },
      ],
      tiedtopackage: {
        tiedtopackages: ['true', 'true', 'true'],
      },
    },
  ],
  buttoncolumns: {
    buttontexts: ['Learn More', 'Learn More', 'Learn More'],
    buttonlinks: [
      '#goobs-frontend-unlimited',
      '#goobs-frontend-unlimited',
      '#goobs-frontend-unlimited',
    ],
  },
}

/**
 * Setup the Storybook metadata
 */
const meta: Meta<typeof PricingTable> = {
  title: 'Components/PricingTable',
  component: PricingTable,
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof PricingTable>

/**
 * 1) Default usage with the provided defaultConfig
 *    No `await` usage => remove `async`.
 */
export const Default: Story = {
  args: {
    ...defaultConfig,
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Confirm that a main feature like "Frontend Components" is visible
    expect(canvas.getByText('Frontend Components')).toBeInTheDocument()

    // Confirm the "Packages" dropdown is present
    const dropdownButton = canvas.getByRole('button', { name: /Packages/i })
    expect(dropdownButton).toBeInTheDocument()
  },
}

/**
 * 2) Switch packages in the dropdown
 *    Uses `await userEvent...`, so keep `async`.
 */
export const SwitchPackages: Story = {
  args: {
    ...defaultConfig,
  },
  name: 'Interact: Switch Packages',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Step 1: Open the packages dropdown
    const dropdownButton = canvas.getByRole('button', { name: /Packages/i })
    await userEvent.click(dropdownButton)

    // Step 2: Choose a different package (e.g., "ThothOS Pro")
    const proOption = canvas.getByText('ThothOS Pro')
    await userEvent.click(proOption)

    // Step 3: Confirm that the monthly price text changes accordingly
    // In defaultConfig, monthly pricing for "ThothOS Pro" is "Monthly Pricing - $20"
    expect(await canvas.findByText('Monthly Pricing - $20')).toBeInTheDocument()
  },
}

/**
 * 3) Custom Title & More Features
 *    No `await` usage => remove `async`.
 */
export const CustomTitle: Story = {
  args: {
    ...defaultConfig,
    tabletitle: {
      text: 'My Custom Pricing Table',
    },
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Check for the new custom table title
    expect(canvas.getByText('My Custom Pricing Table')).toBeInTheDocument()
  },
}

/**
 * 4) Minimal scenario (no features)
 *    No `await` usage => remove `async`.
 */
export const NoFeatures: Story = {
  args: {
    ...defaultConfig,
    features: [],
  },
  name: 'Empty Features',
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // "Frontend Components" won't exist because features is empty
    expect(canvas.queryByText('Frontend Components')).not.toBeInTheDocument()

    // The rest of the layout still shows (e.g., the monthly pricing text)
    expect(canvas.getByText('Monthly Pricing - $10')).toBeInTheDocument()
  },
}

/**
 * 5) Only 2 packages scenario
 *    We do have an `await userEvent.click`, so keep `async`.
 */
export const TwoPackages: Story = {
  args: {
    ...defaultConfig,
    packagecolumns: {
      packagenames: ['Basic', 'Advanced'],
    },
    monthlyprice: {
      prices: ['Monthly - $5', 'Monthly - $15'],
    },
    annualprice: {
      annualprices: ['Annually - $50', 'Annually - $150'],
    },
    buttoncolumns: {
      buttontexts: ['Get Basic', 'Get Advanced'],
      buttonlinks: ['#basic', '#advanced'],
    },
  } as PricingProps,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check that only two packages are present in the dropdown
    const dropdownButton = canvas.getByRole('button', { name: /Packages/i })
    await userEvent.click(dropdownButton)

    expect(canvas.getByText('Basic')).toBeInTheDocument()
    expect(canvas.getByText('Advanced')).toBeInTheDocument()
    expect(canvas.queryByText('ThothOS')).not.toBeInTheDocument()
  },
}
