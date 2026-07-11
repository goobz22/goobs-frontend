// src/components/Switch/switch.stories.tsx

import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import Switch from './index'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    styles: {
      control: false,
      table: { category: 'Styling' },
    },
    leftLabel: { control: 'text' },
    rightLabel: { control: 'text' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * 1) Light Theme Variants
 */
export const LightThemeVariants: Story = {
  name: 'Light Theme - All Variants',
  render: args => {
    const Component = () => {
      const [offChecked, setOffChecked] = useState(false)
      const [onChecked, setOnChecked] = useState(true)
      const [disabledOffChecked, setDisabledOffChecked] = useState(false)
      const [disabledOnChecked, setDisabledOnChecked] = useState(true)
      const [label1Checked, setLabel1Checked] = useState(false)
      const [label2Checked, setLabel2Checked] = useState(true)
      const [label3Checked, setLabel3Checked] = useState(true)
      const [label4Checked, setLabel4Checked] = useState(false)
      const [noOutline1Checked, setNoOutline1Checked] = useState(false)
      const [noOutline2Checked, setNoOutline2Checked] = useState(true)
      const [noOutline3Checked, setNoOutline3Checked] = useState(true)

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            padding: '24px',
            background: 'linear-gradient(to bottom right, #f9fafb, #eff6ff)',
            borderRadius: '12px',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '24px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Light Switch Styles
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '32px',
            }}
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '12px',
                }}
              >
                Basic States
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>
                    Off State
                  </span>
                  <Switch
                    {...args}
                    checked={offChecked}
                    onChange={e => setOffChecked(e.target.checked)}
                    styles={{ theme: 'light', outline: true }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>
                    On State
                  </span>
                  <Switch
                    {...args}
                    checked={onChecked}
                    onChange={e => setOnChecked(e.target.checked)}
                    styles={{ theme: 'light', outline: true }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>
                    Disabled Off
                  </span>
                  <Switch
                    {...args}
                    checked={disabledOffChecked}
                    onChange={e => setDisabledOffChecked(e.target.checked)}
                    disabled={true}
                    styles={{ theme: 'light', outline: true }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>
                    Disabled On
                  </span>
                  <Switch
                    {...args}
                    checked={disabledOnChecked}
                    onChange={e => setDisabledOnChecked(e.target.checked)}
                    disabled={true}
                    styles={{ theme: 'light', outline: true }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '12px',
                }}
              >
                With Labels
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <Switch
                  {...args}
                  checked={label1Checked}
                  onChange={e => setLabel1Checked(e.target.checked)}
                  rightLabel="Enable notifications"
                  styles={{ theme: 'light', outline: true }}
                />
                <Switch
                  {...args}
                  checked={label2Checked}
                  onChange={e => setLabel2Checked(e.target.checked)}
                  rightLabel="Dark mode"
                  styles={{ theme: 'light', outline: true }}
                />
                <Switch
                  {...args}
                  checked={label3Checked}
                  onChange={e => setLabel3Checked(e.target.checked)}
                  rightLabel="Auto-save"
                  styles={{ theme: 'light', outline: true }}
                />
                <Switch
                  {...args}
                  checked={label4Checked}
                  onChange={e => setLabel4Checked(e.target.checked)}
                  rightLabel="Beta features"
                  disabled={true}
                  styles={{ theme: 'light', outline: true }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '16px',
              }}
            >
              Without Outline
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
              <Switch
                {...args}
                checked={noOutline1Checked}
                onChange={e => setNoOutline1Checked(e.target.checked)}
                rightLabel="Clean design"
                styles={{ theme: 'light', outline: false }}
              />
              <Switch
                {...args}
                checked={noOutline2Checked}
                onChange={e => setNoOutline2Checked(e.target.checked)}
                rightLabel="Minimal style"
                styles={{ theme: 'light', outline: false }}
              />
              <Switch
                {...args}
                checked={noOutline3Checked}
                onChange={e => setNoOutline3Checked(e.target.checked)}
                rightLabel="Subtle appearance"
                styles={{ theme: 'light', outline: false }}
              />
            </div>
          </div>
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test that switches are rendered
    const switches = canvas.getAllByRole('switch')
    expect(switches.length).toBeGreaterThan(0)

    // Test switch interaction
    const firstSwitch = switches.at(0)
    if (firstSwitch) {
      await userEvent.click(firstSwitch)
    }
  },
}

/**
 * 2) Dark Theme Variants
 */
