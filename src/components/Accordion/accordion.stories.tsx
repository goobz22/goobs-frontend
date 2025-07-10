// src/components/Accordion/accordion.stories.tsx
import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import Accordion from './index'

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
  <span className="font-merriweather">This is the accordion content.</span>
)

/**
 * 1) Single Accordion (collapsed by default)
 */
export const SingleAccordion: Story = {
  name: 'Single Accordion (collapsed by default)',
  render: args => (
    <Accordion {...args} summary="Single Accordion" details={sampleDetails} />
  ),
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
 * 2) Single Accordion (expanded by default)
 */
export const DefaultExpanded: Story = {
  name: 'Single Accordion (expanded by default)',
  render: args => (
    <Accordion
      {...args}
      summary="Default Expanded"
      details={sampleDetails}
      defaultExpanded={true}
    />
  ),
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
          <span className="font-merriweather">Details for first item.</span>
        }
      />
      <Accordion
        {...args}
        summary="Second Item"
        details={
          <span className="font-merriweather">Details for second item.</span>
        }
      />
      <Accordion
        {...args}
        summary="Third Item"
        details={
          <span className="font-merriweather">Details for third item.</span>
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
          <span className="font-merriweather">Top-level content</span>
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
  render: args => (
    <Accordion
      {...args}
      summary="Custom Styles"
      details={
        <span className="font-merriweather">Look at this fancy border!</span>
      }
      style={{
        border: '2px solid #4caf50',
        borderRadius: '8px',
        marginTop: '8px',
      }}
    />
  ),
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
  render: args => (
    <Accordion
      {...args}
      summary="Lots of Text"
      details={
        <div>
          <div className="font-merriweather">Line 1</div>
          <div className="font-merriweather">Line 2</div>
          <div className="font-merriweather">Line 3</div>
          <div className="font-merriweather">Line 4</div>
          <div className="font-merriweather">Line 5</div>
          <div className="font-merriweather">Line 6</div>
          <div className="font-merriweather">Line 7</div>
          <div className="font-merriweather">Line 8</div>
          <div className="font-merriweather">Line 9</div>
        </div>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Expand
    await userEvent.click(canvas.getByText('Lots of Text'))
    expect(canvas.getByText('Line 1')).toBeInTheDocument()
    expect(canvas.getByText('Line 9')).toBeInTheDocument()
  },
}

/**
 * 7) Controlled Accordion
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
          <span className="font-merriweather">
            This is controlled externally.
          </span>
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

/**
 * 8) Sacred Theme Styling
 */
export const SacredTheme: Story = {
  name: 'Sacred Theme Styling',
  render: args => (
    <div className="bg-black/90 p-8 rounded-xl">
      <div className="space-y-4">
        <Accordion
          {...args}
          summary="First Accordion"
          details={
            <span className="font-merriweather">
              This is the first accordion content with sacred theme styling.
            </span>
          }
          sacredtheme={true}
        />

        <Accordion
          {...args}
          summary="Second Accordion"
          details={
            <span className="font-merriweather">
              This is the second accordion content with sacred theme styling.
            </span>
          }
          sacredtheme={true}
        />

        <Accordion
          {...args}
          summary="Third Accordion"
          details={
            <span className="font-merriweather">
              This is the third accordion content with sacred theme styling.
            </span>
          }
          sacredtheme={true}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Initially all content is hidden
    expect(
      canvas.queryByText('This is the first accordion content')
    ).not.toBeInTheDocument()

    // Expand the first accordion
    await userEvent.click(canvas.getByText('First Accordion'))
    expect(
      canvas.getByText(
        'This is the first accordion content with sacred theme styling.'
      )
    ).toBeInTheDocument()

    // Expand the second accordion
    await userEvent.click(canvas.getByText('Second Accordion'))
    expect(
      canvas.getByText(
        'This is the second accordion content with sacred theme styling.'
      )
    ).toBeInTheDocument()
  },
}

/**
 * 9) Premium vs Sacred Theme Comparison
 */
export const PremiumVsSacredComparison: Story = {
  name: 'Premium vs Sacred Theme Comparison',
  render: args => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Premium Theme */}
      <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <h3 className="text-xl font-bold text-gray-900 mb-6 font-inter">
          Premium Theme
        </h3>
        <Accordion
          {...args}
          summary="Enterprise Features"
          details={
            <div className="space-y-3">
              <p className="font-inter text-gray-700">
                Advanced accordion with premium styling, smooth animations, and
                modern design.
              </p>
              <ul className="list-disc list-inside font-inter text-gray-600 space-y-1">
                <li>Glassmorphism effects</li>
                <li>Smooth cubic-bezier transitions</li>
                <li>Blue accent indicators</li>
                <li>Shimmer animations</li>
              </ul>
            </div>
          }
          sacredtheme={false}
        />
        <Accordion
          {...args}
          summary="Modern Interface"
          details={
            <div className="font-inter text-gray-700">
              <p>
                Clean, professional design with subtle depth and premium
                interactions.
              </p>
            </div>
          }
          sacredtheme={false}
        />
      </div>

      {/* Sacred Theme */}
      <div className="bg-black/90 p-6 rounded-xl space-y-4">
        <h3 className="text-xl font-bold text-yellow-400 mb-6 font-cinzel animate-sacred-glow">
          Sacred Theme
        </h3>
        <Accordion
          {...args}
          summary="Ancient Mysteries"
          details={
            <div className="space-y-3">
              <p className="font-merriweather text-yellow-100">
                Mystical accordion with Egyptian theming and golden effects.
              </p>
              <ul className="list-disc list-inside font-merriweather text-yellow-200/80 space-y-1">
                <li>Sacred hieroglyphic symbols</li>
                <li>Golden glow animations</li>
                <li>Temple-inspired backgrounds</li>
                <li>Mystical floating glyphs</li>
              </ul>
            </div>
          }
          sacredtheme={true}
        />
        <Accordion
          {...args}
          summary="Divine Wisdom"
          details={
            <div className="font-merriweather text-yellow-100">
              <p>Ancient knowledge preserved in sacred digital temples.</p>
            </div>
          }
          sacredtheme={true}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test premium theme
    await userEvent.click(canvas.getByText('Enterprise Features'))
    expect(
      canvas.getByText(
        'Advanced accordion with premium styling, smooth animations, and modern design.'
      )
    ).toBeInTheDocument()

    // Test sacred theme
    await userEvent.click(canvas.getByText('Ancient Mysteries'))
    expect(
      canvas.getByText(
        'Mystical accordion with Egyptian theming and golden effects.'
      )
    ).toBeInTheDocument()
  },
}

