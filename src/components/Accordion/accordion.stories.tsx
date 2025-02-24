// src/components/Accordion/accordion.stories.tsx
import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import Accordion from './index'
import Typography from '../Typography'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof Accordion>

/** Reusable details content */
const sampleDetails = (
  <Typography
    fontvariant="merriparagraph"
    text="This is the accordion content."
  />
)

/**
 * 1) Single Accordion (collapsed by default)
 */
export const SingleAccordion: Story = {
  name: 'Single Accordion (collapsed by default)',
  args: {
    summary: 'Single Accordion',
    details: sampleDetails,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Initially, content is hidden
    expect(
      canvas.queryByText('This is the accordion content.')
    ).not.toBeInTheDocument()

    // Expand by clicking the summary
    await userEvent.click(canvas.getByText('Single Accordion'))
    // Now content is visible
    expect(
      canvas.getByText('This is the accordion content.')
    ).toBeInTheDocument()
  },
}

/**
 * 2) Single Accordion (defaultExpanded)
 */
export const DefaultExpanded: Story = {
  name: 'Single Accordion (defaultExpanded)',
  // We can pass `defaultExpanded` now that the interface includes it:
  args: {
    summary: 'Default Expanded',
    details: sampleDetails,
    defaultExpanded: true,
  },
  // Remove "async" here because we don't use "await" anywhere:
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Content should already be visible
    expect(
      canvas.getByText('This is the accordion content.')
    ).toBeInTheDocument()
  },
}

/**
 * 3) Multiple Accordions
 */
export const MultipleAccordions: Story = {
  name: 'Multiple Accordions',
  render: args => (
    <>
      <Accordion
        {...args}
        summary="First Item"
        details={
          <Typography
            fontvariant="merriparagraph"
            text="Details for first item."
          />
        }
      />
      <Accordion
        {...args}
        summary="Second Item"
        details={
          <Typography
            fontvariant="merriparagraph"
            text="Details for second item."
          />
        }
      />
      <Accordion
        {...args}
        summary="Third Item"
        details={
          <Typography
            fontvariant="merriparagraph"
            text="Details for third item."
          />
        }
      />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Initially hidden
    expect(
      canvas.queryByText('Details for first item.')
    ).not.toBeInTheDocument()
    expect(
      canvas.queryByText('Details for second item.')
    ).not.toBeInTheDocument()
    expect(
      canvas.queryByText('Details for third item.')
    ).not.toBeInTheDocument()

    // Expand second item
    await userEvent.click(canvas.getByText('Second Item'))
    expect(canvas.getByText('Details for second item.')).toBeInTheDocument()

    // Expand first item
    await userEvent.click(canvas.getByText('First Item'))
    expect(canvas.getByText('Details for first item.')).toBeInTheDocument()

    // Both remain expanded
    expect(canvas.getByText('Details for second item.')).toBeInTheDocument()
  },
}

/**
 * 4) Nested Accordion
 */
export const NestedAccordion: Story = {
  name: 'Nested Accordion',
  render: args => (
    <Accordion
      {...args}
      summary="Parent Accordion"
      details={
        <div>
          <Typography fontvariant="merriparagraph" text="Top-level content" />
          <Accordion
            {...args}
            summary="Nested Accordion"
            details={sampleDetails}
            style={{ marginLeft: '1rem' }}
          />
        </div>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Nested content hidden initially
    expect(
      canvas.queryByText('This is the accordion content.')
    ).not.toBeInTheDocument()

    // Expand parent
    await userEvent.click(canvas.getByText('Parent Accordion'))
    expect(canvas.getByText('Top-level content')).toBeInTheDocument()

    // Expand nested
    await userEvent.click(canvas.getByText('Nested Accordion'))
    expect(
      canvas.getByText('This is the accordion content.')
    ).toBeInTheDocument()
  },
}

/**
 * 5) Custom Styles
 */
export const CustomStyles: Story = {
  name: 'Custom Styled Accordion',
  args: {
    summary: 'Custom Styles',
    details: (
      <Typography
        fontvariant="merriparagraph"
        text="Look at this fancy border!"
      />
    ),
    style: {
      border: '2px solid #4caf50',
      borderRadius: '8px',
      marginTop: '10px',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Expand
    await userEvent.click(canvas.getByText('Custom Styles'))
    expect(canvas.getByText('Look at this fancy border!')).toBeInTheDocument()
  },
}

/**
 * 6) Large Content
 */
export const LargeContent: Story = {
  name: 'Accordion With Large Content',
  args: {
    summary: 'Lots of Text',
    details: (
      <div>
        <Typography fontvariant="merriparagraph" text="Line 1" />
        <Typography fontvariant="merriparagraph" text="Line 2" />
        <Typography fontvariant="merriparagraph" text="Line 3" />
        <Typography fontvariant="merriparagraph" text="Line 4" />
        <Typography fontvariant="merriparagraph" text="Line 5" />
        <Typography fontvariant="merriparagraph" text="Line 6" />
        <Typography fontvariant="merriparagraph" text="Line 7" />
        <Typography fontvariant="merriparagraph" text="Line 8" />
        <Typography fontvariant="merriparagraph" text="Line 9" />
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Expand
    await userEvent.click(canvas.getByText('Lots of Text'))
    expect(canvas.getByText('Line 1')).toBeInTheDocument()
    expect(canvas.getByText('Line 9')).toBeInTheDocument()
  },
}

/**
 * 7) Disabled Accordion
 */
export const DisabledAccordion: Story = {
  name: 'Disabled Accordion',
  args: {
    summary: 'Cannot Expand',
    details: sampleDetails,
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Try to expand
    await userEvent.click(canvas.getByText('Cannot Expand'))
    // Still hidden
    expect(
      canvas.queryByText('This is the accordion content.')
    ).not.toBeInTheDocument()
  },
}

/**
 * 8) Controlled Accordion
 */
const ControlledAccordionExample = () => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Toggle Accordion
      </button>
      <Accordion
        summary="Controlled Accordion"
        details={
          <Typography
            fontvariant="merriparagraph"
            text="This is controlled externally."
          />
        }
        expanded={isExpanded}
        onChange={(_, expanded) => setIsExpanded(expanded)}
      />
    </>
  )
}

export const ControlledAccordion: Story = {
  name: 'Controlled Accordion (toggle via props)',
  render: () => <ControlledAccordionExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Initially hidden
    expect(
      canvas.queryByText('This is controlled externally.')
    ).not.toBeInTheDocument()

    // Click the external toggle button
    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle Accordion' })
    )
    // Now content appears
    expect(
      canvas.getByText('This is controlled externally.')
    ).toBeInTheDocument()

    // Click again to hide
    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle Accordion' })
    )
    expect(
      canvas.queryByText('This is controlled externally.')
    ).not.toBeInTheDocument()
  },
}
