// src/components/PricingTable/pricingtable.stories.tsx

import { Meta, StoryObj } from '@storybook/nextjs'
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
  render: args => (
    <div
      style={{
        width: '800px',
        padding: '24px',
        background: '#f9fafb',
        borderRadius: '8px',
      }}
    >
      <PricingTable {...args} />
    </div>
  ),
  args: {
    ...defaultConfig,
    theme: 'light',
    highlightedPackageIndex: 1,
  },
  globals: { backgrounds: { value: 'light' } },
}

export const SacredTheme: Story = {
  render: args => (
    <div
      style={{
        width: '800px',
        padding: '24px',
        background: '#000000',
        borderRadius: '8px',
      }}
    >
      <PricingTable {...args} />
    </div>
  ),
  args: {
    ...defaultConfig,
    theme: 'sacred',
    highlightedPackageIndex: 1,
  },
  globals: { backgrounds: { value: 'sacred' } },
}

/**
 * The dark theme (`theme="dark"`) on the dark canvas: the table container is
 * a near-opaque slate surface (rgba(31,41,55,0.95)) with a gray-600 border,
 * headers in near-white gray-100, price labels in gray-400, and the sacred
 * corner glyphs hidden — the `case 'dark'` palette in getThemeStyles.
 */
export const DarkTheme: Story = {
  render: args => (
    <div style={{ width: '800px', maxWidth: '100%', padding: '24px' }}>
      <PricingTable {...args} />
    </div>
  ),
  args: {
    ...defaultConfig,
    theme: 'dark',
    highlightedPackageIndex: 1,
  },
  globals: { backgrounds: { value: 'dark' } },
}