/**
 * 10) Disabled Accordion
 */
export const DisabledAccordion: Story = {
  name: 'Disabled Accordion',
  render: args => (
    <div className="space-y-4">
      <Accordion
        {...args}
        summary="Disabled Regular"
        details={
          <span className="font-merriweather">
            This content should not be accessible.
          </span>
        }
        disabled={true}
      />
      <div className="bg-black/90 p-6 rounded-xl">
        <Accordion
          {...args}
          summary="Disabled Sacred"
          details={
            <span className="font-merriweather">
              This sacred content should not be accessible.
            </span>
          }
          disabled={true}
          sacredtheme={true}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Content should be hidden
    expect(
      canvas.queryByText('This content should not be accessible.')
    ).not.toBeInTheDocument()
    expect(
      canvas.queryByText('This sacred content should not be accessible.')
    ).not.toBeInTheDocument()

    // Try to click disabled accordions (should not expand)
    await userEvent.click(canvas.getByText('Disabled Regular'))
    expect(
      canvas.queryByText('This content should not be accessible.')
    ).not.toBeInTheDocument()

    await userEvent.click(canvas.getByText('Disabled Sacred'))
    expect(
      canvas.queryByText('This sacred content should not be accessible.')
    ).not.toBeInTheDocument()
  },
}

/**
 * 11) Outline Variants
 */
export const OutlineVariants: Story = {
  name: 'Outline Variants',
  render: args => (
    <div className="space-y-8">
      {/* Premium Theme Outline Variants */}
      <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Premium Theme
        </h3>

        <div className="space-y-2">
          <h4 className="text-md font-medium text-gray-700">
            With Outline (Default)
          </h4>
          <Accordion
            {...args}
            summary="Premium Outlined"
            details={
              <span className="font-inter">
                This premium accordion has elegant borders, shadows, and
                glassmorphism effects.
              </span>
            }
            outline={true}
            sacredtheme={false}
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-md font-medium text-gray-700">Without Outline</h4>
          <Accordion
            {...args}
            summary="Premium Minimal"
            details={
              <span className="font-inter">
                This premium accordion focuses on content with subtle styling
                and no borders.
              </span>
            }
            outline={false}
            sacredtheme={false}
          />
        </div>
      </div>

      {/* Sacred Theme Outline Variants */}
      <div className="bg-black/90 p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Sacred Theme
        </h3>

        <div className="space-y-2">
          <h4 className="text-md font-medium text-yellow-300">
            With Sacred Glow (Default)
          </h4>
          <Accordion
            {...args}
            summary="Sacred Outlined"
            details={
              <span className="font-merriweather">
                This sacred accordion glows with mystical golden borders and
                shadows.
              </span>
            }
            sacredtheme={true}
            outline={true}
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-md font-medium text-yellow-300">
            Without Outline
          </h4>
          <Accordion
            {...args}
            summary="Sacred Minimal"
            details={
              <span className="font-merriweather">
                This sacred accordion focuses on content without distracting
                borders.
              </span>
            }
            sacredtheme={true}
            outline={false}
          />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test outlined premium accordion
    await userEvent.click(canvas.getByText('Premium Outlined'))
    expect(
      canvas.getByText(
        'This premium accordion has elegant borders, shadows, and glassmorphism effects.'
      )
    ).toBeInTheDocument()

    // Test borderless premium accordion
    await userEvent.click(canvas.getByText('Premium Minimal'))
    expect(
      canvas.getByText(
        'This premium accordion focuses on content with subtle styling and no borders.'
      )
    ).toBeInTheDocument()

    // Test outlined sacred accordion
    await userEvent.click(canvas.getByText('Sacred Outlined'))
    expect(
      canvas.getByText(
        'This sacred accordion glows with mystical golden borders and shadows.'
      )
    ).toBeInTheDocument()

    // Test borderless sacred accordion
    await userEvent.click(canvas.getByText('Sacred Minimal'))
    expect(
      canvas.getByText(
        'This sacred accordion focuses on content without distracting borders.'
      )
    ).toBeInTheDocument()
  },
}
