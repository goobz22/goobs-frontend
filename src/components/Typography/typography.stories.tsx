/**
 * @fileoverview Storybook stories for the Typography component.
 * These stories showcase the various text styles, themes, and semantic
 * variations of the Typography component using the new theme system.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from '@storybook/test'
import Typography from './index'

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'merrih1',
        'merrih2',
        'merrih3',
        'merrih4',
        'merrih5',
        'merrih6',
        'merriparagraph',
        'merrihelperfooter',
      ],
    },
    text: { control: 'text' },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Typography>

// --------------------------------------------------------------------------
// LIGHT THEME STORIES
// --------------------------------------------------------------------------

export const LightH1: Story = {
  name: 'Light/Heading 1',
  args: {
    variant: 'merrih1',
    text: 'Heading 1 - Light Theme',
    styles: {
      theme: 'light',
    },
  },
}

export const LightH2: Story = {
  name: 'Light/Heading 2',
  args: {
    variant: 'merrih2',
    text: 'Heading 2 - Light Theme',
    styles: {
      theme: 'light',
    },
  },
}

export const LightParagraph: Story = {
  name: 'Light/Paragraph',
  args: {
    variant: 'merriparagraph',
    text: 'This is a paragraph in the light theme. It uses Merriweather for excellent readability.',
    styles: {
      theme: 'light',
    },
  },
}

export const LightHelperText: Story = {
  name: 'Light/Helper Text',
  args: {
    variant: 'merrihelperfooter',
    text: 'This is helper text for captions or footers.',
    styles: {
      theme: 'light',
    },
  },
}

export const LightWithOutline: Story = {
  name: 'Light/With Outline',
  args: {
    variant: 'merrih2',
    text: 'Outlined Light Heading',
    styles: {
      theme: 'light',
      outline: true,
    },
  },
}

// --------------------------------------------------------------------------
// DARK THEME STORIES
// --------------------------------------------------------------------------

export const DarkH1: Story = {
  name: 'Dark/Heading 1',
  args: {
    variant: 'merrih1',
    text: 'Heading 1 - Dark Theme',
    styles: {
      theme: 'dark',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const DarkParagraph: Story = {
  name: 'Dark/Paragraph',
  args: {
    variant: 'merriparagraph',
    text: 'This is a paragraph in the dark theme with improved contrast.',
    styles: {
      theme: 'dark',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const DarkWithOutline: Story = {
  name: 'Dark/With Outline',
  args: {
    variant: 'merrih2',
    text: 'Outlined Dark Heading',
    styles: {
      theme: 'dark',
      outline: true,
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// SACRED THEME STORIES
// --------------------------------------------------------------------------

export const SacredH1: Story = {
  name: 'Sacred/Heading 1',
  args: {
    variant: 'merrih1',
    text: 'Heading 1 - Sacred Theme',
    styles: {
      theme: 'sacred',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const SacredParagraph: Story = {
  name: 'Sacred/Paragraph',
  args: {
    variant: 'merriparagraph',
    text: 'This is a paragraph in the sacred theme, using Cinzel for a mystical feel.',
    styles: {
      theme: 'sacred',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const SacredWithOutline: Story = {
  name: 'Sacred/With Outline',
  args: {
    variant: 'merrih2',
    text: 'Outlined Sacred Heading',
    styles: {
      theme: 'sacred',
      outline: true,
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// FUNCTIONAL STORIES
// --------------------------------------------------------------------------

export const Centered: Story = {
  name: 'Alignment/Center',
  args: {
    variant: 'merriparagraph',
    text: 'This text is center-aligned.',
    styles: {
      theme: 'light',
      textAlign: 'center',
      width: '300px',
    },
  },
}

export const GutterBottom: Story = {
  name: 'Spacing/Gutter Bottom',
  render: () => (
    <div>
      <Typography
        variant="merriparagraph"
        text="This paragraph has a bottom margin."
        styles={{ theme: 'light', gutterBottom: true }}
      />
      <Typography
        variant="merriparagraph"
        text="This is the next paragraph to show the spacing."
        styles={{ theme: 'light' }}
      />
    </div>
  ),
}

export const AsChild: Story = {
  name: 'Composition/As Child',
  args: {
    variant: 'merrih1',
    children: (
      <span>
        This is a <strong style={{ color: 'blue' }}>React node child</strong>{' '}
        inside Typography.
      </span>
    ),
    styles: {
      theme: 'light',
    },
  },
}

export const CustomColor: Story = {
  name: 'Customization/Custom Color',
  args: {
    variant: 'merrih2',
    text: 'Custom colored heading',
    styles: {
      theme: 'light',
      color: '#e11d48',
    },
  },
}

export const CustomFontSize: Story = {
  name: 'Customization/Custom Font Size',
  args: {
    variant: 'merriparagraph',
    text: 'This paragraph has a custom font size.',
    styles: {
      theme: 'light',
      fontSize: '1.25rem',
    },
  },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------
export const InteractionTest: Story = {
  name: 'Interaction and A11y Test',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        background: '#f0f0f0',
      }}
    >
      <Typography variant="merrih1" styles={{ theme: 'light' }}>
        Test Heading 1
      </Typography>
      <Typography variant="merriparagraph" styles={{ theme: 'light' }}>
        This is a test paragraph.
      </Typography>
      <Typography
        variant="merrihelperfooter"
        styles={{ theme: 'light', textAlign: 'right' }}
      >
        Footer text
      </Typography>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByText('Test Heading 1')
    const paragraph = canvas.getByText('This is a test paragraph.')
    const footer = canvas.getByText('Footer text')

    await expect(heading).toBeVisible()
    await expect(paragraph).toBeVisible()
    await expect(footer).toBeVisible()

    // Check alignment
    expect(footer).toHaveStyle({ 'text-align': 'right' })
  },
}
