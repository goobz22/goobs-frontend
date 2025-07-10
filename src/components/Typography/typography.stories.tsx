// src/components/Typography/typography.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { within, expect } from '@storybook/test'
import Typography, { CustomTypographyVariant } from './index'

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    fontvariant: {
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
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    sacredtheme: { control: 'boolean' },
    outline: { control: 'boolean' },
    gutterBottom: { control: 'boolean' },
    fontcolor: { control: 'color' },
    text: { control: 'text' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * 1) Premium Theme Typography Scale
 */
export const PremiumTypographyScale: Story = {
  name: 'Premium Theme - Typography Scale',
  render: () => (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6 font-inter">
        Premium Typography Scale
      </h3>

      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Headers
          </h4>
          <div className="space-y-4">
            <Typography
              fontvariant="merrih1"
              text="Heading 1 - Main Title"
              sacredtheme={false}
              outline={false}
            />
            <Typography
              fontvariant="merrih2"
              text="Heading 2 - Section Title"
              sacredtheme={false}
              outline={false}
            />
            <Typography
              fontvariant="merrih3"
              text="Heading 3 - Subsection"
              sacredtheme={false}
              outline={false}
            />
            <Typography
              fontvariant="merrih4"
              text="Heading 4 - Component Title"
              sacredtheme={false}
              outline={false}
            />
            <Typography
              fontvariant="merrih5"
              text="Heading 5 - Small Section"
              sacredtheme={false}
              outline={false}
            />
            <Typography
              fontvariant="merrih6"
              text="Heading 6 - Minor Title"
              sacredtheme={false}
              outline={false}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Body Text
          </h4>
          <div className="space-y-4">
            <Typography
              fontvariant="merriparagraph"
              text="This is paragraph text using Merriweather font family. It provides excellent readability for body content with proper line spacing and font weight."
              sacredtheme={false}
              outline={false}
            />
            <Typography
              fontvariant="merrihelperfooter"
              text="This is helper/footer text, typically used for captions, metadata, or secondary information."
              sacredtheme={false}
              outline={false}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            With Outline
          </h4>
          <div className="space-y-2">
            <Typography
              fontvariant="merrih2"
              text="Outlined Text for Better Contrast"
              sacredtheme={false}
              outline={true}
            />
            <Typography
              fontvariant="merriparagraph"
              text="Outlined paragraph text enhances readability on complex backgrounds."
              sacredtheme={false}
              outline={true}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test that typography elements are rendered
    const headings = canvas.getAllByText(/Heading|Main Title/i)
    expect(headings.length).toBeGreaterThan(0)
  },
}

/**
 * 2) Sacred Theme Typography Scale
 */
export const SacredTypographyScale: Story = {
  name: 'Sacred Theme - Typography Scale',
  render: () => (
    <div className="bg-black/90 p-8 rounded-xl">
      <h3 className="text-xl font-bold text-yellow-400 mb-6 font-cinzel animate-sacred-glow">
        Sacred Typography Scale
      </h3>

      <div className="space-y-8">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-yellow-300 uppercase tracking-wide font-cinzel">
            Divine Headers
          </h4>
          <div className="space-y-6">
            <Typography
              fontvariant="merrih1"
              text="Ancient Wisdom Header I"
              sacredtheme={true}
              outline={false}
            />
            <Typography
              fontvariant="merrih2"
              text="Sacred Knowledge Header II"
              sacredtheme={true}
              outline={false}
            />
            <Typography
              fontvariant="merrih3"
              text="Mystical Teachings Header III"
              sacredtheme={true}
              outline={false}
            />
            <Typography
              fontvariant="merrih4"
              text="Divine Guidance Header IV"
              sacredtheme={true}
              outline={false}
            />
            <Typography
              fontvariant="merrih5"
              text="Spiritual Insight Header V"
              sacredtheme={true}
              outline={false}
            />
            <Typography
              fontvariant="merrih6"
              text="Sacred Whispers Header VI"
              sacredtheme={true}
              outline={false}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-yellow-300 uppercase tracking-wide font-cinzel">
            Sacred Text
          </h4>
          <div className="space-y-6">
            <Typography
              fontvariant="merriparagraph"
              text="In the ancient scrolls of divine wisdom, we find the eternal truths that guide our mystical journey through the realms of sacred knowledge and spiritual enlightenment."
              sacredtheme={true}
              outline={false}
            />
            <Typography
              fontvariant="merrihelperfooter"
              text="Inscribed by the High Priests of the Golden Temple, blessed by the eternal light of the divine spirits."
              sacredtheme={true}
              outline={false}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-yellow-300 uppercase tracking-wide font-cinzel">
            Enhanced Outline
          </h4>
          <div className="space-y-4">
            <Typography
              fontvariant="merrih2"
              text="Divine Text with Sacred Outline"
              sacredtheme={true}
              outline={true}
            />
            <Typography
              fontvariant="merriparagraph"
              text="Enhanced mystical text with divine outline effects for maximum spiritual impact and readability."
              sacredtheme={true}
              outline={true}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test sacred typography elements
    const sacredHeadings = canvas.getAllByText(/Ancient|Sacred|Mystical/i)
    expect(sacredHeadings.length).toBeGreaterThan(0)
  },
}

/**
 * 3) Premium vs Sacred Comparison
 */
export const PremiumVsSacredComparison: Story = {
  name: 'Premium vs Sacred Theme Comparison',
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Premium Theme */}
      <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-inter">
          Premium Theme
        </h3>
        <div className="space-y-4">
          <Typography
            fontvariant="merrih1"
            text="Professional Heading"
            sacredtheme={false}
            outline={false}
          />
          <Typography
            fontvariant="merrih3"
            text="Business Subheading"
            sacredtheme={false}
            outline={false}
          />
          <Typography
            fontvariant="merriparagraph"
            text="Clean, professional typography using Merriweather serif font family. Perfect for corporate websites, business applications, and professional documentation with excellent readability."
            sacredtheme={false}
            outline={false}
          />
          <Typography
            fontvariant="merrihelperfooter"
            text="Modern typography with subtle styling and professional appearance."
            sacredtheme={false}
            outline={false}
          />
        </div>
      </div>

      {/* Sacred Theme */}
      <div className="bg-black/90 p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-bold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Sacred Theme
        </h3>
        <div className="space-y-4">
          <Typography
            fontvariant="merrih1"
            text="Mystical Heading"
            sacredtheme={true}
            outline={false}
          />
          <Typography
            fontvariant="merrih3"
            text="Divine Subheading"
            sacredtheme={true}
            outline={false}
          />
          <Typography
            fontvariant="merriparagraph"
            text="Sacred typography using Cinzel font family with golden glow effects and mystical letter spacing. Designed for spiritual applications, ancient wisdom sites, and mystical user interfaces."
            sacredtheme={true}
            outline={false}
          />
          <Typography
            fontvariant="merrihelperfooter"
            text="Ancient wisdom inscribed with divine light and sacred energy."
            sacredtheme={true}
            outline={false}
          />
        </div>
      </div>
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test both themes
    const allHeadings = canvas.getAllByText(
      /Professional|Mystical|Business|Divine/i
    )
    expect(allHeadings.length).toBe(4)
  },
}

