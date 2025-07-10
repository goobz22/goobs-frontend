// src/components/Chip/chip.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import Chip from './index'

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    sacredtheme: { control: 'boolean' },
    outline: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onDelete: { action: 'deleted' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * 1) Premium Theme Variants
 */
export const PremiumThemeVariants: Story = {
  name: 'Premium Theme - All Variants',
  render: args => (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6 font-inter">
        Premium Chip Styles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Standard Chips
          </h4>
          <div className="flex flex-wrap gap-3">
            <Chip {...args} label="React" sacredtheme={false} outline={true} />
            <Chip
              {...args}
              label="TypeScript"
              sacredtheme={false}
              outline={true}
            />
            <Chip
              {...args}
              label="JavaScript"
              sacredtheme={false}
              outline={true}
            />
            <Chip {...args} label="CSS" sacredtheme={false} outline={true} />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Removable Chips
          </h4>
          <div className="flex flex-wrap gap-3">
            <Chip
              {...args}
              label="Frontend"
              onDelete={() => console.log('Deleted Frontend')}
              sacredtheme={false}
              outline={true}
            />
            <Chip
              {...args}
              label="Backend"
              onDelete={() => console.log('Deleted Backend')}
              sacredtheme={false}
              outline={true}
            />
            <Chip
              {...args}
              label="Database"
              onDelete={() => console.log('Deleted Database')}
              sacredtheme={false}
              outline={true}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-700 mb-4">
          Without Outline
        </h4>
        <div className="flex flex-wrap gap-3">
          <Chip {...args} label="Clean" sacredtheme={false} outline={false} />
          <Chip
            {...args}
            label="Minimal"
            onDelete={() => console.log('Deleted Minimal')}
            sacredtheme={false}
            outline={false}
          />
          <Chip {...args} label="Subtle" sacredtheme={false} outline={false} />
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-700 mb-4">
          Disabled State
        </h4>
        <div className="flex flex-wrap gap-3">
          <Chip
            {...args}
            label="Disabled"
            disabled={true}
            sacredtheme={false}
            outline={true}
          />
          <Chip
            {...args}
            label="Disabled with Delete"
            onDelete={() => console.log('Should not delete')}
            disabled={true}
            sacredtheme={false}
            outline={true}
          />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test that chips are rendered
    const chips = canvas.getAllByText(/React|TypeScript|Frontend/i)
    expect(chips.length).toBeGreaterThan(0)

    // Test delete functionality
    const deleteButtons = canvas.getAllByRole('button', {
      name: /remove chip/i,
    })
    if (deleteButtons.length > 0) {
      await userEvent.click(deleteButtons[0])
    }
  },
}

/**
 * 2) Sacred Theme Variants
 */
export const SacredThemeVariants: Story = {
  name: 'Sacred Theme - All Variants',
  render: args => (
    <div className="bg-black/90 p-8 rounded-xl">
      <h3 className="text-xl font-bold text-yellow-400 mb-6 font-cinzel animate-sacred-glow">
        Sacred Mystical Chips
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-md font-medium text-yellow-300 mb-3">
            Divine Elements
          </h4>
          <div className="flex flex-wrap gap-4">
            <Chip {...args} label="Fire" sacredtheme={true} outline={true} />
            <Chip {...args} label="Water" sacredtheme={true} outline={true} />
            <Chip {...args} label="Earth" sacredtheme={true} outline={true} />
            <Chip {...args} label="Air" sacredtheme={true} outline={true} />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-yellow-300 mb-3">
            Sacred Powers
          </h4>
          <div className="flex flex-wrap gap-4">
            <Chip
              {...args}
              label="Wisdom"
              onDelete={() => console.log('Wisdom banished')}
              sacredtheme={true}
              outline={true}
            />
            <Chip
              {...args}
              label="Strength"
              onDelete={() => console.log('Strength banished')}
              sacredtheme={true}
              outline={true}
            />
            <Chip
              {...args}
              label="Magic"
              onDelete={() => console.log('Magic banished')}
              sacredtheme={true}
              outline={true}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-yellow-300 mb-4">
          Pure Essence (No Outline)
        </h4>
        <div className="flex flex-wrap gap-4">
          <Chip {...args} label="Spirit" sacredtheme={true} outline={false} />
          <Chip
            {...args}
            label="Soul"
            onDelete={() => console.log('Soul released')}
            sacredtheme={true}
            outline={false}
          />
          <Chip {...args} label="Aura" sacredtheme={true} outline={false} />
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-yellow-300 mb-4">
          Sealed Powers
        </h4>
        <div className="flex flex-wrap gap-4">
          <Chip
            {...args}
            label="Forbidden"
            disabled={true}
            sacredtheme={true}
            outline={true}
          />
          <Chip
            {...args}
            label="Cursed"
            onDelete={() => console.log('Cannot remove curse')}
            disabled={true}
            sacredtheme={true}
            outline={true}
          />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test sacred theme chips
    const sacredChips = canvas.getAllByText(/Fire|Water|Wisdom/i)
    expect(sacredChips.length).toBeGreaterThan(0)

    // Test delete functionality
    const deleteButtons = canvas.getAllByRole('button', {
      name: /remove chip/i,
    })
    if (deleteButtons.length > 0) {
      await userEvent.click(deleteButtons[0])
    }
  },
}