export const DarkThemeVariants: Story = {
  name: 'Dark Theme - All Variants',
  render: args => {
    const Component = () => {
      const [offChecked, setOffChecked] = useState(false)
      const [onChecked, setOnChecked] = useState(true)
      const [disabledOffChecked, setDisabledOffChecked] = useState(false)
      const [disabledOnChecked, setDisabledOnChecked] = useState(true)
      const [label1Checked, setLabel1Checked] = useState(false)
      const [label2Checked, setLabel2Checked] = useState(true)
      const [label3Checked, setLabel3Checked] = useState(true)
      const [label4Checked, setLabel4Checked] = useState(false)
      const [noOutline1Checked, setNoOutline1Checked] = useState(false)
      const [noOutline2Checked, setNoOutline2Checked] = useState(true)
      const [noOutline3Checked, setNoOutline3Checked] = useState(true)

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            padding: '24px',
            background: '#111827',
            borderRadius: '12px',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#e5e7eb',
              marginBottom: '24px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Dark Switch Styles
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '32px',
            }}
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#d1d5db',
                  marginBottom: '12px',
                }}
              >
                Basic States
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                    Off State
                  </span>
                  <Switch
                    {...args}
                    checked={offChecked}
                    onChange={e => setOffChecked(e.target.checked)}
                    styles={{ theme: 'dark', outline: true }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                    On State
                  </span>
                  <Switch
                    {...args}
                    checked={onChecked}
                    onChange={e => setOnChecked(e.target.checked)}
                    styles={{ theme: 'dark', outline: true }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                    Disabled Off
                  </span>
                  <Switch
                    {...args}
                    checked={disabledOffChecked}
                    onChange={e => setDisabledOffChecked(e.target.checked)}
                    disabled={true}
                    styles={{ theme: 'dark', outline: true }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                    Disabled On
                  </span>
                  <Switch
                    {...args}
                    checked={disabledOnChecked}
                    onChange={e => setDisabledOnChecked(e.target.checked)}
                    disabled={true}
                    styles={{ theme: 'dark', outline: true }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#d1d5db',
                  marginBottom: '12px',
                }}
              >
                With Labels
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <Switch
                  {...args}
                  checked={label1Checked}
                  onChange={e => setLabel1Checked(e.target.checked)}
                  rightLabel="Enable notifications"
                  styles={{ theme: 'dark', outline: true }}
                />
                <Switch
                  {...args}
                  checked={label2Checked}
                  onChange={e => setLabel2Checked(e.target.checked)}
                  rightLabel="Night mode"
                  styles={{ theme: 'dark', outline: true }}
                />
                <Switch
                  {...args}
                  checked={label3Checked}
                  onChange={e => setLabel3Checked(e.target.checked)}
                  rightLabel="Auto-save"
                  styles={{ theme: 'dark', outline: true }}
                />
                <Switch
                  {...args}
                  checked={label4Checked}
                  onChange={e => setLabel4Checked(e.target.checked)}
                  rightLabel="Beta features"
                  disabled={true}
                  styles={{ theme: 'dark', outline: true }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: '#d1d5db',
                marginBottom: '16px',
              }}
            >
              Without Outline
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
              <Switch
                {...args}
                checked={noOutline1Checked}
                onChange={e => setNoOutline1Checked(e.target.checked)}
                rightLabel="Clean design"
                styles={{ theme: 'dark', outline: false }}
              />
              <Switch
                {...args}
                checked={noOutline2Checked}
                onChange={e => setNoOutline2Checked(e.target.checked)}
                rightLabel="Minimal style"
                styles={{ theme: 'dark', outline: false }}
              />
              <Switch
                {...args}
                checked={noOutline3Checked}
                onChange={e => setNoOutline3Checked(e.target.checked)}
                rightLabel="Subtle appearance"
                styles={{ theme: 'dark', outline: false }}
              />
            </div>
          </div>
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test that switches are rendered
    const switches = canvas.getAllByRole('switch')
    expect(switches.length).toBeGreaterThan(0)

    // Test switch interaction
    const firstSwitch = switches.at(0)
    if (firstSwitch) {
      await userEvent.click(firstSwitch)
    }
  },
}

/**
 * 3) Sacred Theme Variants
 */
