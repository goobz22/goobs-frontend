/**
 * @fileoverview Storybook stories for the RadioGroup component.
 * These stories showcase the various themes and options for the RadioGroup component.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect, userEvent } from 'storybook/test'
import RadioGroup, { RadioOption } from './index'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    labelText: { control: 'text' },
    defaultValue: { control: 'text' },
    options: { control: 'object' },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

// Sample options for stories
const basicOptions: RadioOption[] = [
  { label: 'Option 1' },
  { label: 'Option 2' },
  { label: 'Option 3' },
]

const coloredOptions: RadioOption[] = [
  { label: 'Red Option', color: '#dc2626' },
  { label: 'Blue Option', color: '#2563eb' },
  { label: 'Green Option', color: '#16a34a' },
  { label: 'Purple Option', color: '#9333ea' },
]

const preferenceOptions: RadioOption[] = [
  { label: 'Email notifications' },
  { label: 'SMS notifications' },
  { label: 'Push notifications' },
  { label: 'No notifications' },
]

const planOptions: RadioOption[] = [
  { label: 'Basic Plan - $9/month' },
  { label: 'Pro Plan - $19/month' },
  { label: 'Enterprise Plan - $49/month' },
]

const mysticalOptions: RadioOption[] = [
  { label: 'Divine Insight' },
  { label: 'Sacred Lightning' },
  { label: 'Lunar Wisdom' },
  { label: 'Phoenix Fire' },
]

// --------------------------------------------------------------------------
// LIGHT THEME STORIES
// --------------------------------------------------------------------------

export const Light: Story = {
  name: 'Light/Basic',
  args: {
    name: 'basic-radio',
    label: 'Choose an option',
    options: basicOptions,
    defaultValue: 'Option 1',
    styles: {
      theme: 'light',
    },
  },
}

export const LightWithLabelText: Story = {
  name: 'Light/With Label Text',
  args: {
    name: 'preference-radio',
    labelText: 'Notification Preferences',
    options: preferenceOptions,
    defaultValue: 'Email notifications',
    styles: {
      theme: 'light',
    },
  },
}

export const LightWithColoredOptions: Story = {
  name: 'Light/Colored Options',
  args: {
    name: 'colored-radio',
    label: 'Select your favorite color',
    options: coloredOptions,
    defaultValue: 'Blue Option',
    styles: {
      theme: 'light',
    },
  },
}

export const LightCustomSize: Story = {
  name: 'Light/Custom Size',
  args: {
    name: 'size-radio',
    label: 'Custom sized radio buttons',
    options: basicOptions,
    defaultValue: 'Option 2',
    styles: {
      theme: 'light',
      radioSize: '24px',
      labelFontSize: '1rem',
      padding: '0.75rem 0',
    },
  },
}

// --------------------------------------------------------------------------
// DARK THEME STORIES
// --------------------------------------------------------------------------

export const Dark: Story = {
  name: 'Dark/Default',
  args: {
    name: 'dark-radio',
    label: 'Choose your plan',
    options: planOptions,
    defaultValue: 'Pro Plan - $19/month',
    styles: {
      theme: 'dark',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const DarkWithCustomColors: Story = {
  name: 'Dark/Custom Colors',
  args: {
    name: 'dark-custom-radio',
    label: 'Select notification type',
    options: preferenceOptions,
    defaultValue: 'Push notifications',
    styles: {
      theme: 'dark',
      radioInnerColor: '#60a5fa',
      radioOuterBorderColor: '#6b7280',
      radioHoverBorderColor: '#60a5fa',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// DARK THEME STORIES (CONTINUED)
// --------------------------------------------------------------------------

export const DarkBasic: Story = {
  name: 'Dark/Basic Options',
  args: {
    name: 'dark-basic-radio',
    label: 'Choose Your Power',
    options: mysticalOptions,
    defaultValue: 'Divine Insight',
    styles: {
      theme: 'dark',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const DarkWithGlyph: Story = {
  name: 'Dark/With Glyph',
  args: {
    name: 'dark-glyph-radio',
    labelText: 'Select Your Divine Blessing',
    options: mysticalOptions,
    defaultValue: 'Sacred Lightning',
    styles: {
      theme: 'dark',
      showGlyph: true,
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const DarkCustomized: Story = {
  name: 'Dark/Customized',
  args: {
    name: 'dark-custom-radio',
    labelText: 'Channel Arcane Energy',
    options: mysticalOptions,
    defaultValue: 'Lunar Wisdom',
    styles: {
      theme: 'dark',
      radioSize: '22px',
      labelFontSize: '1rem',
      padding: '0.75rem 0',
      showGlyph: true,
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// CUSTOMIZATION STORIES
// --------------------------------------------------------------------------

export const CustomBrandColors: Story = {
  name: 'Customization/Brand Colors',
  args: {
    name: 'brand-radio',
    label: 'Brand themed radio group',
    options: basicOptions,
    defaultValue: 'Option 2',
    styles: {
      theme: 'light',
      labelColor: '#059669',
      radioOuterBorderColor: '#059669',
      radioInnerColor: '#059669',
      radioHoverBorderColor: '#047857',
      textColor: '#065f46',
    },
  },
}

export const CustomSizing: Story = {
  name: 'Customization/Custom Sizing',
  args: {
    name: 'sizing-radio',
    label: 'Large radio buttons',
    options: basicOptions,
    defaultValue: 'Option 1',
    styles: {
      theme: 'light',
      radioSize: '28px',
      labelFontSize: '1.125rem',
      textFontSize: '1rem',
      padding: '1rem 0',
      marginBottom: '1rem',
    },
  },
}

export const CustomFonts: Story = {
  name: 'Customization/Custom Fonts',
  args: {
    name: 'font-radio',
    label: 'Custom typography',
    options: planOptions,
    defaultValue: 'Basic Plan - $9/month',
    styles: {
      theme: 'light',
      labelFontFamily: 'Georgia, serif',
      labelFontWeight: 'bold',
      textFontFamily: 'Georgia, serif',
      labelFontSize: '1.125rem',
    },
  },
}

// --------------------------------------------------------------------------
// INTERACTIVE STORIES
// --------------------------------------------------------------------------

// Component for Interactive Demo
const InteractiveDemoComponent: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState('Option 2')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <div style={{ marginBottom: '20px' }}>
        <strong>Current selection: </strong>
        <span style={{ color: '#2563eb' }}>{selectedValue}</span>
      </div>

      <RadioGroup
        name="interactive-radio"
        label="Interactive Radio Group"
        options={basicOptions}
        defaultValue={selectedValue}
        onChange={handleChange}
        styles={{ theme: 'light' }}
      />

      <div
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
        }}
      >
        <small>Selection updates in real-time</small>
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive/State Management',
  render: () => <InteractiveDemoComponent />,
}

export const MultipleGroups: Story = {
  name: 'Interactive/Multiple Groups',
  render: () => {
    return (
      <div
        style={{
          padding: '20px',
          display: 'flex',
          gap: '40px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: '250px' }}>
          <RadioGroup
            name="group1"
            label="Notification Settings"
            options={preferenceOptions}
            defaultValue="Email notifications"
            styles={{ theme: 'light' }}
          />
        </div>

        <div style={{ minWidth: '250px' }}>
          <RadioGroup
            name="group2"
            label="Subscription Plan"
            options={planOptions}
            defaultValue="Pro Plan - $19/month"
            styles={{ theme: 'light' }}
          />
        </div>
      </div>
    )
  },
}

// --------------------------------------------------------------------------
// FORM INTEGRATION STORY
// --------------------------------------------------------------------------

// Component for Form Integration
const FormIntegrationComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    notifications: 'Email notifications',
    plan: 'Pro Plan - $19/month',
    theme: 'Divine Insight',
  })

  const handleNotificationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, notifications: event.target.value }))
  }

  const handlePlanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, plan: event.target.value }))
  }

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, theme: event.target.value }))
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
        User Preferences Form
      </h3>

      <div style={{ marginBottom: '30px' }}>
        <RadioGroup
          name="notifications"
          labelText="How would you like to receive notifications?"
          options={preferenceOptions}
          defaultValue={formData.notifications}
          onChange={handleNotificationChange}
          styles={{ theme: 'light' }}
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <RadioGroup
          name="plan"
          labelText="Select your subscription plan:"
          options={planOptions}
          defaultValue={formData.plan}
          onChange={handlePlanChange}
          styles={{ theme: 'light' }}
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <RadioGroup
          name="theme"
          labelText="Choose your theme:"
          options={mysticalOptions}
          defaultValue={formData.theme}
          onChange={handleThemeChange}
          styles={{ theme: 'dark' }}
        />
      </div>

      <div
        style={{
          padding: '15px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Form Data:</h4>
        <pre style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export const FormIntegration: Story = {
  name: 'Interactive/Form Integration',
  render: () => <FormIntegrationComponent />,
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  name: 'Interaction and A11y Test',
  args: {
    name: 'test-radio',
    label: 'Test Radio Group',
    options: basicOptions,
    defaultValue: 'Option 1',
    styles: { theme: 'light' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check label is visible
    const label = canvas.getByText('Test Radio Group')
    await expect(label).toBeVisible()

    // Check all options are visible
    const option1 = canvas.getByText('Option 1')
    const option2 = canvas.getByText('Option 2')
    const option3 = canvas.getByText('Option 3')

    await expect(option1).toBeVisible()
    await expect(option2).toBeVisible()
    await expect(option3).toBeVisible()

    // Check first option is selected by default
    const radio1 = canvas.getByDisplayValue('Option 1')
    await expect(radio1).toBeChecked()

    // Test selecting different option
    await userEvent.click(option2)
    const radio2 = canvas.getByDisplayValue('Option 2')
    await expect(radio2).toBeChecked()
    await expect(radio1).not.toBeChecked()
  },
}