/**
 * 4) Text Alignment Variants
 */
export const TextAlignmentVariants: Story = {
  name: 'Text Alignment Variants',
  render: () => (
    <div className="space-y-8">
      {/* Premium Theme Alignments */}
      <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Premium Theme Alignments
        </h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-md font-medium text-gray-700">
              Left Aligned (Default)
            </h4>
            <Typography
              fontvariant="merrih3"
              text="Left Aligned Heading"
              align="left"
              sacredtheme={false}
              outline={false}
            />
            <Typography
              fontvariant="merriparagraph"
              text="This paragraph text is left-aligned, which is the default alignment for most western reading patterns and provides a clean, organized appearance."
              align="left"
              sacredtheme={false}
              outline={false}
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-md font-medium text-gray-700">
              Center Aligned
            </h4>
            <Typography
              fontvariant="merrih3"
              text="Center Aligned Heading"
              align="center"
              sacredtheme={false}
              outline={false}
            />
            <Typography
              fontvariant="merriparagraph"
              text="Center-aligned text creates symmetry and draws attention. Perfect for titles, announcements, and focal content that needs emphasis."
              align="center"
              sacredtheme={false}
              outline={false}
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-md font-medium text-gray-700">Right Aligned</h4>
            <Typography
              fontvariant="merrih3"
              text="Right Aligned Heading"
              align="right"
              sacredtheme={false}
              outline={false}
            />
            <Typography
              fontvariant="merriparagraph"
              text="Right-aligned text is useful for signatures, dates, or creating visual balance in layouts with mixed alignment patterns."
              align="right"
              sacredtheme={false}
              outline={false}
            />
          </div>
        </div>
      </div>

      {/* Sacred Theme Alignments */}
      <div className="bg-black/90 p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Sacred Theme Alignments
        </h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-md font-medium text-yellow-300">
              Ancient Script (Left)
            </h4>
            <Typography
              fontvariant="merrih3"
              text="Sacred Inscription"
              align="left"
              sacredtheme={true}
              outline={false}
            />
            <Typography
              fontvariant="merriparagraph"
              text="Ancient wisdom flows naturally from left to right, following the traditional patterns of sacred scribes and divine manuscripts."
              align="left"
              sacredtheme={true}
              outline={false}
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-md font-medium text-yellow-300">
              Divine Proclamation (Center)
            </h4>
            <Typography
              fontvariant="merrih3"
              text="Divine Proclamation"
              align="center"
              sacredtheme={true}
              outline={false}
            />
            <Typography
              fontvariant="merriparagraph"
              text="Sacred truths spoken from the center of divine consciousness, radiating spiritual energy in all directions to illuminate the faithful."
              align="center"
              sacredtheme={true}
              outline={false}
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-md font-medium text-yellow-300">
              Mystic Seal (Right)
            </h4>
            <Typography
              fontvariant="merrih3"
              text="Mystic Blessing"
              align="right"
              sacredtheme={true}
              outline={false}
            />
            <Typography
              fontvariant="merriparagraph"
              text="The final words of sacred rituals, aligned to the cosmic right, sealing divine intentions with golden light and eternal power."
              align="right"
              sacredtheme={true}
              outline={false}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test alignment variants
    const alignedHeadings = canvas.getAllByText(
      /Left Aligned|Center Aligned|Right Aligned|Sacred Inscription|Divine Proclamation|Mystic Blessing/i
    )
    expect(alignedHeadings.length).toBe(6)
  },
}

