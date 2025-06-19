// src/components/RadioGroup/radiogroup.stories.tsx

import type { Meta, StoryObj } from '@storybook/react'
import RadioGroup, { RadioOption } from './index'

/**
 * Example options to be used across stories
 */
const sampleOptions: RadioOption[] = [
  { label: 'Option A' },
  { label: 'Option B' },
  { label: 'Option C' },
]

/**
 * Setup Storybook metadata
 */
const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof RadioGroup>

/**
 * 1) Basic usage
 */
export const Basic: Story = {
  args: {
    name: 'basicExample',
    labelText: 'Choose an Option',
    options: sampleOptions,
  },
}

/**
 * 2) With a default selected value
 */
export const WithDefaultValue: Story = {
  args: {
    name: 'defaultExample',
    labelText: 'Select your favorite',
    defaultValue: 'Option B',
    options: sampleOptions,
  },
}

/**
 * 3) Custom Label Styles
 */
export const CustomLabelStyles: Story = {
  args: {
    name: 'customStyles',
    labelText: 'Which flavor do you prefer?',
    options: [
      { label: 'Vanilla', fontColor: '#3f51b5', fontVariant: 'merriparagraph' },
      {
        label: 'Chocolate',
        fontColor: '#f44336',
        fontVariant: 'merriparagraph',
      },
      {
        label: 'Strawberry',
        fontColor: '#009688',
        fontVariant: 'merriparagraph',
      },
    ],
  },
}

/**
 * 4) Label variant & color from the top-level props
 */
export const TopLevelLabelStyling: Story = {
  args: {
    name: 'topLevelStyling',
    labelText: 'Survey Question',
    labelFontColor: '#673ab7', // Deep Purple
    options: sampleOptions,
  },
}

/**
 * 5) Interaction: Selecting an Option
 */
export const SelectingOption: Story = {
  args: {
    name: 'interactionExample',
    labelText: 'Pick a letter',
    options: sampleOptions,
  },
}
