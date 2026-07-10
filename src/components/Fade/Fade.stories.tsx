import type { Meta, StoryObj } from '@storybook/nextjs'
import React, { useState } from 'react'
import Fade from './index'
import CustomButton from '../Button'
import Typography from '../Typography'
import Paper from '../Paper'

const meta: Meta<typeof Fade> = {
  title: 'Components/Fade',
  component: Fade,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    styles: {
      control: { type: 'object' },
      description: 'Styling options for the fade component',
    },
    children: {
      control: { type: 'text' },
      description: 'Content to be wrapped with fade transition',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic fade story with interactive controls
export const Default: Story = {
  args: {
    styles: {
      in: true,
      theme: 'light',
      timeout: 300,
    },
    children: 'This content fades in and out!',
  },
  render: function BasicFadeStory(args) {
    const [isVisible, setIsVisible] = useState(args.styles?.in ?? true)

    return (
      <div
        style={{
          width: '400px',
          height: '300px',
          position: 'relative',
        }}
      >
        <CustomButton
          onClick={() => setIsVisible(!isVisible)}
          styles={{ theme: 'light' }}
        >
          Toggle Fade
        </CustomButton>
        <div style={{ marginTop: '20px', height: '200px' }}>
          <Fade
            {...args}
            styles={{
              ...args.styles,
              in: isVisible,
            }}
          >
            <Paper styles={{ theme: 'light', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'light' }}>
                {args.children}
              </Typography>
              <Typography styles={{ variant: 'merriparagraph', theme: 'light' }}>
                This is a fade transition component that animates opacity across
                themes.
              </Typography>
            </Paper>
          </Fade>
        </div>
      </div>
    )
  },
}

// Story showing different themes
export const Themes: Story = {
  render: function ThemesStory() {
    const [currentTheme, setCurrentTheme] = useState<
      'light' | 'dark' | 'sacred'
    >('light')
    const [isVisible, setIsVisible] = useState(true)

    const themes: Array<'light' | 'dark' | 'sacred'> = [
      'light',
      'dark',
      'sacred',
    ]

    return (
      <div style={{ width: '500px', height: '350px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          {themes.map(theme => (
            <CustomButton
              key={theme}
              onClick={() => setCurrentTheme(theme)}
              styles={{
                theme: theme,
                ...(currentTheme === theme
                  ? {
                      backgroundColor: 'rgba(59, 130, 246, 1)',
                      color: 'white',
                      borderColor: 'rgba(59, 130, 246, 1)',
                    }
                  : {}),
              }}
            >
              {theme} theme
            </CustomButton>
          ))}
          <CustomButton
            onClick={() => setIsVisible(!isVisible)}
            styles={{ theme: currentTheme }}
          >
            Toggle
          </CustomButton>
        </div>

        <div style={{ height: '250px' }}>
          <Fade
            styles={{
              in: isVisible,
              theme: currentTheme,
              timeout: 500,
            }}
          >
            {/* Paper renders its default WHITE surface for any non-sacred
                theme, so the dark state must supply a dark surface or the
                dark Typography (#e2e8f0) fails contrast on white. */}
            <Paper
              styles={{
                theme: currentTheme,
                padding: '25px',
                ...(currentTheme === 'dark'
                  ? {
                      backgroundColor: 'var(--goobs-dark-surface)',
                      borderColor: 'var(--goobs-dark-border)',
                    }
                  : {}),
              }}
            >
              <Typography styles={{ variant: 'merrih5', theme: currentTheme }}>
                {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}{' '}
                Theme
              </Typography>
              <Typography
                styles={{ variant: 'merriparagraph', theme: currentTheme }}
              >
                This fade component adapts to different theme configurations.
              </Typography>
            </Paper>
          </Fade>
        </div>
      </div>
    )
  },
}

// Dark theme — visible state
export const DarkTheme: Story = {
  render: function DarkFadeStory() {
    const [isVisible, setIsVisible] = useState(true)

    return (
      <div style={{ width: '450px', height: '300px' }}>
        <CustomButton
          onClick={() => setIsVisible(!isVisible)}
          styles={{ theme: 'dark' }}
        >
          Toggle Fade
        </CustomButton>
        <div style={{ marginTop: '20px', height: '200px' }}>
          <Fade styles={{ in: isVisible, theme: 'dark', timeout: 400 }}>
            {/* Paper's contract renders the default WHITE surface for any
                non-sacred theme — override to a real dark surface so the
                dark Typography (#e2e8f0, 11.87:1 on #1e293b) passes. */}
            <Paper
              styles={{
                theme: 'dark',
                padding: '20px',
                backgroundColor: 'var(--goobs-dark-surface)',
                borderColor: 'var(--goobs-dark-border)',
              }}
            >
              <Typography styles={{ variant: 'merrih6', theme: 'dark' }}>
                Dark Theme Fade
              </Typography>
              <Typography styles={{ variant: 'merriparagraph', theme: 'dark' }}>
                Opacity transition on a dark surface.
              </Typography>
            </Paper>
          </Fade>
        </div>
      </div>
    )
  },
  globals: { backgrounds: { value: 'dark' } },
}

// Sacred theme — visible state
export const SacredTheme: Story = {
  render: function SacredFadeStory() {
    const [isVisible, setIsVisible] = useState(true)

    return (
      <div style={{ width: '450px', height: '300px' }}>
        <CustomButton
          onClick={() => setIsVisible(!isVisible)}
          styles={{ theme: 'sacred' }}
        >
          Toggle Fade
        </CustomButton>
        <div style={{ marginTop: '20px', height: '200px' }}>
          <Fade styles={{ in: isVisible, theme: 'sacred', timeout: 500 }}>
            <Paper styles={{ theme: 'sacred', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'sacred' }}>
                Sacred Theme Fade
              </Typography>
              <Typography
                styles={{ variant: 'merriparagraph', theme: 'sacred' }}
              >
                Opacity transition on a sacred surface.
              </Typography>
            </Paper>
          </Fade>
        </div>
      </div>
    )
  },
  globals: { backgrounds: { value: 'dark' } },
}

// Story with custom timing
export const CustomTiming: Story = {
  render: function CustomTimingStory() {
    const [isVisible, setIsVisible] = useState(true)
    const [duration, setDuration] = useState(300)

    return (
      <div style={{ width: '450px', height: '300px' }}>
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <CustomButton
            onClick={() => setIsVisible(!isVisible)}
            styles={{ theme: 'light' }}
          >
            Toggle Fade
          </CustomButton>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Duration:
            <input
              type="range"
              min="100"
              max="2000"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              style={{ width: '100px' }}
            />
            <span>{duration}ms</span>
          </label>
        </div>

        <div style={{ height: '200px' }}>
          <Fade styles={{ in: isVisible, theme: 'light', timeout: duration }}>
            <Paper styles={{ theme: 'light', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'light' }}>
                Custom Timing: {duration}ms
              </Typography>
              <Typography styles={{ variant: 'merriparagraph', theme: 'light' }}>
                Adjust the slider to change the fade duration.
              </Typography>
            </Paper>
          </Fade>
        </div>
      </div>
    )
  },
  // Light-themed demo (raw black-text <label>, light Paper/Button) — pin the
  // light canvas so the label isn't black-on-#0e0e0e under the sacred default.
  globals: { backgrounds: { value: 'light' } },
}