export const SacredThemeVariants: Story = {
  name: 'Sacred Theme - All Variants',
  render: args => {
    const Component = () => {
      const [dormantChecked, setDormantChecked] = useState(false)
      const [awakenedChecked, setAwakenedChecked] = useState(true)
      const [sealedDormantChecked, setSealedDormantChecked] = useState(false)
      const [sealedAwakenedChecked, setSealedAwakenedChecked] = useState(true)
      const [divine1Checked, setDivine1Checked] = useState(false)
      const [divine2Checked, setDivine2Checked] = useState(true)
      const [divine3Checked, setDivine3Checked] = useState(true)
      const [divine4Checked, setDivine4Checked] = useState(false)
      const [essence1Checked, setEssence1Checked] = useState(false)
      const [essence2Checked, setEssence2Checked] = useState(true)
      const [essence3Checked, setEssence3Checked] = useState(true)

      return (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            padding: '32px',
            borderRadius: '12px',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#ffd700',
              marginBottom: '24px',
              fontFamily: "'Cinzel', Georgia, serif",
            }}
          >
            Sacred Mystical Switches
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '32px',
            }}
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#fde047',
                  marginBottom: '12px',
                }}
              >
                Divine States
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#ffe680' }}>
                    Dormant
                  </span>
                  <Switch
                    {...args}
                    checked={dormantChecked}
                    onChange={e => setDormantChecked(e.target.checked)}
                    styles={{ theme: 'sacred', outline: true }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#ffe680' }}>
                    Awakened
                  </span>
                  <Switch
                    {...args}
                    checked={awakenedChecked}
                    onChange={e => setAwakenedChecked(e.target.checked)}
                    styles={{ theme: 'sacred', outline: true }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#ffe680' }}>
                    Sealed Dormant
                  </span>
                  <Switch
                    {...args}
                    checked={sealedDormantChecked}
                    onChange={e => setSealedDormantChecked(e.target.checked)}
                    disabled={true}
                    styles={{ theme: 'sacred', outline: true }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#ffe680' }}>
                    Sealed Awakened
                  </span>
                  <Switch
                    {...args}
                    checked={sealedAwakenedChecked}
                    onChange={e => setSealedAwakenedChecked(e.target.checked)}
                    disabled={true}
                    styles={{ theme: 'sacred', outline: true }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#fde047',
                  marginBottom: '12px',
                }}
              >
                Sacred Powers
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <Switch
                  {...args}
                  checked={divine1Checked}
                  onChange={e => setDivine1Checked(e.target.checked)}
                  rightLabel="Channel Divine Energy"
                  styles={{ theme: 'sacred', outline: true }}
                />
                <Switch
                  {...args}
                  checked={divine2Checked}
                  onChange={e => setDivine2Checked(e.target.checked)}
                  rightLabel="Activate Sacred Aura"
                  styles={{ theme: 'sacred', outline: true }}
                />
                <Switch
                  {...args}
                  checked={divine3Checked}
                  onChange={e => setDivine3Checked(e.target.checked)}
                  rightLabel="Enable Mystical Sight"
                  styles={{ theme: 'sacred', outline: true }}
                />
                <Switch
                  {...args}
                  checked={divine4Checked}
                  onChange={e => setDivine4Checked(e.target.checked)}
                  rightLabel="Forbidden Knowledge"
                  disabled={true}
                  styles={{ theme: 'sacred', outline: true }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: '#fde047',
                marginBottom: '16px',
              }}
            >
              Pure Essence (No Outline)
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
              <Switch
                {...args}
                checked={essence1Checked}
                onChange={e => setEssence1Checked(e.target.checked)}
                rightLabel="Spiritual Connection"
                styles={{ theme: 'sacred', outline: false }}
              />
              <Switch
                {...args}
                checked={essence2Checked}
                onChange={e => setEssence2Checked(e.target.checked)}
                rightLabel="Divine Harmony"
                styles={{ theme: 'sacred', outline: false }}
              />
              <Switch
                {...args}
                checked={essence3Checked}
                onChange={e => setEssence3Checked(e.target.checked)}
                rightLabel="Eternal Wisdom"
                styles={{ theme: 'sacred', outline: false }}
              />
            </div>
          </div>
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test sacred theme switches
    const sacredSwitches = canvas.getAllByRole('switch')
    expect(sacredSwitches.length).toBeGreaterThan(0)

    // Test sacred switch interaction
    const firstSacredSwitch = sacredSwitches.at(0)
    if (firstSacredSwitch) {
      await userEvent.click(firstSacredSwitch)
    }
  },
}

/**
 * 4) Theme Comparison
 */