const InteractiveDemoRenderer = () => {
  const [sacredtheme, setsacredtheme] = React.useState(false)
  return (
    <div
      style={{
        width: '800px',
        padding: '24px',
        borderRadius: '8px',
        background: sacredtheme ? '#000000' : '#f9fafb',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 50,
          padding: '16px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
        }}
      >
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
  render: () => <InteractiveDemoRenderer />,
  globals: { backgrounds: { value: 'light' } },
}

export const BothPrices: Story = {
  name: 'Both Monthly and Annual',
  render: args => (
    <div
      style={{
        width: '800px',
        padding: '24px',
        background: '#f9fafb',
        borderRadius: '8px',
      }}
    >
      <PricingTable {...args} />
    </div>
  ),
  args: {
    ...defaultConfig,
    theme: 'light',
    highlightedPackageIndex: 2,
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Accessibility structure demo. The comparison renders as a real `<table>`:
 * package names are `<th scope="col">`, every feature/price row label is a
 * `<th scope="row">`, and each value is a `<td>` — so a screen reader announces
 * the relationships ("Pro, Advanced analytics, Included") instead of a flat run
 * of divs (WCAG 1.3.1 / 4.1.2). Each check icon is decorative (`aria-hidden`)
 * with a visually-hidden "Included"; an EXCLUDED cell carries a visually-hidden
 * "Not included" rather than an ambiguous blank, so inclusion is not conveyed by
 * the icon's presence alone (WCAG 1.1.1 / 1.4.1). This story deliberately mixes
 * included and excluded packages so BOTH cell states are exercised. The title is
 * an `<h2>` (`headingLevel={2}`) that names the table via `aria-labelledby`, and
 * each feature's info text is exposed inline to assistive tech (the hover
 * tooltip alone is mouse-only).
 */
export const AccessibleComparison: Story = {
  name: 'Accessible Comparison (mixed inclusion)',
  render: args => (
    <div
      style={{
        width: '800px',
        padding: '24px',
        background: '#f9fafb',
        borderRadius: '8px',
      }}
    >
      <PricingTable {...args} />
    </div>
  ),
  args: {
    tabletitle: { text: 'Compare plans' },
    theme: 'light',
    headingLevel: 2,
    highlightedPackageIndex: 1,
    packagecolumns: { packagenames: ['Starter', 'Pro', 'Enterprise'] },
    monthlyprice: { prices: ['$10', '$20', '$40'] },
    annualprice: { annualprices: ['$100', '$200', '$400'] },
    features: [
      {
        title: 'Core dashboard',
        infopopuptext: 'Included on every plan.',
        tiedtopackage: { tiedtopackages: ['true', 'true', 'true'] },
      },
      {
        title: 'Advanced analytics',
        infopopuptext: 'Available on Pro and Enterprise.',
        tiedtopackage: { tiedtopackages: ['false', 'true', 'true'] },
        subfeatures: [
          {
            title: 'Custom reports',
            tiedtopackage: { tiedtopackages: ['false', 'false', 'true'] },
          },
        ],
      },
      {
        title: 'Dedicated support',
        tiedtopackage: { tiedtopackages: ['false', 'false', 'true'] },
      },
    ],
    buttoncolumns: {
      buttontexts: ['Choose Starter', 'Choose Pro', 'Choose Enterprise'],
      buttonlinks: ['#starter', '#pro', '#enterprise'],
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * `headingLevel` controls the title's heading tag so it slots into the
 * surrounding document outline, replacing the previously hardcoded `<h5>` that
 * skipped levels (WCAG 1.3.1 / 2.4.6, and crawlable SSR heading semantics).
 * Here the title renders as an `<h3>`; the visual size is unchanged because it
 * comes from the theme's header style, not the tag. (On the sacred theme, the
 * decorative corner and footer glyphs are `aria-hidden` and their animation is
 * switched off under `prefers-reduced-motion` — WCAG 2.3.3.)
 */
export const CustomHeadingLevel: Story = {
  name: 'Configurable Heading Level (h3)',
  render: args => (
    <div
      style={{
        width: '800px',
        padding: '24px',
        background: '#f9fafb',
        borderRadius: '8px',
      }}
    >
      <PricingTable {...args} />
    </div>
  ),
  args: {
    ...defaultConfig,
    theme: 'light',
    headingLevel: 3,
    highlightedPackageIndex: 0,
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Keyboard-scrollable overflow. Six package columns inside a deliberately narrow
 * (420px) container force the table wider than its viewport. The scroll wrapper
 * is `tabIndex={0}` with `role="group"` and the table's name, so a keyboard-only
 * user can Tab to the region and scroll the off-screen columns into view with
 * the arrow keys — the columns are NOT reachable otherwise when the table has no
 * focusable control inside it (WCAG 2.1.1 Keyboard; axe
 * `scrollable-region-focusable`). This config omits `buttoncolumns` on purpose so
 * the ONLY way to reach the far columns by keyboard is the focusable scroll
 * region itself.
 */
export const KeyboardScrollableOverflow: Story = {
  name: 'Keyboard-scrollable Overflow (no buttons)',
  render: args => (
    <div
      style={{
        width: '420px',
        maxWidth: '100%',
        padding: '24px',
        background: '#f9fafb',
        borderRadius: '8px',
      }}
    >
      <PricingTable {...args} />
    </div>
  ),
  args: {
    tabletitle: { text: 'Compare every tier' },
    theme: 'light',
    headingLevel: 2,
    highlightedPackageIndex: 2,
    packagecolumns: {
      packagenames: [
        'Free',
        'Starter',
        'Growth',
        'Pro',
        'Business',
        'Enterprise',
      ],
    },
    monthlyprice: { prices: ['$0', '$10', '$20', '$40', '$80', '$160'] },
    features: [
      {
        title: 'Seats included',
        tiedtopackage: {
          tiedtopackages: ['true', 'true', 'true', 'true', 'true', 'true'],
        },
      },
      {
        title: 'Priority support',
        tiedtopackage: {
          tiedtopackages: ['false', 'false', 'true', 'true', 'true', 'true'],
        },
      },
      {
        title: 'SSO / SAML',
        tiedtopackage: {
          tiedtopackages: ['false', 'false', 'false', 'false', 'true', 'true'],
        },
      },
    ],
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Disambiguated call-to-action labels. All three plans share the SAME visible
 * button text ("Learn More") — the common pricing-page pattern. Each footer
 * button folds its package name into its accessible name via `aria-label`
 * (`"Learn More, ThothOS Pro"`), so a screen-reader user tab-navigating the
 * buttons hears which plan each CTA selects instead of three identical "Learn
 * More"s (WCAG 2.4.6 / 4.1.2). The visible label is unchanged and is contained
 * in the accessible name (WCAG 2.5.3 Label in Name). Inspect the rendered
 * `<button>`s: each carries a distinct `aria-label` while displaying the same
 * text.
 */
export const DisambiguatedButtonLabels: Story = {
  name: 'Disambiguated CTA labels (identical text)',
  render: args => (
    <div
      style={{
        width: '800px',
        padding: '24px',
        background: '#f9fafb',
        borderRadius: '8px',
      }}
    >
      <PricingTable {...args} />
    </div>
  ),
  args: {
    ...defaultConfig,
    theme: 'light',
    highlightedPackageIndex: 1,
    buttoncolumns: {
      buttontexts: ['Learn More', 'Learn More', 'Learn More'],
      buttonlinks: ['#free', '#pro', '#enterprise'],
    },
  },
  globals: { backgrounds: { value: 'light' } },
}