/**
 * 5) Interactive Demo
 */
const InteractiveDemoRenderer = () => {
  const [config, setConfig] = React.useState({
    fontvariant: 'merrih2' as CustomTypographyVariant,
    align: 'left' as 'left' | 'center' | 'right',
    sacredtheme: false,
    outline: false,
    gutterBottom: false,
    fontcolor: '',
    text: 'Interactive Typography Demo',
  })

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Typography Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Variant
            </label>
            <select
              value={config.fontvariant}
              onChange={e =>
                setConfig({
                  ...config,
                  fontvariant: e.target.value as CustomTypographyVariant,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="merrih1">Heading 1</option>
              <option value="merrih2">Heading 2</option>
              <option value="merrih3">Heading 3</option>
              <option value="merrih4">Heading 4</option>
              <option value="merrih5">Heading 5</option>
              <option value="merrih6">Heading 6</option>
              <option value="merriparagraph">Paragraph</option>
              <option value="merrihelperfooter">Helper/Footer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alignment
            </label>
            <select
              value={config.align}
              onChange={e =>
                setConfig({
                  ...config,
                  align: e.target.value as 'left' | 'center' | 'right',
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Content
            </label>
            <input
              type="text"
              value={config.text}
              onChange={e => setConfig({ ...config, text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter text..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.sacredtheme}
              onChange={e =>
                setConfig({ ...config, sacredtheme: e.target.checked })
              }
              className="mr-2"
            />
            Sacred Theme
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.outline}
              onChange={e =>
                setConfig({ ...config, outline: e.target.checked })
              }
              className="mr-2"
            />
            Outline
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.gutterBottom}
              onChange={e =>
                setConfig({ ...config, gutterBottom: e.target.checked })
              }
              className="mr-2"
            />
            Gutter Bottom
          </label>
          {!config.sacredtheme && (
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 mr-2">
                Color:
              </label>
              <input
                type="color"
                value={config.fontcolor}
                onChange={e =>
                  setConfig({ ...config, fontcolor: e.target.value })
                }
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Typography Display */}
      <div
        className={
          config.sacredtheme
            ? 'bg-black/90 p-8 rounded-xl'
            : 'p-8 bg-gray-50 rounded-xl'
        }
      >
        <h3
          className={`text-md font-semibold mb-6 ${config.sacredtheme ? 'text-yellow-400 font-cinzel' : 'text-gray-900'}`}
        >
          Live Preview
        </h3>

        <Typography
          fontvariant={config.fontvariant}
          align={config.align}
          sacredtheme={config.sacredtheme}
          outline={config.outline}
          gutterBottom={config.gutterBottom}
          fontcolor={config.fontcolor || undefined}
          text={config.text}
        />

        <div
          className={`mt-6 text-sm ${config.sacredtheme ? 'text-yellow-200' : 'text-gray-600'}`}
        >
          <div>
            Font:{' '}
            {config.sacredtheme ? 'Cinzel (Sacred)' : 'Merriweather (Premium)'}
          </div>
          <div>Variant: {config.fontvariant}</div>
          <div>Alignment: {config.align}</div>
          <div>Outline: {config.outline ? 'Enabled' : 'Disabled'}</div>
        </div>
      </div>
    </div>
  )
}
export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

/**
 * 6) Content Layout Example
 */
export const ContentLayoutExample: Story = {
  name: 'Content Layout Example',
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Premium Article Layout */}
      <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <Typography
          fontvariant="merrih1"
          text="The Future of Design"
          sacredtheme={false}
          gutterBottom={true}
        />

        <Typography
          fontvariant="merrih3"
          text="Innovation and User Experience"
          sacredtheme={false}
          gutterBottom={true}
        />

        <Typography
          fontvariant="merriparagraph"
          text="In the rapidly evolving landscape of digital design, we must embrace new methodologies while maintaining the fundamental principles that create meaningful user experiences. The intersection of technology and creativity continues to push boundaries."
          sacredtheme={false}
          gutterBottom={true}
        />

        <Typography
          fontvariant="merrih4"
          text="Key Principles"
          sacredtheme={false}
          gutterBottom={true}
        />

        <Typography
          fontvariant="merriparagraph"
          text="User-centered design remains at the core of successful products. By understanding user needs, behaviors, and motivations, we can create interfaces that not only function well but also delight and inspire."
          sacredtheme={false}
          gutterBottom={true}
        />

        <Typography
          fontvariant="merrihelperfooter"
          text="Published in Design Weekly, March 2024"
          sacredtheme={false}
          align="right"
        />
      </div>

      {/* Sacred Manuscript Layout */}
      <div className="bg-black/90 p-6 rounded-xl space-y-4">
        <Typography
          fontvariant="merrih1"
          text="Ancient Prophecies"
          sacredtheme={true}
          gutterBottom={true}
          align="center"
        />

        <Typography
          fontvariant="merrih3"
          text="The Awakening of Divine Consciousness"
          sacredtheme={true}
          gutterBottom={true}
          align="center"
        />

        <Typography
          fontvariant="merriparagraph"
          text="In the scrolls of ancient wisdom, the seers foretold of a great awakening when the divine consciousness would merge with mortal understanding, bringing forth an age of unprecedented enlightenment and spiritual transformation."
          sacredtheme={true}
          gutterBottom={true}
        />

        <Typography
          fontvariant="merrih4"
          text="Sacred Revelations"
          sacredtheme={true}
          gutterBottom={true}
        />

        <Typography
          fontvariant="merriparagraph"
          text="The golden light of divine truth illuminates the path for those who seek wisdom beyond the veil of ordinary perception. Through sacred rituals and mystical practices, the faithful shall ascend to higher realms of consciousness."
          sacredtheme={true}
          gutterBottom={true}
        />

        <Typography
          fontvariant="merrihelperfooter"
          text="Inscribed by the High Priests of the Golden Temple"
          sacredtheme={true}
          align="right"
        />
      </div>
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test content layout
    const contentHeadings = canvas.getAllByText(
      /Future of Design|Ancient Prophecies/i
    )
    expect(contentHeadings.length).toBe(2)
  },
}
