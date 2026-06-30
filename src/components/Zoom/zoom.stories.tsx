import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import Zoom from './index'
import CustomButton from '../Button'
import Typography from '../Typography'
import Paper from '../Paper'

const meta: Meta<typeof Zoom> = {
  title: 'Components/Zoom',
  component: Zoom,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    styles: {
      control: { type: 'object' },
      description: 'Styling options for the zoom component',
    },
    children: {
      control: { type: 'text' },
      description: 'Content to be wrapped with zoom transition',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic zoom story with interactive controls
export const Default: Story = {
  args: {
    styles: {
      in: true,
      theme: 'light',
      timeout: 300,
    },
    children: 'This content zooms in and out!',
  },
  render: function BasicZoomStory(args) {
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
          Toggle Zoom
        </CustomButton>
        <div style={{ marginTop: '20px', height: '200px' }}>
          <Zoom
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
                This is a zoom transition component that animates scale across
                themes.
              </Typography>
            </Paper>
          </Zoom>
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
          <Zoom
            styles={{
              in: isVisible,
              theme: currentTheme,
              timeout: 500,
            }}
          >
            <Paper styles={{ theme: currentTheme, padding: '25px' }}>
              <Typography styles={{ variant: 'merrih5', theme: currentTheme }}>
                {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}{' '}
                Theme
              </Typography>
              <Typography
                styles={{ variant: 'merriparagraph', theme: currentTheme }}
              >
                This zoom component adapts to different theme configurations.
              </Typography>
            </Paper>
          </Zoom>
        </div>
      </div>
    )
  },
}

// Dark theme — visible state
export const DarkTheme: Story = {
  render: function DarkZoomStory() {
    const [isVisible, setIsVisible] = useState(true)

    return (
      <div style={{ width: '450px', height: '300px' }}>
        <CustomButton
          onClick={() => setIsVisible(!isVisible)}
          styles={{ theme: 'dark' }}
        >
          Toggle Zoom
        </CustomButton>
        <div style={{ marginTop: '20px', height: '200px' }}>
          <Zoom styles={{ in: isVisible, theme: 'dark', timeout: 400 }}>
            <Paper styles={{ theme: 'dark', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'dark' }}>
                Dark Theme Zoom
              </Typography>
              <Typography styles={{ variant: 'merriparagraph', theme: 'dark' }}>
                Scale transition on a dark surface.
              </Typography>
            </Paper>
          </Zoom>
        </div>
      </div>
    )
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// Sacred theme — visible state
export const SacredTheme: Story = {
  render: function SacredZoomStory() {
    const [isVisible, setIsVisible] = useState(true)

    return (
      <div style={{ width: '450px', height: '300px' }}>
        <CustomButton
          onClick={() => setIsVisible(!isVisible)}
          styles={{ theme: 'sacred' }}
        >
          Toggle Zoom
        </CustomButton>
        <div style={{ marginTop: '20px', height: '200px' }}>
          <Zoom styles={{ in: isVisible, theme: 'sacred', timeout: 500 }}>
            <Paper styles={{ theme: 'sacred', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'sacred' }}>
                Sacred Theme Zoom
              </Typography>
              <Typography
                styles={{ variant: 'merriparagraph', theme: 'sacred' }}
              >
                Scale transition on a sacred surface.
              </Typography>
            </Paper>
          </Zoom>
        </div>
      </div>
    )
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// Story with a custom scale + transform origin
export const CustomScale: Story = {
  render: function CustomScaleStory() {
    const [isVisible, setIsVisible] = useState(true)

    return (
      <div style={{ width: '450px', height: '300px' }}>
        <CustomButton
          onClick={() => setIsVisible(!isVisible)}
          styles={{ theme: 'light' }}
        >
          Toggle Zoom
        </CustomButton>
        <div style={{ marginTop: '20px', height: '200px' }}>
          <Zoom
            styles={{
              in: isVisible,
              theme: 'light',
              timeout: 500,
              scaleEnter: 1,
              scaleExit: 0.4,
              transformOrigin: 'top left',
            }}
          >
            <Paper styles={{ theme: 'light', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'light' }}>
                Custom Scale
              </Typography>
              <Typography styles={{ variant: 'merriparagraph', theme: 'light' }}>
                Zooms from a 0.4 hidden scale anchored at the top-left.
              </Typography>
            </Paper>
          </Zoom>
        </div>
      </div>
    )
  },
}