export const ThemeComparison: Story = {
  render: args => {
    const Component = () => {
      const [lightChecked1, setLightChecked1] = useState(false)
      const [lightChecked2, setLightChecked2] = useState(true)
      const [lightChecked3, setLightChecked3] = useState(true)
      const [darkChecked1, setDarkChecked1] = useState(false)
      const [darkChecked2, setDarkChecked2] = useState(true)
      const [darkChecked3, setDarkChecked3] = useState(true)
      const [sacredChecked1, setSacredChecked1] = useState(false)
      const [sacredChecked2, setSacredChecked2] = useState(true)
      const [sacredChecked3, setSacredChecked3] = useState(true)

      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '32px',
          }}
        >
          {/* Light Theme */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              padding: '24px',
              background: 'linear-gradient(to bottom right, #f9fafb, #eff6ff)',
              borderRadius: '12px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '16px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Light Theme
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <p style={{ fontSize: '14px', color: '#4b5563' }}>
                  Clean professional design with subtle shadows
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <Switch
                    {...args}
                    checked={lightChecked1}
                    onChange={e => setLightChecked1(e.target.checked)}
                    rightLabel="Business mode"
                    styles={{ theme: 'light', outline: true }}
                  />
                  <Switch
                    {...args}
                    checked={lightChecked2}
                    onChange={e => setLightChecked2(e.target.checked)}
                    rightLabel="Professional settings"
                    styles={{ theme: 'light', outline: true }}
                  />
                  <Switch
                    {...args}
                    checked={lightChecked3}
                    onChange={e => setLightChecked3(e.target.checked)}
                    rightLabel="Clean interface"
                    styles={{ theme: 'light', outline: false }}
                  />
                </div>
              </div>
            </div>

            {/* Dark Theme */}
            <div
              style={{
                background: '#111827',
                padding: '24px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#e5e7eb',
                  marginBottom: '16px',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Dark Theme
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                    Modern dark interface with blue accents
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <Switch
                      {...args}
                      checked={darkChecked1}
                      onChange={e => setDarkChecked1(e.target.checked)}
                      rightLabel="Night mode"
                      styles={{ theme: 'dark', outline: true }}
                    />
                    <Switch
                      {...args}
                      checked={darkChecked2}
                      onChange={e => setDarkChecked2(e.target.checked)}
                      rightLabel="Dark interface"
                      styles={{ theme: 'dark', outline: true }}
                    />
                    <Switch
                      {...args}
                      checked={darkChecked3}
                      onChange={e => setDarkChecked3(e.target.checked)}
                      rightLabel="Minimal design"
                      styles={{ theme: 'dark', outline: false }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sacred Theme */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.9)',
                padding: '24px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#ffd700',
                  marginBottom: '16px',
                  fontFamily: "'Cinzel', Georgia, serif",
                }}
              >
                Sacred Theme
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <p style={{ fontSize: '14px', color: '#ffe680' }}>
                    Mystical golden design with Egyptian elements
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <Switch
                      {...args}
                      checked={sacredChecked1}
                      onChange={e => setSacredChecked1(e.target.checked)}
                      rightLabel="Mystical Powers"
                      styles={{ theme: 'sacred', outline: true }}
                    />
                    <Switch
                      {...args}
                      checked={sacredChecked2}
                      onChange={e => setSacredChecked2(e.target.checked)}
                      rightLabel="Divine Blessings"
                      styles={{ theme: 'sacred', outline: true }}
                    />
                    <Switch
                      {...args}
                      checked={sacredChecked3}
                      onChange={e => setSacredChecked3(e.target.checked)}
                      rightLabel="Pure Energy"
                      styles={{ theme: 'sacred', outline: false }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test all themes
    const allSwitches = canvas.getAllByRole('switch')
    expect(allSwitches.length).toBeGreaterThan(0)

    // Test interactions with different themes
    const s0 = allSwitches.at(0)
    const s3 = allSwitches.at(3)
    const s6 = allSwitches.at(6)
    if (s0) await userEvent.click(s0)
    if (s3) await userEvent.click(s3)
    if (s6) await userEvent.click(s6)
  },
}

/**
 * 5) Custom Colors
 */
export const CustomColors: Story = {
  render: args => {
    const Component = () => {
      const [greenChecked1, setGreenChecked1] = useState(false)
      const [greenChecked2, setGreenChecked2] = useState(true)
      const [purpleChecked1, setPurpleChecked1] = useState(false)
      const [purpleChecked2, setPurpleChecked2] = useState(true)
      const [customSizeChecked1, setCustomSizeChecked1] = useState(true)
      const [customSizeChecked2, setCustomSizeChecked2] = useState(false)

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            padding: '24px',
            background: '#f9fafb',
            borderRadius: '12px',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '24px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Custom Color Switches
          </h3>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <h4
                style={{ fontSize: '16px', fontWeight: 500, color: '#374151' }}
              >
                Green Theme
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <Switch
                  {...args}
                  checked={greenChecked1}
                  onChange={e => setGreenChecked1(e.target.checked)}
                  rightLabel="Enable eco mode"
                  styles={{
                    theme: 'light',
                    outline: true,
                    checkedTrackColor: '#10B981',
                    checkedThumbColor: '#FFFFFF',
                  }}
                />
                <Switch
                  {...args}
                  checked={greenChecked2}
                  onChange={e => setGreenChecked2(e.target.checked)}
                  rightLabel="Eco-friendly features"
                  styles={{
                    theme: 'light',
                    outline: true,
                    checkedTrackColor: '#10B981',
                    checkedThumbColor: '#FFFFFF',
                  }}
                />
              </div>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <h4
                style={{ fontSize: '16px', fontWeight: 500, color: '#374151' }}
              >
                Purple Theme
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <Switch
                  {...args}
                  checked={purpleChecked1}
                  onChange={e => setPurpleChecked1(e.target.checked)}
                  rightLabel="Premium features"
                  styles={{
                    theme: 'light',
                    outline: true,
                    checkedTrackColor: '#8B5CF6',
                    checkedThumbColor: '#FFFFFF',
                  }}
                />
                <Switch
                  {...args}
                  checked={purpleChecked2}
                  onChange={e => setPurpleChecked2(e.target.checked)}
                  rightLabel="Advanced settings"
                  styles={{
                    theme: 'light',
                    outline: true,
                    checkedTrackColor: '#8B5CF6',
                    checkedThumbColor: '#FFFFFF',
                  }}
                />
              </div>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <h4
                style={{ fontSize: '16px', fontWeight: 500, color: '#374151' }}
              >
                Custom Size
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <Switch
                  {...args}
                  checked={customSizeChecked1}
                  onChange={e => setCustomSizeChecked1(e.target.checked)}
                  rightLabel="Large switch"
                  styles={{
                    theme: 'light',
                    outline: true,
                    trackWidth: '60px',
                    trackHeight: '30px',
                    thumbSize: '26px',
                  }}
                />
                <Switch
                  {...args}
                  checked={customSizeChecked2}
                  onChange={e => setCustomSizeChecked2(e.target.checked)}
                  rightLabel="Small switch"
                  styles={{
                    theme: 'light',
                    outline: true,
                    trackWidth: '36px',
                    trackHeight: '20px',
                    thumbSize: '16px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test custom color switches
    const switches = canvas.getAllByRole('switch')
    expect(switches.length).toBeGreaterThan(0)

    // Test custom switch interaction
    const firstSwitch = switches.at(0)
    if (firstSwitch) {
      await userEvent.click(firstSwitch)
    }
  },
}

/**
 * 7) Dual Label Demo
 */
export const DualLabelDemo: Story = {
  name: 'Dual Labels',
  render: args => {
    const Component = () => {
      const [lightChecked, setLightChecked] = useState(false)
      const [darkChecked, setDarkChecked] = useState(false)
      const [sacredChecked, setSacredChecked] = useState(false)

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            padding: '24px',
            background: '#f9fafb',
            borderRadius: '12px',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '16px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Switches with Left and Right Labels
          </h3>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <div>
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                Light Theme
              </h4>
              <Switch
                {...args}
                leftLabel="Pie"
                rightLabel="Fish"
                checked={lightChecked}
                onChange={e => setLightChecked(e.target.checked)}
                styles={{ theme: 'light', outline: true }}
              />
            </div>

            <div>
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                Dark Theme
              </h4>
              <div
                style={{
                  padding: '16px',
                  background: '#111827',
                  borderRadius: '4px',
                }}
              >
                <Switch
                  {...args}
                  leftLabel="Pie"
                  rightLabel="Fish"
                  checked={darkChecked}
                  onChange={e => setDarkChecked(e.target.checked)}
                  styles={{ theme: 'dark', outline: true }}
                />
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                Sacred Theme
              </h4>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '4px',
                }}
              >
                <Switch
                  {...args}
                  leftLabel="Pie"
                  rightLabel="Fish"
                  checked={sacredChecked}
                  onChange={e => setSacredChecked(e.target.checked)}
                  styles={{ theme: 'sacred', outline: true }}
                />
              </div>
            </div>
          </div>
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switches = canvas.getAllByRole('switch')
    expect(switches.length).toBe(3)
    const firstSwitch = switches.at(0)
    if (firstSwitch) {
      await userEvent.click(firstSwitch)
    }
    // Add assertions if needed
  },
}

const InteractiveDemoRenderer = (args: Story['args']) => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'sacred'>('light')
  const [outline, setOutline] = React.useState(true)
  const [switches, setSwitches] = React.useState({
    notifications: false,
    darkMode: true,
    autoSave: true,
    betaFeatures: false,
    premium: false,
  })

  const handleSwitchChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSwitches(prev => ({ ...prev, [key]: e.target.checked }))
    }

  const demoWrapperStyle: React.CSSProperties =
    theme === 'sacred'
      ? {
          background: 'rgba(0, 0, 0, 0.9)',
          border: '1px solid rgba(250, 204, 21, 0.3)',
        }
      : theme === 'dark'
        ? { background: '#111827' }
        : { background: '#f9fafb' }
  const demoHeadingStyle: React.CSSProperties =
    theme === 'sacred'
      ? { color: '#ffd700', fontFamily: "'Cinzel', Georgia, serif" }
      : theme === 'dark'
        ? { color: '#e5e7eb', fontFamily: "'Inter', sans-serif" }
        : { color: '#111827', fontFamily: "'Inter', sans-serif" }

  return (
    <div
      style={{
        width: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <div
        style={{
          padding: '16px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '4px',
              }}
            >
              Theme
            </label>
            <select
              value={theme}
              onChange={e =>
                setTheme(e.target.value as 'light' | 'dark' | 'sacred')
              }
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="sacred">Sacred</option>
            </select>
          </div>
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '24px',
              }}
            >
              <input
                type="checkbox"
                checked={outline}
                onChange={e => setOutline(e.target.checked)}
              />
              Show Outline
            </label>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '24px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          ...demoWrapperStyle,
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            marginBottom: '16px',
            ...demoHeadingStyle,
          }}
        >
          Interactive Switch Demo
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Switch
            {...args}
            checked={switches.notifications}
            onChange={handleSwitchChange('notifications')}
            rightLabel="Enable Notifications"
            styles={{ theme, outline }}
          />
          <Switch
            {...args}
            checked={switches.darkMode}
            onChange={handleSwitchChange('darkMode')}
            rightLabel={theme === 'sacred' ? 'Sacred Mode' : 'Dark Mode'}
            styles={{ theme, outline }}
          />
          <Switch
            {...args}
            checked={switches.autoSave}
            onChange={handleSwitchChange('autoSave')}
            rightLabel="Auto-save"
            styles={{ theme, outline }}
          />
          <Switch
            {...args}
            checked={switches.betaFeatures}
            onChange={handleSwitchChange('betaFeatures')}
            rightLabel={theme === 'sacred' ? 'Ancient Powers' : 'Beta Features'}
            styles={{ theme, outline }}
          />
          <Switch
            {...args}
            checked={switches.premium}
            onChange={handleSwitchChange('premium')}
            rightLabel={
              theme === 'sacred' ? 'Divine Blessings' : 'Premium Features'
            }
            disabled={!switches.darkMode}
            styles={{ theme, outline }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * 6) Interactive Demo
 */
export const InteractiveDemo: Story = {
  render: args => <InteractiveDemoRenderer {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test interactive switches
    const switches = canvas.getAllByRole('switch')
    expect(switches.length).toBeGreaterThan(0)

    // Test theme selector
    const themeSelect = canvas.getByDisplayValue('Light')
    await userEvent.selectOptions(themeSelect, 'sacred')

    // Test switch interactions
    const first = switches.at(0)
    const fourth = switches.at(3)
    if (first) await userEvent.click(first)
    if (fourth) await userEvent.click(fourth)
  },
}

/**
 * 8) Accessibility — role, name, state & keyboard (WAI-ARIA APG Switch)
 *
 * Regression coverage for the a11y contract:
 *  - the control exposes `role="switch"` (announced as a switch, not a checkbox)
 *  - `aria-checked` tracks the on/off state (native checkbox → switch mapping)
 *  - an accessible NAME is present (here via `aria-label`; leftLabel/rightLabel
 *    inside the wrapping <label> are the other supported source)
 *  - keyboard: the switch is focusable and Space toggles it
 *  - the decorative thumb glyph is `aria-hidden` (never leaks into the name)
 */
export const AccessibilityChecks: Story = {
  name: 'Accessibility - Role, Name & Keyboard',
  render: args => {
    const Component = () => {
      const [ariaLabelled, setAriaLabelled] = useState(false)
      const [leftRight, setLeftRight] = useState(true)
      const [keyboard, setKeyboard] = useState(false)

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '24px',
            background: '#f9fafb',
            borderRadius: '12px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#111827',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Accessible Switch Semantics
          </h3>

          {/* Named purely programmatically (no visible label) */}
          <Switch
            {...args}
            aria-label="Enable notifications"
            checked={ariaLabelled}
            onChange={e => setAriaLabelled(e.target.checked)}
            styles={{ theme: 'light', outline: true }}
          />

          {/* Named by the wrapping <label> content */}
          <Switch
            {...args}
            leftLabel="Off"
            rightLabel="On"
            checked={leftRight}
            onChange={e => setLeftRight(e.target.checked)}
            styles={{ theme: 'light', outline: true }}
          />

          {/* Keyboard-toggle target */}
          <Switch
            {...args}
            aria-label="Sacred toggle"
            checked={keyboard}
            onChange={e => setKeyboard(e.target.checked)}
            styles={{ theme: 'sacred', outline: true }}
          />
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // All three controls expose the switch role (not checkbox).
    const switches = canvas.getAllByRole('switch')
    expect(switches.length).toBe(3)

    // Programmatic accessible name via aria-label.
    const named = canvas.getByRole('switch', { name: 'Enable notifications' })
    expect(named).toBeInTheDocument()
    expect(named).not.toBeChecked()

    // Name via the wrapping <label> text, and the decorative glyph must NOT
    // pollute the name (aria-hidden thumb) — it stays exactly "Off On".
    const labelled = canvas.getByRole('switch', { name: 'Off On' })
    expect(labelled).toBeChecked()

    // aria-checked tracks state after a click.
    await userEvent.click(named)
    expect(named).toBeChecked()

    // Keyboard: focus the sacred switch and toggle with Space.
    const kb = canvas.getByRole('switch', { name: 'Sacred toggle' })
    expect(kb).not.toBeChecked()
    kb.focus()
    expect(kb).toHaveFocus()
    await userEvent.keyboard(' ')
    expect(kb).toBeChecked()
  },
}

/**
 * 9) Accessibility — OFF-state non-text contrast (WCAG 1.4.11, AA)
 *
 * Regression gate for the 1.4.11 fix. In the light theme the OFF (unchecked)
 * switch must stay perceivable to low-vision users: the control's boundary (the
 * track border) is measured against the page and must clear the 3:1 non-text-
 * contrast floor. The old border `rgba(156,163,175,0.2)` read at only ~1.2:1
 * over a near-white page (the OFF pill was effectively invisible, and the white
 * thumb was ~1.3:1 against the faint track). The switch is rendered on a pure
 * WHITE page — the worst realistic adjacent colour — and the play function
 * computes the live WCAG contrast from the *rendered* border colour, so any
 * future weakening of `--switch-track-border-color` re-fails here.
 */
export const AccessibilityOffStateContrast: Story = {
  name: 'Accessibility - Off-State Contrast (WCAG 1.4.11)',
  render: args => {
    const Component = () => {
      const [wifi, setWifi] = useState(false)
      const [labelled, setLabelled] = useState(false)

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '24px',
            // Worst realistic case: a pure-white page behind the OFF control.
            background: '#ffffff',
            borderRadius: '12px',
          }}
        >
          <Switch
            {...args}
            aria-label="Wi-Fi"
            checked={wifi}
            onChange={e => setWifi(e.target.checked)}
            styles={{ theme: 'light', outline: true }}
          />

          <Switch
            {...args}
            leftLabel="Off"
            rightLabel="On"
            checked={labelled}
            onChange={e => setLabelled(e.target.checked)}
            styles={{ theme: 'light', outline: true }}
          />
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Minimal sRGB relative-luminance + WCAG contrast-ratio implementation.
    const parseRgb = (color: string): [number, number, number] => {
      const parts = color.match(/-?\d+(?:\.\d+)?/g) ?? []
      return [Number(parts[0]) || 0, Number(parts[1]) || 0, Number(parts[2]) || 0]
    }
    const linearize = (channel: number) => {
      const srgb = channel / 255
      return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4)
    }
    const luminance = ([r, g, b]: [number, number, number]) =>
      0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
    const contrastRatio = (
      colorA: [number, number, number],
      colorB: [number, number, number]
    ) => {
      const a = luminance(colorA) + 0.05
      const b = luminance(colorB) + 0.05
      return a > b ? a / b : b / a
    }
    const white: [number, number, number] = [255, 255, 255]

    // Both controls here are OFF (unchecked) and light-themed.
    const switches = canvas.getAllByRole('switch')
    expect(switches.length).toBe(2)

    for (const control of switches) {
      expect(control).not.toBeChecked()

      // The track is the <input>'s parent <div> (see index.tsx markup).
      const track = control.parentElement as HTMLElement
      expect(track).not.toBeNull()

      const trackStyle = getComputedStyle(track)
      // A real, non-zero boundary must actually be drawn (outline defaults on).
      expect(trackStyle.borderTopStyle).not.toBe('none')
      expect(parseFloat(trackStyle.borderTopWidth)).toBeGreaterThan(0)

      // …and that boundary must clear the 3:1 non-text-contrast floor against
      // the white page it sits on.
      const ratio = contrastRatio(parseRgb(trackStyle.borderTopColor), white)
      expect(ratio).toBeGreaterThanOrEqual(3)
    }
  },
}