/**
 * 3) Premium vs Sacred Comparison
 */
export const PremiumVsSacredComparison: Story = {
  name: 'Premium vs Sacred Theme Comparison',
  render: args => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Premium Theme */}
      <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-inter">
          Premium Theme
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Modern professional design with glassmorphism
            </p>
            <div className="flex flex-wrap gap-2">
              <Chip
                {...args}
                label="Professional"
                sacredtheme={false}
                outline={true}
              />
              <Chip
                {...args}
                label="Business"
                onDelete={() => console.log('Business removed')}
                sacredtheme={false}
                outline={true}
              />
              <Chip
                {...args}
                label="Corporate"
                sacredtheme={false}
                outline={false}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Smooth hover effects and subtle animations
            </p>
            <div className="flex flex-wrap gap-2">
              <Chip
                {...args}
                label="Smooth"
                sacredtheme={false}
                outline={true}
              />
              <Chip
                {...args}
                label="Elegant"
                onDelete={() => console.log('Elegant removed')}
                sacredtheme={false}
                outline={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sacred Theme */}
      <div className="bg-black/90 p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-bold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Sacred Theme
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-yellow-200">
              Mystical Egyptian design with golden glows
            </p>
            <div className="flex flex-wrap gap-2">
              <Chip
                {...args}
                label="Mystical"
                sacredtheme={true}
                outline={true}
              />
              <Chip
                {...args}
                label="Divine"
                onDelete={() => console.log('Divine power banished')}
                sacredtheme={true}
                outline={true}
              />
              <Chip
                {...args}
                label="Ancient"
                sacredtheme={true}
                outline={false}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-yellow-200">
              Floating hieroglyphs and sacred shimmer effects
            </p>
            <div className="flex flex-wrap gap-2">
              <Chip
                {...args}
                label="Sacred"
                sacredtheme={true}
                outline={true}
              />
              <Chip
                {...args}
                label="Eternal"
                onDelete={() => console.log('Eternal power removed')}
                sacredtheme={true}
                outline={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test both themes
    const allChips = canvas.getAllByText(
      /Professional|Business|Mystical|Divine/i
    )
    expect(allChips.length).toBeGreaterThan(0)

    // Test interactions
    const deleteButtons = canvas.getAllByRole('button', {
      name: /remove chip/i,
    })
    if (deleteButtons.length >= 2) {
      await userEvent.click(deleteButtons[0])
      await userEvent.click(deleteButtons[1])
    }
  },
}

/**
 * 4) Outline Variants
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

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-md font-medium text-gray-700">
              With Outline (Default)
            </h4>
            <div className="flex flex-wrap gap-3">
              <Chip
                {...args}
                label="Outlined"
                outline={true}
                sacredtheme={false}
              />
              <Chip
                {...args}
                label="Bordered"
                onDelete={() => console.log('Bordered removed')}
                outline={true}
                sacredtheme={false}
              />
              <Chip
                {...args}
                label="Framed"
                outline={true}
                sacredtheme={false}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-md font-medium text-gray-700">
              Without Outline
            </h4>
            <div className="flex flex-wrap gap-3">
              <Chip
                {...args}
                label="Clean"
                outline={false}
                sacredtheme={false}
              />
              <Chip
                {...args}
                label="Minimal"
                onDelete={() => console.log('Minimal removed')}
                outline={false}
                sacredtheme={false}
              />
              <Chip
                {...args}
                label="Subtle"
                outline={false}
                sacredtheme={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sacred Theme Outline Variants */}
      <div className="bg-black/90 p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Sacred Theme
        </h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-md font-medium text-yellow-300">
              With Sacred Glow (Default)
            </h4>
            <div className="flex flex-wrap gap-4">
              <Chip
                {...args}
                label="Radiant"
                outline={true}
                sacredtheme={true}
              />
              <Chip
                {...args}
                label="Luminous"
                onDelete={() => console.log('Luminous banished')}
                outline={true}
                sacredtheme={true}
              />
              <Chip
                {...args}
                label="Glowing"
                outline={true}
                sacredtheme={true}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-md font-medium text-yellow-300">
              Pure Essence (No Outline)
            </h4>
            <div className="flex flex-wrap gap-4">
              <Chip {...args} label="Pure" outline={false} sacredtheme={true} />
              <Chip
                {...args}
                label="Essence"
                onDelete={() => console.log('Essence released')}
                outline={false}
                sacredtheme={true}
              />
              <Chip
                {...args}
                label="Spirit"
                outline={false}
                sacredtheme={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test outline variants
    const outlineChips = canvas.getAllByText(
      /Outlined|Bordered|Radiant|Luminous/i
    )
    expect(outlineChips.length).toBeGreaterThan(0)

    // Test interactions with different variants
    const deleteButtons = canvas.getAllByRole('button', {
      name: /remove chip/i,
    })
    if (deleteButtons.length >= 2) {
      await userEvent.click(deleteButtons[0])
      await userEvent.click(deleteButtons[1])
    }
  },
}

