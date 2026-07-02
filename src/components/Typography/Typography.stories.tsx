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

/**
 * merrih1 is a Merriweather-branded heading. Regression baseline: the merri*
 * branch in resolveVariant pins '"Merriweather", serif', so the 'h1'
 * substring inside the variant name can no longer hijack the font family to
 * Cinzel (standard h1–h6 variants still render Cinzel).
 */
export const LightH1: Story = {
  name: 'Light/Heading 1',
  args: {
    text: 'Heading 1 - Light Theme',
    styles: {
      theme: 'light',
      variant: 'merrih1',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByText('Heading 1 - Light Theme')
    const fontFamily = window.getComputedStyle(heading).fontFamily
    await expect(fontFamily).toContain('Merriweather')
    await expect(fontFamily).not.toContain('Cinzel')
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

/**
 * merriparagraph is Merriweather body text. Regression baseline: before the
 * merri* branch existed, the isHeading `.includes('h')` check matched the
 * 'h' in 'paragraph' and forced Cinzel onto this variant.
 */
export const LightParagraph: Story = {
  name: 'Light/Paragraph',
  args: {
    text: 'This is a paragraph in the light theme. It uses Merriweather for excellent readability.',
    styles: {
      theme: 'light',
      variant: 'merriparagraph',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const paragraph = canvas.getByText(
      'This is a paragraph in the light theme. It uses Merriweather for excellent readability.'
    )
    const fontFamily = window.getComputedStyle(paragraph).fontFamily
    await expect(fontFamily).toContain('Merriweather')
    await expect(fontFamily).not.toContain('Cinzel')
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

/**
 * `outline: true` renders a VISIBLE 1px currentColor outline (the .outlined
 * CSS-module treatment). Regression baseline: the boolean used to be
 * inverted to CSS `outline: none`, silently removing the outline this story
 * claims to add.
 */
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByText('Outlined Light Heading')
    const style = window.getComputedStyle(heading)
    await expect(style.outlineStyle).toBe('solid')
    await expect(style.outlineWidth).toBe('1px')
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

/**
 * `outline: true` on the dark theme: a visible 1px outline in currentColor,
 * so it tracks the dark theme's light text color.
 */
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
    text: 'This is a paragraph in the sacred theme, using Merriweather body text against the gold palette.',
    styles: {
      theme: 'sacred',
      variant: 'merriparagraph',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * `outline: true` on the sacred theme: a visible 1px outline in currentColor,
 * so it renders gold to match the sacred text color.
 */
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
