// src/components/Field/Text/textfield.stories.tsx

import * as Agnostic from '../../../framework-agnostic'
import {
  createStorybookAdapter,
  adaptStoryRender,
} from '../../../framework-agnostic/adapters/react'
import { Meta, StoryObj } from '@storybook/react'
import TextField from './index'

// Create React adapter for TextField
const StorybookTextField = createStorybookAdapter(TextField, 'TextField')

const meta: Meta<typeof StorybookTextField> = {
  title: 'Components/Field/Text',
  component: StorybookTextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    sacredtheme: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    shrunklabelposition: {
      control: 'select',
      options: ['onNotch', 'aboveNotch'],
    },
  },
}

export default meta
type Story = StoryObj<typeof StorybookTextField>

export const Default: Story = {
  name: 'Default TextField',
  render: adaptStoryRender(args => {
    return Agnostic.createElement(
      'div',
      {
        style: {
          width: '400px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
        },
      },
      Agnostic.createElement(TextField, args)
    )
  }),
  args: {
    name: 'default',
    label: 'Default TextField',
    placeholder: 'Enter text here',
  },
}

export const WithValue: Story = {
  name: 'With Value',
  render: adaptStoryRender(args => {
    return Agnostic.createElement(
      'div',
      {
        style: {
          width: '400px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
        },
      },
      Agnostic.createElement(TextField, args)
    )
  }),
  args: {
    name: 'with-value',
    label: 'TextField with Value',
    placeholder: 'Enter text here',
    value: 'Sample text value',
  },
}

export const NotchedOutline: Story = {
  name: 'Notched Outline',
  render: adaptStoryRender(args => {
    return Agnostic.createElement(
      'div',
      {
        style: {
          width: '400px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
        },
      },
      Agnostic.createElement(TextField, args)
    )
  }),
  args: {
    name: 'notched',
    label: 'Notched Outline',
    placeholder: 'Watch the outline notch around the label',
    shrunklabelposition: 'onNotch',
  },
}

export const AboveNotchLabel: Story = {
  name: 'Above Notch Label',
  render: adaptStoryRender(args => {
    return Agnostic.createElement(
      'div',
      {
        style: {
          width: '400px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
        },
      },
      Agnostic.createElement(TextField, args)
    )
  }),
  args: {
    name: 'above-notch',
    label: 'Above Notch Label',
    placeholder: 'Label appears above the field',
    shrunklabelposition: 'aboveNotch',
  },
}

export const ErrorState: Story = {
  name: 'Error State',
  render: adaptStoryRender(args => {
    return Agnostic.createElement(
      'div',
      {
        style: {
          width: '400px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
        },
      },
      Agnostic.createElement(TextField, args)
    )
  }),
  args: {
    name: 'error',
    label: 'Error Field',
    placeholder: 'This field has an error',
    error: true,
    value: 'Invalid input',
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  render: adaptStoryRender(args => {
    return Agnostic.createElement(
      'div',
      {
        style: {
          width: '400px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
        },
      },
      Agnostic.createElement(TextField, args)
    )
  }),
  args: {
    name: 'disabled',
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    disabled: true,
    value: 'Cannot edit this',
  },
}

export const WithPlaceholder: Story = {
  name: 'With Placeholder',
  render: adaptStoryRender(args => {
    return Agnostic.createElement(
      'div',
      {
        style: {
          width: '400px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
        },
      },
      Agnostic.createElement(TextField, args)
    )
  }),
  args: {
    name: 'with-placeholder',
    label: 'TextField with Long Placeholder',
    placeholder: 'This is a longer placeholder text to demonstrate the field',
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: adaptStoryRender(args => {
    return Agnostic.createElement(
      'div',
      {
        style: {
          width: '400px',
          padding: '24px',
          backgroundColor: '#000000',
          borderRadius: '8px',
        },
      },
      Agnostic.createElement(TextField, args)
    )
  }),
  args: {
    name: 'sacred',
    label: 'Sacred TextField',
    placeholder: 'Enter sacred text',
    sacredtheme: true,
  },
}

export const SacredThemeWithValue: Story = {
  name: 'Sacred Theme with Value',
  render: adaptStoryRender(args => {
    return Agnostic.createElement(
      'div',
      {
        style: {
          width: '400px',
          padding: '24px',
          backgroundColor: '#000000',
          borderRadius: '8px',
        },
      },
      Agnostic.createElement(TextField, args)
    )
  }),
  args: {
    name: 'sacred-value',
    label: 'Sacred with Value',
    placeholder: 'Sacred placeholder',
    sacredtheme: true,
    value: 'Sacred knowledge',
  },
}

export const SacredThemeError: Story = {
  name: 'Sacred Theme Error',
  render: adaptStoryRender(args => {
    return Agnostic.createElement(
      'div',
      {
        style: {
          width: '400px',
          padding: '24px',
          backgroundColor: '#000000',
          borderRadius: '8px',
        },
      },
      Agnostic.createElement(TextField, args)
    )
  }),
  args: {
    name: 'sacred-error',
    label: 'Sacred Error',
    placeholder: 'Sacred field with error',
    sacredtheme: true,
    error: true,
    value: 'Forbidden knowledge',
  },
}

export const Comparison: Story = {
  name: 'Theme Comparison',
  render: adaptStoryRender(() => {
    return Agnostic.createElement(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          width: '400px',
          padding: '24px',
        },
      },
      // Regular theme
      Agnostic.createElement(
        'div',
        {
          style: {
            padding: '24px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
          },
        },
        Agnostic.createElement(TextField, {
          name: 'regular-comparison',
          label: 'Regular Theme',
          placeholder: 'Standard notched outline',
          shrunklabelposition: 'onNotch',
          value: 'Sample text',
        })
      ),
      // Sacred theme
      Agnostic.createElement(
        'div',
        {
          style: {
            padding: '24px',
            backgroundColor: '#000000',
            borderRadius: '8px',
          },
        },
        Agnostic.createElement(TextField, {
          name: 'sacred-comparison',
          label: 'Sacred Theme',
          placeholder: 'Sacred notched outline',
          sacredtheme: true,
          shrunklabelposition: 'onNotch',
          value: 'Sacred text',
        })
      )
    )
  }),
}
