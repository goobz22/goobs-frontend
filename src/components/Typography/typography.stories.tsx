/**
 * @fileoverview Storybook stories for the Typography component.
 * These stories showcase the various text styles, themes, and semantic
 * variations of the Typography component using the new theme system.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect } from 'storybook/test'
import Typography from './index'

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    text: { control: 'text' },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}

export default meta
type Story = StoryObj<typeof Typography>

// --------------------------------------------------------------------------
// LIGHT THEME STORIES
// --------------------------------------------------------------------------

export const LightH1: Story = {
  name: 'Light/Heading 1',
  args: {
    text: 'Heading 1 - Light Theme',
    styles: {
      theme: 'light',
      variant: 'merrih1',
    },
  },
}

export const LightH2: Story = {
  name: 'Light/Heading 2',
  args: {
    text: 'Heading 2 - Light Theme',
    styles: {
      theme: 'light',
      variant: 'merrih2',
    },
  },
}

export const LightParagraph: Story = {
  name: 'Light/Paragraph',
  args: {
    text: 'This is a paragraph in the light theme. It uses Merriweather for excellent readability.',
    styles: {
      theme: 'light',
      variant: 'merriparagraph',
    },
  },
}

export const LightHelperText: Story = {
  name: 'Light/Helper Text',
  args: {
    text: 'This is helper text for captions or footers.',
    styles: {
      theme: 'light',
      variant: 'merrihelperfooter',
    },
  },
}

export const LightWithOutline: Story = {
  name: 'Light/With Outline',
  args: {
    text: 'Outlined Light Heading',
    styles: {
      theme: 'light',
      variant: 'merrih2',
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
    text: 'Heading 1 - Dark Theme',
    styles: {
      theme: 'dark',
      variant: 'merrih1',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const DarkParagraph: Story = {
  name: 'Dark/Paragraph',
  args: {
    text: 'This is a paragraph in the dark theme with improved contrast.',
    styles: {
      theme: 'dark',
      variant: 'merriparagraph',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const DarkWithOutline: Story = {
  name: 'Dark/With Outline',
  args: {
    text: 'Outlined Dark Heading',
    styles: {
      theme: 'dark',
      variant: 'merrih2',
      outline: true,
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// SACRED THEME STORIES
// --------------------------------------------------------------------------

export const SacredH1: Story = {
  name: 'Sacred/Heading 1',
  args: {
    text: 'Heading 1 - Sacred Theme',
    styles: {
      theme: 'sacred',
      variant: 'merrih1',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredParagraph: Story = {
  name: 'Sacred/Paragraph',
  args: {
    text: 'This is a paragraph in the sacred theme, using Cinzel for a mystical feel.',
    styles: {
      theme: 'sacred',
      variant: 'merriparagraph',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredWithOutline: Story = {
  name: 'Sacred/With Outline',
  args: {
    text: 'Outlined Sacred Heading',
    styles: {
      theme: 'sacred',
      variant: 'merrih2',
      outline: true,
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// FUNCTIONAL STORIES
// --------------------------------------------------------------------------

export const Centered: Story = {
  name: 'Alignment/Center',
  args: {
    text: 'This text is center-aligned.',
    styles: {
      theme: 'light',
      variant: 'merriparagraph',
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
        text="This paragraph has a bottom margin."
        styles={{
          theme: 'sacred',
          variant: 'cinzelparagraph',
          gutterBottom: true,
        }}
      />
      <Typography
        text="This is the next paragraph to show the spacing."
        styles={{ theme: 'sacred', variant: 'cinzelparagraph' }}
      />
    </div>
  ),
}

export const AsChild: Story = {
  name: 'Composition/As Child',
  args: {
    children: (
      <span>
        This is a <strong style={{ color: 'blue' }}>React node child</strong>{' '}
        inside Typography.
      </span>
    ),
    styles: {
      theme: 'light',
      variant: 'merrih1',
    },
  },
}

export const CustomColor: Story = {
  name: 'Customization/Custom Color',
  args: {
    text: 'Custom colored heading',
    styles: {
      theme: 'light',
      variant: 'merrih2',
      color: '#e11d48',
    },
  },
}

export const CustomFontSize: Story = {
  name: 'Customization/Custom Font Size',
  args: {
    text: 'This paragraph has a custom font size.',
    styles: {
      theme: 'light',
      variant: 'merriparagraph',
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
      <Typography styles={{ theme: 'sacred', variant: 'cinzelh1' }}>
        Test Heading 1
      </Typography>
      <Typography styles={{ theme: 'sacred', variant: 'cinzelparagraph' }}>
        This is a test paragraph.
      </Typography>
      <Typography
        styles={{
          theme: 'sacred',
          variant: 'cinzelhelperfooter',
          textAlign: 'right',
        }}
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
