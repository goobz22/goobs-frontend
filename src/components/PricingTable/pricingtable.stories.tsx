// src/components/PricingTable/pricingtable.stories.tsx

import { Meta, StoryObj } from '@storybook/react'
import PricingTable, { PricingProps } from './index'
import React from 'react'

const defaultConfig: PricingProps = {
  tabletitle: { text: 'Features' },
  packagecolumns: {
    packagenames: ['ThothOS', 'ThothOS Pro', 'ThothOS Enterprise'],
  },
  monthlyprice: { prices: ['Monthly - $10', 'Monthly - $20', 'Monthly - $30'] },
  annualprice: {
    annualprices: ['Annually - $100', 'Annually - $200', 'Annually - $300'],
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
      tiedtopackage: { tiedtopackages: ['true', 'true', 'true'] },
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
      tiedtopackage: { tiedtopackages: ['true', 'true', 'true'] },
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

const meta: Meta<typeof PricingTable> = {
  title: 'Components/PricingTable',
  component: PricingTable,
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark', 'sacred'],
    },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof PricingTable>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="w-[800px] p-6 bg-gray-50 rounded-lg">
      <PricingTable {...args} />
    </div>
  ),
  args: {
    ...defaultConfig,
    theme: 'light',
    highlightedPackageIndex: 1,
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="w-[800px] p-6 bg-black rounded-lg">
      <PricingTable {...args} />
    </div>
  ),
  args: {
    ...defaultConfig,
    theme: 'sacred',
    highlightedPackageIndex: 1,
  },
}

const InteractiveDemoRenderer = () => {
  const [sacredtheme, setsacredtheme] = React.useState(false)
  return (
    <div
      className={`w-[800px] p-6 rounded-lg ${sacredtheme ? 'bg-black' : 'bg-gray-50'}`}
    >
      <div className="fixed top-4 right-4 z-50 p-4 bg-white rounded-lg border shadow-lg">
        <label>
          <input
            type="checkbox"
            checked={sacredtheme}
            onChange={e => setsacredtheme(e.target.checked)}
          />{' '}
          Sacred Theme
        </label>
      </div>
      <PricingTable
        {...defaultConfig}
        theme={sacredtheme ? 'sacred' : 'light'}
        highlightedPackageIndex={1}
      />
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

export const BothPrices: Story = {
  name: 'Both Monthly and Annual',
  render: args => (
    <div className="w-[800px] p-6 bg-gray-50 rounded-lg">
      <PricingTable {...args} />
    </div>
  ),
  args: {
    ...defaultConfig,
    theme: 'light',
    highlightedPackageIndex: 2,
  },
}
