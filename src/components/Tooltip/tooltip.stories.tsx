// src/components/Tooltip/tooltip.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import StyledTooltip from './index'
import CustomButton from '../Button' // Using your existing button for demonstration

const meta: Meta<typeof StyledTooltip> = {
  title: 'Components/Tooltip',
  component: StyledTooltip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: { control: 'text' },
    tooltipplacement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    sacredtheme: { control: 'boolean' },
    arrow: { control: 'boolean' },
    enterDelay: { control: 'number' },
    leaveDelay: { control: 'number' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const defaultArgs = {
  title: 'Tooltip',
  children: <CustomButton text="Hover me" />,
}

/**
 * 1) Premium Theme Variants
 */
export const PremiumThemeVariants: Story = {
  name: 'Premium Theme - All Variants',
  render: args => (
    <div className="p-8 bg-gray-50 rounded-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6 font-inter">
        Premium Tooltips
      </h3>
      <div className="flex flex-wrap gap-8 justify-center items-center h-64">
        <StyledTooltip {...args} tooltipplacement="top" title="Top Tooltip">
          <CustomButton text="Top" />
        </StyledTooltip>
        <StyledTooltip
          {...args}
          tooltipplacement="bottom"
          title="Bottom Tooltip"
        >
          <CustomButton text="Bottom" />
        </StyledTooltip>
        <StyledTooltip {...args} tooltipplacement="left" title="Left Tooltip">
          <CustomButton text="Left" />
        </StyledTooltip>
        <StyledTooltip {...args} tooltipplacement="right" title="Right Tooltip">
          <CustomButton text="Right" />
        </StyledTooltip>
        <StyledTooltip
          {...args}
          tooltipplacement="top"
          title="No Arrow"
          arrow={false}
        >
          <CustomButton text="No Arrow" />
        </StyledTooltip>
      </div>
    </div>
  ),
  args: {
    ...defaultArgs,
    sacredtheme: false,
  },
}

/**
 * 2) Sacred Theme Variants
 */
export const SacredThemeVariants: Story = {
  name: 'Sacred Theme - All Variants',
  render: args => (
    <div className="p-8 bg-black/90 rounded-xl">
      <h3 className="text-xl font-bold text-yellow-400 mb-6 font-cinzel animate-sacred-glow">
        Sacred Tooltips
      </h3>
      <div className="flex flex-wrap gap-8 justify-center items-center h-64">
        <StyledTooltip
          {...args}
          tooltipplacement="top"
          title="Ancient Wisdom (Top)"
        >
          <CustomButton text="Top" sacredtheme />
        </StyledTooltip>
        <StyledTooltip
          {...args}
          tooltipplacement="bottom"
          title="Divine Insight (Bottom)"
        >
          <CustomButton text="Bottom" sacredtheme />
        </StyledTooltip>
        <StyledTooltip
          {...args}
          tooltipplacement="left"
          title="Mystical Secret (Left)"
        >
          <CustomButton text="Left" sacredtheme />
        </StyledTooltip>
        <StyledTooltip
          {...args}
          tooltipplacement="right"
          title="Golden Prophecy (Right)"
        >
          <CustomButton text="Right" sacredtheme />
        </StyledTooltip>
        <StyledTooltip
          {...args}
          tooltipplacement="top"
          title="No Arrow"
          arrow={false}
        >
          <CustomButton text="No Arrow" sacredtheme />
        </StyledTooltip>
      </div>
    </div>
  ),
  args: {
    ...defaultArgs,
    sacredtheme: true,
  },
}

const InteractiveDemoRenderer = () => {
  const [config, setConfig] = React.useState({
    title: 'Interactive Tooltip',
    placement: 'top' as 'top' | 'bottom' | 'left' | 'right',
    sacred: false,
    showArrow: true,
    enterDelay: 100,
    leaveDelay: 0,
  })

  return (
    <div className="w-[500px] space-y-6">
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tooltip Configuration
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={config.title}
              onChange={e => setConfig({ ...config, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placement
            </label>
            <select
              value={config.placement}
              onChange={e =>
                setConfig({
                  ...config,
                  placement: e.target.value as
                    | 'top'
                    | 'bottom'
                    | 'left'
                    | 'right',
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.sacred}
              onChange={e => setConfig({ ...config, sacred: e.target.checked })}
            />
            <span className="ml-2">Sacred Theme</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.showArrow}
              onChange={e =>
                setConfig({ ...config, showArrow: e.target.checked })
              }
            />
            <span className="ml-2">Show Arrow</span>
          </label>
        </div>
      </div>

      <div
        className={`p-8 rounded-xl flex justify-center items-center h-48 ${config.sacred ? 'bg-black/90' : 'bg-gray-50'}`}
      >
        <StyledTooltip
          title={config.title}
          tooltipplacement={config.placement}
          sacredtheme={config.sacred}
          arrow={config.showArrow}
          enterDelay={config.enterDelay}
          leaveDelay={config.leaveDelay}
        >
          <CustomButton text="Hover me" sacredtheme={config.sacred} />
        </StyledTooltip>
      </div>
    </div>
  )
}

/**
 * 3) Interactive Demo
 */
export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}