/**
 * 5) Interactive Demo
 */
const InteractiveDemoComponent: React.FC<
  React.ComponentProps<typeof Chip>
> = args => {
  const [chips, setChips] = React.useState([
    { id: 1, label: 'React', removable: true },
    { id: 2, label: 'TypeScript', removable: true },
    { id: 3, label: 'JavaScript', removable: false },
    { id: 4, label: 'CSS', removable: true },
  ])

  const [config, setConfig] = React.useState({
    sacredtheme: false,
    outline: true,
    disabled: false,
  })

  const removeChip = (id: number) => {
    setChips(chips.filter(chip => chip.id !== id))
  }

  const addChip = () => {
    const newChip = {
      id: Date.now(),
      label: `Chip ${chips.length + 1}`,
      removable: true,
    }
    setChips([...chips, newChip])
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Chip Configuration
        </h3>
        <div className="flex flex-wrap gap-4 mb-4">
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
              checked={config.disabled}
              onChange={e =>
                setConfig({ ...config, disabled: e.target.checked })
              }
              className="mr-2"
            />
            Disabled
          </label>
        </div>
        <button
          onClick={addChip}
          disabled={config.disabled}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Add Chip
        </button>
      </div>

      {/* Chips Display */}
      <div
        className={
          config.sacredtheme
            ? 'bg-black/90 p-8 rounded-xl'
            : 'p-8 bg-gray-50 rounded-xl'
        }
      >
        <h3
          className={`text-lg font-semibold mb-4 ${config.sacredtheme ? 'text-yellow-400 font-cinzel' : 'text-gray-900'}`}
        >
          {config.sacredtheme
            ? 'Sacred Mystical Elements'
            : 'Interactive Chips Collection'}
        </h3>

        <div className="flex flex-wrap gap-3">
          {chips.map(chip => (
            <Chip
              key={chip.id}
              {...args}
              label={chip.label}
              onDelete={chip.removable ? () => removeChip(chip.id) : undefined}
              sacredtheme={config.sacredtheme}
              outline={config.outline}
              disabled={config.disabled}
            />
          ))}
        </div>

        <div
          className={`mt-4 text-sm ${config.sacredtheme ? 'text-yellow-200' : 'text-gray-600'}`}
        >
          Total chips: {chips.length}
        </div>
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: args => <InteractiveDemoComponent {...args} />,
}

/**
 * 6) Category Filter Example
 */
const CategoryFilterExampleComponent: React.FC<
  React.ComponentProps<typeof Chip>
> = args => {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([
    'frontend',
    'ui',
  ])

  const categories = [
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'database', label: 'Database' },
    { id: 'ui', label: 'UI/UX' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'devops', label: 'DevOps' },
  ]

  const sacredCategories = [
    { id: 'fire', label: 'Fire Magic' },
    { id: 'water', label: 'Water Spells' },
    { id: 'earth', label: 'Earth Rituals' },
    { id: 'air', label: 'Air Incantations' },
    { id: 'light', label: 'Light Blessings' },
    { id: 'shadow', label: 'Shadow Arts' },
  ]

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Premium Filter */}
      <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-inter">
          Skills Filter
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Click chips to toggle selection
        </p>

        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <div
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              style={{ cursor: 'pointer' }}
            >
              <Chip
                {...args}
                label={category.label}
                sacredtheme={false}
                outline={selectedCategories.includes(category.id)}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Selected:{' '}
          {
            selectedCategories.filter(id =>
              categories.some(cat => cat.id === id)
            ).length
          }{' '}
          skills
        </div>
      </div>

      {/* Sacred Filter */}
      <div className="bg-black/90 p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-bold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Magical Arts Filter
        </h3>
        <p className="text-sm text-yellow-200 mb-4">
          Select your mystical disciplines
        </p>

        <div className="flex flex-wrap gap-3">
          {sacredCategories.map(category => (
            <div
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              style={{ cursor: 'pointer' }}
            >
              <Chip
                {...args}
                label={category.label}
                sacredtheme={true}
                outline={selectedCategories.includes(category.id)}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-yellow-200">
          Mastered:{' '}
          {
            selectedCategories.filter(id =>
              sacredCategories.some(cat => cat.id === id)
            ).length
          }{' '}
          arts
        </div>
      </div>
    </div>
  )
}

export const CategoryFilterExample: Story = {
  name: 'Category Filter Example',
  render: args => <CategoryFilterExampleComponent {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test category filter
    const categoryChips = canvas.getAllByText(
      /Frontend|Backend|Fire Magic|Water Spells/i
    )
    expect(categoryChips.length).toBeGreaterThan(0)

    // Test clicking chips
    if (categoryChips.length > 0) {
      await userEvent.click(categoryChips[0])
    }
  },
}