/**
 * 10) Accessibility — reduced motion (WCAG 2.3.3 Animation from Interactions)
 *
 * Regression gate for the reduced-motion fix. The sacred switch runs an
 * INFINITE shimmer sweep (`sacredSwitchShimmer`) on hover-while-checked, plus
 * transitions on the track/thumb/labels. Under `prefers-reduced-motion: reduce`
 * those must be neutralised. A play function cannot flip the OS media
 * preference, so this asserts — via the CSSOM, scoped to THIS component's
 * hashed CSS-module classes — that Switch's own
 * `@media (prefers-reduced-motion: reduce)` block still exists and still
 * suppresses BOTH the infinite animation and the transitions. If a future edit
 * drops or weakens the block (re-introducing the shimmer for reduced-motion
 * users), this re-fails. The rendered sacred+checked switch also gives
 * Chromatic a visual baseline for the shimmer state.
 */
export const AccessibilityReducedMotion: Story = {
  name: 'Accessibility - Reduced Motion (WCAG 2.3.3)',
  render: args => {
    const Component = () => {
      const [on, setOn] = useState(true)

      return (
        <div
          style={{
            display: 'flex',
            padding: '24px',
            // Sacred surfaces read correctly only on a dark backdrop.
            background: '#0e0e0e',
            borderRadius: '12px',
          }}
        >
          <Switch
            {...args}
            aria-label="Sacred shimmer toggle"
            checked={on}
            onChange={e => setOn(e.target.checked)}
            styles={{ theme: 'sacred', outline: true }}
          />
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Rendering the switch loads the Switch stylesheet under test.
    const control = canvas.getByRole('switch', { name: 'Sacred shimmer toggle' })
    expect(control).toBeChecked()

    // The track is the <input>'s parent <div>; its (hashed) CSS-module class is
    // the token we scope the CSSOM search by, so another component's
    // reduced-motion block can never false-green this gate.
    const track = control.parentElement as HTMLElement
    const trackClass = track.className.trim().split(/\s+/).find(Boolean) ?? ''
    expect(trackClass).not.toBe('')

    // Collect every style rule inside a `prefers-reduced-motion: reduce` media
    // block from the same-origin injected stylesheets. Cross-origin sheets
    // throw on `.cssRules` and are skipped.
    const reducedMotionRules: CSSStyleRule[] = []
    const visit = (rules: CSSRuleList) => {
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSMediaRule) {
          const mediaText = rule.media.mediaText
          if (
            /prefers-reduced-motion/i.test(mediaText) &&
            /reduce/i.test(mediaText)
          ) {
            for (const inner of Array.from(rule.cssRules)) {
              if (inner instanceof CSSStyleRule) reducedMotionRules.push(inner)
            }
            continue
          }
        }
        if ('cssRules' in rule) {
          visit((rule as CSSGroupingRule).cssRules)
        }
      }
    }
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        visit(sheet.cssRules)
      } catch {
        // Cross-origin / non-inspectable stylesheet — ignore.
      }
    }

    // Scope to Switch's own reduced-motion rules via its hashed track class.
    const switchRules = reducedMotionRules.filter(
      rule =>
        typeof rule.selectorText === 'string' &&
        rule.selectorText.includes(trackClass)
    )
    expect(switchRules.length).toBeGreaterThan(0)

    // The infinite shimmer animation must be killed…
    const suppressesAnimation = switchRules.some(
      rule =>
        rule.style.getPropertyValue('animation').trim() === 'none' ||
        rule.style.getPropertyValue('animation-name').trim() === 'none'
    )
    expect(suppressesAnimation).toBe(true)

    // …and the track/thumb/label transitions must be neutralised.
    const suppressesTransition = switchRules.some(
      rule =>
        rule.style.getPropertyValue('transition').trim() === 'none' ||
        rule.style.getPropertyValue('transition-property').trim() === 'none'
    )
    expect(suppressesTransition).toBe(true)
  },
}

