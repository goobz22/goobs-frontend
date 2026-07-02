/**
 * @fileoverview Storybook stories for the Slider component.
 * These stories showcase the various themes, ranges, steps, and states of the
 * range-input-backed Slider, which composes the shared FieldShell.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import Slider from './index'

// Wrapper component for state management. Slider is controlled — onChange
// forwards the numeric value.
const SliderWithState = ({
  initialValue,
  ...props
}: React.ComponentProps<typeof Slider> & { initialValue?: number }) => {
  const [value, setValue] = useState<number>(initialValue ?? props.min ?? 0)
  return <Slider {...props} value={value} onChange={setValue} />
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof Slider> = {
  title: 'Components/Field/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    styles: {
      control: 'object',
      description: 'Per-instance style overrides including theme/disabled/required',
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '400px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Slider>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  render: () => (
    <SliderWithState
      label="Volume"
      min={0}
      max={100}
      step={1}
      initialValue={50}
      styles={{ theme: 'light' }}
    />
  ),
}

export const DarkTheme: Story = {
  render: () => (
    <SliderWithState
      label="Brightness"
      min={0}
      max={100}
      step={1}
      initialValue={50}
      styles={{ theme: 'dark' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <SliderWithState
      label="Resonance"
      min={0}
      max={100}
      step={1}
      initialValue={50}
      styles={{ theme: 'sacred' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// RANGES AND STEPS
// --------------------------------------------------------------------------

export const CustomRange: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <SliderWithState
        label="Temperature (°C)"
        min={-20}
        max={40}
        step={1}
        initialValue={20}
        helperText="Range from -20 to 40"
        styles={{ theme: 'light' }}
      />
      <SliderWithState
        label="Percentage"
        min={0}
        max={1}
        step={0.05}
        initialValue={0.5}
        helperText="Fine-grained 0.05 steps"
        styles={{ theme: 'light' }}
      />
      <SliderWithState
        label="Rating"
        min={1}
        max={5}
        step={1}
        initialValue={3}
        helperText="Discrete 1-5 steps"
        styles={{ theme: 'light' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// WITH HELPER TEXT
// --------------------------------------------------------------------------

export const WithHelperText: Story = {
  render: () => (
    <SliderWithState
      label="Opacity"
      min={0}
      max={100}
      step={5}
      initialValue={75}
      helperText="Drag to adjust the layer opacity"
      styles={{ theme: 'light' }}
    />
  ),
}

// --------------------------------------------------------------------------
// ERROR STATE
// --------------------------------------------------------------------------

export const WithError: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <SliderWithState
        label="Threshold"
        min={0}
        max={100}
        initialValue={10}
        error="Value must be at least 25"
        styles={{ theme: 'light' }}
      />
      <SliderWithState
        label="Threshold"
        min={0}
        max={100}
        initialValue={10}
        error="Value must be at least 25"
        styles={{ theme: 'dark' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// DISABLED STATE
// --------------------------------------------------------------------------

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <SliderWithState
        label="Disabled Light"
        min={0}
        max={100}
        initialValue={40}
        styles={{ theme: 'light', disabled: true }}
      />
      <SliderWithState
        label="Disabled Dark"
        min={0}
        max={100}
        initialValue={40}
        styles={{ theme: 'dark', disabled: true }}
      />
      <SliderWithState
        label="Disabled Sacred"
        min={0}
        max={100}
        initialValue={40}
        styles={{ theme: 'sacred', disabled: true }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// REQUIRED STATE
// --------------------------------------------------------------------------

export const Required: Story = {
  render: () => (
    <SliderWithState
      label="Confidence Level"
      min={0}
      max={100}
      initialValue={60}
      styles={{ theme: 'light', required: true }}
    />
  ),
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <SliderWithState
            label="Basic"
            min={0}
            max={100}
            initialValue={50}
            styles={{ theme: 'light' }}
          />
          <SliderWithState
            label="With Error"
            min={0}
            max={100}
            initialValue={5}
            error="Too low"
            styles={{ theme: 'light' }}
          />
          <SliderWithState
            label="Required"
            min={0}
            max={100}
            initialValue={70}
            styles={{ theme: 'light', required: true }}
          />
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <SliderWithState
            label="Basic"
            min={0}
            max={100}
            initialValue={50}
            styles={{ theme: 'dark' }}
          />
          <SliderWithState
            label="Disabled"
            min={0}
            max={100}
            initialValue={30}
            styles={{ theme: 'dark', disabled: true }}
          />
          <SliderWithState
            label="Custom Range"
            min={0}
            max={10}
            step={0.5}
            initialValue={5}
            styles={{ theme: 'dark' }}
          />
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <SliderWithState
            label="Basic"
            min={0}
            max={100}
            initialValue={50}
            styles={{ theme: 'sacred' }}
          />
          <SliderWithState
            label="With Helper"
            min={0}
            max={100}
            initialValue={88}
            helperText="Sacred resonance level"
            styles={{ theme: 'sacred' }}
          />
          <SliderWithState
            label="Disabled"
            min={0}
            max={100}
            initialValue={40}
            styles={{ theme: 'sacred', disabled: true }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
  globals: { backgrounds: { value: 'light' } },
}