/**
 * 11) Accessibility — forced colors / Windows High Contrast (WCAG 2.4.7, 1.4.1)
 *
 * Regression gate for the forced-colors fix. In forced-colors / Windows High
 * Contrast Mode the UA drops every `box-shadow` and repaints backgrounds with a
 * small system palette. Switch's ONLY focus cue was the
 * `--switch-track-focus-shadow` box-shadow (so keyboard focus disappeared), and
 * the track/thumb backgrounds both collapse to the same system surface (so the
 * on/off distinction vanished). The fix adds a `@media (forced-colors: active)`
 * block that restores a system-colour-safe focus outline and a system-colour
 * thumb border. A play function cannot flip the OS forced-colors preference, so
 * this asserts — via the CSSOM, scoped to THIS component's hashed CSS-module
 * classes — that Switch's own forced-colors block still exists and still
 * repairs BOTH the focus indicator and the thumb boundary. If a future edit
 * drops or weakens the block, this re-fails.
 */
export const AccessibilityForcedColors: Story = {
  name: 'Accessibility - Forced Colors (WCAG 2.4.7)',
  render: args => {
    const Component = () => {
      const [on, setOn] = useState(true)

      return (
        <div
          style={{
            display: 'flex',
            padding: '24px',
            // Sacred surfaces read correctly only on a dark backdrop.
            background: '#0e0e0e',
            borderRadius: '12px',
          }}
        >
          <Switch
            {...args}
            aria-label="Sacred forced-colors toggle"
            checked={on}
            onChange={e => setOn(e.target.checked)}
            styles={{ theme: 'sacred', outline: true }}
          />
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Rendering the switch loads the Switch stylesheet under test.
    const control = canvas.getByRole('switch', {
      name: 'Sacred forced-colors toggle',
    })
    expect(control).toBeChecked()

    // Collect every hashed CSS-module class token used in this switch's track
    // subtree (track / input / shimmer / thumb). These are the tokens we scope
    // the CSSOM search by, so another component's forced-colors block can never
    // false-green this gate.
    const track = control.parentElement as HTMLElement
    const scopeTokens = new Set<string>()
    for (const element of [track, ...Array.from(track.querySelectorAll('*'))]) {
      for (const token of element.className.trim().split(/\s+/).filter(Boolean)) {
        scopeTokens.add(token)
      }
    }
    expect(scopeTokens.size).toBeGreaterThan(0)

    // Collect every style rule inside a `forced-colors: active` media block from
    // the same-origin injected stylesheets. Cross-origin sheets throw on
    // `.cssRules` and are skipped.
    const forcedColorsRules: CSSStyleRule[] = []
    const visit = (rules: CSSRuleList) => {
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSMediaRule) {
          const mediaText = rule.media.mediaText
          if (/forced-colors/i.test(mediaText) && /active/i.test(mediaText)) {
            for (const inner of Array.from(rule.cssRules)) {
              if (inner instanceof CSSStyleRule) forcedColorsRules.push(inner)
            }
            continue
          }
        }
        if ('cssRules' in rule) {
          visit((rule as CSSGroupingRule).cssRules)
        }
      }
    }
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        visit(sheet.cssRules)
      } catch {
        // Cross-origin / non-inspectable stylesheet — ignore.
      }
    }

    // Scope to Switch's own forced-colors rules via its hashed class tokens.
    const switchRules = forcedColorsRules.filter(
      rule =>
        typeof rule.selectorText === 'string' &&
        Array.from(scopeTokens).some(token =>
          rule.selectorText.includes(token)
        )
    )
    expect(switchRules.length).toBeGreaterThan(0)

    // Keyboard focus must stay visible (an outline survives forced-colors where
    // box-shadow is dropped)…
    const restoresFocusOutline = switchRules.some(
      rule =>
        /focus-visible/i.test(rule.selectorText) &&
        (rule.style.getPropertyValue('outline').trim() !== '' ||
          rule.style.getPropertyValue('outline-style').trim() !== '')
    )
    expect(restoresFocusOutline).toBe(true)

    // …and the on/off cue (the thumb) must keep a real boundary once its fill is
    // forced to the system surface colour.
    const restoresThumbBoundary = switchRules.some(
      rule =>
        rule.style.getPropertyValue('border').trim() !== '' ||
        rule.style.getPropertyValue('border-color').trim() !== '' ||
        rule.style.getPropertyValue('border-width').trim() !== ''
    )
    expect(restoresThumbBoundary).toBe(true)
  },
}
